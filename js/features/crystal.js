MAIN.crystal = {
    gain() {
        let x = E(2).pow(player.tier)

        x = x.mul(upgEffect('pp',3))
        x = x.mul(upgEffect('plat',5))
        x = x.mul(upgEffect('perk',8))
        if (player.grasshop >= 2) x = x.mul(2)
        x = x.mul(tmp.chargeEff[0]||7)

        return x.floor()
    },
}

RESET.crystal = {
    unl: _=>player.pTimes>0 && !player.decel,

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
    reqDesc: _=>`Crystalize once to unlock.`,

    underDesc: _=>`You have ${format(player.crystal,0)} Crystal`+(tmp.crystalGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.crystal,tmp.crystalGain.mul(tmp.crystalGainP))+"</span>" : ""),

    autoUnl: _=>hasUpgrade('auto',7),
    noSpend: _=>hasUpgrade('assembler',2),

    ctn: [
        {
            max: Infinity,

            title: "Grass Value III",
            desc: `Increase grass gain by <b class="green">1</b> per level.`,
        
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
            desc: `Increase XP gain by <b class="green">1</b> per level.`,
        
            res: "crystal",
            icon: ["Icons/XP"],
                        
            cost: i => Decimal.pow(2,i).mul(30).ceil(),
            bulk: i => i.div(30).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                return i+1
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "TP II",
            desc: `Increase Tier Points (TP) gain by <b class="green">25%</b> compounding per level.`,
        
            res: "crystal",
            icon: ["Icons/TP"],
                        
            cost: i => Decimal.pow(2,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                return E(1.25).pow(i)
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Tiered Boost",
            desc: `Tiers are more effective. (<b class='green'>+0.1x</b> multiplier per Tier)`,
        
            res: "crystal",
            icon: ["Icons/TP", "Icons/StarSpeed"],

            cost: i => Decimal.pow(10,i/2.5).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(10).mul(2.5).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+2.25
        
                return x
            },
            effDesc: x => format(x,2)+"x per Tier ("+format(E(MAIN.tier.base()).pow(player.tier),0)+"x -> "+format(E(MAIN.tier.base()+.1).pow(player.tier),0)+"x)",
        },{
            max: 60,

            title: "Prestiged Synergy",
            desc: `Grass Upgrade's "PP" is <b class='green'>+0.033x</b> more effective.`,
        
            res: "crystal",
            icon: ["Curr/Prestige", "Icons/StarSpeed"],

            cost: i => Decimal.pow(10,i/2).mul(50).ceil(),
            bulk: i => i.div(50).max(1).log(10).mul(2).floor().toNumber()+1,
        
            effect(i) {
                let x = i/30+1
        
                return x
            },
            effDesc: x => format(x,1)+"x effective",
        },{
            max: 2,

            title: "Grow Amount",
            desc: `Increase grass grow amount by <b class="green">1</b>.`,
        
            res: "crystal",
            icon: ["Icons/MoreGrass", "Icons/StarSpeed"],

            cost: i => Decimal.pow(2,i).mul(500).ceil(),
            bulk: i => i.div(500).max(1).log(2).floor().toNumber()+1,
        
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
    tmp.crystalGainP = (upgEffect('auto',9,0)+upgEffect('gen',1,0))*upgEffect('factory',1,1)
})