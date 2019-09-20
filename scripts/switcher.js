/**
 * @fileOverview Handles the switching to each building's mini-menu.
 */

/** Toggles the mini-menu for the specified building.
 * @param {int} building_id - The id of the building to switch to.
 */
function switchBuilding(building_id) {
	buildings[building_id].switcher();
	UPDATE_BUILDINGS = true;
}
/** Represents a object that stores mini-menu data for a building.
 * @constructor
 * @param {string} colorStart - The starting color for the gradient in this building's progress bar.
 * @param {string} colorEnd - The ending color for the gradient in this building's progress bar.
 */
function Switcher(colorStart, colorEnd) {
	this.color_start = colorStart || "#EEEEEE";
	this.color_end = colorEnd || "#222222";
	this.createHTML = function (name) {
		var building_id = switches.indexOf(this)
		
		var switched_container = $(document.createElement("div"));
			switched_container.attr("style", "position:relative;left:70px;top:1px;");
			switched_container.attr("id", "switched"+name);
		
		var top_row = $(document.createElement("div"));
			
		top_row.append(switchedStats(building_id));
		top_row.append(switchedHelp(building_id));
		if (building_id < 7 && !(building_id == 1 || building_id == 6) && buildings[1].count != 0) {top_row.append(htmlGoldRefill(building_id, "Refill", "Refill", true))}
		if (building_id < 7 && buildings[3].count != 0 && building_id != 3) {top_row.append(htmlPower(building_id, true))}
		if (buildings[6].count != 0) {top_row.append(htmlAutomation(building_id, true))}
		if (building_id < 14 && buildings[14].count != 0) {top_row.append(htmlClone(building_id, true))}
		if (building_id < 7 && challenges[building_id].unlocked != 0) {top_row.append(htmlTabChallenge(building_id, true))}
		if (building_id > 6 && building_id < 14 && buildings[10].coutn != 0) {top_row.append(htmlAlienPower(building_id, true))}
		//
		
		var bottom_row = $(document.createElement("div"));
			
		bottom_row.append(this.addBottom(name));

		switched_container.append(top_row);
		switched_container.append(bottom_row);
		
		return switched_container;
	}
	this.addBottom = function (name) {
		
	}
	this.createStorageBar = function () {
		var border = $(document.createElement("div"));
		
		border.attr("style", "position:absolute;right:3px;top:2px;border-radius: 3px; border: 3px solid black;height: 58px; width: 20px;").attr("id", "storage_bar" + buildings[switches.indexOf(this)].name);
		
		var background_container = $(document.createElement("div"));
			background_container.attr("style", "position:absolute;right:0px;bottom:0px;width: 20px; overflow:hidden").attr("id", "storage_container" + buildings[switches.indexOf(this)].name).css("height", this.ratio() * 58 + "px");
		
		var background = $(document.createElement("div"));
		background.attr("style", "position:absolute;right:0px;bottom:0px;height: 58px; width: 20px; background-color:" + this.color_start + "; background-image: linear-gradient("+this.color_start+", "+this.color_end+");").attr("id", "storage_background" + buildings[switches.indexOf(this)].name);
		
		background_container.append(background)
		border.append(background_container);
		
		return border;
	}
	this.ratio = function () {
		return 0.75;
	}
	this.updateStorageBar = function (name) {
		$("#storage_container" + name).css("height", this.ratio() * 58 + "px");
	}
	this.tooltip = function (name) {};
}
/** Initializes all switcher objects. */
function initSwitches() {
	var cultist_switcher = new Switcher("#e80000", "#9e0000");
	var mine_switcher = new Switcher("#fff660", "#ebac00");
	var gambler_switcher = new Switcher("#17ff0e", "#0e8c00");
	var power_switcher = new Switcher("#fcff1f", "#ff9130");
	var bank_switcher = new Switcher("#75a4a7", "#577678");
	var research_switcher = new Switcher("#73abf5", "#1d1bd0");
	var factory_switcher = new Switcher("#939393", "#000000");
	var bonus_switcher = new Switcher("#fcff1f", "#a14c00");
	var click_switcher = new Switcher("#0011ff", "#000479");
	var cyro_switcher = new Switcher("#46f5fc", "#03aab0");
	var alien_switcher = new Switcher("#cd60ff", "#7000a3");
	var computer_switcher = new Switcher("#17ff0e", "#0e8c00");
	var accel_switcher = new Switcher("#e80000", "#9e0000");
	var flux_switcher = new Switcher("#fcff1f", "#ff9130");
	var clone_switcher = new Switcher("#cd60ff", "#7000a3");
	var epiphany_switcher = new Switcher("#17ff0e", "#0e8c00");
	var merchant_switcher = new Switcher("#e80000", "#9e0000");
	var warp_switcher = new Switcher("#46f5fc", "#03aab0");
	var stellar_switcher = new Switcher("#e80000", "#9e0000");
	var temporal_switcher = new Switcher("#46f5fc", "#03aab0");
	var political_switcher = new Switcher("#fcff1f", "#ff9130");
	
	cultist_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedCultist());
		
		return bottom_container;
	}
	cultist_switcher.ratio = function () {
		var ratio = minigames[0].vars.blood / minigames[0].vars.max_blood;
		return ratio;
	}	
	cultist_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 5, 1, 'Cultist', 'You currently have <span style=\"color:#ff1e2d;\">'+ Math.floor(minigames[0].vars.blood) +'/' + Math.floor(minigames[0].vars.max_blood) + '</span> blood stored.<br>Blood is produced at a rate of <span style=\"color:#ff1ea4;\">' + Math.round(100 * 0.5 * minigames[0].vars.max_blood/200)/100 + '/s</span>.', function () {return 'You currently have <span style=\"color:#ff1e2d;\">'+ Math.floor(minigames[0].vars.blood) +'/' + Math.floor(minigames[0].vars.max_blood) + '</span> blood stored.<br>Blood is produced at a rate of <span style=\"color:#ff1ea4;\">' + Math.round(100 * 0.5 * minigames[0].vars.max_blood/200)/100 + '/s</span>.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	mine_switcher.ratio = function () {
		var add_max = 0;
		if (minigames[1].vars.gold > 100) {
			add_max += (minigames[1].vars.gold - 100) / 2;
		}
		
		return 1 - (minigames[1].vars.mine_time / (minigames[1].vars.mine_max_time + add_max));
	}
	mine_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 8, 2, 'Mine', 'You currently have <span style=\"color:#f6ff53;\">'+ Math.floor(minigames[1].vars.gold) +'</span> gold bars stored.<br>The next gold bar will be mined in <span style=\"color:#f6ff53;\">' + Math.round(minigames[1].vars.mine_time) + 's</span>.', function () {return 'You currently have <span style=\"color:#f6ff53;\">'+ Math.floor(minigames[1].vars.gold) +'</span> gold bars stored.<br>The next gold bar will be mined in <span style=\"color:#f6ff53;\">' + Math.round(minigames[1].vars.mine_time) + 's</span>.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	gambler_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedGambler());
		
		return bottom_container;
	}
	gambler_switcher.ratio = function () {
		return (minigames[2].vars.draw_charges / minigames[2].vars.draw_charges_max);
	}
	gambler_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 7, 4, 'Gambler', 'You currently have <span style=\"color:#5EC1FF;\">' + Math.floor(minigames[2].vars.draw_charges) + '/' + Math.floor(minigames[2].vars.draw_charges_max) + '</span> draws.<br>The next draw will be available in <span style=\"color:#5EC1FF;\">' + Math.round(minigames[2].vars.draw_time) + 's</span>.', function () {return 'You currently have <span style=\"color:#5EC1FF;\">' + Math.floor(minigames[2].vars.draw_charges) + '/' + Math.floor(minigames[2].vars.draw_charges_max) + '</span> draws.<br>The next draw will be available in <span style=\"color:#5EC1FF;\">' + Math.round(minigames[2].vars.draw_time) + 's</span>.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	power_switcher.ratio = function () {
		return (minigames[3].vars.power / minigames[3].vars.max_power);
	}
	power_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 5, 5, 'Power Plant', 'You currently have <span style=\"color:#fddc24;\">' + Math.floor(minigames[3].vars.power) + '/' + Math.floor(minigames[3].vars.max_power) + '</span> power.<br>Power plants produce <span style=\"color:#fddc24;\">' + (minigames[3].vars.power_rate).toFixed(2) + '/s</span>.', function () {return 'You currently have <span style=\"color:#fddc24;\">' + Math.floor(minigames[3].vars.power) + '/' + Math.floor(minigames[3].vars.max_power) + '</span> power.<br>Power plants produce <span style=\"color:#fddc24;\">' + (minigames[3].vars.power_rate).toFixed(2) + '/s</span>.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	bank_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedBank());
		
		return bottom_container;
	}
	bank_switcher.ratio = function () {
		var ratio = Math.min(1 - (minigames[4].vars.investment_time / 300), 1)
		if (!minigames[4].vars.investing) {ratio = 0}
		return ratio;
	}
	bank_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 7, 6, 'Bank', minigames[4].vars.investing ? 'This investment will return <span style=\"color:#00db0a;\">' + fancyNumber(minigames[4].vars.investment_value) + '</span> credits in <span style=\"color:#CCCCCC;\">' + Math.floor(minigames[4].vars.investment_time) + 's</span>.' : 'The bank is not investing currently', function () {return minigames[4].vars.investing ? 'This investment will return <span style=\"color:#00db0a;\">' + fancyNumber(minigames[4].vars.investment_value) + '</span> credits in <span style=\"color:#CCCCCC;\">' + Math.floor(minigames[4].vars.investment_time) + 's</span>.' : 'The bank is not investing currently'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	research_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedResearch());
		
		return bottom_container;
	}
	research_switcher.ratio = function () {
		var ratio = 1 - (minigames[5].vars.research_time / minigames[5].vars.research_time_max);
		
		return ratio;
	}
	research_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 0, 7, 'Research Center', 'You currently have <span style=\"color:#5036FF;\">'+ Math.floor(minigames[5].vars.research_points) +'</span> research points stored.<br>The next research point will be available in <span style=\"color:#5036FF;\">' + Math.round(minigames[5].vars.research_time) + 's</span>.', function () {return 'You currently have <span style=\"color:#5036FF;\">'+ Math.floor(minigames[5].vars.research_points) +'</span> research points stored.<br>The next research point will be available in <span style=\"color:#5036FF;\">' + Math.round(minigames[5].vars.research_time) + 's</span>.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	factory_switcher.ratio = function () {
		var unlocked = 0;
		var automated = 0;
		for (var i = 0; i < buildings.length; i++) {
			if (buildings[i].unlocked) {
				unlocked += 1;
			}
			if (automation[i].autobuy) {
				automated += 1;
			}
		}
		
		return automated / unlocked;
	}
	factory_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "var unlocked = 0;var automated = 0;for (var i = 0; i < buildings.length; i++) {	if (buildings[i].unlocked) {unlocked += 1;}; if (automation[i].autobuy) {	automated += 1;}};tooltip(this, 6, 11, 'Factory', 'You currently have <span style=\"color:#CCCCCC;\">'+ Math.floor(automated) +'/' + Math.floor(unlocked) + '</span> buildings set to autobuy.')");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	bonus_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedBonus());
		
		return bottom_container;
	}
	bonus_switcher.ratio = function () {
		return 1 - (minigames[7].vars.bonus_time / minigames[7].vars.bonus_max_time)
	}
	bonus_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 0, 12, 'Bonus Factory', 'The next bonus will occur in <span style=\"color:#dcdf1c;\">'+ Math.floor(minigames[7].vars.bonus_time) +'s</span>', function () {return 'The next bonus will occur in <span style=\"color:#dcdf1c;\">'+ Math.floor(minigames[7].vars.bonus_time) +'s</span>'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	click_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedClick());
		
		return bottom_container;
	}
	click_switcher.ratio = function () {
		return (minigames[8].vars.stored_clicks / minigames[8].vars.max_clicks);
	}
	click_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 0, 3, 'Click Farm', 'You currently have <span style=\"color:#5036FF;\">'+ Math.floor(minigames[8].vars.stored_clicks) +'/' + minigames[8].vars.max_clicks + '</span> clicks stored.', function () {return 'You currently have <span style=\"color:#5036FF;\">'+ Math.floor(minigames[8].vars.stored_clicks) +'/' + minigames[8].vars.max_clicks + '</span> clicks stored.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	cyro_switcher.ratio = function () {
		return minigames[9].vars.target_buff != null;
	}
	cyro_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 3, 14, 'Cryogenic Lab', minigames[9].vars.target_buff != null ? '<span style=\"color:#3DCFFF;\">'+ buffs[minigames[9].vars.target_buff].name + '</span> is currently frozen.' : 'No bonus is currently frozen at this time.', function () {return  minigames[9].vars.target_buff != null ? '<span style=\"color:#3DCFFF;\">'+ buffs[minigames[9].vars.target_buff].name + '</span> is currently frozen.' : 'No bonus is currently frozen at this time.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	alien_switcher.ratio = function () {
		return minigames[10].vars.alien_power / minigames[10].vars.max_power;
	}
	alien_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 8, 15, 'Alien Research', 'You currently have <span style=\"color:#CC79E8;\">'+ Math.floor(minigames[10].vars.alien_power) +'/' + minigames[10].vars.max_power + '</span> seconds worth of alien research stored.', function () {return 'You currently have <span style=\"color:#CC79E8;\">'+ Math.floor(minigames[10].vars.alien_power) +'/' + minigames[10].vars.max_power + '</span> seconds worth of alien research stored.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	computer_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedComputer());
		
		return bottom_container;
	}
	computer_switcher.ratio = function () {
		var ratio = 0;
		if (minigames[11].vars.program_1 != 0) {ratio = 1 - (minigames[11].vars.program_1_time / 60)} 
		else if (minigames[11].vars.program_2 != 0) {ratio = 1 - (minigames[11].vars.program_2_time / 60)} 
		else if (minigames[11].vars.program_3 != 0) {ratio = 1 - (minigames[11].vars.program_3_time / 60)} 
		return ratio;
	}
	computer_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 1, 16, 'Mainframe Computer', (minigames[11].vars.program_1 != 0 || minigames[11].vars.program_2 != 0 ||minigames[11].vars.program_3 != 0) ? 'You program step will be complete in <span style=\"color:#3DCFFF;\">'+ Math.floor(60 - switches[11].ratio() * 60)  + '</span> seconds.' : 'No program is currently being ran.', function () {return (minigames[11].vars.program_1 != 0 || minigames[11].vars.program_2 != 0 ||minigames[11].vars.program_3 != 0) ? 'You program step will be complete in <span style=\"color:#3DCFFF;\">'+ Math.floor(60 - switches[11].ratio() * 60)  + '</span> seconds.' : 'No program is currently being ran.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	accel_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedAccel());
		
		return bottom_container;
	}
	accel_switcher.ratio = function () {
		return minigames[12].vars.accel_bonus / 0.15;
	}
	accel_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 5, 17, 'Acceleration Lab', 'Your acceleration bonus is currently <span style=\"color:#e80000;\">'+ Math.floor(minigames[12].vars.accel_bonus / 1 * 100) +'%.', function () {return 'Your acceleration bonus is currently <span style=\"color:#e80000;\">'+ Math.floor(minigames[12].vars.accel_bonus / 1 * 100) +'%.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	flux_switcher.ratio = function () {
		return 1 - (minigames[13].vars.flux_time / 2100);
	}
	flux_switcher.tooltip = function (name) {
		$("#storage_bar" + name).attr("onmouseover", "tooltip(this, 5, 18, 'Fluctuation Lab', 'The next fluctuation will occur in <span style=\"color:#fcff1f;\">'+ secondsToTime(Math.floor(minigames[13].vars.flux_time)) +'.', function () {return 'The next fluctuation will occur in <span style=\"color:#fcff1f;\">'+ secondsToTime(Math.floor(minigames[13].vars.flux_time)) +'.'}, true)");
		$("#storage_bar" + name).attr("onmouseout", "hideTooltip();");
	}
	clone_switcher.ratio = function () {
		return (minigames[14].vars.clone_charges / minigames[14].vars.clone_max_charges);
	}
	epiphany_switcher.ratio = function () {
		return 1 - (minigames[15].vars.epiphany_time / minigames[15].vars.epiphany_max_time);
	}
	merchant_switcher.ratio = function () {
		return 1 - (minigames[16].vars.package_time / minigames[16].vars.package_max_time);
	}
	warp_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedWarp());
		
		return bottom_container;
	}	
	warp_switcher.ratio = function () {
		return minigames[17].vars.warp_charges / minigames[17].vars.warp_max_charges;
	}
	temporal_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedTemporal());
		
		return bottom_container;
	}
	temporal_switcher.ratio = function () {
		return 1 - (minigames[19].vars.active_effects.length / minigames[19].vars.max_active_effects)
	}
	political_switcher.addBottom = function (name) {
		var bottom_container = $(document.createElement("span"));

		bottom_container.append(switchedPolitical());
		
		return bottom_container;
	}
	political_switcher.ratio = function () {
		return (minigames[20].vars.morale / minigames[20].vars.max_morale)
	}
	
	switches.push(cultist_switcher);
	switches.push(mine_switcher);
	switches.push(gambler_switcher);
	switches.push(power_switcher);
	switches.push(bank_switcher);
	switches.push(research_switcher);
	switches.push(factory_switcher);
	switches.push(bonus_switcher);
	switches.push(click_switcher);
	switches.push(cyro_switcher);
	switches.push(alien_switcher);
	switches.push(computer_switcher);
	switches.push(accel_switcher);
	switches.push(flux_switcher);
	switches.push(clone_switcher);
	switches.push(epiphany_switcher);
	switches.push(merchant_switcher);
	switches.push(warp_switcher);
	switches.push(stellar_switcher);
	switches.push(temporal_switcher);
	switches.push(political_switcher);
}
/** Creates and returns extra HTML for the cultist mini-menu. 
 * @return {element} - The extra HTML.
 */
