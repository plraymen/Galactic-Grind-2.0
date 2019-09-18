var challenges = [];
var CURRENT_CHALLENGE = -1;

function Challenge(name, description, tab_description, credits, x, y) {
	this.name = name;
	this.credits = credits;
	this.description = description;
	this.tab_description = tab_description;
	this.displayed = false;
	this.x = -x * 48;
	this.y = -y * 48;
	
	this.unlocked = false;
	this.running = false;
}
function startChallenge(i, force) {
	if (!challenges[i].running && (!challenges[i].unlocked || force)) {
		var temp_challenges = challenges;
		MAIN_SAVE = generateSave();
		MAIN_SAVE.MAIN_SAVE = null;
		wipeSave();
		settings.skip_tutorial = true;
		if (current_tutorial) {current_tutorial.end();}
		challenges = temp_challenges
		challenges[i].running = true;
		CURRENT_CHALLENGE = i;
		updateSubgameButtons();
		
		//Free Buildings
		for (var j = 0; j < 7; j++) {
			if (challenges[j] && challenges[j].unlocked) {
				buildings[j].count += 10;
				buildings[j].free_count += 10;
				if (j == 6) {
					buildings[j].count += 10;
					buildings[j].free_count += 10;
				}
				buildings[j].unlocked = true;
				TIER_1_COUNT += 1;
				testTierTwo();
				updateUnlocks();
				$("#tier_cost_display").html(fancyNumber(tierPrice(buildings[j].tier)));
				
				changeTier(buildings[j].tier);
				buildings[j].unlockUpgrades();
			}
		}
		
		if (!challenges[i].unlocked && i < 7) {
			buildings[i].count = 1;
			buildings[i].unlocked = true;
			TIER_1_COUNT += 1;
			testTierTwo();
			updateUnlocks();
			$("#tier_cost_display").html(fancyNumber(tierPrice(buildings[i].tier)));
			
			changeTier(buildings[i].tier);
		}
		
		UPDATE_BUILDINGS = true;
		
		if (CURRENT_CHALLENGE == 1) {minigames[1].vars.mine_time = 1;}
		if (CURRENT_CHALLENGE == 7) {CREDITS += 1}
		if (challenges[1].unlocked) {minigames[1].vars.gold += 100;}
		if (challenges[5].unlocked) {minigames[5].vars.research_points += 60;}
		
		save(true);
		window.setTimeout(function () {$("#offline_popup").hide();$("#challenge_background").hide()}, 3);
	} else {
		if (challenges[i].running) {popupText("Challenge In Progress", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);}
		else if (challenges[i].unlocked) {popupText("Challenge Complete", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);}
	}
}
function endChallenge(i) {
	if (challenges[i].running) {
		var temp_unlocked = challenges[i].unlocked
		challenges[i].running = false;
		if ((stats.credits_earned > challenges[CURRENT_CHALLENGE].credits || CREDITS > challenges[CURRENT_CHALLENGE].credits)) {challenges[i].unlocked = true;popupText(challenges[i].name + " Completed", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);}
		else {popupText("Ended Early", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);}
		
		var temp_challenges = challenges;
		CHALLENGE_SAVE = true;
		
		importSave();
		
		CHALLENGE_SAVE = false;
		
		challenges = temp_challenges;
		CURRENT_CHALLENGE = -1;
		updateSubgameButtons();
		
		if (challenges[i].unlocked && !temp_unlocked) {buildings[i].free_count += 10; buildings[i].count += 10; buildings[i].unlockUpgrades()}
		if (challenges[1].unlocked && !temp_unlocked && i == 1) {minigames[1].vars.gold += 100;}
		if (challenges[5].unlocked && !temp_unlocked && i == 5) {minigames[5].vars.research_points += 60;}
		if (challenges[6].unlocked && !temp_unlocked && i == 6) {buildings[i].free_count += 10; buildings[i].count += 10;}
		if (challenges[4].unlocked && !temp_unlocked && i == 4) {minigames[4].vars.investment_time = 0;minigames[4].vars.investing = false;}
		
		save();
		UPDATE_BUILDINGS = true;
		
		window.setTimeout(function () {$('#challenge_popup').remove()}, 10);
	}
}


