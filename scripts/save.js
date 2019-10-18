/**
 * @fileOverview Handles saving, loading, exporting, importing, and wiping, of the save file.
 */
 
/** Saves all necessary game data.
* @param {boolean} challenge - Determines if a challenge is currently active.
*/
function save(challenge) {
	var save = generateSave();
	
	localStorage.setObject("save_file", save);
	
	SAVE_TIME = 0;
	
	if (KONG_ENABLED) {updateKongScores();}
}
/** Helper function to create and return a single object with all necessary game data.
* @return {object} - The save object.
*/
function generateSave() {
	var save = {};
	save.VERSION = VERSION;
    save.CREDITS = CREDITS;
    save.BUY_COUNT = BUY_COUNT;
    save.CURRENT_TIER = CURRENT_TIER;
    save.TIER_1_COUNT = TIER_1_COUNT;
    save.TIER_2_COUNT = TIER_2_COUNT;
    save.TIER_3_COUNT = TIER_3_COUNT;
    save.PRODUCTION = PRODUCTION;
	save.OFFLINE_PRODUCTION = OFFLINE_PRODUCTION;
    save.CLOCK_TICKS = CLOCK_TICKS;
    save.GAME_SPEED = GAME_SPEED;
    save.PRODUCTION_MULTIPLIER = PRODUCTION_MULTIPLIER;
	save.MAX_MULTIPLIER = MAX_MULTIPLIER;
    save.HELPING_HANDS = HELPING_HANDS;
	save.KARMA_POINTS = KARMA_POINTS;
	save.SPENT_KARMA_POINTS = SPENT_KARMA_POINTS;
	save.RESET_UNLOCKED = RESET_UNLOCKED;
	save.CHALLENGES_UNLOCKED = CHALLENGES_UNLOCKED;
	save.CURRENT_CHALLENGE = CURRENT_CHALLENGE;
	save.MAIN_SAVE = MAIN_SAVE;
	save.stored_bonuses = stored_bonuses;
	save.alien_target = alien_target;
	save.stored_bonuses_enabled = stored_bonuses_enabled;
	save.consumption_bonus = consumption_bonus;
	save.inertia = inertia;
	save.research_iter = research_iter;
	save.research_growth = research_growth;
	save.corrupt_bonus = corrupt_bonus;
	save.calm = calm;
	save.SWITCHER = SWITCHER;
    save.NOW = Date.now();
	save.stats = stats;
    
    save.buildings = [];
    for (var i = 0; i < buildings.length; i++) {
        var building = buildings[i];
        save.buildings[i] = [];
        save.buildings[i][0] = building.count;   
        save.buildings[i][1] = building.unlocked;
        save.buildings[i][2] = [];
        
        for (var j = 0; j < building.buffs.length; j++) {
            save.buildings[i][2][j] = [];
            save.buildings[i][2][j][0] = building.buffs[j].id;
            save.buildings[i][2][j][1] = building.buffs[j].time; 
        }
        
        var stat_keys = Object.keys(building.stats);   
        save.buildings[i][3] = [];
        for (var k = 0; k < stat_keys.length; k++) {
            save.buildings[i][3][k] = [];
            save.buildings[i][3][k][0] = stat_keys[k];
            save.buildings[i][3][k][1] = building.stats[stat_keys[k]];
        }
		
		save.buildings[i][4] = building.free_count;
		
	}
    
    save.upgrades = [];
    for (var i = 0; i < upgrades.length; i++) {
        save.upgrades[i] = [];
        save.upgrades[i][0] = upgrades[i].available;
        save.upgrades[i][1] = upgrades[i].bought;
    }
    
    save.buffs = [];
    for (var i = 0; i < buffs.length; i++) {
        save.buffs[i] = [];
        save.buffs[i][0] = buffs[i].active;
        save.buffs[i][1] = buffs[i].time;
        save.buffs[i][2] = buffs[i].max_time;
		save.buffs[i][3] = buffs[i].stack_count;
    }
	
	save.achievements = [];
    for (var i = 0; i < achievements.length; i++) {
        save.achievements[i] = [];
        save.achievements[i][0] = achievements[i].available;
        save.achievements[i][1] = achievements[i].unlocked;
    }
    
	save.minigame_vars = [];
	for (var i = 0; i < minigames.length; i++) {
		if (i == 5) {			
			save.minigame_vars[5] = [[],[]]
			
			for (var j = 0; j < minigames[5].vars.research_tree.length; j++) {
				save.minigame_vars[5][0][j] = minigames[5].vars.research_tree[j].bought;
			}
			save.minigame_vars[5][1] = minigames[5].vars.research_points;
			save.minigame_vars[5][2] = minigames[5].vars.researches_made;
			save.minigame_vars[5][3] = minigames[5].vars.research_time;
			
			continue
		}
		save.minigame_vars[i] = minigames[i].vars;
	}
    
	save.unlocks = [];
	for (var i = 0; i < unlocks.length; i++) {
		save.unlocks[i] = unlocks[i].unlocked;
	}
	
	save.subgames = [];
	for (var i = 0; i < subgames.length; i++) {
		save.subgames[i] = {};
		save.subgames[i].unlocked = subgames[i].unlocked;
		save.subgames[i].credits = subgames[i].credits;
		save.subgames[i].production = subgames[i].production;
		save.subgames[i].click_value = subgames[i].click_value;
		save.subgames[i].reset_count = subgames[i].reset_count;
		
		save.subgames[i].buildings = [];
		for (var j = 0; j < subgames[0].buildings.length; j++) {
			save.subgames[i].buildings[j] = [];
			save.subgames[i].buildings[j][0] = subgames[i].buildings[j].count;
			save.subgames[i].buildings[j][1] = subgames[i].buildings[j].unlocked;
			save.subgames[i].buildings[j][2] = subgames[i].buildings[j].available;
			save.subgames[i].buildings[j][3] = Math.ceil(subgames[i].buildings[j].cost);
		}
		
		save.subgames[i].upgrades = [];
		for (var j = 0; j < subgames[0].upgrades.length; j++) {
			save.subgames[i].upgrades[j] = [];
			save.subgames[i].upgrades[j][0] = subgames[i].upgrades[j].available;
			save.subgames[i].upgrades[j][1] = subgames[i].upgrades[j].bought;
		}
		
		var var_keys = Object.keys(subgames[0].vars);  
		save.subgames[i].vars = [];
		for (var j = 0; j < var_keys.length; j++) {
			save.subgames[i].vars[j] = [];
			save.subgames[i].vars[j][0] = var_keys[j];
			save.subgames[i].vars[j][1] = subgames[0].vars[var_keys[j]];
		}
	}
	
	save.assistants = [];
	for (var i = 0; i < assistants.length; i++) {
		save.assistants[i] = [];
		save.assistants[i][0] = assistants[i].unlocked;
		save.assistants[i][1] = assistants[i].level;
		save.assistants[i][2] = assistants[i].xp;
		save.assistants[i][3] = assistants[i].next_xp;
		save.assistants[i][4] = [];
		for (var j = 0; j < assistants[i].abilities.length; j++) {
			save.assistants[i][4][j] = assistants[i].abilities[j].cd;
		}
		save.assistants[i][5] = [];
		for (var j = 0; j < assistants[i].abilities.length; j++) {
			save.assistants[i][5][j] = assistants[i].abilities[j].automated;
		}		
		save.assistants[i][6] = [];
		for (var j = 0; j < assistants[i].abilities.length; j++) {
			save.assistants[i][6][j] = assistants[i].abilities[j].grouped;
		}
	}
	
	save.automation = [];
	for (var i = 0; i < automation.length; i++) {
		save.automation[i] = [];
		save.automation[i][0] = automation[i].autobuy;
		save.automation[i][1] = automation[i].vars;
	}
	
	save.challenges = [];
	for (var i = 0; i < challenges.length; i++) {
		save.challenges[i] = [];
		save.challenges[i][0] = challenges[i].running;
		save.challenges[i][1] = challenges[i].unlocked;
	}
	
	save.karma_upgrades = [];
	for (var i = 0; i < karma_upgrades.length; i++) {
		save.karma_upgrades[i] = karma_upgrades[i].bought;
	}
	
	save.tips = [];
	for (var i = 0; i < tips.length; i++) {
		save.tips[i] = tips[i].shown;
		if (tip_queue.includes(tips[i])) {save.tips[i] = false}
	}
	
	save.tutorial = [];
	for (var i = 0; i < tutorial_list.length; i++) {
		save.tutorial[i] = tutorial_list[0].triggered;
	}
	
	save.settings = settings;
	save.hotkeys = hotkeys;
	
	save.kongBuys = kongBuys;
	
	return save;
}
/** Loads all necessary game data from local storage. */
function load() {
    var load = localStorage.getObject('save_file');
	if (CHALLENGE_SAVE) {
		load = MAIN_SAVE;
	}
	var temp_version = VERSION;
    
    if (load) {
		var previous_version = 0;
		if (!load.VERSION) {
			VERSION = 0.1
		} else {
			previous_version = load.VERSION;
		}
		
        CREDITS = load.CREDITS;
        BUY_COUNT = 1;
        CURRENT_TIER = 1;
		OFFLINE_PRODUCTION = load.OFFLINE_PRODUCTION;
        PRODUCTION = load.PRODUCTION;
        GAME_SPEED = load.GAME_SPEED;
        PRODUCTION_MULTIPLIER = load.PRODUCTION_MULTIPLIER;
		if (load.MAX_MULTIPLIER) {MAX_MULTIPLIER = load.MAX_MULTIPLIER;}
		if (load.HELPING_HANDS) {HELPING_HANDS = load.HELPING_HANDS;}
		if (load.KARMA_POINTS) {KARMA_POINTS = load.KARMA_POINTS;}
		if (load.SPENT_KARMA_POINTS) {SPENT_KARMA_POINTS = load.SPENT_KARMA_POINTS;}
		if (load.RESET_UNLOCKED) {RESET_UNLOCKED = load.RESET_UNLOCKED;}
		if (load.CHALLENGES_UNLOCKED) {CHALLENGES_UNLOCKED = load.CHALLENGES_UNLOCKED;}
		if (load.CURRENT_CHALLENGE != -1) {CURRENT_CHALLENGE = load.CURRENT_CHALLENGE;}
		if (load.MAIN_SAVE != undefined) {
			MAIN_SAVE = load.MAIN_SAVE;
		}
		if (load.stored_bonuses) {stored_bonuses = load.stored_bonuses;}
		if (load.alien_target) {alien_target = load.alien_target;}
		if (load.stats) {stats = load.stats;}
		if (load.stored_bonuses_enabled) {stored_bonuses_enabled = load.stored_bonuses_enabled}
		if (load.consumption_bonus) {consumption_bonus = load.consumption_bonus}
		if (load.inertia) {inertia = load.inertia}
		if (load.research_iter) {research_iter = load.research_iter;}
		if (load.research_growth) {research_growth = load.research_growth;}
		if (load.corrupt_bonus) {corrupt_bonus = load.corrupt_bonus;}
		if (load.calm) {calm = load.calm;}
		if (load.SWITCHER) {SWITCHER = load.SWITCHER;}
		
        if (load.buildings) {
            for (var i = 0; i < load.buildings.length; i++) {
                buildings[i].count = load.buildings[i][0];   
                buildings[i].available = load.buildings[i][1];
                if (load.buildings[i][4]) {buildings[i].free_count = load.buildings[i][4]}
				
                var temp_buffs = load.buildings[i][2];
                for (var j = 0; j < temp_buffs.length; j++) {
                    buildings[i].addBuff(building_buffs[load.buildings[i][2][j][0]])
                    buildings[i].buffs[j].time = load.buildings[i][2][j][1];
                }
                var temp_stats = load.buildings[i][3];
                for (var k = 0; k < temp_stats.length; k++) {
                    buildings[i].stats[temp_stats[k][0]] = temp_stats[k][1];   
                }
                
                if (buildings[i].count >= 1) {
                    buildings[i].createHTML();   
                    buildings[i].updateHTML();   
                }
				
				if (buildings[i].count != 0) {
					buildings[i].unlocked = true;
				}
            }
			
			for (var i = 0; i < 7; i++) {
				if (buildings[i].available) {
					TIER_1_COUNT += 1;
				}
			}
			for (var i = 7; i < 14; i++) {
				if (buildings[i].available) {
					TIER_2_COUNT += 1;
				}
			}			
			for (var i = 14; i < 21; i++) {
				if (buildings[i].available) {
					TIER_3_COUNT += 1;
				}
			}
			testTierTwo();
			testTierThree();
        }
        
        if (load.upgrades) {
            for (var i = 0; i < load.upgrades.length; i++) {
                upgrades[i].available = load.upgrades[i][0];
                upgrades[i].bought = load.upgrades[i][1];
            }
            updateUpgrades();
        }
		
		if (load.achievements) {
            for (var i = 0; i < load.achievements.length; i++) {
                achievements[i].available = load.achievements[i][0];
                achievements[i].unlocked = load.achievements[i][1];
            }
            updateAchievements();
        }
        
        if (load.buffs) {
             for (var i = 0; i < load.buffs.length; i++) {
                buffs[i].active = load.buffs[i][0];
                buffs[i].time = load.buffs[i][1];
                buffs[i].max_time = load.buffs[i][2];
                buffs[i].stack_count = load.buffs[i][3];
				
				if (buffs[i].time >= 1) {
					buffs[i].createHTML();
				}
            }   
        }
		
		if (load.minigame_vars) {
			for (var i = 0; i < load.minigame_vars.length; i++) {
				if (i == 5) {
					for (var j = 0; j < load.minigame_vars[5][0].length; j++) {
						minigames[5].vars.research_tree[j].bought = load.minigame_vars[5][0][j];
						
						if (minigames[5].vars.research_tree[j].bought != 0 ) {
							minigames[5].vars.research_tree[j].researched = true;
						}
					}
					
					minigames[5].vars.research_points = load.minigame_vars[5][1];
					minigames[5].vars.researches_made = load.minigame_vars[5][2];
					minigames[5].vars.research_time = load.minigame_vars[5][3];
					
					continue
				}
				
				
				minigames[i].vars = load.minigame_vars[i];
			}
		}
		
		if (load.unlocks) {
			for (var i = 0; i < load.unlocks.length; i++) {
				unlocks[i].unlocked = load.unlocks[i];
			}	
		}
		
		if (load.settings) {
			settings = load.settings;
			
			changeSaveTime(null, settings.autosave_rate);
		}
		
		if (load.subgames) {
			for (var i = 0; i < load.subgames.length; i++) {
				subgames[i].unlocked = load.subgames[i].unlocked;
				subgames[i].credits = load.subgames[i].credits;
				subgames[i].production = load.subgames[i].production;
				subgames[i].click_value = load.subgames[i].click_value;
				subgames[i].reset_count = load.subgames[i].reset_count;
				
				for (var j = 0; j < load.subgames[i].buildings.length; j++) {
					subgames[i].buildings[j].count = load.subgames[i].buildings[j][0];
					subgames[i].buildings[j].unlocked = load.subgames[i].buildings[j][1];
					subgames[i].buildings[j].available = load.subgames[i].buildings[j][2];
					subgames[i].buildings[j].cost = load.subgames[i].buildings[j][3];
				}				
				
				for (var j = 0; j < load.subgames[i].upgrades.length; j++) {
					subgames[i].upgrades[j].available = load.subgames[i].upgrades[j][0];
					subgames[i].upgrades[j].bought = load.subgames[i].upgrades[j][1];
				}
				
				for (var j = 0; j < load.subgames[i].vars.length; j++) {
					subgames[i].vars[load.subgames[i].vars[j][0]] = load.subgames[i].vars[j][1];
				}
			}
		}
		
		if (load.assistants) {
			for (var i = 0; i < load.assistants.length; i++) {
				assistants[i].unlocked = load.assistants[i][0];
				assistants[i].level = load.assistants[i][1];
				assistants[i].xp = load.assistants[i][2];
				assistants[i].next_xp = load.assistants[i][3];
				for (var j = 0; j < load.assistants[i][4].length; j++) {
					assistants[i].abilities[j].cd = load.assistants[i][4][j];
				}
				if (load.assistants[i][5]) {
					for (var j = 0; j < load.assistants[i][5].length; j++) {
						assistants[i].abilities[j].automated = load.assistants[i][5][j];
					}
				}				
				if (load.assistants[i][6]) {
					for (var j = 0; j < load.assistants[i][6].length; j++) {
						assistants[i].abilities[j].grouped = load.assistants[i][6][j];
					}
				}
			}
		}
		
		if (load.hotkeys) {
			hotkeys = load.hotkeys;
		}
		
		if (load.automation) {
			for (var i = 0; i < load.automation.length; i++) {
				automation[i].autobuy = load.automation[i][0];
				automation[i].vars = load.automation[i][1];
			}
		}
		
		if (load.challenges) {
			for (var i = 0; i < load.challenges.length; i++) {
				challenges[i].running = load.challenges[i][0];
				challenges[i].unlocked = load.challenges[i][1];
			}
		}
		
		if (load.karma_upgrades) {
			for (var i = 0; i < load.karma_upgrades.length; i++) {
				karma_upgrades[i].bought = load.karma_upgrades[i];
			}
		}
		
		if (load.tips) {
			for (var i = 0; i < load.tips.length; i++) {
				tips[i].shown = load.tips[i];
			}
		}
		
		if (load.tutorial) {
			for (var i = 0; i < load.tutorial.length; i++) {
				tutorial_list[i].triggered = load.tutorial[i];
			}
		}
		
		if (load.kongBuys) {kongBuys = load.kongBuys;}
		
		addClockTicks(load.CLOCK_TICKS);             
		updateClockDisplay();
		$("#speed_display").html(GAME_SPEED + "x");
		$("#time_remaining").html(secondsToTime(Math.round(CLOCK_TICKS)));
		
		//
		// Add Version Update Patches
		//
		if (CURRENT_CHALLENGE == undefined) {CURRENT_CHALLENGE = -1;}
		
		if (settings.menu_close == undefined) {settings.menu_close = true}
		if (settings.disable_tips == undefined) {settings.disable_tips = false}
		if (settings.scientific_notation == undefined) {settings.scientific_notation = false}
		if (automation[4].vars.auto_gold_to_cash == undefined) {automation[4].vars.auto_gold_to_cash = false}
		if (automation[4].vars.auto_cash_to_gold == undefined) {automation[4].vars.auto_cash_to_gold = false}
		if (automation[8].vars.auto_path == undefined) {automation[8].vars.auto_path = false}
		if (automation[13].vars.target_flux == undefined) {automation[13].vars.target_flux = -1}
		if (automation[14].vars.auto_clone == undefined) {automation[14].vars.auto_clone = false}
		if (automation[14].vars.last_clone == undefined) {automation[14].vars.last_clone = 0}
		if (automation[7].vars.disabled == undefined) {automation[14].vars.disabled = false}
		if (minigames[8].vars.autoclick == undefined) {minigames[8].vars.autoclick = false}
		if (minigames[16].vars.package_bonus == -1) {minigames[16].vars.package_bonus = 0;}
		if (!hotkeys.activateChallenge) {hotkeys.activateChallenge = 'c'}
		if (!hotkeys.miniMenu) {hotkeys.miniMenu = 'Control'}
		
		// Rest the bonus minigame's variables but keep the total number of bonuses produced
		if (previous_version < 0.299) {
			minigames[7].vars = {
				total_bonuses: 0,
				bonus_time: 120,
				bonus_max_time: 120,
				package_bonus: 1,
				max_packages: 3,
				bonuses_stored: [], // 0 = 15% production bonus, 1 = 10 seconds worth of production, 2 = 30% bonus to clicking, 4 = +1% production permanently
			}
			minigames[7].vars.total_bonuses = load.minigame_vars[7].total_bonuses;
			
			upgrades[113].bought = false;
			upgrades[114].bought = false;
			upgrades[115].bought = false;
			upgrades[116].bought = false;	
		}
		// Reset the fluctuation lab
		if (previous_version < 0.399) {
			minigames[13].vars = {
				flux_time: 60,
				flux_multiplier: 1,
				flux_points: 30,
				max_flux_points: 30,
				negative_time: 120,
				max_negative_time: 120,
				total_fluxes: 0,
			}
			minigames[13].vars.total_fluxes = load.minigame_vars[13].total_fluxes;
			
			upgrades[173].bought = false;
			upgrades[174].bought = false;
			upgrades[175].bought = false;
			upgrades[176].bought = false;	
		}
		// Reset the cryogenic lab
		if (previous_version < 0.499) {
			minigames[9].vars = {
				target_buffs: [],
				maximum_buffs: 1,
				frozen_time: 0,
			}
			if (load.minigame_vars[9].target_buff != null) {
				minigames[9].vars.target_buffs.push(load.minigame_vars[9].target_buff);
			}
			
			upgrades[133].bought = false;
			upgrades[134].bought = false;
			upgrades[135].bought = false;
			upgrades[136].bought = false;	
		}

		if (load.NOW) {offlineProduction((Date.now() - load.NOW) / 1000, previous_version);setTimeout(updateClockDisplay, 1000)}
    }
	
	UPDATE_UPGRADES = true;
	$("#tier_cost_display").html(fancyNumber(tierPrice(CURRENT_TIER)));
	
	changeTier(CURRENT_TIER);
	
	/*if (minigames[9].vars.target_buff != null) {
		var temp = minigames[9].vars.target_buff;
		minigames[9].vars.target_buff = null;
		buffs[temp].toggleFreeze();
	}*/
	
	//console.log(minigames[9].vars.target_buffs.length);
	for (var i = 0; i < minigames[9].vars.target_buffs.length; i++) {
		buffs[minigames[9].vars.target_buffs[i]].toggleFreeze();
	}

}
/** Updates autosave time.
* @param {float} rt - Exact time since last frame.
*/
function saveTick(rt) {
	SAVE_TIME += rt;
	
	if (SAVE_TIME >= SAVE_MAX_TIME) {
		SAVE_TIME = 0;
		save();
	}

	$("#save_element").css('height', SAVE_TIME/SAVE_MAX_TIME*36 + "px")
	
}
/** Exports the save file to a text format for the user. */
function exportSave() {
	if (localStorage.getItem('save_file')) {
		$("#export_textarea").val(btoa(JSON.stringify(localStorage.getItem('save_file')).replace(/\\/g,'').slice(1, -1)));
		document.getElementById("export_textarea").focus();
		document.getElementById("export_textarea").setSelectionRange(0, 30000);
		$("#save_help").html("Copy this save, and import it when you wish to load this save");
	} else {
		$("#save_help").html("The game is currently not save, most likely you have auto-saving disabled");	
	}
}
/** Imports a save file. */
function importSave() {
	localStorage.setItem('save_file', atob($("#export_textarea").val()));
	
	for (var i = 0; i < buffs.length; i++) {
        buffs[i].removeHTML();
    }
	
	buildings = [];
	buffs = [];
	upgrades = [];
	unlocks = [];
	minigames = [];
	subgames = [];
	tutorial_list = [];
	achievements = [];
	assistants = [];
	automation = [];
	popup_log = [];
	challenges = [];
	tutorial_running = false;
	current_tutorial = null;
	CHANGE_HOTKEY = false;
	PRODUCTION = 0;
	KARMA_POINTS = 0;
	SPENT_KARMA_POINTS = 0;
	MAX_MULTIPLIER = 1;
	CLOCK_TICKS = 0;
	CURRENT_CHALLENGE = -1;
	//CLOCK_TICKS = 0;
	//KARMA_POINTS = 0;
	//RESET_UNLOCKED = false;
	tip_queue = [];
	pips = [];
	tips = [];
	queue_timer = 0;
	
	stored_bonuses = [];
	stored_bonuses_enabled = true;
	angelic_release = false;
	angelic_protection = false;
	demonic_vengeance = 0;
	vengeance_bonus = 0;
	alien_target = -1;
	consumption_bonus = 0;
	inertia = 0;
	research_growth = 1;
	research_iter = 0;
	corrupt_bonus = 1;
	calm = false;
	
	TIER_1_COUNT = 0;
	TIER_2_COUNT = 0;
	TIER_3_COUNT = 0;
	
	TIER_2_UNLOCKED = false;
	TIER_3_UNLOCKED = false;
	
	TIER_ONE_COUNT = 0;
	
	stats = {
		time_played_offline : 0,
		time_played : 0,
		time_played_real : 0,
		time_extra_seconds : 0,
		total_clicks : 0,
		click_value : 0,
		click_credits : 0,
		credits_earned : 0,
		credits_earned : 0,
	}
	
	init();
	
	changeTier(2);
	changeTier(1);

	$("#soft_reset_background").remove();
	$("#soft_reset_confirmation").remove();
}
/** Wipes all save data.
 * @param {boolean} soft - determines if the wipe is being called from a soft reset.
 */
