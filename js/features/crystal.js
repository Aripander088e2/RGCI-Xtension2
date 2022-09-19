MAIN.crystal = {
    gain() {
        let x = E(2).pow(player.tier)

        x = x.mul(upgEffect('pp',3))
        x = x.mul(upgEffect('plat',5))
        x = x.mul(upgEffect('perk',8))
        if (player.grasshop >= 2) x = x.mul(2)
        x = x.mul(tmp.chargeEff[1]||1)

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

    cannotBuy: _=>inChal(6) || inChal(8),

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
            desc: `Increase XP gain by <b class="green">0.5</b> per level.`,
        
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
            max: 10,

            title: "Tiered Boost",
            desc: `Tiers are more effective. (<b class='green'>+0.1x</b> multiplier per Tier)`,
        
            res: "crystal",
            icon: ["Icons/TP", "Icons/StarSpeed"],

            cost: i => Decimal.pow(20,i/2.5).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(20).mul(2.5).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+2.25
        
                return x
            },
            effDesc: x => format(x,2)+"x per Tier ("+format(E(MAIN.tier.base()).pow(player.tier),0)+"x -> "+format(E(MAIN.tier.base()+.1).pow(player.tier),0)+"x)",
        },{
            max: 30,

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
            effDesc: x => format(x,3)+"x effective",
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

// Liquefy, Oil
MAIN.oil = {
    gain() {
        let l = player.tier
        let x = Decimal.pow(3,l)

        x = x.mul(upgEffect('plat',9))

        return x.floor()
    },
}

RESET.oil = {
    unl: _=> player.decel && player.aTimes > 0,

    req: _=>player.level>=90,
    reqDesc: _=>`Reach Level 90 to Liquefy.`,

    resetDesc: `Liquefy resets everything Anonymity as well as your AP, Anonymity upgrades & tier for Oil.`,
    resetGain: _=> `Gain <b>${tmp.oilGain.format(0)}</b> Oil`,

    title: `Liquefy`,
    resetBtn: `Liquefy`,
    hotkey: `L`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.oil = player.oil.add(tmp.oilGain)
                player.lTimes++
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="l") {
        player.lTime = 0
        player.tier = 0
        player.tp = E(0)
        player.ap = E(0)
        player.bestAP = E(0)

        resetUpgrades('ap')

        RESET.ap.doReset(order)
    },
}

UPGS.oil = {
    unl: _=> player.decel && player.aTimes > 0,

    title: "Oil Upgrades",

    req: _=>player.lTimes > 0,
    reqDesc: _=>`Liquefy once to unlock.`,

    underDesc: _=>`You have ${format(player.oil,0)} Oil`,

    ctn: [
        {
            max: Infinity,

            title: "Oily Grass Value",
            desc: `Increase grass gain by <b class="green">+10%</b> compounding per level.`,
        
            res: "oil",
            icon: ["Curr/Grass"],
                        
            cost: i => Decimal.pow(1.2,i).mul(50).ceil(),
            bulk: i => i.div(50).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.1,i)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 15,

            title: "Anti-XP II",
            desc: `Levels scale <span class="green">+0.05x</span> slower in Anti-Realm.`,
        
            res: "oil",
            icon: ['Icons/XP', 'Icons/StarSpeed'],
            
            cost: i => Decimal.pow(5,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(5).floor().toNumber()+1,

            effect(i) {
                return i/20
            },
            effDesc: x => "+"+format(x)+"x",
        },{
            max: Infinity,

            title: "Oily TP",
            desc: `Increase TP gain by <b class="green">15%</b> compounding per level.`,
        
            res: "oil",
            icon: ['Icons/TP'],
            
            cost: i => Decimal.pow(2,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(2).floor().toNumber()+1,

            effect(i) {
                return E(1.15).pow(i)
            },
            effDesc: x => x.format()+"x",
        },{
            max: Infinity,

            title: "Oily AP",
            desc: `Increase AP gain by <b class="green">+1x</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
        
            res: "oil",
            icon: ['Curr/Anonymity'],
            
            cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            max: Infinity,

            title: "Oily Steel",
            desc: `Steel gain is <b class="green">doubled</b> per level.`,
        
            res: "oil",
            icon: ['Curr/Steel2'],
            
            cost: i => Decimal.pow(5,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(5).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(2,i)

                return x
            },
            effDesc: x => format(x)+"x",
        },
    ],
}

tmp_update.push(_=>{
    tmp.crystalGain = MAIN.crystal.gain()
    tmp.crystalGainP = (upgEffect('auto',9,0)+upgEffect('gen',1,0))*upgEffect('factory',1,1)

    tmp.oilGain = MAIN.oil.gain()
    tmp.oilGainP = 0 //upgEffect('auto',11,0)
})