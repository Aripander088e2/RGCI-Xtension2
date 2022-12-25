function calc(dt, skip) {
	//CHRONOLOGY
	if (MAIN.chrono.unl() && !skip) {
		MAIN.chrono.tick(dt)
		dt *= player.ch.speed
	}

	//GALACTIC
	player.time += dt
	if (galUnlocked()) galTick(dt)

	//UNNATURAL REALM
	if (player.unRes) {
		player.unRes.nTime += dt
		if (inRecel()) MAIN.checkCutting(2)
	}

	//ANTI-REALM
	if (!inRecel()) {
		player.aRes.aTime += dt
		player.aRes.lTime += dt
		player.aRes.fTime += dt

		if (tmp.aRes.apGainP > 0 && player.aRes.level >= 30) player.aRes.ap = player.aRes.ap.add(tmp.aRes.apGain.mul(dt*tmp.aRes.apGainP))
		if (tmp.aRes.oilGainP > 0 && player.aRes.level >= 100) player.aRes.oil = player.aRes.oil.add(tmp.aRes.oilGain.mul(dt*tmp.aRes.oilGainP))
		if (hasStarTree('auto',10)) ROCKET.create()
		MAIN.checkCutting(1)
	}
	if (tmp.m_prod > 0) player.rocket.momentum += ROCKET_PART.m_gain()*dt*tmp.m_prod

	if (hasUpgrade('funMachine',1)) {
		player.aRes.sfrgt = player.aRes.sfrgt.add(tmp.aRes.SFRGTgain.mul(dt))
	}

	//STEELIE
	if (inAccel()) {
		player.sTime += dt
		if (tmp.steelGainP > 0 && player.level >= 240) player.steel = player.steel.add(tmp.steelGain.mul(tmp.steelGainP*dt))
	}

	if (hasUpgrade('factory',2)) player.chargeRate = player.chargeRate.add(tmp.chargeGain.mul(dt))
	player.bestCharge = player.bestCharge.max(player.chargeRate)

	//PRESTIGE
	player.pTime += dt
	player.cTime += dt

	if (tmp.ppGainP > 0 && player.level >= 30) player.pp = player.pp.add(tmp.ppGain.mul(dt*tmp.ppGainP))
	if (tmp.crystalGainP > 0 && player.level >= 90) player.crystal = player.crystal.add(tmp.crystalGain.mul(dt*tmp.crystalGainP))

	if (inDecel()) player.chal.progress = {}
	for (var i in CHALS) {
		if (inChalCond(i) && tmp.chal.bulk[i] > (player.chal.comp[i] || 0)) player.chal.comp[i] = tmp.chal.bulk[i]
		if (player.chal.comp[i] == CHALS[i].max) delete player.chal.progress[i]
		player.chal.max[i] = Math.max(player.chal.comp[i] || 0, player.chal.max[i] || 0)
	}

	if (hasUpgrades("perk")) player.chal.c4 = false
	if (hasUpgrade("assembler", 8)) {
		player.chal.time = (player.chal.time || 0) + dt / autoChalTime()
		for (var i = 0; i < 6; i++) player.chal.comp[i] = Math.min(player.chal.comp[i] + Math.floor(player.chal.time), player.chal.max[i])
		player.chal.time -= Math.floor(player.chal.time)
	}

	//START
	tmp.spawn_time += dt
	tmp.autocutTime += dt
	if (tmp.spawn_time >= tmp.grassSpawn) {
		while (tmp.spawn_time >= tmp.grassSpawn) {
			tmp.spawn_time -= tmp.grassSpawn
			for (let i=0;i<tmp.spawnAmt;i++) createGrass()
		}
		tmp.spawn_time = 0
	}
	if (tmp.autocutTime >= tmp.autocut && tmp.grasses.length > 0 && hasUpgrade('auto',0)) {
		while (tmp.autocutTime >= tmp.autocut) {
			tmp.autocutTime -= tmp.autocut
			for (let i = 0; i < tmp.autocutAmt; i++) removeGrass(randint(0, tmp.grasses.length-1),true)
		}
		tmp.autocutTime = 0
	}
	if (inAccel()) MAIN.checkCutting(0)

	for (let x in UPGS) if (tmp.upgs[x].autoUnl && player.autoUpg[x]) buyAllUpgrades(x,true)
	player.maxPerk = Math.max(player.maxPerk, tmp.perks)
}