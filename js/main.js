var player = {}, date = Date.now(), diff = 0;

function loop() {
    diff = Date.now() - date
    updateTemp()
    updateHTML()
    calc(diff/1000);
    date = Date.now();
}

let devMult = 1
const MAIN = {
    grassGain() {
        let x = upgEffect('grass',0).mul(tmp.tier.mult)

        x = x.mul(upgEffect('perk',0))
        x = x.mul(upgEffect('pp',0))
        x = x.mul(upgEffect('crystal',0))
        x = x.mul(upgEffect('plat',2))
        x = x.mul(upgEffect('aGrass',3))
        x = x.mul(chalEff(0))
        x = x.mul(tmp.chargeEff[5]||1)

        if (player.decel) x = x.div(1e4)
        x = x.mul(upgEffect('ap',0))
        x = x.mul(upgEffect('oil',0))

        x = x.mul(upgEffect('rocket',0))
        x = x.mul(upgEffect('momentum',0))

        return x
    },
    grassCap() {
        let x = 10+upgEffect('grass',1,0)+upgEffect('perk',1,0)+upgEffect('ap',4,0)
        if (player.options.lowGrass) x = Math.min(x, 250)

        return x
    },
    grassSpawn() {
        let x = 2.5
        x /= upgEffect('grass',2,1)
        x /= upgEffect('perk',2,1)
        x /= upgEffect('aGrass',1,1)
        x /= upgEffect('momentum',1)
        return x
    },
    xpGain() {
        let x = E(tmp.tier.mult)

        x = x.mul(upgEffect('grass',3))
        x = x.mul(upgEffect('perk',3))
        x = x.mul(upgEffect('pp',1))
        x = x.mul(upgEffect('crystal',1))
        x = x.mul(upgEffect('plat',1))
        x = x.mul(chalEff(1))

        if (player.grasshop >= 7) x = x.mul(2)
        x = x.mul(tmp.chargeEff[4]||1)

        if (player.decel) x = x.div(1e7)
        x = x.mul(upgEffect('aGrass',4))
        x = x.mul(upgEffect('ap',2))
        x = x.mul(upgEffect('oil',1))

        x = x.mul(upgEffect('rocket',1))
        x = x.mul(upgEffect('momentum',2))

        if (x.lt(1)) return x
        return x
    },
    tpGain() {
        if (inChal(2)) return E(0)

        let x = upgEffect('pp',2)

        x = x.mul(upgEffect('crystal',2))
        x = x.mul(upgEffect('plat',4))
        x = x.mul(upgEffect('perk',7))
        x = x.mul(chalEff(2))

        if (player.grasshop >= 1) x = x.mul(4)
        x = x.mul(tmp.chargeEff[2]||1)

        if (player.decel) x = x.div(1e4)
        x = x.mul(upgEffect('oil',2))

        x = x.mul(upgEffect('rocket',2))
        x = x.mul(upgEffect('momentum',3))

        return x
    },
    rangeCut: _=>50+upgEffect('grass',4,0)+upgEffect('perk',4,0),
    autoCut() {
		let interval = 5-upgEffect('auto',0,0)-upgEffect('plat',0,0)
		if (player.decel) interval *= 10 / upgEffect('auto', 10)
		return interval
	},
    level: {
        req(i) {
            if (player.decel) i /= upgEffect('ap',2,1)+upgEffect('oil',1,0)
            let x = Decimal.pow(1.4,i).mul(50)

            return x.ceil()
        },
        bulk(i) {
            let x = i.div(50)
            if (x.lt(1)) return 0

            x = x.log(1.4).toNumber()
            if (player.decel) x *= upgEffect('ap',2,1)+upgEffect('oil',1,0)
            return Math.floor(x)+1
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
        perk() {
            let x = chalEff(3)
            if (player.grasshop >= 4) x += getGHEffect(3, 0)

            return x * player.level
        },
    },
    tier: {
        req(i) {
            let x = Decimal.pow(4,i).mul(500)

            return x
        },
        bulk(i) {
            let x = i.div(500)
            if (x.lt(1)) return 0
            x = x.log(4)

            return Math.floor(x.toNumber()+1)
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
        base() {
			let x = upgEffect('crystal',3)
			if (player.decel) x = upgEffect('ap',3)
			if (player.grasshop >= 5) x += 0.1
			return x
        },
        mult(i) {
            return Decimal.pow(MAIN.tier.base(), i)
        },
    },
    checkCutting() {
        if (player.xp.gte(tmp.level.next)) {
            player.level = Math.max(player.level, tmp.level.bulk)
        }
        if (player.tp.gte(tmp.tier.next)) {
            player.tier = Math.max(player.tier, tmp.tier.bulk)
        }
    }, 
}

el.update.main = _=>{
    let g = player.decel ? player.aGrass : player.grass

    tmp.el.grassAmt.setHTML(g.format(0))
    tmp.el.grassGain.setHTML(tmp.autoCutUnlocked ? formatGain(g,tmp.grassGain.div(tmp.autocut).mul(tmp.autocutBonus).mul(tmp.autocutAmt)) : "")

    let tier_unl = player.pTimes > 0

    tmp.el.level_top_bar.changeStyle("width",tmp.level.percent*100+"%")
    tmp.el.level_top_info.setHTML(`Level <b class="cyan">${format(player.level,0)}</b> (${formatPercent(tmp.level.percent)})`)

    tmp.el.tier.setDisplay(tier_unl)
    if (tier_unl) {
        tmp.el.tier_top_bar.changeStyle("width",tmp.tier.percent*100+"%")
        tmp.el.tier_top_info.setHTML(`Tier <b class="yellow">${format(player.tier,0)}</b> (${formatPercent(tmp.tier.percent)})`)
    }

    if (mapID == 'g') {
        tmp.el.level_amt.setTxt(format(player.level,0))
        tmp.el.level_progress.setTxt(tmp.level.progress.format(0)+" / "+tmp.level.next.sub(tmp.level.cur).format(0)+" XP")
        tmp.el.level_bar.changeStyle("width",tmp.level.percent*100+"%")
        tmp.el.level_cut.setTxt("+"+tmp.XPGain.format(1)+" XP/cut")

        tmp.el.tier_div.setDisplay(tier_unl)

        if (tier_unl) {
            tmp.el.tier_amt.setTxt(format(player.tier,0))
            tmp.el.tier_progress.setTxt(tmp.tier.progress.format(0)+" / "+tmp.tier.next.sub(tmp.tier.cur).format(0)+" TP")
            tmp.el.tier_bar.changeStyle("width",tmp.tier.percent*100+"%")
            tmp.el.tier_cut.setTxt("+"+tmp.TPGain.format(1)+" TP/cut")
            tmp.el.tier_mult.setTxt(formatMult(tmp.tier.mult,0)+" → "+formatMult(MAIN.tier.mult(player.tier+1),0)+" multiplier")
        }
    }
}

tmp_update.push(_=>{
    tmp.grassCap = MAIN.grassCap()
    tmp.grassSpawn = MAIN.grassSpawn()
    tmp.rangeCut = MAIN.rangeCut()
    tmp.autocut = MAIN.autoCut()

    tmp.autoCutUnlocked = hasUpgrade('auto',0)

    tmp.autocutBonus = upgEffect('auto',1)
    tmp.autocutAmt = 1+upgEffect('auto',2,0)
    tmp.spawnAmt = 1+upgEffect('perk',5,0)+upgEffect('crystal',5,0)

    tmp.grassGain = MAIN.grassGain()
    tmp.XPGain = MAIN.xpGain()
    tmp.TPGain = MAIN.tpGain()

    tmp.perks = MAIN.level.perk()
    tmp.perkUnspent = Math.max(player.maxPerk-player.spentPerk,0)

    let lvl = player.level
    tmp.level.next = MAIN.level.req(lvl)
    tmp.level.bulk = MAIN.level.bulk(player.xp)
    tmp.level.cur = MAIN.level.cur(lvl)
    tmp.level.progress = player.xp.sub(tmp.level.cur).max(0).min(tmp.level.next)
    tmp.level.percent = tmp.level.progress.div(tmp.level.next.sub(tmp.level.cur)).max(0).min(1).toNumber()

    let t = player.tier

    tmp.tier.next = MAIN.tier.req(t)
    tmp.tier.bulk = MAIN.tier.bulk(player.tp)
    tmp.tier.cur = MAIN.tier.cur(t)
    tmp.tier.progress = player.tp.sub(tmp.tier.cur).max(0).min(tmp.tier.next)
    tmp.tier.percent = tmp.tier.progress.div(tmp.tier.next.sub(tmp.tier.cur)).max(0).min(1).toNumber()
    tmp.tier.mult = MAIN.tier.mult(t)

    tmp.platChance = 0.001
    if (player.grasshop >= 6) tmp.platChance *= 2

    tmp.platGain = 1
    tmp.platGain += chalEff(5)
    if (player.grasshop >= 3) tmp.platGain += getGHEffect(2, 0)
})

window.addEventListener('keydown', function(event) {
	switch (event.key) {
		case "p":
			RESET.pp.reset();
			break;
		case "c":
			RESET.crystal.reset();
			break;
		case "g":
			RESET.gh.reset();
			break;
		case "s":
			RESET.steel.reset();
			break;
		case "a":
			RESET.ap.reset();
			break;
		case "l":
			RESET.oil.reset();
			break;
	}
}, false);