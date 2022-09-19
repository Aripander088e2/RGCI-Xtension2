MAIN.pp = {
    gain() {
        let x = Decimal.pow(1.15,player.level)

        x = x.mul(upgEffect('grass',5))
        x = x.mul(upgEffect('plat',3))
        x = x.mul(upgEffect('perk',6))
        x = x.mul(chalEff(4))

        x = x.mul(tmp.chargeEff[3]||1)
        x = x.mul(upgEffect('rocket',3))
        x = x.mul(upgEffect('momentum',4))

        return x.floor()
    },
}

RESET.pp = {
    unl: _=> !player.decel,

    req: _=>player.level>=30,
    reqDesc: _=>`Reach Level 30 to Prestige.`,

    resetDesc: `Prestiging resets your grass, grass upgrades, level and perks for Prestige Points.`,
    resetGain: _=> `Gain <b>${tmp.ppGain.format(0)}</b> Prestige Points`,

    title: `Prestige`,
    resetBtn: `Prestige`,
    hotkey: `P`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.pp = player.pp.add(tmp.ppGain)
                player.pTimes++
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="p") {
        player.pTime = 0
        player.grass = E(0)
        player.bestGrass = E(0)
        player.xp = E(0)
        player.level = 0

        let keep_perk = (order == "p" && hasUpgrade('auto',5)) ||
			(order == "c" && hasUpgrade('auto',6)) ||
			(order == "gh" && hasUpgrade('assembler',4))

        if (!keep_perk) {
            player.maxPerk = 0
            player.spentPerk = 0
            resetUpgrades('perk')
        }

        resetUpgrades('grass')

        resetGlasses()

        updateTemp()
    },
}

