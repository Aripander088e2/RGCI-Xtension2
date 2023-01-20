function loop() {
	diff = Date.now() - date
	updateTemp()
	updateHTML()
	calc(diff/1000);
	date = Date.now();
}

var player = {}, date = Date.now(), diff = 0;
const MAIN = {
	level: {
		gain(realm = player.decel) {
			let x = E(tmp.tier.mult)
			if (realm == 0) {
				x = x.mul(upgEffect('grass',3))
				x = x.mul(upgEffect('perk',3))
				x = x.mul(upgEffect('pp',1))
				x = x.mul(upgEffect('crystal',1))
				x = x.mul(upgEffect('plat',1))
				x = x.mul(getAstralEff('xp'))
			}
			if (realm <= 1) x = x.mul(aMAIN.xpGain())
			if (realm == 2) x = x.div(1e5)

			if (player.grasshop >= 7) x = x.mul(2)
			x = x.mul(chalEff(1))
			x = x.mul(upgEffect('rocket',1))
			x = x.mul(upgEffect('rocket',10))
			x = x.mul(upgEffect('momentum',2))

			if (x.lt(1)) return x
			return x
		},
		req(i) {
			if (inDecel()) i /= tmp.chargeEff[3]||1
			let x = Decimal.pow(1.4,i).mul(20)

			return x.ceil()
		},
		bulk(i) {
			let x = i.div(20)
			if (x.lt(1)) return 0

			x = x.log(1.4).toNumber()
			if (inDecel()) x *= tmp.chargeEff[3]||1
			return Math.floor(x)+1
		},
		cur(i) {
			return i > 0 ? this.req(i-1) : E(0) 
		},
		perk() {
			let x = chalEff(3)
			if (player.grasshop >= 4) x += getGHEffect(3, 0)
			if (inChal(7)) x = 1

			return Math.floor(x * player.level)
		},
	},
	tier: {
		gain(realm = player.decel) {
			if (inChal(2)) return E(0)

			let x = E(1)
			if (realm == 0) {
				x = x.mul(upgEffect('pp',2))
				x = x.mul(upgEffect('pp',4))
				x = x.mul(upgEffect('crystal',2))
				x = x.mul(upgEffect('plat',4))
				x = x.mul(upgEffect('perk',7))
			}
			if (realm <= 1) x = x.mul(aMAIN.tpGain())
			if (realm == 2) x = x.div(1e3)

			if (player.grasshop >= 1) x = x.mul(2)
			x = x.mul(chalEff(2))
			x = x.mul(upgEffect('rocket',2))
			x = x.mul(upgEffect('momentum',3))
			x = x.mul(getAstralEff('tp'))

			return x
		},
		req(i) {
			let x = Decimal.pow(4,i).mul(300)
			return x
		},
		bulk(i) {
			let x = i.div(300)
			if (x.lt(1)) return 0
			x = x.log(4)
			return Math.floor(x.toNumber()+1)
		},
		cur(i) {
			return i > 0 ? this.req(i-1) : E(0) 
		},
		base() {
			let x = 2.25
			if (inAccel()) x = upgEffect('crystal',3)
			if (player.grasshop >= 5) x += 0.1
			x += tmp.chargeEff[4]||1
			if (inDecel()) x += tmp.chargeEff[10]||0
			return x
		},
		mult(i) {
			return Decimal.pow(MAIN.tier.base(), i)
		},
	},
	levelUp(realm) {
		let src = getRealmSrc()
		src.level = Math.max(src.level, tmp.level.bulk)
		src.tier = Math.max(src.tier, tmp.tier.bulk)
	}, 
}

el.update.main = _=>{
	let g = tmp.realmSrc.grass

	tmp.el.grassAmt.setHTML(g.format(0))
	tmp.el.grassGain.setHTML(tmp.autoCutUnlocked ? formatGain(g,tmp.grassGain.div(tmp.autocut).mul(tmp.autocutBonus).mul(tmp.autocutAmt)) : "")

	let level_unl = player.level || player.pTimes
	tmp.el.level.setDisplay(level_unl && !inSpace())
	if (level_unl) {
		tmp.el.level_top_bar.changeStyle("width",tmp.level.percent*100+"%")
		tmp.el.level_top_info.setHTML(`Level <b class="cyan">${format(tmp.realmSrc.level,0)}</b>`)
	}

	let tier_unl = player.pTimes > 0
	tmp.el.tier.setDisplay(tier_unl && !inSpace())
	if (tier_unl) {
		tmp.el.tier_top_bar.changeStyle("width",tmp.tier.percent*100+"%")
		tmp.el.tier_top_info.setHTML(`Tier <b class="yellow">${format(tmp.realmSrc.tier,0)}</b>`)
	}

	if (mapID == 'g') {
		tmp.el.level_amt.setTxt(format(tmp.realmSrc.level,0))
		tmp.el.level_progress.setTxt(tmp.level.progress.format(0)+" / "+tmp.level.next.sub(tmp.level.cur).format(0)+" XP")
		tmp.el.level_bar.changeStyle("width",tmp.level.percent*100+"%")
		tmp.el.level_cut.setTxt("+"+tmp.level.gain.format(1)+" XP/cut")

		tmp.el.tier_div.setDisplay(tier_unl)
		if (tier_unl) {
			tmp.el.tier_amt.setTxt(format(tmp.realmSrc.tier,0))
			tmp.el.tier_progress.setTxt(tmp.tier.progress.format(0)+" / "+tmp.tier.next.sub(tmp.tier.cur).format(0)+" TP")
			tmp.el.tier_bar.changeStyle("width",tmp.tier.percent*100+"%")
			tmp.el.tier_cut.setTxt("+"+tmp.tier.gain.format(1)+" TP/cut")
			tmp.el.tier_mult.setTxt(formatMult(tmp.tier.mult,0)+" → "+formatMult(MAIN.tier.mult(tmp.realmSrc.tier+1),0)+" multiplier")
		}
	}

	tmp.el.main_app.changeStyle('background-color',inSpace() ? "#fff1" : "#fff2")
	document.body.style.backgroundColor = inSpace() ? "#0A001E" : "#0052af"
}

