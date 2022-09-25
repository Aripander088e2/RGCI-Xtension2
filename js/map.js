var mapID = 'g'
var mapPos = [1,1]
var mapLoc = "Grass Field"

window.addEventListener('keydown', e=>{
    if (e.keyCode == 65 || e.keyCode == 37) moveMap(-1,0)
    if (e.keyCode == 68 || e.keyCode == 39) moveMap(1,0)
    if (e.keyCode == 87 || e.keyCode == 38) moveMap(0,-1)
    if (e.keyCode == 83 || e.keyCode == 40) moveMap(0,1)
})

const MAP = [
    [null,  'opt', null, 'fd','rl'],
    ['p',   'g',  'pc',  'gh','gal'],
    ['auto', null,'chal','dc', null],
]

const MAP_UNLS = {
	g: _ => true,
	opt: _ => true,
	auto: _ => true,
	p: _ => true,
	pc: _ => true,
	chal: _ => player.pTimes > 0,
	gh: _ => player.cTimes > 0,
	fd: _ => hasUpgrade("factory", 0),
	dc: _ => hasUpgrade("factory", 4),
	rf: _ => hasUpgrade("factory", 5) || galUnlocked(),
	gal: _ => player.rocket.part > 0 || galUnlocked(),
}

const MAP_LOCS = {
	g: "Grass Field",
	opt: "Miscellaneous",
	auto: "Upgrades",
	p: "Upgrades",
	pc: "Prestige",
	chal: "Challenges",
	gh: "Prestige",
	fd: "Factory",
	dc: "Challenges",
	rf: "Refinery",
	gal: "Prestige",
}

const MAP_IDS = (_=>{
    let x = []
    for (i in MAP) for (j in MAP[i]) if (MAP[i][j]) x.push(MAP[i][j])
    return x
})()

function unlockedMap(dx,dy) {
	let i = MAP?.[dy]?.[dx] 
	return MAP_UNLS[i] && MAP_UNLS[i]()
}

function moveMap(dx,dy) {
    switchMap(mapPos[0]+dx,mapPos[1]+dy)
}

function switchMap(mx,my) {
    if (unlockedMap(mx,my)) {
        mapPos[0] = mx
        mapPos[1] = my

        mapID = MAP[my][mx]
        showLoc(MAP_LOCS[mapID])
    }
}

el.update.map = _=>{
    for (x in MAP_IDS) {
        let id = MAP_IDS[x]
        let m_div = tmp.el["map_div_"+id]

        if (m_div) m_div.setDisplay(id == mapID)
    }

    let [mx,my] = mapPos

    tmp.el.lMap.setClasses({locked: !unlockedMap(mx-1,my)})
    tmp.el.rMap.setClasses({locked: !unlockedMap(mx+1,my)})
    tmp.el.uMap.setClasses({locked: !unlockedMap(mx,my-1)})
    tmp.el.dMap.setClasses({locked: !unlockedMap(mx,my+1)})
}

/* EXTENSION */
let locTimeout
function showLoc(x) {
	if (x == mapLoc) return
	mapLoc = x

	tmp.el.loc.setHTML(x)
	tmp.el.loc.setOpacity(1)

	clearTimeout(locTimeout)
	locTimeout = setTimeout(() => tmp.el.loc.setOpacity(0), 3000)
}

let go_to = false
const go_to_locs = [
	{
		name: "Field",
		map: [1, 1],
		unl: _ => true,
	}, {
		name: "Upgrades",
		map: [0, 1],
		unl: _ => true,
	}, {
		name: "Automation",
		map: [0, 2],
		unl: _ => player.cTimes > 0,
	}, {
		name: "Prestige",
		map: [2, 1],
		unl: _ => player.pTimes > 0,
	}, {
		name: "Challenges",
		map: [2, 2],
		unl: _ => player.grasshop > 0,
	}, {
		name: "Foundry",
		map: [3, 0],
		unl: _ => hasUpgrade("factory", 0)
	}, {
		name: "Settings",
		map: [1, 0],
		unl: _ => true,
	}
]

el.setup.go_to = _ => {
	let html = ""
	for (const [index, data] of Object.entries(go_to_locs)) {
		html += `<button id="btn_goto${index}" onclick="switchMap(${data.map})">${data.name}</button>`
	}
	new Element("go_to_div").setHTML(html)
}

el.update.go_to = _ => {
	tmp.el.go_to_div.setDisplay(go_to)
	if (go_to) {		
		for (const [index, data] of Object.entries(go_to_locs)) tmp.el["btn_goto"+index].setDisplay(data.unl())
	}
}