function wipeSave(soft) {
	localStorage.removeItem('save_file');
	
	for (var i = 0; i < buffs.length; i++) {
        buffs[i].removeHTML();
    }
	
	CREDITS = 0;
	PRODUCTION = 0;
	OFFLINE_PRODUCTION = 0;
	CLOCK_TICKS = 0;
	SAVE_TIME = 0;
	UNDO_BUILDING = -1;
	COST_REDUCTION = 1;
	GAME_SPEED = 1;
	WORLD_TIME = 0;
	SHOWN_TAB = -1;
	MAX_MULTIPLIER = 1;
	KARMA_POINTS = 0;
	SPENT_KARMA_POINTS = 0;
	TIER_2_UNLOCKED = false;
	TIER_3_UNLOCKED = false;
	RESET_UNLOCKED = false;
	CHALLENGES_UNLOCKED = false;
	CURRENT_CHALLENGE = -1;
	SWITCHER = false;
	
	tutorial_list = [];
	popup_log = [];
	tutorial_running = false;
	current_tutorial = null;
	buildings = [];
	buffs = [];
	upgrades = [];
	unlocks = [];
	minigames = [];
	subgames = [];
	achievements = [];
	assistants = [];
	automation = [];
	challenges = [];
	tips = [];
	tip_queue = [];
	
	stored_bonuses = [];
	stored_bonuses_enabled = true;
	angelic_release = false;
	angelic_protection = false;
	demonic_vengeance = 0;
	vengeance_bonus = 0;
	alien_target = -1;
	consumption_bonus = 0;
	inertia = 0;
	research_growth = 1;
	corrupt_bonus = 1;
	research_iter = 0;
	calm = false;
	
	pips = [];
	queue_timer = 0;
	
	TIER_1_COUNT = 0;
	TIER_2_COUNT = 0;
	TIER_3_COUNT = 0;
	
	TIER_ONE_COUNT = 0;
	
	stats = {
		time_played_offline : 0,
		time_played : 0,
		time_played_real : 0,
		time_extra_seconds : 0,
		total_clicks : 0,
		click_value : 0,
		click_credits : 0,
		credits_earned : 0,
		credits_earned : 0,
	}
	
	init(soft);
	
	changeTier(2);
	changeTier(1);
	changeBuyCount(1);
	
	$("#tooltip").hide();
	$("#save_popup").hide();
	$("#wipe_popup").hide();
	$("#click_farm_clicker").hide();
	$("#detail_container").hide();
	$("#global_container").hide();
	$("#fullscreen_research").hide();
	$("#close_fullscreen").hide();
	$("#buff_container").hide();
	
	$("#subgame_background").remove();
	$("#subgame_reset_background").remove();
	$(".building_tab").remove();
	$("#soft_reset_background").remove();
	$("#soft_reset_confirmation").remove();
}

//Helper storage functions
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}