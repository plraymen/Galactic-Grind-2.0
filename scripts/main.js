var VERSION = 0.2;
var CREDITS = 0;
var BUY_COUNT = 1;
var UPDATE_BUILDINGS = false;
var UPDATE_UPGRADES = false;
var CURRENT_TIER = 1;
var TIER_1_COUNT = 0;
var TIER_2_COUNT = 0;
var TIER_3_COUNT = 0;
var TIER_2_UNLOCKED = false;
var TIER_3_UNLOCKED = false;
var PRODUCTION = 0;
var PRODUCTION_MULTIPLIER = 1;
var MAX_MULTIPLIER = 1;
var LAST_REDUCTION = 1;
var WORLD_TIME = 0;
var CLOCK_TICKS = 0;
var GAME_SPEED = 1;
var SHOWN_TAB = -1;
var TOOLTIP_FUNCTION = null;
var BUFFLESS = true;
var CLICK_BASE = 1;
var	CLICK_PRODUCTION = 0;
var SAVE_TIME = 0;
var	SAVE_MAX_TIME = 10;
var TIER_1_BONUS = 1;
var GLOBAL_CATEGORY = 3;
var COST_REDUCTION = 1;
var TIER_ONE_COUNT = 0;
var SLOW_TIME = 1;
var EFFECT_TIME = 1;
var CHANGE_HOTKEY = false;
var OFFLINE_PRODUCTION = 0.1;
var ASSISTANT_RATE = 1;
var AUTOCLICK_TIME = 0;
var HELPING_HANDS = false;
var MENU_CLOSE = true;
var RESET_UNLOCKED = false;
var CHALLENGES_UNLOCKED = false;
var SWITCHER = false;
var MAIN_SAVE = null;
var CHALLENGE_SAVE = false;

var KARMA_POINTS = 0;
var FUTURE_KARMA_POINTS = Math.floor(Math.pow(stats.credits_earned / 1e22, 0.4));
var SPENT_KARMA_POINTS = 0;

var UPGRADE_COLOR = "#e02900"; //#00db0a

var UNDO_BUILDING = -1;
var UNDO_COUNT = 1;
var UNDO_PRICE = 0;
var UNDO_TIME = 10;

fullscreen = false;

var upgrade_categories = [
	[0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 30, 31, 32, 33, 34, 35, 40, 41, 42, 43, 44, 45, 50, 51, 52, 53, 54, 55, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 99, 100, 101, 102, 103, 104, 105, 107, 108, 109, 110, 111, 112, 117, 118, 119, 120, 121, 122, 127, 128, 129, 130, 131, 132, 137, 138, 139, 140, 141, 142, 147, 148, 149, 150, 151, 152, 157, 158, 159, 160, 161, 162, 167, 168, 169, 170, 171, 172, 307], //Base Production Upgrades 0
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 99, 100, 101, 102, 103, 104, 105, 178, 179, 180, 181, 182, 183, 184, 192, 193, 194, 195, 196, 197, 198, 206, 307, 315, 316, 317, 318, 319, 320, 321], //Tier 1 Upgrades 1
	[107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 185, 186, 187, 188, 189, 190, 191, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 300, 301, 302, 303, 304, 305, 306, 308, 309, 310, 311, 312, 313, 314], //Tier 2 Upgrades 2
	[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 9, 126], //Click Upgrades 3
	[72, 73, 74, 75, 76, 77, 78, 79, 106, 94, 95, 96, 97, 98, 177, 199, 200, 201, 202, 203, 204, 205, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 295, 296, 297, 298, 299, 324], //Misc Upgrades 4
	[249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294] //Tier 3 Upgrades 5
];

