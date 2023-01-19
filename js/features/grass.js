MAIN.grass = {
	gain(realm = player.decel) {
		let x = upgEffect('grass',0).mul(tmp.tier.mult)
		if (realm == 0) {
			x = x.mul(upgEffect('perk',0))
			x = x.mul(upgEffect('pp',0))
			x = x.mul(upgEffect('crystal',0))
			x = x.mul(upgEffect('plat',2))
		}
		if (realm <= 1) x = x.mul(aMAIN.grassGain())
		if (realm == 2) x = x.div(1e6)

		x = x.mul(chalEff(0))
		x = x.mul(tmp.chargeEff[9]||1)
		x = x.mul(upgEffect('rocket',0))
		x = x.mul(upgEffect('rocket',17))
		x = x.mul(upgEffect('momentum',0))

		return x
	},
	cap() {
		let x = 10
		if (inAccel()) x += upgEffect('grass',1,0)+upgEffect('perk',1,0)
		if (!inRecel()) x += upgEffect('ap',4,0)
		if (inRecel()) x = 250
		if (player.options.lowGrass) x = Math.min(x, 250)

		return x
	},
	spawn() {
		let x = 2
		if (inAccel()) {
			x /= upgEffect('grass',2,1)
			x /= upgEffect('perk',2,1)
		}
		if (inDecel()) x /= upgEffect('aGrass',1,1)
		x /= upgEffect('momentum',1)
		if (hasUpgrade('rocket',16)) x = 1 / (1 / x + upgEffect('rocket', 16))
		if (inRecel()) x = 1/10
		return x
	},
	range: _=>70+upgEffect('grass',4,0)+upgEffect('perk',4,0)+upgEffect('aGrass',6,0)+upgEffect("unGrass",2,0),
	auto() {
		let interval = upgEffect('auto',0,0)/upgEffect('plat',0,0)
		interval /= starTreeEff("auto",7)
		if (inDecel()) interval *= 10 / upgEffect('aAuto', 0)
		if (inRecel()) interval = 0.1
		return interval
	},
}

const G_SIZE = 15
const G_RANGE = 50

var mouse_pos = {x:0,y:0}
var range_pos = {x:0,y:0}
var mouse_in = false

function createGrass() {
    if (tmp.grasses.length < tmp.grassCap) {
		let rng = Math.random()

        let nt = hasGSMilestone(5) && rng < 0.1
        let pl = (player.tier >= 2 || player.cTimes > 0) && Math.random() < tmp.platChance
        let ms = pl && galUnlocked() && Math.random() < tmp.gal.ms.chance

        tmp.grasses.push({
            x: Math.random(),
            y: Math.random(),

            tier: player.tier,
            nt: nt,

            pl: pl,
            ms: ms
        })
    }
}

function removeGrass(i,auto=false) {
	let tg = tmp.grasses[i]
	if (!tg) return

	let v = 1
	if (tg.habit) v *= tg.habit

	let av = v
	if (auto) av *= tmp.autocutBonus

	let tv = v
	if (tg.nt) tv = MAIN.tier.base()

	let src = getRealmSrc()
	src.grass = src.grass.add(tmp.grassGain.mul(tv))
	src.xp = src.xp.add(tmp.level.gain.mul(tv))
	if (player.pTimes > 0) src.tp = src.tp.add(tmp.tier.gain.mul(v))
	if (galUnlocked()) player.gal.sp = player.gal.sp.add(tmp.gal.astral.gain.mul(v))
	if (tg.pl) player.plat += tmp.platGain * (player.aRes.grassskip > 0 ? av : v)
	if (tg.ms) player.gal.moonstone += tmp.gal.ms.gain * v

	if (hasGSMilestone(4)) {
		if (tg.ms) player.gal.msLuck = 1
		else if (tg.pl) player.gal.msLuck += 0.05
		else player.gal.msLuck += 0.0001
	}

	tmp.grasses.splice(i, 1)
}

