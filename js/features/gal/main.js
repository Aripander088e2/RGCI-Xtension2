MAIN.gal = {
	gain() {
		let r = E(10)

		r = r.mul(upgEffect('star', 0))
		r = r.mul(upgEffect('star', 1))
		r = r.mul(upgEffect('star', 2))
		r = r.mul(upgEffect('star', 3))

        if (hasGSMilestone(2)) r = r.mul(getGSEffect(2))
		r = r.mul(getASEff("st"))
		r = r.mul(upgEffect('moonstone', 3))

		return r
	},
}

RESET.gal = {
	unl: _=>true,
	req: _=>player.rocket.part==10,
	reqDesc: _=>`Get 10 Rocket Parts to unlock.`,

	resetDesc: `Galactic will reset <b class="red">EVERYTHING prior</b> except Rocket Fuel upgrades! Last chance before departure...`,
    resetGain: _=> galUnlocked() ? `Gain <b>${tmp.gal.star_gain.format(0)}</b> Stars` : `You'll also unlock <b>Chronology</b> and <b>Grass-Skips</b>.`,

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
		player.decel = false
		player.rocket = { total_fp: 0, amount: hasStarTree("qol", 9) ? player.rocket.amount : 0, part: 0, momentum: 0 }
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
	if (hasAGHMilestone(5)) data.ms.chance *= 2
	if (!player.decel && hasAGHMilestone(6)) data.ms.chance /= 10
	data.ms.gain = 1
	data.ms.gain += getASEff('ms', 0)

	updateChronoTemp()
	updateSCTemp()
})

function galTick(dt) {
	player.gal.time += dt
	if (player.gal.sp.gte(tmp.gal.astral.req)) {
		player.gal.astral = ASTRAL.bulk()
	}
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

		chrona: 0,
		ability: null,
		abilityCooldown: 0,

		stars: E(0),
		star_chart: {
			qol: [],
			auto: [],
			progress: [],
		}
	}
}

