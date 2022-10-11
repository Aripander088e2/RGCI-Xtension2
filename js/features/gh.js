//GRASSHOP
MAIN.gh = {
    req: _=> player.grasshop >= 10 ? 150 + player.grasshop * 10 : 200 + player.grasshop * 4,
    //bulk: _=> player.level>=300?E((player.level-300)/10).scale(20,2,0,true).floor().toNumber()+1:0,

    milestone: [
        {
            r: 1,
            desc: `Gain <b class="green">4x</b> more TP. Unlock new automation upgrades.`,
        },{
            r: 2,
            desc: `Gain <b class="green">2x</b> more Crystals.`,
        },{
            r: 3,
            desc: `Platinum worth <b class="green">+0.2</b> per Grasshop. (starting at 2)`,
            effect: _=>Math.max(0,(player.grasshop-2)/5),
            effDesc: x=> "+"+format(x,1),
        },{
            r: 4,
            desc: `Perk worth <b class="green">+0.1</b> per Grasshop. (starting at 3)`,
            effect: _=>Math.max(0,(player.grasshop-2)/10),
            effDesc: x=> "+"+format(x,1),
        },{
            r: 5,
            desc: `<b class="green">+0.1x</b> to Tier multiplier base.`,
        },{
            r: 6,
            desc: `Platinum is <b class="green">2x</b> more common.`,
        },{
            r: 8,
            desc: `Gain <b class="green">2x</b> more XP.`,
        },{
            r: 10,
            desc: `Unlock Steelie reset.`,
        },{
            unl: _=>player.sTimes > 0,

            r: 11,
            desc: `Gain <b class="green">2x</b> more Steel per Grasshop. (starting at 11)`,
            effect: _=>E(2).pow(Math.max(0,player.grasshop-10)),
            effDesc: x=> format(x,0)+"x",
        },{
            unl: _=>hasUpgrade('factory',2),

            r: 12,
            desc: `Gain <b class="green">2x</b> more Charge per Grasshop. (starting at 19)`,
            effect: _=>E(2).pow(Math.max(0,player.grasshop-11)),
            effDesc: x=> format(x,0)+"x",
        },{
            unl: _=>hasUpgrade('factory',3),

            r: 16,
            desc: `Charge rate bonuses start 10x earlier per Grasshop. (starting at 16)`,
            effect: _=>Math.max(0,player.grasshop-15),
            effDesc: x=> format(E(10).pow(x),0)+"x",
        }
    ],
}

const GH_MIL_LEN = MAIN.gh.milestone.length
function getGHEffect(x,def=1) { return tmp.ghEffect[x]||def }

RESET.gh = {
    unl: _=>player.cTimes>0,
    req: _=>!player.decel && player.level>=200,
    reqDesc: _=>player.decel ? `You can't Grasshop in Anti-Realm!` : `Reach Level 200.`,

    resetDesc: `Grasshopping resets everything crystalize does as well as crystals, crystal upgrades, challenges.`,
    resetGain: _=> `Reach Level <b>${format(tmp.gh_req,0)}</b> to Grasshop`,

    title: `Grasshop`,
    btns: `<button id="multGHBtn" onclick="player.ghMult = !player.ghMult">Multi: <span id="multGHOption">OFF</span></button>`,
    resetBtn: `Grasshop!`,
    hotkey: `G`,

    reset(force=false) {
        if ((this.req()&&player.level>=tmp.gh_req)||force) {
            let res = Math.max(player.grasshop+1, MAIN.gh.bulk())
            if (force) {
                this.doReset()
            } else if (galUnlocked()) {
                /*if (hasStarTree('auto',1) && player.ghMult) player.grasshop = res
                else*/ player.grasshop++

                updateTemp()

                this.doReset()
            } else if (!tmp.ghRunning) {
                tmp.ghRunning = true
                document.body.style.animation = "implode 2s 1"
                setTimeout(_=>{
                    /*if (hasStarTree('auto',1) && player.ghMult) player.grasshop = res
                    else*/ player.grasshop++

                    updateTemp()
        
                    this.doReset()
                },1000)
                setTimeout(_=>{
                    document.body.style.animation = ""
                    tmp.ghRunning = false
                },2000)
            }
        }
    },

    doReset(order="gh") {
        player.crystal = E(0)
        player.bestCrystal = E(0)
        player.chargeRate = E(0)

        if (!hasUpgrade('assembler', 7) || order !== "gh") {
            tmp.chal.bulk = []
            for (let i = 0; i < 2; i++) player.chal.comp[i] = Math.min(upgEffect('assembler', 5, 0), player.chal.comp[i])
            for (let i = 2; i < 6; i++) player.chal.comp[i] = Math.min(upgEffect('assembler', 6, 0), player.chal.comp[i])
        }

        resetUpgrades('crystal')

        RESET.crystal.doReset(order)
    },
}