el.update.grassCanvas = _=>{
    if (mapID == 'g') {
        if (grass_canvas.width == 0 || grass_canvas.height == 0) resizeCanvas()
        drawGrass()

        tmp.el.grass_cap.setHTML(`${format(tmp.grasses.length,0)} / ${format(tmp.grassCap,0)}`)
        tmp.el.habit.setHTML(tmp.habit ? "(x"+format(tmp.habitMax,1)+")" : '')
    }
}

function resetGlasses() {
    tmp.grasses = []
    tmp.spawn_time = 0
}

function drawGrass() {
	if (!retrieveCanvasData()) return;
	grass_ctx.clearRect(0, 0, grass_canvas.width, grass_canvas.height);
    let gs = tmp.grasses

    if (mouse_in) {
        grass_ctx.fillStyle = "#34AF7C77"

        grass_ctx.fillRect(range_pos.x,range_pos.y,tmp.rangeCut,tmp.rangeCut)
    }

    grass_ctx.strokeStyle = "#0003"

    for (let i = 0; i < gs.length; i++) {
        let g = gs[i]

        if (g) {
            let prog = 0
            grass_ctx.fillStyle = g.habit?hueBright(90,1-unMAIN.habit.progress(g)):g.ms?'#008DFF':g.pl?"#DDD":grassColor(g.tier+(g.nt?1:0))

            let [x,y] = [Math.min(grass_canvas.width*g.x,grass_canvas.width-G_SIZE),Math.min(grass_canvas.height*g.y,grass_canvas.height-G_SIZE)]

            if (mouse_in) {
                if (range_pos.x < x + G_SIZE &&
                    range_pos.x + tmp.rangeCut > x &&
                    range_pos.y < y + G_SIZE &&
                    tmp.rangeCut + range_pos.y > y) {
                        if (tmp.habit) {
							if (!g.habit) g.habit = 1
                        } else {
							removeGrass(i)
							i--
						}
        
                        continue
                    }
            }

            grass_ctx.fillRect(x,y,G_SIZE,G_SIZE)
            grass_ctx.strokeRect(x,y,G_SIZE,G_SIZE)
        }
    }
}

function grassCanvas() {
    if (!retrieveCanvasData()) return
    if (grass_canvas && grass_ctx) {
        window.addEventListener("resize", resizeCanvas)

        grass_canvas.width = grass_canvas.clientWidth
        grass_canvas.height = grass_canvas.clientHeight

        grass_canvas.addEventListener('mousemove', (event)=>{
            mouse_in = true
            mouse_pos.x = event.pageX - grass_rect.left
            mouse_pos.y = event.pageY - grass_rect.top

            range_pos.x = mouse_pos.x - tmp.rangeCut/2
            range_pos.y = mouse_pos.y - tmp.rangeCut/2
        })

        grass_canvas.addEventListener('mouseout', (event)=>{
            mouse_in = false
        })
    }
}

const BASE_COLORS = ["#00AF00", "#7FBF7F", "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#7F00FF", "#FF00FF"]
function grassColor(tier = 1) {
	if (tier >= BASE_COLORS.length) return hueBright((tier * 40) % 360, 0.25 + 0.5 * Math.sin(tier / 100))
	return BASE_COLORS[tier]
}

function hueBright(hue, brightness) {
	let rgb

	if (hue > 300) rgb = [1, 0, (360 - hue) / 60]
	else if (hue > 240) rgb = [(hue - 240) / 60, 0, 1]
	else if (hue > 180) rgb = [0, (240 - hue) / 60, 1]
	else if (hue > 120) rgb = [0, 1, (hue - 120) / 60]
	else if (hue > 60) rgb = [(120 - hue) / 60, 1, 0]
	else rgb = [1, hue / 60, 0]
	rgb = [
		Math.round(255 * (brightness + rgb[0] * (1 - brightness))),
		Math.round(255 * (brightness + rgb[1] * (1 - brightness))),
		Math.round(255 * (brightness + rgb[2] * (1 - brightness)))
	]

	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

function toggleLowGrass() {
	if (!player.options.lowGrass && !confirm("This option is for you if you have lag issues on Grass Field. On enabling, your grass amount is capped at 250. Are you sure?")) return
	player.options.lowGrass = !player.options.lowGrass
}