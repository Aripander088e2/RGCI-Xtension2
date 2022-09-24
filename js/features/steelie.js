MAIN.steel = {
    gain() {
        let x = E(1)
        if (hasUpgrade('factory',0)) x = x.mul(tmp.foundryEff)
        x = x.mul(upgEffect('foundry',0)).mul(upgEffect('foundry',1)).mul(upgEffect('foundry',2)).mul(upgEffect('foundry',3))

        x = x.mul(upgEffect('plat',6))
        x = x.mul(getGHEffect(8, 1))
        x = x.mul(chalEff(6))
        x = x.mul(tmp.chargeEff[0]||1)

        x = x.mul(upgEffect('aGrass',2))
        x = x.mul(upgEffect('oil',4))

        x = x.mul(upgEffect('rocket',5))
        x = x.mul(upgEffect('momentum',6))

        return x.floor()
    },
    foundryEff() {
        let max = Decimal.mul(100,upgEffect('factory',0))
        let x = max.mul(Math.min(player.sTime/3600,1)).max(1)

        return x
    },
    charger: {
        gain() {
            let x = E(upgEffect('factory',2)).mul(upgEffect('factory',3)).mul(upgEffect('factory',4))
            x = x.mul(upgEffect('gen',2)).mul(upgEffect('gen',3))
            x = x.mul(upgEffect('plat',7))
            x = x.mul(getGHEffect(9, 1))
            x = x.mul(chalEff(7))

            if (player.decel) x = x.div(1e6)
            x = x.mul(upgEffect('aGrass',0))
            x = x.mul(upgEffect('ap',1))

            x = x.mul(upgEffect('rocket',6))
            x = x.mul(upgEffect('momentum',7))

            return x
        },
        effs: [
            {
                req: E(1),
                eff(c) {
                    return player.crystal.add(1).pow(c.add(1).log10().pow(.2).div(40))
                },
                effDesc: x => "Crystals give "+format(x)+"x more Steel.",
            },{
                req: E(1e3),
                eff(c) {
                    return c.add(1).log10().pow(.2).div(3).pow10()
                },
                effDesc: x => "Each Tier gives "+format(x)+"x more PP.",
            },{
                req: E(1e6),
                eff(c) {
                    return c.add(1).log10().div(50).min(2).toNumber()
                },
                effDesc: x => "Strengthen Grass Upgrade's 'PP' by +"+format(x)+"x.",
            },{
                req: E(1e9),
                eff(c) {
                    return c.add(1).log10().div(50).add(1).min(2).toNumber()
                },
                effDesc: x => "Gain " + format(x) + "x Levels in Anti-Realm",
            },{
                req: E(1e12),
                eff(c) {
                    return c.add(1).log10().div(50).add(1).min(2).toNumber()
                },
                effDesc: x => "Strengthen Anti-Grass Upgrade's 'AP' by "+format(x)+"x.",
            },{
                req: E(1e15),
                eff(c) {
                    return c.add(1).log10().div(50).add(1).min(2)
                },
                effDesc: x => "Each Tier gives "+format(x)+"x more Oil.",
            },{
                req: E(1e18),
                eff(c) {
                    return c.add(1).log10().div(20)
                },
                effDesc: x => "Increase Tier base by +"+format(x,3)+"x.",
            },{
                req: E(1e21),
                eff(c) {
                    return c.add(1).log10().div(50).add(1).min(2)
                },
                effDesc: x => "Each Tier gives "+format(x)+"x more Crystals.",
            },{
                req: E(1e24),
                eff(c) {
                    return c.add(1).log10().pow(0.8).floor().toNumber()
                },
                effDesc: x => "Increase Prestige Upgrade's 'TP' cap by "+format(x,0)+" levels [soon]",
            }
        ],
    },
}

