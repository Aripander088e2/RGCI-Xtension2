el.update.astral = _=>{
	//Astral
	let astral_unl = galUnlocked()
	tmp.el.astral.setDisplay(astral_unl && inSpace())
	if (astral_unl) {
		tmp.el.astral_top_bar.changeStyle("width",tmp.gal.astral.progress*100+"%")
		tmp.el.astral_top_info.setHTML(`Astral <b class="magenta">${format(player.gal.astral,0)}</b>`)
	}
	if (mapID == 'g') {
		tmp.el.astral_div.setDisplay(astral_unl)
		if (astral_unl) {
			tmp.el.astral_amt.setTxt(format(player.gal.astral,0))
			tmp.el.astral_progress.setTxt(player.gal.sp.sub(tmp.gal.astral.prevReq).max(0).format(0)+" / "+tmp.gal.astral.curReq.format(0)+" SP")
			tmp.el.astral_bar.changeStyle("width",tmp.gal.astral.progress*100+"%")
			tmp.el.astral_cut.setTxt("+"+tmp.gal.astral.gain.format(1)+" SP/cut")
		}
	}
	if (mapID == 'at') {
		updateEffectHTML('astral')
	}
}

const ASTRAL = {
	spGain() {
		let r = E(1)

		r = r.mul(getChargeEff(7))
		r = r.mul(upgEffect('momentum', 12))
		if (hasStarTree("progress", 8)) r = r.mul(starTreeEff("progress", 8))
		if (hasStarTree("progress", 9)) r = r.mul(starTreeEff("progress", 9))
		r = r.mul(upgEffect('moonstone', 2))
        r = r.mul(getGSEffect(1))
		r = r.mul(upgEffect('sfrgt', 2))
		r = r.mul(upgEffect("unGrass", 3))

		return r
	},

	req(lvl) {
		if (!galUnlocked()) return EINF
		if (lvl < 0) return 0
		return E(2).pow(lvl ?? player.gal.astral).mul(1e3)
	},
	bulk() {
		if (!galUnlocked()) return 0
		if (player.gal.sp.lt(1e3)) return 0
		return player.gal.sp.div(1e3).log(2).floor().toNumber() + 1
	},
}

EFFECT.astral = {
	unl: _ => galUnlocked(),
	title: r => `Astral <b class="magenta">${format(r, 0)}</b>`,
	res: _ => player.gal.astral,
	effs: {
		tp: {
			unl: _ => true,
			eff: a => a+1,
			desc: x => `<b class="magenta">${format(x)}x</b> to TP`
		},
		fd: {
			unl: _ => true,
			eff: a => a/50+1,
			desc: x => `<b class="magenta">^${format(x)}</b> to Foundry effect`
		},
		st: {
			unl: _ => hasAGHMilestone(1),
			eff: a => E(2).pow(a/4),
			desc: x => `<b class="magenta">${format(x)}x</b> to Stars`
		},
		rf: {
			unl: _ => hasAGHMilestone(2),
			eff: a => a/20,
			desc: x => `<b class="magenta">+${format(x)}x</b> to Rocket Fuel`
		},
		ch: {
			unl: _ => hasAGHMilestone(3),
			eff: a => E(2).pow(a/3-3).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Charge`
		},
		xp: {
			unl: _ => hasAGHMilestone(4),
			eff: a => E(1.25).pow(a/2-5).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to XP`
		},
		fu: {
			unl: _ => hasAGHMilestone(5),
			eff: a => E(2).pow(a/2-10).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Fun`
		},
		sf: {
			unl: _ => hasAGHMilestone(6),
			eff: a => E(2).pow(a/2-10).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to SFRGT`
		},
		uh: {
			unl: _ => hasAGHMilestone(9),
			eff: a => Math.floor(Math.max(a/5-5,0)),
			desc: x => `<b class="magenta">+${format(x,0)}</b> to Unnatural Healing`
		},
		ap: {
			unl: _ => hasAGHMilestone(10),
			eff: a => 1+Math.min(a/500,.25),
			desc: x => `<b class="magenta">${format(x)}x</b> to AP per-25 multipliers`
		},
	},
}

function getAstralEff(id, def) {
	return getEffect("astral", id, def)
}

function updateAstralTemp() {
	let data = {}
	tmp.gal.astral = data

	data.gain = ASTRAL.spGain()
	data.prevReq = ASTRAL.req(player.gal.astral - 1)
	data.req = ASTRAL.req(player.gal.astral)
	data.curReq = E(data.req).sub(data.prevReq)
	data.progress = player.gal.sp.sub(tmp.gal.astral.prevReq).div(data.curReq).max(0).min(1).toNumber()
}