//GRASS-SKIPS
MAIN.gs = {
    req: _=> Math.ceil(400+E(player.grassskip).scale(10,2,0).toNumber()*10),
    bulk: _=> E(player.level-400).div(10).scale(10,2,0,true).floor().toNumber()+1,

    milestone: [
        {
            r: 1,
            desc: `Gain <b class="green">+5</b> more stars per grass-skip.`,
            effect: _=>5*player.grassskip,
            effDesc: x=> "+"+format(x,0),
        },{
            r: 2,
            desc: `Gain <b class="green">+2</b> more SP per grass-skip.`,
            effect: _=>player.grassskip*2,
            effDesc: x=> "+"+format(x,0),
        },
    ],
}

const GS_MIL_LEN = MAIN.gs.milestone.length
function getGSEffect(x,def=1) { return tmp.gsEffect[x]||def }

RESET.gs = {
    unl: _=>player.gTimes>0 && player.decel,
    req: _=>player.level>=400,
    reqDesc: _=>`Reach Level 400.`,

    resetDesc: `Grass-skipping resets everything liquefy does as well as oil except oil upgrades.`,
    resetGain: _=> `Reach Level <b>${format(tmp.gs_req,0)}</b> to Grass-skip`,

    title: `Grass-Skip`,
    btns: `<button id="multGSBtn" onclick="player.gsMult = !player.gsMult">Multi: <span id="multGSOption">OFF</span></button>`,
    resetBtn: `Grass-Skip?`,
    hotkey: `G`,

    reset(force=false) {
        if ((this.req()&&player.level>=tmp.gs_req)||force) {
            let res = Math.max(player.grassskip+1, MAIN.gs.bulk())
            if (force) {
                this.doReset()
            } else {
                player.gsUnl = true
                if (player.gsMult) player.grassskip = res
                else player.grassskip++

                updateTemp()
        
                this.doReset()
            }
        }
    },

    doReset(order="gh") {
        player.oil = E(0)
        player.bestOil = E(0)

        RESET.oil.doReset(order)
    },
}

//ANTI-GH MILESTONES
MAIN.agh_milestone = [
    {
        r: 36,
        desc: `Grass gain is increased by <b class="green">100%</b> every astral.`,
        effect: _=>Decimal.pow(2,player.astral),
        effDesc: x=> format(x)+"x",
    },{
        r: 32,
        desc: `XP gain is increased by <b class="green">100%</b> every astral.<br>Keep challenges on Grasshop, Galactic.`,
        effect: _=>Decimal.pow(2,player.astral),
        effDesc: x=> format(x)+"x",
    },{
        r: 28,
        desc: `TP gain is increased by <b class="green">100%</b> every astral.`,
        effect: _=>Decimal.pow(2,player.astral),
        effDesc: x=> format(x)+"x",
    },{
        r: 24,
        desc: `Star gain is increased by <b class="green">10%</b> per astral.<br>Tier requirement is sightly weaker.`,
        effect: _=>player.astral/10+1,
        effDesc: x=> format(x)+"x",
    },
]

const AGH_MIL_LEN = MAIN.agh_milestone.length
function getAGHEffect(x,def=1) { return tmp.aghEffect[x]||def }

//OTHERS
tmp_update.push(_=>{
    tmp.gh_req = MAIN.gh.req()

    for (let x = 0; x < GH_MIL_LEN; x++) {
        let m = MAIN.gh.milestone[x]
        if (m.effect) tmp.ghEffect[x] = m.effect()
    }

    for (let x = 0; x < AGH_MIL_LEN; x++) {
        let m = MAIN.agh_milestone[x]
        if (m.effect) tmp.aghEffect[x] = m.effect()
    }

    tmp.gs_req = MAIN.gs.req()

    for (let x = 0; x < GS_MIL_LEN; x++) {
        let m = MAIN.gs.milestone[x]
        if (m.effect) tmp.gsEffect[x] = m.effect()
    }
})

