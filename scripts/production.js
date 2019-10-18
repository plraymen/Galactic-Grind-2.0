/**
 * @fileOverview Handles the calculates for production per second and production per click.
 */
 
/** Sets the global variable PRODUCTION to its proper value.
* @param {float} dt - Time since last frame.
*/
function calculateProduction(dt) {
    var temp_production = 0;
	COST_REDUCTION = 1;
    PRODUCTION_MULTIPLIER = 1;
	OFFLINE_PRODUCTION = 0.1;
	CLICK_BASE = 1;
	TIER_1_BONUS = 1;
	CLICK_PRODUCTION = 0;
	ASSISTANT_RATE = 1;
	BUFFLESS = true;
    
	
	var max_building_production = 0;
    for (var i = 0; i < 14; i++) {
		var building = buildings[i];
		building.production = building.base_production;
        building.production_multiplier = 1;
		
		if (minigames[14].vars.clone_targets.includes(i)) {building.production_multiplier *= 2}
		if (minigames[15].vars.epiphany_target == i) {building.production_multiplier *= 3}
		
		if (minigames[3].vars.powered_buildings.includes(i) && !upgrades[47].bought) {building.production_multiplier *= 1.5}
		else if (minigames[3].vars.powered_buildings.includes(i)) {building.production_multiplier *= 1.6}
		
		if (i < 7 && karma_upgrades[30].bought) {
			building.production_multiplier *= 1.2;
		}
		
		if (alien_target == i) {building.production_multiplier *= 1.25}
		
		if (upgrades[76].bought) {building.production += 25}
		if (upgrades[77].bought) {building.production += 500}
		if (upgrades[78].bought) {building.production += 5500}
		if (upgrades[79].bought) {building.production += 120000}
		if (upgrades[97].bought) {building.production += 12000000}
		if (upgrades[98].bought) {building.production += 120000000}
		
		if (building.production > max_building_production) {
			max_building_production = building.production;
		}
	}	
	
	len = minigames[10].vars.powered_buildings.length;
	for (var i = 0; i < len; i++) {
		buildings[minigames[10].vars.powered_buildings[i]].production_multiplier *= 1.75;
	}

    len = buffs.length;
    for (var i = 0; i < len; i++) {
        var buff = buffs[i];
        if (buff.time > 0 && !buff.frozen) {
            buff.effect();
			BUFFLESS = false;
        }
    }
	
	var research = minigames[5].vars.research_tree;
	len = research.length;

	for (var i = 0; i < len; i++) {
		if (research[i].researched) {
			research[i].effect();
		}
	}

	var research_tree = minigames[5].vars.research_tree;
	if (research_tree[2].researched) {
		addClockTicks(dt / 60 * research_tree[2].bought);
	}
    len = upgrades.length;
    for (var i = 0; i < len; i++) {
        var upgrade = upgrades[i];
        if (upgrade.bought) {upgrade.effect();}
    }
	
	len = karma_upgrades.length;
	for (var i = 0; i < len; i++) {
		var upgrade = karma_upgrades[i];
		if (upgrade.bought) {upgrade.effect()}
	}
	
	var max_count = 0;
    for (var i = 0; i < 14; i++) {
		var building = buildings[i];
		if (building.production > max_building_production) {
			max_building_production = building.production;
		}
		if (building.count > max_count) {
			max_count = building.count;
		}
	}
	
	if (upgrades[307].bought) {
		for (i = 0; i < 7; i++) {
			buildings[i].production += max_building_production * 0.0066;
		}
	}
	
	var len = buildings.length;
	for (var i = 14; i < len; i++) {
		var building = buildings[i];
		building.production = max_building_production * tweaker.general.tier_3_base_multiplier * (1 + max_count * tweaker.general.tier_3_max_building_multiplier);
	}
	
    //Misc Effects
	if (assistants[2].level >= assistant_levels[3]) {ASSISTANT_RATE *= 1.5;}
	if (assistants[4].level >= assistant_levels[2]) {COST_REDUCTION *= 1.15;}
	if (assistants[5].level >= assistant_levels[2]) {COST_REDUCTION *= 1.15;}
	if (assistants[4].level >= assistant_levels[4]) {PRODUCTION_MULTIPLIER *= 1.25;}
	if (assistants[6].level >= assistant_levels[4]) {PRODUCTION_MULTIPLIER *= 1.15;}
	if (assistants[6].level >= assistant_levels[2]) {PRODUCTION_MULTIPLIER *= 1.15;}
	if (calm) {PRODUCTION_MULTIPLIER *= 1.25;}
	if (BUFFLESS && assistants[4].unlocked) {PRODUCTION_MULTIPLIER *= 1 + (0.01 * assistants[4].level)}
	
	if (kongBuys.galactic_expansion) {PRODUCTION_MULTIPLIER *= 1.5}
	if (kongBuys.galactic_expansion) {OFFLINE_PRODUCTION += 0.05}
	
	if (minigames[19].vars.active_effects.includes(5)) {
		ASSISTANT_RATE *= 2;
	}
	
	if (assistants[6].unlocked) {ASSISTANT_RATE *= 1 + (assistants[6].level * 0.01)}
	
	if (buffs[18].active && !buffs[18].frozen) {
		AUTOCLICK_TIME += dt * 8;
	}
	
    if (assistants[1].unlocked) {PRODUCTION_MULTIPLIER *= 1 + (assistants[1].level * 0.001)};
	
    PRODUCTION_MULTIPLIER *= 1 - (minigames[0].vars.soot_counters/100);
	if (minigames[0].vars.soot_counters >= 99) {minigames[0].vars.soot_counters = 99;}
    PRODUCTION_MULTIPLIER *= 1 + (minigames[0].vars.purity_counters/100 * 3);
	PRODUCTION_MULTIPLIER *= minigames[2].vars.card_bonus;
	PRODUCTION_MULTIPLIER *= minigames[7].vars.package_bonus;
	PRODUCTION_MULTIPLIER *= minigames[13].vars.flux_multiplier;
	
	PRODUCTION_MULTIPLIER *= research_growth;
	PRODUCTION_MULTIPLIER *= corrupt_bonus;
	
	var future_karma = 0;
	
	if (karma_upgrades[23].bought) {future_karma += 0.2}
	if (karma_upgrades[24].bought) {future_karma += 0.2}
	if (karma_upgrades[25].bought) {future_karma += 0.2}
	if (karma_upgrades[26].bought) {future_karma += 0.2}
	if (karma_upgrades[27].bought) {future_karma += 0.2}
	
	PRODUCTION_MULTIPLIER *= 1 + ((KARMA_POINTS + (future_karma * (FUTURE_KARMA_POINTS - KARMA_POINTS))) * 0.01);
	
	//Challenge Effects
	if (challenges[0].unlocked) {PRODUCTION_MULTIPLIER *= 1 + (Math.abs(minigames[0].vars.blood) * 0.0005);}
	if (challenges[1].unlocked) {PRODUCTION_MULTIPLIER *= 1.1}
	if (challenges[2].unlocked) {PRODUCTION_MULTIPLIER *= 1 + minigames[2].vars.draw_charges * 0.01}
	if (challenges[3].unlocked) {PRODUCTION_MULTIPLIER *= 1.1}
	if (challenges[4].unlocked) {PRODUCTION_MULTIPLIER *= 1.1}
	if (challenges[5].unlocked) {PRODUCTION_MULTIPLIER *= 1.1}
	if (challenges[6].unlocked) {PRODUCTION_MULTIPLIER *= 1.15}
	if (challenges[7].unlocked) {CLICK_PRODUCTION += 0.015}
	
	//Running Challenge Effects
	if (CURRENT_CHALLENGE == 1) {PRODUCTION_MULTIPLIER *= 1 + minigames[1].vars.gold * 0.01}
	if (CURRENT_CHALLENGE == 3) {PRODUCTION_MULTIPLIER *= 1.25}
	if (CURRENT_CHALLENGE == 6) {buildings[6].production_multiplier *= Math.pow(1.03, buildings[6].count)}
	if (CURRENT_CHALLENGE == 8) {PRODUCTION_MULTIPLIER *= 0.04}
	
    buildings[0].production += minigames[0].vars.karma_counters * (15 + (15 + (minigames[0].vars.karma_counters-1)*2))/2;
    buildings[4].production_multiplier *= 1 + (minigames[4].vars.charity_counters * 0.01)

	if (subgames[0].reset_count >= 1) {PRODUCTION_MULTIPLIER *= 1.04 + (subgames[0].reset_count - 1) * 0.01}
	if (subgames[0].reset_count >= 2) {CLICK_PRODUCTION += 0.01 + (subgames[0].reset_count - 2) * 0.002}
	if (subgames[0].reset_count >= 3) {COST_REDUCTION *= 1.05 + (subgames[0].reset_count - 3) * 0.01}
	
	if (minigames[12].vars.accel_target == 0) {COST_REDUCTION *= 1 + minigames[12].vars.accel_bonus;}
	if (minigames[12].vars.accel_target == 2) {PRODUCTION_MULTIPLIER *= 1 + minigames[12].vars.accel_bonus;}
	
	if (minigames[19].vars.active_effects.includes(1)) {PRODUCTION_MULTIPLIER *= 1.15}
	
	if (upgrades[184].bought) {OFFLINE_PRODUCTION += 0.01}
	if (upgrades[187].bought) {OFFLINE_PRODUCTION += 0.005}
	if (upgrades[185].bought) {OFFLINE_PRODUCTION += 0.005}
	if (upgrades[189].bought) {OFFLINE_PRODUCTION += 0.005}
	if (upgrades[190].bought) {OFFLINE_PRODUCTION += 0.005}
	if (upgrades[191].bought) {OFFLINE_PRODUCTION += 0.005}
	
	if (karma_upgrades[21]) {OFFLINE_PRODUCTION += 0.01}
	if (karma_upgrades[22]) {OFFLINE_PRODUCTION += 0.01}
    
    len = buildings.length;
    for (var i = 0; i < len; i++) {
		var building = buildings[i];
		if (i < 7) {building.production_multiplier *= TIER_1_BONUS}
		// Factory Production
		if (i == 18) {
				minigames[18].vars.max_production = Math.max(minigames[18].vars.max_production, building.production * building.production_multiplier * PRODUCTION_MULTIPLIER);
				buildings[18].stats["Credits Produced"] += minigames[18].vars.max_production * building.count * dt;
				continue;
		}
		temp_production += building.production * building.count * building.production_multiplier;
        building.stats["Credits Produced"] += building.production * building.count * building.production_multiplier * PRODUCTION_MULTIPLIER * dt;
		
	}
	
	if (PRODUCTION_MULTIPLIER > MAX_MULTIPLIER) {MAX_MULTIPLIER = PRODUCTION_MULTIPLIER}
	if (buffs[29].active && !buffs[29].frozen) {PRODUCTION_MULTIPLIER = MAX_MULTIPLIER}
    
    PRODUCTION = temp_production * PRODUCTION_MULTIPLIER;
	PRODUCTION += minigames[18].vars.max_production * buildings[18].count;
	
	if (buffs[25].active && !buffs[25].frozen) {
		PRODUCTION = 0;
	}	
	
	if (buffs[22].active && !buffs[22].frozen) {
		PRODUCTION = inertia;
	}
	
	if (LAST_REDUCTION != COST_REDUCTION) {UPDATE_BUILDINGS = true;}
	
	LAST_REDUCTION = COST_REDUCTION;
	FUTURE_KARMA_POINTS = Math.floor(Math.pow(stats.credits_earned / 1e22, 0.4));
}
/** Handles the player clicking on the world icon. */
function handleClick() {
	stats.total_clicks += 1;
	var research_bonus = 1;
	var accel_multiplier = 1;
	var angel_multiplier = 1;
	var temporal_multiplier = 1;
	if (assistants[0].unlocked) {
		angel_multiplier += 0.01 * assistants[0].level;
	}
	if (minigames[5].vars.research_tree[23].researched) {
		for (var i = 0; i < buffs.length; i++) {
			if (buffs[i].active) {
				research_bonus += 0.25;
			}
		}
	}
	if (minigames[12].vars.accel_target == 1) {
		minigames[12].vars.accel_bonus = Math.min(minigames[12].vars.accel_bonus + 0.001 , 0.15);
		minigames[12].vars.accel_time = 30;
		accel_multiplier = 1 + minigames[12].vars.accel_bonus;
		
		if (minigames[12].vars.accel_bonus == 0.15) {
			upgrades[164].makeAvailable();
			if (upgrades[163].available && upgrades[164].available && upgrades[165].available) {
				upgrades[166].makeAvailable();
			}
		}
	}
	
	if (minigames[5].vars.research_tree[26].researched) {
		minigames[5].vars.research_time -= 0.1
	}
	
	if (upgrades[23].bought) {
		CLICK_BASE += (10 + (0.01 * stats.total_clicks)) * stats.total_clicks; 
	}
	
	if (minigames[19].vars.active_effects.includes(2)) {temporal_multiplier += (GAME_SPEED - 1) * 0.1}
	
	click_value = (CLICK_BASE + CLICK_PRODUCTION * PRODUCTION) * research_bonus * accel_multiplier * angel_multiplier * temporal_multiplier;
	
	if (buffs[11].active && !buffs[11].frozen) {click_value *= 2}
	if (buffs[12].active && !buffs[12].frozen) {click_value *= 0.5}
	if (buffs[33].active && !buffs[33].frozen) {click_value *= 1.3}
	if (buffs[35].active && !buffs[35].frozen) {click_value *= 1.75}
	
	if (challenges[7].running) {click_value = PRODUCTION}
	
    CREDITS += click_value;
    stats.credits_earned += click_value;
	stats.click_credits += click_value;
	stats.click_value = click_value
	
	click_animations.push([-20,0, Math.round(Math.random() * (40 - (-40)) + (-40)), Math.round(Math.random() * 30) + 10, click_value,1]);
	
	if (click_animations.length >= 20) {click_animations.shift()}
}
/** Handles autoclicks, called every tick.
* @param {float} dt - Time since last frame.
*/
function autoclick(dt) {
	var autoclick_multiplier = 0;
	if (assistants[0].unlocked) {autoclick_multiplier += (0.25 + Math.floor(assistants[0].level/10) * 0.25) * dt}
	if (buffs[31].active && !buffs[31].frozen) {autoclick_multiplier += 2 * dt}
	if (challenges[7].unlocked) {autoclick_multiplier += 0.5 * dt}
	autoclick_multiplier += dt * kongBuys.autoclickers;
	
	AUTOCLICK_TIME += autoclick_multiplier;
	
	if (AUTOCLICK_TIME >= 1) {
		AUTOCLICK_TIME -= 1;
		handleClick();
	}
	
	if (AUTOCLICK_TIME >= 2) {
		AUTOCLICK_TIME -= 2;
		handleClick();
		handleClick();
	}
	
	if (AUTOCLICK_TIME >= 3) {
		AUTOCLICK_TIME -= 3;
		handleClick();
		handleClick();
		handleClick();
	}
}
/** Calculates offline production.
* @param {float} time - Time time since the user last played.
*/
function offlineProduction(time, previous_version) {
	if (assistants[1].level >= assistant_levels[1]) {
		for (var i = 0; i < assistants.length; i++) {
			for (var j = 0; j < assistants[i].abilities.length; j++) {
				var ability = assistants[i].abilities[j];
				if (!ability.passive && !(ability.cd == ability.base_cd)) {
					ability.cd -= time;
				}
			}
		}
	}
	var time_reduction = (1 / (1 + 0.05 + 0.05 * Math.floor(assistants[1].level / 10)));
	
	var offline_blood = Math.min(minigames[0].vars.blood + (time / (60 * time_reduction)), minigames[0].vars.max_blood) - minigames[0].vars.blood;
	var offline_draws = Math.min(Math.floor(minigames[2].vars.draw_charges + (time / (1800 * time_reduction))), minigames[2].vars.draw_charges_max) - minigames[2].vars.draw_charges;
	var offline_discards = Math.min(Math.floor(minigames[2].vars.discard_charges + (time / (3600 * time_reduction))), minigames[2].vars.discard_charges_max) - minigames[2].vars.discard_charges;
	var offline_power = Math.min(minigames[3].vars.power + (time / (60 * time_reduction)), minigames[3].vars.max_power) - minigames[3].vars.power;
	var offline_investment = time >= (3600 * time_reduction);
	var offline_gold = Math.floor(time / (3600 * time_reduction));
	var offline_research = Math.floor(time / (3600 * time_reduction));
	var offline_warps = Math.min(Math.floor(minigames[7].vars.warp_charges + (time / (3600 * time_reduction))), minigames[7].vars.warp_max_charges) - minigames[7].vars.warp_charges;
	var offline_clicks = Math.min(Math.floor(minigames[8].vars.stored_clicks + (time / (300 * time_reduction))), minigames[8].vars.max_clicks) - minigames[8].vars.stored_clicks;
	var offline_alien = Math.min(minigames[10].vars.alien_power + (time / (60 * time_reduction)), minigames[10].vars.max_power) - minigames[10].vars.alien_power;
	
	stats.time_played_offline += time;

	var offline_credits = PRODUCTION * time * OFFLINE_PRODUCTION;
	var offline_clock_ticks = time * 0.032;
	
	$("#offline_intro").html("During your " + secondsToTime(Math.floor(time)) + " spent offline, you received: ");
	
	var offline_contents_string = "";
	offline_contents_string += fancyNumber(offline_credits) + " Credits <span style='color:#f6ff53;'>(" + Math.floor(OFFLINE_PRODUCTION * 1000)/10 + "%)</span><br>";
	offline_contents_string += secondsToTime(Math.floor(offline_clock_ticks)) + " Worth of Extra Time<br>";
	if (upgrades[178].bought) {offline_contents_string += "<span style='color:#ff1e2d;'>" + Math.floor(offline_blood) + " Blood</span> ";}
	if (upgrades[179].bought) {offline_contents_string += "<span style='color:#5EC1FF;'>" + Math.floor(offline_draws) + " Draws / " + Math.floor(offline_discards) + " Discards</span> ";}
	if (upgrades[180].bought) {offline_contents_string += "<span style='color:#fddc24;'>" + Math.floor(offline_power) + " Power</span> ";}
	if (upgrades[181].bought && offline_investment) {offline_contents_string += "<span style='color:#DDDDDD;'> Return on Investment</span> ";}
	if (upgrades[182].bought) {offline_contents_string += "<span style='color:#f6ff53;'>" + offline_gold + " Gold Bars</span> ";}
	if (upgrades[183].bought) {offline_contents_string += "<span style='color:#5036FF;'>" + offline_research + " Research Points</span><br>";}
	//if (upgrades[185].bought) {offline_contents_string += "<span style='color:#87E2F5;'>" + offline_warps + " Warps</span> ";}
	if (upgrades[186].bought) {offline_contents_string += "<span style='color:#87E2F5;'>" + offline_clicks + " Clicks</span> ";}
	if (upgrades[188].bought) {offline_contents_string += "<span style='color:#CC79E8;'>" + Math.floor(offline_alien) + " Alien Research</span> ";}
	
	if (previous_version && previous_version < 0.499) {
		offline_contents_string += "<br>Note: Major changes were made to cryogenic labs, bonus factories, and fluctuation labs, you can see more details in the changelog.";
	}
	
	$("#offline_contents").html(offline_contents_string);
	
	CREDITS += offline_credits;
	CLOCK_TICKS += offline_clock_ticks;
	
	$("#offline_popup").show();
	
	if (upgrades[178].bought) { 
		minigames[0].vars.blood += offline_blood
		if (minigames[0].vars.blood > minigames[0].vars.max_blood) {minigames[0].vars.blood = minigames[0].vars.max_blood;}
	}
	if (upgrades[179].bought) {
		minigames[2].vars.draw_charges += Math.floor(offline_draws);
		minigames[2].vars.discard_charges += Math.floor(offline_discards);
		if (minigames[2].vars.draw_charges > minigames[2].vars.draw_charges_max) {minigames[2].vars.draw_charges = minigames[2].vars.draw_charges_max;}
		if (minigames[2].vars.discard_charges > minigames[2].vars.discard_charges_max) {minigames[2].vars.discard_charges = minigames[2].vars.discard_charges_max;}
	}
	if (upgrades[180].bought) { 
		minigames[3].vars.power += offline_power;
		minigames[3].vars.power_generated += offline_power;
		if (minigames[3].vars.power >= minigames[3].vars.max_power) {minigames[3].vars.power = minigames[3].vars.max_power}
	}
	if (upgrades[181].bought && offline_investment) { 
		minigames[4].vars.investment_time = 0.1;
	}
	if (upgrades[182].bought) { 
		minigames[1].vars.gold += offline_gold; 
		minigames[1].vars.gold_mined += offline_gold;
	}
	if (upgrades[183].bought) { 
		minigames[5].vars.research_points += offline_research;
	}
	//if (upgrades[185].bought) 
	//{ 
	//	minigames[7].vars.warp_charges += offline_warps;
	//	if (minigames[7].vars.warp_charges > minigames[7].vars.warp_max_charges);
	//}
	if (upgrades[186].bought) { 
		minigames[8].vars.stored_clicks += offline_clicks
		if (minigames[8].vars.stored_clicks >= minigames[8].vars.max_clicks) {minigames[8].vars.stored_clicks = minigames[8].vars.max_clicks}
	}
	if (upgrades[188].bought) { 
		minigames[10].vars.alien_power += offline_alien;
		if (minigames[10].vars.alien_power > minigames[10].vars.max_power) {minigames[10].vars.alien_power = minigames[10].vars.max_power}
	}
	
	if (getDaysPlayed() > 1 && buildings[0].count >= 1) {upgrades[178].makeAvailable()}
	if (getDaysPlayed() > 1 && buildings[2].count >= 1) {upgrades[179].makeAvailable()}
	if (getDaysPlayed() > 2 && buildings[3].count >= 1) {upgrades[180].makeAvailable()}
	if (getDaysPlayed() > 2 && buildings[4].count >= 1) {upgrades[181].makeAvailable()}
	if (getDaysPlayed() > 3 && buildings[1].count >= 1) {upgrades[182].makeAvailable()}
	if (getDaysPlayed() > 3 && buildings[5].count >= 1) {upgrades[183].makeAvailable()}
	if (getDaysPlayed() > 4 && buildings[6].count >= 1) {upgrades[184].makeAvailable()}
	if (getDaysPlayed() > 5 && buildings[7].count >= 1) {upgrades[185].makeAvailable()}
	if (getDaysPlayed() > 5 && buildings[8].count >= 1) {upgrades[186].makeAvailable()}
	if (getDaysPlayed() > 5 && buildings[9].count >= 1) {upgrades[187].makeAvailable()}
	if (getDaysPlayed() > 5 && buildings[10].count >= 1) {upgrades[188].makeAvailable()}
	if (getDaysPlayed() > 5 && buildings[11].count >= 1) {upgrades[189].makeAvailable()}
	if (getDaysPlayed() > 5 && buildings[12].count >= 1) {upgrades[190].makeAvailable()}
	if (getDaysPlayed() > 5 && buildings[13].count >= 1) {upgrades[191].makeAvailable()}
	
	updateGameSpeed(1);
}