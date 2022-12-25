MAIN.gal = {
	gain() {
		let r = E(10)

		r = r.mul(tmp.chargeEff[11] || 1)

		r = r.mul(upgEffect('star', 0))
		r = r.mul(upgEffect('star', 1))
		r = r.mul(upgEffect('star', 2))
		r = r.mul(upgEffect('star', 3))

        if (hasGSMilestone(2)) r = r.mul(getGSEffect(2))
		r = r.mul(getAstralEff("st"))
		r = r.mul(upgEffect('moonstone', 3))
		r = r.mul(upgEffect('sfrgt', 1))
		if (hasStarTree("progress", 8) && player.grasshop >= 50) r = r.mul(E(1.2).pow(player.grasshop - 49))
		if (hasStarTree("progress", 9) && player.tier >= 50) r = r.mul(E(1.2).pow(player.tier - 49))

		return r
	},
}

RESET.gal = {
	unl: _=>true,
	req: _=>player.rocket.part==10||ROCKET_PART.upgraded(),
	reqDesc: _=>`Get 10 Rocket Parts to unlock.`,

	resetDesc: `Galactic will reset <b class="red">EVERYTHING prior</b> except Rocket Fuel upgrades! Last chance before departure...`,
    resetGain: _=> galUnlocked() ? `<b>+${tmp.gal.star_gain.format(0)}</b> Stars` : `You'll also unlock <b>Grass-Skips</b>.`,

	title: `Galactic`,
	resetBtn: `Galactic!`,
	hotkey: `Shift+G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return

			if (!player.gal) player.gal = setupGal()
			player.gal.stars = player.gal.stars.add(galUnlocked() ? tmp.gal.star_gain : MAIN.gal.gain())
			player.gal.times++

			mapPos.earth = [1, 1]
			if (!inSpace()) goToSpace()
		}
		this.doReset()
	},

	doReset(order="gal") {
		player.gal.time = 0

		player.plat = 0
		for (var i = 0; i < 8; i++) player.chal.comp[i] = 0
		for (var i = 0; i < 8; i++) player.chal.max[i] = 0
		player.grasshop = 0
		player.steel = E(0)
		player.bestCharge = E(0)
		if (!inRecel()) player.decel = 0
		player.rocket = { total_fp: 0, amount: hasStarTree("qol", 9) ? player.rocket.amount : 0, part: 0, momentum: ROCKET_PART.upgraded() ? player.rocket.momentum : 0 }
		resetAntiRealm()

		if (!hasStarTree("qol", 0)) resetUpgrades("auto")
		if (!hasStarTree("qol", 1)) resetUpgrades("aAuto")
		resetUpgrades("plat")
		resetUpgrades("factory")
		resetUpgrades("foundry")
		resetUpgrades("gen")
		if (!hasStarTree("qol", 6)) resetUpgrades("assembler")
		resetUpgrades("momentum")
		resetUpgrades("star")
		resetGHPotential()

		RESET.steel.doReset(order)
	},
}

tmp_update.push(_=>{
	if (!galUnlocked()) return

	let data = tmp.gal || {}
	if (!tmp.gal) tmp.gal = data

	updateAGHTemp()

	data.astral = {}
	data.astral.gain = ASTRAL.spGain()
	data.astral.prevReq = ASTRAL.req(player.gal.astral - 1)
	data.astral.req = ASTRAL.req(player.gal.astral)
	data.astral.curReq = E(data.astral.req).sub(data.astral.prevReq)
	data.astral.progress = player.gal.sp.sub(tmp.gal.astral.prevReq).div(data.astral.curReq).max(0).min(1).toNumber()
	data.astral.eff = ASTRAL.eff(player.gal.astral)

	data.star_gain = MAIN.gal.gain()

	data.ms = {}
	data.ms.chance = 1/200
	if (hasGSMilestone(5)) data.ms.chance *= player.gal.msLuck
	if (hasGSMilestone(6) && !player.decel) data.ms.chance /= 10
	if (hasGSMilestone(9)) data.ms.chance *= 2
	if (hasAGHMilestone(7)) data.ms.chance *= 2
	data.ms.gain = 1
	data.ms.gain *= upgEffect('dm', 3)

	//updateChronoTemp()
	updateSCTemp()
})

function galTick(dt) {
	player.gal.time += dt
	player.gal.sacTime += dt
	if (player.gal.sp.gte(tmp.gal.astral.req)) player.gal.astral = ASTRAL.bulk()

	player.gal.ghPotential = Math.max(player.gal.ghPotential, MAIN.gh.bulk())
	player.gal.gsPotential = Math.max(player.gal.gsPotential, aMAIN.gs.bulk())
	if (player.rocket.part == 10) player.gal.neg = Math.max(player.gal.neg, tmp.gal.agh.neg)

	if (player.ghAuto && player.grasshop < player.gal.ghPotential) player.grasshop = player.gal.ghPotential
	if (player.gsAuto && player.aRes.grassskip < player.gal.gsPotential) player.aRes.grassskip = player.gal.gsPotential
}

function galUnlocked() {
	return player.gal?.times > 0
}

function setupGal() {
	return {
		time: 0,
		times: 0,

		astral: 0,
		sp: E(0),
		moonstone: 0,
		msLuck: 1,

		ghPotential: 0,
		gsPotential: 0,
		neg: 0,

		/*chrona: 0,
		ability: null,
		abilityCooldown: 0,*/

		stars: E(0),
		star_chart: {
			qol: [],
			auto: [],
			progress: [],
		},

		dm: E(0),
		sacTime: 0,
		sacTimes: 0,
	}
}

el.update.space = _=>{
	//Astral
	let astral_unl = galUnlocked()
	tmp.el.astral.setDisplay(astral_unl && inSpace())
	if (astral_unl) {
		tmp.el.astral_top_bar.changeStyle("width",tmp.gal.astral.progress*100+"%")
		tmp.el.astral_top_info.setHTML(`Astral <b class="magenta">${format(player.gal.astral,0)}</b>`)
	}
	if (mapID == 'g') {
		tmp.el.astral_div.setDisplay(astral_unl)
		if (astral_unl) {
			tmp.el.astral_amt.setTxt(format(player.gal.astral,0))
			tmp.el.astral_progress.setTxt(player.gal.sp.sub(tmp.gal.astral.prevReq).max(0).format(0)+" / "+tmp.gal.astral.curReq.format(0)+" SP")
			tmp.el.astral_bar.changeStyle("width",tmp.gal.astral.progress*100+"%")
			tmp.el.astral_cut.setTxt("+"+tmp.gal.astral.gain.format(1)+" SP/cut")
		}
	}
	if (mapID == 'at') {
		tmp.el.astral2.setTxt(format(player.gal.astral,0))
		tmp.el.astral_eff.setHTML(ASTRAL.effDesc(tmp.gal.astral.eff))
	}

	//Others
	if (mapID == 'sc') {
		updateStarChart()
	}
	if (mapID == 'gal') {
		tmp.el.to_space_div.setDisplay(galUnlocked() && !inSpace())
		tmp.el.to_ground_div.setDisplay(galUnlocked() && inSpace())
		updateUpgradesHTML('star')
	}
	if (mapID == 'at') {
		updateUpgradesHTML('moonstone')
	}
	if (mapID == 'sac') {
        updateResetHTML('sac')
		updateUpgradesHTML('dm')
        updateResetHTML('planetoid')
	}
}

//ASTRAL
//MOONSTONE
const ASTRAL = {
	spGain() {
		let r = E(1)

		r = r.mul(tmp.chargeEff[7] || 1)
		r = r.mul(upgEffect('moonstone', 2))
        r = r.mul(getGSEffect(1))
		r = r.mul(2)
		r = r.mul(upgEffect('sfrgt', 2))

		return r
	},

	req(lvl) {
		if (!galUnlocked()) return EINF
		if (lvl < 0) return 0
		return E(2).pow(lvl ?? player.gal.astral).mul(1e3)
	},
	bulk() {
		if (!galUnlocked()) return 0
		if (player.gal.sp.lt(1e3)) return 0
		return player.gal.sp.div(1e3).log(2).floor().toNumber() + 1
	},

	eff() {
		let a = player.gal.astral
		let x = {}

		x.tp = a+1
		x.fd = a/50+1
		if (hasAGHMilestone(1)) x.st = E(2).pow(a/4)
		if (hasAGHMilestone(2)) x.rf = a/20
		if (hasAGHMilestone(3)) x.ch = E(2).pow(a/4-2).max(1)
		if (hasAGHMilestone(4)) x.xp = E(1.3).pow(a-10).max(1)
		if (hasAGHMilestone(5)) x.fu = E(2).pow(a/2-10).max(1)
		if (hasAGHMilestone(6)) x.sf = E(2).pow(a/5-4).max(1)
		if (hasAGHMilestone(9)) x.tb = Math.max(a/50-1,0)
		if (hasAGHMilestone(10)) x.uh = Math.max(a-50,0)
		if (hasAGHMilestone(11)) x.ap = Math.min(Math.max(0.7+a/200,1),1.25)
		if (hasAGHMilestone(12)) x.fc = Math.min(Math.max(0.7+a/200,1),1.15)

		return x
	},
	effDesc(e) {
		let x = ''

		if (e.tp) x += `<b class="magenta">${format(e.tp)}x</b> to TP gain<br>`
		if (e.fd) x += `<b class="magenta">^${format(e.fd)}</b> to Foundry effect<br>`
		if (e.st) x += `<b class="magenta">${format(e.st,0)}x</b> to Star gain<br>`
		if (e.rf) x += `<b class="magenta">+${format(e.rf)}x</b> to Rocket Fuel gain<br>`
		if (e.ch) x += `<b class="magenta">${format(e.ch)}x</b> to Charge gain<br>`
		if (e.xp) x += `<b class="magenta">${format(e.xp)}x</b> to XP gain (in Normal Realm)<br>`
		if (e.xp) x += `<b class="magenta">${format(e.xp.root(1.5))}x</b> to XP gain (in Anti-Realm)<br>`
		if (e.fu) x += `<b class="magenta">${format(e.fu)}x</b> to Fun gain<br>`
		if (e.sf) x += `<b class="magenta">${format(e.sf,0)}x</b> to SFRGT gain<br>`
		if (e.tb) x += `<b class="magenta">+${format(e.tb,3)}x</b> to Tier multiplier base<br>`
		if (e.uh) x += `<b class="magenta">+${format(e.uh,0)}x</b> to Unnatural Healing<br>`
		if (e.ap) x += `<b class="magenta">${format(e.ap,3)}x</b> to some bonuses for each 25 AP upgrades<br>`
		if (e.fc) x += `<b class="magenta">${format(e.fc,3)}x</b> to charge bonuses for each 25 Factory upgrades<br>`

		return x
	},
}

function getAstralEff(id, def = 1) { return (tmp.gal && tmp.gal.astral.eff[id]) || def }

UPGS.moonstone = {
	title: "Moonstone Upgrades",

	underDesc: _=>getUpgResTitle('moonstone')+` (${formatPercent(tmp.gal.ms.chance)} platinum grow chance)`,

	ctn: [
		{
			max: Infinity,

			costOnce: true,

			title: "Moon Platinum",
			desc: `Increase Platinum gain by <b class="green">+1</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Platinum"],
			
			cost: i => 2,
			bulk: i => i/2,

			effect(i) {
				return i
			},
			effDesc: x => "+"+format(x),
		}, {
			max: 10,

			costOnce: true,

			title: "Moon Fuel",
			desc: `Boost Rocket Fuel by <b class="green">+0.5x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/RocketFuel"],
			
			cost: i => 10,
			bulk: i => Math.floor(i/10),

			effect(i) {
				return i/2
			},
			effDesc: x => "+"+format(x)+"x",
		}, {
			max: 4,

			costOnce: true,

			title: "Moon Power",
			desc: `Boost Space Power by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Icons/SP"],
			
			cost: i => 5,
			bulk: i => Math.floor(i/5),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x)+"x",
		}, {
			max: 4,

			costOnce: true,

			title: "Moon Stars",
			desc: `Boost Stars by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Star"],
			
			cost: i => 7,
			bulk: i => Math.floor(i/7),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x)+"x",
		}, {
			unl: _ => player.aRes.fTimes,
			max: 5,

			costOnce: true,

			title: "Moon Fun",
			desc: `Boost Fun by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Fun"],
			
			cost: i => 5,
			bulk: i => Math.floor(i/5),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x)+"x",
		}, {
			unl: _ => player.aRes.fTimes,
			max: 5,

			costOnce: true,

			title: "Moon SFRGT",
			desc: `Boost SFRGT by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/SuperFun"],
			
			cost: i => 5,
			bulk: i => Math.floor(i/5),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x)+"x",
		}, {
			unl: _ => hasAGHMilestone(7),
			max: 5,

			costOnce: true,

			title: "Moon Steel",
			desc: `Boost Steel by <b class="green">+100%</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Steel"],
			
			cost: i => 15,
			bulk: i => Math.floor(i/15),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x)+"x",
		}
	],
}

