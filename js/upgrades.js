grass: {
        unl: _=> player.decel == 0,

        cannotBuy: _=>inChal(0) || inChal(5),

        autoUnl: _=>hasUpgrade('auto',3),
        noSpend: _=>hasUpgrade('assembler',0),

        title: "Upgrades",

        ctn: [
            {
                max: Infinity,

                title: "Grass Value",
                desc: `Increase Grass gain by <b class="green">+0.5</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

                res: "grass",
                icon: ['Curr/Grass'],
                
                cost: i => Decimal.pow(1.09,i).mul(10).ceil(),
                bulk: i => i.div(10).max(1).log(1.09).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 2500,

                title: "More Grass",
                desc: `Increase grass cap by <b class="green">+1</b> per level.`,

                res: "grass",
                icon: ['Icons/MoreGrass'],
                
                cost: i => Decimal.pow(1.10,i).mul(25).ceil(),
                bulk: i => i.div(25).max(1).log(1.10).floor().toNumber()+1,

                effect(i) {
                    let x = i

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 90,

                title: "Grow Speed",
                desc: `Grass grows <b class="green">+50%</b> faster per level.`,

                res: "grass",
                icon: ['Icons/Speed'],
                
                cost: i => Decimal.pow(1.2,i).mul(3).ceil(),
                bulk: i => i.div(3).max(1).log(1.2).floor().toNumber()+1,

                effect(i) {
                    let x = i/4+1

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: Infinity,

                title: "XP",
                desc: `Increase experience (XP) gain by <b class="green">+0.5</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

                res: "grass",
                icon: ['Icons/XP'],
                
                cost: i => Decimal.pow(1.09,i).mul(50).ceil(),
                bulk: i => i.div(50).max(1).log(1.09).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 16,

                title: "Range",
                desc: `Increase grass cut range by <b class="green">+10</b> per level. Base is 70.`,

                res: "grass",
                icon: ['Icons/Range'],
                
                cost: i => Decimal.pow(5,i).mul(70).ceil(),
                bulk: i => i.div(70).max(1).log(5).floor().toNumber()+1,

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 1e8,

                unl: _=>player.pTimes>0,

                title: "PP",
                desc: `Increase prestige points (PP) gained by <b class="green">+50%</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

                res: "grass",
                icon: ['Curr/Prestige'],
                
                cost: i => Decimal.pow(1.05,i).mul(3e7).ceil(),
                bulk: i => i.div(3e7).max(1).log(1.05).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)
                    x = x.pow(upgEffect('crystal',4)+getChargeEff(2,0))
                    return x
                },
                effDesc: x => x.format()+"x",
            },
        ],
    },
    perk: {
        title: "Perk Upgrades",
        btns: `<button id="losePerksBtn" class="buyAllUpg" onclick='toggleOption("losePerks")'>Keep on reset: <span id="losePerks"></span></button>`,

        cannotBuy: _=>inChal(3),

        req: _=>(player.level >= 1 || player.pTimes > 0)&&!player.decel,
        reqDesc: _=>player.decel?`You can't gain Perks!`:`Reach Level 1 to unlock.`,

        underDesc: _=>getUpgResTitle('perk'),

        autoUnl: _=>hasUpgrade('assembler',3),

        ctn: [
            {
                max: 100,

                costOnce: true,

                title: "Value Perk",
                desc: `Increase Grass gain by <b class="green">+50%</b> per level.`,

                res: "perk",
                icon: ['Curr/Grass'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    return i/2+1
                },
                effDesc: x => format(x,1)+"x",
            },{
                max: 400,

                costOnce: true,

                title: "Cap Perk",
                desc: `Increase grass cap by <b class="green">10</b> per level.`,

                res: "perk",
                icon: ['Icons/MoreGrass'],
                
                cost: i => 0.2,
                bulk: i => 0.2,

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 100,

                costOnce: true,

                title: "Grow Speed Perk",
                desc: `Increase grass grow speed by <b class="green">+25%</b> per level.`,

                res: "perk",
                icon: ['Icons/Speed'],
                
                cost: i => 0.2,
                bulk: i => i,

                effect(i) {
                    let x = 1+i/4

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 50,

                costOnce: true,

                title: "XP Perk",
                desc: `Increase XP gain by <b class="green">+50%</b> per level.`,

                res: "perk",
                icon: ['Icons/XP'],

                unl: _=>player.pTimes,
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = Decimal.mul(i,0.5).add(1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 5,

                costOnce: true,

                title: "Range Perk",
                desc: `Increase grass cut range by <b class="green">10</b> per level.`,

                res: "perk",
                icon: ['Icons/Range'],

                unl: _=>player.pTimes,
                cost: i => 3,
                bulk: i => Math.floor(i/3),

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 3,

                costOnce: true,

                title: "Grow Amount Perk",
                desc: `Increase the grass grow amount by <b class="green">1</b>.`,

                res: "perk",
                icon: ['Icons/MoreGrass', "Icons/StarSpeed"],
 
                unl: _=>player.pTimes,
                cost: i => 1,
                bulk: i => Math.floor(i/10),

                effect(i) {
                    let x = i

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 50,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "PP Perk",
                desc: `Increase PP gain by <b class="green">+50%</b> per level.`,

                res: "perk",
                icon: ['Curr/Prestige'],
                
                cost: i => 0.25,
                bulk: i => Math.floor(i/10),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 50,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "TP Perk",
                desc: `Increase TP gain by <b class="green">+50%</b> per level.`,

                res: "perk",
                icon: ['Icons/TP'],
                
                cost: i => 0.25,
                bulk: i => Math.floor(i/15),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 50,

                unl: _=>grassHopped(),

                costOnce: true,

                title: "Crystal Perk",
                desc: `Increase Crystal gain by <b class="green">+25%</b> per level.`,

                res: "perk",
                icon: ['Curr/Crystal'],
                
                cost: i => 0.25,
                bulk: i => Math.floor(i/15),

                effect(i) {
                    let x = E(i/4+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },
        ],
    },
    auto: {
        title: "Automation Upgrades",

        unl: _=>!player.decel,
        req: _=>player.pTimes > 0,
        reqDesc: `Prestige once to unlock.`,

        ctn: [
            {
                max: 5,

                title: "Autocut",
                desc: `Auto cuts grass every <b class="green">1.5</b> seconds. (-0.1s every level after the first)`,
            
                res: "grass",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => Decimal.pow(10,i).mul(1e3).ceil(),
                bulk: i => i.div(1e3).max(1).log(10).floor().toNumber()+1,
            
                effect(i) {
                    let x = 1.5-Math.max(i-1,0)/10
                    return x
                },
                effDesc: x => format(tmp.autocut)+" seconds",
            },{
                unl: _=>player.pTimes>0,
                max: 5,

                title: "Autocut Value",
                desc: `Auto cuts grass is worth <b class="green">+1x</b> more grass, XP & TP.`,
            
                res: "pp",
                icon: ['Curr/Grass','Icons/StarSpeed'],
                            
                cost: i => Decimal.pow(10,i).mul(200).ceil(),
                bulk: i => i.div(200).max(1).log(10).floor().toNumber()+1,
            
                effect(i) {
                    let x = E(i+1)
            
                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                unl: _=>player.cTimes>0,
                max: 10,

                title: "Autocut Amount",
                desc: `Increases auto cut amount by <b class="green">+1</b>.`,
            
                res: "crystal",
                icon: ['Icons/MoreGrass','Icons/StarSpeed'],
                            
                cost: i => Decimal.pow(5,i).mul(25).ceil(),
                bulk: i => i.div(25).max(1).log(5).floor().toNumber()+1,
            
                effect(i) {
                    let x = i
            
                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                unl: _=>player.cTimes>0,

                title: "Grass Upgrade Autobuy",
                desc: `Automate Grass Upgrades.`,
            
                res: "pp",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => E(1e6),
                bulk: i => 1,
            },{
                unl: _=>player.cTimes>0,

                title: "Perk Save P",
                desc: `Keep perks on Prestige.`,
            
                res: "pp",
                icon: ['Curr/Perks','Icons/StarProgression'],
                            
                cost: i => E(1e10),
                bulk: i => 1,
            },{
                unl: _=>player.cTimes>0,

                title: "Prestige Upgrade Autobuy",
                desc: `Automate Prestige Upgrades.`,
            
                res: "crystal",
                icon: ['Curr/Prestige','Icons/Automation'],
                            
                cost: i => E(1e5),
                bulk: i => 1,
            },{
                unl: _=>grassHopped(),

                title: "Perk Save C",
                desc: `Keep perks on Crystalize.`,
            
                res: "crystal",
                icon: ['Curr/Perks','Icons/StarProgression'],
                            
                cost: i => E(1e7),
                bulk: i => 1,
            },{
                unl: _=>grassHopped(),

                title: "Crystal Upgrade Autobuy",
                desc: `Automate Crystal Upgrades.`,
            
                res: "crystal",
                icon: ['Curr/Crystal','Icons/Automation'],
                            
                cost: i => E(1e8),
                bulk: i => 1,
            },{
                unl: _=>player.sTimes>0,

                max: 10,

                title: "PP Generation",
                desc: `Passively generate <b class="green">+0.1%</b> of PP you would earn on prestige per second.`,
            
                res: "pp",
                icon: ['Curr/Prestige','Icons/Plus'],
                            
                cost: i => Decimal.pow(7,i).mul(1e25),
                bulk: i => i.div(1e25).max(1).log(7).floor().toNumber()+1,
                effect(i) {
                    let x = i/1e3
            
                    return x
                },
                effDesc: x => "+"+formatPercent(x)+"/s",
            },{
                unl: _=>hasUpgrade('factory', 4) || galUnlocked(),

                max: 10,

                title: "Crystal Generation",
                desc: `Passively generate <b class="green">+0.1%</b> of crystal you would earn on crystalize per second.`,
            
                res: "crystal",
                icon: ['Curr/Crystal','Icons/Plus'],

                cost: i => Decimal.pow(3,i).mul(1e15).ceil(),
                bulk: i => i.div(1e15).max(1).log(3).floor().toNumber()+1,
                effect(i) {
                    let x = i/1e3
            
                    return x
                },
                effDesc: x => "+"+formatPercent(x)+"/s",
            }
        ],
    },
    plat: {
        title: "Platinum Upgrades",

        unl: _=>player.pTimes>0,
        autoUnl: _=>hasStarTree('auto',6),

        req: _=>player.tier >= 2 || player.cTimes > 0,
        reqDesc: `Reach Tier 2 to unlock.`,

        underDesc: _=>getUpgResTitle('plat')+` (${formatPercent(tmp.platChance)} grow chance)`,

        ctn: [
            {
                max: 360,

                costOnce: true,

                title: "Starter AC",
                desc: `Grass automatically cuts <b class="green">+0.1x</b> faster.`,

                res: "plat",
                icon: ['Curr/Grass','Icons/Automation'],
                
                cost: i => 2,
                bulk: i => Math.floor(i/2),

                effect(i) {
                    let x = i/10+1
                    return x
                },
                effDesc: x => format(x, 1)+"x",
            },{
                max: 100,

                costOnce: true,

                title: "Starter XP",
                desc: `Increase XP gain by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Icons/XP'],
                
                cost: i => 0.1,
                bulk: i => Math.floor(i/0.1),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                costOnce: true,

                title: "Starter Grass",
                desc: `Increase grass gain by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Curr/Grass'],
                
                cost: i => 0.1,
                bulk: i => Math.floor(i/0.1),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 40,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Plat PP",
                desc: `Increase PP gain by <b class="green">+25%</b> per level.`,

                res: "plat",
                icon: ['Curr/Prestige'],
                
                cost: i => 50,
                bulk: i => Math.floor(i/50),

                effect(i) {
                    let x = E(i/4+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 10,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Plat TP",
                desc: `Increase TP gain by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Icons/TP'],
                
                cost: i => 100,
                bulk: i => Math.floor(i/100),

                effect(i) {
                    return E(i/2+1)
                },
                effDesc: x => format(x)+"x",
            },{
                max: 10,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Plat Crystal",
                desc: `Increase Crystal gain by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Curr/Crystal'],
                
                cost: i => 100,
                bulk: i => Math.floor(i/100),

                effect(i) {
                    return E(i/2+1)
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.sTimes>0,

                costOnce: true,

                title: "Plat Steel",
                desc: `Increase steel gain by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Curr/Steel'],
                
                cost: i => 100,
                bulk: i => Math.floor(i/100),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>hasUpgrade('factory',2),

                costOnce: true,

                title: "Plat Charge",
                desc: `Increase charge rate by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Curr/Charge'],
                
                cost: i => 500,
                bulk: i => Math.floor(i/500),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.aRes?.aTimes,

                costOnce: true,

                title: "Plat Anonymity",
                desc: `Increase AP gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Anonymity'],
                
                cost: i => 1e3,
                bulk: i => Math.floor(i/1e3),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 10,

                unl: _=>player.aRes?.lTimes,

                costOnce: true,

                title: "Platinum Oil",
                desc: `Increase Oil gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Oil'],
                
                cost: i => 2e3,
                bulk: i => Math.floor(i/2e3),

                effect(i) {
                    let x = E(i/5+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            }
        ],
    },
}