function initChallenges() {
	var cultist_challenge = new Challenge("Bloody Mess", "During this challenge blood will be generated at 10 times the normal rate, and the challenge will be completed once 1 quintillion credits is reached.<br><br>Completion of this challenge will:<br>- Grant 10 free cultists for this run and every future run (This does not increase the cost of cultists).<br>- Increase maximum blood by 30 for every run.<br>- Increase production by 0.05% of the absolute value of blood stored.<br>- Grant  the ability to sacrifice 10 cultists to refill blood.", "This challenge:<br>- Grants 10 free cultists at the start of every new run (This does not increase the cost of cultists).<br>- Increases maximum blood 30.<br>- Increases production by 0.05% of the absolute value of blood stored.<br><br>Click to sacrifice 10 cultists to refill blood.", 1000000000000000000, 0, 31);
	
	var mine_challenge = new Challenge("Alchemy", "During this challenge production will be increased by 1% for every gold bar stored, and gold bars will be generated in a number of seconds equal to the number of gold bars owned.<br><br>Completion of this challenge will:<br>- Grant 10 free mines for this run and every future run (This does not increase the cost of mines).<br>- Instantly Grants 100 gold bars, and at the start of every future run.<br>- Increase production by 10%.<br>- Grants the ability to sacrifice 10 mines to increase production by 20% for 2 minutes and 30 seconds.", "This challenge:<br>- Grants 10 free mines at the start of every new run (This does not increase the cost of mines).<br>- Grants 100 gold bars at the start of every run.<br>- Increases production by 10%.<br><br>Click to sacrifice 10 mines to increase production by 20% for 2 minutes and 30 seconds.", 1000000000000000000, 1, 31);
	
	var gambler_challenge = new Challenge("Gambling Addiction", "During this challenge draws will be generated 3 times as fast and all negative effects will be removed from the deck.<br><br>Completion of this challenge will:<br>- Grant 10 free gamblers for this run and every future run (This does not increase the cost of gamblers).<br>- Cause peeks to generate 4 times faster.<br>- Increase production by 1% for each draw stored.<br>- Grants the ability to sacrifice 10 gamblers to refill draws, discards, and peeks.", "This challenge:<br>- Grants 10 free gamblers at the start of every new run (This does not increase the cost of gamblers).<br>- Quadrulples the rate that peeks are generated.<br>- Increases production by 1% for each draw stored.<br><br>Click to sacrifice 10 gamblers to refill draws, discards, and peeks.", 1000000000000000000, 2, 31);
	
	var power_challenge = new Challenge("Power Corruption", "During this challenge power will not decrease, and production is increased by 25%.<br><br>Completion of this challenge will:<br>- Grant 10 free power plants for this run and every future run (This does not increase the cost of power plants).<br>- Increases power generation by 0.3 per second.<br>- Increases production by 10%.<br>- Grants the ability to sacrifice 10 power plants to autoclick 2 times a second for 2 minutes and 30 seconds.", "This challenge:<br>- Grants 10 free power plants at the start of every new run (This does not increase the cost of power plants).<br>- Increases power generation by 0.3 per second.<br>- Increases production by 10%.<br><br>Click to sacrifice 10 power plants to autoclick 2 times a second for 2 minutes and 30 seconds.", 1000000000000000000, 3, 31);
	
	var bank_challenge = new Challenge("Nouveau Riche", "During this challenge investments take 25 seconds to complete.<br><br>Completion of this challenge will:<br>- Grant 10 free banks for this run and every future run (This does not increase the cost of banks).<br>- Decrease the time it takes for an investment to return by 30 seconds.<br>- Increases production by 10%.<br>- Grants the ability to sacrifice 10 banks to return the current investment.", "This challenge:<br>- Grants 10 free banks at the start of every new run (This does not increase the cost of banks).<br>- Decreases the time it takes for an investment to return by 30 seconds.<br>- Increases production by 10%.<br><br>Click to sacrifice 10 banks to return the current investment.", 1000000000000000000, 4, 31);
	
	var research_challenge = new Challenge("Thirst For Knowledge", "During this challenge research points take 1 second to generate.<br><br>Completion of this challenge will:<br>- Grant 10 free research centers for this run and every future run (This does not increase the cost of research centers).<br>- Instantly Grants 60 research points, and at the start of every future run.<br>- Increases production by 10%.<br>- Grants the ability to sacrifice 10 research centers to gain 2 minutes worth of extra time.", "This challenge:<br>- Grants 10 free research centers at the start of every new run (This does not increase the cost of research centers).<br>- Grants 60 research points at the start of every run.<br>- Increases production by 10%.<br><br>Click to sacrifice 10 research centers to gain 2 minutes worth of extra time.", 1000000000000000000, 5, 31);
	
	var factory_challenge = new Challenge("Assembly Line", "During this challenge each factory increases the production of all factories by a stacking 3%.<br><br>Completion of this challenge will:<br>- Grant 20 factories for this run and every future run (This does not increase the cost of factories).<br>- Increases production by 15%.<br>- Grants the ability to sacrifice 10 factories to grant 2 of each other tier one building for free.", "This challenge:<br>- Grants 10 free factories at the start of every new run (This does not increase the cost of factories).<br>- Increases production by 15%.<br><br>Click to sacrifice 10 mines to gain 2 of each other tier 1 building.", 1000000000000000000, 6, 31);	
	
	var click_challenge = new Challenge("Clicking Spree", "During this challenge one second worth of production will be generated each click, but normal idle production will not occur.<br><br>Completion of this challenge will:<br>- Increase autoclicks by 1 every 2 seconds<br>- Increases value from clicking by 1.5% of production.", "", 1000000000000000000000, 7, 31);
	
	var temporal_challenge = new Challenge("Temporal Challenge", "During this challenge game speed is increased by 25 times, and production is reduced by 25 times.<br><br>Completion of this challenge will:<br>- Increase game speed by 5%<br>- Increase maximum game speed by 1.", "", 1000000000000000000000, 8, 31);

	challenges.push(cultist_challenge);
	challenges.push(mine_challenge);
	challenges.push(gambler_challenge);
	challenges.push(power_challenge);
	challenges.push(bank_challenge);
	challenges.push(research_challenge);
	challenges.push(factory_challenge);
	challenges.push(click_challenge);
	challenges.push(temporal_challenge);
}

