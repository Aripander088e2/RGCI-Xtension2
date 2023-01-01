function inAccel() {
	return player.decel == 0
}

function inDecel() {
	return player.decel >= 1
}

function getRealmGrasses() {
	let r = [player.decel]
	if (hasUpgrade('factory',4) && hasStarTree("qol", 12) && (player.decel == 0 || player.decel == 1)) r = [0,1]
	return r
}

function getRealmSrc(type) {
	if (type === undefined) return tmp.realmSrc
	return [player, player.aRes, player.unRes][type]
}

RESET.decel = {
    unl: _=>hasUpgrade('factory',4),

    req: _=>true,
    reqDesc: _=>"",

    resetDesc: `Nerf everything until you Accelerate. You'll be able to cut Anti-Grass for new upgrades.`,
    resetGain: _=> `This will force a Steelie.`,

    title: `Decelerator`,
    resetBtn: `Decelerate`,
    hotkey: `T`,

    reset(force=false) {
        if (hasUpgrade("factory", 4)) {
            if (player.decel == 1) player.decel = 0
            else player.decel = 1
            RESET.steel.doReset(true)
        }
    },
}

el.update.decel = _=>{
    tmp.el.grass_div.changeStyle("background-color", ["", "#242697", "#549e00"][player.decel])
    tmp.el.grass.changeStyle("background-color", ["", "#002D9F", "#549e00"][player.decel])
    tmp.el.fog.changeStyle("background-color", ["", "#001c3b", "#ff03"][player.decel])
    tmp.el.fog.setDisplay(player.decel && !inSpace())
    if (mapID == "dc") tmp.el.reset_btn_decel.setTxt(player.decel == 1 ? "Accelerate" : "Decelerate")
}

aMAIN = {
	grassGain() {
        let x = E(1)
		if (!player.sTimes) return x

        x = x.mul(upgEffect('ap',0))
        x = x.mul(upgEffect('oil',0))
		if (player.decel == 1) {
			x = x.div(1e4)
			if (hasUpgrade('aGrass', 3)) x = x.mul(upgEffect('aGrass',3))
			if (hasGSMilestone(0)) x = x.mul(3)
		}
		return x
	},
	xpGain() {
        let x = E(1)
		if (!player.sTimes) return x

        x = x.mul(upgEffect('ap',2))
        x = x.mul(upgEffect('oil',1))
        if (player.decel == 1) {
			x = x.div(1e5)
			if (hasUpgrade('aGrass',4)) x = x.mul(upgEffect('aGrass',4))
			if (hasGSMilestone(0)) x = x.mul(3)
			x = x.mul(E(getAstralEff('xp')).root(1.5))
		}
		return x
	},
	tpGain() {
        let x = E(1)
		if (!player.sTimes) return x

        x = x.mul(upgEffect('ap',3))
        x = x.mul(upgEffect('oil',2))
        if (player.decel == 1) {
			x = x.div(100)
			x = x.mul(tmp.chargeEff[5]||1)
		}
		return x
	},
	chargeGain() {
        let x = E(1)
		x = x.mul(upgEffect('aGrass',0))
		x = x.mul(upgEffect('ap',1))
		x = x.mul(upgEffect('oil',5))
		if (inDecel()) x = x.div(1e3)
		return x
	},
}