function switchedCultist() {
	var ritual_container = $(document.createElement("div"));
		var ritual_rush = $(document.createElement("img"));
		ritual_rush.attr("src", "images/ritual_blood_rush.png").attr("class", "ritual").attr("id", "ritual_main_0").attr("width", "28");
		ritual_rush.attr("onclick", "performRitual(0, 75, true);");
		ritual_rush.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Blood Rush', 'Increases production by <span style=\"color:#00db0a;\">25%</span> for 66 seconds. <br><span>Cost: 75 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')");
		ritual_rush.attr("onmouseout", "hideTooltip()");
		ritual_rush.attr("style", "margin:0px;");

		var ritual_time = $(document.createElement("img"));
		ritual_time.attr("src", "images/ritual_of_time.png").attr("class", "ritual").attr("id", "ritual_main_1").attr("width", "28");
		ritual_time.attr("onclick", "performRitual(1, 60, true)");
		ritual_time.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Time', 'Grants 10 seconds worth of time. <br><span>Cost: 60 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')");
		ritual_time.attr("onmouseout", "hideTooltip()");
		ritual_time.attr("style", "margin:0px;");

		var ritual_purity = $(document.createElement("img"));
		ritual_purity.attr("onclick", "performRitual(2, 110, true)");
		ritual_purity.attr("src", "images/ritual_of_purity.png").attr("class", "ritual").attr("id", "ritual_main_2").attr("width", "28");
		ritual_purity.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Purity', 'Resets the ritual of soot activations to 0. If more than 20 soot activations removed this way, production is permanantly increased by <span style=\"color:#00db0a;\">3%</span>. <br><span>Cost: 110 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_5.toUpperCase() + ' </span>')");
		ritual_purity.attr("onmouseout", "hideTooltip()");
		ritual_purity.attr("style", "margin:0px;");

		var ritual_soot = $(document.createElement("img"));
		ritual_soot.attr("src", "images/ritual_of_soot.png").attr("class", "ritual").attr("id", "ritual_main_3").attr("width", "28");
		ritual_soot.attr("onclick", "performRitual(3, 95, true)");
		ritual_soot.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Soot', 'Increases production by 15% + 3% for each previous ritual of soot activation <span style=\"color:#00db0a;\">('+Math.round((0.15 + minigames[0].vars.soot_counters * 0.03) * 100)+'%)</span>. This effect lasts 70 seconds. Each activation also permanently decreases production 1% <span style=\"color:#ff1e2d;\">(-'+Math.round(minigames[0].vars.soot_counters)+'%)</span>.<br><span>Cost: 95 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_4.toUpperCase() + ' </span>')");
		ritual_soot.attr("onmouseout", "hideTooltip()");
		ritual_soot.attr("style", "margin:0px;");

		var ritual_karma = $(document.createElement("img"));
		ritual_karma.attr("onclick", "performRitual(4, 75, true)");
		ritual_karma.attr("src", "images/ritual_of_karma.png").attr("class", "ritual").attr("id", "ritual_main_4").attr("width", "28");
		ritual_karma.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Karma', 'Increases the base production of cultists by 15 + 2 for each ritual of karma permanently (Currently: <span style=\"color:#00db0a;\">'+minigames[0].vars.karma_counters * (15 + (15 + (minigames[0].vars.karma_counters-1)*2))/2+'</span>). This effect persists through resets.<br><span>Cost: 75 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_6.toUpperCase() + ' </span>')");
		ritual_karma.attr("onmouseout", "hideTooltip()");
		ritual_karma.attr("style", "margin:0px;");

		var ritual_construction = $(document.createElement("img"));
		ritual_construction.attr("onclick", "performRitual(5, 60, true);");
		ritual_construction.attr("src", "images/ritual_of_construction.png").attr("class", "ritual").attr("id", "ritual_main_5").attr("width", "28");
		ritual_construction.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Construction', 'Instantly grants 1 free cultist, but has a 1% stacking chance of failure per cultist owned ('+Math.round((Math.pow(0.99, buildings[0].count)) * 1000) / 10+'% chance of success).<br><span>Cost: 60 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')");
        ritual_construction.attr("onmouseout", "hideTooltip()");
		ritual_construction.attr("style", "margin:0px;");
		
	ritual_container.append(ritual_rush);
	ritual_container.append(ritual_construction);
	ritual_container.append(ritual_time);
	ritual_container.append(ritual_soot.hide());
	ritual_container.append(ritual_purity.hide());
	ritual_container.append(ritual_karma.hide());
	
	if (unlocks[1].unlocked) ritual_soot.show();
	if (unlocks[2].unlocked) ritual_purity.show();
	if (unlocks[3].unlocked) ritual_karma.show();
	
	return ritual_container;
}
/** Creates and returns extra HTML for the gambler mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedGambler() {
	var gambler_container = $(document.createElement("div"));
	
	var deck_icon = $(document.createElement("img"));
		deck_icon.attr("src", "images/card_back.png").attr("style", "display:inline;").attr("id", "deck_background_main").attr("width", "26").attr("style", "position:relative;top:-2px;");
		deck_icon.attr("onmouseover","tooltip(this, 7, 4, 'Remaining Cards', 'This deck contains the follow cards:<br>' + remainingCards(minigames[2].vars.deck) + '<br>Open the help menu for details for each of their effects.')");
		deck_icon.attr("onmouseout", "hideTooltip();");
		
	var discard_icon = $(document.createElement("img"));
	
	var number = minigames[2].vars.discard_pile.peek();
	if (number == undefined) {number = "blank"}
		
		discard_icon.attr("src", "images/card_"+number+".png").attr("style", "display:inline;").attr("id", "discard_pile_main").attr("width", "26").attr("style", "position:relative;top:-2px;");
		discard_icon.attr("onmouseover","tooltip(this, 7, 4, 'Discard Pile', 'This discard contains the follow cards:<br>' + remainingCards(minigames[2].vars.discard_pile) + '<br>Open the help menu for details for each of their effects.')");
		discard_icon.attr("onmouseout", "hideTooltip();");
		
	var draw_button = $(document.createElement("span"));
		draw_button.html("+");
		draw_button.attr("Style", "position:relative;top:-17px;font-size: 16px; font-weight: 900; color: black; background-color: #54BEE3; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#0ABAF5, #076787); margin: 1px;");
		draw_button.attr("class", "gambler_button").attr("id","draw_button_main");
		draw_button.attr("onclick", "drawCard(true);");
		
	var discard_button = $(document.createElement("span"));
		discard_button.html("-");
		discard_button.attr("Style", "position:relative;top:-17px;font-size: 16px; font-weight: 900; color: black; background-color: #ff3300; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#F5450A, #872707); margin: 1px;");
		discard_button.attr("class", "gambler_button").attr("id","discard_button_main");
		discard_button.attr("onclick", "discardCard(true);");
		
	var shuffle_button = $(document.createElement("span"));
		shuffle_button.html("S");
		shuffle_button.attr("Style", "position:relative;top:-17px;font-size: 16px; font-weight: 900; color: black; background-color: #FFF700; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#F5F10A, #878707); margin: 1px;");
		shuffle_button.attr("class", "gambler_button").attr("id","shuffle_button_main");
		shuffle_button.attr("onclick", "shuffleDeck(true)");

	var peek_button = $(document.createElement("span"));
		peek_button.html("P");
		peek_button.attr("Style", "position:relative;top:-17px;font-size: 16px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#44F50A, #278707); margin: 1px;");
		peek_button.attr("class", "gambler_button").attr("id","peek_button_main");
		peek_button.attr("onclick", "peek(true)");
	
	gambler_container.append(deck_icon);
	gambler_container.append(discard_icon);
	gambler_container.append(draw_button);
	gambler_container.append(discard_button);
	gambler_container.append(shuffle_button.hide());
	gambler_container.append(peek_button.hide());
	
	if (unlocks[5].unlocked) shuffle_button.show();
	if (unlocks[6].unlocked) peek_button.show();
	
	return gambler_container;
}
/** Creates and returns extra HTML for the bank mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedBank() {
	var bank_container = $(document.createElement("span"));
	
	var investment_container = $(document.createElement("span"));
		investment_container.attr("style", "position:relative");
		
		var investment_icon = $(document.createElement("img"));
		investment_icon.attr("src", "images/bank_investment.png").attr("style", "display:inline;cursor:pointer;").attr("id", "investment_icon_main");
		investment_icon.attr("onclick", "invest(true)").attr("width", "28");
		investment_container.attr("onmouseover", "investTooltip(true)");
		investment_container.attr("onmouseout", "hideTooltip();");
	
	investment_container.append(investment_icon);

	var cash_to_gold_icon = $(document.createElement("img"));
	cash_to_gold_icon.attr("src", "images/bank_cash_to_gold.png").attr("style", "display:inline;cursor:pointer;");
	cash_to_gold_icon.attr("onclick", "cashToGold(true)").attr("id", "cash_to_gold_main").attr("width", "28");
	cash_to_gold_icon.attr("onmouseover","tooltip(this, 6, 6, 'Cash To Gold', 'Buy 1 gold bar for at the cost of <span style=\"color:#ff1e2d;\">-10%</span> production for 1 minute.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')");
	cash_to_gold_icon.attr("onmouseout", "hideTooltip()");
	
	bank_container.append(document.createTextNode("  "))
	
	var gold_to_cash_icon = $(document.createElement("img"));
	gold_to_cash_icon.attr("src", "images/bank_gold_to_cash.png").attr("style", "display:inline;cursor:pointer;").attr("id", "gold_to_cash_main");
	gold_to_cash_icon.attr("onclick", "goldToCash(true)").attr("width", "28");
	gold_to_cash_icon.attr("onmouseover","tooltip(this, 6, 6, 'Gold To Cash', 'Exchange 2 gold bars for a <span style=\"color:#00db0a;\">10%</span> bonus to production for 1 minute.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')");
	gold_to_cash_icon.attr("onmouseout", "hideTooltip()");	
	
	bank_container.append(investment_container);
	bank_container.append(cash_to_gold_icon);
	bank_container.append(gold_to_cash_icon);
		
	return bank_container;
}
/** Creates and returns extra HTML for the research mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedResearch() {
	var research_container = $(document.createElement("span"));
	
	var fullscreen_icon = $(document.createElement("img")).attr("src", "images/fullscreen.png");
		fullscreen_icon.attr("style", "cursor:pointer").attr("id", "open_fullscreen_main").attr("width", "28");
		fullscreen_icon.attr("onclick", "toggleResearchFullScreen();renderResearch()");
	
	research_container.append(fullscreen_icon);
	
	return research_container;
}
/** Creates and returns extra HTML for the bonus mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedBonus() {
	var bonus_container = $(document.createElement("span"));
	
	var bonus_icon = $(document.createElement("img"));
		bonus_icon.attr("id", "bonus_icon_main").attr("width", "28");
		bonus_icon.attr("src", "images/bonus_normal.png").attr("style", "display:inline;cursor:pointer");
		bonus_icon.attr("onclick", "minigames[7].vars.disabled = !minigames[7].vars.disabled;updateBonusIcon()").attr("onmouseover","tooltip(this, 0, 12, 'Halt Production', 'Click to toggle this building&apos;s production of bonuses')").attr("onmouseout", "hideTooltip();");
	
	bonus_container.append(bonus_icon);
	window.setTimeout(updateBonusIcon, 1);
	
	return bonus_container;
}
/** Creates and returns extra HTML for the click mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedClick() {
	var click_container = $(document.createElement("span"));
	
	var edit_button = $(document.createElement("span"));
		edit_button.html("E");
		edit_button.attr("Style", "position:relative;top:5px;font-size: 16px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#44F50A, #278707); margin: 1px;");
		edit_button.attr("class", "gambler_button").attr("id","edit_button_main");
		edit_button.attr("onclick", "editPath()");
		
	var run_button = $(document.createElement("span"));
		run_button.html("R");
		run_button.attr("Style", "position:relative;top:5px;font-size: 16px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#44F50A, #278707); margin: 1px;");
		run_button.attr("class", "gambler_button").attr("id","run_button_main");
		run_button.attr("onclick", "runPath()");
		
	var reset_button = $(document.createElement("span"));
		reset_button.html("C");
		reset_button.attr("Style", "position:relative;top:5px;font-size: 16px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#44F50A, #278707); margin: 1px;");
		reset_button.attr("class", "gambler_button").attr("id","reset_button_main");
		reset_button.attr("onclick", "resetPath()");
		
	click_container.append(edit_button);
	click_container.append(run_button);
	click_container.append(reset_button);
	
	return click_container;
}
/** Creates and returns extra HTML for the computer mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedComputer() {
	var computer_container = $(document.createElement("span"));
	
	var program_1_button = $(document.createElement("span"));
		program_1_button.html("1");
		program_1_button.attr("Style", "position:relative;top:5px;font-size: 16px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#44F50A, #278707); margin: 1px;");
		program_1_button.attr("class", "gambler_button").attr("id","program_1_button_main");
		program_1_button.attr("onclick", "program1();");
		program_1_button.attr("onmouseover","program1Tooltip(this);");
		program_1_button.attr("onmouseout", "hideTooltip();");
		
	var program_2_button = $(document.createElement("span"));
		program_2_button.html("2");
		program_2_button.attr("Style", "position:relative;top:5px;font-size: 16px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#44F50A, #278707); margin: 1px;");
		program_2_button.attr("class", "gambler_button").attr("id","program_2_button_main");
		program_2_button.attr("onclick", "program2();");
		program_2_button.attr("onmouseover","program2Tooltip(this);");
		program_2_button.attr("onmouseout", "hideTooltip();");
		
	var program_3_button = $(document.createElement("span"));
		program_3_button.html("3");
		program_3_button.attr("Style", "position:relative;top:5px;font-size: 16px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:3px; padding-right: 6px; padding-left: 6px;background-image: linear-gradient(#44F50A, #278707); margin: 1px;");
		program_3_button.attr("class", "gambler_button").attr("id","program_3_button_main");
		program_3_button.attr("onclick", "program3();");
		program_3_button.attr("onmouseover","program3Tooltip(this);");
		program_3_button.attr("onmouseout", "hideTooltip();");
		
	computer_container.append(program_1_button);
	computer_container.append(program_2_button);
	computer_container.append(program_3_button);
	
	return computer_container;
}
/** Creates and returns extra HTML for the acceleration mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedAccel() {
	var accel_container = $(document.createElement("span"));
	
	var accel_price_icon = $(document.createElement("img"));
	accel_price_icon.attr("src", "images/accel_building.png").attr("style", "display:inline;cursor:pointer").attr("id", "accel_price_main");
	accel_price_icon.attr("onclick", "accelTarget(0);").attr("onmouseover","tooltip(this, 0, 17, 'Accelerated Construction', 'Click to toggle a bonus that decreases the cost of buildings by 1% for each other building bought in the last 30 seconds (max 15%).<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')").attr("onmouseout", "hideTooltip();").attr("width", "28");
	
	accel_container.append(accel_price_icon);
	
	var accel_click_icon = $(document.createElement("img"));
	accel_click_icon.attr("src", "images/accel_click.png").attr("style", "display:inline;cursor:pointer").attr("id", "accel_click_main");
	accel_click_icon.attr("onclick", "accelTarget(1)").attr("onmouseover","tooltip(this, 0, 17, 'Accelerated Clicking', 'Click to toggle a bonus that increases the value from clicking by 0.1% per click for 30 seconds (max 15%).<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')").attr("onmouseout", "hideTooltip();").attr("width", "28");
	
	accel_container.append(accel_click_icon);
	
	var accel_click_production = $(document.createElement("img"));
	accel_click_production.attr("src", "images/accel_production.png").attr("style", "display:inline;cursor:pointer").attr("id", "accel_production_main");;
	accel_click_production.attr("onclick", "accelTarget(2);").attr("onmouseover","tooltip(this, 0, 17, 'Accelerated Production', 'Click to toggle a bonus that increases production by 5% for 30 seconds each time an upgrade is bought (max 15%).<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')").attr("onmouseout", "hideTooltip();").attr("width", "28");
	
	accel_container.append(accel_click_production);
		
	accel_container.append(accel_price_icon);
	accel_container.append(accel_click_icon);
	accel_container.append(accel_click_production);
	
	window.setTimeout(function () {
		var target = minigames[12].vars.accel_target;
		
		$("#accel_price_main").attr("style", "display:inline;cursor:pointer;opacity:0.6");
		$("#accel_click_main").attr("style", "display:inline;cursor:pointer;opacity:0.6");
		$("#accel_production_main").attr("style", "display:inline;cursor:pointer;opacity:0.6");
		
		if (target == 0) {$("#accel_price_main").attr("style", "display:inline;cursor:pointer;opacity:1");}
		if (target == 1) {$("#accel_click_main").attr("style", "display:inline;cursor:pointer;opacity:1");}
		if (target == 2) {$("#accel_production_main").attr("style", "display:inline;cursor:pointer;opacity:1");}
	}, 1)
	
	return accel_container;
}
/** Creates and returns extra HTML for the warp mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedWarp() {
	var warp_container = $(document.createElement("span"));
	
	var warp_icon = $(document.createElement("img"));
		warp_icon.attr("src", "images/building_icon_warp.png").attr("style", "display:inline;cursor:pointer").attr("id", "warp_display_main");
		warp_icon.attr("onclick", "warp(true);").attr("onmouseover","tooltip(this, 0, 12, 'Warp Forward', 'Instantly grants 30 seconds worth of production <span style=\"color:#00db0a;\">('+fancyNumber(PRODUCTION * 30)+')</span>.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')").attr("onmouseout", "hideTooltip();").attr("width", "28");
		
	warp_container.append(warp_icon);
	
	return warp_container;
}
/** Creates and returns extra HTML for the temporal mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedTemporal() {
	var temporal_container = $(document.createElement("span"));
	
	var temporal_bottle = $(document.createElement("img"));
		temporal_bottle.attr("src", "images/temporal_bottle.png").attr("class", "temporal").attr("id", "temporal_0_main").attr("width", "64");
		temporal_bottle.attr("onclick", "toggleTemporal(0);");
		temporal_bottle.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Time in a bottle', 'Toggle to have time run at 1% of its normal rate, and have 1.2 seconds worth of time granted each real second.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')");
		temporal_bottle.attr("onmouseout", "hideTooltip()").attr("width", "28");		
		
	var temporal_fast_forward = $(document.createElement("img"));
		temporal_fast_forward.attr("src", "images/temporal_fast_forward.png").attr("class", "temporal").attr("id", "temporal_1_main").attr("width", "64");
		temporal_fast_forward.attr("onclick", "toggleTemporal(1);");
		temporal_fast_forward.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Fast Forward', 'Toggle to increase production by 15%.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')");
		temporal_fast_forward.attr("onmouseout", "hideTooltip()").attr("width", "28");		
		
	var temporal_quick_clicks = $(document.createElement("img"));
		temporal_quick_clicks.attr("src", "images/temporal_click.png").attr("class", "temporal").attr("id", "temporal_2_main").attr("width", "64");
		temporal_quick_clicks.attr("onclick", "toggleTemporal(2);");
		temporal_quick_clicks.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Quick Clicks', 'Toggle to increase the value from clicking by 10% for each increment of game speed.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')");
		temporal_quick_clicks.attr("onmouseout", "hideTooltip()").attr("width", "28");	
		
	var temporal_lethargy = $(document.createElement("img"));
		temporal_lethargy.attr("src", "images/temporal_lethargy.png").attr("class", "temporal").attr("id", "temporal_3_main").attr("width", "64");
		temporal_lethargy.attr("onclick", "toggleTemporal(3);");
		temporal_lethargy.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Lethargy', 'Toggle to have temporary effects last 10% longer for each increment of bonus game speed.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_4.toUpperCase() + ' </span>')");
		temporal_lethargy.attr("onmouseout", "hideTooltip()").attr("width", "28");		
		
	var temporal_endless = $(document.createElement("img"));
		temporal_endless.attr("src", "images/temporal_endless.png").attr("class", "temporal").attr("id", "temporal_4_main").attr("width", "64");
		temporal_endless.attr("onclick", "toggleTemporal(4);");
		temporal_endless.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Endless Expedience', 'Toggle to gain one second worth of extra time every 7 seconds.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_5.toUpperCase() + ' </span>')");
		temporal_endless.attr("onmouseout", "hideTooltip()").attr("width", "28");		
		
	var temporal_experience = $(document.createElement("img"));
		temporal_experience.attr("src", "images/temporal_experience.png").attr("class", "temporal").attr("id", "temporal_5_main").attr("width", "64");
		temporal_experience.attr("onclick", "toggleTemporal(5);");
		temporal_experience.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Quick Experience', 'Toggle to double the rate that assistants gain progress towards the next level.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_6.toUpperCase() + ' </span>')");
		temporal_experience.attr("onmouseout", "hideTooltip()").attr("width", "28");
		
	temporal_container.append(temporal_bottle);
	temporal_container.append(temporal_fast_forward);
	temporal_container.append(temporal_quick_clicks);
	temporal_container.append(temporal_lethargy);
	temporal_container.append(temporal_endless);
	temporal_container.append(temporal_experience);
	
	window.setTimeout(updateTemporal, 1);
	
	return temporal_container;
}
/** Creates and returns extra HTML for the political mini-menu.. 
 * @return {element} - The extra HTML.
 */
