MAIN.chrono = {
	unl: () => player.sTimes,
	setup() {
		return {
			speed: 1,
			amt: 0
		}
	},

	toggle() {
		player.ch.speed = 2
	},
	tick(dt) {
		if (player.ch.speed == 2) {
			player.ch.amt = Math.max(player.ch.amt - dt * 2, 0)
			if (player.ch.amt == 0) player.ch.speed = 1
		} else {
			player.ch.amt = Math.min(player.ch.amt + dt, 1e3)
		}
	}
}

el.update.chrono = _=>{
	if (mapID == 'chrono') {
		let unl = player.sTimes > 0

		tmp.el.chrono_unl.setDisplay(!unl)
		tmp.el.chrono_div.setDisplay(unl)

		if (unl) {
			tmp.el.chrono_speed.setTxt("2x Speed: " + (player.ch.speed == 2 ? "ON" : "OFF"))
			tmp.el.chrono_amt.setTxt(player.ch.amt.toFixed(1))
		}
	}
}