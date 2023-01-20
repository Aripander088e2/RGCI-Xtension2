let MILESTONE = {}

tmp_update.push(_=>{
	tmp.milestone = {}
	for (let [id, ms] of Object.entries(MILESTONE)) {
		if (!ms.req()) return

		let sub = {}
		for (let [i, m] of Object.entries(ms.milestone)) if (m.eff) sub[i] = m.eff(ms.res())
		tmp.milestone[id] = sub
	}
})

function getMilestoneEff(id, x, def) {
	return tmp.milestone?.[i]?.[x] || def
}

function hasMilestone(id, x) {
	let mil = MILESTONE[id]
	return mil.res() >= mil.milestone[x].req
}

function setupMilestonesHTML(x) {
	let d = MILESTONE[x]
	let h = ""

	h += `<div style="position:absolute;top:50%;width: 100%;transform:translateY(-50%);font-size:30px;" id="mil_req_${x}">
		${d.reqDesc}
	</div><div id="mil_ctn_${x}">
		<span id='mil_title_${x}'></span>
		<div class="milestone_ctns">`

	for (let i in d.milestone) {
		let m = d.milestone[i]

		h += `
		<div id="mil_div_${x+i}">
			<h3>${d.title_ms(m.req)}</h3><br>
			${m.desc}
			${m.effDesc?`<br>Effect: <b class="cyan" id="mil_eff_${x+i}"></b>`:""}
		</div>
		`
	}

	h += `</div></div>`

	let el = new Element("mil_div_"+x)
	el.setHTML(h)
	el.addClass("milestone_div")
	el.addClass(x)
}

el.setup.milestone = _=>{
	for (let x in MILESTONE) setupMilestonesHTML(x)
}

function updateMilestoneHTML(x) {
	let d = MILESTONE[x]
	let unl = d.unl()
	tmp.el["mil_div_"+x].setDisplay(unl)
	if (!unl) return

	let req = d.req()
	tmp.el["mil_ctn_"+x].setDisplay(req)
	tmp.el["mil_req_"+x].setDisplay(!req)
	if (!req) return

	let res = d.res()
	let ms = d.milestone
	tmp.el["mil_title_"+x].setHTML(d.title(res))
	for (let i = 0; i < ms.length; i++) {
		let m = ms[i]
		let unl = m.unl ? m.unl() : true
		let id = "mil_div_"+x+i
		let got = hasMilestone(x, i)

		tmp.el[id].setDisplay(unl && (!player.options.hideMilestone || !got))
		tmp.el[id].setClasses({bought: got})
		if (m.effDesc) tmp.el["mil_eff_"+x+i].setHTML(m.effDesc(tmp.milestone[x][i]))
	}
}