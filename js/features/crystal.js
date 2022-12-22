MAIN.crystal = {
    gain() {
        let x = E(2).pow(player.tier)

        x = x.mul(upgEffect('pp',3))
        x = x.mul(upgEffect('plat',5))
        x = x.mul(upgEffect('perk',8))

        if (player.grasshop >= 2) x = x.mul(2)

        x = x.mul(upgEffect('rocket',4))
        x = x.mul(upgEffect('momentum',5))

        x = x.mul(upgEffect('dm',0))

        return x.floor()
    },
}

RESET.crystal = {
    unl: _=>player.pTimes>0 && player.decel == 0,

    req: _=>player.level>=90,
    reqDesc: _=>`Reach Level 90 to Crystalize.`,

    resetDesc: `Crystalizing resets everything that prestige does, as well as Tier and Prestige.`,
    resetGain: _=>`Gain <b>${tmp.crystalGain.format(0)}</b> Crystals`,

    title: `Crystalize`,
    resetBtn: `Crystalize`,
    hotkey: `C`,

    reset(force=false) {
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
        player.cTime = 0
        player.pp = E(0)
        player.tp = E(0)
        player.tier = 0
        player.chal.c4 = true

        resetUpgrades('pp')

        RESET.pp.doReset(order)
    },
}

UPGS.crystal = {
    title: "Crystal Upgrades",

    cannotBuy: _=>inChal(6),

    unl: _=>player.pTimes > 0 && player.decel == 0,

    req: _=>player.cTimes > 0,
    reqDesc: _=>`Crystalize once to unlock.`,

    underDesc: _=>`You have ${format(player.crystal,0)} Crystal`+(tmp.crystalGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.crystal,tmp.crystalGain.mul(tmp.crystalGainP))+"</span>" : ""),

    autoUnl: _=>hasUpgrade('auto',7),
    noSpend: _=>hasUpgrade('assembler',2),

    ctn: [
        {
            max: Infinity,

            title: "Grass Value III",
            tier: 3,
            desc: `Increase grass gain by <b class="green">+1</b> per level.`,
        
            res: "crystal",
            icon: ["Curr/Grass"],
                        
            cost: i => Decimal.pow(2,i).mul(20).ceil(),
            bulk: i => i.div(20).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                return i+1
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "XP III",
            tier: 3,
            desc: `Increase XP gain by <b class="green">+0.5</b> per level.`,
        
            res: "crystal",
            icon: ["Icons/XP"],
                        
            cost: i => Decimal.pow(2,i).mul(30).ceil(),
            bulk: i => i.div(30).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                return i/2+1
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "TP II",
            tier: 2,
            desc: `Increase TP gain by <b class="green">25%</b> compounding per level.`,
        
            res: "crystal",
            icon: ["Icons/TP"],
                        
            cost: i => Decimal.pow(2,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                return E(1.25).pow(i)
            },
            effDesc: x => format(x)+"x",
        },
    ],
}

tmp_update.push(_=>{
    tmp.crystalGain = MAIN.crystal.gain()
    tmp.crystalGainP = (upgEffect('auto',9,0)+upgEffect('gen',1,0)+starTreeEff("qol",0,0))*upgEffect('factory',1,1)
})