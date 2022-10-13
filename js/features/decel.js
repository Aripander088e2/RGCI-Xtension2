RESET.decel = {
    unl: _=>hasUpgrade('factory',4),

    req: _=>true,
    reqDesc: _=>"",

    resetDesc: `<span style="font-size: 14px;">Decelerating will temporarily slow down time and reduce the effectiveness of everything significantly until you press the Accelerate button.
    <br>During this time you will not be able to earn regular grass, Instead you earn anti-grass which is spent in Anti-Grass Upgrades panel which takes the place of regular Grass Upgrades panel.
    </span>`,
    resetGain: _=> `Decelerating will force a Steelie.`,

    title: `Decelerator`,
    resetBtn: `Decelerate`,

    reset(force=false) {
        if (true) {
            player.decel = !player.decel
            RESET.steel.reset(true)
        }
    },
}

el.update.decel = _=>{
    tmp.el.grass_div.changeStyle("background-color", player.decel ? "#242697" : "")
    tmp.el.grass.changeStyle("background-color", player.decel ? "#002D9F" : "")
    tmp.el.fog.setDisplay(player.decel && !inSpace())
    if (mapID == "dc") tmp.el.reset_btn_decel.setTxt(player.decel?"Accelerate":"Decelerate")
}

UPGS.aGrass = {
    unl: _=> player.decel,

    title: "Anti-Grass Upgrades",
    underDesc: _=>`Some upgrades affect the Normal Realm.`,

    autoUnl: _=>hasUpgrade('aAuto', 1),

    noSpend: _=>false,

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
            max: 40,

            title: "Anti-Grass Grow Speed",
            desc: `Increase grass grow speed by <b class="green">+10%</b> per level.`,

            res: "aGrass",
            icon: ['Icons/Speed'],
            
            cost: i => Decimal.pow(1.5,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(1.5).floor().toNumber()+1,

            effect(i) {
                let x = i/10+1

                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Anti-Grass Steel",
            desc: `Increase steel gain by <b class="green">+10%</b> per level.<br>This effect is increased by <b class="green">25%</b> every <b class="yellow">25</b> levels.`,

            res: "aGrass",
            icon: ['Curr/Steel2'],
            
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
			desc: `Passively generate <b class="green">+0.1%</b> of crystal you would earn on anonymity per second.`,
		
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

function resetAntiRealm() {
	player.aRes.grass = E(0)
	player.aRes.bestGrass = E(0)
	player.aRes.xp = E(0)
	player.aRes.level = 0
	player.aRes.tp = E(0)
	player.aRes.tier = 0
	player.aRes.ap = E(0)
	player.aRes.bestAP = E(0)
	player.aRes.oil = E(0)
	player.aRes.bestOil = E(0)

	resetUpgrades('aGrass')
	resetUpgrades('ap')
	resetUpgrades('oil')
}