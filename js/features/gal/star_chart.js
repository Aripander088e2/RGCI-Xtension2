const SC_IDS = {
    auto: [],
    speed: [],
    progress: [],
}

const STAR_CHART = {
    auto: [],
    speed: [],
    progress: [],
	/*
        {
            max: 10,

            title: "Stellar Grass Cap",
            desc: `Increase grass cap by <span class="green">250</span> per level. <span class="lightblue">Unlock more upgrades.</span>`,

            icon: ['Icons/MoreGrass','Icons/StarProgression'],
                            
            cost: i => Math.ceil(5*300**i),
            bulk: i => i.div(5).max(1).log(300).floor().toNumber()+1,

            effect(i) {
                let x = 250*i
        
                return x
            },
            effDesc: x => "+"+format(x,0),
        },
	*/
}

function drawTree() {
	if (!retrieveCanvasData2()) return;
	tree_ctx.clearRect(0, 0, tree_canvas.width, tree_canvas.height);
    for (let id in STAR_CHART) if (tmp.sc_tab == id) {
        for (let i = 0; i < STAR_CHART[id].length; i++) {
            let tu = STAR_CHART[id][i]

            let branch = tu.branch||[]

            if (branch.length > 0 && tmp.sc_unl[id][i]) for (let y in branch) if (tmp.sc_unl[id][y]) {
                drawTreeBranch(id, branch[y], i)
            }
        }
	}
}

function treeCanvas() {
    if (!retrieveCanvasData2()) return
    if (tree_canvas && tree_ctx) {
        window.addEventListener("resize", resizeCanvas2)

        tree_canvas.width = tree_canvas.clientWidth
        tree_canvas.height = tree_canvas.clientHeight
    }
}

function drawTreeBranch(id, num1, num2) {
    var start = document.getElementById("sc_upg_"+id+num1).getBoundingClientRect();
    var end = document.getElementById("sc_upg_"+id+num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) - (document.body.scrollWidth-tree_canvas.width)/2;
    var y1 = start.top + (start.height / 2) - (window.innerHeight-tree_canvas.height) + 90;
    var x2 = end.left + (end.width / 2) - (document.body.scrollWidth-tree_canvas.width)/2;
    var y2 = end.top + (end.height / 2) - (window.innerHeight-tree_canvas.height) + 90;
    tree_ctx.lineWidth=10;
    tree_ctx.beginPath();
    let color = "#00520b"
    tree_ctx.strokeStyle = "#fff"
    tree_ctx.moveTo(x1, y1);
    tree_ctx.lineTo(x2, y2);
    tree_ctx.stroke();
}

el.setup.star_chart = _=>{
    let nt = new Element("star_chart_table")
    let h = ""

    for (let id in SC_IDS) {
        h += `<div id="star_chart_${id}">`

        let t = SC_IDS[id]

        for (let y in t) {
            h += `<div class="table_center">`

            for (let x in t[y]) {
                let i = t[y][x]

                let h2 = ""

                if (Number.isInteger(i) || i != "") {
                    let tu = STAR_CHART[id][i]
                    let icon = ['Bases/SpaceBase']
                    if (tu.icon) for (ic in tu.icon) icon.push(tu.icon[ic])
                    else icon.push('Icons/Placeholder')

                    h2 += `
                    <div class="sc_upg_ctn" id="sc_upg_${id}${i}" onclick="clickSCUpgrade('${id}', ${i})">`
                    for (ic in icon) h2 += `<img draggable="false" src="${"images/"+icon[ic]+".png"}">`
				    h2 += `<img id="sc_upg_${id}${i}_max_base" draggable="false" src="${"images/max.png"}">`
                    
                    h2 += `
                        <div id="sc_upg_${id}${i}_cost" class="scu_cost">??? Stars</div>
                        <div id="sc_upg_${id}${i}_amt" class="scu_amt">0</div>
				        <div class="upg_max" id="sc_upg_${id}${i}_max" class="upg_max">Maxed!</div>
                    </div>
                    `
                }

                h += `
                <div class="sc_upg_div">
                    ${h2}
                </div>
                `
            }

            h += `</div>`
        }

        h += `</div>`
    }

    nt.setHTML(h)
}

const SC_SCOST = {}

function hasStarTree(id,i) { return player.star_chart[id][i]>0 }
function starTreeEff(id,i,def=1) { return tmp.star_chart[id].eff[i]||def }
function starTreeAmt(id,i) { return player.star_chart[id][i]||0 }

function updateSCTemp() {
    let star = player.stars

    for (let id in STAR_CHART) {
        let tt = tmp.star_chart[id]

        for (let i = 0; i < STAR_CHART[id].length; i++) {
            let tu = STAR_CHART[id][i]
            let amt = player.star_chart[id][i]||0

            tt.max[i] = tu.max||1
            tt.cost[i] = tu.cost(amt)
            tt.bulk[i] = Decimal.gte(star,SC_SCOST[id][i])?Math.min(tu.bulk(star),tt.max[i]):0

            let unl = tu.unl?tu.unl():true
            let afford = star.gte(tt.cost[i])
            if (tu.branch) for (let y in tu.branch) if (!hasStarTree(id,tu.branch[y])) {
                afford = false
                unl = false
                break
            }

            tmp.sc_afford[id][i] = afford
            tmp.sc_unl[id][i] = unl

            if (tu.effect) tt.eff[i] = tu.effect(amt)
        }
    }
}

tmp_update.push(_=>{
    updateSCTemp()
})

function clickSCUpgrade(id,x) {
	if (shiftDown || (tmp.sc_choosed[0] == id && tmp.sc_choosed[1] == x)) buyMaxSCUpgrade(id, x)
	else tmp.sc_choosed = [id, x]
}

