/**
 * @fileOverview Handles soft resets.
 */

//Global array to store karma upgrades
var karma_upgrades = [];
//Global object to store canvas data for the karma upgrade tree
var karma_tree = {
	camera: {
		x: -220,
		y: -150,
		start_x: 0,
		start_y: 0,
		pan_x: 0,
		pan_y: 0,
	},
	context: 0,
}

/** Resets most aspects of the game and grants the player an appropriate number of karma points. */
function softReset() {
	var temp_spent_karma_points = SPENT_KARMA_POINTS;
	var temp_karma_points = FUTURE_KARMA_POINTS;
	var temp_research_stockpile = minigames[5].vars.research_tree[24].bought;
	var temp_karma_upgrades = karma_upgrades;
	var temp_stats = stats;
	var temp_subgames = subgames;
	var temp_minigames = minigames;
	var temp_achievements = achievements;
	var temp_challenges = challenges;
	var temp_challenge_unlocked = CHALLENGES_UNLOCKED;
	var temp_current_challenge = CURRENT_CHALLENGE;
	var temp_switcher = SWITCHER;
	var zen_assistant = assistants[4];
	var corrupt_assistant = assistants[5];
	var temp_calm = calm;
	var temp_tutorial = tutorial_list;
	var temp_corrupt_bonus = corrupt_bonus;
	var programs_ran = minigames[11].vars.programs_ran;
	
	var temp_levels = [];
	var temp_xp = [];
	var temp_next_xp = [];
	for (var i = 0; i < assistants.length; i++) {
		temp_levels[i] = assistants[i].level;
		temp_xp[i] = assistants[i].xp;
		temp_next_xp[i] = assistants[i].next_xp;
	}
	
	wipeSave(true);
	save();
	
	var research = minigames[5];
	var computer = minigames[11];
	
	KARMA_POINTS = temp_karma_points;
	SWITCHER = temp_switcher;
	
	achievements = temp_achievements;
	minigames = temp_minigames;
	
	minigames[5] = research;
	minigames[5].vars.research_points += temp_research_stockpile * 10;
	minigames[11] = computer;
	minigames[11].vars.programs_ran = programs_ran;
	buildings[11].stats["Programs Ran"] = programs_ran;
	
	//Resets most mini-game currencies
	minigames[0].vars.blood = minigames[0].vars.max_blood;
	minigames[1].vars.gold = 0;
	minigames[2].vars.draw_charges = minigames[2].vars.draw_charges_max;
	minigames[2].vars.deck = [7, 1, 3 ,4, 2, 5, 6, 0];
	minigames[2].vars.discard_pile = [0];
	minigames[3].vars.power = minigames[3].vars.max_power;
	minigames[4].vars.investing = false;minigames[4].vars.investment_time = 300
	minigames[7].vars.bonus_time = 90;
	minigames[8].vars.stored_clicks = minigames[8].vars.max_clicks;
	minigames[9].vars.target_buff = null;
	minigames[10].vars.alien_power = minigames[10].vars.max_power;
	minigames[12].vars.accel_target = -1;
	minigames[13].vars.flux_time = 1800;
	minigames[14].vars.clone_charges = 1;minigames[14].vars.clone_targets = [];minigames[14].vars.clone_times = [];
	minigames[15].vars.epiphany_time = 300;minigames[15].vars.epiphany_target = -1;
	minigames[16].vars.package_time = 300;
	minigames[17].vars.warp_charges = 3;minigames[17].vars.warp_time = 180;
	minigames[18].vars.max_production = 0;
	minigames[19].vars.active_effects = [];
	
	
	//Loads Levels
	for (var i = 0; i < temp_levels.length; i++) {
		assistants[i].level = temp_levels[i];
		assistants[i].xp = temp_xp[i];
		assistants[i].next_xp = temp_next_xp[i];
	}
	
	assistants[4] = zen_assistant;
	assistants[5] = corrupt_assistant;
		
	stats = temp_stats;
	subgames = temp_subgames;
	challenges = temp_challenges;
	karma_upgrades = temp_karma_upgrades;
	CHALLENGES_UNLOCKED = temp_challenge_unlocked;
	CURRENT_CHALLENGE = temp_current_challenge;
	SPENT_KARMA_POINTS = temp_spent_karma_points;
	RESET_UNLOCKED = true;
	calm = temp_calm;
	corrupt_bonus = temp_corrupt_bonus;
	tutorial_list = temp_tutorial;
	
	//Free Buildings
	for (var i = 0; i < 7; i++) {
		if (karma_upgrades[i+31].bought) {
			buildings[i].count += 5;
			buildings[i].free_count += 5;
		
			buildings[i].unlocked = true;
			TIER_1_COUNT += 1;
			testTierTwo();
			updateUnlocks();
			$("#tier_cost_display").html(fancyNumber(tierPrice(buildings[i].tier)));
			
			changeTier(buildings[i].tier);
			buildings[i].unlockUpgrades();
		}
		
		if (challenges[i] && challenges[i].unlocked) {
			buildings[i].count += 10;
			buildings[i].free_count += 10;
			if (i == 6) {
				buildings[i].count += 10;
				buildings[i].free_count += 10;
			}
			buildings[i].unlocked = true;
			TIER_1_COUNT += 1;
			testTierTwo();
			updateUnlocks();
			$("#tier_cost_display").html(fancyNumber(tierPrice(buildings[i].tier)));
			
			changeTier(buildings[i].tier);
			buildings[i].unlockUpgrades();
		}
	}
	
	if (challenges[1].unlocked) {minigames[1].vars.gold += 100;}
	if (challenges[5].unlocked) {minigames[5].vars.research_points += 60;}
	
	if (karma_upgrades[0].bought) {addClockTicks(120);}
	if (karma_upgrades[1].bought) {addClockTicks(120);}
	if (karma_upgrades[7].bought) {addClockTicks(150);}
	if (karma_upgrades[8].bought) {addClockTicks(300);}

	minigames[1].vars.stored_ids = [];
	
	updateSubgameButtons();
	testAchievementUpgrades();
	
	UPDATE_BUILDINGS = true;
	UPDATE_UPGRADES = true;
	save();
	
	window.setTimeout(function () {$("#offline_popup").hide();}, 10);
}
/** Opens the soft reset menu. */
function openSoftReset() {
	$("#soft_reset_background").remove();
		
	var background = $(document.createElement("div"));
		background.attr("class", "soft_reset_background");
		background.attr("id", "soft_reset_background");
		background.css("border", "3px solid black");
		background.css("border-radius", "10px");
		background.css("text-align", "center");
		background.on("click", function () {MENU_CLOSE = false;});
		
	var close_button = $(document.createElement("img"));
		close_button.attr("src", "images/button_x.png").attr("height", "48").attr("width", "48");
		close_button.attr("onclick", "$('#soft_reset_background').remove();$('#soft_reset_confirmation').remove();");
		close_button.attr("style", "position:absolute;right:0px;top:0px;cursor:pointer");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
		
	var title = $(document.createElement("div"));
		title.html("Reset");
		title.css("font-size", "180%");
		//title.css("color", "black");
		//title.css("text-shadow", "0px 0px 1px #AAAAAA");
		title.attr("class", "detail_title");
		
	var reset_button = $(document.createElement("img"));
		reset_button.attr("src", "images/button_reset.png");
		reset_button.attr("style", "cursor:pointer;")
		reset_button.attr("onclick", "openSoftResetConfirmation();");	
		
	var upgrade_button = $(document.createElement("img"));
		upgrade_button.attr("src", "images/button_upgrades.png");
		upgrade_button.attr("style", "cursor:pointer;")
		upgrade_button.attr("onclick", "openKarmaFullscreen();");

	var content = $(document.createElement("div"));
	content.attr("id", "soft_reset_content");
	//content.css("color", "black");
	content.css("font-weight", "bold");

	background.append(close_button);
	background.append(title);
	background.append(document.createElement("br"));
	background.append(document.createElement("br"));
	background.append(content);
	background.append(document.createElement("br"));
	background.append(document.createElement("br"));
	background.append(reset_button);	
	background.append(document.createElement("br"));
	background.append(upgrade_button);
	
	$(document.body).append(background);
	
	updateSoftResetHTML();
}
/** Updates the soft reset menu's text. */
function updateSoftResetHTML() {
	var content_string = "Resetting now will grant <span style='color:#fcff1f;'>" + fancyNumber(FUTURE_KARMA_POINTS - KARMA_POINTS) + "</span> Karma Points increasing total Karma Points to <span style='color:#fcff1f;'>" + fancyNumber(FUTURE_KARMA_POINTS) + "</span> (which increases production by " + fancyNumber(FUTURE_KARMA_POINTS) + "%)";
	content_string += "<br><br>Warning: Resetting now will reset ALL progress except: Building Statistics, Karma Points, Total Statistics, Subgames, and Assistant Levels";
	content_string += "<br><br>You have <span style='color:#fcff1f;'>" + fancyNumber(FUTURE_KARMA_POINTS - SPENT_KARMA_POINTS) + "</span> Karma Points available for upgrades"
	
	if (FUTURE_KARMA_POINTS < 100) {
		content_string += "<br><br>It is recommended that you reach at least 100 Karma Points before resetting."
	}
	
	$("#soft_reset_content").html(content_string);
}
/** Displays confirmation message to the user for soft reset. */
function openSoftResetConfirmation() {
	$("#soft_reset_confirmation").remove();
	
	var confirmation = $(document.createElement("div"));
		confirmation.attr("id", "soft_reset_confirmation");
		confirmation.attr("style", "z-index:10001");
		confirmation.attr("onclick", "MENU_CLOSE = false;");
		confirmation.html('<div><center><span style="font-size:20px;">Are you sure you want to reset?</span><br><br><button onclick="softReset()" type="button" class="basic_button">Reset</button> <button onclick=\'$("#soft_reset_confirmation").remove()\' type="button" class="basic_button">Cancel</button></center></div>');
		
	$(document.body).append(confirmation);
}
/** Represents a karma upgrade.
 * @constructor
 * @param {string} name - Name of the this karma upgrade to be displayed on the tooltip.
 * @param {string} description - Description shown on this upgrade's tooltip.
 * @param {int} sx - The x location on the karma tiled map for this upgrade's canvas icon.
 * @param {int} sy - The y location on the karma tiled map for this upgrade's canvas icon.
 * @param {int} x - The x location on the karma tiled map for this upgrade's icon.
 * @param {int} y - The y location on the karma tiled map for this upgrade's icon.
 * @param {int} cost - The karma cost of this upgrade.
 * @param {function} onBuy - Function called when this upgrade is bought.
 * @param {function} effect - This upgrade's effect, called each tick.
 * @param {int} previous_karma - The karma upgrade required before this is unlocked.
 */
