//ANTI-GRASSHOPS OR NEGATIVE ENERGY
function resetGHPotential() {
	player.gal.ghPotential = 0
	player.gal.gsPotential = 0
}

MAIN.agh_milestone = [
    {
        r: 3,
        desc: `<b class="green">Double</b> Space Power.`
    }, {
        r: 6,
        desc: `Astral boosts Stars.`,
    }, {
        r: 8,
        desc: `Astral boosts Rocket Fuel.`,
    }, {
        r: 12,
        desc: `Astral boosts Charge.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 15,
        desc: `Astral boosts XP.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 18,
        desc: `Astral boosts Fun.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 20,
        desc: `Astral boosts SFRGT.`,
    }, {
        unl: _ => player.aRes.fTimes,

        r: 21,
        desc: `Unlock the Dark Matter Plant reset. Moonstone chance is doubled.`,
    }, {
        unl: _ => player.gal.sacTimes,

        r: 33,
        desc: `Unlock the Recelerator upgrade in Fun Machine.`,
    }, {
        unl: _ => player.gal.sacTimes,

        r: 35,
        desc: `Astral adds Tier multiplier base.`,
    }, {
        unl: _ => hasUpgrade("funMachine", 3),

        r: 37,
        desc: `Astral adds Unnatural Healing.`,
    }, {
        unl: _ => hasUpgrade("funMachine", 3),

        r: 39,
        desc: `Astral multiplies effects for each 25 levels of AP upgrade.`,
    }, {
        unl: _ => hasUpgrade("funMachine", 3),

        r: 42,
        desc: `Astral multiplies effects for each 25 levels of Factory upgrade.`,
    }, {
        unl: _ => hasUpgrade("funMachine", 3),

        r: 45,
        desc: `Unlock the Planetoid. (Soon!)`,
    }
]

const AGH_MIL_LEN = MAIN.agh_milestone.length
function hasAGHMilestone(x,def=1) { return tmp.gal && player.gal.neg >= MAIN.agh_milestone[x].r }
function getAGHEffect(x,def=1) { return (tmp.gal && tmp.gal.agh.eff[x]) || def }
function updateAGHTemp() {
	let data = tmp.gal.agh || {}
	if (!tmp.gal.agh) tmp.gal.agh = data

	data.neg = Math.floor(30 - player.grasshop * (tmp.gal.sc ? 1 - starTreeEff("progress", 13, 0) : 1) + Math.floor(player.aRes.level / 10))
	data.eff = {}
    for (let x = 0; x < AGH_MIL_LEN; x++) {
        let m = MAIN.agh_milestone[x]
        if (m.effect) data.eff[x] = m.effect()
    }
}

el.setup.agh = _ => {
	let t = new Element("milestone_div_agh")
	let h = ""

	h += `<div style="position:absolute;top:50%;width: 100%;transform:translateY(-50%);font-size:30px;" id="agh_mil_req">
		Get "Negative Energy" upgrade in Progress Chart.
	</div><div id="agh_mil_ctns">
		<span style="font-size: 10px">
			Negative Energy: <b id="agh">0</b> (Potential: <b id="agh_potent">0</b>)<br>
			(gain more by -1 Grasshop or +10 Best Anti-Realm Levels from 200)
		</span>
		<div class="milestone_ctns">
	`

	for (i in MAIN.agh_milestone) {
		let m = MAIN.agh_milestone[i]

		h += `
		<div id="agh_mil_ctn${i}_div">
			<h3>${m.r} Negative Energy</h3><br>
			${m.desc}
			${m.effDesc?`<br>Effect: <b class="cyan" id="agh_mil_ctn${i}_eff"></b>`:""}
		</div>
		`
	}

	h += `</div></div>`

	t.setHTML(h)
}

el.update.agh = _=>{
	if (mapID != 'at') return

	tmp.el.agh_mil_req.setDisplay(!hasStarTree("progress", 6))
	tmp.el.agh.setHTML(format(player.gal.neg,0))
	tmp.el.agh_potent.setHTML(format(tmp.gal.agh.neg,0))

	for (let x = 0; x < AGH_MIL_LEN; x++) {
		let m = MAIN.agh_milestone[x]
		let unl = m.unl ? m.unl() : true
		let id = "agh_mil_ctn"+x

		tmp.el[id+"_div"].setDisplay(unl && (!player.options.hideMilestone || x+1 >= AGH_MIL_LEN || !hasAGHMilestone(x+1)))
		tmp.el[id+"_div"].setClasses({bought: hasAGHMilestone(x)})
		if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(getAGHEffect(x)))
	}
}