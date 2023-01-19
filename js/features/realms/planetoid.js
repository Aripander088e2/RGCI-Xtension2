RESET.planetoid = {
	unl: _=>hasAGHMilestone(8),

	req: _=>hasAGHMilestone(11),
	reqDesc: _=>"Get 45 Negative Energy.",

	resetDesc: `<b class="red">Coming soon! Wait until Planetoid comes out in RGCI or I got Lethal's permission.</b>`,
	resetGain: _=> ``,

	title: `Planetoid`,
	resetBtn: `...`,

	reset(force=false) {
		true
	},
}
RESET.planetoid_realm = RESET.planetoid