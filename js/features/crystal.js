MAIN.crystal = {
    gain() {
        let x = E(2).pow(player.tier+1)

        x = x.mul(upgEffect('pp',3))
        x = x.mul(upgEffect('plat',5))
        x = x.mul(upgEffect('perk',8))
        x = x.mul(tmp.chargeEff[0]||7)

        return x.floor()
    },
}

RESET.crystal = {
    unl: _=>player.pTimes>0 && !player.decel,

    req: _=>player.level>=90,
    reqDesc: _=>`Reach Level 90 to Crystalize.`,

    resetDesc: `Crystalizing resets everything that prestige does, as well as Tier and Prestige.`,
    resetGain: _=> ``, //`Gain <b>${tmp.crystalGain.format(0)}</b> Crystals`,

    title: `Crystalize`,
    resetBtn: `Coming soon!`, //`Crystalize`,
    hotkey: `C`,

    reset(force=false) {
		return //coming soon

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

    autoUnl: _=>hasUpgrade('auto',8),
    noSpend: _=>hasUpgrade('auto',10),

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
                        
            cost: i => Decimal.pow(2,i).mul(50).ceil(),
            bulk: i => i.div(50).max(1).log(2).floor().toNumber()+1,
        
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
                        
            cost: i => Decimal.pow(2,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                return E(1.25).pow(i)
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "PP",
            desc: `Increase PP gain by <b class="green">1</b> per level.`,

            res: "crystal",
            icon: ["Curr/Prestige"],

            cost: i => Decimal.pow(2,i).mul(200).ceil(),
            bulk: i => i.div(200).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                return i+1
            },
            effDesc: x => format(x)+"x",
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
        },{
            max: Infinity,

            title: "Tiered Boost",
            desc: `Increase TP's multiplier base by 0.25.`,
        
            res: "crystal",
            icon: ["Icons/TP", "Icons/StarSpeed"],

            cost: i => Decimal.pow(2,i).mul(300).ceil(),
            bulk: i => i.div(300).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                let x = i/4+2.25
        
                return x
            },
            effDesc: x => format(x,2)+"x per Tier",
        },{
            max: 10,

            title: "Prestiged Synergy",
            desc: `Grass Upgrade's "PP" is more effective.`,
        
            res: "crystal",
            icon: ["Curr/Prestige", "Icons/StarSpeed"],

            cost: i => Decimal.pow(4,i).mul(1e4).ceil(),
            bulk: i => i.div(1e4).max(1).log(4).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+1
        
                return x
            },
            effDesc: x => format(x,1)+"x effective",
        }
    ],
}

tmp_update.push(_=>{
    tmp.crystalGain = MAIN.crystal.gain()
    tmp.crystalGainP = (upgEffect('auto',12,0)+upgEffect('gen',1,0))*upgEffect('factory',1,1)
})