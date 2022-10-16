MAIN.chrono = {
	onCut() {
		player.gal.chrona++
	},

	click(toSpent, ability) {
		MAIN.chrono.abilities[ability](toSpent)
	},
	abilities: {
		warp: {
			power: (ch) => 0,
			perform(power) {
			}
		},
		speed: {
			power: (ch) => 0,
			perform(power) {
			}
		}
	}
}

function updateChronoTemp() {
	let data = tmp.gal.chrono || {}
	if (!tmp.gal.chrono) tmp.gal.chrono = data
}

el.update.chrono = _ => {
	if (mapID !== "time") return

	const unl = false //galUnlocked()
	tmp.el.time_req.setDisplay(!unl)
	tmp.el.time_div.setDisplay(unl)
	if (!unl) return

	tmp.el.time_chrona.setTxt(format(player.gal.chrona, 0))
}