function openChallenges() {
	$("#challenge_background").remove();
		
	var background = $(document.createElement("div"));
		background.attr("class", "challenge_background");
		background.attr("id", "challenge_background");
		background.css("border", "3px solid black");
		background.css("border-radius", "10px");
		background.css("text-align", "center");
		background.on("click", function () {MENU_CLOSE = false;});
		
	var close_button = $(document.createElement("img"));
		close_button.attr("src", "images/button_x.png").attr("height", "48").attr("width", "48");
		close_button.attr("onclick", "$('#challenge_background').remove();");
		close_button.attr("style", "position:absolute;right:0px;top:0px;cursor:pointer");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
		
	var title = $(document.createElement("div"));
		title.html("Challenges");
		title.css("font-size", "180%");
		title.attr("class", "detail_title");
		
	var content = $(document.createElement("center"));
	content.attr("id", "challenge_content");
	content.css("font-weight", "bold");
	content.css("text-align", "center;");
	content.html("When a challenge is activated all non-challenge progress will be temporarily reset. Once the challenge is over all progress is restored.<br><br>")
	
	for (var i = 0; i < challenges.length; i++) {
		content.append(htmlChallenge(i));
		content.append($(document.createTextNode(" ")));
	}

	background.append(close_button);
	background.append(title);
	background.append(document.createElement("br"));
	background.append(document.createElement("br"));
	background.append(content);
	background.append(document.createElement("br"));
	background.append(document.createElement("br"));
	
	$(document.body).append(background);
}

