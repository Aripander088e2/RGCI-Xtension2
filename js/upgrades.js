const U_STEP = [1,25,1/0]

const UPG_RES = {
    grass: ["Grass",_=>[player,"grass"],'GrassBase'],
    perk: ["Perk",_=>[tmp,"perkUnspent"],'PerkBase'],
    pp: ["PP",_=>[player,"pp"],'PrestigeBase'],
    plat: ["Platinum",_=>[player,"plat"],"PlatBase"],
    crystal: ["Crystal",_=>[player,"crystal"],"CrystalBase"],
    steel: ["Steel",_=>[player,"steel"],"GrasshopBase"],
    aGrass: ["Anti-Grass",_=>[player.aRes,"grass"],'AntiGrassBase'],
    ap: ["AP",_=>[player.aRes,"ap"],'AnonymityBase'],
    oil: ["Oil",_=>[player.aRes,"oil"],'LiquefyBase'],
    rf: ["Rocket Fuel",_=>[player.rocket,"amount"],'RocketBase'],
    momentum: ["Momentum",_=>[player.rocket,"momentum"],'RocketBase'],
    star: ["Stars",_=>[player.gal,"stars"],'SpaceBase'],
    moonstone: ["Moonstone",_=>[player.gal,"moonstone"],'MoonBase'],
    fun: ["Fun",_=>[player.aRes,"fun"],'FunBase'],
    SFRGT: ["SFRGT",_=>[player.aRes,"sfrgt"],'FunBase'],
    dm: ["Dark Matter",_=>[player.gal,"dm"],'DarkMatterBase'],
}

const isResNumber = ['perk','plat','rf','momentum','moonstone']

