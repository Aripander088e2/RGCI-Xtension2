function calc(dt) {
    let decel = player.decel

    tmp.spawn_time += dt
    tmp.autocutTime += dt
    player.time += dt
    player.pTime += dt
    player.cTime += dt
    player.sTime += dt
    player.aRes.aTime += dt
    player.aRes.lTime += dt

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

    player.maxPerk = Math.max(player.maxPerk, tmp.perks)

    for (let x in UPGS) if (tmp.upgs[x].autoUnl && !(['grass','pp','crystal'].includes(x) && decel) && !(['aGrass'].includes(x) && !decel)) if (player.autoUpg[x]) buyMaxUpgrades(x,true)

    if (tmp.ppGainP > 0 && player.level >= 30 && !decel) player.pp = player.pp.add(tmp.ppGain.mul(dt*tmp.ppGainP))
    if (tmp.crystalGainP > 0 && player.level >= 100 && !decel) player.crystal = player.crystal.add(tmp.crystalGain.mul(dt*tmp.crystalGainP))

    if (tmp.apGainP > 0 && player.aRes.level >= 30) player.aRes.ap = player.aRes.ap.add(tmp.apGain.mul(dt*tmp.apGainP))
    if (tmp.oilGainP > 0 && player.aRes.level >= 100) player.aRes.oil = player.aRes.oil.add(tmp.oilGain.mul(dt*tmp.oilGainP))

    if (hasUpgrade('factory',2)) player.chargeRate = player.chargeRate.add(tmp.chargeGain.mul(dt))

    player.bestGrass = player.bestGrass.max(player.grass)
    player.bestPP = player.bestPP.max(player.pp)
    player.bestCrystal = player.bestCrystal.max(player.crystal)
    player.bestCharge = player.bestCharge.max(player.chargeRate)

    player.aRes.bestGrass = player.aRes.bestGrass.max(player.aRes.grass)
    player.aRes.bestAP = player.aRes.bestAP.max(player.aRes.ap)
    player.aRes.bestOil = player.aRes.bestOil.max(player.aRes.oil)

	if (hasUpgrades("perk")) player.chal.c4 = false
    if (hasUpgrade("assembler", 8)) {
		player.chal.time = (player.chal.time || 0) + dt / upgEffect("assembler", 8)
		for (var i = 0; i < 6; i++) player.chal.comp[i] = Math.min(player.chal.comp[i] + Math.floor(player.chal.time), player.chal.max[i])
		player.chal.time -= Math.floor(player.chal.time)
	}
	for (var i in CHALS) {
		if (inChalCond(i) && tmp.chal.bulk[i] > (player.chal.comp[i] || 0)) player.chal.comp[i] = tmp.chal.bulk[i]
		player.chal.max[i] = Math.max(player.chal.comp[i] || 0, player.chal.max[i] || 0)
	}

	if (galUnlocked()) galTick(dt)

    MAIN.checkCutting()
}