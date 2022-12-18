MAIN.sac = {
    dmGain() {
        return E(1)
    },
}

function sacUnlocked() {
	return galUnlocked() && player.gal.sacTimes
}

RESET.sac = {
    unl: _ => galUnlocked() && player.gal.neg >= 21,

    req: _ => player.gal.stars.gte(1e10),
    reqDesc: _ => `Reach ${format(1e10)} stars to unlock.`,

    resetDesc: `<span style="font-size:14px">Sacrifice resets everything that Galactic resets, as well as Stars, Astral, Grass-Skips, and Funify (except Fun Machine).</span>`,
    resetGain: _ => ``, //`Gain <b>${tmp.dmGain.format(0)}</b> Dark Matters`,

    title: `Dark Matter Plant`,
    resetBtn: `Coming Soon!`, //`Sacrifice`,

    reset(force=false) {
        return
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
            desc: `Increase Crystal gain by <b class="green">+1x</b> per level.`,
        
            res: "dm",
            icon: ["Curr/Crystal"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                return i+1
            },
            effDesc: x => format(x, 0)+"x",
        },{
            max: Infinity,

            title: "Dark Oil",
            desc: `Increase Crystal gain by <b class="green">+1x</b> per level.`,
        
            res: "dm",
            icon: ["Curr/Oil"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                return i+1
            },
            effDesc: x => format(x, 0)+"x",
        },{
            max: Infinity,

            title: "Dark Platinum",
            desc: `Increase Crystal gain by <b class="green">+1x</b> per level.`,
        
            res: "dm",
            icon: ["Curr/Platinum"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                return i+1
            },
            effDesc: x => format(x, 0)+"x",
        },{
            max: Infinity,

            title: "Dark Moonstone",
            desc: `Increase Crystal gain by <b class="green">+1x</b> per level.`,
        
            res: "dm",
            icon: ["Curr/Moonstone"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
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