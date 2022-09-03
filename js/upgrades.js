const U_STEP = [1,25,1/0]

const UPG_RES = {
    grass: ["Grass",_=>[player,"grass"],'GrassBase'],
    perk: ["Perk",_=>[tmp,"perkUnspent"],'PerkBase'],
    pp: ["PP",_=>[player,"pp"],'PrestigeBase'],
    plat: ["Platinum",_=>[player,"plat"],"PlatBase"],
    crystal: ["Crystal",_=>[player,"crystal"],"CrystalBase"],
    steel: ["Steel",_=>[player,"steel"],"GrasshopBase"],
    aGrass: ["Anti-Grass",_=>[player,"aGrass"],'AntiGrassBase'],
    ap: ["AP",_=>[player,"ap"],'AnonymityBase'],
    oil: ["Oil",_=>[player,"oil"],'LiquefyBase'],
}

const isResNumber = ['perk','plat']

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
                desc: `Increase Grass gain by <b class="green">0.5</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

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
                desc: `Increase grass cap by <b class="green">1</b> per level.`,

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
                desc: `Increase grass grow speed by <b class="green">20%</b> per level.`,

                res: "grass",
                icon: ['Icons/Speed'],
                
                cost: i => Decimal.pow(1.15,i).mul(5).ceil(),
                bulk: i => i.div(5).max(1).log(1.15).floor().toNumber()+1,

                effect(i) {
                    let x = i/5+1

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: Infinity,

                title: "XP",
                desc: `Increase experience (XP) gained by <b class="green">1</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

                res: "grass",
                icon: ['Icons/XP'],
                
                cost: i => Decimal.pow(1.15,i).mul(100).ceil(),
                bulk: i => i.div(100).max(1).log(1.15).floor().toNumber()+1,

                effect(i) {
                    let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 5,

                title: "Range",
                desc: `Increase grass cut range by <b class="green">10</b> per level. Base is 50.`,

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
                    x = x.pow(upgEffect('crystal',4))
                    return x
                },
                effDesc: x => x.format()+"x",
            },
        ],
    },
    perk: {
        title: "Perk Upgrades",

        cannotBuy: _=>inChal(3),

        req: _=>player.level >= 1 || player.pTimes > 0,
        reqDesc: _=>`Reach Level 1 to unlock.`,

        underDesc: _=>`You have ${format(tmp.perkUnspent,0)} Perk`,

        autoUnl: _=>hasUpgrade('assembler',3),

        ctn: [
            {
                max: 200,

                costOnce: true,

                title: "Value Perk",
                desc: `Increase Grass gain by <b class="green">25%</b> per level, multiplied by experience level.`,

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
                desc: `Increase grass grow speed by <b class="green">25%</b> per level.`,

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
                max: 200,

                costOnce: true,

                title: "XP Perk",
                desc: `Increase XP gain by <b class="green">50%</b> per level.`,

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
                max: 100,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "PP Perk",
                desc: `Increase PP gain by <b class="green">50%</b> per level.`,

                res: "perk",
                icon: ['Curr/Prestige'],
                
                cost: i => 5,
                bulk: i => Math.floor(i/5),

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
                desc: `Increase TP gain by <b class="green">25%</b> per level.`,

                res: "perk",
                icon: ['Icons/TP'],
                
                cost: i => 10,
                bulk: i => Math.floor(i/10),

                effect(i) {
                    let x = E(i/4+1)

                    return x
                },
                effDesc: x => x.format()+"x",
            },{
                max: 50,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Crystal Perk",
                desc: `Increase Crystal gain by <b class="green">25%</b> per level.`,

                res: "perk",
                icon: ['Curr/Crystal'],
                
                cost: i => 10,
                bulk: i => Math.floor(i/10),

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

        req: _=>player.level >= 5 || player.pTimes > 0,
        reqDesc: _=>`Reach Level 5 to unlock.`,

        ctn: [
            {
                max: 5,

                title: "Autocut",
                desc: `Auto cuts grass every <b class="green">5</b> seconds (-1s every level after the first).`,
            
                res: "grass",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => Decimal.pow(10,i).mul(1e3).ceil(),
                bulk: i => i.div(1e3).max(1).log(10).floor().toNumber()+1,
            
                effect(i) {
                    let x = Math.max(i-1,0)
            
                    return x
                },
                effDesc: x => format(tmp.autocut)+" seconds",
            },{
                unl: _=>player.pTimes>0,
                max: 5,

                title: "Autocut Value",
                desc: `Auto cuts grass is worth <b class="green">+100%</b> more grass, XP & TP.`,
            
                res: "pp",
                icon: ['Curr/Grass','Icons/StarSpeed'],
                            
                cost: i => Decimal.pow(3,i).mul(20).ceil(),
                bulk: i => i.div(20).max(1).log(3).floor().toNumber()+1,
            
                effect(i) {
                    let x = E(i+1)
            
                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                unl: _=>player.pTimes>0,
                max: 5,

                title: "Autocut Amount",
                desc: `Increases auto cut amount by <b class="green">1</b>.`,
            
                res: "pp",
                icon: ['Icons/MoreGrass','Icons/StarSpeed'],
                            
                cost: i => Decimal.pow(5,i).mul(25).ceil(),
                bulk: i => i.div(25).max(1).log(5).floor().toNumber()+1,
            
                effect(i) {
                    let x = i
            
                    return x
                },
                effDesc: x => "+"+format(x,0),
            },{
                unl: _=>player.pTimes>0,

                title: "Grass Upgrade Autobuy",
                desc: `You can now automatically buy Grass Upgrades.`,
            
                res: "pp",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => E(1e3),
                bulk: i => 1,
            },{
                unl: _=>player.cTimes>0,

                title: "Perk Save P",
                desc: `Keep perks on Prestige.`,
            
                res: "pp",
                icon: ['Curr/Perks','Icons/Automation'],
                            
                cost: i => E(1e10),
                bulk: i => 1,
            },{
                unl: _=>player.cTimes>0,

                title: "Prestige Upgrade Autobuy",
                desc: `You can now automatically buy Prestige Upgrades.`,
            
                res: "crystal",
                icon: ['Curr/Prestige','Icons/Automation'],
                            
                cost: i => E(1e3),
                bulk: i => 1,
            },{
                unl: _=>player.grasshop>=1,

                title: "Perk Save C",
                desc: `Keep perks on Crystalize.`,
            
                res: "crystal",
                icon: ['Curr/Perks','Icons/Automation'],
                            
                cost: i => E(1e9),
                bulk: i => 1,
            },{
                unl: _=>player.grasshop>=1,

                title: "Crystal Upgrade Autobuy",
                desc: `You can now automatically buy Crystal Upgrades.`,
            
                res: "crystal",
                icon: ['Curr/Crystal','Icons/Automation'],
                            
                cost: i => E(1e10),
                bulk: i => 1,
            },{
                unl: _=>player.grasshop>=1,

                max: 10,

                title: "PP Generation",
                desc: `Passively generate <b class="green">+0.1%</b> of PP you would earn on prestige per second.`,
            
                res: "pp",
                icon: ['Curr/Prestige','Icons/Plus'],
                            
                cost: i => Decimal.pow(3,i).mul(1e25),
                bulk: i => i.div(1e25).max(1).log(3).floor().toNumber()+1,
                effect(i) {
                    let x = i/1e3
            
                    return x
                },
                effDesc: x => "+"+formatPercent(x,1)+"/s",
            },{
                unl: _=>player.grasshop>=1,

                max: 10,

                title: "Crystal Generation",
                desc: `Passively generate <b class="green">+0.1%</b> of crystal you would earn on crystalize per second.`,
            
                res: "crystal",
                icon: ['Curr/Crystal','Icons/Plus'],
                            
                cost: i => Decimal.pow(2,i).mul(1e12).ceil(),
                bulk: i => i.div(1e12).max(1).log(2).floor().toNumber()+1,
                effect(i) {
                    let x = i/1e3
            
                    return x
                },
                effDesc: x => "+"+formatPercent(x,1)+"/s",
            },{
                unl: _=>player.lTimes>0,

                title: "Anti-Grass Upgrades Autobuy",
                desc: `You can now automatically buy Anti-Grass Upgrades.`,
            
                res: "ap",
                icon: ['Curr/Grass','Icons/Automation'],
                            
                cost: i => E(100),
                bulk: i => 1,
            },{
                unl: _=>player.lTimes>0,

                title: "Anonymity Upgrades Autobuy",
                desc: `You can now automatically buy Anonymity Upgrades.`,
            
                res: "oil",
                icon: ['Curr/Anonymity','Icons/Automation'],
                            
                cost: i => E(100),
                bulk: i => 1,
            }
        ],
    },
    plat: {
        title: "Platinum Upgrades",

        unl: _=>player.pTimes>0,

        req: _=>player.tier >= 3||player.cTimes > 0,
        reqDesc: _=>`Reach Tier 3 to unlock.`,

        underDesc: _=>`You have ${format(player.plat,0)} Platinum (${formatPercent(tmp.platChance)} grow chance)`,

        ctn: [
            {
                max: 7,

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
                max: 20,

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
                max: 20,

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
                max: 50,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Plat PP",
                desc: `Increase PP gain by <b class="green">+25%</b> per level.`,

                res: "plat",
                icon: ['Curr/Prestige'],
                
                cost: i => 20,
                bulk: i => Math.floor(i/20),

                effect(i) {
                    let x = E(i/4+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 20,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Plat TP",
                desc: `Increase TP gain by <b class="green">+25%</b> per level.`,

                res: "plat",
                icon: ['Icons/TP'],
                
                cost: i => 100,
                bulk: i => Math.floor(i/100),

                effect(i) {
                    let x = E(i/4+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 20,

                unl: _=>player.cTimes>0,

                costOnce: true,

                title: "Plat Crystal",
                desc: `Increase Crystal gain by <b class="green">+25%</b> per level.`,

                res: "plat",
                icon: ['Curr/Crystal'],
                
                cost: i => 100,
                bulk: i => Math.floor(i/100),

                effect(i) {
                    let x = E(i/4+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.sTimes>0,

                costOnce: true,

                title: "Plat Steel",
                desc: `Increase steel gain by <b class="green">+50%</b> per level.`,

                res: "plat",
                icon: ['Curr/Steel2'],
                
                cost: i => 200,
                bulk: i => Math.floor(i/200),

                effect(i) {
                    let x = E(i/2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.aTimes>0,

                costOnce: true,

                title: "Plat Anonymity",
                desc: `Increase AP gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Anonymity'],
                
                cost: i => 10000,
                bulk: i => Math.floor(i/10000),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },{
                max: 100,

                unl: _=>player.lTimes>0,

                costOnce: true,

                title: "Platinum Oil",
                desc: `Increase Oil gain by <b class="green">+20%</b> per level.`,

                res: "plat",
                icon: ['Curr/Oil'],
                
                cost: i => 25000,
                bulk: i => Math.floor(i/25000),

                effect(i) {
                    let x = E(i*0.2+1)

                    return x
                },
                effDesc: x => format(x)+"x",
            },
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

function buyUpgrade(id, x, type = "once") {
	let tu = tmp.upgs[id]
	if (tu.cannotBuy) return

	let upg = UPGS[id].ctn[x]
	let upgData = player.upgs[id]
	let resDis = upg.res
	let res = tmp.upg_res[resDis]
	let costOnce = upg.costOnce
	let numInc = isResNumber.includes(resDis)

	if (E(tu.cost[x]).gt(res)) return
	if (type == "auto") res = numInc ? Math.max(res / tu.unlLength, tu.cost[x]) : res.div(tu.unlLength).max(tu.cost[x])

	let amt = upgData[x] || 0
	if (amt >= tu.max[x]) return

	let bulk = type == "auto" ? upg.bulk(res) : tu.bulk[x]
	if (costOnce) bulk += amt
	if (type == "next") bulk = Math.min(bulk, Math.ceil((amt + 1) / 25) * 25)
	if (type == "once") bulk = amt + 1
	else bulk = Math.floor(bulk)
	bulk = Math.min(bulk, tu.max[x])

	if (amt >= bulk) return

	let [p,q] = UPG_RES[resDis][1]()
	let cost = costOnce ? tu.cost[x] * (bulk - amt) : upg.cost(bulk-1)

	upgData[x] = bulk
	if (resDis == 'perk') {
		player.spentPerk += cost
		tmp.perkUnspent = Math.max(player.maxPerk-player.spentPerk,0)
	} else if (!tu.noSpend) {
		p[q] = numInc ? Math.max(p[q]-cost, 0) : p[q].sub(cost).max(0)
	}

	updateUpgResource(resDis)
	updateUpgTemp(id)
}

function buyNextUpgrade(id, x) {
	buyUpgrade(id, x, "next")
}

function buyMaxUpgrade(id, x, auto) {
	buyUpgrade(id, x, auto ? "auto" : "max")
}

function switchAutoUpg(id) {
    player.autoUpg[id] = !player.autoUpg[id]
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
        
        tu.max[x] = upg.max||1
        if (upg.unl?upg.unl():true) if (amt < tu.max[x]) ul++

        tu.cost[x] = upg.cost(amt)
        tu.bulk[x] = Decimal.gte(res,UPGS_SCOST[id][x])?Math.min(upg.bulk(res),tu.max[x]):0

        if (upg.effect) tu.eff[x] = upg.effect(amt)
    }
    if (upgs.cannotBuy) tu.cannotBuy = upgs.cannotBuy()
    if (upgs.noSpend) tu.noSpend = upgs.noSpend()
    if (upgs.autoUnl) tu.autoUnl = upgs.autoUnl()
    tu.unlLength = ul
}

function setupUpgradesHTML(id) {
    let table = new Element("upgs_div_"+id)

    if (table.el) {
        let upgs = UPGS[id]
        let html = ""

        table.addClass(id)

        html += `
        <div style="height: 40px;">
            ${upgs.title} <button class="buyAllUpg" onclick="buyMaxUpgrades('${id}')">Buy All</button><button class="buyAllUpg" id="upg_auto_${id}" onclick="switchAutoUpg('${id}')">Auto: OFF</button>
        </div><div id="upgs_ctn_${id}" class="upgs_ctn">
        </div><div style="height: 40px;" id="upg_under_${id}">
            
        </div>
        <div id="upg_desc_div_${id}" class="upg_desc ${id}">
            <div id="upg_desc_${id}"></div>
            <div style="position: absolute; bottom: 0; width: 100%;">
                <button onclick="tmp.upg_ch.${id} = -1">Cancel</button>
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

        let height = document.getElementById(`upgs_ctn_${id}`).offsetHeight-25

        html = ""

        for (let x in UPGS[id].ctn) {
            let upg = UPGS[id].ctn[x]
            let icon = [id=='auto'&&x==0?'Bases/AutoBase':'Bases/'+UPG_RES[upg.res][2]]
            if (upg.icon) for (i in upg.icon) icon.push(upg.icon[i])
            else icon.push('Icons/Placeholder')

            html += `
            <div class="upg_ctn" id="upg_ctn_${id}${x}" style="width: ${height}px; height: ${height}px;" onclick="tmp.upg_ch.${id} = ${x}">`
            for (i in icon) html +=
                `<img draggable="false" src="${"images/"+icon[i]+".png"}">`
            html += `
                <div id="upg_ctn_${id}${x}_cost" class="upg_cost"></div>
                <div id="upg_ctn_${id}${x}_amt" class="upg_amt">argh</div>
                <div id="upg_ctn_${id}${x}_max" class="upg_max">Maxed!</div>
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

                if (amt < tu.max[ch]) {
                    let cost2 = upg.costOnce?Decimal.mul(tu.cost[ch],25-amt%25):upg.cost((Math.floor(amt/25)+1)*25-1)//upg.cost(amt+25)

                    if (tu.max[ch] >= 25) h += `<br><span class="${Decimal.gte(tmp.upg_res[upg.res],cost2)?"green":"red"}">Cost to next 25: ${format(cost2,0)} ${dis}</span>`
                    h += `
                    <br><span class="${Decimal.gte(tmp.upg_res[upg.res],tu.cost[ch])?"green":"red"}">Cost: ${format(tu.cost[ch],0)} ${dis}</span>
                    <br>You have ${format(res,0)} ${dis}
                    `
                } else h += "<br><b class='lavender'>Maxed!</b>"

                tmp.el["upg_desc_"+id].setHTML(h)
                tmp.el["upg_buy_"+id].setClasses({ locked: Decimal.lt(tmp.upg_res[upg.res],tu.cost[ch]) })
                tmp.el["upg_buy_next_"+id].setClasses({ locked: Decimal.lt(tmp.upg_res[upg.res],tu.cost[ch]) })
                tmp.el["upg_buy_max_"+id].setClasses({ locked: Decimal.lt(tmp.upg_res[upg.res],tu.cost[ch]) })
                tmp.el["upg_buy_next_"+id].setDisplay(tu.max[ch] >= 25)
            }

            if (ch < 0) {
                tmp.el["upg_auto_"+id].setDisplay(tu.autoUnl)
                if (tu.autoUnl) tmp.el["upg_auto_"+id].setTxt("Auto: "+(player.autoUpg[id]?"ON":"OFF"))

                for (let x = 0; x < upgs.ctn.length; x++) {
                    let upg = upgs.ctn[x]
                    let div_id = "upg_ctn_"+id+x
                    let amt = player.upgs[id][x]||0

                    let unlc = (upg.unl?upg.unl():true) && (player.options.hideUpgOption?amt < tu.max[x]:true)
                    tmp.el[div_id].setDisplay(unlc)

                    if (!unlc) continue

                    let res = tmp.upg_res[upg.res]

                    tmp.el[div_id].changeStyle("width",height+"px")
                    tmp.el[div_id].changeStyle("height",height+"px")

                    tmp.el[div_id+"_cost"].setTxt(amt < tu.max[x] ? format(tu.cost[x],0,6)+" "+UPG_RES[upg.res][0] : "")
                    tmp.el[div_id+"_cost"].setClasses({upg_cost: true, locked: Decimal.lt(res,tu.cost[x]) && amt < tu.max[x]})

                    tmp.el[div_id+"_amt"].setTxt(amt < tu.max[x] ? format(amt,0) : "")
                    tmp.el[div_id+"_max"].setDisplay(amt >= tu.max[x])
                }
            }
        } else if (upgs.reqDesc) tmp.el["upg_req_desc_"+id].setHTML(upgs.reqDesc())
    }
}

function hasUpgrade(id,x) { return player.upgs[id][x] > 0 }
function upgEffect(id,x,def=E(1)) { return tmp.upgs[id].eff[x] || def }

function resetUpgrades(id) {
    for (let x in UPGS[id].ctn) player.upgs[id][x] = 0
}

function buyMaxUpgrades(id) {
    let upgs = UPGS[id]
    for (let x = 0; x < UPGS[id].ctn.length; x++) {
        let upg = upgs.ctn[x]

        if (upg.unl?upg.unl():true) buyMaxUpgrade(id,x,true)
    }
}

function updateUpgResource(id) {
    let [p,q] = UPG_RES[id][1]()
    tmp.upg_res[id] = p[q]
}

function hideUpgOption() { player.options.hideUpgOption = !player.options.hideUpgOption }

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
    if (mapID == 'p') {
        updateUpgradesHTML('perk')
        updateUpgradesHTML('plat')
    }
	if (mapID == 'auto') {
		updateUpgradesHTML('auto')
		updateUpgradesHTML('assembler')
	}
    if (mapID == 'pc') {
        updateUpgradesHTML('pp')
        updateUpgradesHTML('crystal')

        updateUpgradesHTML('ap')
        updateUpgradesHTML('oil')
    }
    if (mapID == 'gh') updateUpgradesHTML('factory')
    if (mapID == 'fd') {
        updateUpgradesHTML('foundry')
        updateUpgradesHTML('gen')
    }

	if (mapID == 'opt') {
		tmp.el.hideUpgOption.setTxt(player.options.hideUpgOption?"ON":"OFF")
		tmp.el.grassCap.setTxt(player.options.lowGrass?250:"Unlimited")

		tmp.el.stats.setDisplay(!player.decel)
		tmp.el.aStats.setDisplay(player.decel)

		if (!player.decel) {
			tmp.el.pTimes.setHTML(player.pTimes ? "You have done " + player.pTimes + " <b style='color: #5BFAFF'>Prestige</b> resets.<br>Time: " + formatTime(player.pTime) : "")
			tmp.el.cTimes.setHTML(player.cTimes ? "You have done " + player.cTimes + " <b style='color: #FF84F6'>Crystalize</b> resets.<br>Time: " + formatTime(player.cTime) : "")
			tmp.el.sTimes.setHTML(player.sTimes ? "You have done " + player.sTimes + " <b style='color: #c5c5c5'>Steelie</b> resets.<br>Time: " + formatTime(player.sTime) : "")
		} else {
			tmp.el.aTimes.setHTML(player.aTimes ? "You have done " + player.aTimes + " <b style='color: #FF4E4E'>Anonymity</b> resets.<br>Time: " + formatTime(player.aTime) : "")
			tmp.el.lTimes.setHTML(player.lTimes ? "You have done " + player.lTimes + " <b style='color: #2b2b2b'>Liquefy</b> resets.<br>Time: " + formatTime(player.lTime) : "")
		}
	}
}