/*
var upgrade_categories = [
	[0, 1, 2, 3, 4, 5, 99, 10, 11, 12, 13, 14, 15, 100, 30, 31, 32, 33, 34, 35, 101, 40, 41, 42, 43, 44, 45, 102, 50, 51, 52, 53, 54, 55, 103, 60, 61, 62, 63, 64, 65, 104, 66, 67, 68, 69, 70, 71, 105, 107, 108, 109, 110, 111, 112, 117, 118, 119, 120, 121, 122, 127, 128, 130, 131, 132, 137, 138, 139, 140, 141, 142, 147, 148, 149, 150, 151, 152, 157, 158, 159, 160, 161, 162, 167, 168, 169, 170, 171, 172], //Base Production Upgrades 0
	[0, 1, 2, 3, 4, 5, 99, 10, 11, 12, 13, 14, 15, 100, 30, 31, 32, 33, 34, 35, 101, 40, 41, 42, 43, 44, 45, 102, 50, 51, 52, 53, 54, 55, 103, 60, 61, 62, 63, 64, 65, 104, 66, 67, 68, 69, 70, 71, 105, 6, 7, 8, 9, 80, 87, 16, 17, 18, 19, 81, 88, 36, 37, 38, 39, 82, 89, 46, 47, 48, 49, 83, 90, 56, 57, 58, 59, 84, 91, 85, 92, 86, 93], //Tier 1 Upgrades 1
	[107, 108, 109, 110, 111, 112, 117, 118, 119, 120, 121, 122, 127, 128, 128, 130, 131, 132, 137, 138, 139, 140, 141, 142, 147, 148, 149, 150, 151, 152, 157, 158, 159, 160, 161, 162, 167, 168, 169, 170, 171, 172, 113, 114, 115, 116, 123, 124, 125, 126, 143, 144, 145, 146, 153, 154, 155, 156, 163, 164, 165, 166, 173, 174, 175, 176], //Tier 2 Upgrades 2
	[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 9, 126], //Click Upgrades 3
	[72, 73, 74, 75, 76, 77, 78, 79, 97, 98, 94, 95, 96, 106] //Misc Upgrades 4
];*/

var settings = {
	autosave_rate: 10,
	skip_tutorial: false,
	refresh_rate: 0, //0 = slow, 1 = med, 2 = fast
	effects: true,
	menu_close: true,
	disable_tips: false,
}

var click_animations = []; //x, y, value, direction

var CONST_BUILDING_UPGRADE_1 = 6;
var CONST_BUILDING_UPGRADE_2 = 40;
var CONST_BUILDING_UPGRADE_3 = 400;
var CONST_BUILDING_UPGRADE_4 = 50000;
var CONST_BUILDING_UPGRADE_5 = 1400000;
var CONST_BUILDING_UPGRADE_6 = 28000000;
var CONST_BUILDING_UPGRADE_7 = 1000000000;

var CONST_BUILDING_UPGRADE_PRICE_1 = 2500;
var CONST_BUILDING_UPGRADE_PRICE_2 = 25000;
var CONST_BUILDING_UPGRADE_PRICE_3 = 2500000;
var CONST_BUILDING_UPGRADE_PRICE_4 = 250000000;
var CONST_BUILDING_UPGRADE_PRICE_5 = 25000000000;
var CONST_BUILDING_UPGRADE_PRICE_6 = 2500000000000;
var CONST_BUILDING_UPGRADE_PRICE_7 = 150000000000000;

