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
			desc: `<b class="green">4x</b> more TP. Unlock new automation upgrades.`,
		},{
			r: 2,
			desc: `<b class="green">Double</b> Crystals.`,
		},{
			r: 3,
			desc: `<b class="green">+0.2</b> Platinum per Grasshop. (starting at 2)`,
			effect: _=>Math.max(0,(tmp.gh.eff-2)/5),
			effDesc: x=> "+"+format(x,1),
		},{
			r: 4,
			desc: `<b class="green">+0.1x</b> Perks per Grasshop. (starting at 3)`,
			effect: _=>Math.max(0,(tmp.gh.eff-2)/10),
			effDesc: x=> "+"+format(x,1),
		},{
			r: 5,
			desc: `<b class="green">+0.1x</b> Tier multiplier base.`,
		},{
			r: 6,
			desc: `Platinum is <b class="green">2x</b> more common.`,
		},{
			r: 8,
			desc: `<b class="green">2x</b> more XP.`,
		},{
			r: 10,
			desc: `Unlock Steelie reset.`,
		},{
			unl: _=>player.sTimes,

			r: 11,
			desc: `<b class="green">Double</b> Steel per Grasshop. (starting at 11)`,
			effect: _=>E(2).pow(Math.max(0,tmp.gh.eff-10)),
			effDesc: x=> format(x,0)+"x",
		},{
			unl: _=>galUnlocked()||hasUpgrade('factory',2),

			r: 12,
			desc: `<b class="green">Double</b> Charge per Grasshop. (starting at 12 and ending at 30)`,
			effect: _=>E(2).pow(Math.max(0,Math.min(tmp.gh.eff,30)-11)),
			effDesc: x=> format(x,0)+"x",
		},{
			unl: _=>galUnlocked()||hasUpgrade('factory',3),

			r: 15,
			desc: `Unlock 'Crystal Clear' challenge.`
		},{
			unl: _=>galUnlocked()||hasUpgrade('factory',3),

			r: 16,
			desc: `Charge rate bonuses start 10x earlier per Grasshop. (starting at 16)`,
			effect: _=>Math.max(0,tmp.gh.eff-15),
			effDesc: x=> format(E(10).pow(x),0)+"x",
		},{
			unl: _=>galUnlocked()||hasUpgrade('factory',4),

			r: 18,
			desc: `Unlock 'Empower' challenge.`
		}
	],
}

const GH_MIL_LEN = MAIN.gh.milestone.length
function getGHEffect(x,def=1) { return tmp.gh.ms_eff[x]||def }

RESET.gh = {
	unl: _=> player.cTimes > 0 && !tmp.aRes.gs.shown,
	req: _=> player.level >= 200 && !player.decel && !inChal(9),
	reqDesc: _=> player.decel ? `You can't Grasshop until you Accelerate!` : `Reach Level 200.`,

	resetDesc: `Reset everything Crystalize does, and so Crystalize and Challenges.`,
	resetGain: _ => galUnlocked() || player.grasshop ? `Reach Level <b>${format(tmp.gh.req,0)}</b> to Grasshop` : ``,

	title: `Grasshop`,
	btns: `
		<button id="multGHBtn" onclick="player.ghMult = !player.ghMult">Multi: <span id="multGHOption">OFF</span></button>
		<button id="autoGHBtn" onclick="player.ghAuto = !player.ghAuto">Auto: <span id="autoGHOption">OFF</span></button>
	`,
	resetBtn: `Grasshop!`,
	hotkey: `G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			if (player.level < MAIN.gh.req()) return
		}

		if (galUnlocked() || force) {
			this.gainAndReset()
		} else if (!tmp.gh.running) {
			tmp.gh.running = true
			document.body.style.animation = "implode 2s 1"
			setTimeout(_=>{
				this.gainAndReset()
			},1000)
			setTimeout(_=>{
				document.body.style.animation = ""
				tmp.gh.running = false
			},2000)
		}
	},

	gainAndReset() {
		let res = MAIN.gh.bulk()
		if (!player.ghMult) res = Math.min(res, player.grasshop + 1)

		player.grasshop = res
		this.doReset()
	},

	doReset(order="gh") {
		player.crystal = E(0)
		player.chargeRate = E(0)

		let keep = hasStarTree("qol", 11) || (hasUpgrade('assembler', 7) && order == "gh")
		if (!keep) {
			tmp.chal.bulk = []
			for (let i = 0; i < 2; i++) player.chal.comp[i] = Math.min(upgEffect('assembler', 5, 0), player.chal.comp[i])
			for (let i = 2; i < 6; i++) player.chal.comp[i] = Math.min(upgEffect('assembler', 6, 0), player.chal.comp[i])
		}

		resetUpgrades('crystal')

		RESET.crystal.doReset(order)
	},
}

function grassHopped() {
	return player.grasshop || player.sTimes
}

tmp_update.push(_=>{
	tmp.gh.req = MAIN.gh.req()
	tmp.gh.eff = player.grasshop
	if (galUnlocked()) tmp.gh.eff += (player.gal.ghPotential - player.grasshop) * (1 - starTreeEff("progress", 12, 0))

	for (let x = 0; x < GH_MIL_LEN; x++) {
		let m = MAIN.gh.milestone[x]
		if (m.effect) tmp.gh.ms_eff[x] = m.effect()
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
}

el.update.milestones = _=>{
	if (mapID == 'gh') {
		let unl = player.cTimes > 0 && !tmp.aRes.gs.shown
		tmp.el.reset_btn_gh.setClasses({locked: player.level < tmp.gh.req})

		tmp.el.multGHBtn.setDisplay(hasStarTree("qol", 5))
		tmp.el.multGHOption.setTxt(player.ghMult?"ON":"OFF")

		tmp.el.autoGHBtn.setDisplay(hasStarTree("auto", 7))
		tmp.el.autoGHOption.setTxt(player.ghAuto?"ON":"OFF")

		tmp.el.milestone_div_gh.setDisplay(unl)
		if (unl) {
			unl = grassHopped()

			tmp.el.gh_mil_req.setDisplay(!unl)
			tmp.el.gh_mil_ctns.setDisplay(unl)

			if (unl) {
				tmp.el.gh.setHTML(format(player.grasshop,0))

				for (let x = 0; x < GH_MIL_LEN; x++) {
					let m = MAIN.gh.milestone[x]
					let unl = m.unl ? m.unl() : true
					let id = "gh_mil_ctn"+x

					tmp.el[id+"_div"].setDisplay(unl && (!player.options.hideMilestone || player.grasshop < MAIN.gh.milestone[x].r))
					tmp.el[id+"_div"].setClasses({bought: player.grasshop >= m.r})
					if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(tmp.gh.ms_eff[x]))
				}
			}
		}
	}
}

function changeGHMult() { player.ghMult = !player.ghMult }