function htmlChallenge(id) {
	var unlocked_text = "";
	if (challenges[id].unlocked) {
		unlocked_text = "<br><br>CHALLENGE COMPLETED<br>Right click to try this challenge again"
	}
	
	var challenge = $(document.createElement("div"));
	challenge.attr("style", "position:relative;display:inline-block;cursor:pointer;height:48px;width:48px;background:url(images/upgrade_sheet.png) " + challenges[id].x + "px " + challenges[id].y + "px;");
	challenge.attr("onmouseover", "tooltip(this, "+ (challenges[id].x / -48) +", "+ (challenges[id].y / -48) +", '"+challenges[id].name+"', '"+challenges[id].description + unlocked_text + " <br><br>Completes at " + fancyNumber(challenges[id].credits) +" credits')");
	challenge.attr("onmouseleave", "hideTooltip();");
	challenge.attr("onclick", "startChallenge("+id+");");
	challenge.attr("oncontextmenu", "startChallenge("+id+", true);");
	
	if (challenges[id].unlocked) {
		var challenge_check = $(document.createElement("div"));
		challenge_check.html("&#10004;");
		challenge_check.attr("style", "position:absolute;bottom:-2px;right:4px;color:#42ff49;font-weight:800;font-size:22px;");
		challenge.append(challenge_check);
	}
	
	return challenge;
}
function updateCurrentChallenge() {
	if (CURRENT_CHALLENGE != -1) {
		$("#challenge_display").attr("style", "cursor:pointer;height:48px;width:48px;background:url(images/upgrade_sheet.png) " + challenges[CURRENT_CHALLENGE].x + "px " + challenges[CURRENT_CHALLENGE].y + "px;float:left;");
		$("#challenge_display").attr("onmouseover", "tooltip(this, "+ (challenges[CURRENT_CHALLENGE].x / -48) +", "+ (challenges[CURRENT_CHALLENGE].y / -48) +", '"+challenges[CURRENT_CHALLENGE].name+"', '"+challenges[CURRENT_CHALLENGE].description + "<br><br>Right click to end this challenge (Note: " +fancyNumber(challenges[CURRENT_CHALLENGE].credits) + " credits are required to complete this challenge)" + "')");
	}
}