el.update.space = _=>{
	//Astral
	let astral_unl = galUnlocked()
	tmp.el.astral.setDisplay(astral_unl && inSpace())
	if (astral_unl) {
		tmp.el.astral_top_bar.changeStyle("width",tmp.gal.astral.progress*100+"%")
		tmp.el.astral_top_info.setHTML(`Astral <b class="magenta">${format(player.gal.astral,0)}</b> (${formatPercent(tmp.gal.astral.progress)})`)
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
}

//ASTRAL
//MOONSTONE
const ASTRAL = {
	spGain() {
		let r = E(1)

		r = r.mul(tmp.chargeEff[7] || 1)
		r = r.mul(upgEffect('moonstone', 2))
        r = r.mul(getGSEffect(1))
		r = r.mul(getAGHEffect(0))

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
		x.fd = a/20+1
		if (hasAGHMilestone(1)) x.st = 2**(a/4)
		if (hasAGHMilestone(2)) x.rf = a/20
		if (hasAGHMilestone(3)) x.ch = 2**(a/4-2)
		if (hasAGHMilestone(4)) x.tb = Math.sqrt(a)/20
		if (hasAGHMilestone(9)) x.fu = a/5+1
		if (hasAGHMilestone(10)) x.sf = E(2).pow(a)

		return x
	},
	effDesc(e) {
		let x = ''

		if (e.tp) x += `<b class="magenta">${format(e.tp)}x</b> to TP gain<br>`
		if (e.fd) x += `<b class="magenta">^${format(e.fd)}</b> to Foundry effect<br>`
		if (e.st) x += `<b class="magenta">${format(e.st,0)}x</b> to Star gain<br>`
		if (e.rf) x += `<b class="magenta">+${format(e.rf)}x</b> to Rocket Fuel gain<br>`
		if (e.ch) x += `<b class="magenta">${format(e.ch)}x</b> to Charge gain<br>`
		if (e.tb) x += `<b class="magenta">+${format(e.tb,3)}x</b> to Tier multiplier base<br>`
		if (e.fu) x += `<b class="magenta">${format(e.fu)}x</b> to Fun gain<br>`
		if (e.sf) x += `<b class="magenta">${format(e.sf,0)}x</b> to SFRGT gain<br>`

		return x
	},
}

function getASEff(id, def = 1) { return (tmp.gal && tmp.gal.astral.eff[id]) || def }

UPGS.moonstone = {
	title: "Moonstone Upgrades",

	underDesc: _=>`You have ${format(player.gal.moonstone,0)} Moonstone (${formatPercent(tmp.gal.ms.chance)} platinum grow chance)`,

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
				return i/2
			},
			effDesc: x => "+"+format(x,0),
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
			max: 10,

			costOnce: true,

			title: "Moon Power",
			desc: `Boost Space Power by <b class="green">+25%</b> per level.`,

			res: "moonstone",
			icon: ["Icons/SP"],
			
			cost: i => 50,
			bulk: i => Math.floor(i/50),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x)+"x",
		}, {
			max: 40,

			costOnce: true,

			title: "Moon Stars",
			desc: `Boost Stars by <b class="green">+25%</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Star"],
			
			cost: i => 50,
			bulk: i => Math.floor(i/50),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x)+"x",
		}, {
			unl: _ => false,
			max: 100,

			costOnce: true,

			title: "Moon Fun",
			desc: `Boost Fun by <b class="green">+100%</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Fun"],
			
			cost: i => 5,
			bulk: i => Math.floor(i/5),

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

			cost: i => 1.5**i,
			bulk: i => E(i).div(1e3).log(1.5).floor().toNumber() + 1,

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

			cost: i => E(10).pow(i).mul(1e30),
			bulk: i => E(i).div(1e30).log(10).floor().toNumber() + 1,

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

			cost: i => E(1.5).pow(i**0.8).mul(50),
			bulk: i => E(i).div(50).log(1.5).root(0.8).floor().toNumber() + 1,
		
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

//ANTI-GH MILESTONES
MAIN.agh_milestone = [
    {
        r: 1,
        desc: `Gain <b class="green">+1x</b> more SP per AGH Level.`,

		effect: _ => tmp.gal.agh.lvl + 1,
		effDesc: x => format(x, 1)+"x",
    }, {
        r: 2,
        desc: `Astral boosts Stars.`,
    }, {
        r: 3,
        desc: `Astral boosts Rocket Fuel.`,
    }, {
        r: 4,
        desc: `Astral boosts Charge.`,
    }, {
        r: 5,
        desc: `Astral adds Tier bonus.`,
    }, {
        r: 6,
        desc: `Moonstone chance is doubled.`,
    }, {
        r: 7,
        desc: `Every 25 levels of AP upgrade, gain a multiplier based on AGH Level. (starting at 7)`,
		effect: _ => E(1.05).pow(tmp.gal.agh.lvl-6).max(1).min(1.25),
		effDesc: x => format(x) + "x per 25 levels",
    }, {
        unl: _ => false,

        r: 8,
        desc: `???`,
    }, {
        unl: _ => false,

        r: 9,
        desc: `Astral boosts Fun.`,
    }, {
        unl: _ => false,

        r: 10,
        desc: `Astral boosts SFRGT.`,
    }, {
        unl: _ => false,

        r: 11,
        desc: `Unlock the Dark Matter Plant reset.`,
    }, {
        unl: _ => false,

        r: 12,
        desc: `Unlock the Recelerator upgrade in Fun Machine.`,
    }
]

const AGH_MIL_LEN = MAIN.agh_milestone.length
function hasAGHMilestone(x,def=1) { return tmp.gal && tmp.gal.agh.lvl >= MAIN.agh_milestone[x].r }
function getAGHEffect(x,def=1) { return (tmp.gal && tmp.gal.agh.eff[x]) || def }
function updateAGHTemp() {
	let data = tmp.gal.agh || {}
	if (!tmp.gal.agh) tmp.gal.agh = data

	data.lvl = chalEff(8, 0) + chalEff(9, 0)
	data.eff = {}
    for (let x = 0; x < AGH_MIL_LEN; x++) {
        let m = MAIN.agh_milestone[x]
        if (m.effect) data.eff[x] = m.effect()
    }
}

el.setup.agh = _ => {
	let t = new Element("milestone_div_agh")
	let h = ""

	h += `<div id="gh_mil_ctns">Anti-Grasshop Level: <b id="agh">0</b><div class="milestone_ctns">`

	for (i in MAIN.agh_milestone) {
		let m = MAIN.agh_milestone[i]

		h += `
		<div id="agh_mil_ctn${i}_div">
			<h3>AGH Level ${m.r}</h3><br>
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

	tmp.el.agh.setHTML(format(tmp.gal.agh.lvl,0))

	for (let x = 0; x < AGH_MIL_LEN; x++) {
		let m = MAIN.agh_milestone[x]
		let unl = m.unl ? m.unl() : true
		let id = "agh_mil_ctn"+x

		tmp.el[id+"_div"].setDisplay(unl && (!player.options.hideMilestone || x+1 >= AGH_MIL_LEN || !hasAGHMilestone(x+1)))
		tmp.el[id+"_div"].setClasses({bought: hasAGHMilestone(x)})
		if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(getAGHEffect(x)))
	}
}