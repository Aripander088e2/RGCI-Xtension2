MAIN.sac = {
	dmGain() {
		return player.gal.stars.div(1e12).sqrt().mul(10).floor()
	},
	did() {
		return player?.gal?.sacTimes
	}
}

RESET.sac = {
	unl: _ => hasStarTree("progress", 6),

	req: _ => hasAGHMilestone(7) && player.gal.stars.gte(1e12),
	reqDesc: _ => `Get 21 Negative Energy and ${format(1e12)} stars.`,

	resetDesc: `Reset everything Galactic does, and so Stars, Astral, Grass-Skips, and Funify (except Fun Machine).`,
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
			desc: `Increase Crystal gain by <b class="green">+1x</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "dm",
			icon: ["Curr/Crystal"],

			cost: i => Decimal.pow(1.3,i**1.25).ceil(),
			bulk: i => i.max(1).log(1.2).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i+1)
		
				return x
			},
			effDesc: x => format(x, 0)+"x",
		},{
			max: Infinity,

			title: "Dark Oil",
			desc: `Increase Oil gain by <b class="green">+1x</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "dm",
			icon: ["Curr/Oil"],

			cost: i => Decimal.pow(1.3,i**1.25).ceil(),
			bulk: i => i.max(1).log(1.3).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				return i+1
			},
			effDesc: x => format(x, 0)+"x",
		},{
			max: 25,

			title: "Dark Platinum",
			desc: `Increase Platinum gain by <b class="green">+0.5x</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
		
			res: "dm",
			icon: ["Curr/Platinum"],
						
			cost: i => Decimal.pow(1.5,i).mul(3).ceil(),
			bulk: i => i.div(3).max(1).log(1.5).floor().toNumber()+1,
		
			effect(i) {
				return (i/2+1)*2**Math.floor(i/25)
			},
			effDesc: x => format(x, 0)+"x",
		},{
			max: 10,

			title: "Dark Moonstone",
			desc: `Increase Moonstone gain by <b class="green">+0.5x</b> per level.`,
		
			res: "dm",
			icon: ["Curr/Moonstone"],
						
			cost: i => Decimal.pow(2,i).mul(5).ceil(),
			bulk: i => i.div(5).max(1).log(2).floor().toNumber()+1,
		
			effect(i) {
				return i/2+1
			},
			effDesc: x => format(x, 0)+"x",
		}, {
			max: Infinity,

			title: "Dark Momentum",
			desc: `<b class="green">Double</b> Momentum.`,
		
			res: "dm",
			icon: ["Curr/Momentum"],

			cost: i => Decimal.pow(4,i**1.25).mul(1e5).ceil(),
			bulk: i => i.div(1e5).max(1).log(4).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				return i/10+1
			},
			effDesc: x => format(x)+"x",
		}, {
			max: 25,

			title: "Dark Grassy Efficient",
			desc: `"Grass Steel" upgrade is <b class="green">+1% more efficent.</b>`,

			res: "dm",
			icon: ["Curr/Steel", "Icons/StarSpeed"],
			
			cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

			effect(i) {
				return i/20+1
			},
			effDesc: x => format(x,0)+"x",
		},
	]
}

tmp_update.push(_=>{
	if (!tmp.gal) return
	tmp.gal.dmGain = MAIN.sac.dmGain()
})