function KarmaUpgrade(name, description, sx, sy, x, y, cost, onBuy, effect, previous_karma) {
	this.name = name;
	this.description = description;
	this.tooltip = tooltip
    this.sx = sx * 48;
    this.sy = sy * 48;
	this.x = x;
	this.y = y;
	this.cost = cost;
	this.onBuy = onBuy;
	this.effect = effect;
	this.previous_karma = previous_karma
	this.bought = false;
	
	this.render = function (ctx) {
		ctx.drawImage(karma_image, this.sx, this.sy, 48, 48, this.x - karma_tree.camera.x, this.y - karma_tree.camera.y, 48, 48);
	}
	this.renderUnknown = function (ctx) {
		ctx.drawImage(karma_image, 2*48, 3*48, 48, 48, this.x - karma_tree.camera.x, this.y - karma_tree.camera.y, 48, 48);
	}
	this.drawLine = function (ctx) {
		if (this.previous_karma != null) {
			var p_node = karma_upgrades[this.previous_karma];
			var camera = karma_tree.camera;
			
			var start_x = this.x + 24 - camera.x;
			var start_y = this.y + 24 - camera.y;
			var end_x = p_node.x + 24 - camera.x;
			var end_y = p_node.y + 24 - camera.y;
			
			ctx.beginPath();
			ctx.moveTo(start_x, start_y);
			ctx.lineTo(end_x, end_y);
			ctx.stroke();
		}
	}
}
/** Initializes all karma upgrades. */
function initKarmaUpgrades() {
	karma_upgrades = [];
	
	karma_upgrades.push(new KarmaUpgrade("Quick Start", "Grants 120 seconds worth of time now and at the start of every future run.", 0, 0, 120, 64, 10, function () {addClockTicks(120)}, function () {}, null)); //0
	karma_upgrades.push(new KarmaUpgrade("Quicker Start", "Grants 120 seconds worth of time now and at the start of every future run.", 1, 0, -80, 64, 100, function () {addClockTicks(120)}, function () {}, 0)); //1
	karma_upgrades.push(new KarmaUpgrade("Quick Clicking", "Increases value from clicking by 100% of production up to one million.", 6, 0, 320, 64, 125, function () {}, function () {CLICK_BASE += Math.min(PRODUCTION, 1000000);}, 0)); //2
	karma_upgrades.push(new KarmaUpgrade("Quicker Clicking", "Increases value from clicking by 50 Million.", 7, 0, 500, 164, 2000, function () {}, function () {CLICK_BASE += 50000000}, 2)); //3
	karma_upgrades.push(new KarmaUpgrade("Quickest Clicking", "Increases value from clicking by 500 Billion.", 8, 0, 680, 164, 200000, function () {}, function () {CLICK_BASE += 500000000000}, 3)); //4
	karma_upgrades.push(new KarmaUpgrade("Karmatic Clicking", "Increases value from clicking by 1% of production.", 9, 0, 500, -36, 2000, function () {}, function () {CLICK_PRODUCTION += 0.01}, 2)); //5
	karma_upgrades.push(new KarmaUpgrade("Karmatic Clicking II", "Increases value from clicking by 1% of production.", 0, 1, 680, -36, 2000000, function () {}, function () {CLICK_PRODUCTION += 0.01}, 5)); //6
	karma_upgrades.push(new KarmaUpgrade("Even Quicker Start", "Grants 150 seconds worth of time now and at the start of every future run.", 2, 0, -260, 164, 1000, function () {addClockTicks(150)}, function () {}, 1)); //7
	karma_upgrades.push(new KarmaUpgrade("Quickest Start", "Grants 300 seconds worth of time now and at the start of every future run.", 3, 0, -440, 164, 25000, function () {addClockTicks(300)}, function () {}, 7)); //8
	karma_upgrades.push(new KarmaUpgrade("Tick Tock", "Grants 2 extra seconds worth of time each minute.", 4, 0, -260, -36, 1500, function () {}, function () {}, 1)); //9
	karma_upgrades.push(new KarmaUpgrade("Tick Tock II", "Increases maximum game speed by 1.", 5, 0, -440, -36, 100000, function () {}, function () {}, 9)); //10
	karma_upgrades.push(new KarmaUpgrade("Universal Discount", "Decreases the cost of all buildings by 5%.", 8, 1, 120, -136, 25, function () {}, function () {COST_REDUCTION *= 1.05}, 0)); //11
	karma_upgrades.push(new KarmaUpgrade("Universal Discount II", "Decreases the cost of all buildings by 10%.", 9, 1, 200, -236, 500, function () {}, function () {COST_REDUCTION *= 1.1}, 11)); //12
	karma_upgrades.push(new KarmaUpgrade("Universal Discount III", "Decreases the cost of all buildings by 25%.", 0, 2, 300, -236, 5000, function () {}, function () {COST_REDUCTION *= 1.25}, 12)); //13
	karma_upgrades.push(new KarmaUpgrade("Universal Discount IV", "Decreases the cost of all buildings by 50%.", 1, 2, 400, -236, 50000000, function () {}, function () {COST_REDUCTION *= 1.50}, 13)); //14
	karma_upgrades.push(new KarmaUpgrade("Universal Bonus", "Increases production by 10%.", 3, 3, 40, -236, 110, function () {}, function () {PRODUCTION_MULTIPLIER *= 1.1}, 11)); //15
	karma_upgrades.push(new KarmaUpgrade("Universal Bonus II", "Increases production by 15%.", 2, 2, 40, -336, 1000, function () {}, function () {PRODUCTION_MULTIPLIER *= 1.15}, 15)); //16
	karma_upgrades.push(new KarmaUpgrade("Universal Bonus III", "Increases production by 25%.", 3, 2, 40, -436, 10000, function () {}, function () {PRODUCTION_MULTIPLIER *= 1.25}, 16)); //17
	karma_upgrades.push(new KarmaUpgrade("Universal Bonus IV", "Increases production by 50%.", 4, 2, 40, -536, 100000, function () {}, function () {PRODUCTION_MULTIPLIER *= 1.50}, 17)); //18
	karma_upgrades.push(new KarmaUpgrade("Universal Bonus V", "Increases production by 100%.", 5, 2, 40, -636, 1000000, function () {}, function () {PRODUCTION_MULTIPLIER *= 2}, 18)); //19
	karma_upgrades.push(new KarmaUpgrade("Universal Bonus VI", "Increases production by 150%.", 6, 2, 40, -736, 10000000, function () {}, function () {PRODUCTION_MULTIPLIER *= 2.5}, 19)); //20
	karma_upgrades.push(new KarmaUpgrade("Nighttime Karma", "Increases offline production by 1%.", 4, 3, -60, -236, 10500, function () {}, function () {}, 15)); //21
	karma_upgrades.push(new KarmaUpgrade("Nighttime Karma II", "Increases offline production by 1%.", 5, 3, -160, -236, 1000000, function () {}, function () {}, 21)); //22
	karma_upgrades.push(new KarmaUpgrade("Karmatic Future", "Karma not yet obtained from resetting increases production by 20% of what it otherwise would have.", 7, 2, 200, -336, 1000, function () {}, function () {}, 12)); //23
	karma_upgrades.push(new KarmaUpgrade("Karmatic Future II", "Karma not yet obtained from resetting increases production by 40% of what it otherwise would have.", 8, 2, 200, -436, 10000, function () {}, function () {}, 23)); //24
	karma_upgrades.push(new KarmaUpgrade("Karmatic Future III", "Karma not yet obtained from resetting increases production by 60% of what it otherwise would have.", 9, 2, 200, -536, 100000, function () {}, function () {}, 24)); //25
	karma_upgrades.push(new KarmaUpgrade("Karmatic Future IV", "Karma not yet obtained from resetting increases production by 80% of what it otherwise would have.", 0, 3, 200, -636, 1000000, function () {}, function () {}, 25)); //26
	karma_upgrades.push(new KarmaUpgrade("Karmatic Future V", "Karma not yet obtained from resetting increases production by 100% of what it otherwise would have.", 1, 3, 200, -736, 10000000, function () {}, function () {}, 26)); //27
	karma_upgrades.push(new KarmaUpgrade("Zen Assistant", "Unlocks an assistant that increases production while no bonuses are active, and unlocks many new abilities. The assistant grants larger bonuses as time passes.", 1, 1, 120, 444, 700, function () {assistants[4].unlocked = true;updateSubgameButtons();}, function () {}, 0)); //28
	karma_upgrades.push(new KarmaUpgrade("Assistant Assistance", "Increases the rate that assistants gain levels by 50%.", 2, 1, 120, 614, 1000, function () {}, function () {ASSISTANT_RATE *= 1.5}, 28)); //29
	karma_upgrades.push(new KarmaUpgrade("Tier 1 Boost", "Increases the production of all tier one buildings by 20%.", 4, 4, -80, 444, 50, function () {}, function () {}, 0)); //30
	karma_upgrades.push(new KarmaUpgrade("Free Cultists", "Grants 5 free cultists on reset (this does not increase the price of cultists).", 6, 3, -260, 264, 2000, function () {}, function () {}, 30)); //31
	karma_upgrades.push(new KarmaUpgrade("Free Mines", "Grants 5 free mines on reset (this does not increase the price of mines).", 7, 3, -260, 324, 2000, function () {}, function () {}, 30)); //32
	karma_upgrades.push(new KarmaUpgrade("Free Gamblers", "Grants 5 free gamblers on reset (this does not increase the price of gamblers).", 8, 3, -260, 384, 2000, function () {}, function () {}, 30)); //33
	karma_upgrades.push(new KarmaUpgrade("Free Power", "Grants 5 free power plants on reset (this does not increase the price of power plants).", 9, 3, -260, 444, 2000, function () {}, function () {}, 30)); //34
	karma_upgrades.push(new KarmaUpgrade("Free Banks", "Grants 5 free banks on reset (this does not increase the price of banks).", 0, 4, -260, 504, 2000, function () {}, function () {}, 30)); //35
	karma_upgrades.push(new KarmaUpgrade("Free Research", "Grants 5 free research centers on reset (this does not increase the price of research centers).", 1, 4, -260, 564, 2000, function () {}, function () {}, 30)); //36
	karma_upgrades.push(new KarmaUpgrade("Free Factories", "Grants 5 free factories on reset (this does not increase the price of factories).", 2, 4, -260, 624, 2000, function () {}, function () {}, 30)); //37
	karma_upgrades.push(new KarmaUpgrade("Smart Gamblers", "The auto-draw option for gamblers is improved, and will draw, discard, or shuffle, when the odds are the good to do so.", 3, 4, -360, 384, 25000, function () {}, function () {}, 33)); //38
	
	karma_tree.context = document.getElementById("fullscreen_karma").getContext("2d");
}
/** Renders the karma tree on the canvas. */
function renderKarmaTree() {
	var camera = karma_tree.camera;
	var ctx = karma_tree.context;

	ctx.clearRect(0, 0, 300, 180);
	ctx.fillStyle = "#e4e2c0";
	ctx.fillRect(0, 0, 750, 450);
	
	ctx.lineWidth = 3;
	
	var len = karma_upgrades.length;
	for (var i = 1; i < len; i++) {
		var previous = karma_upgrades[karma_upgrades[i].previous_karma]
		if (previous.bought || (previous.previous_karma != null && karma_upgrades[previous.previous_karma].bought)) {
			karma_upgrades[i].drawLine(ctx);
		}
	}
	
	for (var i = 1; i < len; i++) {
		var previous = karma_upgrades[karma_upgrades[i].previous_karma];
		if (karma_upgrades[i].bought) {
			karma_upgrades[i].render(ctx);
		} else if (previous.bought) {
			karma_upgrades[i].render(ctx);
			drawCircle(karma_upgrades[i].x + 24, karma_upgrades[i].y + 24, 22, true);
		}	else if ((previous.previous_karma != null && karma_upgrades[previous.previous_karma].bought)) {
			karma_upgrades[i].renderUnknown(ctx);
			drawCircle(karma_upgrades[i].x + 24, karma_upgrades[i].y + 24, 22, true);
		}
		
	}
	karma_upgrades[0].render(ctx);
	if (!karma_upgrades[0].bought) {drawCircle(karma_upgrades[0].x + 24, karma_upgrades[0].y + 24, 22, true)}
}
/** Handles mouse move event to display tooltips on the karma tree.
 * @param {event} e - The mouse event.
 */
