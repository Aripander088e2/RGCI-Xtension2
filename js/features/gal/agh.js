//ANTI-GRASSHOPS OR NEGATIVE ENERGY
function resetGHPotential() {
	player.gal.ghPotential = 0
	player.gal.gsPotential = 0
}

MAIN.agh_milestone = [
    {
        r: 3,
        desc: `<b class="green">Double</b> Space Power.`
    }, {
        r: 6,
        desc: `Astral boosts Stars.`,
    }, {
        r: 8,
        desc: `Astral boosts Rocket Fuel.`,
    }, {
        r: 12,
        desc: `Astral boosts Charge.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 15,
        desc: `Astral boosts XP.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 18,
        desc: `Astral boosts Fun.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 21,
        desc: `Unlock the Dark Matter Plant reset.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 24,
        desc: `Astral boosts SFRGT.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 27,
        desc: `Moonstone chance is doubled.`,
    }, {
        unl: _ => false,

        r: 30,
        desc: `Unlock the Recelerator upgrade in Fun Machine.`,
    }, {
        unl: _ => false,

        r: 33,
        desc: `Astral adds Tier multiplier base.`,
    }, {
        unl: _ => false,

        r: 36,
        desc: `Astral multiplies effects for each 25 levels of AP upgrade. (soon!)`,
    }, {
        unl: _ => false,

        r: 39,
        desc: `Astral multiplies effects for each 25 levels of Factory upgrade. (soon!)`,
    }
]

const AGH_MIL_LEN = MAIN.agh_milestone.length
function hasAGHMilestone(x,def=1) { return tmp.gal && player.gal.neg >= MAIN.agh_milestone[x].r }
function getAGHEffect(x,def=1) { return (tmp.gal && tmp.gal.agh.eff[x]) || def }
function updateAGHTemp() {
	let data = tmp.gal.agh || {}
	if (!tmp.gal.agh) tmp.gal.agh = data

	data.neg = 30 - player.grasshop + Math.floor(player.aRes.level / 10)
	data.eff = {}
    for (let x = 0; x < AGH_MIL_LEN; x++) {
        let m = MAIN.agh_milestone[x]
        if (m.effect) data.eff[x] = m.effect()
    }
}

el.setup.agh = _ => {
	let t = new Element("milestone_div_agh")
	let h = ""

	h += `<div id="gh_mil_ctns">
		<span style="font-size: 10px">
			Negative Energy: <b id="agh">0</b> (Best Completion: <b id="agh_best">0</b>)<br>
			(gain more by -1 Grasshop or +10 Best Anti-Realm Levels from 200)
		</span>
		<div class="milestone_ctns">`

	for (i in MAIN.agh_milestone) {
		let m = MAIN.agh_milestone[i]

		h += `
		<div id="agh_mil_ctn${i}_div">
			<h3>${m.r} Negative Energy</h3><br>
			${m.desc}
			${m.effDesc?`<br>Effect: <b class="cyan" id="agh_mil_ctn${i}_eff"></b>`:""}
		</div>
		`
	}

	h += `</div></div>`

	t.setHTML(h)
}

el.update.agh = _=>{
	if (mapID != 'at') return

	tmp.el.agh.setHTML(tmp.gal.agh.neg)
	tmp.el.agh_best.setHTML(format(player.gal.neg,0))

	for (let x = 0; x < AGH_MIL_LEN; x++) {
		let m = MAIN.agh_milestone[x]
		let unl = m.unl ? m.unl() : true
		let id = "agh_mil_ctn"+x

		tmp.el[id+"_div"].setDisplay(unl && (!player.options.hideMilestone || x+1 >= AGH_MIL_LEN || !hasAGHMilestone(x+1)))
		tmp.el[id+"_div"].setClasses({bought: hasAGHMilestone(x)})
		if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(getAGHEffect(x)))
	}
}