el.setup.milestones = _=>{
    let t = new Element("milestone_div_gh")
    let h = ""

    h += `<div style="position:absolute;top:50%;width: 100%;transform:translateY(-50%);font-size:30px;" id="gh_mil_req">
        Grasshop once to unlock.
    </div><div id="gh_mil_ctns">You have grasshopped <b id="gh">0</b> times<div class="milestone_ctns">`

    for (i in MAIN.gh.milestone) {
        let m = MAIN.gh.milestone[i]

        h += `
        <div id="gh_mil_ctn${i}_div">
            <h3>${m.r} Grasshop</h3><br>
            ${m.desc}
            ${m.effDesc?`<br>Effect: <b class="cyan" id="gh_mil_ctn${i}_eff"></b>`:""}
        </div>
        `
    }

    h += `</div></div>`

    t.setHTML(h)

    t = new Element("milestone_div_agh")
    h = ""

    h += `<div id="gh_mil_ctns">Your lowest grasshop is <b id="agh">0</b><div class="milestone_ctns">`

    for (i in MAIN.agh_milestone) {
        let m = MAIN.agh_milestone[i]

        h += `
        <div id="agh_mil_ctn${i}_div">
            <h3>${m.r} Grasshop</h3><br>
            ${m.desc}
            ${m.effDesc?`<br>Effect: <b class="cyan" id="agh_mil_ctn${i}_eff"></b>`:""}
        </div>
        `
    }

    h += `</div></div>`

    t.setHTML(h)

    t = new Element("milestone_div_gs")
    h = ""

    h += `<div style="position:absolute;top:50%;width: 100%;transform:translateY(-50%);font-size:30px;" id="gs_mil_req">
        Grass-skip once to unlock.
    </div><div id="gs_mil_ctns">You have grass-skipped <b id="gs">0</b> times<div class="milestone_ctns">`

    for (i in MAIN.gs.milestone) {
        let m = MAIN.gs.milestone[i]

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

el.update.milestones = _=>{
    if (mapID == 'gh') {
        tmp.el.reset_btn_gh.setClasses({locked: player.level < tmp.gh_req})
        tmp.el.reset_btn_gs.setClasses({locked: player.level < tmp.gs_req})

        let unl = player.cTimes > 0

        tmp.el.milestone_div_gh.setDisplay(unl)

        if (unl) {
            unl = player.grasshop > 0 || galUnlocked()

            tmp.el.multGHOption.setDisplay(false)
            tmp.el.multGHOption.setTxt(player.ghMult?"ON":"OFF")

            tmp.el.gh_mil_req.setDisplay(!unl)
            tmp.el.gh_mil_ctns.setDisplay(unl)

            if (unl) {
                tmp.el.gh.setHTML(format(player.grasshop,0))

                for (let x = 0; x < GH_MIL_LEN; x++) {
                    let m = MAIN.gh.milestone[x]
                    let unl = m.unl ? m.unl() : true
                    let id = "gh_mil_ctn"+x

                    tmp.el[id+"_div"].setDisplay(unl && (!player.options.hideMilestone || x+1 >= GH_MIL_LEN || player.grasshop < MAIN.gh.milestone[x+1].r))
                    tmp.el[id+"_div"].setClasses({bought: player.grasshop >= m.r})
                    if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(tmp.ghEffect[x]))
                }
            }
        }

        unl = false

        tmp.el.milestone_div_gs.setDisplay(unl)
/*
        if (unl) {
            tmp.el.multGSOption.setDisplay(hasStarTree('auto', 4))
            tmp.el.multGSOption.setTxt(player.gsMult ? "ON" : "OFF")

            unl = player.grassskip>0 || player.gsUnl

            tmp.el.gs_mil_req.setDisplay(!unl)
            tmp.el.gs_mil_ctns.setDisplay(unl)

            if (unl) {
                tmp.el.gs.setHTML(format(player.grassskip,0))

                for (let x = 0; x < GS_MIL_LEN; x++) {
                    let m = MAIN.gs.milestone[x]
                    let id = "gs_mil_ctn"+x

                    tmp.el[id+"_div"].setDisplay(!player.options.hideMilestone || x+1 >= GS_MIL_LEN || player.grassskip < MAIN.gs.milestone[x+1].r)
                    if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(tmp.gsEffect[x]))
                }
            }
        }
*/
    }
    if (mapID == 'at') {
        tmp.el.agh.setHTML(format(player.lowGH,0))

        for (let x = 0; x < AGH_MIL_LEN; x++) {
            let m = MAIN.agh_milestone[x]
            let id = "agh_mil_ctn"+x

            tmp.el[id+"_div"].setDisplay(!player.options.hideMilestone || x+1 >= AGH_MIL_LEN || player.lowGH > MAIN.agh_milestone[x+1].r)
            tmp.el[id+"_div"].setClasses({bought: player.lowGH <= m.r})
            if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(tmp.aghEffect[x]))
        }
    }
}