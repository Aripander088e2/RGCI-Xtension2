var mapID = 'g'
var mapLoc = "Grass Field"

var mapPos
function resetMap() {
	mapPos = {
		dim: "earth",
		earth: [1,1],
		space: [1,1]
	}

	let pos = getMapPos()
	switchMapPos(pos[0], pos[1], mapPos.dim)
}

window.addEventListener('keydown', e=>{
	if (shiftDown) return
	if (e.keyCode == 65 || e.keyCode == 37) moveMap(-1,0)
	if (e.keyCode == 68 || e.keyCode == 39) moveMap(1,0)
	if (e.keyCode == 87 || e.keyCode == 38) moveMap(0,-1)
	if (e.keyCode == 83 || e.keyCode == 40) moveMap(0,1)
})

const MAP = {
	earth: [
		[null,  'opt',   'stats','fd','rf' ],
		['upg', 'g',     'pc',   'gh','gal'],
		['auto','chrono','chal', 'dc',null ],
	],
	space: [
		['opt','stats', null ,null ],
		['gal','sc',   'at'  ,'sac'],
		[null , null  ,'chal',null ]
	]
}

const MAP_UNLS = {
	opt: _ => true,
	stats: _ => player.pTimes > 0,
	chrono: _ => player.grasshop > 0 || player.sTimes > 0,

	//EARTH
	g: _ => true,
	upg: _ => true,
	auto: _ => player.level > 1 || player.pTimes > 0,
	pc: _ => player.level > 5 || player.pTimes > 0,
	chal: _ => player.pTimes > 0,
	gh: _ => player.cTimes > 0,
	fd: _ => hasUpgrade("factory", 0),
	dc: _ => hasUpgrade("factory", 4),
	rf: _ => hasUpgrade("factory", 5) || galUnlocked(),
	gal: _ => player.rocket.part > 0 || galUnlocked(),

	//SPACE
	sc: _ => true,
	at: _ => true,
	sac: _ => hasAGHMilestone(6),
}

const MAP_IDS = (_=>{
	let x = []
	for (i of Object.values(MAP)) for (j of i) for (k of j) if (k) x.push(k)
	return x
})()

function unlockedMap(dx,dy,dim) {
	let i = MAP?.[dim]?.[dy]?.[dx] 
	return MAP_UNLS[i] && MAP_UNLS[i]()
}

function getMapPos() {
	return mapPos[mapPos.dim]
}

function moveMap(dx,dy) {
	let pos = getMapPos()
	switchMapPos(pos[0]+dx,pos[1]+dy,mapPos.dim)
}

function switchMapPos(mx,my,dim) {
	if (unlockedMap(mx,my,dim)) {
		mapPos[dim] = [mx, my]
		if (mapPos.dim == dim) switchMapId(MAP[dim][my][mx])
	}
}

function switchMapId(id) {
	mapID = id
	delete player.map_notify[id]
	if (tmp.el) showLoc(MAP_LOCS[id])
}

el.update.map = _=>{
	for (x in MAP_IDS) {
		let id = MAP_IDS[x]
		let m_div = tmp.el["map_div_"+id]

		if (m_div) m_div.setDisplay(id == mapID)
	}

	let dim = mapPos.dim
	let [mx,my] = getMapPos()

	updateMapButton("lMap", mx-1, my, dim)
	updateMapButton("rMap", mx+1, my, dim)
	updateMapButton("uMap", mx, my-1, dim)
	updateMapButton("dMap", mx, my+1, dim)

	tmp.el.spaceButton.setDisplay(galUnlocked())
	tmp.el.spaceButton.setTxt("(Z) " + (inSpace() ? "Go to Ground" : "Go to Space"))
}

function updateMapButton(el, mx, my, dim) {
	const mapId = MAP?.[dim]?.[my]?.[mx]
	tmp.el[el].setClasses({
		map_btn: true,
		locked: !unlockedMap(mx, my, dim),
		[MAP_COLORS[mapId]]: unlockedMap(mx, my, dim) && !player.map_notify[mapId],
		notify: player.map_notify[mapId],
	})
}

/* EXTENSION */
const MAP_COLORS = {
	opt: "misc",
	stats: "misc",
	chrono: "gh",

	//EARTH
	g: "grass",
	auto: "grass",
	upg: "grass",
	pc: "pp",
	chal: "crystal",
	gh: "gh",
	fd: "gh",
	dc: "gh",
	rf: "gh",
	gal: "gal",

	//SPACE
	sc: "gal",
	at: "gal",
	sac: "gal"
}

