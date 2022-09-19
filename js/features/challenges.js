const CHALS = [
    {
        unl: _=>true,

        max: 10,
        id: 'pp',

        title: `Grassless`,
        desc: `You cannot buy any grass upgrades.`,
        reward: `Grass gain is <b class='green'>doubled</b> each completion.`,

        goal: i=>60+10*i,
        bulk: i=>Math.floor((i-60)/10+1),

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
        reward: `XP gain is <b class='green'>doubled</b> each completion.`,

        goal: i=>80+15*i,
        bulk: i=>Math.floor((i-80)/15+1),

        goalDesc: x=>"Level "+format(x,0),
        goalAmt: _=>player.level,

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x,0)+"x",
    },{
        unl: _=>true,

        max: 10,
        id: 'crystal',

        title: `No Tiers`,
        desc: `You can't tier up.`,
        reward: `TP gain is increased by <b class='green'>doubled</b> each completion.`,

        goal: i=>Math.ceil(70+20*i),
        bulk: i=>Math.floor((i-70)/20+1),

        goalDesc: x=>"Level "+format(x,0),
        goalAmt: _=>player.level,

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>true,

        max: 6,
        id: 'crystal',

        title: `Perkless`,
        desc: `You cannot buy Perks.`,
        reward: `Perk gain is increased by <b class="green">+0.5</b> per completion.`,

        goal: i=>7+i*2,
        bulk: i=>Math.floor((i-7)/2+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>i/2+1,
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>true,

        max: 10,
        id: 'crystal',

        title: `Prestigeless`,
        desc: `You cannot buy Prestige Upgrades.`,
        reward: `PP gain is <b class="green">doubled</b> each completion.`,

        goal: i=>2+i*2,
        bulk: i=>Math.floor(i/2),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x,0)+"x",
    },{
        unl: _=>true,

        max: 10,
        id: 'crystal',

        title: `Unefficient`,
        desc: `You cannot buy Grass and Prestige Upgrades.`,
        reward: `Platinum gain is increased by <b class="green">+1</b> per completion.`,

        goal: i=>4+i*2,
        bulk: i=>Math.floor((i-4)/2+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>i+1,
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>player.sTimes>=1,

        max: 5,
        id: 'steel',

        title: `Clear Crystal`,
        desc: `You can't buy Crystalize Upgrades.`,
        reward: `Gain more Steel.`,

        goal: i=>16+i*3,
        bulk: i=>Math.floor((i-16)/3+1),

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
        reward: `Gain more Charge Rate.`,

        goal: i=>25+i*3,
        bulk: i=>Math.floor((i-25)/3+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>Decimal.pow(3,i),
        effDesc: x=>format(x,1)+"x",
    },{
        unl: _=>player.lTimes>=1,

        max: 5,
        id: 'steel',

        title: `Powerhouse`,
        desc: `You can't buy Grass, Prestige, and Crystal Upgrades.`,
        reward: `Gain more Oil.`,

        goal: i=>11+i*2,
        bulk: i=>Math.floor((i-11)/2+1),

        goalDesc: x=>"Tier "+format(x,0),
        goalAmt: _=>player.tier,

        eff: i=>Decimal.pow(3,i),
        effDesc: x=>format(x,1)+"x",
    }
]

const chalSGoal = (_=>{
    let x = []
    for (let i in CHALS) x.push(CHALS[i].goal(0))
    return x
})()

function inChal(x) {
    let p = player.chal.progress
    return p == x
}

function enterChal(x) {
    if (player.chal.progress != x) {
        if (x == -1) RESET[CHALS[player.chal.progress].id].reset(true)

        player.chal.progress = x

        if (x > -1) RESET[CHALS[x].id].reset(true)
    } else enterChal(-1)
}

function chalEff(x,def=E(1)) { return tmp.chal.eff[x] || def }

tmp_update.push(_=>{
    for (let i in CHALS) {
        let c = player.chal.comp[i]||0
        tmp.chal.goal[i] = CHALS[i].goal(c)
        tmp.chal.eff[i] = CHALS[i].eff(inChal(7) && CHALS[i].id != "steel" ? 0 : c)
    }
    if (!inChal(-1)) {
        let p = player.chal.progress
        let c = CHALS[p]
        let a = c.goalAmt()
        tmp.chal.amt = a
        tmp.chal.bulk = a >= chalSGoal[p] ? Math.min(c.bulk(a),c.max) : 0
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
                <b class="red" id="chal_goal_${i}">Goal: ???</b>
            </div>
        </div>
        `
    }

    table.setHTML(html)
}

el.update.chal = _=>{
    if (mapID == 'chal') {
        let unl = !getPlayerData.chalUnl

        tmp.el.chal_unl.setDisplay(!unl && player.cTimes > 0)
        tmp.el.chal_div.setDisplay(unl && player.cTimes > 0)

        if (unl) {
            for (let i in CHALS) {
                let c = CHALS[i]

                let unl2 = c.unl()

                tmp.el["chal_div_"+i].setDisplay(unl2)
                if (unl2) {
                    let l = player.chal.comp[i]||0
                    let completed = l >= c.max
                    let a = inChal(-1) ? 0 : tmp.chal.amt

                    tmp.el["chal_comp_"+i].setTxt(format(l,0) + " / " + format(c.max,0))
                    tmp.el["chal_eff_"+i].setHTML(c.effDesc(tmp.chal.eff[i]))
                    tmp.el["chal_pro_"+i].setTxt(completed ? "Completed" : inChal(i) ? "Progress" : "Inactive")
                    tmp.el["chal_pro_"+i].setClasses({[completed ? "green" : inChal(i) ? "yellow" : "red"]: true})

                    tmp.el["chal_goal_"+i].setTxt("Goal: "+c.goalDesc(tmp.chal.goal[i]))
                    tmp.el["chal_goal_"+i].setClasses({[inChal(i) && a >= tmp.chal.goal[i] ? "green" : "red"]: true})
                }
            }
        }
    }
}