RESET.steel = {
    unl: _=>player.grasshop>=10||galUnlocked(),

    req: _=>!player.decel && player.level>=250,
    reqDesc: _=>player.decel ? `You can't Steelie in Anti-Realm!` : `Reach Level 250.`,

    resetDesc: `Reset everything grasshop does, but it benefits from the milestones for grasshop.`,
    resetGain: _=> `Gain <b>${tmp.steelGain.format(0)}</b> Steel`,

    title: `Steelie`,
    resetBtn: `Steelie!`,
    hotkey: `S`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.steel = player.steel.add(tmp.steelGain)
                player.sTimes++
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="steel") {
        player.sTime = 0
        RESET.gh.doReset(order)
    },
}

UPGS.factory = {
    title: "The Factory",

    unl: _=>player.sTimes > 0,

    underDesc: _=>`You have ${format(player.steel,0)} Steel`,

    ctn: [
        {
            max: 100,

            title: "Foundry",
            desc: `Unlock a building (on right of Factory) where you can upgrade steel production. Each level increases foundry's effect by <b class="green">+10%</b>.`,
        
            res: "steel",
            icon: ["Icons/Foundry"],
                        
            cost: i => Decimal.pow(1.5,i).ceil(),
            bulk: i => i.max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+1
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 100,

            title: "Generator",
            desc: `Unlock a building (on right of Factory) where you can upgrade prestige/crystal generation. Each level increases generator's effect by <b class="green">+1%</b>.`,
        
            res: "steel",
            icon: ["Icons/Generator"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = i/100+1
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 100,

            title: "Charger",
            desc: `Unlock a building (on right of Factory) where you can boost production multipliers with charge. Each level increases charge rate by <b class="green">+10%</b>.`,
        
            res: "steel",
            icon: ["Icons/Charger"],
                        
            cost: i => Decimal.pow(1.5,i).mul(1e6).ceil(),
            bulk: i => i.div(1e6).max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+1
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 100,

            title: "Assembler",
            desc: `Unlock a building (on Automation) where you can get more QoL. Each level increases charge rate by <b class="green">+10%</b>.`,
        
            res: "steel",
            icon: ["Icons/Assemblerv2"],
                        
            cost: i => Decimal.pow(2,i).mul(1e7).ceil(),
            bulk: i => i.div(1e7).max(1).log(2).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+1
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 100,

            title: "Decelerator",
            desc: `Unlock a building (on bottom of Factory) where you can slow down time. Each level increases charge rate by <b class="green">+10%</b>.`,
        
            res: "steel",
            icon: ["Icons/Decelerate Badge"],
                        
            cost: i => Decimal.pow(1.5,i).mul(1e15).ceil(),
            bulk: i => i.div(1e15).max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+1
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 100,

            title: "Refinery",
            desc: `Unlock a building (on bottom of Factory) where you can convert charge and oil into rocket fuel. Each level increases charge rate by <b class="green">+10%</b>.`,
        
            res: "steel",
            icon: ["Icons/Refinery"],
                        
            cost: i => Decimal.pow(1.5,i).mul(1e57).ceil(),
            bulk: i => i.div(1e57).max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+1
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 100,

            title: "Rocket Launch Pad",
            desc: `Unlock a building (on top of Factory) where you can build a rocket. Each level increases charge rate by <b class="green">+10%</b>.`,
        
            res: "steel",
            icon: ["Icons/LaunchPad"],
                        
            cost: i => Decimal.pow(1.5,i).mul(1e61).ceil(),
            bulk: i => i.div(1e61).max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                let x = i/10+1
        
                return x
            },
            effDesc: x => format(x)+"x",
        }
    ],
}

