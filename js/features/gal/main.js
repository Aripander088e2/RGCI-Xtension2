MAIN.gal = {
	gain() {
		let r = E(10)

		r = r.mul(getChargeEff(11))

		r = r.mul(upgEffect('star', 0))
		r = r.mul(upgEffect('star', 1))
		r = r.mul(upgEffect('star', 2))
		r = r.mul(upgEffect('star', 3))

        if (hasGSMilestone(2)) r = r.mul(getGSEffect(2))
		r = r.mul(getAstralEff("st"))
		r = r.mul(upgEffect('moonstone', 3))
		r = r.mul(upgEffect('sfrgt', 1))
		r = r.mul(upgEffect('dm', 5))

		return r
	}
}

RESET.gal = {
	unl: _=>true,

	part_req: _=>ROCKET_PART.upgraded()?1:10,
	req: _=>player.rocket.part>=RESET.gal.part_req(),
	reqDesc: _=>`Get ${RESET.gal.part_req()} Rocket Parts to unlock.`,

	resetDesc: `Reset <b class="red">EVERYTHING prior</b> except Refinery and Chronology! Last chance before blast-off...`,
    resetGain: _=> galUnlocked() ? `<b>+${tmp.gal.star_gain.format(0)}</b> Stars<br><b class='red'>Max Star Accumulator first!</b>` : `<b class='cyan'>Also unlock Grass-Skips, Star Accumulator upgrade, and Astral!</b>`,

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
		if (!hasStarTree("qol", 11)) {
			for (var i = 0; i < 8; i++) player.chal.comp[i] = 0
			for (var i = 0; i < 8; i++) player.chal.max[i] = 0
		}
		player.grasshop = 0
		player.steel = E(0)
        player.sTime = 0
		if (!hasGSMilestone(9)) player.bestCharge = E(0)
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

		RESET.gh.doReset(order)
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

	data.star_gain = MAIN.gal.gain()

	data.ms = {}
	data.ms.chance = 1/200
	if (hasGSMilestone(5)) data.ms.chance *= player.gal.msLuck
	if (hasGSMilestone(6) && !player.decel) data.ms.chance /= 10
	if (hasGSMilestone(12)) data.ms.chance *= 2
	if (hasAGHMilestone(7)) data.ms.chance *= 2
	data.ms.gain = 1
	data.ms.gain += upgEffect('dm', 3)

	//updateChronoTemp()
	updateSCTemp()
})

function galTick(dt) {
	player.gal.time += dt
	player.gal.sacTime += dt
	player.gal.astral = Math.max(player.gal.astral, ASTRAL.bulk())

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
		updateEffectHTML('astral')
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

		r = r.mul(getChargeEff(7))
		r = r.mul(upgEffect('momentum', 12))
		if (hasStarTree("progress", 8)) r = r.mul(starTreeEff("progress", 8))
		if (hasStarTree("progress", 9)) r = r.mul(starTreeEff("progress", 9))
		r = r.mul(upgEffect('moonstone', 2))
        r = r.mul(getGSEffect(1))
		r = r.mul(upgEffect('sfrgt', 2))
		r = r.mul(upgEffect("unGrass", 3))

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
}

EFFECT.astral = {
	unl: _ => galUnlocked(),
	title: r => `Astral <b class="magenta">${format(r, 0)}</b>`,
	res: _ => player.gal.astral,
	effs: {
		tp: {
			unl: _ => true,
			eff: a => a+1,
			desc: x => `<b class="magenta">${format(x)}x</b> to TP`
		},
		fd: {
			unl: _ => true,
			eff: a => a/50+1,
			desc: x => `<b class="magenta">^${format(x)}</b> to Foundry effect`
		},
		st: {
			unl: _ => hasAGHMilestone(1),
			eff: a => E(2).pow(a/4),
			desc: x => `<b class="magenta">${format(x)}x</b> to Stars`
		},
		rf: {
			unl: _ => hasAGHMilestone(2),
			eff: a => a/20,
			desc: x => `<b class="magenta">+${format(x)}x</b> to Rocket Fuel`
		},
		ch: {
			unl: _ => hasAGHMilestone(3),
			eff: a => E(2).pow(a/3-3).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Charge`
		},
		xp: {
			unl: _ => hasAGHMilestone(4),
			eff: a => E(1.25).pow(a/2-5).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to XP`
		},
		fu: {
			unl: _ => hasAGHMilestone(5),
			eff: a => E(2).pow(a/2-10).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Fun`
		},
		sf: {
			unl: _ => hasAGHMilestone(6),
			eff: a => E(2).pow(a/2-10).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to SFRGT`
		},
		uh: {
			unl: _ => hasAGHMilestone(9),
			eff: a => Math.floor(Math.max(a/5-5,0)),
			desc: x => `<b class="magenta">+${format(x)}</b> to Unnatural Healing`
		},
		ap: {
			unl: _ => hasAGHMilestone(10),
			eff: a => 1+Math.min(Math.max(a-50,0)/200,.25),
			desc: x => `<b class="magenta">+${format(x)}</b> to AP per-25 multipliers`
		},
	},
}

function getAstralEff(id, def) {
	return getEffect("astral", id, def)
}

UPGS.moonstone = {
	title: "Moonstone Upgrades",

	underDesc: _=>getUpgResTitle('moonstone')+` (${formatPercent(tmp.gal.ms.chance)} platinum grow chance)`,

	ctn: [
		{
			max: 20,

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
			effDesc: x => format(x,0)+"x",
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
			effDesc: x => format(x,0)+"x",
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
			effDesc: x => format(x,0)+"x",
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
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => player.aRes.fTimes,
			max: 15,

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
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => player.aRes.fTimes,
			max: 5,

			costOnce: true,

			title: "Moon SFRGT",
			desc: `Boost SFRGT by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/SuperFun"],
			
			cost: i => 10,
			bulk: i => Math.floor(i/10),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => hasAGHMilestone(7),
			max: 5,

			costOnce: true,

			title: "Moon Foundry",
			desc: `Foundry lapses <b class="green">+1x</b> faster per level.`,

			res: "moonstone",
			icon: ["Icons/Foundry"],
			
			cost: i => 30,
			bulk: i => Math.floor(i/30),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => hasAGHMilestone(7),
			max: 5,

			costOnce: true,

			title: "Moon Dark Matters",
			desc: `Boost Dark Matter by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/DarkMatter"],
			
			cost: i => 100,
			bulk: i => Math.floor(i/100),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => hasAGHMilestone(7),
			max: 10,

			title: "Moon Platinum II",
			tier: 3,
			desc: `<b class="green">Double</b> Platinum per level.`,

			res: "moonstone",
			icon: ["Curr/Platinum"],
			
			cost: i => E(2).pow(i).mul(1e3),
			bulk: i => E(i).div(1e3).log(2).floor().toNumber()+1,

			effect(i) {
				return 2**i
			},
			effDesc: x => format(x,1)+"x",
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
			max: 25,

			title: "Launch Stars",
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