tmp_update.push(_=>{
	tmp.grassCap = MAIN.grass.cap()
	tmp.grassSpawn = MAIN.grass.spawn()
	tmp.rangeCut = MAIN.grass.range()
	tmp.autocut = MAIN.grass.auto()

	tmp.autoCutUnlocked = hasUpgrade('auto',0)

	tmp.autocutBonus = upgEffect('auto',1)
	tmp.autocutAmt = 1+upgEffect('auto',2,0)
	tmp.spawnAmt = 1+upgEffect('perk',5,0)+upgEffect('crystal',5,0)

	tmp.grassGain = MAIN.grass.gain()

	tmp.perks = MAIN.level.perk()

	let lvl = tmp.realmSrc.level
	tmp.level.gain = MAIN.level.gain()
	tmp.level.next = MAIN.level.req(lvl)
	tmp.level.bulk = MAIN.level.bulk(tmp.realmSrc.xp)
	tmp.level.cur = MAIN.level.cur(lvl)
	tmp.level.progress = tmp.realmSrc.xp.sub(tmp.level.cur).max(0).min(tmp.level.next)
	tmp.level.percent = tmp.level.progress.div(tmp.level.next.sub(tmp.level.cur)).max(0).min(1).toNumber()

	let tier = tmp.realmSrc.tier
	tmp.tier.gain = MAIN.tier.gain()
	tmp.tier.next = MAIN.tier.req(tier)
	tmp.tier.bulk = MAIN.tier.bulk(tmp.realmSrc.tp)
	tmp.tier.cur = MAIN.tier.cur(tier)
	tmp.tier.progress = tmp.realmSrc.tp.sub(tmp.tier.cur).max(0).min(tmp.tier.next)
	tmp.tier.percent = tmp.tier.progress.div(tmp.tier.next.sub(tmp.tier.cur)).max(0).min(1).toNumber()
	tmp.tier.mult = MAIN.tier.mult(tier)

	tmp.platChance = 0.001
	if (player.grasshop >= 6) tmp.platChance *= 2
	if (!player.decel && hasGSMilestone(6)) tmp.platChance *= 2
	tmp.platChance += upgEffect('rocket',16,0)

	tmp.platGain = 1
	tmp.platGain += chalEff(5,0)
	if (player.grasshop >= 3) tmp.platGain += getGHEffect(2, 0)
	tmp.platGain += upgEffect('moonstone', 0)
	tmp.platGain *= upgEffect('dm', 2)
})

let shiftDown = false
window.addEventListener('keydown', function(event) {
	if (event.keyCode == 16) shiftDown = true;
	switch (event.key.toLowerCase()) {
		case "p":
			if (shiftDown) RESET.rocket_part.reset();
			else if (player.decel == 2) RESET.np.reset();
			else if (player.decel == 1) RESET.ap.reset();
			else RESET.pp.reset();
			break;
		case "c":
			if (inDecel()) RESET.oil.reset();
			else RESET.crystal.reset();
			break;
		case "g":
			if (shiftDown) RESET.gal.reset();
			else if (inDecel()) RESET.gs.reset();
			else RESET.gh.reset();
			break;
		case "s":
			if (shiftDown && player.decel) RESET.fun.reset();
			else if (shiftDown) RESET.steel.reset();
			break;
		case "f":
			ROCKET.create()
			break;
		case "t":
			if (shiftDown) RESET.recel.reset()
			else RESET.decel.reset()
			break;
		case "z":
			goToSpace()
			break;
	}
}, false);
window.addEventListener('keyup', function(event) {
	if (event.keyCode == 16) {
		shiftDown = false;
	}
}, false);