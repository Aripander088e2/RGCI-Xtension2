var tmp = {}
var tmp_update = []

function resetTemp() {
	keep = []
	tmp = {
		el: tmp.el,
		map_notify: {},

		stats_tab: 'grass',

		spawn_time: 0,
		rangeCut: 50,
		autocut: 5,
		autocutTime: 0,
		autocutAmt: 1,
		spawnAmt: 1,
		compact: 1,

		platChance: 0.001,
		platGain: 1,

		grasses: [],
		level: {},
		tier: {},

		upgs: {},
		upg_res: {},
		upg_ch: {},

		chal: {
			bulk: [],
			amt: [],
			goal: [],
			eff: [],
		},

		chargeEff: [],

		perks: 0,

		gh: {
			eff: {}
		},
		aRes: {
			gs: {
				eff: {}
			}
		},
		unRes: {},

		gSpeed: 1,
		gJump: 0,
	}

	for (let x in UPG_RES) tmp.upg_res[x] = E(0)

	for (let x in UPGS) {
		tmp.upg_ch[x] = -1
		tmp.upgs[x] = {
			unlLength: 0,
			max: [],
			cost: [],
			bulk: [],
			eff: [],
		}
	}
}

function updateTemp() {
	tmp.realmSrc = [player, player.aRes, player.unRes][player.decel]
	for (let x = 0; x < tmp_update.length; x++) tmp_update[x]()
}