const UPGS = {
    grass: {
        unl: _=> !player.decel,

        cannotBuy: _=>inChal(0) || inChal(5),

        autoUnl: _=>hasUpgrade('auto',3),
        noSpend: _=>hasUpgrade('assembler',0),

        title: "Grass Upgrades",

        ctn: [
            {
                max: Infinity,

                title: "Grass Value",
                desc: `Increase Grass gain by <b class="green">+0.5</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

                res: "grass",
                icon: ['Curr/Grass'],
                
                cost: i => Decimal.pow(1.15,i).mul(10).ceil(),
                bulk: i => i.div(10).max(1).log(1.15).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 250,

                title: "More Grass",
                desc: `Increase grass cap by <b class="green">+1</b> per level.`,

                res: "grass",
                icon: ['Icons/MoreGrass'],
                
                cost: i => Decimal.pow(1.15,i).mul(25).ceil(),
                bulk: i => i.div(25).max(1).log(1.15).floor().toNumber()+1,

                effect(i) {
                    let x = i

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 50,

                title: "Grow Speed",
                desc: `Grass grows <b class="green">+50%</b> faster per level.`,

                res: "grass",
                icon: ['Icons/Speed'],
                
                cost: i => Decimal.pow(2,i).mul(3).ceil(),
                bulk: i => i.div(3).max(1).log(2).floor().toNumber()+1,

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
                
                cost: i => Decimal.pow(1.15,i).mul(100).ceil(),
                bulk: i => i.div(100).max(1).log(1.15).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 10,

                title: "Range",
                desc: `Increase grass cut range by <b class="green">+10</b> per level. Base is 70.`,

                res: "grass",
                icon: ['Icons/Range'],
                
                cost: i => Decimal.pow(15,i).mul(200).ceil(),
                bulk: i => i.div(200).max(1).log(15).floor().toNumber()+1,

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: Infinity,

                unl: _=>player.pTimes>0,

                title: "PP",
                desc: `Increase prestige points (PP) gained by <b class="green">+50%</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

                res: "grass",
                icon: ['Curr/Prestige'],
                
                cost: i => Decimal.pow(1.25,i).mul(3e10).ceil(),
                bulk: i => i.div(3e10).max(1).log(1.25).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)
                    x = x.pow(upgEffect('crystal',4)+(tmp.chargeEff[2]||0))
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
        reqDesc: _=>player.decel?`You can't gain Perks in Anti-Realm!`:`Reach Level 1 to unlock.`,

        underDesc: _=>`You have ${format(tmp.perkUnspent,0)} Perk`,

        autoUnl: _=>hasUpgrade('assembler',3),

        ctn: [
            {
                max: 100,

                costOnce: true,

                title: "Value Perk",
                desc: `Increase Grass gain by <b class="green">+25%</b> per level, multiplied by experience level.`,

                res: "perk",
                icon: ['Curr/Grass'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = Decimal.mul(player.level*i,0.25).add(1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 10,

                costOnce: true,

                title: "Cap Perk",
                desc: `Increase grass cap by <b class="green">10</b> per level.`,

                res: "perk",
                icon: ['Icons/MoreGrass'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 10,

                costOnce: true,

                title: "Grow Speed Perk",
                desc: `Increase grass grow speed by <b class="green">+25%</b> per level.`,

                res: "perk",
                icon: ['Icons/Speed'],
                
                cost: i => 1,
                bulk: i => i,

                effect(i) {
                    let x = 1+i/4

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                costOnce: true,

                title: "XP Perk",
                desc: `Increase XP gain by <b class="green">+50%</b> per level.`,

                res: "perk",
                icon: ['Icons/XP'],
                
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
                
                cost: i => 3,
                bulk: i => Math.floor(i/3),

                effect(i) {
                    let x = i*10

                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                max: 1,

                costOnce: true,

                title: "Grow Amount Perk",
                desc: `Increase the grass grow amount by <b class="green">1</b>.`,

                res: "perk",
                icon: ['Icons/MoreGrass', "Icons/StarSpeed"],
                
                cost: i => 10,
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
                
                cost: i => 10,
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
                
                cost: i => 15,
                bulk: i => Math.floor(i/15),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 50,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Crystal Perk",
                desc: `Increase Crystal gain by <b class="green">+25%</b> per level.`,

                res: "perk",
                icon: ['Curr/Crystal'],
                
                cost: i => 15,
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
        req: _=>player.level >= 5 || player.pTimes > 0,
        reqDesc: _=>`Reach Level 5 to unlock.`,

        ctn: [
            {
                max: 5,

                title: "Autocut",
                desc: `Auto cuts grass every <b class="green">5</b> seconds. (-1s every level after the first)`,
            
                res: "grass",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => Decimal.pow(100,i).mul(1e3).ceil(),
                bulk: i => i.div(1e3).max(1).log(100).floor().toNumber()+1,
            
                effect(i) {
                    let x = Math.max(i-1,0)
            
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
                max: 5,

                title: "Autocut Amount",
                desc: `Increases auto cut amount by <b class="green">1</b>.`,
            
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
                unl: _=>player.grasshop>=1 || galUnlocked(),

                title: "Perk Save C",
                desc: `Keep perks on Crystalize.`,
            
                res: "crystal",
                icon: ['Curr/Perks','Icons/StarProgression'],
                            
                cost: i => E(1e7),
                bulk: i => 1,
            },{
                unl: _=>player.grasshop>=1 || galUnlocked(),

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
        reqDesc: _=>`Reach Tier 2 to unlock.`,

        underDesc: _=>`You have ${format(player.plat,0)} Platinum (${formatPercent(tmp.platChance)} grow chance)`,

        ctn: [
            {
                max: 8,

                costOnce: true,

                title: "Starter AC",
                desc: `Decreases auto cut time by <b class="green">0.1</b> seconds per level.`,

                res: "plat",
                icon: ['Curr/Grass','Icons/Automation'],
                
                cost: i => 5,
                bulk: i => Math.floor(i/5),

                effect(i) {
                    let x = i/10

                    return x
                },
                effDesc: x => format(tmp.autocut)+" seconds",
            },{
                max: 10,

                costOnce: true,

                title: "Starter XP",
                desc: `Increase XP gain by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Icons/XP'],
                
                cost: i => 3,
                bulk: i => Math.floor(i/3),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 10,

                costOnce: true,

                title: "Starter Grass",
                desc: `Increase grass gain by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Curr/Grass'],
                
                cost: i => 3,
                bulk: i => Math.floor(i/3),

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

                unl: _=>player.aRes.aTimes>0,

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

                unl: _=>player.aRes.lTimes>0,

                costOnce: true,

                title: "Platinum Oil",
                desc: `Increase Oil gain by <b class="green">+50%</b> per level.`,

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

// <b class="green"></b>
// <b class="yellow"></b>

/*
{
    title: "Placeholder",
    desc: `Placeholder.`,

    res: "grass",
                
    cost: i => Decimal.pow(1.15,i).mul(10).ceil(),
    bulk: i => i.div(10).max(1).log(1.15).floor().toNumber()+1,

    effect(i) {
        let x = E(1)

        return x
    },
    effDesc: x => format(x)+"x",
},
*/

const UPGS_SCOST = {}

function clickUpgrade(id, x) {
	if (shiftDown) buyMaxUpgrade(id, x)
	else tmp.upg_ch[id] = x
}

function buyUpgrade(id, x, type = "once", amt) {
	//Upgrade Data
	let tu = tmp.upgs[id]
	let upg = UPGS[id].ctn[x]
	let upgData = player.upgs[id]

	//Determine Levels
	let lvl = upgData[x] || 0
	let bulk = amt ? getUpgradeBulk(id, x, amt) : tu.bulk[x]
	if (type == "next") bulk = Math.min(bulk, Math.ceil((lvl + 1) / 25) * 25)

	bulk = Math.min(bulk, tu.max[x])
	if (lvl >= bulk) return
	if (type == "once") bulk = lvl + 1
	if (tu.cannotBuy) return

	//Spend Resource
	if (!tu.noSpend) {
		let res = upg.res
		let cost = upg.costOnce ? tu.cost[x] * (bulk - lvl) : upg.cost(bulk - 1)

		if (res == 'perk') {
			player.spentPerk += cost
			tmp.perkUnspent = Math.max(player.maxPerk - player.spentPerk, 0)
		} else {
			let [p,q] = UPG_RES[res][1]()
			p[q] = isResNumber.includes(res) ? Math.max(p[q]-cost, 0) : p[q].sub(cost).max(0)
		}
		updateUpgResource(res)
	}

	upgData[x] = bulk
	updateUpgTemp(id)
}

function buyNextUpgrade(id, x) {
	buyUpgrade(id, x, "next")
}

function buyMaxUpgrade(id, x) {
	buyUpgrade(id, x, "max")
}

function buyAllUpgrades(id) {
    let upgs = UPGS[id]
    for (let [x, upg] of Object.entries(upgs.ctn)) {
        if (upg.unl ? upg.unl() : true) buyUpgrade(id, x, "max")
    }
}

function getUpgradeResource(id, x) {
	return tmp.upg_res[UPGS[id].ctn[x].res]
}

function getUpgradeBulk(id, x, amt) {
	let upg = UPGS[id].ctn[x]
	let tu = tmp.upgs[id]
	let res = amt || getUpgradeResource(id, x)

	let lvl = 0
	let min = player.upgs[id][x] || 0
	if (upg.costOnce) lvl = Math.floor(res / tu.cost[x]) + min
	else if (E(res).gte(tu.cost[x])) lvl = upg.bulk(E(res))
	else lvl = min

	return lvl
}

function updateUpgTemp(id) {
    let upgs = UPGS[id]
    let uc = upgs.ctn
    let tu = tmp.upgs[id]
    let ul = 0
    for (let x = 0; x < uc.length; x++) {
        let upg = uc[x]
        let amt = player.upgs[id][x]||0
        let res = tmp.upg_res[upg.res]
        
        tu.max[x] = (typeof upg.max == "function"?upg.max():upg.max)||1
        if (upg.unl?upg.unl():true) if (amt < tu.max[x]) ul++

        tu.cost[x] = upg.cost(amt)
        tu.bulk[x] = getUpgradeBulk(id, x)

        if (upg.effect) {
			tu.eff[x] = upg.effect(amt)
		}
    }
    if (upgs.cannotBuy) tu.cannotBuy = upgs.cannotBuy()
    if (upgs.noSpend) tu.noSpend = upgs.noSpend()
    if (upgs.autoUnl) tu.autoUnl = upgs.autoUnl()
    tu.unlLength = ul
}

function switchAutoUpg(id) {
    player.autoUpg[id] = !player.autoUpg[id]
}

function setupUpgradesHTML(id) {
	let table = new Element("upgs_div_"+id)

	if (table.el) {
		let upgs = UPGS[id]
		let html = ""

		table.addClass(id)

		html += `
			<div style="height: 40px;">
				${upgs.title} <button class="buyAllUpg" onclick="buyAllUpgrades('${id}')">Buy All</button><button class="buyAllUpg" id="upg_auto_${id}" onclick="switchAutoUpg('${id}')">Auto: OFF</button> ${upgs.btns ?? ''}
			</div><div id="upgs_ctn_${id}" class="upgs_ctn">
			</div><div style="height: 40px;" id="upg_under_${id}">
			</div>
			<div id="upg_desc_div_${id}" class="upg_desc ${id}">
				<div id="upg_desc_${id}"></div>
				<div style="position: absolute; bottom: 0; width: 100%;">
					<button onclick="tmp.upg_ch.${id} = -1">Close</button>
					<button id="upg_buy_${id}" onclick="buyUpgrade('${id}',tmp.upg_ch.${id})">Buy 1</button>
					<button id="upg_buy_next_${id}" onclick="buyNextUpgrade('${id}',tmp.upg_ch.${id})">Buy Next</button>
					<button id="upg_buy_max_${id}" onclick="buyMaxUpgrade('${id}',tmp.upg_ch.${id})">Buy Max</button>
				</div>
			</div>
			<div id="upg_req_div_${id}" class="upg_desc ${id}">
				<div id="upg_req_desc_${id}" style="position:absolute;top:50%;width: 100%;transform:translateY(-50%);font-size:30px;"></div>
			</div>
		`

		table.setHTML(html)

		html = ""

		for (let x in UPGS[id].ctn) {
			let upg = UPGS[id].ctn[x]
			let icon = [id=='auto'&&x==0?'Bases/AutoBase':'Bases/'+UPG_RES[upg.res][2]]
			if (upg.icon) for (i in upg.icon) icon.push(upg.icon[i])
			else icon.push('Icons/Placeholder')

			html += `
				<div class="upg_ctn" id="upg_ctn_${id}${x}" onclick="clickUpgrade('${id}', ${x})">`
			for (i in icon) html +=
				`<img draggable="false" src="${"images/"+icon[i]+".png"}">`
			html += `
				<img id="upg_ctn_${id}${x}_max_base"  draggable="false" src="${"images/max.png"}">
				<div id="upg_ctn_${id}${x}_cost" class="upg_cost"></div>
				<div class="upg_tier">${upg.tier ? upg.tier : ""}</div>
				<div id="upg_ctn_${id}${x}_amt" class="upg_amt">argh</div>
				<div class="upg_max" id="upg_ctn_${id}${x}_max" class="upg_max">Maxed!</div>
			</div>
			`
		}

		new Element(`upgs_ctn_${id}`).setHTML(html)
	}
}

function updateUpgradesHTML(id) {
    let upgs = UPGS[id]
    let height = document.getElementById(`upgs_ctn_${id}`).offsetHeight-25
    let tu = tmp.upgs[id]
    let ch = tmp.upg_ch[id]

    let unl = upgs.unl?upgs.unl():true
    tmp.el["upgs_div_"+id].setDisplay(unl)

    if (unl) {
        let req = upgs.req?upgs.req():true

        tmp.el["upg_req_div_"+id].setDisplay(!req)

        if (req) {
            if (upgs.underDesc) tmp.el["upg_under_"+id].setHTML(upgs.underDesc())
            tmp.el["upg_desc_div_"+id].setDisplay(ch > -1)

            if (ch > -1) {
                let upg = UPGS[id].ctn[ch]
                let amt = player.upgs[id][ch]||0
                let res = tmp.upg_res[upg.res]
                let dis = UPG_RES[upg.res][0]

                let h = `
                [#${ch+1}] <h2>${upg.title}</h2><br>
                Level <b class="yellow">${format(amt,0)}${tu.max[ch] < Infinity ? ` / ${format(tu.max[ch],0)}` : ""}</b><br>
                ${upg.desc}
                `

                if (upg.effDesc) h += '<br>Effect: <span class="cyan">'+upg.effDesc(tu.eff[ch])+"</span>"
                h += '<br>'

                let canBuy = Decimal.gte(tmp.upg_res[upg.res], tu.cost[ch])
                let hasBuy25 = (Math.floor(amt / 25) + 1) * 25 < tu.max[ch]
                let hasMax = amt + 1 < tu.max[ch]

                if (amt < tu.max[ch]) {
                    h += `<br><span class="${canBuy?"green":"red"}">Cost: ${format(tu.cost[ch],0)} ${dis}</span>`

                    let cost2 = upg.costOnce?Decimal.mul(tu.cost[ch],25-amt%25):upg.cost((Math.floor(amt/25)+1)*25-1)
                    let cost3 = upg.costOnce?Decimal.mul(tu.cost[ch],tu.max[ch]-amt):upg.cost(tu.max[ch]-1)
                    if (hasBuy25) h += `<br><span class="${Decimal.gte(tmp.upg_res[upg.res],cost2)?"green":"red"}">Next 25: ${format(cost2,0)} ${dis}</span>`
                    else if (hasMax) h += `<br><span class="${Decimal.gte(tmp.upg_res[upg.res],cost3)?"green":"red"}">Max: ${format(cost3,0)} ${dis}</span>`

                    h += `<br>You have ${format(res,0)} ${dis}`
                } else h += "<br><b class='pink'>Maxed!</b>"

                tmp.el["upg_desc_"+id].setHTML(h)
                tmp.el["upg_buy_"+id].setClasses({ locked: !canBuy })
                tmp.el["upg_buy_"+id].setDisplay(amt < tu.max[ch])
                tmp.el["upg_buy_"+id].setTxt("Buy" + (hasMax ? " 1" : ""))
                tmp.el["upg_buy_next_"+id].setClasses({ locked: !canBuy })
                tmp.el["upg_buy_next_"+id].setDisplay(hasBuy25)
                tmp.el["upg_buy_max_"+id].setClasses({ locked: !canBuy })
                tmp.el["upg_buy_max_"+id].setDisplay(hasMax)
            }

            if (ch < 0) {
                tmp.el["upg_auto_"+id].setDisplay(tu.autoUnl)
                if (tu.autoUnl) tmp.el["upg_auto_"+id].setTxt("Auto: "+(player.autoUpg[id]?"ON":"OFF"))

                for (let x = 0; x < upgs.ctn.length; x++) {
                    let upg = upgs.ctn[x]
                    let div_id = "upg_ctn_"+id+x
                    let amt = player.upgs[id][x]||0

                    let unlc = (upg.unl?upg.unl():true) && (player.options.hideUpgOption ? amt < tu.max[x] : true)
                    tmp.el[div_id].setDisplay(unlc)

                    if (!unlc) continue

                    let res = tmp.upg_res[upg.res]

                    tmp.el[div_id].changeStyle("width",height+"px")
                    tmp.el[div_id].changeStyle("height",height+"px")

                    tmp.el[div_id+"_cost"].setTxt(amt < tu.max[x] ? format(tu.cost[x],0)+" "+UPG_RES[upg.res][0] : "")
                    tmp.el[div_id+"_cost"].setClasses({upg_cost: true, locked: Decimal.lt(res,tu.cost[x]) && amt < tu.max[x]})

                    tmp.el[div_id+"_amt"].setTxt(amt < tu.max[x] ? format(amt,0) : "")
                    tmp.el[div_id+"_max"].setDisplay(amt >= tu.max[x])
                    tmp.el[div_id+"_max_base"].setDisplay(amt >= tu.max[x])
                }
            }
        } else if (upgs.reqDesc) tmp.el["upg_req_desc_"+id].setHTML(upgs.reqDesc())
    }
}

function hasUpgrade(id,x) { return player.upgs[id][x] > 0 }
function hasUpgrades(id) {
	for (let i of player.upgs[id]) {
		if (i > 0) return true 
	}
	return false
}
function upgEffect(id,x,def=1) { return tmp.upgs[id].eff[x] || def }

function resetUpgrades(id) {
    for (let x in UPGS[id].ctn) player.upgs[id][x] = 0
}

function updateUpgResource(id) {
    let [p,q] = UPG_RES[id][1]()
    tmp.upg_res[id] = p?.[q] || 0
}

function toggleOption(x) { player.options[x] = !player.options[x] }

tmp_update.push(_=>{
    for (let x in UPG_RES) updateUpgResource(x)
    for (let x in UPGS) updateUpgTemp(x)
})

el.setup.upgs = _=>{
    for (let x in UPGS) setupUpgradesHTML(x)
}

el.update.upgs = _=>{
    if (mapID == 'g') {
        updateUpgradesHTML('grass')
        updateUpgradesHTML('aGrass')
    }
    if (mapID == 'upg') {
        updateUpgradesHTML('perk')
        updateUpgradesHTML('plat')
        tmp.el.losePerksBtn.setDisplay(hasUpgrade('auto', 5))
        tmp.el.losePerks.setTxt(player.options.losePerks ? "OFF" : "ON")
    }
	if (mapID == 'auto') {
		updateUpgradesHTML('auto')
		updateUpgradesHTML('aAuto')
		updateUpgradesHTML('assembler')
	}
    if (mapID == 'pc') {
        updateUpgradesHTML('pp')
        updateUpgradesHTML('crystal')

        updateUpgradesHTML('ap')
        updateUpgradesHTML('oil')
    }
    if (mapID == 'gh') {
        updateUpgradesHTML('factory')
        updateUpgradesHTML('funMachine')
    }
    if (mapID == 'fd') {
        updateUpgradesHTML('foundry')
        updateUpgradesHTML('gen')

        updateUpgradesHTML('fundry')
        updateUpgradesHTML('sfrgt')
    }
    if (mapID == 'rf') {
        updateUpgradesHTML('rocket')
        updateUpgradesHTML('momentum')
    }

	if (mapID == 'opt') {
		tmp.el.scientific.setTxt(player.options.scientific?"ON":"OFF")
		tmp.el.grassCap.setTxt(player.options.lowGrass?250:"Unlimited")
		tmp.el.hideUpgOption.setTxt(player.options.hideUpgOption?"ON":"OFF")
		tmp.el.hideMilestoneBtn.setDisplay(player.grasshop > 0 || player.sTimes > 0)
		tmp.el.hideMilestone.setTxt(player.options.hideMilestone?"At last obtained":"All")
	}
	if (mapID == 'stats') {
		tmp.el.time.setHTML("Time: " + formatTime(player.time))

		let stats = !player.decel && !inSpace()
		tmp.el.stats.setDisplay(stats || player.options.allStats)
		if (stats || player.options.allStats) {
			tmp.el.pTimes.setHTML((player.pTimes ? "You have done " + player.pTimes + " <b style='color: #5BFAFF'>Prestige</b> resets." : "") + (!player.decel && player.pTimes ? "<br>Time: " + formatTime(player.pTime) : ""))
			tmp.el.cTimes.setHTML((player.cTimes ? "You have done " + player.cTimes + " <b style='color: #FF84F6'>Crystalize</b> resets." : "") + (!player.decel && player.cTimes ? "<br>Time: " + formatTime(player.cTime) : ""))
			tmp.el.sTimes.setHTML(player.sTimes ? "You have done " + player.sTimes + " <b style='color: #c5c5c5'>Steelie</b> resets.<br>Time: " + formatTime(player.sTime) : "")
		}

		let aStats = player.decel && !inSpace()
		tmp.el.aStats.setDisplay(aStats || player.options.allStats)
		if (aStats || player.options.allStats) {
			tmp.el.aTimes.setHTML(player.aRes.aTimes ? "You have done " + player.aRes.aTimes + " <b style='color: #FF4E4E'>Anonymity</b> resets.<br>Time: " + formatTime(player.aRes.aTime) : "")
			tmp.el.lTimes.setHTML(player.aRes.lTimes ? "You have done " + player.aRes.lTimes + " <b style='color: #2b2b2b'>Liquefy</b> resets.<br>Time: " + formatTime(player.aRes.lTime) : "")
		}

		let gStats = inSpace()
		let gStatsUnl = galUnlocked()
		tmp.el.gStats.setDisplay(gStatsUnl && (gStats || player.options.allStats))
		if (gStatsUnl && (gStats || player.options.allStats)) {
			tmp.el.gTimes.setHTML(player.gal.times ? "You have done " + player.gal.times + " <b style='color: #bf00ff'>Galactic</b> resets.<br>Time: " + formatTime(player.gal.time) : "")
			tmp.el.sacTimes.setHTML(player.gal.sacTimes ? "You have done " + player.gal.sacTimes + " <b style='color: #bf00ff'>Sacrifice</b> resets.<br>Time: " + formatTime(player.gal.sacTime) : "")
		}

		tmp.el.allStatsBtn.setDisplay(hasUpgrade('factory', 4) || galUnlocked())
		tmp.el.allStats.setTxt(player.options.allStats ? "All" : "This realm")
	}
}