function switchedPolitical() {
	var political_container = $(document.createElement("span"));
	
	var decree_entertainment = $(document.createElement("img"));
		decree_entertainment.attr("src", "images/political_decree_entertainment.png").attr("class", "decree").attr("id", "decree_0_main").attr("width", "28");
		decree_entertainment.attr("onclick", "decree(0, true);");
		decree_entertainment.attr("onmouseover", "tooltip('#'+this.id, 0, 30, 'Forced Entertainment', 'Permanently increases maximum morale by <span style=\"color:#ffd21f;\">1</span>. <br><span>Cost: 100% of Maximum Morale</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')");
		decree_entertainment.attr("onmouseout", "hideTooltip()");		
		
	var decree_collection = $(document.createElement("img"));
		decree_collection.attr("src", "images/political_decree_collection.png").attr("class", "decree").attr("id", "decree_1_main").attr("width", "28");
		decree_collection.attr("onclick", "decree(1, true);");
		decree_collection.attr("onmouseover", "tooltip('#'+this.id, 0, 30, 'Early Collection', 'Instantly grants <span style=\"color:#ffd21f;\">10</span> seconds worth of production. After a 2 second delay production will be halted for 8 seconds<br><span>Cost: 55 Morale</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')");
		decree_collection.attr("onmouseout", "hideTooltip()");		
		
	var decree_petty = $(document.createElement("img"));
		decree_petty.attr("src", "images/political_decree_petty.png").attr("class", "decree").attr("id", "decree_2_main").attr("width", "28");
		decree_petty.attr("onclick", "decree(2, true);");
		decree_petty.attr("onmouseover", "tooltip('#'+this.id, 0, 30, 'Petty Decree', 'Increases production by a stacking <span style=\"color:#ffd21f;\">1%</span> for 3 seconds<br><span>Cost: 15 Morale</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')");
		decree_petty.attr("onmouseout", "hideTooltip()");		
		
	var decree_help = $(document.createElement("img"));
		decree_help.attr("src", "images/political_decree_help.png").attr("class", "decree").attr("id", "decree_3_main").attr("width", "28");
		decree_help.attr("onclick", "decree(3, true);");
		decree_help.attr("onmouseover", "tooltip('#'+this.id, 0, 30, 'Unwanted Help', 'Increases production by <span style=\"color:#ffd21f;\">25%</span> for 60 seconds<br><span>Cost: 110 Morale</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_4.toUpperCase() + ' </span>')");
		decree_help.attr("onmouseout", "hideTooltip()");
		
	political_container.append(decree_entertainment);
	political_container.append(decree_collection);
	political_container.append(decree_petty);
	political_container.append(decree_help);
	
	return political_container;
}
/** Creates and returns the stats icon for the specified building's mini-menu.. 
 * @param {int} id - The id of the building.
 * @return {element} - The stats icon HTML.
 */