//STAR ACCUMULATOR
UPGS.star = {
    title: "Star Accumulator",

    unl: _=>hasUpgrade("factory", 7),
    autoUnl: _=>hasStarTree('auto', 4),

	ctn: [
		{
			max: Infinity,

			title: "Shiny Stars",
			desc: `Increase star gain by <b class="green">20%</b> compounding per level.`,
		
			res: "plat",
			icon: ["Curr/Star"],

			cost: i => 1.5**i*300,
			bulk: i => E(i).div(300).log(1.5).floor().toNumber() + 1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Industrial Stars",
			desc: `Increase star gain by <b class="green">20%</b> compounding per level.`,
		
			res: "steel",
			icon: ["Curr/Star"],

			cost: i => E(5).pow(i).mul(1e35),
			bulk: i => E(i).div(1e35).log(5).floor().toNumber() + 1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Thruster Stars",
			desc: `Increase star gain by <b class="green">20%</b> compounding per level.`,

			res: "rf",
			icon: ["Curr/Star"],

			cost: i => E(2).pow(i**0.8).mul(200),
			bulk: i => E(i).div(200).log(2).root(0.8).floor().toNumber() + 1,
		
			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Accumulated Stars",
			desc: `Increase star gain by <b class="green">20%</b> compounding per level.`,
		
			res: "moonstone",
			icon: ["Curr/Star"],

			cost: i => 1.5**i,
			bulk: i => E(i).log(1.5).floor().toNumber() + 1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		}
	],
}