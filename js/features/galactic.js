RESET.gal = {
	unl: _=>true,
	req: _=>player.rocket.part==10,
	reqDesc: _=>`Get 10 Rocket Parts to unlock.`,

	resetDesc: `Galactic will reset <b class="red">EVERYTHING prior</b> except Rocket Fuel and Refinery Upgrades! Last chance before departure...`,
	resetGain: _=> `Coming soon!`,

	title: `Galactic`,
	resetBtn: `Soon!`,

	reset(force=false) {
		if (!force) return
		if (this.req() || force) {
			if (!force) {
				if (!player.gal) player.gal = setupGal()
				player.gal.times++
			}

			this.doReset()
		}
	},

	doReset(order="gal") {
		player.gal.time = 0

		player.plat = 0
		player.chal.comp = []
		player.chal.max = []
		player.grasshop = 0
		player.steel = E(0)
		player.bestCharge = E(0)
		player.decel = false
		player.rocket = { total_fp: 0, amount: player.rocket.amount, part: 0, momentum: 0 }
		resetAntiRealm()

		resetUpgrades("auto")
		resetUpgrades("plat")
		resetUpgrades("factory")
		resetUpgrades("foundry")
		resetUpgrades("gen")
		resetUpgrades("assembler")
		resetUpgrades("momentum")

		RESET.steel.doReset(order)
	},
}

tmp_update.push(_=>{
	let data = {}
	tmp.gal = data

	if (!galUnlocked()) return
})

function galTick(dt) {
	player.gal.time += dt
}

function galUnlocked() {
	return player.gal?.times > 0
}

function setupGal() {
	return {
		time: 0,
		times: 0
	}
}