UPGS.aGrass = {
    unl: _=> player.decel == 1,

    title: "Anti-Upgrades",
    underDesc: _=>`Some upgrades affect the Normal Realm.`,

    autoUnl: _=>hasUpgrade('aAuto', 1),
    noSpend: _=>hasStarTree('qol', 3),

    ctn: [
        {
            max: Infinity,

            title: "Anti-Grass Charge",
            desc: `Increase charge rate by <b class="green">+25%</b> per level.<br>This effect is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

            res: "aGrass",
            icon: ['Curr/Charge'],
            
            cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/4+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            max: 100,

            title: "Anti-Realm Grow Speed",
            desc: `Increase grass grow speed by <b class="green">+50%</b> per level in Anti-Realm.`,

            res: "aGrass",
            icon: ['Icons/Speed'],
            
            cost: i => Decimal.pow(1.5,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(1.5).floor().toNumber()+1,

            effect(i) {
                let x = i/2+1

                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Anti-Grass Steel",
            desc: `Increase steel gain by <b class="green">+10%</b> per level.<br>This effect is increased by <b class="green">25%</b> every <b class="yellow">25</b> levels.`,

            res: "aGrass",
            icon: ['Curr/Steel'],
            
            cost: i => Decimal.pow(1.2,i).mul(200).ceil(),
            bulk: i => i.div(200).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/10+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            title: "Charged Grass",
            desc: `Charge Rate boosts Grass in Anti-Realm.`,

            res: "aGrass",
            icon: ['Curr/Grass', 'Icons/StarSpeed'],
            
            cost: i => E(500),
            bulk: i => 1,

            effect(i) {
                return E(player.chargeRate).div(1e3).add(1).root(4)
            },
            effDesc: x => x.format()+"x",
        },{
            title: "Charged XP",
            desc: `Charge Rate boosts XP in Anti-Realm.`,

            res: "aGrass",
            icon: ['Icons/XP', 'Icons/StarSpeed'],
            
            cost: i => E(100),
            bulk: i => 1,

            effect(i) {
                return E(player.chargeRate).div(1e3).add(1).root(4)
            },
            effDesc: x => x.format()+"x",
        },{
            unl: _ => player.aRes.aTimes > 0,

            max: Infinity,

            title: "Anti-Grass AP",
            desc: `Increase AP gain by <b class="green">+10%</b> compounding.`,

            res: "aGrass",
            icon: ['Curr/Anonymity'],
            
            cost: i => Decimal.pow(1.2,i).mul(1e7).ceil(),
            bulk: i => i.div(1e7).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                return E(1.1).pow(i)
            },
            effDesc: x => x.format()+"x",
        },{
            max: 5,
            tier: 2,

            title: "Range II",
            desc: `Increase grass cut range by <b class="green">+10</b> per level.`,

            res: "aGrass",
            icon: ['Icons/Range'],

            cost: i => Decimal.pow(15,i).mul(200).ceil(),
            bulk: i => i.div(200).max(1).log(15).floor().toNumber()+1,

            effect(i) {
                return i*10
            },
            effDesc: x => "+"+format(x,0),
        }
    ],
}

UPGS.aAuto = {
	title: "Anti-Anti-Automation Upgrades",
	req: _=>player.aRes.aTimes>0,
	reqDesc: _=>`Anonymity once to unlock.`,

	unl: _=>player.decel,

	ctn: [
		{
			unl: _=>player.aRes.aTimes>0,
			max: 4,

			title: "Anti-Autocut",
			desc: `Auto-cutting speed is <b class="green">+0.5x</b> faster in Anti-Realm.`,
		
			res: "ap",
			icon: ['Curr/AntiGrass','Icons/Automation'],
						
			cost: i => Decimal.pow(3,i).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(3).floor().toNumber()+1,
		
			effect(i) {
				return i/2+1
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _=>player.aRes.lTimes>0,

			title: "Anti-Grass Upgrades Autobuy",
			desc: `You can now automatically buy Anti-Grass Upgrades.`,
		
			res: "oil",
			icon: ['Curr/AntiGrass','Icons/Automation'],
						
			cost: i => E(100),
			bulk: i => 1,
		},{
			unl: _=>player.rocket.part>0 || galUnlocked(),

			title: "Anonymity Upgrades Autobuy",
			desc: `You can now automatically buy Anonymity Upgrades.`,
		
			res: "rf",
			icon: ['Curr/Anonymity','Icons/Automation'],
						
			cost: i => E(50),
			bulk: i => 1,
		},{
			unl: _=>galUnlocked(),

			title: "Oil Upgrades Autobuy",
			desc: `You can now automatically buy Oil Upgrades.`,
		
			res: "rf",
			icon: ['Curr/Oil','Icons/Automation'],
						
			cost: i => E(200),
			bulk: i => 1,
		},{
			unl: _=>galUnlocked(),

			max: 10,

			title: "Anonymity Generation",
			desc: `Passively generate <b class="green">+0.1%</b> of AP you would earn on anonymity per second.`,
		
			res: "ap",
			icon: ['Curr/Anonymity','Icons/Plus'],
						
			cost: i => Decimal.pow(3,i).mul(1e12).ceil(),
			bulk: i => i.div(1e12).max(1).log(3).floor().toNumber()+1,
			effect(i) {
				let x = i/1e3
		
				return x
			},
			effDesc: x => "+"+formatPercent(x,1)+"/s",
		},{
			unl: _=>galUnlocked(),

			max: 10,

			title: "Oil Generation",
			desc: `Passively generate <b class="green">+0.1%</b> of oil you would earn on liquefy per second.`,
		
			res: "oil",
			icon: ['Curr/Oil','Icons/Plus'],
						
			cost: i => Decimal.pow(2,i).mul(1e6).ceil(),
			bulk: i => i.div(1e6).max(1).log(2).floor().toNumber()+1,
			effect(i) {
				let x = i/1e3
		
				return x
			},
			effDesc: x => "+"+formatPercent(x,1)+"/s",
		}
	],
}

/* ANONYMITY */
aMAIN.ap = {
    gain() {
        let x = Decimal.pow(1.15,player.aRes.level)

        x = x.mul(upgEffect('aGrass',5))
        x = x.mul(upgEffect('plat',8))
        x = x.mul(upgEffect('oil',3))

        x = x.mul(upgEffect('rocket',7))
        x = x.mul(upgEffect('rocket',14))
        x = x.mul(upgEffect('rocket',17))
        x = x.mul(upgEffect('momentum',8))

        return x.floor()
    },
}

RESET.ap = {
	unl: _=>player.decel==1,

    req: _=>player.aRes.level>=30,
    reqDesc: _=>`Reach Level 30.`,

    resetDesc: `Reset your anti-grass, level, and charge.`,
    resetGain: _=> `<b>+${tmp.aRes.apGain.format(0)}</b> Anonymity Points`,

    title: `Anonymity`,
    resetBtn: `Anonymity?`,
    hotkey: `P`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.aRes.ap = player.aRes.ap.add(tmp.aRes.apGain)
                player.aRes.aTimes++
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="a") {
        player.aRes.aTime = 0
        player.aRes.grass = E(0)
        player.aRes.xp = E(0)
        player.aRes.level = 0
        player.chargeRate = E(0)

        if (!hasUpgrade('aAuto',8)) resetUpgrades('aGrass')

        resetGlasses()

        updateTemp()
    },
}

UPGS.ap = {
    unl: _=> player.decel == 1,

    title: "Anonymity Upgrades",

    req: _=>player.aRes.aTimes > 0,
    reqDesc: _=>`Anonymity once to unlock.`,

    underDesc: _=>getUpgResTitle('ap')+(tmp.aRes.apGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.aRes.ap,tmp.aRes.apGain.mul(tmp.aRes.apGainP))+"</span>" : ""),

    autoUnl: _=>hasUpgrade('aAuto',2),
    noSpend: _=>hasStarTree('qol', 3),

    ctn: [
        {
            max: Infinity,

            title: "AP Value",
            tier: 2,
            desc: `Increase grass gain by <b class="green">+25%</b> per level.`,
        
            res: "ap",
            icon: ["Curr/Grass"],

            cost: i => Decimal.pow(1.2,i).mul(25).ceil(),
            bulk: i => i.div(25).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let r = E(i/4+1)
                r = r.mul(E(getAstralEff('ap')).pow(Math.floor(i/25)))
                return r
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "AP Charge",
            tier: 2,
            desc: `Increase charge rate by <b class="green">+25%</b> per level.`,
        
            res: "ap",
            icon: ['Curr/Charge'],
            
            cost: i => Decimal.pow(1.2,i).mul(20).ceil(),
            bulk: i => i.div(20).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let r = E(i/4+1)
                r = r.mul(E(getAstralEff('ap')).pow(Math.floor(i/25)))
                return r
            },
            effDesc: x => x.format()+"x",
        },{
            max: Infinity,

            title: "AP XP",
            tier: 2,
            desc: `Increase XP by <b class="green">+25%</b> per level.`,
        
            res: "ap",
            icon: ['Icons/XP'],
            
            cost: i => Decimal.pow(1.2,i).mul(20).ceil(),
            bulk: i => i.div(20).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let r = E(i/4+1)
                r = r.mul(E(getAstralEff('ap')).pow(Math.floor(i/25)))
                return r
            },
            effDesc: x => format(x,0)+"x",
        },{
            max: 50,

            title: "AP TP",
            desc: `Increase TP by <b class="green">+25%</b> per level.`,
        
            res: "ap",
            icon: ['Icons/TP'],
            
            cost: i => Decimal.pow(1.2,i).mul(20).ceil(),
            bulk: i => i.div(20).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let r = E(i/4+1)
                r = r.mul(E(getAstralEff('ap')).pow(Math.floor(i/25)))
                return r
            },
            effDesc: x => format(x,1)+"x",
        },{
            max: 25,

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
    tmp.aRes.apGain = aMAIN.ap.gain()
    tmp.aRes.apGainP = upgEffect('aAuto',4,0)+starTreeEff("qol",3,0)
})

/* LIQUEFY */
aMAIN.oil = {
    gain() {
        let x = Decimal.pow(2, player.aRes.tier)
        x = x.mul(upgEffect('plat',9))

        x = x.mul(tmp.chargeEff[6]||1)
        x = x.mul(upgEffect('rocket',8))
        x = x.mul(upgEffect('rocket',15))
        x = x.mul(upgEffect('momentum',9))

        x = x.mul(upgEffect('dm',1))

        return x.floor()
    },
}

RESET.oil = {
    unl: _=> player.decel == 1 && player.aRes.aTimes > 0,

    req: _=>player.aRes.level>=100,
    reqDesc: _=>`Reach Level 100.`,

    resetDesc: `Reset everything Anonymity does, and so Anonymity and Tier.`,
    resetGain: _=> `<b>+${tmp.aRes.oilGain.format(0)}</b> Oil`,

    title: `Liquefy`,
    resetBtn: `Liquefy?`,
    hotkey: `C`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.aRes.oil = player.aRes.oil.add(tmp.aRes.oilGain)
                player.aRes.lTimes++
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="l") {
        player.aRes.lTime = 0
        player.aRes.tier = 0
        player.aRes.tp = E(0)
        player.aRes.ap = E(0)

        resetUpgrades('ap')

        RESET.ap.doReset(order)
    },
}

UPGS.oil = {
    unl: _=> player.decel == 1 && player.aRes.aTimes > 0,

    title: "Oil Upgrades",

    req: _=>player.aRes.lTimes > 0,
    reqDesc: _=>`Liquefy once to unlock.`,

    underDesc: _=>getUpgResTitle('oil')+(tmp.aRes.oilGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.aRes.oil,tmp.aRes.oilGain.mul(tmp.aRes.oilGainP))+"</span>" : ""),

    autoUnl: _=>hasUpgrade('aAuto',3),
    noSpend: _=>hasStarTree('qol', 3),

    ctn: [
        {
            max: Infinity,

            title: "Oily Grass Value",
            tier: 3,
            desc: `Increase grass gain by <b class="green">10%</b> compounding per level.`,
        
            res: "oil",
            icon: ["Curr/Grass"],
                        
            cost: i => Decimal.pow(1.5,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                return E(1.1).pow(i)
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Oily XP",
            tier: 3,
            desc: `Increase XP gain by <b class="green">10%</b> compounding per level.`,
        
            res: "oil",
            icon: ['Icons/XP'],

            cost: i => Decimal.pow(1.5,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.5).floor().toNumber()+1,

            effect(i) {
                return E(1.1).pow(i)
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Oily TP",
            tier: 2,
            desc: `Increase TP gain by <b class="green">25%</b> compounding per level.`,
        
            res: "oil",
            icon: ['Icons/TP'],
            
            cost: i => Decimal.pow(3,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(3).floor().toNumber()+1,

            effect(i) {
                return E(1.25).pow(i)
            },
            effDesc: x => x.format()+"x",
        },{
            max: Infinity,

            title: "Oily AP",
            desc: `Increase AP gain by <b class="green">30%</b> compounding per level.`,

            res: "oil",
            icon: ['Curr/Anonymity'],
            
            cost: i => Decimal.pow(1.5,i).mul(200).ceil(),
            bulk: i => i.div(200).max(1).log(1.5).floor().toNumber()+1,

            effect(i) {
                return E(1.3).pow(i)
            },
            effDesc: x => x.format()+"x",
        },{
            max: Infinity,

            title: "Oily Steel",
            tier: 2,
            desc: `Steel gain is <b class="green">doubled</b> per level.`,
        
            res: "oil",
            icon: ['Curr/Steel'],
            
            cost: i => Decimal.pow(10,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(10).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(2,i)

                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Oily Charge",
            tier: 3,
            desc: `Charge rate is increased by <b class="green">25%</b> compounding per level.`,
        
            res: "oil",
            icon: ['Curr/Charge'],
            
            cost: i => Decimal.pow(2,i).mul(20).ceil(),
            bulk: i => i.div(20).max(1).log(2).floor().toNumber()+1,

            effect(i) {
                return E(1.25).pow(i)
            },
            effDesc: x => format(x)+"x",
        },
    ],
}

tmp_update.push(_=>{
    tmp.aRes.oilGain = aMAIN.oil.gain()
    tmp.aRes.oilGainP = upgEffect('aAuto',5,0)+starTreeEff("qol",3,0)
})

function resetAntiRealm() {
	player.chargeRate = E(0)
	player.aRes.grass = E(0)
	player.aRes.xp = E(0)
	player.aRes.level = 0
	player.aRes.tp = E(0)
	player.aRes.tier = 0
	player.aRes.ap = E(0)
	player.aRes.oil = E(0)
	player.aRes.aTime = 0
	player.aRes.lTime = 0

	resetUpgrades('aGrass')
	resetUpgrades('ap')
	resetUpgrades('oil')
}

/* GRASS-SKIPS */
aMAIN.gs = {
    req: _ => 200+player.aRes.grassskip*10,
    bulk: _ => Math.floor((player.aRes.level-200)/10) + 1,

    milestone: [
        {
            r: 1,
            desc: `Only in Anti-Realm, <b class="green">3x</b> Grass and XP. Auto-value boosts Platinum.`
        },
        {
            r: 2,
            desc: `<b class="green">2x</b> Space Power per Grass-Skip. (starting at 9)`,
            effect: _ => E(2).pow(Math.max(player.aRes.grassskip - 1, 0)),
            effDesc: x => format(x, 0) + "x"
        },
        {
            r: 3,
            desc: `<b class="green">30%</b> more Stars per Grass-Skip.`,
            effect: _ => E(1.3).pow(player.aRes.grassskip),
            effDesc: x => format(x) + "x"
        },
        {
            r: 4,
            desc: `<b class="green">+0.1x</b> Rocket Fuel per Grass-Skip. (starting at 4)`,
            effect: _ => Math.max(player.aRes.grassskip-3,0)/10,
            effDesc: x => "+" + format(x, 1) + "x"
        },
        {
            r: 5,
            desc: `<b class="green">+0.01%</b> Moonstone luck on cutting Grass and <b class="green">+5%</b> Moonstone luck on cutting Platinum. Resets on cutting Moonstone.`,
            effect: _ => galUnlocked() ? player.gal.msLuck : 1,
            effDesc: x => formatPercent(x-1)
        },
        {
            r: 6,
            desc: `There's <b class="green">10%</b> chance that next-tier Grass spawns.`
        },
        {
            r: 7,
            desc: `In Normal Realm: <b class="green">double</b> platinum chance, but moonstone chance is 10x lower.`
        },
        {
            r: 8,
            desc: `Unlock the Funify reset.`
        },
        {
            unl: _ => player.aRes.fTimes,
            r: 9,
            desc: `<b class="green">3x</b> Fun per Grass-Skip. (starting at 9)`,
            effect: _ => E(3).pow(Math.max(player.aRes.grassskip - 8, 0)),
            effDesc: x => format(x, 0) + "x"
        },
        {
            unl: _ => player.aRes.fTimes,
            r: 10,
            desc: `Keep Charger on Galactic. <b class="green">5x</b> Charge per Grass-Skip. (starting at 10)`,
            effect: _ => E(5).pow(Math.max(player.aRes.grassskip - 9, 0)),
            effDesc: x => format(x, 0) + "x"
        },
        {
            unl: _ => hasAGHMilestone(9),
            r: 11,
            desc: `<b class="green">+1</b> to Unnatural Healing per Grass-Skip. (starting at 11)`,
            effect: _ => Math.max(player.aRes.grassskip - 10, 0),
            effDesc: x => "+" + format(x, 0)
        },
        {
            unl: _ => hasAGHMilestone(9),
            r: 12,
            desc: `<b class="green">Double</b> SRFGT per Grass-Skip. (starting at 12)`,
            effect: _ => E(2).pow(Math.max(player.aRes.grassskip - 11, 0)),
            effDesc: x => format(x, 0) + "x"
        },
        {
            unl: _ => hasAGHMilestone(9),
            r: 15,
            desc: `<b class="green">Double</b> Moonstone chance.`
        },
    ],
}