UPGS.foundry = {
    title: "Foundry",

    unl: _=>hasUpgrade('factory',0),

	underDesc: _=>`
		<b class="green">${tmp.foundryEff.format()}x</b>
		<span style="font-size:14px;">Steel gain (based on time since last Steelie)</span>
		<br>
		<span class="smallAmt" style="font-size:8px;">(Max: ${format(Decimal.mul(100,upgEffect('factory',0)))}x)</span>
	`,

    ctn: [
        {
            max: Infinity,

            title: "Steel Grass",
            desc: `Increase steel gain by <b class="green">+10%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "grass",
            icon: ["Curr/Steel2"],
                        
            cost: i => Decimal.pow(1.5,i).mul(1e40).ceil(),
            bulk: i => i.div(1e40).max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/10+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Steel Prestige",
            desc: `Increase steel gain by <b class="green">+10%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "pp",
            icon: ["Curr/Steel2"],
                        
            cost: i => Decimal.pow(1.5,i).mul(1e24).ceil(),
            bulk: i => i.div(1e24).max(1).log(1.5).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/10+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Steel Crystal",
            desc: `Increase steel gain by <b class="green">+10%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "crystal",
            icon: ["Curr/Steel2"],
                        
            cost: i => Decimal.pow(1.3,i**0.8).mul(1e11).ceil(),
            bulk: i => i.div(1e11).max(1).log(1.3).root(0.8).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/10+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Steel Steel",
            desc: `Increase steel gain by <b class="green">+20%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "steel",
            icon: ["Curr/Steel2"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/5+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },
    ],
}

UPGS.gen = {
    title: "Generator",

    unl: _=>hasUpgrade('factory',1),

    underDesc: _=>`<b class="green">${format(upgEffect('factory',1))}x</b> <span style="font-size:14px;">to PP/Crystal generator multiplier from factory upgrade</span>`,

    ctn: [
        {
            max: 90,

            title: "PP Generation",
            desc: `<b class="green">+0.1%</b> passive PP generation per level.`,
        
            res: "steel",
            icon: ["Curr/Prestige"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = i/1e3
        
                return x
            },
            effDesc: x => "+"+formatPercent(x)+"/s",
        },{
            max: 90,

            title: "Crystal Generation",
            desc: `<b class="green">+0.1%</b> passive Crystal generation per level.`,
        
            res: "steel",
            icon: ["Curr/Crystal"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1e12).ceil(),
            bulk: i => i.div(1e12).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = i/1e3
        
                return x
            },
            effDesc: x => "+"+formatPercent(x)+"/s",
        },{
            max: Infinity,

            unl: _=>hasUpgrade("factory", 2),

            title: "Prestige Charge",
            desc: `Increase charge rate by <b class="green">+10%</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "pp",
            icon: ["Curr/Charge"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1e45).ceil(),
            bulk: i => i.div(1e45).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/10+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            unl: _=>hasUpgrade("factory", 2),

            title: "Crystal Charge",
            desc: `Increase charge rate by <b class="green">+25%</b> per level. This effect is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "crystal",
            icon: ["Curr/Charge"],
                        
            cost: i => Decimal.pow(1.15,i**0.8).mul(1e14).ceil(),
            bulk: i => i.div(1e14).max(1).log(1.15).root(0.8).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/4+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },
    ],
}