el.update.map_ext = _ => {
	let pos = getMapPos()
	let mapId = MAP[mapPos.dim][pos[1]][pos[0]]
	tmp.el.position.setTxt(`(${pos[0]},${pos[1]}) ${MAP_LOCS[mapId]}: ${GO_TO_NAMES[mapId]}`)

	tmp.el.mapBtn.setClasses({ notify: Object.keys(player.map_notify).length > 0 })
	tmp.el.map_div.setDisplay(go_to)
	if (go_to) {
		for (const [dim, d_dim] of Object.entries(MAP)) {
			tmp.el[`map_div_${dim}`].setDisplay(mapPos.dim == dim)
			if (mapPos.dim != dim) continue

			for (const [y, dy] of Object.entries(d_dim)) {
				for (const [x, dx] of Object.entries(dy)) {
					if (dx !== null) {
						const unl = MAP_UNLS[dx]()
						tmp.el[`map_btn_${dim}_${dx}`].setDisplay(unl)
						if (unl) updateMapButton(`map_btn_${dim}_${dx}`, x, y, dim)
					}
				}
			}
		}
	}
}

//Locations
const MAP_LOCS = {
	opt: "Misc",
	stats: "Misc",
	chrono: "Misc",

	//EARTH
	g: "Field",
	auto: "Upgrades",
	upg: "Upgrades",
	pc: "Prestige",
	chal: "Challenges",
	gh: "Prestige",
	fd: "Factory",
	dc: "Challenges",
	rf: "Factory",

	//SPACE
	gal: "Prestige",
	sc: "Space",
	at: "Space",
	sac: "Space",
}

let locTimeout
function showLoc(x) {
	if (x == mapLoc) return
	mapLoc = x

	tmp.el.loc.setHTML(x)
	tmp.el.loc.setOpacity(1)

	clearTimeout(locTimeout)
	locTimeout = setTimeout(() => tmp.el.loc.setOpacity(0), 3000)
}

//Map
const GO_TO_NAMES = {
	opt: "Options",
	stats: "Stats",
	chrono: "Chronology",

	//EARTH
	g: "Field",
	auto: "Automation",
	upg: "Upgrades",
	pc: "Prestige",
	chal: "Challenges",
	gh: "Grasshop",
	fd: "Foundry",
	dc: "Deceleration",
	rf: "Refinery",
	gal: "Galactic",

	//SPACE
	sc: "Star Chart",
	at: "Astral",
	sac: "Sacrifice",
}

let go_to = false
el.setup.go_to = _ => {
	let html = ""
	for (const [dim, d_dim] of Object.entries(MAP)) {
		html += `<table id="map_div_${dim}">`
		for (const [y, dy] of Object.entries(d_dim)) {
			html += "<tr>"
			for (const [x, dx] of Object.entries(dy)) {
				html += "<td>"
				if (dx !== null) html += `<button id="map_btn_${dim}_${dx}" onclick="switchMapPos(${x}, ${y}, '${dim}')">${GO_TO_NAMES[dx]}</button>`
				html += "</td>"
			}
			html += "</tr>"
		}
		html += "</table>"
	}
	new Element("map_div").setHTML(html)
}

//Notifications
const MAP_NOTIFY = {
	opt: _ => 0,
	stats: _ => player.pTimes > 0 ? 1 : 0,

	//EARTH
	g: _ => 0,
	auto: _ => galUnlocked() || hasUpgrade("factory", 3) ? 2 :
		player.pTimes > 0 || player.level >= 5 ? 1 :
		0,
	upg: _ => player.cTimes > 0 || player.tier >= 2 ? 2 :
		player.pTimes > 0 || player.level >= 1 ? 1 :
		0,
	pc: _ => player.cTimes > 0 || player.level > 100 ? 2 :
		player.pTimes > 0 || player.level >= 30 ? 1 :
		0,
	chal: _ => player.sTimes > 0 ? 2 :
		player.cTimes > 0 ? 1 :
		0,
	gh: _ => galUnlocked() ? 0 :
		player.grasshop + (player.level >= MAIN.gh.req() ? 1 : 0),
	fd: _ => galUnlocked() || hasUpgrade("factory", 2) ? 3 :
		hasUpgrade("factory", 1) ? 2 :
		hasUpgrade("factory", 0) ? 1 :
		0,
	dc: _ => galUnlocked() || hasUpgrade("factory", 4) ? 1 : 0,
	rf: _ => galUnlocked() || hasUpgrade("factory", 6) ? 2 :
		hasUpgrade("factory", 5) ? 1 :
		0,
	gal: _ => galUnlocked() || player.rocket.part >= 10 ? 1 : 0,

	//SPACE
	sc: _ => 0,
	at: _ => 0,
	sac: _ => 0,
}

tmp_update.push(_=>{
	for (let [id, cond] of Object.entries(MAP_NOTIFY)) {
		cond = cond()
		if (tmp.map_notify[id] === undefined) tmp.map_notify[id] = cond
		if (cond > tmp.map_notify[id]) {
			tmp.map_notify[id] = cond
			player.map_notify[id] = 1
		}
	}
})

//Dimensions
function inSpace() {
	return mapPos.dim == "space"
}

function goToSpace() {
	switchDim(mapPos.dim == "space" ? "earth" : "space")
}

function switchDim(id) {
	mapPos.dim = id

	let pos = getMapPos()
	switchMapId(MAP[mapPos.dim][pos[1]][pos[0]])
}