var lastUpdate = Date.now();
function fastTick() {
	var debug_rate = 1;
	
    var now = Date.now();
    var rt = (now - lastUpdate)/1000 * debug_rate;
	SLOW_TIME += rt / debug_rate;
	EFFECT_TIME += rt;
	
	if (SLOW_TIME >= 1) {
		SLOW_TIME = 0;
		slowTick();
	}
	
	if (EFFECT_TIME >= 5) {
		EFFECT_TIME = 0;
		effectTick();
	}
	
	for (var i = 0; i < subgames.length; i++) {
		subgames[i].update(rt);
	}
    var dt = ((now - lastUpdate)/1000) * GAME_SPEED * debug_rate;
    
	if (buffs[2].active && !buffs[2].frozen) {dt *= 1.5}
	if (buffs[28].active && !buffs[28].frozen) {dt *= 3}
	if (upgrades[283].bought) {dt *= 1.04}
	if (challenges[8].unlocked) {dt *= 1.05}
	if (minigames[19].vars.active_effects.includes(0)) {dt *= 0.01;addClockTicks(rt * 1.2)}
	if (minigames[19].vars.active_effects.includes(4)) {addClockTicks(rt * 0.1428)}
	if (karma_upgrades[9].bought) {addClockTicks(rt * 0.033333)}
	if (CURRENT_CHALLENGE == 8) {dt *= 25}
	
    updateBuildings();
    updateUpgrades();
    updateCreditsDisplay();
    updateWorld(dt);
    updateBuffs(dt);
    updateMinigames(dt);
    clockTicks(dt);
    tipTick(dt);
    updateClickAnimation(dt);
	autoclick(dt);
    calculateProduction(dt);
	saveTick(rt);
	
	for (var i = 0; i < assistants.length; i++) {
		assistants[i].update(dt);
	}
    
    //Slow Tick?
    updateTooltip();
    if ($("#popup_text").css("opacity") > 0) {$("#popup_text").css("opacity", $("#popup_text").css("opacity")-rt/3);}
    if ($("#popup_achievement").css("opacity") > 0) {$("#popup_achievement").css("opacity", $("#popup_achievement").css("opacity")-rt/3);}

    stats.time_played_real += rt;
    stats.time_played_offline += rt;
    stats.time_played += dt;
	
	UNDO_TIME -= dt;
	
	if (UNDO_TIME < 0) {
		UNDO_TIME = 10;
		UNDO_BUILDING = -1;
	}
    
    if (!challenges[7].running) {CREDITS += PRODUCTION*dt;}
    stats.credits_earned += PRODUCTION*dt;
    
    lastUpdate = now;
	
	var frames_sec
	if (settings.refresh_rate == 0) {frames_sec = 20}
	if (settings.refresh_rate == 1) {frames_sec = 30}
	if (settings.refresh_rate == 2) {frames_sec = 40}

	window.setTimeout(fastTick, 1000/frames_sec)
}
function slowTick() {
	updateBuildings();
    updateBuildingHelp();
	updateBuildingPrices();
	testUpgradeUnlocks();
	updateCreditUnlocks();
    updateGlobalDisplay();
	updateAchievements();
	automationTick();
	tierOneCount();
	updateCurrencyDisplay();
	updateSoftResetHTML();
	updateStorageBars();
	testChallengeComplete();
	
	var len = tips.length;
	for (var i = 0; i < tips.length; i++) {
		tips[i].test();
	}
	
	if (settings.menu_close) {MENU_CLOSE = true;}
}
function updateClickAnimation(dt) {
	$("#click_value_container").empty();

	for (var i = 0; i < click_animations.length; i++) {
			click_animations[i][5] -= dt * 0.5 + 0.005;
			click_animations[i][0] += click_animations[i][2] * dt;
			click_animations[i][1] += click_animations[i][3] * dt;
			
			var click_element = $("<div></div>");
			click_element.html(fancyNumber(click_animations[i][4]));
			click_element.attr('style', 'text-align:center;position:absolute;left:'+(click_animations[i][0]-60)+'px;top:'+click_animations[i][1]+'px;opacity:'+click_animations[i][5]+';');
			
			$('#click_value_container').append(click_element);
			
			if (click_animations[i][5] <= 0) {click_animations.splice(i, 1);}
	}
}
function updateWorld(dt) {
    WORLD_TIME += dt * 35;
	
	if (WORLD_TIME >= 50000) {WORLD_TIME -= 50000}
	
	$("#world_continents").attr("style", "border-radius:64px;position:absolute;height:128px;width:128px;background:url(images/world_continents.png) "+WORLD_TIME+"px 0px;transform: rotate(-10deg);transform-origin: center;");
	$("#world_atmosphere").attr("style", "border-radius:64px;position:absolute;height:128px;width:128px;background:url(images/world_atmosphere.png) "+WORLD_TIME/1.4+"px 0px;transform: rotate(-10deg);transform-origin: center;");
}
function updateCreditsDisplay() {
    $("#credits_display").html(fancyNumber(CREDITS) + " Credits<br>" + "<span style='font-size:24px;'>"+fancyNumber(PRODUCTION)+" Credits/s<span>");
    $("#small_credits_display").html("<span style='font-size:20px;'>" + shortNumber(CREDITS) + " </span><br>" + "<span style='font-size:16px;'>"+shortNumber(PRODUCTION)+" /s<span>");
}
function clockTicks(dt) {
    if (GAME_SPEED != 1) {$("#time_remaining").html(secondsToTime(Math.round(CLOCK_TICKS)));} 
    
	CLOCK_TICKS -= dt - (dt/GAME_SPEED);
	if (CLOCK_TICKS < 0) {updateGameSpeed(1); CLOCK_TICKS = 0;}
}
function updateGameSpeed(speed) {
    if (GAME_SPEED != speed) {
		GAME_SPEED = speed;
		$("#speed_display").html(speed + "x");
	}
    $("#time_remaining").html(secondsToTime(Math.round(CLOCK_TICKS)));
    
    updateClockDisplay();
}
function addClockTicks(ticks) {
    CLOCK_TICKS += ticks;
    stats.time_extra_seconds += ticks;
    updateUnlocks();
    updateGameSpeed(GAME_SPEED);
    //updateClockDisplay();
}
function increaseSpeed() {
    if (CLOCK_TICKS <= 0) {return};
    
	var bonus_speed = minigames[5].vars.research_tree[3].researched + upgrades[281].bought + challenges[8].unlocked + karma_upgrades[10].bought
	
    if (GAME_SPEED == 1) {updateGameSpeed(2)}
    else if (GAME_SPEED == 2) {updateGameSpeed(5)}
    else if (GAME_SPEED == 5 && kongBuys.increased_speed == 0) {
		if (minigames[5].vars.research_tree[3].researched || upgrades[281].bought || challenges[8].unlocked || karma_upgrades[10].bought) {
			updateGameSpeed(5 + bonus_speed);
		} else {
			updateGameSpeed(1);
		}
	} else if (kongBuys.increased_speed != 0 && GAME_SPEED != bonus_speed + 5 + kongBuys.increased_speed) {
		updateGameSpeed(5 + kongBuys.increased_speed + bonus_speed);
	}
	else if (GAME_SPEED > 5) {updateGameSpeed(1)}
}
function updateGlobalDisplay() {
	if ($("#global_container").is(":visible")) {
		var stat_string = "Credits Earned: <span style='color:#00db0a;'>" + fancyNumber(stats.credits_earned) + "</span><br>";
		stat_string += "Credits From Clicks: <span style='color:#00db0a;'>" + fancyNumber(stats.click_credits) + "</span><br>";
		var percent = "100";
		if (PRODUCTION != 0) {percent = Math.round(stats.click_value / PRODUCTION * 1000)/10}
		stat_string += "Credits Per Click: <span style='color:#00db0a;'>" + fancyNumber(stats.click_value) + "</span> (" + percent + "% of production)<br>";
		stat_string += "Total Clicks: <span style='color:#ff8300;'>" + stats.total_clicks + "</span><br>";
		stat_string += "Time Played (Real): <span style='color:#5036FF;'>" + secondsToTime(Math.floor(stats.time_played_real)) + "</span><br>" 
		stat_string += "Time Played (In game): <span style='color:#5036FF;'>" + secondsToTime(Math.floor(stats.time_played)) + "</span><br>" 
		stat_string += "Extra Time Used: <span style='color:#5036FF;'>" + secondsToTime(Math.floor(stats.time_played-stats.time_played_real)) + "</span><br>" 
		stat_string += "Total Days: <span style='color:#5036FF;'>" + Math.floor(getDaysPlayed()) + "</span><br>";
		$("#information_statistics_content").html(stat_string);
		
		var settings_string = "";
		var auto_10 = "", auto_30 = "", auto_endless = "", skip_tutorial = "", effects = "", menu = "", disable_tips = ""; 
		var refresh_slow = "", refresh_med = "", refresh_fast = "";
		
		if (settings.autosave_rate == 10) {auto_10 = "checked = 'checked'"}
		if (settings.autosave_rate == 30) {auto_30 = "checked = 'checked'"}
		if (settings.autosave_rate == 1000000000) {auto_endless = "checked = 'checked'"}		
		if (settings.refresh_rate == 0) {refresh_slow = "checked = 'checked'"}
		if (settings.refresh_rate == 1) {refresh_med = "checked = 'checked'"}
		if (settings.refresh_rate == 2) {refresh_fast = "checked = 'checked'"}
		if (settings.skip_tutorial) {skip_tutorial = "checked = 'checked'"}
		if (settings.effects) {effects = "checked = 'checked'"}
		if (settings.menu_close) {menu = "checked = 'checked'"}
		if (settings.disable_tips) {disable_tips = "checked = 'checked'"}
		
		settings_string += "<span style='font-size:14px;'><br><span onmouseover='tooltip(this, 5, 0, \"Autosave\", \"Save rate determines the number of seconds in between autosaves. Specify never to disable autosaving.\", false, false)' onmouseout='hideTooltip()' class='help_marker'>?</span> Save Rate: 10s <label class='container' onclick='changeSaveTime(event, 10)'><input id='auto_10_checkbox' type='checkbox' "+auto_10+"><span class='checkmark'></span></label>";
		settings_string += "30s <label class='container' onclick='changeSaveTime(event, 30)'><input id='auto_30_checkbox' type='checkbox' "+auto_30+"><span class='checkmark'></span></label>";
		settings_string += "Never <label class='container' onclick='changeSaveTime(event, 1000000000)'><input id='auto_endless_checkbox' type='checkbox' "+auto_endless+"><span class='checkmark'></span></label><br>";
		
		settings_string += "<span style='font-size:14px;'><br><span onmouseover='tooltip(this, 5, 0, \"Refresh Rate\", \"Refresh rate determines how fast the display updates. Slower refresh rates save battery, but may cause the game to appear jittery.<br>The refresh rate does not effect production.\", false, false)' onmouseout='hideTooltip()' class='help_marker'>?</span> Refresh: Slow <label class='container' onclick='changeRefreshRate(event, 0)'><input id='refresh_slow_checkbox' type='checkbox' "+refresh_slow+"><span class='checkmark'></span></label>";
		settings_string += "Med <label class='container' onclick='changeRefreshRate(event, 1)'><input id='refresh_med_checkbox' type='checkbox' "+refresh_med+"><span class='checkmark'></span></label>";
		settings_string += "Fast <label class='container' onclick='changeRefreshRate(event, 2)''><input id='refresh_fast_checkbox' type='checkbox' "+refresh_fast+"><span class='checkmark'></span></label>";
		
		settings_string += "<br><span style='font-size:14px;'><br><span onmouseover='tooltip(this, 5, 0, \"Tutorials\", \"Determines if tutorials will automatically pop up when new content is unlocked. This does not effect tutorials that are manually activated.\", false, false)' onmouseout='hideTooltip()' class='help_marker'>?</span> Disable Tutorials <label onclick='stopProp(event)' class='container'><input id='skip_tutorial_checkbox' onclick='changeSkipTutorial(event)' type='checkbox' "+skip_tutorial+"><span class='checkmark'></span></label>";
		
		settings_string += "<br><span style='font-size:14px;'><br><span onmouseover='tooltip(this, 5, 0, \"Disable Tips\", \"Toggle to disable all Quick Tips that appear.\", false, false)' onmouseout='hideTooltip()' class='help_marker'>?</span> Disable Tips <label onclick='stopProp(event)' class='container'><input id='disable_tutorials_checkbox' onclick='changeDisableTips(event)' type='checkbox' "+disable_tips+"><span class='checkmark'></span></label>";		
		
		settings_string += "<br><span style='font-size:14px;'><br><span onmouseover='tooltip(this, 5, 0, \"Effects\", \"Determines if visual special effects will appear, such as buildings appearances changing.\", false, false)' onmouseout='hideTooltip()' class='help_marker'>?</span> Special Effects <label onclick='stopProp(event)' class='container'><input id='effects_checkbox' onclick='changeEffects(event)' type='checkbox' "+effects+"><span class='checkmark'></span></label>";	
		
		settings_string += "<br><span style='font-size:14px;'><br><span onmouseover='tooltip(this, 5, 0, \"Menu\", \"Determines if clicking outside of some menus closes that menu.\", false, false)' onmouseout='hideTooltip()' class='help_marker'>?</span> Click Closes Menu <label onclick='stopProp(event)' class='container'><input id='menu_close_checkbox' onclick='changeMenuClose(event)' type='checkbox' "+menu+"><span class='checkmark'></span></label>";
		
		settings_string += "</span><br><br>"
		
		settings_string += "<center><button onclick='openHotkeyMenu(event);' type='button' class='basic_button'>View/Edit Hotkeys</button></center><br>"
		settings_string += "<center><button onclick='openImportExport(event);' type='button' class='basic_button'>Import/Export Save</button></center><br>"
		settings_string += "<center><button onclick='openWipeSave(event);' type='button' class='basic_button'>Wipe Save</button></center>"
		
		$("#information_settings_content").html(settings_string);
		
		var curr_string = currencyString();

		$("#information_currency_content").html(curr_string);
		
		var temp_category = GLOBAL_CATEGORY;
		
		var upgrade_string = "";
		upgrade_string += "";
		upgrade_string += "<center><br><img id='category_1' onmouseover='tooltip(this, 0, 2, \"Tier 1 Upgrades\", \"Click to display the upgrades you have bought that effect your tier 1 buildings (the first seven buildings that you unlock).\")' onmouseout='hideTooltip();'  onclick = 'changeCategory(event, 1);updateGlobalDisplay();' class='category_inactive' src='images/category_tier_1.png'>"
		if (TIER_2_UNLOCKED) {upgrade_string += "<img id='category_2' onmouseover='tooltip(this, 1, 2, \"Tier 2 Upgrades\", \"Click to display the upgrades you have bought that effect your tier 2 buildings.\")' onmouseout='hideTooltip();'  onclick = 'changeCategory(event, 2);updateGlobalDisplay();' class='category_inactive' src='images/category_tier_2.png'>"}
		if (TIER_3_UNLOCKED) {upgrade_string += "<img id='category_5' onmouseover='tooltip(this, 2, 2, \"Tier 3 Upgrades\", \"Click to display the upgrades you have bought that effect your tier 3 buildings.\")' onmouseout='hideTooltip();'  onclick = 'changeCategory(event, 5);updateGlobalDisplay();' class='category_inactive' src='images/category_tier_3.png'>"}
		upgrade_string += "<img id='category_0' onmouseover='tooltip(this, 5, 6, \"Base Building Upgrades\", \"Click to display the upgrades you have bought that effect the base production of your buildings.\")' onmouseout='hideTooltip();'  onclick = 'changeCategory(event, 0);updateGlobalDisplay();' class='category_inactive' src='images/category_base.png'>";
		upgrade_string += "<img id='category_3' onmouseover='tooltip(this, 1, 3, \"Click Upgrades\", \"Click to display the upgrades you have bought that effect the value of your clicks.\")' onmouseout='hideTooltip();'  onclick = 'changeCategory(event, 3);updateGlobalDisplay();' class='category_inactive' src='images/category_click.png'>";
		upgrade_string += "<img id='category_4' onmouseover='tooltip(this, 8, 9, \"Misc. Upgrades\", \"Click to display the upgrades you have bought not shown in the other tabs.\")' onmouseout='hideTooltip();' onclick = 'changeCategory(event, 4);updateGlobalDisplay();' class='category_inactive' src='images/category_default.png'></center>";
		upgrade_string += "<br><br>"
		
		var category = upgrade_categories[GLOBAL_CATEGORY];
		var len = category.length;
		var display_count = 0;
		for (var i = 0; i < len; i++) {
			if (upgrades[category[i]].bought) {
				display_count += 1;
				upgrade_string += stringUpgrade([category[i]]);
			}
		}
		if (display_count == 0) {
			upgrade_string += "<center>No upgrades of this category bought yet.</center>"
		}
		
		$("#information_upgrades_content").html(upgrade_string);
		
		changeCategory(null, temp_category);
		
		var popup_string = "";
		for (var i = popup_log.length - 1; i >= 0; i--) {
			popup_string += "<br>" + popup_log[i];
		}
		
		$("#information_popup_content").html(popup_string);
	}
}
function changeCategory(event, category) {
	GLOBAL_CATEGORY = category;
	
	$("#category_0").addClass("category_inactive");
	$("#category_1").addClass("category_inactive");
	$("#category_2").addClass("category_inactive");
	$("#category_3").addClass("category_inactive");
	$("#category_4").addClass("category_inactive");
	$("#category_5").addClass("category_inactive");
	
	$("#category_" + category).removeClass("category_inactive");
	
	if (event != null) {
		event.stopPropagation(); 
		event.preventDefault();
	}
}
function openGlobals(to_show) {
	if ($("#global_container").is(":visible")) {
		$("#global_container").hide();
	} else {
		$("#global_container").show();
		$("#information_currency_content").hide();
		$("#information_statistics_content").hide();
		$("#information_upgrades_content").hide();
		$(to_show).children(':nth-child(2)').show();
		updateGlobalDisplay();
		
		hideTooltip();
	}
	MENU_CLOSE = false;
}
function openHotkeyMenu(event) {
	if (event) {
		event.stopPropagation();
		event.preventDefault();
	}
	hotkeyMenu();
}
function changeSaveTime(event, time) {
	if (event) {
		event.stopPropagation();
		event.preventDefault();
	}
	settings.autosave_rate = time;
	SAVE_MAX_TIME = time;
	updateSettingsAutosave();
}
function changeRefreshRate(event, rate) {
	if (event) {
		event.stopPropagation();
		event.preventDefault();
	}
	settings.refresh_rate = rate;
	updateSettingsRefresh();
}
function stopProp(event) {
	if (event) {
		event.stopPropagation();
	}
}
function changeSkipTutorial() {
	settings.skip_tutorial = !settings.skip_tutorial;
}
function changeDisableTips() {
	settings.disable_tips = !settings.disable_tips;
}
function changeMenuClose() {
	settings.menu_close = !settings.menu_close;
}
function changeEffects() {
	settings.effects = !settings.effects;
	
	if (!settings.effects) {disableEffects()}
	else {effectTick()}
}
function updateSettingsAutosave() {
	if (settings.autosave_rate == 10) {$("#auto_10_checkbox").attr("checked","checked");} else {$("#auto_10_checkbox").removeAttr("checked");}
	if (settings.autosave_rate == 30) {$("#auto_30_checkbox").attr("checked","checked");} else {$("#auto_30_checkbox").removeAttr("checked");}
	if (settings.autosave_rate == 1000000000) {$("#auto_endless_checkbox").attr("checked","checked");} else {$("#auto_endless_checkbox").removeAttr("checked");}
}
function updateSettingsRefresh() {
	if (settings.refresh_rate == 0) {$("#refresh_slow_checkbox").attr("checked","checked");} else {$("#refresh_slow_checkbox").removeAttr("checked");}
	if (settings.refresh_rate == 1) {$("#refresh_med_checkbox").attr("checked","checked");} else {$("#refresh_med_checkbox").removeAttr("checked");}
	if (settings.refresh_rate == 2) {$("#refresh_fast_checkbox").attr("checked","checked");} else {$("#refresh_fast_checkbox").removeAttr("checked");}
}