/**
 * @fileOverview Handles the creation and progress of the game's assistants.
 */

//Global variables to track assistant progress
var assistants = [];
var assistant_levels = [5, 15, 25, 35, 50];
var assistant_opened = 0;


var stored_bonuses = [];
var stored_bonuses_enabled = true;
var angelic_release = false;
var angelic_protection = false;

var demonic_vengeance = 0;
var vengeance_bonus = 0;

var alien_target = -1;
var consumption_bonus = 0;
var inertia = 0;

var calm = false;

var corrupt_bonus = 1;

var research_upgrades = [219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 322, 315, 316, 317, 318, 319, 320, 321];
var research_iter = 0;
var research_growth = 1;

/** Represents this game's assistants.
 * @constructor
 * @param {string} name - The name of the assistant.
 * @param {string} description - The description of what the assistant does.
 * @param {string} icon - The file path for the icon associated with this assistant.
 * @param {int} x - The x location on the upgrade tile map for the icon.
 * @param {int} y - The y location on the upgrade tile map for the icon.
 */
function Assistant(name, description, icon, x, y) {
	this.description = description;
	this.name = name;
	this.icon = icon;
	this.x = x;
	this.y = y;
	this.unlocked = false;
	this.xp = 0;
	this.level = 1;
	this.next_xp = 60;
	this.abilities = [];
	
	/**
	 * @constructor
	 * @param {string} name - The name of the assistant.
	 * @param {string} description - The description of what the assistant does.
	 * @param {string} icon - The file path for the icon associated with this assistant.
	 * @param {int} x - The x location on the upgrade tile map for the icon.
	 * @param {int} y - The y location on the upgrade tile map for the icon.
	 */
	this.update = function (dt) {
		if (this.unlocked) {
			this.xp += dt * ASSISTANT_RATE * (1 + kongBuys.experienced_assistants);
		}
		
		if (this.xp >= this.next_xp) {
			this.levelUp();
		}
		for (var i = 0; i < this.abilities.length; i++) {
			this.abilities[i].update(dt * (1 + kongBuys.experienced_assistants * 1.25));
		}
		if ($("#assistant_background").length && assistant_opened == assistants.indexOf(this)) {
			this.updateHTML();
		}
	}
	
	this.activate_ability = function (i) {
		if (this.level >= assistant_levels[i]) {
			this.abilities[i].handleClick();
		}
	}	
	
	this.cycle_ability = function (i) {
		if (this.level >= assistant_levels[i]) {
			this.abilities[i].handleCycle();
		}
	}
	
	this.createHTML = function () {
		assistant_opened = assistants.indexOf(this);
		
		$("#assistant_background").remove();
		
		var background = $(document.createElement("div"));
			background.attr("class", "assistant_background");
			background.attr("id", "assistant_background");
			background.css("border", "3px solid black");
			background.css("border-radius", "10px");
			background.css("text-align", "center");
			background.on("click", function () {MENU_CLOSE = false;})
			
		var close_button = $(document.createElement("img"));
			close_button.attr("src", "images/button_x.png").attr("height", "48").attr("width", "48");
			close_button.attr("onclick", "$('#assistant_background').remove()");
			close_button.attr("style", "position:absolute;right:0px;top:0px;cursor:pointer");
			close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
			close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
			
		var title = $(document.createElement("div"));
			title.html(this.name);
			title.css("font-size", "180%");
			title.attr("class", "detail_title");
			
		var img = $(document.createElement("img"));
		img.attr("src", this.icon);
		
		var description = $(document.createElement("div"));
			description.html(this.description() + ((assistants.indexOf(this) == 0 && assistants[0].level > assistant_levels[3]) ? ('<br><br>Bonus Storage ' + ((stored_bonuses_enabled) ? 'Enabled' : 'Disabled') + '<br>' + ((stored_bonuses.length > 0) ? buffs[stored_bonuses[0][0]].name + ' Stored <br>' : '') + ((stored_bonuses.length > 1) ? buffs[stored_bonuses[1][0]].name + ' Stored <br>' : '')) : '') + ((assistants.indexOf(this) == 3 && assistants[3].level >= assistant_levels[4]) ? ('<br><br>Growth Bonus: ' + ((research_growth - 1) * 100).toFixed(0)) + '%' : '') + ((assistants.indexOf(this) == 5 && assistants[5].level >= assistant_levels[4]) ? ('<br><br>Corrupt Bonus: ' + ((corrupt_bonus - 1) * 100).toFixed(1)) + '%' : ''));
			description.css("font-size", "100%");
			description.attr("id", "assistant_description");
		
		var level = $(document.createElement("div"));
			level.html("Level: " + this.level + "<br>Progress: " + Math.floor(this.xp) + " / " + this.next_xp);
			level.css("font-size", "110%");
			level.attr("id", "assistant_level");
		
		var ability_container = $(document.createElement("div"));
			ability_container.attr("id", "ability_container");
			
		for (var i = 0; i < this.abilities.length; i++) {
			var ability = this.abilities[i];
			var ability_span = $(document.createElement("span"));
			ability_span.css("position", "relative");
			ability_span.css("display", "inline-block");
			var ability_cd = $(document.createElement("div"));
			ability_cd.attr("id", "ability_cooldown_" + i);
			
			var distance = ability.cd/ability.base_cd * 48;
			var y = 48 - distance;
			if (ability.cd == ability.base_cd) {distance = 0;}
			ability_cd.attr("style", "pointer-events: none;border-radius:4px;position:absolute;left:0px;top:"+y+"px;height:"+distance+"px;width:48px;background-color:#000000;opacity:0.5");			
			
			var ability_ele = $(document.createElement("img"));
			ability_ele.attr("src", ability.icon);
			if (!ability.passive) {
				ability_ele.css("cursor", "pointer");
				ability_ele.attr("onclick", "assistants[" + assistants.indexOf(this) + "].activate_ability(" + i + ")");
				ability_ele.attr("oncontextmenu", "if (assistants[6].level >= 15 && assistants[6].unlocked) assistants[" + assistants.indexOf(this) + "].cycle_ability(" + i + ")");
				
			}
			
			if (this.level < assistant_levels[i]) {
				ability_ele.css("filter", "grayscale(100%)");
				ability_ele.attr("onmouseover","tooltip(this, 1, 0, 'Unavailable', 'Reach level ' + assistant_levels[" + i + "] +  ' of this assistant to unlock.')");
			} else {
				var cd = "";
				"Cooldown:" + secondsToTime(this.abilities[i].cd);
				ability_ele.attr("onmouseover","tooltip(this, "+ability.x+", "+ability.y+", '"+ability.name+"', '"+ability.description+"<br>' + ((assistants["+assistants.indexOf(this)+"].abilities["+i+"].cd != 0) ? ((assistants["+assistants.indexOf(this)+"].abilities["+i+"].automated ? 'Will Auto-activate<br>' : '') + (assistants["+assistants.indexOf(this)+"].abilities["+i+"].grouped ? 'Grouped<br>' : '') + ' Cooldown: ' + secondsToTime(assistants["+assistants.indexOf(this)+"].abilities["+i+"].cd) + '') : ''), function () {return '"+ability.description+"<br> ' + ((assistants["+assistants.indexOf(this)+"].abilities["+i+"].cd != 0) ? ((assistants["+assistants.indexOf(this)+"].abilities["+i+"].automated ? 'Will Auto-activate<br>' : '') + (assistants["+assistants.indexOf(this)+"].abilities["+i+"].grouped ? 'Grouped<br>' : '') + ' Cooldown: ' + secondsToTime(assistants["+assistants.indexOf(this)+"].abilities["+i+"].cd) + '') : '')}, true)");
			}
			
			ability_ele.attr("onmouseleave", "hideTooltip()");
			
			ability_span.append(ability_ele);
			ability_span.append(ability_cd);
			ability_container.append(ability_span);
			ability_container.append(document.createTextNode(" "));
		}
		
		background.append(close_button);
		background.append(title);
		background.append(img);
		background.append($(document.createElement("br")));
		background.append(description);
		background.append($(document.createElement("br")));
		background.append(level);
		background.append($(document.createElement("br")));
		background.append($(document.createElement("br")));
		background.append(ability_container);
		
		$(document.body).append(background);
			
		MENU_CLOSE = false;
	}
	this.updateHTML = function () {
		for (var i = 0; i < this.abilities.length; i++) {
			ability = this.abilities[i];
			var distance = ability.cd/ability.base_cd * 48;
			var y = 48 - distance;
			if (ability.cd == ability.base_cd) {distance = 0;}
			$("#ability_cooldown_" + i).attr("style", "pointer-events: none;border-radius:4px;position:absolute;left:0px;top:"+y+"px;height:"+distance+"px;width:48px;background-color:#000000;opacity:0.5");	
		}
		
		$("#assistant_level").html("Level: " + this.level + "<br>Progress: " + Math.floor(this.xp) + " / " + this.next_xp);
	}
	this.levelUp = function () {
		this.xp -= this.next_xp;
		this.level += 1;
		this.next_xp = Math.ceil(this.next_xp * 1.12) + 20;
		
		if ($("#assistant_background").length && assistant_opened == assistants.indexOf(this)) {
			this.createHTML();
		}
	}
}
/** Represents the abilities this game's assistants.
 * @constructor
 * @param {string} name - The name of the ability.
 * @param {string} description - The description of what the ability does.
 * @param {int} x - The x location on the upgrade tile map for the icon to be displayed on the tooltip.
 * @param {int} y - The y location on the upgrade tile map for the icon to be displayed on the tooltip.
 * @param {boolean} passive - Determines if the ability is a passive ability or an active ability.
 * @param {int} cd - How long in seconds the ability will take to reactivate after previous activations.
 * @param {function} activation - Optional function that will be trigger each time this ability is activated.
 */
