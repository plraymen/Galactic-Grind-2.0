/**
 * @fileOverview Handles the creation and tracking of achievements.
 */

//Global achievement array
var achievements = [];

/** Represents an achievement goal for the user.
 * @constructor
 * @param {string} name - The name of the achievement.
 * @param {int} x - The x position on the achievement tile map for this achievement's icon.
 * @param {int} y - The y position on the achievement tile map for this achievement's icon.
 * @param {string} tooltip - The description to be displayed on this achievement's tooltip.
 * @param {int} tooltip_x - The x position on the upgrade tile map for this achievement's tooltip icon.
 * @param {int} tooltip_y - The y position on the upgrade tile map for this achievement's tooltip icon.
 * @param {string} previous_achievement - The name of the achievement require be this achievement can be unlocked.
 * @param {function} testUnlock - A function that returns a boolean to test if the achievement can be unlocked.
 * @param {int} upgrade - An optional upgrade that will be unlocked when this achievement is unlocked.
 */
function Achievement(name, x, y, tooltip, tooltip_x, tooltip_y, previous_achievement, testUnlock, upgrade) {
	this.name = name;
	this.x = x * 48;
	this.y = y * 48;
	this.tooltip = tooltip;
	this.tooltip_x = tooltip_x;
	this.tooltip_y = tooltip_y;
	this.previous_achievement = null;
	this.upgrade = upgrade || null;
	
	
	for (var i = 0; i < achievements.length; i++) {
		if (achievements[i].name == previous_achievement) {
			this.previous_achievement = i; 
		}
	}
	
	this.unlocked = false;
	this.available = false;
	
	this.testUnlock = testUnlock;
	
	/** Empty placeholder function. */
	this.unlock = function () {
		
	};
	/** Sets this achievement to be viewable and unlockable to the user. */
	this.makeAvailable = function () {
		this.available = true;
	};
	/** Generates and appends the HTML for this achievement's icon. */
	this.createHTML = function () {
		var achievement = $(document.createElement("div"));
		
		var x = this.x;
		var y = this.y;
		var opac = 1;
		var tooltip = "";
		var title = this.name;
		
		if (!this.unlocked && !this.available) {
			x = 0;
			y = 0;
			opac = 0.25;
			tooltip = "????????";
			title = "???";
		} else if (!this.unlocked) {
			opac = 0.5;
			tooltip = this.tooltip;
		} else {
			tooltip = this.tooltip + "<br><br>Completed"
		}
		
		achievement.attr("style", "float:left;height:48px;width:48px;background:url(images/achievement_sheet.png) -"+x+"px -"+y+"px;opacity:" + opac);
		//upgrade.attr("onmouseover","updateUpgradeColor("+this.price+", CREDITS);tooltip(this, -"+this.x/48+", -"+this.y/48+", '"+this.display_name+"', '"+expanded_description+"')");
		achievement.attr("onmouseover", "tooltip(this, "+this.tooltip_x+", "+this.tooltip_y+", '"+title+"', '"+tooltip+"', false, true)");
		achievement.attr("onmouseleave", "hideTooltip()");

		return achievement;
	};
}

