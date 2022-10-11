MAIN.gal = {
	gain() {
		let x = 10

		/*if (player.grassskip>0) x += getGSEffect(0,0)

		x = Decimal.pow(1.5,Math.max(player.rocket.part-10,0)).mul(x)

		x = x.mul(upgEffect('moonstone',4))

		if (player.lowGH <= 24) x = x.mul(getAGHEffect(3))

		return x.floor()*/
	},
}

RESET.gal = {
	unl: _=>true,
	req: _=>player.rocket.part==10,
	reqDesc: _=>`Get 10 Rocket Parts to unlock.`,

	resetDesc: `Galactic will reset <b class="red">EVERYTHING prior</b> except Rocket Fuel upgrades! Last chance before departure...`,
	resetGain: _=> `Coming soon!`,

	title: `Galactic`,
	resetBtn: `Soon!`,
	//hotkey: `Shift+G`,

	reset(force=false) {
		if (!force) return
		if (this.req() || force) {
			if (!force) {
				if (!player.gal) player.gal = setupGal()
				player.gal.times++

				mapPos.earth = [3, 3]
				goToSpace()
			}

			this.doReset()
		}
	},

	doReset(order="gal") {
		player.gal.time = 0

		player.plat = 0
		player.chal.comp = []
		player.chal.max = []
		player.grasshop = 0
		player.steel = E(0)
		player.bestCharge = E(0)
		player.decel = false
		player.rocket = { total_fp: 0, amount: 0, part: 0, momentum: 0 }
		resetAntiRealm()

		resetUpgrades("auto")
		resetUpgrades("plat")
		resetUpgrades("factory")
		resetUpgrades("foundry")
		resetUpgrades("gen")
		resetUpgrades("assembler")
		resetUpgrades("momentum")

		RESET.steel.doReset(order)
	},
}

tmp_update.push(_=>{
	let data = {}
	tmp.gal = data

	if (!galUnlocked()) return
})

function galTick(dt) {
	player.gal.time += dt
}

function galUnlocked() {
	return player.gal?.times > 0
}

function setupGal() {
	return {
		time: 0,
		times: 0
	}
}

el.update.space = _=>{
	if (mapID == 'sc') {
		updateStarChart()
		if (tree_canvas.width == 0 || tree_canvas.height == 0) resizeCanvas2()
		drawTree()
	}
	if (mapID == 'at') {
		tmp.el.astral2.setTxt(format(player.astral,0))
		tmp.el.astral_eff.setHTML(ASTRAL.effDesc(tmp.astral_eff))
	}
}

//ASTRAL
//MOONSTONE
const ASTRAL = {
	eff() {
		let a = player.astral
		let x = {}

		x.pp = a/100
		x.crystal = a/25
		x.plat = a+1
		x.steel = 1.1**a*a+1

		return x
	},
	effDesc(e) {
		let x = `
		Increase PP base from level from <b class="green">1.1</b> to <b class="green">${format(1.1+e.pp,2)}</b><br>
		Increase Crystal base from tier from <b class="green">1.1</b> to <b class="green">${format(1.1+e.crystal,2)}</b><br>
		Increase Platinum gain by <b class="green">${formatMult(e.plat,0)}</b><br>
		Increase Steel gain by <b class="green">${formatMult(e.steel,1)}</b><br>
		`

		return x
	},
}

function getASEff(id,def=1) { return tmp.astral_eff[id]||def }

UPGS.moonstone = {
	title: "Moonstone Upgrades",

	underDesc: _=>`You have ${format(player.moonstone,0)} Moonstone (${formatPercent(0.005)} platinum grow chance)`,

	ctn: [
		{
			max: 100,

			costOnce: true,

			title: "Moon Grass",
			desc: `Increase grass gain by <b class="green">+50%</b> per level.`,

			res: "moonstone",
			icon: ['Curr/Grass'],
			
			cost: i => 3,
			bulk: i => Math.floor(i/3),

			effect(i) {
				let x = i/2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 100,

			costOnce: true,

			title: "Moon XP",
			desc: `Increase XP gain by <b class="green">+50%</b> per level.`,

			res: "moonstone",
			icon: ['Icons/XP'],
			
			cost: i => 3,
			bulk: i => Math.floor(i/3),

			effect(i) {
				let x = i/2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 100,

			costOnce: true,

			title: "Moon TP",
			desc: `Increase TP gain by <b class="green">+50%</b> per level.`,

			res: "moonstone",
			icon: ['Icons/TP'],
			
			cost: i => 3,
			bulk: i => Math.floor(i/3),

			effect(i) {
				let x = i/2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 100,

			costOnce: true,

			title: "Moon Platinum",
			desc: `Increase platinum gain by <b class="green">+25%</b> per level.`,

			res: "moonstone",
			icon: ['Curr/Platinum'],
			
			cost: i => 10,
			bulk: i => Math.floor(i/10),

			effect(i) {
				let x = i/4+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 100,

			costOnce: true,

			title: "Moon Star",
			desc: `Increase stars gain by <b class="green">+10%</b> per level.`,

			res: "moonstone",
			icon: ['Curr/Star'],
			
			cost: i => 50,
			bulk: i => Math.floor(i/50),

			effect(i) {
				let x = i/10+1

				return x
			},
			effDesc: x => format(x)+"x",
		},
	],
}