function getPlayerData() {
	let s = {
		upgs: {},
		autoUpg: {},

		time: 0,
		map_notify: {},
		options: {},
		version: VER,
		tb_ver: TB_VER,

		//RESOURCES
		grass: E(0),
		bestGrass: E(0),
		level: 0,
		xp: E(0),

		maxPerk: 0,
		spentPerk: 0,

		//PRESTIGE
		pp: E(0),
		bestPP: E(0),
		pTimes: 0,
		pTime: 0,

		tier: 0,
		tp: E(0),

		plat: 0,

		//CRYSTALIZE
		crystal: E(0),
		bestCrystal: E(0),
		cTimes: 0,
		cTime: 0,

		chal: {
			progress: {},
			comp: [],
			max: [],
		},

		//GRASSHOP
		grasshop: 0,
		steel: E(0),
		sTimes: 0,
		sTime: 0,

		chargeRate: E(0),
		bestCharge: E(0),

		decel: false,
		aRes: {
			grass: E(0),
			bestGrass: E(0),

			level: 0,
			xp: E(0),

			tier: 0,
			tp: E(0),

			ap: E(0),
			bestAP: E(0),
			aTimes: 0,
			aTime: 0,

			oil: E(0),
			bestOil: E(0),
			lTimes: 0,
			lTime: 0,
		},

		rocket: {
			total_fp: 0,
			amount: 0,
			part: 0,
			momentum: 0,
		},

		//will be moved later
		gTimes: 0,
		gTime: 0,
		stars: E(0),
		lowGH: 1e300,

		astral: 0,
		sp: E(0),

		moonstone: 0,
		grassskip: 0,
		gsUnl: false,

		star_chart: {
			auto: [],
			speed: [],
			progress: [],
		},
	}
	for (let x in UPGS) {
		s.upgs[x] = []
		s.autoUpg[x] = false
	}
	return s
}

function newPlayer() {
	player = getPlayerData()
}

function safecheckSave(data) {
	if (findNaN(data, true)) {
		alert("Your save fails to load, because it got NaNed!")
		return false
	}

	const ver_check = data.tb_ver || data.ver || 0
	if (ver_check < 1.02 && (data.decel ? data.level : data.aRes.level) >= 300) {
		alert("Your save fails to load, because it got inflated!")
		return false
	}
	return true
}

const VER = 0.0306
const EX_COMMIT = 11
const TB_VER = 1.02
function loadPlayer(data) {
	player = deepUndefinedAndDecimal(data, getPlayerData())
	convertStringToDecimal()

	//Vanilla
	if (!player.version) player.version = 0
	if (player.version < 0.0306 && player.rocket.total_fp > 0) {
		player.rocket.total_fp = 0
		player.rocket.amount = 0
		resetUpgrades('rocket')

		player.steel = E(0)
		player.chargeRate = E(0)
		resetAntiRealm()
	}
	player.version = VER

	//Thunderized Balancing
	if (player.ver !== undefined) {
		player.tb_ver = player.ver
		delete player.ver
	}
	if (player.tb_ver === undefined) {
		player.tp = E(0)
		player.tier = 0
		delete player.upgs.pp[2]
	}
	if (player.tb_ver < 1.02) {
		player.chal.progress = { }

		resetAntiRealm()
		player.aRes.aTimes = player.aTimes
		player.aRes.lTimes = player.lTimes
		delete player.aGrass
		delete player.aBestGrass
		delete player.ap
		delete player.bestAP
		delete player.aTime
		delete player.aTimes
		delete player.oil
		delete player.bestOil
		delete player.lTime
		delete player.lTimes

		player.rocket.momentum = player.momentum
		delete player.rocket.momentum
	}
	player.tb_ver = TB_VER
}

function deepNaN(obj, data) {
	for (let x = 0; x < Object.keys(obj).length; x++) {
		let k = Object.keys(obj)[x]
		if (typeof obj[k] == 'string') {
			if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) obj[k] = data[k]
		} else {
			if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
			if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
		}
	}
	return obj
}

function deepUndefinedAndDecimal(obj, data) {
	if (obj == null) return data
	for (let x = 0; x < Object.keys(data).length; x++) {
		let k = Object.keys(data)[x]
		if (obj[k] === null) continue
		if (obj[k] === undefined) obj[k] = data[k]
		else {
			if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
			else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
		}
	}
	return obj
}

function convertStringToDecimal() {
	
}

function cannotSave() { return false }

let saveInterval
function save() {
	let str = btoa(JSON.stringify(player))
	if (cannotSave() || findNaN(str, true)) return
	tmp.prevSave = localStorage.getItem("rgci_aarex")
	localStorage.setItem("rgci_aarex",str)
	console.log("Game Saved")
}

function resetSaveInterval() {
	clearInterval = saveInterval
	saveInterval = setInterval(save, 30000)
}

function load(str) {
	let data
	if (str && str !== null) data = JSON.parse(atob(str))
	if (data && safecheckSave(data)) loadPlayer(data)
	else newPlayer()

	resetSaveInterval()
	resetMap()
	resetTemp()
	for (let x = 0; x < 50; x++) updateTemp()
}

function exporty() {
	let str = btoa(JSON.stringify(player))
	if (findNaN(str, true)) return

	save();
	let file = new Blob([str], {type: "text/plain"})
	window.URL = window.URL || window.webkitURL;
	let a = document.createElement("a")
	a.href = window.URL.createObjectURL(file)
	a.download = "RGCI Thunderized Balancing - "+new Date().toGMTString()+".txt"
	a.click()
}

function export_copy() {
	let str = btoa(JSON.stringify(player))
	if (findNaN(str, true)) return

	let copyText = document.getElementById('copy')
	copyText.value = str
	copyText.style.visibility = "visible"
	copyText.select();
	document.execCommand("copy");
	copyText.style.visibility = "hidden"
	console.log("Exported to clipboard")
}

function importy() {
	let loadgame = prompt("Paste your save. WARNING: THIS WILL OVERWRITE THIS SAVE!")
	if (loadgame != null) {
		let keep = player
		try {
			let data = JSON.parse(atob(loadgame))
			if (!safecheckSave(data)) return
			load(loadgame)
			save()
		} catch (error) {
			alert("Error importing")
			console.error(error)
			player = keep
		}
	}
}

function loadGame(start=true, gotNaN=false) {
	for (let x in UPGS) {
		UPGS_SCOST[x] = []
		for (let y in UPGS[x].ctn) UPGS_SCOST[x][y] = UPGS[x].ctn[y].cost(0)
	}

	load(localStorage.getItem("rgci_aarex"))

	setupHTML()
	updateHTML()

	grassCanvas()
	tmp.el.loading.el.remove()
	setInterval(loop, 100/3)
	setInterval(checkNaN, 1000)
}

function wipe() {
	if (!confirm('Are you sure you want to wipe your save?')) return
	if (!confirm("This will reset everything, with no rewards! Are you really sure to wipe?")) return
	alert("If you did that accidentally, you can reload to retrieve your save. However, you have 30 seconds to think!")
	load() //blank save
}

function checkNaN() {
	if (findNaN(player)) {
		alert("Game Data got NaNed")
		load(localStorage.getItem("rgci_aarex"))
	}
}

function findNaN(obj, str=false, data=getPlayerData()) {
	if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
	for (let x = 0; x < Object.keys(obj).length; x++) {
		let k = Object.keys(obj)[x]
		if (typeof obj[k] == "number") if (isNaN(obj[k])) return true
		if (str) {
			if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return true
		} else {
			if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return true
		}
		if (typeof obj[k] == "object") return findNaN(obj[k], str, data[k])
	}
	return false
}