function switchedStats(id) {
	var stats = $(document.createElement("img"));
    stats.attr("src", "images/icon_stats.png");
    stats.attr("class", "switcher_icon");
    stats.attr("style", "cursor:pointer;");
	stats.attr("onclick", "minigames["+id+"].createDetails();$('#detail_container').children(':nth-child(3)').children(':nth-child(2)').show();MENU_CLOSE = false;$('#detail_container').attr('onclick', 'MENU_CLOSE = false;');")
    stats.attr("onmouseover","tooltip(this, -0, -0, '"+buildings[id].display_name+"'+' Stats', calculateStats("+id+"))");
    stats.attr("onmouseout", "hideTooltip();");
	
	return stats;
}
/** Creates and returns the help icon for the specified building's mini-menu.. 
 * @param {int} id - The id of the building.
 * @return {element} - The help icon HTML.
 */
function switchedHelp(id) {
    var help = $(document.createElement("img"));
    help.attr("src", "images/icon_info.png");
    help.attr("class", "switcher_icon");
    help.attr("style", "cursor:pointer");
    help.attr("onmouseover","tooltip(this, 1, -0, '"+buildings[id].display_name+"'+' Help', 'Click to view detailed information about this building, including stats, help, and upgrades.');MENU_CLOSE = false;");
    help.attr("onmouseout", "hideTooltip();");
    help.attr("onclick", "minigames["+id+"].createDetails();MENU_CLOSE = false;$('#detail_container').attr('onclick', 'MENU_CLOSE = false;');")    
	
	return help;
}
/** Updates the storage bars for each building's mini-menu. */
function updateStorageBars() {
	for (var i = 0; i < buildings.length; i++) {
		if (buildings[i].switched) {switches[i].updateStorageBar(buildings[i].name)}
	}
}