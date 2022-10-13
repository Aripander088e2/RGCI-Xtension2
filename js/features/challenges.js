const CHALS = [
    {
        unl: _=>true,

        max: 10,
        id: 'pp',

        title: `Grassless`,
        desc: `You cannot buy any grass upgrades.`,
        cond: _=>!hasUpgrades("grass"),
        reward: `Grass gain is <b class='green'>doubled</b> each completion.`,

        goal: i=>60+15*i,
        bulk: i=>Math.floor((i-60)/15+1),

        goalDesc: x=>"Level "+format(x,0),
        goalAmt: _=>player.level,

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x,0)+"x",
    },{
        unl: _=>true,

        max: 10,
        id: 'pp',

        title: `Less Level`,
        desc: `Prestige Upgrade's "XP II" does nothing`,
        cond: _=>!hasUpgrade("pp",1),
        reward: `XP gain is <b class='green'>doubled</b> each completion.`,

        goal: i=>80+20*i,
        bulk: i=>Math.floor((i-80)/20+1),

        goalDesc: x=>"Level "+format(x,0),
        goalAmt: _=>player.level,

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x,0)+"x",
    },{
        unl: _=>true,

        max: 7,
        id: 'crystal',

        title: `No Tiers`,
        desc: `You can't tier up.`,
        cond: _=>player.tier==0,
        reward: `TP gain is increased by <b class='green'>doubled</b> each completion.`,

        goal: i=>Math.ceil(50+15*i),
        bulk: i=>Math.floor((i-50)/15+1),

        goalDesc: x=>"Level "+format(x,0),
        goalAmt: _=>player.level,

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>true,

        max: 5,
        id: 'crystal',

        title: `Perkless`,
        desc: `You cannot buy Perks.`,
        cond: _=>player.chal.c4,
        reward: `Perk gain is increased by <b class="green">+0.2</b> per completion.`,

        goal: i=>7+i*3,
        bulk: i=>Math.floor((i-7)/3+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>i/5+1,
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>true,

        max: 7,
        id: 'crystal',

        title: `Prestigeless`,
        desc: `You cannot buy Prestige Upgrades.`,
        cond: _=>!hasUpgrades("pp"),
        reward: `PP gain is <b class="green">doubled</b> each completion.`,

        goal: i=>4+i*2,
        bulk: i=>Math.floor((i-4)/2+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x,0)+"x",
    },{
        unl: _=>true,

        max: 5,
        id: 'crystal',

        title: `Unefficient`,
        desc: `You cannot buy Grass and Prestige Upgrades.`,
        cond: _=>!hasUpgrades("grass")&&!hasUpgrades("pp"),
        reward: `Platinum gain is increased by <b class="green">+1</b> per completion.`,

        goal: i=>4+i*2,
        bulk: i=>Math.floor((i-4)/2+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>i,
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>player.sTimes>=1,

        max: 10,
        id: 'steel',

        title: `Clear Crystal`,
        desc: `You can't buy Crystal Upgrades.`,
        cond: _=>!hasUpgrades("crystal"),
        reward: `Steel gain is <b class='green'>doubled</b> each completion.`,

        goal: i=>8+i*2,
        bulk: i=>Math.floor((i-8)/2+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>hasUpgrade('factory',2),

        max: 5,
        id: 'steel',

        title: `Empower`,
        desc: `Non-Steelie Challenge Rewards do nothing.`,
        cond: _=>false,
        reward: `Charge gain is increased by <b class='green'>5x</b> each completion.`,

        goal: i=>25+i*2,
        bulk: i=>Math.floor((i-25)/2+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>Decimal.pow(5,i),
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>hasStarTree("progress", 6),

        max: 12,
        id: 'gal',

        title: `Sleepy Hop`,
        desc: `You must grasshop at least as you can. Getting 10 Rocket Parts will complete it.`,
        cond: _=>tmp.chal.goal[8]>=player.grasshop,
        reward: `Gain a AGH Level per completion.`,

        goal: i=>24-i*2,
        bulk: i=>Math.floor((24-player.grasshop)/2)+1,

        goalDesc: x=>"Grasshop "+format(x,0),
        goalAmt: _=>player.rocket.part==10?player.grasshop:1/0,

        eff: i=>i,
        effDesc: x=>"+"+format(x,0)+" AGH Level",
    },{
        unl: _=>hasStarTree("progress", 7),

        max: 12,
        id: 'gal',

        title: `Walk On Grass`,
        desc: `You can't grasshop. Entering will reset your Grass-Skips.`,
        cond: _=>player.grasshop==0,
        reward: `Gain a AGH Level per completion.`,

        goal: i=>9+i*3,
        bulk: i=>Math.floor((i-9)/3+1),

        goalDesc: x=>"Grass-Skip "+format(x,0),
        goalAmt: _=>player.aRes.grassskip,

        eff: i=>i,
        effDesc: x=>"+"+format(x,0)+" AGH Level",
    }
]

const chalSGoal = (_=>{
    let x = []
    for (let i in CHALS) x.push(CHALS[i].goal(0))
    return x
})()

function inChal(x) {
    let p = player.chal.progress
    return p[x]
}

function inChalCond(x) {
    return inChal(x) || (CHALS[x].cond() && !player.decel)
}

function enterChal(x) {
	if (player.chal.progress[x]) {
		delete player.chal.progress[x]
		return
	}

	if (player.decel) return
	if (CHALS[x].cond()) return
	if (player.chal.comp[x] == CHALS[x].max) return

	if (hasUpgrade('assembler', 9)) player.chal.progress[x] = true
	else player.chal.progress = { [x]: true }

	RESET[CHALS[x].id].reset(true)
}

function chalEff(x,def=E(1)) { return tmp.chal.eff[x] || def }

tmp_update.push(_=>{
	for (let i in CHALS) {
		let c = player.chal.comp[i] || 0
		tmp.chal.goal[i] = CHALS[i].goal(c)
		tmp.chal.eff[i] = CHALS[i].eff(inChal(7) && CHALS[i].id != "steel" ? 0 : c)

		if (inChalCond(i)) {
			let c = CHALS[i]
			let a = c.goalAmt()
			tmp.chal.amt[i] = a
			tmp.chal.bulk[i] = a >= chalSGoal[i] ? Math.min(c.bulk(a), c.max) : 0
		}
	}
})

el.setup.chal = _=>{
    let table = new Element('chal_table')
    let html = ``

    for (let i in CHALS) {
        let c = CHALS[i]

        html += `
        <div class="chal_div ${c.id}" id="chal_div_${i}" onclick="enterChal(${i})">
            <h3>${c.title}</h3><br>
            <b class="yellow" id="chal_comp_${i}">0 / 0</b><br><br>
            ${c.desc}<br>
            Reward: ${c.reward}<br>
            Effect: <b class="cyan" id="chal_eff_${i}">???</b>

            <div style="position:absolute; bottom:7px; width:100%;">
                Status: <b class="red" id="chal_pro_${i}">Inactive</b><br>
                <b class="white" id="chal_goal_${i}">Goal: ???</b>
            </div>
        </div>
        `
    }

    table.setHTML(html)
}

el.update.chal = _=>{
	if (player.decel) player.chal.progress = {}

	if (mapID == 'chal') {
		let unl = player.cTimes > 0

		tmp.el.chal_unl.setDisplay(!unl)
		tmp.el.chal_div.setDisplay(unl)

		if (unl) {
			tmp.el.chal_top.setHTML(player.decel ? "You can't complete Challenges in Anti-Realm!" : `
				Click any challenge to start! Click again to exit.<br>
				You can complete Challenges without entering if you satisfy a condition.
			`)
			tmp.el.chal_auto.setDisplay(hasUpgrade("assembler", 8))
			tmp.el.chal_auto.setTxt("Auto-completing in " + format((1 - player.chal.time) * upgEffect("assembler", 8), 1) + "s")

			for (let i in CHALS) {
				let c = CHALS[i]
				let l = player.chal.comp[i] || 0
				let unl2 = c.unl() && (!player.options.hideUpgOption || l < c.max || player.chal.progress == i)
				tmp.el['chal_div_'+i].setDisplay(unl2)

				if (unl2) {
					let completed = l >= c.max

					tmp.el["chal_comp_"+i].setTxt(format(l,0) + " / " + format(c.max,0))
					tmp.el["chal_eff_"+i].setHTML(c.effDesc(tmp.chal.eff[i]))
					tmp.el["chal_pro_"+i].setTxt(completed ? "Completed" : inChal(i) ? "Progress" : inChalCond(i) ? "Active" : "Inactive")
					tmp.el["chal_pro_"+i].setClasses({[completed ? "pink" : inChal(i) ? "yellow" : inChalCond(i) ? "green" : "red"]: true})

					tmp.el["chal_goal_"+i].setTxt("Goal: "+c.goalDesc(tmp.chal.goal[i]))
				}
			}
		}
	}
}