function buySCUpgrade(id,x) {
    let tu = tmp.star_chart[id]

    let amt = player.star_chart[id]

    if ((amt[x]||0) < tu.max[x]) if (Decimal.gte(player.stars,tu.cost[x])) {

        player.stars = player.stars.sub(tu.cost[x]).max(0)
        amt[x] = amt[x] ? amt[x] + 1 : 1

        updateSCTemp()
    }
}

function buyNextSCUpgrade(id,x) {
	let tu = tmp.star_chart[id]

    let upg = STAR_CHART[id][x]
    let amt = player.star_chart[id]
	let amt2 = amt[x]||0

	if (amt2 < tu.max[x] && Decimal.gte(player.stars,tu.cost[x])) {
		let bulk = Math.min(tu.bulk[x], Math.ceil((amt2 + 1) / 25) * 25)

		if (bulk > amt2) {
			let cost = upg.cost(bulk-1)

			amt[x] = Math.min(amt[x] ? Math.max(amt[x],bulk) : bulk,tu.max[x])
			player.stars = player.stars.sub(cost).max(0)

			updateSCTemp()
		}
	}
}

function buyMaxSCUpgrade(id,x) {
    let tu = tmp.star_chart[id]

    let upg = STAR_CHART[id][x]

    if (true) {
        let amt = player.star_chart[id]
	    let amt2 = amt[x]||0

        if (amt2 < tu.max[x]) if (Decimal.gte(player.stars,tu.cost[x])) {
            let bulk = tu.bulk[x]

            if (bulk > amt2) {
                let cost = upg.cost(bulk-1)

                amt[x] = Math.min(amt[x] ? Math.max(amt[x],bulk) : bulk,tu.max[x])
                player.stars = player.stars.sub(cost).max(0)

                updateSCTemp()
            }
        }
    }
}

function updateStarChart() {
    let star = player.stars
    let ch = tmp.sc_choosed

    tmp.el.starAmt.setTxt(star.format(0))

    tmp.el.sc_desc_div.setDisplay(ch[0])
    if (ch[0]) {
        let [id, i] = ch
        let tt = tmp.star_chart[id]
        let tu = STAR_CHART[id][i]
        let amt = player.star_chart[id][i]||0

        tmp.el.sc_title.setHTML(`[${id}-${i+1}] <h3>${tu.title}</h3>`)

        let h = `
        Level <b class="yellow">${format(amt,0)}${tt.max[i] < Infinity ? ` / ${format(tt.max[i],0)}` : ""}</b><br>
        ${tu.desc}
        `

        if (tu.effDesc) h += '<br>Effect: <span class="cyan">'+tu.effDesc(tt.eff[i])+"</span>"

        let canBuy = Decimal.gte(star, tt.cost[i])
        let hasBuy25 = (Math.floor(amt / 25) + 1) * 25 < tt.max[i]
        let hasMax = amt + 1 < tt.max[i]

        if (amt < tt.max[i]) {
            let cost2 = tu.costOnce?Decimal.mul(tt.cost[i],25-amt%25):tu.cost((Math.floor(amt/25)+1)*25-1)
            let cost3 = tu.costOnce?Decimal.mul(tt.cost[i],tt.max[i]-amt):tu.cost(tt.max[i]-1)
            if (hasBuy25) h += `<br><span class="${Decimal.gte(star,cost2)?"green":"red"}">Cost to next 25: ${format(cost2,0)} Stars</span>`
            else if (hasMax) h += `<br><span class="${Decimal.gte(star,cost3)?"green":"red"}">Cost to max: ${format(cost2,0)} Stars</span>`

            h += `<br><span class="${Decimal.gte(star,tt.cost[i])?"green":"red"}">Cost: ${format(tt.cost[i],0)} Stars</span>`
        } else h += "<br><b class='pink'>Maxed!</b>"

        tmp.el.sc_desc.setHTML(h)

        tmp.el["sc_upg_buy"].setClasses({ locked: !canBuy })
        tmp.el["sc_upg_buy"].setDisplay(amt < tt.max[i])
        tmp.el["sc_upg_buy"].setTxt("Buy" + (hasMax ? " 1" : ""))
        tmp.el["sc_upg_next"].setClasses({ locked: !canBuy })
        tmp.el["sc_upg_next"].setDisplay(hasBuy25)
        tmp.el["sc_upg_max"].setClasses({ locked: !canBuy })
        tmp.el["sc_upg_max"].setDisplay(hasMax)
    }

    for (let id in STAR_CHART) {
        let d = tmp.sc_tab == id
        let tt = tmp.star_chart[id]

        tmp.el["star_chart_"+id].setDisplay(d)

        if (d) for (let i = 0; i < STAR_CHART[id].length; i++) {
            let id2 = "sc_upg_"+id+i
            let ud = tmp.el[id2]

            if (!ud) continue

            let unl = tmp.sc_unl[id][i]

            tmp.el[id2].setClasses({sc_upg_ctn: true, choosed: ch[0] == id && ch[1] == i})
            tmp.el[id2].setDisplay(unl)

            if (id2) {
                let amt = player.star_chart[id][i]||0
                let maxed = amt == tt.max[i]

                tmp.el[id2+"_amt"].setTxt(format(amt,0))
                tmp.el[id2+"_amt"].setDisplay(!maxed)
                tmp.el[id2+"_cost"].setDisplay(!maxed)
                tmp.el[id2+"_cost"].setTxt(format(tt.cost[i],0,6)+" Stars")
                tmp.el[id2+"_cost"].setClasses({scu_cost: true, locked: star.lt(tt.cost[i]) && amt < tt.max[i]})
                tmp.el[id2+"_max"].setDisplay(maxed)
                tmp.el[id2+"_max_base"].setDisplay(maxed)
            }
        }
    }
}