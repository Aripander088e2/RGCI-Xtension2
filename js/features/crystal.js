MAIN.crystal = {
    gain() {
        let x = E(2).pow(player.tier+1)

        x = x.mul(upgEffect('crystal',3))
        x = x.mul(upgEffect('plat',4))
        x = x.mul(upgEffect('perk',8))

        x = x.mul(chalEff(6))

        x = x.mul(tmp.chargeEff[0]||7)

        x = x.pow(upgEffect('plat',7))

        if (inChal(5)) x = x.root(2)

        return x.floor()
    },
}

RESET.crystal = {
    unl: _=>player.pTimes>0 && !player.decel,

    req: _=>player.level>=90,
    reqDesc: _=>`Reach Level 90 to Crystallize.`,

    resetDesc: `Crystallizing resets everything that prestige does, as well as Tier and Prestige.`,
    resetGain: _=> ``, //`Gain <b>${tmp.crystalGain.format(0)}</b> Crystals`,

    title: `Crystallize`,
    resetBtn: `Coming soon...`,
    hotkey: `C`,

    reset(force=false) {
        return
        if (this.req()||force) {
            if (!force) {
                player.crystal = player.crystal.add(tmp.crystalGain)
                player.cTimes++
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="c") {
        player.pp = E(0)
        player.bestPP = E(0)
        player.tp = E(0)
        player.tier = 0

        resetUpgrades('pp')

        RESET.pp.doReset(order)
    },
}

UPGS.crystal = {
    title: "Crystal Upgrades",

    unl: _=>player.pTimes > 0 && !player.decel,

    req: _=>player.cTimes > 0,
    reqDesc: _=>`Crystallize once to unlock.`,

    underDesc: _=>`You have ${format(player.crystal,0)} Crystal`+(tmp.crystalGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.crystal,tmp.crystalGain.mul(tmp.crystalGainP))+"</span>" : ""),

    autoUnl: _=>hasUpgrade('auto',8),
    noSpend: _=>hasUpgrade('auto',10),

    cannotBuy: _=>inChal(6),

    ctn: [
        {
            max: 1000,

            title: "Grass Value III",
            desc: `Increase grass gain by <b class="green">1</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
        
            res: "crystal",
            icon: ["Curr/Grass"],
                        
            cost: i => Decimal.pow(1.25,i).mul(20).ceil(),
            bulk: i => i.div(20).max(1).log(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "XP III",
            desc: `Increase XP gain by <b class="green">1</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
        
            res: "crystal",
            icon: ["Icons/XP"],
                        
            cost: i => Decimal.pow(1.25,i).mul(50).ceil(),
            bulk: i => i.div(50).max(1).log(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "TP II",
            desc: `Increase Tier Points (TP) gain by <b class="green">1</b> per level. This effect is <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
        
            res: "crystal",
            icon: ["Icons/TP"],
                        
            cost: i => Decimal.pow(1.25,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "PP",
            desc: `Increase PP gain by <b class="green">1</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,

            res: "crystal",
            icon: ["Curr/Prestige"],

            cost: i => Decimal.pow(1.25,i).mul(200).ceil(),
            bulk: i => i.div(200).max(1).log(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/4+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1,

            title: "Grow Amount",
            desc: `Increase grass grow amount by <b class="green">1</b>.`,
        
            res: "crystal",
            icon: ["Icons/Speed"],
                        
            cost: i => E(20),
            bulk: i => 1,
        
            effect(i) {
                let x = i
        
                return x
            },
            effDesc: x => "+"+format(x,0),
        }
    ],
}

tmp_update.push(_=>{
    tmp.crystalGain = MAIN.crystal.gain()
    tmp.crystalGainP = (upgEffect('auto',12,0)+upgEffect('gen',1,0))*upgEffect('factory',1,1)
})