function Ability(name, description, icon, x, y, passive, cd, activation) {
	this.name = name;
	this.description = description;
	this.icon = icon;
	this.x = x;
	this.y = y;
	this.passive = passive;
	this.cd = cd;
	this.base_cd = cd;
	this.activation = activation || function () {};
	this.automated = false;
	this.grouped = false;
	this.update = function (dt) {
		if (this.cd != this.base_cd) {
			this.cd -= dt;
			if (this.cd < 0) {
				this.cd = this.base_cd;
			}
		}
		
		if (this.automated) {
			this.handleClick();
		}
	};
	this.available = function () {
		return this.cd == this.base_cd;
	}
	this.handleClick = function () {
		if (!this.passive && this.cd == this.base_cd) {
			this.activation();
			this.cd -= 1;
			if (assistants[0].abilities.indexOf(this) == 3 || assistants[0].abilities.indexOf(this) == 4) {
				popupText("Storage Toggled", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
			} else {
				popupText(this.name + " Activated", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
				if (assistants[3].level >= assistant_levels[3]) {minigames[5].vars.research_points += 1;}
			}
		}
	}
	this.handleCycle = function () {
		if (!this.passive) {
			if (assistants[6].level < 15) {this.automated = !this.automated}
			else {
				if (!this.automated && !this.grouped) {this.automated = true;}
				else if (this.automated) {this.automated = false; this.grouped = true;}
				else {this.grouped = false; this.automated = false;}
			}
		}
	}
}
/** Instantiates all assistants, and adds necessary methods. */
function initAssistants() {
	var angelic_assistant = new Assistant("Angelic Assistant", function () {return "Angelic Assistants increases value from clicking (" + this.level + "%) and autoclicks " + (1 + Math.floor(this.level/10)) + " times every 4 seconds. Over time and from bonuses being activated angelic assistants gain progress to higher levels, which can unlock new abilities"}, "images/assistant_angelic.png", 2, 20);
	
		var angelic_ability_1 = new Ability("Angel&apos;s Grace", "The next time a building&apos;s currency or total credits would be reduced to less than zero it is reduced to 1 instead.", "images/ability_angelic_1.png", 2, 20, true, 1800);
		var angelic_ability_2 = new Ability("Angel&apos;s Boost", "Increases the duration of all active effects by 15 seconds.", "images/ability_angelic_2.png", 2, 20, false, 300, function () {
			var len = buffs.length;
			for (var i = 0; i < len; i++) {
				if (buffs[i].active) {
					buffs[i].activate(15);
				}
			}
		});
		var angelic_ability_3 = new Ability("Purification", "Removes all negative effects.", "images/ability_angelic_3.png", 2, 20, false, 3600, function () {
			var len = buffs.length;
			for (var i = 0; i < len; i++) {
				if (buffs[i].negative && buffs[i].active) {
					buffs[i].time = 0.1;
				}
			}
		});
		var angelic_ability_4 = new Ability("Duality", "Each time a bonus would be activated, it will be stored or activated at the same time as the last stored bonus. Click to toggle bonus storage", "images/ability_angelic_4.png", 2, 20, false, 2, function () {
			stored_bonuses_enabled = !stored_bonuses_enabled;
			for (var i = stored_bonuses.length - 1; i >= 0; i--) {
				var bonus = stored_bonuses.pop();
				buffs[bonus[0]].activate(bonus[1]);
			}
			if ($("#assistant_background").length && assistant_opened == 0) {assistants[0].createHTML()};
		});
		var angelic_ability_5 = new Ability("Trifecta", "Each time a bonus would be activated, it will be stored or activated at the same time as the last two stored bonus. Click to toggle bonus storage", "images/ability_angelic_5.png", 2, 20, false, 2, function () {
			stored_bonuses_enabled = !stored_bonuses_enabled;
			for (var i = stored_bonuses.length - 1; i >= 0; i--) {
				var bonus = stored_bonuses.pop();
				buffs[bonus[0]].activate(bonus[1])
			}
			if ($("#assistant_background").length && assistant_opened == 0) {assistants[0].createHTML()};
		});
		
		angelic_assistant.abilities.push(angelic_ability_1);
		angelic_assistant.abilities.push(angelic_ability_2);
		angelic_assistant.abilities.push(angelic_ability_3);
		angelic_assistant.abilities.push(angelic_ability_4);
		angelic_assistant.abilities.push(angelic_ability_5);
	
	assistants.push(angelic_assistant);	
	
	var demonic_assistant = new Assistant("Demonic Assistant", function () {return "Demonic Assistants increases production by (" + roundPlace(this.level * 0.1).toFixed(1) + "%) and offline building resource collection rate by (" + (5 + Math.floor(this.level/10) * 5) + "%). Over time and from negative effects being activated Demonic Assistants gain progress to higher levels, which can unlock new abilities"}, "images/assistant_demonic.png", 3, 20);
	
		var demonic_ability_1 = new Ability("Demonic Vengeance", "When the last negative effect wears off production is increased by 2% for each negative effect activated during that time frame (max 20%) for 30 seconds.", "images/ability_demonic_1.png", 3, 20, true, 0);
		var demonic_ability_2 = new Ability("Demonic Stewardship", "All assistant&apos;s abilities will recharge while offline.", "images/ability_demonic_2.png", 3, 20, true, 0);
		var demonic_ability_3 = new Ability("Demonic Fury", "Autoclicks 8 times a second for 8 seconds", "images/ability_demonic_3.png", 3, 20, false, 900, function () {buffs[18].activate(8)});
		var demonic_ability_4 = new Ability("Curse Defusion", "The next negative effect activated will be activated for half the time.", "images/ability_demonic_4.png", 3, 20, true, 720);
		var demonic_ability_5 = new Ability("Demonic Deal", "Causes two effects to activate, one increasing production by 15%, and the other decreasing production by 15% for one minute.", "images/ability_demonic_5.png", 3, 20, false, 600, function () {buffs[19].activate(60);buffs[20].activate(60);});
		
		demonic_assistant.abilities.push(demonic_ability_1);
		demonic_assistant.abilities.push(demonic_ability_2);
		demonic_assistant.abilities.push(demonic_ability_3);
		demonic_assistant.abilities.push(demonic_ability_4);
		demonic_assistant.abilities.push(demonic_ability_5);
		
	assistants.push(demonic_assistant);
		
	var alien_assistant = new Assistant("Alien Assistant", function () {return "Alien Assistants increases all buildings&apos; work rate by (" + roundPlace(this.level * 0.1).toFixed(1) + "%). Over time Alien Assistants gain progress to higher levels, which can unlock new abilities <br>" + (this.level >= assistant_levels[1] ? "Next Intelligent Consumption: " + roundPlace((0.25/(1 + Math.pow(Math.E, -0.1 * (minigames[5].vars.research_points - 50)))) * 100).toFixed(2) + "%" : "") }, "images/assistant_alien.png", 4, 20);
	
		var alien_ability_1 = new Ability("Wild Experimentation", "Increases production and work rate of a random building by 25% until the next Wild Experimentation is activated. Also grants 60 progress to the next level.", "images/ability_alien_1.png", 4, 20, false, 60, function () {
			assistants[2].xp += 60;
			var found = false;
			while (!found) {
				var ran = Math.floor(Math.random() * buildings.length);
				if (buildings[ran].count >= 1) {
					found = true;
					alien_target = ran;
					UPDATE_BUILDINGS = true;
				}
			}
		});
		var alien_ability_2 = new Ability("Intelligent Consumption", "Consumes all research points and increases production for 120 seconds based on the total number of research points consumed this way.", "images/ability_alien_2.png", 4, 20, false, 3600, function () {
			consumption_bonus = (0.25/(1 + Math.pow(Math.E, -0.1 * (minigames[5].vars.research_points - 50))));
			buffs[21].activate(120);
			minigames[5].vars.research_points = 0;
		});
		var alien_ability_3 = new Ability("Inertia", "Activate to prevent production from changing for 20 seconds", "images/ability_alien_3.png", 4, 20, false, 3600, function () {buffs[22].activate(20);
		inertia = PRODUCTION;
		});
		var alien_ability_4 = new Ability("Alien Adaptation", "Increases the rate that assistants progress towards the next level by 50%.", "images/ability_alien_4.png", 4, 20, true, 0);
		var alien_ability_5 = new Ability("Temporal Gateway", "Resets the cooldowns of all other abilities for all assistants.", "images/ability_alien_5.png", 4, 20, false, 36000, function () {
			for (var i = 0; i < assistants.length; i++) {
				for (var j = 0; j < assistants[i].abilities.length; j++) {
					assistants[i].abilities[j].cd = assistants[i].abilities[j].base_cd
				}
			}
			assistants[2].abilities[4].cd -= 1;
		});
		
		alien_assistant.abilities.push(alien_ability_1);
		alien_assistant.abilities.push(alien_ability_2);
		alien_assistant.abilities.push(alien_ability_3);
		alien_assistant.abilities.push(alien_ability_4);
		alien_assistant.abilities.push(alien_ability_5);
	

	assistants.push(alien_assistant);	
	
	var research_assistant = new Assistant("Research Assistant", function () {return "Research Assistants reduce the cost of all buildings by (" + roundPlace(this.level * 0.2).toFixed(1) + "%). Over time Research Assistants gain progress to higher levels, which can unlock new abilities." }, "images/assistant_research.png", 0, 7);
	
		var research_ability_1 = new Ability("Development", "Unlocks a new upgrade.", "images/ability_research_1.png", 0, 7, false, 360, function () {
			if (research_iter < research_upgrades.length) {
				upgrades[research_upgrades[research_iter]].makeAvailable(); research_iter++;
			}
		});
		var research_ability_2 = new Ability("Thoughtflare", "Triples game speed for 60 seconds.", "images/ability_research_2.png", 0, 7, false, 600, function () {buffs[28].activate(60);});
		var research_ability_3 = new Ability("Sustained Research", "Increases the combined value of all bonuses from upgrades and buffs to the maximum value that they have been for 90 seconds.", "images/ability_research_3.png", 4, 20, false, 1800, function () {buffs[29].activate(20);
		inertia = PRODUCTION;
		});
		var research_ability_4 = new Ability("Endless Knowledge", "Each time an ability of an assistant is activated one research point is granted.", "images/ability_research_4.png", 0, 7, true, 0);
		var research_ability_5 = new Ability("Unbounded Growth", "Increases production by 1% permanently.", "images/ability_research_5.png", 0, 7, false, 600, function () {research_growth += 0.01;if ($("#assistant_background").length && assistant_opened == 3) {assistants[3].createHTML()};});
		
		research_assistant.abilities.push(research_ability_1);
		research_assistant.abilities.push(research_ability_2);
		research_assistant.abilities.push(research_ability_3);
		research_assistant.abilities.push(research_ability_4);
		research_assistant.abilities.push(research_ability_5);
	

	assistants.push(research_assistant);	
	
	var zen_assistant = new Assistant("Zen Assistant", function () {return "Zen assistants increase production when no bonuses are active by (" + roundPlace(this.level).toFixed(1) + "%). Over time Zen Assistants gain progress to higher levels, which can unlock new abilities." }, "images/assistant_zen.png", 0, 7);
	
		var zen_ability_1 = new Ability("Time", "Grants 30 seconds worth of extra time.", "images/ability_zen_1.png", 9, 31, false, 600, function () {addClockTicks(30)});
		var zen_ability_2 = new Ability("Calm", "Toggle to prevent all bonuses, both positive and negative, from being activated. Production is also increased by 25%.", "images/ability_zen_2.png", 9, 31, false, 300, function () {
			calm = !calm;
			if ($("#assistant_background").length && assistant_opened == 4) {assistants[4].createHTML();}
		});
		var zen_ability_3 = new Ability("Order", "Decreases the price of all buildings by 15%", "images/ability_zen_3.png", 9, 31, true, 0);
		var zen_ability_4 = new Ability("Reason", "Grants 45 research points.", "images/ability_zen_4.png", 9, 31, false, 1800, function () {minigames[5].vars.research_points += 45;});
		var zen_ability_5 = new Ability("Power", "Increases production by 25%.", "images/ability_zen_5.png", 9, 31, true, 0);
		
		zen_assistant.abilities.push(zen_ability_1);
		zen_assistant.abilities.push(zen_ability_2);
		zen_assistant.abilities.push(zen_ability_3);
		zen_assistant.abilities.push(zen_ability_4);
		zen_assistant.abilities.push(zen_ability_5);
	

	assistants.push(zen_assistant);	
	
	var corrupt_assistant = new Assistant("Corrupt Assistant", function () {return "Corrupt assistants increase the production of the corrupt subgame by (" + roundPlace(this.level).toFixed(1) + "%). Over time Corrupt Assistants gain progress to higher levels, which can unlock new abilities." }, "images/assistant_corrupt.png", 0, 7);
	
		var corrupt_ability_1 = new Ability("Underground Corruption", "Increases production by 25% for 60 seconds.", "images/ability_corrupt_1.png", 0, 19, false, 600, function () {buffs[32].activate(60)});
		var corrupt_ability_2 = new Ability("Corrupt Warp", "Instantly grants 5 minutes worth of corruption.", "images/ability_corrupt_2.png", 0, 19, false, 600, function () {subgames[0].credits += subgames[0].production * 300});
		var corrupt_ability_3 = new Ability("Corrupt Zoning", "Decreases the price of all buildings by 15%", "images/ability_corrupt_3.png", 0, 19, true, 0);
		var corrupt_ability_4 = new Ability("Corrupt Extension", "Increases the duration of all temporary effects (both positive and negative) in the main game by 10%.", "images/ability_corrupt_4.png", 0, 19, true, 0);
		var corrupt_ability_5 = new Ability("Corrupt Sacrifice", "Sacrifice all bad seeds to permanently increase production in the main game by 0.5%.", "images/ability_corrupt_5.png", 0, 19, false, 600, function () {
			corrupt_bonus += 0.005;subgames[0].buildings[0].count = 0;
			if ($("#assistant_background").length && assistant_opened == 5) {assistants[5].createHTML();}
		});
		
		corrupt_assistant.abilities.push(corrupt_ability_1);
		corrupt_assistant.abilities.push(corrupt_ability_2);
		corrupt_assistant.abilities.push(corrupt_ability_3);
		corrupt_assistant.abilities.push(corrupt_ability_4);
		corrupt_assistant.abilities.push(corrupt_ability_5);
	

	assistants.push(corrupt_assistant);	
	
	var automation_assistant = new Assistant("Automation Assistant", function () {return "Automation assistants increase the rate assistants progress to the next level by (" + roundPlace(this.level).toFixed(1) + "%). Over time Automation Assistants gain progress to higher levels, which can unlock new abilities." }, "images/assistant_automation.png", 8, 30);
	
		var automation_ability_1 = new Ability("Automatic Activation", "Each assistant&apos;s activatable abilities can be toggle to automatically activate (Right click activatable abilities to toggle).", "images/ability_automation_1.png", 8, 30, true, 0);
		var automation_ability_2 = new Ability("Group Hugs", "Each assistant&apos;s activatable abilities can be cycled to activate when this ability is activated (Right click activatable abilities to cycle between group, automatic activation and none).", "images/ability_automation_2.png", 8, 30, false, 600, function () {
			for (var i = 0; i < assistants.length; i++) {
				for (var j = 0; j < assistants[i].abilities.length; j++) {
					if (i == 6 && j == 1) {continue}
					if (!assistants[i].abilities[j].passive && assistants[i].abilities[j].grouped) {
						assistants[i].abilities[j].handleClick();
					}
				}
			}
		});
		var automation_ability_3 = new Ability("Improved Performance", "Increases production by 15%", "images/ability_automation_3.png", 8, 30, true, 0);
		var automation_ability_4 = new Ability("Instant Industry", "Instantly grants 60 seconds worth of production.", "images/ability_automation_4.png", 8, 30, false, 900, function () {CREDITS += PRODUCTION * 60});
		var automation_ability_5 = new Ability("Quality Automation", "Increases production by 15%.", "images/ability_automation_5.png", 8, 30, true, 0);
		
		automation_assistant.abilities.push(automation_ability_1);
		automation_assistant.abilities.push(automation_ability_2);
		automation_assistant.abilities.push(automation_ability_3);
		automation_assistant.abilities.push(automation_ability_4);
		automation_assistant.abilities.push(automation_ability_5);
	

	assistants.push(automation_assistant);
}