function challengeSacrifice(building_id) {
	switch (building_id) {
		case 0:
			if (buildings[building_id].count > 10 && minigames[0].vars.blood < minigames[0].vars.max_blood) {
				buildings[building_id].free_count -= 10;
				buildings[building_id].count -= 10;
				
				minigames[0].vars.blood = minigames[0].vars.max_blood;
				UPDATE_BUILDINGS = true;
				popupText(buildings[building_id].display_name + " Sacrificed", $("#" + buildings[building_id].name + "_challenge").offset().left + $("#" + buildings[building_id].name + "_challenge").width()/2, $("#" + buildings[building_id].name + "_challenge").offset().top);
			}
			break;
		case 1:
			if (buildings[building_id].count > 10) {
				buildings[building_id].free_count -= 10;
				buildings[building_id].count -= 10;
				
				buffs[30].activate(150);

				UPDATE_BUILDINGS = true;
				popupText(buildings[building_id].display_name + " Sacrificed", $("#" + buildings[building_id].name + "_challenge").offset().left + $("#" + buildings[building_id].name + "_challenge").width()/2, $("#" + buildings[building_id].name + "_challenge").offset().top);
			}
			break;		
		case 2:
			var gambler = minigames[2].vars;
			if (buildings[building_id].count > 10 && (gambler.draw_charges != gambler.draw_charges_max || gambler.discard_charges != gambler.discard_charges_max || gambler.peek_charges != gambler.peek_charges_max)) {
				buildings[building_id].free_count -= 10;
				buildings[building_id].count -= 10;
				
				gambler.draw_charges = gambler.draw_charges_max;
				gambler.discard_charges = gambler.discard_charges_max;
				gambler.peek_charges = gambler.peek_charges_max;

				UPDATE_BUILDINGS = true;
				popupText(buildings[building_id].display_name + " Sacrificed", $("#" + buildings[building_id].name + "_challenge").offset().left + $("#" + buildings[building_id].name + "_challenge").width()/2, $("#" + buildings[building_id].name + "_challenge").offset().top);
			}
			break;
		case 3:
			if (buildings[building_id].count > 10) {
				buildings[building_id].free_count -= 10;
				buildings[building_id].count -= 10;
				
				buffs[31].activate(150);

				UPDATE_BUILDINGS = true;
				popupText(buildings[building_id].display_name + " Sacrificed", $("#" + buildings[building_id].name + "_challenge").offset().left + $("#" + buildings[building_id].name + "_challenge").width()/2, $("#" + buildings[building_id].name + "_challenge").offset().top);
			}
			break;
		case 4:
			if (buildings[building_id].count > 10 && minigames[4].vars.investing) {
				buildings[building_id].free_count -= 10;
				buildings[building_id].count -= 10;
				
				minigames[4].vars.investment_time = -1;

				UPDATE_BUILDINGS = true;
				popupText(buildings[building_id].display_name + " Sacrificed", $("#" + buildings[building_id].name + "_challenge").offset().left + $("#" + buildings[building_id].name + "_challenge").width()/2, $("#" + buildings[building_id].name + "_challenge").offset().top);
			}
			break;
		case 5:
			if (buildings[building_id].count > 10) {
				buildings[building_id].free_count -= 10;
				buildings[building_id].count -= 10;
				
				addClockTicks(120)

				UPDATE_BUILDINGS = true;
				popupText(buildings[building_id].display_name + " Sacrificed", $("#" + buildings[building_id].name + "_challenge").offset().left + $("#" + buildings[building_id].name + "_challenge").width()/2, $("#" + buildings[building_id].name + "_challenge").offset().top);
			}
			break;		
		case 6:
			if (buildings[building_id].count > 10) {
				buildings[building_id].free_count -= 10;
				buildings[building_id].count -= 10;
				
				for (var i = 0; i < 6; i++) {
					if (buildings[i].unlocked) {
						buildings[i].count += 2;
						buildings[i].free_count += 2;
						buildings[i].unlockUpgrades()
					}
				}

				UPDATE_BUILDINGS = true;
				popupText(buildings[building_id].display_name + " Sacrificed", $("#" + buildings[building_id].name + "_challenge").offset().left + $("#" + buildings[building_id].name + "_challenge").width()/2, $("#" + buildings[building_id].name + "_challenge").offset().top);
			}
			break;		
	}
}

function challengeCompletePopup() {
	var challenge_popup = $(document.createElement("div"));
	challenge_popup.attr("id", "challenge_popup");
	challenge_popup.attr("style", "z-index:1001");
	challenge_popup.attr("onclick", "MENU_CLOSE = false;");
		
	var challenge_center = $(document.createElement("center"));
	challenge_popup.append(challenge_center);
		var text_span = $(document.createElement("span"));
		text_span.attr("style", "font-size:20px");
		text_span.html("You have completed this challenge, would you like to end now or keep going? Note: there is no reward for continuing, and you can end at any time by right clicking the challenge in the top left.");
		
		var end_button = $(document.createElement("button"));
		end_button.attr("onclick", "$('#challenge_popup').remove();endChallenge(" + CURRENT_CHALLENGE + ")");
		end_button.attr("type", "button");
		end_button.attr("class", "basic_button");
		end_button.html("End");
		
		var continue_button = $(document.createElement("button"));
		continue_button.attr("onclick", "$('#challenge_popup').remove()");
		continue_button.attr("type", "button");
		continue_button.attr("class", "basic_button");
		continue_button.html("Continue");
		
	challenge_center.append(text_span);
	challenge_center.append(document.createElement("br"));
	challenge_center.append(document.createElement("br"));
	challenge_center.append(end_button);
	challenge_center.append(document.createTextNode("  "));
	challenge_center.append(continue_button);
	challenge_popup.append(challenge_center);
	
	$("body").append(challenge_popup);
}
function testChallengeComplete() {
	if (CURRENT_CHALLENGE != -1 && !challenges[CURRENT_CHALLENGE].displayed && (stats.credits_earned > challenges[CURRENT_CHALLENGE].credits || CREDITS > challenges[CURRENT_CHALLENGE].credits)) {
		challenges[CURRENT_CHALLENGE].displayed = true;
		challengeCompletePopup();
	}
}