function karmaMouseDetection(e) {
	karma = karma_upgrades;
	camera = karma_tree.camera;
	
	var ele = $("#fullscreen_karma");
	
	var x = Math.floor(e.pageX - ele.offset().left);
	var y = Math.floor(e.pageY - ele.offset().top);
	
	for (var i = 0; i < karma.length; i++) {
		node = karma[i];
		if ((node.previous_karma == null) || (karma[node.previous_karma].bought)) {
			if (x + camera.x > node.x && x + camera.x < node.x + 48 && y + camera.y > node.y && y + camera.y < node.y + 48) {
				karmaTooltip(node);
			}
		}
	}
}
/** Handles mouse click event on the karma tree.
 * @param {event} e - The mouse event.
 */
function karmaClickDetection(e) {
	karma = karma_upgrades;
	camera = karma_tree.camera;
	
	var ele = $("#fullscreen_karma");

	var x = Math.floor(e.pageX - ele.offset().left);
	var y = Math.floor(e.pageY - ele.offset().top);
	
	for (var i = 0; i < karma.length; i++) {
		node = karma[i];
		if ((node.previous_karma == null) || (karma[node.previous_karma].bought)) {
			if (x + camera.x > node.x && x + camera.x < node.x + 48 && y + camera.y > node.y && y + camera.y < node.y + 48) {
				if (KARMA_POINTS - SPENT_KARMA_POINTS >= node.cost && !node.bought) {
					node.bought = true;
					node.onBuy();
					SPENT_KARMA_POINTS += node.cost;

					karmaMouseDetection(e);
					renderKarmaTree();
				}
			}
		}
	}
}
/** Closes the karma tree. */
function closeKarmaFullscreen() {
	$("#fullscreen_karma").hide();
	$("#close_karma_tree").hide();
}
/** Opens the karma tree. */
function openKarmaFullscreen() {
	$("#fullscreen_karma").show();
	$("#close_karma_tree").show();
	renderKarmaTree();
}