const GS_MIL_LEN = aMAIN.gs.milestone.length
function hasGSMilestone(x) { return player.aRes.grassskip > x }
function getGSEffect(x,def=1) { return tmp.aRes.gs.eff[x]||def }

RESET.gs = {
	unl: _=>tmp.aRes.gs.shown,
	req: _=>player.aRes.level>=200,
	reqDesc: _=>`Reach Level 200.`,

	resetDesc: `Reset everything Liquefy does and so Steel, Foundry, Charger upgrades, and Oil. Grass-skips don't reset on Galactic!`,
	resetGain: _=> `Reach Level <b>${format(tmp.aRes.gs.req,0)}</b> to Grass-skip`,

	title: `Grass-Skip`,
	btns: `
		<button id="multGSBtn" onclick="player.gsMult = !player.gsMult">Multi: <span id="multGSOption">OFF</span></button>
		<button id="autoGSBtn" onclick="player.gsAuto = !player.gsAuto">Auto: <span id="autoGSOption">OFF</span></button>
	`,
	resetBtn: `Grass-Skip?`,
	hotkey: `G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			if (player.aRes.level < aMAIN.gs.req()) return
		}

		if (force || player.gal.sacTimes) {
			this.gainAndReset()
		} else if (!tmp.aRes.gs.running) {
			tmp.aRes.gs.running = true
			document.body.style.animation = "implode 2s 1"
			setTimeout(_=>{
				this.gainAndReset()
			},1000)
			setTimeout(_=>{
				document.body.style.animation = ""
				tmp.aRes.gs.running = false
			},2000)
		}
	},

	gainAndReset() {
		let res = aMAIN.gs.bulk()
		if (!player.gsMult) res = Math.min(res, player.aRes.grassskip + 1)

		player.aRes.grassskip = res
		this.doReset()
	},

	doReset(order="gs") {
		player.steel = E(0)

		if (!hasStarTree("qol", 10)) {
			player.steel = E(0)
			player.chargeRate = E(0)
			delete player.upgs.gen[2]
			delete player.upgs.gen[3]
			delete player.upgs.gen[4]
			resetUpgrades('foundry')
		}
		resetAntiRealm()
	},
}

tmp_update.push(_=>{
    tmp.aRes.gs.shown = galUnlocked() && player.decel == 1
    tmp.aRes.gs.req = aMAIN.gs.req()

    for (let x = 0; x < GS_MIL_LEN; x++) {
        let m = aMAIN.gs.milestone[x]
        if (m.effect) tmp.aRes.gs.eff[x] = m.effect()
    }
})

el.setup.gs = _=>{
    let t = new Element("milestone_div_gs")
    let h = ""

    h += `<div style="position:absolute;top:50%;width: 100%;transform:translateY(-50%);font-size:30px;" id="gs_mil_req">
        Grass-skip once to unlock.
    </div><div id="gs_mil_ctns">You have grass-skipped <b id="gs">0</b> times<div class="milestone_ctns">`

    for (i in aMAIN.gs.milestone) {
        let m = aMAIN.gs.milestone[i]

        h += `
        <div id="gs_mil_ctn${i}_div">
            <h3>${m.r} Grass-skip</h3><br>
            ${m.desc}
            ${m.effDesc?`<br>Effect: <b class="cyan" id="gs_mil_ctn${i}_eff"></b>`:""}
        </div>
        `
    }

    h += `</div></div>`

    t.setHTML(h)
}

el.update.gs = _=>{
    if (mapID == 'gh') {
        let unl = tmp.aRes.gs.shown
        tmp.el.reset_btn_gs.setClasses({locked: player.aRes.level < tmp.aRes.gs.req})
        tmp.el.milestone_div_gs.setDisplay(unl)
        if (unl) {
            unl = player.aRes.grassskip > 0 || player.gal.sacTimes

            tmp.el.multGSBtn.setDisplay(hasStarTree("qol", 7))
            tmp.el.multGSOption.setTxt(player.gsMult ? "ON" : "OFF")

			tmp.el.autoGSBtn.setDisplay(hasStarTree("auto", 8))
			tmp.el.autoGSOption.setTxt(player.gsAuto?"ON":"OFF")

            tmp.el.gs_mil_req.setDisplay(!unl)
            tmp.el.gs_mil_ctns.setDisplay(unl)

            if (unl) {
                tmp.el.gs.setHTML(format(player.aRes.grassskip,0))

                for (let x = 0; x < GS_MIL_LEN; x++) {
                    let m = aMAIN.gs.milestone[x]
                    let unl = m.unl ? m.unl() : true
                    let id = "gs_mil_ctn"+x

                    tmp.el[id+"_div"].setDisplay(unl && (!player.options.hideMilestone || player.aRes.grassskip < aMAIN.gs.milestone[x].r))
                    tmp.el[id+"_div"].setClasses({bought: player.aRes.grassskip >= m.r})
                    if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(tmp.aRes.gs.eff[x]))
                }
            }
        }
    }
}

function changeGSMult() { player.gsMult = !player.gsMult }