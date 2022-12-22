MAIN.sac = {
    dmGain() {
        return player.gal.stars.div(1e12).sqrt().mul(10).floor()
    },
}

RESET.sac = {
    unl: _ => hasAGHMilestone(7),

    req: _ => player.gal.stars.gte(1e12),
    reqDesc: _ => `Reach ${format(1e12)} stars to unlock.`,

    resetDesc: `Sacrifice resets everything that Galactic resets, as well as Stars, Astral, Grass-Skips, and Funify (except Fun Machine).<br><br>
	<b class="red">You've reached the end for now, although you can keep going.</b>`,
    resetGain: _ => `Gain <b>${tmp.gal.dmGain.format(0)}</b> Dark Matters`,

    title: `Dark Matter Plant`,
    resetBtn: `Sacrifice!`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.gal.dm = player.gal.dm.add(tmp.gal.dmGain)
                player.gal.sacTimes++
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
    unl: _ => hasAGHMilestone(6),

    title: "Dark Matter Upgrades",

    req: _ => player.gal.sacTimes > 0,
    reqDesc: _ => `Sacrifice once to unlock.`,

    underDesc: _ => `You have ${format(player.gal.dm,0)} Dark Matters`,

    ctn: [
        {
            max: Infinity,

            title: "Dark Crystal",
            desc: `Increase Crystal gain by <b class="green">+1x</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "dm",
            icon: ["Curr/Crystal"],

            cost: i => Decimal.pow(1.2,i**1.25).ceil(),
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
            max: Infinity,

            title: "Dark Platinum",
            desc: `Increase Platinum gain by <b class="green">+1x</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "dm",
            icon: ["Curr/Platinum"],
                        
            cost: i => Decimal.pow(1.5,i).mul(3).ceil(),
            bulk: i => i.div(3).max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                return i+1
            },
            effDesc: x => format(x, 0)+"x",
        },{
            max: Infinity,

            title: "Dark Moonstone",
            desc: `Increase Moonstone gain by <b class="green">+1x</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "dm",
            icon: ["Curr/Moonstone"],
                        
            cost: i => Decimal.pow(2,i).mul(5).ceil(),
            bulk: i => i.div(5).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                return i+1
            },
            effDesc: x => format(x, 0)+"x",
        },
    ]
}

tmp_update.push(_=>{
	if (!tmp.gal) return
    tmp.gal.dmGain = MAIN.sac.dmGain()
})