/** Instantiates all achievements. */
function initAchievements() {
	var humble_beginnings = new Achievement(
        "Humble Beginnings",
        1,
		0,
        "Reach 1000 credits.",
        7,
        6,
		"",
        function () {return CREDITS >= 1000;}
	);
	achievements.push(humble_beginnings);
	humble_beginnings.makeAvailable();
	
	var millionaire = new Achievement(
        "Millionaire",
        2,
		0,
        "Reach one million credits.",
        7,
        6,
		"Humble Beginnings",
		function () {return CREDITS >= 1000000;}
	);
	achievements.push(millionaire);	
	
	var billionaire = new Achievement(
        "Billionaire",
        3,
		0,
        "Reach one billion credits.",
        7,
        6,
		"Millionaire",
		function () {return CREDITS >= 1000000000;}
	);
	achievements.push(billionaire);	
	
	var trillionaire = new Achievement(
        "Trillionaire",
        4,
		0,
        "Reach one trillion credits.",
        7,
        6,
		"Billionaire",
		function () {return CREDITS >= 1000000000000;}
	);
	achievements.push(trillionaire);	
	
	var quadrillionaire = new Achievement(
        "Quadrillionaire",
        5,
		0,
        "Reach one quadrillion credits.",
        7,
        6,
		"Trillionaire",
		function () {return CREDITS >= 1000000000000000;}
	);
	achievements.push(quadrillionaire);	
	
	var quintillionaire = new Achievement(
        "Quintillionaire",
        6,
		0,
        "Reach one quintillion credits.",
        7,
        6,
		"Quadrillionaire",
		function () {return CREDITS >= 1000000000000000000;}
	);
	achievements.push(quintillionaire);	
	
	var sextillionaire = new Achievement(
        "Sextillionaire",
        7,
		0,
        "Reach one sextillion credits.",
        7,
        6,
		"Quintillionaire",
		function () {return CREDITS >= 1000000000000000000000;}
	);
	achievements.push(sextillionaire);	
	
	var septillionaire = new Achievement(
        "Septillionaire",
        8,
		0,
        "Reach one septillion credits.",
        7,
        6,
		"Sextillionaire",
		function () {return CREDITS >= 1000000000000000000000000;}
	);
	achievements.push(septillionaire);	
	
	var octillionaire = new Achievement(
        "Octillionaire",
        9,
		0,
        "Reach one octillion credits.",
        7,
        6,
		"Septillionaire",
		function () {return CREDITS >= 1000000000000000000000000000;}
	);
	achievements.push(octillionaire);	
	
	var nonillionaire = new Achievement(
        "Nonillionaire",
        0,
		1,
        "Reach one nonillion credits.",
        7,
        6,
		"Octillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000;}
	);
	achievements.push(nonillionaire);	
	
	var decillionaire = new Achievement(
        "Decillionaire",
        1,
		1,
        "Reach one decillion credits.",
        7,
        6,
		"Nonillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000000;}
	);
	achievements.push(decillionaire);	
	
	var undecillionaire = new Achievement(
        "Undecillionaire",
        2,
		1,
        "Reach one undecillion credits.",
        7,
        6,
		"Decillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000000000;}
	);
	achievements.push(undecillionaire);	
	
	var duodecillionaire = new Achievement(
        "Duodecillionaire",
        3,
		1,
        "Reach one duodecillion credits.",
        7,
        6,
		"Undecillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000000000000;}
	);
	achievements.push(duodecillionaire);	
	
	var tredecillionaire = new Achievement(
        "Tredecillionaire",
        4,
		1,
        "Reach one tredecillion credits.",
        7,
        6,
		"Duodecillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000000000000000;}
	);
	achievements.push(tredecillionaire);	
	
	var quaddecillionaire = new Achievement(
        "Quaddecillionaire",
        5,
		1,
        "Reach one quaddecillion credits.",
        7,
        6,
		"Tredecillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000000000000000000;}
	);
	achievements.push(quaddecillionaire);	
	
	var quindecillionaire = new Achievement(
        "Quindecillionaire",
        6,
		1,
        "Reach one Quindecillion credits.",
        7,
        6,
		"Quaddecillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000000000000000000000;}
	);
	achievements.push(quindecillionaire);	
	
	var sexdecillionaire = new Achievement(
        "Sexdecillionaire",
        7,
		1,
        "Reach one Sexdecillion credits.",
        7,
        6,
		"Quindecillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000000000000000000000000;}
	);
	achievements.push(sexdecillionaire);	
	
	var septendecillionaire = new Achievement(
        "Septendecillionaire",
        8,
		1,
        "Reach one Septendecillion credits.",
        7,
        6,
		"Sexdecillionaire",
		function () {return CREDITS >= 1000000000000000000000000000000000000000000000000000000;}
	);
	achievements.push(septendecillionaire);	
	
	var fledgling_cult = new Achievement(
        "Fledgling Cult",
        9,
		1,
        "Own 50 cultists.",
        5,
        1,
		"Humble Beginnings",
		function () {return buildings[0].count >= 50;}
	);
	achievements.push(fledgling_cult);		
	
	var enough_blood = new Achievement(
        "Not Enough Blood",
        9,
		1,
        "Activate 500 rituals.",
        5,
        1,
		"Fledgling Cult",
		function () {return minigames[0].vars.rituals_performed >= 500;}
	);
	achievements.push(enough_blood);		
	
	var cult_mastery = new Achievement(
        "Cult Mastery",
        9,
		3,
        "Have blood rush be active for at least 5 minutes (300 seconds).",
        5,
        1,
		"Not Enough Blood",
		function () {return buffs[0].time >= 300;},
		192,
	);
	achievements.push(cult_mastery);	
	
	var fledgling_mine = new Achievement(
        "Fledgling Mine",
        0,
		2,
        "Own 50 mines.",
        2,
        2,
		"Humble Beginnings",
		function () {return buildings[1].count >= 50;}
	);
	achievements.push(fledgling_mine);		
	
	var enough_gold = new Achievement(
        "Not Enough Gold",
        0,
		2,
        "Have 500 gold bars stored at one time.",
        2,
        2,
		"Fledgling Mine",
		function () {return minigames[1].vars.gold >= 500;}
	);
	achievements.push(enough_gold);		
	
	var mine_mastery = new Achievement(
        "Mine Mastery",
        0,
		4,
        "Activate the same refill 10 times in a row.",
        2,
        2,
		"Not Enough Gold",
		function () {return minigames[1].vars.stored_ids.count(minigames[1].vars.stored_ids[0]) == 9;},
		193
	);
	achievements.push(mine_mastery);	
	
	var fledgling_casino = new Achievement(
        "Fledgling Casino",
        1,
		2,
        "Own 50 gamblers.",
        7,
        4,
		"Humble Beginnings",
		function () {return buildings[2].count >= 50;}
	);
	achievements.push(fledgling_casino);		
	
	var enough_gambling = new Achievement(
        "Not Enough Gambling",
        1,
		2,
        "Have 1000 or more cards drawn.",
        7,
        4,
		"Fledgling Casino",
		function () {return minigames[2].vars.cards_drawn >= 1000;}
	);
	achievements.push(enough_gambling);		
	
	var gambling_mastery = new Achievement(
        "Gambling Mastery",
        1,
		4,
        "Reach 10% production bonus from gamblers.",
        7,
        4,
		"Not Enough Gambling",
		function () {return minigames[2].vars.card_bonus >= 1.10;},
		194, 
	);
	achievements.push(gambling_mastery);	
	
	var fledgling_power = new Achievement(
        "Fledgling Power",
        2,
		2,
        "Own 50 power plants.",
        5,
        5,
		"Humble Beginnings",
		function () {return buildings[3].count >= 50;}
	);
	achievements.push(fledgling_power);		
	
	var enough_power = new Achievement(
        "Not Enough Power",
        2,
		2,
        "Generate at least 50000 power.",
        5,
        5,
		"Fledgling Power",
		function () {return minigames[3].vars.power_generated >= 50000;}
	);
	achievements.push(enough_power);	
	
	var enough_power = new Achievement(
        "Electric Mastery",
        2,
		4,
        "Have all buildings able to be powered be powered.",
        5,
        5,
		"Not Enough Power",
		function () {return minigames[3].vars.powered_buildings.length == 6;},
		195
	);
	achievements.push(enough_power);	
	
	var fledgling_bank = new Achievement(
        "Fledgling Bank",
        3,
		2,
        "Own 50 banks.",
        5,
        6,
		"Humble Beginnings",
		function () {return buildings[4].count >= 50;}
	);
	achievements.push(fledgling_bank);		
	
	var enough_money = new Achievement(
        "Not Enough Money",
        3,
		2,
        "Invest 100 or more times.",
        5,
        6,
		"Fledgling Bank",
		function () {return minigames[4].vars.investments_made >= 100;}
	);
	achievements.push(enough_money);		
	
	var long_term_financing = new Achievement(
        "Long Term Financing",
        3,
		4,
        "Complete an investment with at least 5 positive effects active at once.",
        5,
        6,
		"Not Enough Money",
		function () {return minigames[4].vars.mastery == true;},
		196
	);
	achievements.push(long_term_financing);	
	
	var fledgling_research = new Achievement(
        "Fledgling Research",
        4,
		2,
        "Own 50 research centers.",
        1,
        7,
		"Humble Beginnings",
		function () {return buildings[5].count >= 50;}
	);
	achievements.push(fledgling_research);	
	
	var enough_research = new Achievement(
        "Not Enough Research",
        4,
		2,
        "Store at least 700 research points.",
        1,
        7,
		"Fledgling Research",
		function () {return minigames[5].vars.research_points >= 700;}
	);
	achievements.push(enough_research);	
	
	var research_mastery = new Achievement(
        "Research Mastery",
        4,
		4,
        "Have every research researched at least once.",
        1,
        7,
		"Not Enough Research",
		function () {return minigames[5].vars.mastery == true;},
		197
	);
	achievements.push(research_mastery);
	
	var fledgling_factory = new Achievement(
        "Fledgling Factory",
        5,
		2,
        "Own 50 factories.",
        5,
        8,
		"Humble Beginnings",
		function () {return buildings[6].count >= 50;}
	);
	achievements.push(fledgling_factory);		
	
	var enough_production = new Achievement(
        "Not Enough Production",
        5,
		2,
        "Boost the production of a factory to at least 10 times its default production.",
        5,
        8,
		"Fledgling Factory",
		function () {return buildings[6].production_multiplier * PRODUCTION_MULTIPLIER >= 10;}
	);
	achievements.push(enough_production);	
	
	var production_mastery = new Achievement(
        "Factory Mastery",
        5,
		4,
        "Boost the production of a factory to at least 20 times its default production.",
        5,
        8,
		"Fledgling Factory",
		function () {return buildings[6].production_multiplier * PRODUCTION_MULTIPLIER >= 20;},
		198
	);
	achievements.push(production_mastery);	
	
	var fledgling_warp = new Achievement(
        "Fledgling Bonuses",
        6,
		2,
        "Own 50 bonus factories.",
        1,
        12,
		"Quadrillionaire",
		function () {return buildings[7].count >= 50;}
	);
	achievements.push(fledgling_warp);	
	
	var fledgling_click = new Achievement(
        "Fledgling Clicking",
        7,
		2,
        "Own 50 click farms.",
        9,
        13,
		"Quadrillionaire",
		function () {return buildings[8].count >= 50;}
	);
	achievements.push(fledgling_click);	
	
	var fledgling_cryo = new Achievement(
        "Fledgling Cryogenics",
        8,
		2,
        "Own 50 click cryogenic labs.",
        2,
        14,
		"Quadrillionaire",
		function () {return buildings[9].count >= 50;}
	);
	achievements.push(fledgling_cryo);	
	
	var fledgling_alien = new Achievement(
        "Fledgling Extraterrestrials",
        9,
		2,
        "Own 50 alien research labs.",
        3,
        15,
		"Quadrillionaire",
		function () {return buildings[10].count >= 50;}
	);
	achievements.push(fledgling_alien);	
	
	var fledgling_computer = new Achievement(
        "Fledgling Computers",
        0,
		3,
        "Own 50 mainframe computers.",
        1,
        16,
		"Quadrillionaire",
		function () {return buildings[11].count >= 50;}
	);
	achievements.push(fledgling_computer);	
	
	var fledgling_accel = new Achievement(
        "Fledgling Acceleration",
        1,
		3,
        "Own 50 acceleration labs.",
        0,
        17,
		"Quadrillionaire",
		function () {return buildings[12].count >= 50;}
	);
	achievements.push(fledgling_accel);	
	
	var fledgling_flux = new Achievement(
        "Fledgling Fluctuations",
        2	,
		3,
        "Own 50 fluctuation labs.",
        3,
        18,
		"Quadrillionaire",
		function () {return buildings[13].count >= 50;}
	);
	achievements.push(fledgling_flux);		
	
	var fledgling_clone = new Achievement(
        "Fledgling Cloning",
        2	,
		5,
        "Own 10 cloning labs.",
        0,
        24,
		"Octillionaire",
		function () {return buildings[14].count >= 10;}
	);
	achievements.push(fledgling_clone);			
	
	var fledgling_epiphany = new Achievement(
        "Fledgling Epiphanies",
        3,
		5,
        "Own 10 epiphany centers.",
        0,
        25,
		"Octillionaire",
		function () {return buildings[15].count >= 10;}
	);
	achievements.push(fledgling_epiphany);		
	
	var fledgling_merchant = new Achievement(
        "Fledgling Merchants",
        4,
		5,
        "Own 10 merchants.",
        0,
        26,
		"Octillionaire",
		function () {return buildings[16].count >= 10;}
	);
	achievements.push(fledgling_merchant);			
	
	var fledgling_warp = new Achievement(
        "Fledgling Warp Facilities",
        5,
		5,
        "Own 10 warp facilities.",
        0,
        27,
		"Octillionaire",
		function () {return buildings[17].count >= 10;}
	);
	achievements.push(fledgling_warp);				
	
	var fledgling_stellar = new Achievement(
        "Fledgling Stellar Factories",
        6,
		5,
        "Own 10 stellar factories.",
        0,
        28,
		"Octillionaire",
		function () {return buildings[18].count >= 10;}
	);
	achievements.push(fledgling_stellar);					
	
	var fledgling_temporal = new Achievement(
        "Fledgling Temporal Research",
        7,
		5,
        "Own 10 temporal research labs.",
        0,
        29,
		"Octillionaire",
		function () {return buildings[19].count >= 10;}
	);
	achievements.push(fledgling_temporal);						
	
	var fledgling_political = new Achievement(
        "Fledgling Oppression",
        8,
		5,
        "Own 10 temporal research labs.",
        0,
        30,
		"Octillionaire",
		function () {return buildings[20].count >= 10;}
	);
	achievements.push(fledgling_political);	
	
	var itchy_finger = new Achievement(
        "Itchy Fingers",
        3	,
		3,
        "Click 1000 times.",
        0,
        3,
		"Humble Beginnings",
		function () {return stats.total_clicks >= 1000;}
	);
	achievements.push(itchy_finger);	
	
	var clicking_apprentice = new Achievement(
        "Clicking Apprentice",
        4	,
		3,
        "Click 10,000 times.",
        0,
        3,
		"Itchy Fingers",
		function () {return stats.total_clicks >= 10000;}
	);
	achievements.push(clicking_apprentice);	
	
	var clicking_master = new Achievement(
        "Clicking Master",
        5	,
		3,
        "Click 100,000 times.",
        0,
        3,
		"Clicking Apprentice",
		function () {return stats.total_clicks >= 100000;}
	);
	achievements.push(clicking_master);	
	
	var clicking_insanity = new Achievement(
        "Clicking Insanity",
        6	,
		3,
        "Click one million times.",
        0,
        3,
		"Clicking Master",
		function () {return stats.total_clicks >= 1000000;}
	);
	achievements.push(clicking_insanity);	
	
	var corrupt_reincarnation = new Achievement(
        "Corrupt Reincarnation",
        7	,
		3,
        "Reset once in the corruption subgame.",
        0,
        19,
		"Sextillionaire",
		function () {return subgames[0].reset_count >= 1;}
	);
	achievements.push(corrupt_reincarnation);	
	
	var corrupt_master = new Achievement(
        "Corrupt Master",
        8	,
		3,
        "Reset 10 times in the corruption subgame.",
        0,
        19,
		"Corrupt Reincarnation",
		function () {return subgames[0].reset_count >= 10;}
	);
	achievements.push(corrupt_master);	
	
	var karma_1 = new Achievement(
        "Fated",
        6	,
		4,
        "Have a more than 100 Karma Points",
        5,
        20,
		"Septillionaire",
		function () {return KARMA_POINTS >= 100;}
	);
	achievements.push(karma_1);	
	
	var karma_2 = new Achievement(
        "Fated II",
        7	,
		4,
        "Have a more than 10000 Karma Points",
        5,
        20,
		"Fated",
		function () {return KARMA_POINTS >= 10000;}
	);
	achievements.push(karma_2);	
	
	var karma_3 = new Achievement(
        "Fated III",
        8,
		4,
        "Have a more than 1 Million Karma Points",
        5,
        20,
		"Fated II",
		function () {return KARMA_POINTS >= 1000000;}
	);
	achievements.push(karma_3);	
	
	var karma_4 = new Achievement(
        "Fated IV",
        9,
		4,
        "Have a more than 100 Million Karma Points",
        5,
        20,
		"Fated III",
		function () {return KARMA_POINTS >= 100000000;}
	);
	achievements.push(karma_4);	
	
	var karma_5 = new Achievement(
        "Fated V",
        0,
		5,
        "Have a more than 10 Billion Karma Points",
        5,
        20,
		"Fated IV",
		function () {return KARMA_POINTS >= 10000000000;}
	);
	achievements.push(karma_5);
	
	var karma_6 = new Achievement(
        "Fated VI",
        1,
		5,
        "Have a more than 1 Trillion Karma Points",
        5,
        20,
		"Fated V",
		function () {return KARMA_POINTS >= 1000000000000;}
	);
	achievements.push(karma_6);
	
	var angelic_achieve = new Achievement(
        "Angelic Effort",
        9,
		5,
        "Have the angelic assistant reach level 25",
        2,
        20,
		"Trillionaire",
		function () {return assistants[0].level >= 25;}
	);
	achievements.push(angelic_achieve);
	
	var angelic_achieve_ii = new Achievement(
        "Angelic Achievement",
        0,
		6,
        "Have the angelic assistant reach level 50",
        2,
        20,
		"Angelic Effort",
		function () {return assistants[0].level >= 50;}
	);
	achievements.push(angelic_achieve_ii);
	
	var research_achieve = new Achievement(
        "Effort of Research",
        3,
		6,
        "Have the research assistant reach level 25",
        0,
        7,
		"Quintillionaire",
		function () {return assistants[3].level >= 25;}
	);
	achievements.push(research_achieve);
	
	var research_achieve_ii = new Achievement(
        "Achievement of Research",
        4,
		6,
        "Have the research assistant reach level 50",
        0,
        7,
		"Effort of Research",
		function () {return assistants[3].level >= 50;}
	);
	achievements.push(research_achieve_ii);
	
	var demonic_achieve = new Achievement(
        "Demonic Effort",
        1,
		6,
        "Have the demonic assistant reach level 25",
        3,
        20,
		"Septillionaire",
		function () {return assistants[1].level >= 25;}
	);
	achievements.push(demonic_achieve);
	
	var demonic_achieve_ii = new Achievement(
        "Demonic Achievement",
        2,
		6,
        "Have the demonic assistant reach level 50",
        3,
        20,
		"Demonic Effort",
		function () {return assistants[1].level >= 50;}
	);
	achievements.push(demonic_achieve_ii);

	var alien_achieve = new Achievement(
        "Alien Effort",
        5,
		6,
        "Have the alien assistant reach level 25",
        4,
        20,
		"Quintillionaire",
		function () {return assistants[2].level >= 25;}
	);
	achievements.push(alien_achieve);
	
	var alien_achieve_ii = new Achievement(
        "Alien Achievement",
        6,
		6,
        "Have the alien assistant reach level 50",
        4,
        20,
		"Demonic Effort",
		function () {return assistants[2].level >= 50;}
	);
	achievements.push(alien_achieve_ii);
	
	var karma_achieve = new Achievement(
        "Karmatic Effort",
        7,
		6,
        "Have the zen assistant reach level 25",
        5,
        20,
		"Fated",
		function () {return assistants[4].level >= 25;}
	);
	achievements.push(karma_achieve);
	
	var karma_achieve_ii = new Achievement(
        "Karmatic Effort II",
        8,
		6,
        "Have the zen assistant reach level 50",
        5,
        20,
		"Karmatic Effort",
		function () {return assistants[4].level >= 50;}
	);
	achievements.push(karma_achieve_ii);	
	
	var idle_achieve = new Achievement(
        "Idle Effort",
        9,
		6,
        "Have the automation assistant reach level 25",
        8,
        30,
		"Nonillionaire",
		function () {return assistants[6].level >= 25;}
	);
	achievements.push(idle_achieve);
	
	var idle_achieve_ii = new Achievement(
        "Idle Effort II",
        0,
		7,
        "Have the automation assistant reach level 50",
        8,
        30,
		"Idle Effort",
		function () {return assistants[6].level >= 50;}
	);
	achievements.push(idle_achieve_ii);
	
	var corrupt_achieve = new Achievement(
        "Corrupted Effort",
        1,
		7,
        "Have the corrupt assistant reach level 25",
        9,
        29,
		"Sextillionaire",
		function () {return assistants[5].level >= 25;}
	);
	achievements.push(corrupt_achieve);
	
	var corrupt_achieve_ii = new Achievement(
        "Corrupted Effort II",
        2,
		7,
        "Have the corrupt assistant reach level 50",
        9,
        29,
		"Corrupted Effort",
		function () {return assistants[5].level >= 50;}
	);
	achievements.push(corrupt_achieve_ii);

}
/** Opens the menu that displays all achievements. */
function openAchievements() {
	if (!$("#achievement_container").length) {
		var achievement_background = $(document.createElement("div"));
		achievement_background.attr("id", "achievement_container");
		achievement_background.css("padding", "5px");
		achievement_background.attr("onclick", "MENU_CLOSE = false;")
		
			var close_button = $(document.createElement("img"));
			close_button.attr("src", "images/button_x.png").attr("height", "48").attr("width", "48");
			close_button.attr("onclick", "$('#achievement_container').remove()");
			close_button.attr("style", "position:absolute;right:0px;top:2px;cursor:pointer");
			close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
			close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
			
			var title = $(document.createElement("div"));
			title.attr("class", "detail_title");
			title.html("Achievements");
		
		achievement_background.append(title);
		achievement_background.append($(document.createElement("div")));
		achievement_background.append(close_button);
		
		for (var i = 0; i < achievements.length; i++) {
			achievement_background.append(achievements[i].createHTML());
		}
			
		$("#center_content").append(achievement_background);
	} else {
		$("#achievement_container").remove();
	}
	
	MENU_CLOSE = false;
}
/** Updates the menu that displays all achievements. */
function updateAchievements() {
	for (var i = 0; i < achievements.length; i++) {
		if (achievements[i].previous_achievement != null && achievements[achievements[i].previous_achievement].unlocked) {
			achievements[i].makeAvailable();
		}
		if (achievements[i].available && achievements[i].testUnlock() && !achievements[i].unlocked) {
			achievements[i].unlocked = true;
			showAchievement(i);

			if ($("#achievement_container").length) {
				$("#achievement_container").remove();
				openAchievements();
			}			
			
			window.setTimeout(function () {if ($("#achievement_container").length) {
				$("#achievement_container").remove();
				openAchievements();
			}}, 10);
		}
	}
}
/** Displays the popup for when an achievement is unlocked. */
function showAchievement(i) {
	var x = achievements[i].x;
	var y = achievements[i].y;
	
	$("#popup_achievement").css("opacity", "1");
	$("#achievement_display").attr("style", "float:left;height:48px;width:48px;background:url(images/achievement_sheet.png) -"+x+"px -"+y+"px;");
	$("#achievement_title").html(achievements[i].name + " Completed");
	$("#popup_achievement").offset({ top: ($("#global_achievements").offset().top), left: ($("#global_achievements").offset().left)});
	
	if (achievements[i].upgrade) {upgrades[achievements[i].upgrade].makeAvailable();}
	
	if (upgrades[205].bought) {addClockTicks(30);}
}
/** Updates the HTML for the tooltip to represent the achievements.
 * @param {element} self - The HTML to display the tooltip relative to.
 */
function achievementTooltip(self) {
	tooltip(self, 1, 20, "Achievements", "Click to view the list of your completed achievements.", function () {}, true);
}
/** Unlocks upgrades for achievements to have the upgrades persist through resets. */
function testAchievementUpgrades() {
	for (var i = 0; i < achievements.length; i++) {
		if (achievements[i].unlocked && achievements[i].upgrade != null) {upgrades[achievements[i].upgrade].makeAvailable();}
	}
}