UPGS.assembler = {
    title: "Assembler",

    unl: _=>hasUpgrade('factory',3),

    ctn: [
        {
            title: "Grass Upgrades EL",
            desc: `Grass Upgrades no longer spend Grass.`,
        
            res: "steel",
            icon: ["Curr/Grass","Icons/Infinite"],
                        
            cost: i => E(1e9),
            bulk: i => 1,
        },{
            title: "Prestige Upgrades EL",
            desc: `Prestige Upgrades no longer spend PP.`,
        
            res: "steel",
            icon: ["Curr/Prestige","Icons/Infinite"],
                        
            cost: i => E(1e11),
            bulk: i => 1,
        },{
            title: "Crystal Upgrades EL",
            desc: `Crystalize Upgrades no longer spend Crystals.`,
        
            res: "steel",
            icon: ["Curr/Crystal","Icons/Infinite"],

            cost: i => E(1e13),
            bulk: i => 1,
        },{
            title: "Perk Autobuy",
            desc: `You can now automatically buy Perk Upgrades.`,

            res: "steel",
            icon: ['Curr/Perks','Icons/Automation'],

            cost: i => E(1e15),
            bulk: i => 1,
        },{
            title: "Perk Save G",
            desc: `Keep perks on Grasshop, and Steelie Challenges.`,

            res: "steel",
            icon: ['Curr/Perks','Icons/StarProgression'],

            cost: i => E(1e20),
            bulk: i => 1,
        },{
            max: 10,

            title: "Challenge Save P",
            desc: `Keep Prestige challenge completions on Grasshop and Steelie.`,

            res: "pp",
            icon: ['Icons/Challenge','Icons/StarProgression'],

            cost: i => E(10).pow((i*2+9)**1.5),
            bulk: i => Math.floor(E(i).log10().root(1.5).sub(9).div(2).toNumber())+1,

            effect(i) {
                return i
            },
            effDesc: x => "Up to "+format(x,0)+" completions",
        },{
            max: 10,

            title: "Challenge Save C",
            desc: `Keep Crystalize challenge completions on Grasshop and Steelie.`,

            res: "crystal",
            icon: ['Icons/Challenge','Icons/StarProgression'],

            cost: i => E(10).pow(i+15),
            bulk: i => Math.floor(E(i).log10().root(1.5).sub(15).toNumber())+1,

            effect(i) {
                return i
            },
            effDesc: x => "Up to "+format(x,0)+" completions",
        },{
            title: "Challenge Save G",
            desc: `Keep all challenge completions on Grasshop.`,

            res: "steel",
            icon: ['Icons/Challenge','Icons/StarProgression'],

            cost: i => E(1e12),
            bulk: i => 1,

        },{
            max: 10,

            title: "Challenge Auto",
            desc: `Auto-complete Prestige / Crystalize Challenges without entering.`,

            res: "steel",
            icon: ['Icons/Challenge','Icons/Automation'],

            cost: i => E(1e24),
            bulk: i => 1,

            effect(i) {
                return 300 / i
            },
            effDesc: x => (hasUpgrade("assembler", 8) ? "Every "+format(x,0)+" seconds" : "Active challenges only"),
        },{
            title: "Challenge Bulk",
            desc: `You can enter multiple challenges at once.`,

            res: "steel",
            icon: ['Icons/Challenge','Icons/Multiply'],

            cost: i => E(1e9),
            bulk: i => 1,
        }
    ],
}

tmp_update.push(_=>{
    let ms = MAIN.steel
    
    tmp.steelGain = ms.gain()
    tmp.foundryEff = ms.foundryEff()

    tmp.chargeGain = ms.charger.gain()

    tmp.chargeOoM = getGHEffect(10, 0) + getGHEffect(11, 0)
    tmp.chargeOoMMul = Decimal.pow(10, tmp.chargeOoM)

    for (let x = 0; x < ms.charger.effs.length; x++) {
        let ce = ms.charger.effs[x]
        let unl = ce.unl ? ce.unl() : true
        tmp.chargeEff[x] = ce.eff(unl && player.chargeRate.gt(ce.req) ? player.chargeRate.mul(tmp.chargeOoMMul.div(ce.req).max(1)) : E(0))
    }
})

el.setup.factory = _=>{
    let table = new Element(charge_mil)
    let h = "Best Charge Milestones:"

    for (x in MAIN.steel.charger.effs) {
        let ce = MAIN.steel.charger.effs[x]

        h += `<div id="charge_mil${x}">${format(ce.req,0)} - <span id="charge_mil_eff${x}"></span></div>`
    }

    table.setHTML(h)
}

el.update.factory = _=>{
    if (mapID == "fd") {
        let unl = hasUpgrade('factory',2)

        tmp.el.charger_div.setDisplay(unl)

        if (unl) {
            tmp.el.charge_upper.setHTML("<b class='yellow'>Temp. Charge:</b> "+player.chargeRate.format(0)+" <span class='smallAmt'>"+player.chargeRate.formatGain(tmp.chargeGain)+"</span>")
            tmp.el.charge_under.setHTML("<b class='yellow'>Best Charge:</b> "+player.bestCharge.format(0))

            for (x in MAIN.steel.charger.effs) {
                let ce = MAIN.steel.charger.effs[x]
                let unl = ce.unl ? ce.unl() : true

                tmp.el['charge_mil'+x].setDisplay(unl)
                if (unl) {
                    tmp.el['charge_mil'+x].setClasses({green: player.bestCharge.gte(ce.req)})

                    tmp.el['charge_mil_eff'+x].setHTML(ce.effDesc(tmp.chargeEff[x]))
                }
            }
        }
    }
}