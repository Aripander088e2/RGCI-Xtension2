function inRecel() {
	return player.decel >= 2
}

RESET.recel = {
    unl: _=>hasUpgrade('factory',4),

    req: _=>true,
    reqDesc: _=>"",

    resetDesc: `<span style="font-size: 14px;">Recelerating nerfs everything until you Accelerate. You'll be able to cut un-Grass for new upgrades.
    </span>`,
    resetGain: _=> `Recelerating will force a Funify.`,

    title: `Recelerator`,
    resetBtn: `Recelerate`,
    hotkey: `Shift+T`,

    reset(force=false) {
        if (hasUpgrade("factory", 4)) {
            if (player.decel == 2) player.decel = 0
            else if (player.decel != 2) player.decel = 2
            RESET.steel.reset(true)
            RESET.fun.reset(true)
        }
    },
}

el.update.recel = _=>{
    if (mapID == "dc") tmp.el.reset_btn_recel.setTxt(player.decel == 2 ? "Accelerate" : "Decelerate")
}

UPGS.unGrass = {
    unl: _=> player.decel == 2,

    title: "Unnatural Grass Upgrades",

    autoUnl: _=>false,

    noSpend: _=>false,

    ctn: [
        /*{
            max: 1000,

            title: "Unnatural Grow Speed",
            desc: `Increase grass grow speed by <b class="green">+40%</b> per level.`,

            res: "unGrass",
            icon: ['Icons/Speed'],
            
            cost: i => Decimal.pow(1.75,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(1.75).floor().toNumber()+1,

            effect(i) {
                let x = i*.4+1

                return x
            },
            effDesc: x => format(x,1)+"x",
        }*/
    ],
}

/* NORMALITY */
MAIN.np = {
    gain() {
        let l = Math.max(player.level-49,0)
        let x = Decimal.pow(1.05,l).mul(l).mul(player.unBestGrass.div(1e33).max(1).root(5))

        tmp.npGainBase = x

        return x.floor()
    },
}

RESET.np = {
    unl: _=> player.recel,

    req: _=>player.level>=50,
    reqDesc: _=>`Reach Level 50 to Normality.`,

    resetDesc: `Normality resets your unnatural grass, unnatural grass upgrades, level, charge and astral for Normality Points (NP).<br>Gain more NP based on your level and unnatural grass.`,
    resetGain: _=> `Gain <b>${tmp.npGain.format(0)}</b> Normality Points`,

    title: `Normality`,
    resetBtn: `Normality`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.np = player.np.add(tmp.npGain)
                player.nTimes++

                player.bestNP2 = player.bestNP2.max(tmp.npGain)
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="n") {
        player.unGrass = E(0)
        player.unBestGrass = E(0)
        player.xp = E(0)
        player.level = 0

        player.chargeRate = E(0)
        player.astral = 0
        player.sp = E(0)

        resetUpgrades('unGrass')

        resetGlasses()

        updateTemp()
    },
}

UPGS.np = {
    unl: _=> player.recel,

    title: "Normality Upgrades",

    req: _=>player.nTimes > 0,
    reqDesc: _=>`Normality once to unlock.`,

    underDesc: _=>`You have ${format(player.np,0)} Normality Points`,

    autoUnl: _=>false,
    noSpend: _=>false,

    ctn: [
        {
            max: 1000,

            title: "Normality Grass Value",
            desc: `Increase grass gain by <b class="green">+25%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "np",
            icon: ["Curr/Grass"],
                        
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/4+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "Normality SP",
            desc: `Increase SP gain by <b class="green">+25%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "np",
            icon: ["Icons/SP"],
                        
            cost: i => Decimal.pow(1.2,i).mul(2).ceil(),
            bulk: i => i.div(2).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/4+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "Normality Dark Matter",
            desc: `Increase Dark Matter gain by <b class="green">+25%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
        
            res: "np",
            icon: ["Curr/DarkMatter"],
                        
            cost: i => Decimal.pow(1.35,i).mul(5).ceil(),
            bulk: i => i.div(5).max(1).log(1.35).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/4+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 500,

            title: "Normality Momentum",
            desc: `Increase momentum gain by <b class="green">+15%</b> every level.`,
        
            res: "np",
            icon: ["Curr/Momentum"],
                        
            cost: i => Decimal.pow(2,i**1.25).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(2).root(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = 1.15**i
        
                return x
            },
            effDesc: x => format(x)+"x",
        },
    ],
}

tmp_update.push(_=>{
    tmp.unRes.npGain = MAIN.np.gain()
})