UPGS.pp = {
    unl: _=> !player.decel,

    title: "Prestige Upgrades",

    cannotBuy: _=>inChal(4) || inChal(5) || inChal(8),

    autoUnl: _=>hasUpgrade('auto',5),
    noSpend: _=>hasUpgrade('assembler',1),

    req: _=>player.pTimes > 0,
    reqDesc: _=>`Prestige once to unlock.`,

    underDesc: _=>`You have ${format(player.pp,0)} Prestige Points`+(tmp.ppGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.pp,tmp.ppGain.mul(tmp.ppGainP))+"</span>" : ""),

    ctn: [
        {
            max: Infinity,

            title: "Grass Value II",
            desc: `Increase grass gain by <b class="green">+50%</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
        
            res: "pp",
            icon: ["Curr/Grass"],
                        
            cost: i => Decimal.pow(1.2,i).mul(5).ceil(),
            bulk: i => i.div(5).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "XP II",
            desc: `Increase XP gain by <b class="green">+50%</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
        
            res: "pp",
            icon: ["Icons/XP"],
                        
            cost: i => Decimal.pow(1.2,i).mul(30).ceil(),
            bulk: i => i.div(30).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)
                if (inChal(1)) x = E(1)
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 135,

            title: "TP",
            desc: `Increase Tier Points (TP) gain by <b class="green">25%</b> compounding per level.`,

            res: "pp",
            icon: ["Icons/TP"],
                        
            cost: i => Decimal.pow(1.2,i**1.25).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(1.2).root(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.2,i)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 300,

            unl: _=>player.cTimes>0,

            title: "Crystal",
            desc: `Increase Crystal gain by <b class="green">+50%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,

            res: "pp",
            icon: ["Curr/Crystal"],

            cost: i => Decimal.pow(2,i).mul(1e9).ceil(),
            bulk: i => i.div(1e9).max(1).log(2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/2+1)
                return x
            },
            effDesc: x => format(x)+"x",
        },
    ],
}

// Anti-Prestige (Anonymity)

MAIN.ap = {
    gain() {
        let x = Decimal.pow(1.15,player.level)

        x = x.mul(tmp.chargeEff[6]||1)
        x = x.mul(upgEffect('aGrass',5))
        x = x.mul(upgEffect('plat',8))
        x = x.mul(upgEffect('oil',3))

        x = x.mul(upgEffect('rocket',7))
        x = x.mul(upgEffect('momentum',8))

        return x.floor()
    },
}

RESET.ap = {
    unl: _=> player.decel,

    req: _=>player.level>=30,
    reqDesc: _=>`Reach Level 30 to Anonymity.`,

    resetDesc: `Anonymity resets your anti-grass, anti-grass upgrades, level for Anonymity Points (AP).`,
    resetGain: _=> `Gain <b>${tmp.apGain.format(0)}</b> Anonymity Points`,

    title: `Anonymity`,
    resetBtn: `Anonymity`,
    hotkey: `A`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.ap = player.ap.add(tmp.apGain)
                player.aTimes++

                player.bestAP2 = player.bestAP2.max(tmp.apGain)
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="a") {
        player.aTime = 0
        player.aGrass = E(0)
        player.aBestGrass = E(0)
        player.xp = E(0)
        player.level = 0

        if (!hasUpgrade('auto',18)) resetUpgrades('aGrass')

        resetGlasses()

        updateTemp()
    },
}

UPGS.ap = {
    unl: _=> player.decel,

    title: "Anonymity Upgrades",

    req: _=>player.aTimes > 0,
    reqDesc: _=>`Anonymity once to unlock.`,

    underDesc: _=>`You have ${format(player.ap,0)} Anonymity Points.`,

    autoUnl: _=>hasUpgrade('auto',15),
    noSpend: _=>hasUpgrade('auto',19),

    ctn: [
        {
            max: Infinity,

            title: "AP Value",
            desc: `Increase grass gain by <b class="green">+25%</b> per level.`,
        
            res: "ap",
            icon: ["Curr/Grass"],

            cost: i => Decimal.pow(1.2,i).mul(25).ceil(),
            bulk: i => i.div(25).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                return E(i/2+1)
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "AP Charge",
            desc: `Increase charge rate by <b class="green">+50%</b> per level.`,
        
            res: "ap",
            icon: ['Curr/Charge'],
            
            cost: i => Decimal.pow(1.2,i).mul(20).ceil(),
            bulk: i => i.div(20).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                return E(i/2+1)
            },
            effDesc: x => x.format()+"x",
        },{
            max: 10,

            title: "Anti-XP",
            desc: `Levels scale <span class="green">+0.05x</span> slower in Anti-Realm.`,
        
            res: "ap",
            icon: ['Icons/XP', 'Icons/StarSpeed'],
            
            cost: i => Decimal.pow(15,i**1.25).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(15).root(1.25).floor().toNumber()+1,

            effect(i) {
                return i/20+1
            },
            effDesc: x => format(x,2)+"x",
        },{
            max: 10,

            title: "Anti-TP",
            desc: `Increase Tier multiplier by <span class="green">+0.1x</span> in Anti-Realm.`,
        
            res: "ap",
            icon: ['Icons/TP', 'Icons/StarSpeed'],
            
            cost: i => Decimal.pow(10,i).mul(150).ceil(),
            bulk: i => i.div(150).max(1).log(10).floor().toNumber()+1,

            effect(i) {
                return i/10+2
            },
            effDesc: x => format(x,2)+"x",
        },{
            max: 50,

            title: "AP More Grass",
            desc: `Increase grass cap by <b class="green">+10</b> per level.`,
        
            res: "ap",
            icon: ['Icons/MoreGrass'],
            
            cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                return i*10
            },
            effDesc: x => "+"+format(x,0),
        }
    ],
}

tmp_update.push(_=>{
    tmp.ppGain = MAIN.pp.gain()
    tmp.ppGainP = (upgEffect('auto',8,0)+upgEffect('gen',0,0))*upgEffect('factory',1,1)

    tmp.apGain = MAIN.ap.gain()
    tmp.apGainP = 0 //upgEffect('auto',11,0)
})