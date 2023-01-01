RESET.planetoid = {
	unl: _=>hasAGHMilestone(8),

	req: _=>hasAGHMilestone(13),
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

RESET.break_ring = {
	unl: _=>false,

	req: _=>false,
	reqDesc: _=>"",

	resetDesc: `<b class="red">Coming soon! Wait until this comes out in RGCI or I got Lethal's permission.</b>`,
	resetGain: _=> ``,

	title: `Break The Ring`,
	resetBtn: `Do it.`,

	reset(force=false) {
		
	},
	doReset(order = "break_ring") {
		player.rocket.momentum = 0
		player.gal.dm = E(0)
		resetUpgrades('momentum')
		resetUpgrades('funMachine')
		resetUpgrades('dm')
		resetUnnaturalRealm()
		//resetDarkTree()

		RESET.sac.reset(order)
		//RESET.planetary.reset(order)
	},
}
RESET.supernova = {
	unl: _=>false,

	req: _=>false,
	reqDesc: _=>"",

	resetDesc: `<b class="red">Coming soon! Wait until this comes out in RGCI or I got Lethal's permission.</b>`,
	resetGain: _=> ``,

	title: `Supernova`,
	resetBtn: `Do it!`,

	reset(force=false) {
		
	},
	doReset(order = "sn") {
		tmp.chal.bulk = []
		player.chal.comp[8] = 0
		player.chal.max[8] = 0

		player.decel = 0
		player.gal.neg = 0
		player.gal.moonstone = 0
		player.gal.dm = E(0)
		player.gal.star_chart = setupGal().star_chart
		resetUpgrades('rocket')
		resetUpgrades('moonstone')
		resetUpgrades('funMachine')
		resetUpgrades('dm')
		resetUnnaturalRealm()
		//resetDarkTree()
		//resetObelisks()
		//resetConstellations()

		RESET.sac.reset(order)
		//RESET.constellation.reset(order)
	},
}