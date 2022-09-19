RESET.decel = {
    unl: _=>hasUpgrade('factory',4),

    req: _=>true,
    reqDesc: _=>"",

    resetDesc: `<span style="font-size: 14px;">Decelerating will temporarily slow down time and reduce the effectiveness of everything significantly until you press the Accelerate button.
    <br>During this time you will not be able to earn regular grass, Instead you earn anti-grass which is spent in Anti-Grass Upgrades panel which takes the place of regular Grass Upgrades panel.
    </span>`,
    resetGain: _=> `Decelerating will force a Steelie.`,

    title: `Decelerator`,
    resetBtn: `Decelerate`,

    reset(force=false) {
        if (true) {
            let aa = player.aRes

            if (player.decel) {
                aa.level = player.level
                aa.tier = player.tier
                aa.xp = player.xp
                aa.tp = player.tp
            }

            player.decel = !player.decel

            updateTemp()

            RESET.steel.reset(true)

            if (player.decel) {
                player.level = aa.level
                player.tier = aa.tier
                player.xp = aa.xp
                player.tp = aa.tp
            }
        }
    },
}

el.update.decel = _=>{
    tmp.el.grass_div.changeStyle("background-color", player.decel ? "#242697" : "")
    tmp.el.grass.changeStyle("background-color", player.decel ? "#002D9F" : "")
    tmp.el.fog.setDisplay(player.decel)
    if (mapID == "dc") tmp.el.reset_btn_decel.setTxt(player.decel?"Accelerate":"Decelerate")
}

UPGS.aGrass = {
    unl: _=> player.decel,

    title: "Anti-Grass Upgrades",
    underDesc: _=>`These upgrades affect the Normal Realm.`,

    autoUnl: _=>hasUpgrade('auto', 11),

    noSpend: _=>false,

    ctn: [
        {
            max: Infinity,

            title: "Anti-Grass Charge",
            desc: `Increase charge rate by <b class="green">+10%</b> per level.<br>This effect is increased by <b class="green">25%</b> every <b class="yellow">25</b> levels.`,

            res: "aGrass",
            icon: ['Curr/Charge'],
            
            cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/10+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            max: 40,

            title: "Anti-Grass Grow Speed",
            desc: `Increase grass grow speed by <b class="green">+10%</b> per level.`,

            res: "aGrass",
            icon: ['Icons/Speed'],
            
            cost: i => Decimal.pow(2,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(2).floor().toNumber()+1,

            effect(i) {
                let x = i/10+1

                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "Anti-Grass Steel",
            desc: `Increase steel gain by <b class="green">+10%</b> per level.<br>This effect is increased by <b class="green">25%</b> every <b class="yellow">25</b> levels.`,

            res: "aGrass",
            icon: ['Curr/Steel2'],
            
            cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
            bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/10+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            max: Infinity,

            title: "Anti-Grass Value",
            desc: `Increase grass gain by <b class="green">+25%</b> per level.<br>This effect is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

            res: "aGrass",
            icon: ['Curr/Grass'],
            
            cost: i => Decimal.pow(1.2,i).mul(1e4).ceil(),
            bulk: i => i.div(1e4).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/4+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            max: Infinity,

            title: "Anti-Grass XP",
            desc: `Increase XP gain by <b class="green">+10%</b> per level.<br>This effect is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

            res: "aGrass",
            icon: ['Icons/XP'],
            
            cost: i => Decimal.pow(1.2,i).mul(2e6).ceil(),
            bulk: i => i.div(2e6).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/10+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            unl: _ => player.aTimes > 0,

            max: Infinity,

            title: "Anti-Grass AP",
            desc: `Increase AP gain by <b class="green">+10%</b> per level.<br>This effect is increased by <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

            res: "aGrass",
            icon: ['Curr/Anonymity'],
            
            cost: i => Decimal.pow(1.15,i).mul(1e11).ceil(),
            bulk: i => i.div(1e11).max(1).log(1.15).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i/10+1)

                return x
            },
            effDesc: x => x.format()+"x",
        }
    ],
}