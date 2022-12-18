MAIN.sac = {
    dmGain() {
        return E(1)
    },
}

RESET.sac = {
    unl: _ => galUnlocked() && player.gal.neg >= 21,

    req: _ => player.gal.stars.gte(1e8),
    reqDesc: _ => `Reach ${format(1e8)} stars to unlock.`,

    resetDesc: `<span style="font-size:14px">Sacrifice resets everything that Galactic resets, as well as Stars, Astral, Grass-Skips, and Funify (except Fun Machine).</span>`,
    resetGain: _ => ``, //`Gain <b>${tmp.dmGain.format(0)}</b> Dark Matters`,

    title: `Dark Matter Plant`,
    resetBtn: `Coming Soon!`, //`Sacrifice`,

    reset(force=false) {
        return
        if (this.req()||force) {
            if (!force) {
                player.gal.dm = player.gal.dm.add(tmp.dmGain)
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
            max: 1000,

            title: "Dark TP",
            desc: `Increase TP gain by <b class="green">+100%</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "dm",
            icon: ["Icons/TP"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "Dark Charge",
            desc: `Increase charge rate by <b class="green">+100%</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "dm",
            icon: ["Icons/Charge"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "Dark XP",
            desc: `Increase XP gain by <b class="green">+100%</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "dm",
            icon: ["Icons/XP"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "Dark SP",
            desc: `Increase SP gain by <b class="green">+100%</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "dm",
            icon: ["Icons/SP"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 100,

            title: "Dark Stars",
            desc: `Increase stars gain by <b class="green">+50%</b> per level.`,
        
            res: "dm",
            icon: ["Curr/Star"],
                        
            cost: i => Decimal.pow(1.25,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = i/2+1
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 5,

            title: "Star Base from Rocket",
            desc: `Increase star base from rocket part by <b class="green">0.1</b> per level.`,
        
            res: "dm",
            icon: ["Curr/Star","Icons/Plus"],
                        
            cost: i => Decimal.pow(10,i**1.5).mul(100).ceil(),
            bulk: i => i.div(10).max(1).log(100).root(1.5).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10
        
                return x
            },
            effDesc: x => "+"+format(x,1),
        },
    ]
}

tmp_update.push(_=>{
    tmp.dmGain = MAIN.sac.dmGain()
})