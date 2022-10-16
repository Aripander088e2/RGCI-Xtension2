//GRASSHOP
MAIN.gh = {
	req: _=> player.grasshop >= 10 ? 150 + player.grasshop * 10 : 200 + player.grasshop * 4,
	bulk: _=> {
		let b = (player.level - 200) / 4
		if (b >= 10) b = (player.level - 150) / 10
		b = Math.floor(b)+1

		if (inChal(8)) b = Math.min(b, tmp.chal.goal[8])
		if (inChal(9)) b = 0
		return b
	},

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
            desc: `Gain <b class="green">2x</b> more Charge per Grasshop. (starting at 19 and ending at 30)`,
            effect: _=>E(2).pow(Math.max(0,Math.min(player.grasshop,30)-11)),
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
    unl: _=> player.cTimes > 0 && !tmp.gs_shown,
    req: _=> player.level >= 200 && !player.decel && !inChal(9),
    reqDesc: _=> inChal(9) ? `You can't Grasshop!` : player.decel ? `You can't Grasshop in Anti-Realm!` : `Reach Level 200.`,

    resetDesc: `Grasshopping resets everything crystalize does as well as crystals, crystal upgrades, challenges.`,
    resetGain: _=> `Reach Level <b>${format(tmp.gh_req,0)}</b> to Grasshop`,

    title: `Grasshop`,
    btns: `<button id="multGHBtn" onclick="player.ghMult = !player.ghMult">Multi: <span id="multGHOption">OFF</span></button>`,
    resetBtn: `Grasshop!`,
    hotkey: `G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			if (player.level < MAIN.gh.req()) return

			let res = MAIN.gh.bulk()
			if (!player.ghMult) res = Math.min(res, player.grasshop + 1)
			if (res <= player.grasshop) return

			player.grasshop = res
		}

		if (galUnlocked() || force) {
			this.doReset()
		} else if (!tmp.ghRunning) {
			tmp.ghRunning = true
			document.body.style.animation = "implode 2s 1"
			setTimeout(_=>{
				this.doReset()
			},1000)
			setTimeout(_=>{
				document.body.style.animation = ""
				tmp.ghRunning = false
			},2000)
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
    req: _ => 200 + player.aRes.grassskip * 15,
    bulk: _ => Math.floor((player.aRes.level - 200) / 15) + 1,

    milestone: [
        {
            r: 1,
            desc: `Gain <b class="green">3x</b> more Grass and XP, only in Anti-Realm.`
        },
        {
            r: 2,
            desc: `Each Grass-Skip gives <b class="green">2x</b> more SP. (starting at 2)`,
            effect: _ => E(2).pow(Math.max(player.aRes.grassskip - 1, 0)),
            effDesc: x => format(x, 0) + "x"
        },
        {
            r: 3,
            desc: `Each Grass-Skip gives <b class="green">30%</b> more Stars.`,
            effect: _ => E(1.3).pow(player.aRes.grassskip),
            effDesc: x => format(x) + "x"
        },
        {
            r: 4,
            desc: `Each Grass-Skip gives <b class="green">+0.5x</b> more Rocket Fuel. (starting at 4)`,
            effect: _ => Math.max(player.aRes.grassskip - 3, 0) / 2,
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
            desc: `In Normal Realm, platinum chance is <b class="green">doubled</b> but moonstone chance is 10x lower.`
        },
        {
            r: 8,
            desc: `Unlock the Funify reset. [soon]`
        },
        {
            unl: _ => false,
            r: 9,
            desc: `Each Grass-Skip gives <b class="green">2x</b> more Fun. (starting at 9)`,
            effect: _ => E(2).pow(Math.max(player.aRes.grassskip - 8, 0)),
            effDesc: x => format(x, 0) + "x"
        },
        {
            unl: _ => false,
            r: 10,
            desc: `Each Grass-Skip gives <b class="green">2x</b> more Fun. (starting at 9)`,
            effect: _ => E(2).pow(Math.max(player.aRes.grassskip - 8, 0)),
            effDesc: x => format(x, 0) + "x"
        },
        {
            unl: _ => false,
            r: 9,
            desc: `Each Grass-Skip gives <b class="green">2x</b> more Fun. (starting at 9)`,
            effect: _ => E(2).pow(Math.max(player.aRes.grassskip - 8, 0)),
            effDesc: x => format(x, 0) + "x"
        },
    ],
}

const GS_MIL_LEN = MAIN.gs.milestone.length
function hasGSMilestone(x) { return player.aRes.grassskip > x }
function getGSEffect(x,def=1) { return tmp.gsEffect[x]||def }

RESET.gs = {
	unl: _=>tmp.gs_shown,
	req: _=>player.aRes.level>=200,
	reqDesc: _=>`Reach Level 200.`,

	resetDesc: `Reset everything liquefy does as well as steel, foundry, charge upgrades, and oil. Grass-skips don't reset on Galactic!`,
	resetGain: _=> `Reach Level <b>${format(tmp.gs_req,0)}</b> to Grass-skip`,

	title: `Grass-Skip`,
	btns: `<button id="multGSBtn" onclick="player.gsMult = !player.gsMult">Multi: <span id="multGSOption">OFF</span></button>`,
	resetBtn: `Grass-Skip?`,
	hotkey: `G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			if (player.aRes.level < MAIN.gs.req()) return

			let res = MAIN.gs.bulk()
			if (!player.gsMult) res = Math.min(res, player.aRes.grassskip + 1)
			if (res <= player.aRes.grassskip) return

			player.aRes.grassskip = res
		}

		if (force) {
			this.doReset()
		} else if (!tmp.ghRunning) {
			tmp.ghRunning = true
			document.body.style.animation = "implode 2s 1"
			setTimeout(_=>{
				this.doReset()
			},1000)
			setTimeout(_=>{
				document.body.style.animation = ""
				tmp.ghRunning = false
			},2000)
		}
	},

	doReset(order="gs") {
		player.steel = E(0)

		if (!hasStarTree("qol", 10)) {
			player.steel = E(0)
			player.chargeRate = E(0)
			delete player.upgs.gen[2]
			delete player.upgs.gen[3]
			resetUpgrades('foundry')
		}
		resetAntiRealm()

		RESET.oil.doReset(order)
	},
}

//OTHERS
tmp_update.push(_=>{
    tmp.gh_req = MAIN.gh.req()

    for (let x = 0; x < GH_MIL_LEN; x++) {
        let m = MAIN.gh.milestone[x]
        if (m.effect) tmp.ghEffect[x] = m.effect()
    }

    tmp.gs_shown = galUnlocked() && player.decel
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
        tmp.el.reset_btn_gs.setClasses({locked: player.aRes.level < tmp.gs_req})

        let ghUnl = player.cTimes > 0 && !tmp.gs_shown
        tmp.el.milestone_div_gh.setDisplay(ghUnl)
        if (ghUnl) {
            let unl = player.grasshop > 0 || galUnlocked()

            tmp.el.multGHBtn.setDisplay(hasStarTree("qol", 5))
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

        let gsUnl = tmp.gs_shown
        tmp.el.milestone_div_gs.setDisplay(gsUnl)
        if (gsUnl) {
            let unl = player.aRes.grassskip > 0 || galUnlocked()

            tmp.el.multGSBtn.setDisplay(hasStarTree("qol", 7))
            tmp.el.multGSOption.setTxt(player.gsMult ? "ON" : "OFF")

            tmp.el.gs_mil_req.setDisplay(!unl)
            tmp.el.gs_mil_ctns.setDisplay(unl)

            if (unl) {
                tmp.el.gs.setHTML(format(player.aRes.grassskip,0))

                for (let x = 0; x < GS_MIL_LEN; x++) {
                    let m = MAIN.gs.milestone[x]
                    let unl = m.unl ? m.unl() : true
                    let id = "gs_mil_ctn"+x

                    tmp.el[id+"_div"].setDisplay(unl && (!player.options.hideMilestone || x+1 >= GS_MIL_LEN || player.aRes.grassskip < MAIN.gs.milestone[x+1].r))
                    tmp.el[id+"_div"].setClasses({bought: player.aRes.grassskip >= m.r})
                    if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(tmp.gsEffect[x]))
                }
            }
        }
    }
}