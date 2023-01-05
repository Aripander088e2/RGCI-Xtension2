MAIN.sac = {
	dmGain() {
		return player.gal.stars.div(1e8).cbrt().floor()
	},
	did() {
		return player?.gal?.sacTimes
	}
}

RESET.sac = {
	unl: _ => hasAGHMilestone(7),

	req: _ => player.gal.stars.gte(1e10),
	reqDesc: _ => `Reach ${format(1e10)} stars.`,

	resetDesc: `Reset everything Galactic does, and so Rocket Fuel, Stars, Astral, Grass-Skips, and Funify (except Fun Machine).`,
	resetGain: _ => `<b>+${tmp.gal.dmGain.format(0)}</b> Dark Matters`,

	title: `Dark Matter Plant`,
	resetBtn: `Sacrifice!`,

	reset(force=false) {
		if (this.req()||force) {
			if (!force) {
				player.gal.dm = player.gal.dm.add(tmp.gal.dmGain)
				player.gal.sacTimes++

				if (!player.unRes) player.unRes = setupRecel()
				mapPos.earth = [1, 1]
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="sac") {
		player.gal.sacTime = 0

		resetUpgrades('fundry')
		resetUpgrades('sfrgt')

		player.rocket.amt = 0
		player.gal.sp = E(0)
		player.gal.astral = 0
		player.gal.stars = E(0)
		player.aRes.grassskip = E(0)
		player.aRes.fun = E(0)
		player.aRes.sfrgt = E(0)
		player.rocket.amount = 0

		RESET.gal.doReset(order)
	},
}

UPGS.dm = {
	unl: _ => hasAGHMilestone(7),

	title: "Dark Matter Manipulator",

	req: _ => player.gal.sacTimes > 0,
	reqDesc: _ => `Sacrifice once to unlock.`,

	underDesc: _ => getUpgResTitle('dm'),

	ctn: [
		{
			max: Infinity,

			title: "Dark Crystal",
			desc: `Increase Crystal gain by <b class="green">30%</b> compounding per level.`,
		
			res: "dm",
			icon: ["Curr/Crystal"],

			cost: i => Decimal.pow(2,i**1.25).ceil(),
			bulk: i => i.max(1).log(2).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				return E(1.3).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Dark Oil",
			desc: `Increase Oil gain by <b class="green">30%</b> compounding per level.`,
		
			res: "dm",
			icon: ["Curr/Oil"],

			cost: i => Decimal.pow(2,i**1.25/2).ceil(),
			bulk: i => i.max(1).log(2).mul(2).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				return E(1.3).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: 100,

			title: "Dark Platinum",
			desc: `Increase Platinum gain by <b class="green">+0.5x</b> per level.`,
		
			res: "dm",
			icon: ["Curr/Platinum"],
						
			cost: i => Decimal.pow(3,i).mul(2).ceil(),
			bulk: i => i.div(2).max(1).log(3).floor().toNumber()+1,
		
			effect(i) {
				return i/2+1
			},
			effDesc: x => format(x, 1)+"x",
		},{
			max: 10,

			title: "Dark Moonstone",
			desc: `Increase Moonstone gain by <b class="green">+1</b> per level.`,
		
			res: "dm",
			icon: ["Curr/Moonstone"],
						
			cost: i => Decimal.pow(5,i).mul(3).ceil(),
			bulk: i => i.div(3).max(1).log(5).floor().toNumber()+1,
		
			effect(i) {
				return i
			},
			effDesc: x => "+"+format(x,0),
		}, {
			max: Infinity,

			title: "Dark Momentum",
			desc: `<b class="green">Double</b> Momentum.`,
		
			res: "dm",
			icon: ["Curr/Momentum"],

			cost: i => Decimal.pow(4,i**1.25).mul(1e5).ceil(),
			bulk: i => i.div(1e5).max(1).log(4).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				return 2**i
			},
			effDesc: x => format(x)+"x",
		}
	]
}

tmp_update.push(_=>{
	if (!tmp.gal) return
	tmp.gal.dmGain = MAIN.sac.dmGain()
})