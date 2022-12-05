MAIN.fun = {
	gain() {
		let x = E(1)
		x = x.mul(upgEffect('funMachine', 0))
		x = x.mul(upgEffect('fundry', 0))
		x = x.mul(upgEffect('fundry', 1))
		x = x.mul(upgEffect('fundry', 2))
		x = x.mul(upgEffect('fundry', 3))

		return x
	},
	SFRGTgain() {
		return E(1)
	},
}

RESET.fun = {
	unl: _=>tmp.gs.shown&&player.aRes.grassskip>=8,

	req: _=>player.aRes.level>=270,
	reqDesc: _=>`Reach Level 270.`,

	resetDesc: `Reset everything grass-skip does, but it benefits from the milestones for grass-skip.`,
	resetGain: _=> `Gain <b>${tmp.aRes.funGain.format(0)}</b> Fun`,

	title: `Funify`,
	resetBtn: `Coming soon!`,/*`Funify!`,
	hotkey: `Shift+S`,*/

	reset(force=false) {
		return

		if (this.req()||force) {
			if (!force) {
				player.aRes.fun = player.aRes.fun.add(tmp.aRes.funGain)
				player.aRes.fTimes++
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="fun") {
		RESET.gs.doReset(order)
	},
}

tmp_update.push(_=>{
	let mf = MAIN.fun
	
	tmp.aRes.funShown = player.decel && player.aRes.fTimes
	tmp.aRes.SFRGTgain = mf.SFRGTgain()
	tmp.aRes.funGain = mf.gain()
})

UPGS.funMachine = {
	title: "The Funny Machine",

	unl: _ => player.aRes.grassskip >= 8 && tmp.gs.shown,

	req: _ => player.aRes.fTimes > 0,
	reqDesc: _=>`Funify once to unlock.`,

	underDesc: _=>`You have ${format(player.aRes.fun,0)} Fun`,

	ctn: [
		{
			max: Infinity,

			title: "Fundry",
			desc: `Unlock a building where you can upgrade fun production. Each level increases fun by <b class="green">+50%</b>.`,
		
			res: "fun",
			icon: ["Icons/Fundry"],
						
			cost: i => Decimal.pow(2,i).ceil(),
			bulk: i => i.max(1).log(2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/2+1
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Super Fun Real Good Time Generator",
			desc: `Unlock a building where you can generate SFRGT and spend them on powerful upgrades. Each level increases SFRGT generation by <b class="green">+50%</b>.`,
		
			res: "fun",
			icon: ["Curr/SuperFun"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e6).ceil(),
			bulk: i => i.div(1e6).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/10+1
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 100,

			title: "Charger Mk.II",
			desc: `Unlock new charge milestones. Each level increases charge rate by <b class="green">+10%</b>.`,
		
			res: "fun",
			icon: ["Icons/Charger"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e11).ceil(),
			bulk: i => i.div(1e11).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/10+1
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 1,

			title: "Assembler Mk.II",
			desc: `Unlock new Assembler upgrades that keep on Galactic.`,
		
			res: "fun",
			icon: ["Icons/Assembler"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e14).ceil(),
			bulk: i => i.div(1e14).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/10+1
		
				return x
			},
			effDesc: x => format(x)+"x",
		},
	],
}

UPGS.fundry = {
	title: "Fundry",

	unl: _ => tmp.aRes.funShown && hasUpgrade('funMachine',0),

	ctn: [
		{
			max: Infinity,

			title: "Steel Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "steel",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.5,i).mul(1e42).ceil(),
			bulk: i => i.div(1e42).max(1).log(1.5).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Star Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "star",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e4).ceil(),
			bulk: i => i.div(1e4).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasUpgrade("funMachine", 1),

			max: Infinity,

			title: "SFRGT Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "SFRGT",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.3,i).mul(100).ceil(),
			bulk: i => i.div(100).max(1).log(1.3).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Fun Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "fun",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
			bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},
	],
}

UPGS.sfrgt = {
	title: "Super Fun Real Good Time Generator",

	unl: _ => tmp.aRes.funShown && hasUpgrade('funMachine', 1),

	underDesc: _=>`You have ${format(player.aRes.sfrgt,0)} SFRGT <span class='smallAmt'>${player.aRes.sfrgt.formatGain(tmp.aRes.SFRGTgain)}</span>`,

	ctn: [
		{
			max: Infinity,

			title: "SFRGT Generation",
			desc: `<b class="green">Double</b> SFRGT gain.`,
		
			res: "fun",
			icon: ["Curr/SuperFun"],

			cost: i => Decimal.pow(10,i).mul(1e5).ceil(),
			bulk: i => i.div(1e5).max(1).log(10).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(2,i)
		
				return x
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: Infinity,

			title: "Funny Stars",
			desc: `<b class="green">Double</b> Star gain.`,
		
			res: "SFRGT",
			icon: ["Curr/Star"],

			cost: i => Decimal.pow(10,i).mul(1e5).ceil(),
			bulk: i => i.div(1e5).max(1).log(10).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(2,i)
		
				return x
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: Infinity,

			title: "Funny Astral",
			desc: `<b class="green">Double</b> Space Power gain.`,
		
			res: "SFRGT",
			icon: ["Icons/SP"],

			cost: i => Decimal.pow(10,i).mul(1e5).ceil(),
			bulk: i => i.div(1e5).max(1).log(10).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(2,i)
		
				return x
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: 10,

			title: "Funny Charge",
			desc: `Charge bonuses start <b class="green">10x</b> earlier.`,
		
			res: "SFRGT",
			icon: ["Icons/Charge", "Icons/StarSpeed"],

			cost: i => Decimal.pow(10,i).mul(1e5).ceil(),
			bulk: i => i.div(1e5).max(1).log(10).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(2,i)
		
				return x
			},
			effDesc: x => format(x,0)+"x",
		}
	],
}