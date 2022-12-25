function inRecel() {
	return player.decel >= 2
}

function setupRecel() {
	return {
		grass: E(0),
		bestGrass: E(0),

		level: 0,
		xp: E(0),

		tier: 0,
		tp: E(0),

		np: E(0),
		nTimes: 0,
		nTime: 0,
	}
}

let unMAIN = {}

RESET.recel = {
	unl: _=>MAIN.sac.did(),

	req: _=>hasUpgrade("funMachine", 3),
	reqDesc: _=>"Get 33 Negative Energy and a new Upgrade in SFRGT.",

	resetDesc: `Nullify boosts that Funify resets until you Accelerate.`,
	resetGain: _=> `This will force a Steelie.`,

	title: `Recelerator`,
	resetBtn: `Recelerate`,
	hotkey: `Shift+T`,

	reset(force=false) {
		if (hasUpgrade("funMachine", 3)) {
            if (player.decel == 2) player.decel = 0
            else player.decel = 2
			RESET.steel.doReset(true)
		}
	},
}

el.update.recel = _=>{
	if (mapID == "dc") tmp.el.reset_btn_recel.setTxt(player.decel >= 2 ? "Accelerate" : "Recelerate")
}

UPGS.unGrass = {
	unl: _=> player.decel == 2,

	title: "Unnatural Upgrades",

	autoUnl: _=>false,

	noSpend: _=>false,

	ctn: [
		{
			max: Infinity,

			title: "Habitability",
			desc: `Touching protecting cutting. Give a time boost to them which is automatically cutted later. Left-click to cut immediately!`,

			res: "unGrass",
			icon: ['Icons/Compaction'],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,1)+"x maximum",
		}, {
			max: Infinity,

			title: "Unnatural, Again?",
			desc: `Increase Space Power gain by <b class="green">20%</b> compounding.`,

			res: "unGrass",
			icon: ['Icons/SP'],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x,1)+"x",
		}, {
			max: Infinity,

			title: "Ranged Out",
			desc: `Increase range by <b class="green">+10</b>.`,

			res: "unGrass",
			icon: ['Icons/Range'],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x,1)+"x",
		}, {
			max: 1,

			title: "Glided Experience",
			desc: `<b class="green">Double</b> Space Power gain.`,

			res: "unGrass",
			icon: ['Icons/SP', 'Icons/Plus'],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x,1)+"x",
		}, {
			max: 1,

			title: "Glided Fun",
			desc: `<b class="green">Double</b> fun gain.`,

			res: "unGrass",
			icon: ['Curr/Fun', 'Icons/Plus'],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x,1)+"x",
		},
		/*{
			max: 1000,

			title: "Unnatural Grow Speed",
			desc: `Increase grass grow speed by <b class="green">+40%</b> per level.`,

			res: "unGrass",
			icon: ['Icons/Speed'],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				let x = i*.4+1

				return x
			},
			effDesc: x => format(x,1)+"x",
		}*/
	],
}

/* NORMALITY */
unMAIN.np = {
	gain() {
		return E(1)
	},
}

RESET.np = {
	unl: _=>player.decel==2,

	req: _=>player.unRes.level>=50,
	reqDesc: _=>`Reach Level 50.`,

	resetDesc: `Reset your unnatural grass, level, and astral for Normality Points.`,
	resetGain: _=> `<b>+${tmp.unRes.npGain.format(0)}</b> Normality Points`,

	title: `Normality`,
	resetBtn: `Normality...`,
    hotkey: `P`,

	reset(force=false) {
		if (this.req()||force) {
			if (!force) {
				player.unRes.np = player.unRes.np.add(tmp.unRes.npGain)
				player.unRes.nTimes++
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="n") {
		player.unRes.nTime = 0

		player.unRes.grass = E(0)
		player.unRes.xp = E(0)
		player.unRes.level = 0
		player.gal.sp = E(0)
		player.gal.astral = 0

		resetUpgrades('unGrass')
		updateTemp()
	},
}

UPGS.np = {
	unl: _=>player.decel==2,

	title: "Normality Upgrades",

	req: _=>player.unRes.nTimes > 0,
	reqDesc: _=>`Normality once to unlock.`,

	underDesc: _=>getUpgResTitle('np'),

	autoUnl: _=>false,
	noSpend: _=>false,

	ctn: [
		{
			max: Infinity,

			title: "Habitability II",
			desc: `Habitability is more efficient.`,

			res: "np",
			icon: ['Icons/Compaction', "Icons/Plus"],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,1)+"x",
		}, {
			max: Infinity,

			title: "Habitability Speed",
			desc: `Speed up the time speed for Habitability.`,

			res: "np",
			icon: ['Icons/Compaction', "Icons/StarSpeed"],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,1)+"x",
		}, {
			max: 10,

			title: "NP Grassy Efficient",
			desc: `"Grass Steel" upgrade is <b class="green">+1% more efficent.</b>`,

			res: "np",
			icon: ["Curr/Steel", "Icons/StarSpeed"],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return i/10+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: Infinity,

			title: "NP Dark Matter",
			desc: `<b class="green">Double</b> Dark Matter.`,

			res: "np",
			icon: ['Curr/DarkMatter'],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: Infinity,

			title: "NP Momentum",
			desc: `<b class="green">Double</b> Momentum.`,

			res: "np",
			icon: ["Curr/Momentum"],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x,0)+"x",
		}
	],
}

tmp_update.push(_=>{
	tmp.unRes.npGain = unMAIN.np.gain()
})
