/**
 * @fileOverview Contains all logic for subgames.
 */

//Global subgame array
var subgames = [];

/** Represents a subgame.
 * @constructor
 */
function Subgame() {
	this.unlocked = false;
	this.credits = 0;
	this.production = 0;
	this.rotation = 0;
	this.rotation_speed = 0;
	this.update_stack = 0;
	this.reset_count = 0;
	this.click_value = 1;
	this.reset_exponent = 1000;
	this.corruption_reset_animation = 0;
	this.buy_count = 1;
	this.main_called = true;
	this.buildings = [];
	this.upgrades = [];
	
	this.last_update = Date.now();
    this.vars = {};
    this.createHTML = function () {};
    this.updateHTML = function () {};
    this.stats = {};

	this.slow_ticker = 0;
	this.stored_ticks = 0;
	this.cancel_suppression = false;
}
/** Initializes all subgames. */
function initSubgames() {	
	var corruption_subgame = new Subgame();
	
	corruption_subgame.vars = {}

	corruption_subgame.createHTML = function () {
		if (!$("#corruption_background").length) {
			var background = $(document.createElement("div"));
			background.attr("class", "subgame_background");
			background.attr("id", "corruption_background");
			background.attr("onclick", "MENU_CLOSE = false;")
			background.css("border", "3px solid #087c00");
			background.css("border-radius", "10px");
			
			var close_button = $(document.createElement("img"));
			close_button.attr("src", "images/button_x_corruption.png");
			close_button.attr("class", "subgame_close");
			close_button.attr("onclick", "$('#corruption_background').remove(); $('#corruption_reset_background').remove();");
			close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_corruption_hover.png')");
			close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x_corruption.png')");
			
			var corruption_upgrade_container = $(document.createElement("div"));
			corruption_upgrade_container.attr("class", "subgame_upgrades");
			corruption_upgrade_container.attr("id", "corruption_upgrades_container");

			var corruption_clicker = $(document.createElement("img"));
			corruption_clicker.attr("src", "images/corruption_clicker.png");
			corruption_clicker.attr("id", "corruption_clicker");
			corruption_clicker.attr("style", "cursor:pointer;position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);");
			corruption_clicker.attr("onclick", "subgames[0].handleClick();");		
			
			var corruption_reset = $(document.createElement("img"));
			corruption_reset.attr("src", "images/corruption_reset.png");
			if (this.credits >= 1000000000 * Math.pow(this.reset_exponent, this.reset_count)) {corruption_reset.attr("src", "images/corruption_reset_active.png");}
			corruption_reset.attr("id", "corruption_reset");
			corruption_reset.attr("style", "transform-origin:center;cursor:pointer;position:absolute;left:45%;top:15%;");
			corruption_reset.attr("onclick", "subgames[0].toggleReset();");
			
			var corruption_credits_display = $(document.createElement("div"));
			corruption_credits_display.attr("id", "corruption_credits_display");
			corruption_credits_display.attr("class", "subgame_credit_display");
			corruption_credits_display.attr("style", "color:#14ff03;text-shadow : 0px 0px 8px #32b54a");
			corruption_credits_display.html("100.1 Billion Corruption Credits<br>10.0 Million per second");
			
			var corruption_centerer = $(document.createElement("center"));
				var corruption_building_container = $(document.createElement("div"));
				corruption_building_container.attr("id", "corruption_building_container");
				corruption_centerer.attr("style", "position:absolute;height:100px;left:9px;bottom:36px;display:block;width:100%");
			
				var corruption_multibuy_container = $(document.createElement("center"));
					corruption_multibuy_container.html("Buy: ")
					var one_x = $(document.createElement("span"));
						one_x.attr("id", "corrupt_buy_count_1");
						one_x.attr("style", "cursor: pointer");
						one_x.attr("onclick", "subgames[0].changeBuyCount(1)");
						one_x.attr("class", "buy_count");					
						one_x.html("1");					
					var five_x = $(document.createElement("span"));
						five_x.attr("id", "corrupt_buy_count_5");
						five_x.attr("style", "cursor: pointer");
						five_x.attr("onclick", "subgames[0].changeBuyCount(5)");
						five_x.html(" 5");
					var ten_x = $(document.createElement("span"));
						ten_x.attr("id", "corrupt_buy_count_10");
						ten_x.attr("style", "cursor: pointer");
						ten_x.attr("onclick", "subgames[0].changeBuyCount(10)");
						ten_x.html(" 10");
					var fivety_x = $(document.createElement("span"));
						fivety_x.attr("id", "corrupt_buy_count_50");
						fivety_x.attr("style", "cursor: pointer");
						fivety_x.attr("onclick", "subgames[0].changeBuyCount(50)");
						fivety_x.html(" 50");					
					var max_x = $(document.createElement("span"));
						max_x.attr("id", "corrupt_buy_count_10000");
						max_x.attr("style", "cursor: pointer");
						max_x.attr("onclick", "subgames[0].changeBuyCount(10000)");
						max_x.html(" Max");
						
					corruption_multibuy_container.append(one_x);
					corruption_multibuy_container.append(five_x);
					corruption_multibuy_container.append(ten_x);
					corruption_multibuy_container.append(fivety_x);
					corruption_multibuy_container.append(max_x);
				corruption_building_container.append(corruption_multibuy_container);
			corruption_building_container.attr("style", "text-align:center;cursor:pointer;");
			corruption_centerer.append(corruption_building_container);
			
			for (var i = 0; i < this.buildings.length; i++) {
				if (!this.buildings[i].unlocked && !this.buildings[i].available) {
					continue;
				}
				
				this.buildings[i].createHTML(corruption_building_container);
			}

			background.append(corruption_clicker);
			background.append(corruption_reset);
			background.append(corruption_credits_display);
			background.append(corruption_centerer);
			background.append(corruption_upgrade_container);
			background.append(close_button);
			
			$(document.body).append(background);
			
			this.updateCreditsDisplay();
			this.updateHTML();
			
			MENU_CLOSE = false;
		}
	};
	corruption_subgame.updateHTML = function () {
		$("#corruption_upgrades_container").empty();
		
		for (var i = 0; i < this.upgrades.length; i++) {
			this.upgrades[i].updateHTML();
		}
	};
	corruption_subgame.update = function (dt) {
		if (!$("#corruption_background").length && !this.cancel_suppression) {
			this.stored_ticks += dt;
			if (this.stored_ticks >= 5) {
				this.cancel_suppression = true;
				this.update(this.stored_ticks);
				this.stored_ticks = 0;
			}
		}
		else {
			this.slow_ticker += dt;
			
			if (this.slow_ticker > 1) {
				this.slowTick(this.slow_ticker);
				this.slow_ticker = 0;
			}
			
			if (this.credits >= 1000000000 * Math.pow(this.reset_exponent, this.reset_count)) {
				this.corruption_reset_animation += 0.7 * dt;
				var scale = 1 + Math.sin(this.corruption_reset_animation) * 0.12;
				$("#corruption_reset").css("transform", "scale("+scale+")");
			}
			
			this.rotation_speed = Math.max(this.rotation_speed / (1 + 0.09*dt), 0);
			this.rotation_speed = Math.max(this.rotation_speed - 13*dt, 0);
			this.rotation += this.rotation_speed * dt;
			
			$("#corruption_clicker").css("transform", "translate(-50%, -50%) rotate("+this.rotation+"deg)");
			
			if (this.rotation_speed > 0.5 && this.rotation_speed < 4) {this.rotation_speed = 0;this.rotation -= 1;}
			
			if (this.rotation >= 360) {
				this.rotation -= 360;
			}

			this.credits += this.production * dt;
			this.vars.precise_seed += this.vars.seed_production * dt;

			if (this.vars.precise_seed > 0) {
				this.buildings[0].count += Math.floor(this.vars.precise_seed);
				this.vars.precise_seed -= Math.floor(this.vars.precise_seed);
				
				$("#corruption_building_0").html(shortNumber(this.buildings[0].count));
			}

			this.updateCreditsDisplay();
			this.cancel_suppression = false;
		}
	};
	corruption_subgame.slowTick = function (dt) {
		this.calculateProduction();
		this.updateHTML();
		this.updateUnlocks();
		
		this.vars.recruiter_bonus += 0.00016 * this.buildings[4].count * dt;
		this.vars.icon_bonus += 0.00028 * this.buildings[6].count * dt;
		
		if (this.credits >= 1000000000 * Math.pow(this.reset_exponent, this.reset_count)) {
			$("#corruption_reset").attr("src", "images/corruption_reset_active.png");
			
		} else {
			$("#corruption_reset").attr("src", "images/corruption_reset.png");
		}
	}
	corruption_subgame.handleClick = function () {
		this.credits += this.click_value;
		
		this.rotation_speed += 10;

		if (this.upgrades[1].bought) {this.buildings[0].count += 1; $("#corruption_building_0").html(shortNumber(this.buildings[0].count));}
		
		this.updateCreditsDisplay();
	};
	corruption_subgame.updateCreditsDisplay = function () {
		$("#corruption_credits_display").html(fancyNumber(this.credits) + " Corruption Credits<br>" + fancyNumber(this.production) + " per second");
	}
	corruption_subgame.calculateProduction = function () {
		this.production = 0;
		this.vars.seed_production = 0;
		this.click_value = 1;
		
		for (var i = 0; i < this.buildings.length; i++) {
			this.buildings[i].production = this.buildings[i].base_production;
			this.buildings[i].seed_production = this.buildings[i].seed_base_production * Math.pow(2, subgames[0].reset_count);;
		}
		
		this.buildings[0].production += this.vars.recruiter_bonus;
		this.buildings[1].seed_production *= 1 + this.upgrades[15].bought * 4;
		this.buildings[3].seed_production *= 1 + this.upgrades[17].bought * 4;
		this.buildings[5].seed_production *= 1 + this.upgrades[18].bought * 4;
		this.buildings[7].seed_production *= 1 + this.upgrades[19].bought * 4;

		for (var i = 0; i < this.buildings.length; i++) {
			this.production += this.buildings[i].production * this.buildings[i].count;
			this.vars.seed_production += this.buildings[i].seed_production * this.buildings[i].count * (1 + kongBuys.expanded_corruption);
		}

		
		for (var i = 0; i < this.upgrades.length; i++) {
			if (this.upgrades[i].bought) {
				this.upgrades[i].effect();
			}
		}
		
		this.production *= 1 + kongBuys.expanded_corruption;

		this.production *= 1 + this.buildings[2].count * 0.01;
		this.production *= Math.pow(1.01, subgames[0].vars.icon_bonus);
		this.production *= Math.pow(10, subgames[0].reset_count);
		//this.vars.seed_production *= Math.pow(2, subgames[0].reset_count);
	}
	corruption_subgame.updateUnlocks = function () {
		if (this.credits >= 5) {this.upgrades[0].makeAvailable();}
		if (this.credits >= 10000) {this.upgrades[1].makeAvailable();}		
		if (this.credits >= 20000) {this.upgrades[2].makeAvailable();}		
		if (this.credits >= 200000) {this.upgrades[3].makeAvailable();}
		if (this.credits >= 2000000) {this.upgrades[4].makeAvailable();}
		if (this.credits >= 20000000) {this.upgrades[5].makeAvailable();}
		if (this.credits >= 200000000) {this.upgrades[6].makeAvailable();}
		if (this.credits >= 2000000000) {this.upgrades[7].makeAvailable();}
		if (this.credits >= 20000000000) {this.upgrades[8].makeAvailable();}
		if (this.credits >= 200000000000) {this.upgrades[9].makeAvailable();}
		if (this.credits >= 2000000000000) {this.upgrades[10].makeAvailable();}
		if (this.credits >= 20000000000000) {this.upgrades[11].makeAvailable();}
		
		if (this.credits >= 25000) {this.upgrades[12].makeAvailable();}
		if (this.credits >= 75000000) {this.upgrades[13].makeAvailable();}
		if (this.credits >= 125000000000) {this.upgrades[14].makeAvailable();}
		
		if (this.credits >= 200000) {this.upgrades[15].makeAvailable();}
		if (this.credits >= 10000000) {this.upgrades[16].makeAvailable();}
		if (this.credits >= 60000000) {this.upgrades[17].makeAvailable();}
		if (this.credits >= 20000000000) {this.upgrades[18].makeAvailable();}
		if (this.credits >= 1000000000000) {this.upgrades[19].makeAvailable();}
		
		if (this.credits >= 100000000000000000000000 && !assistants[5].unlocked) {this.upgrades[20].makeAvailable();}
		
		for (var i = 0; i < this.buildings.length; i++) {
			var building = this.buildings[i];
			if (!building.available && this.credits > building.cost * 0.01) {
				building.available = true;
				building.createHTML($("#corruption_building_container"));
			}
			if (!building.unlocked && this.credits > building.cost * 0.08) {
				building.unlocked = true;
				building.createHTML($("#corruption_building_container"));
			}
		}
	}
	corruption_subgame.toggleReset = function () {
		if ($("#corruption_reset_background").length) {return} 
		
		var bonus_string = "";
		if (this.reset_count == 0) {bonus_string = "<li>You have not yet reset corruption, and thus have no bonuses</li>"}
		if (this.reset_count >= 1) {
			bonus_string += "<li>Increases corruption production by 1000% (" + (this.reset_count) + "x)</li>";
			bonus_string += "<li>Doubles bad seed production (" + (this.reset_count) + "x)</li>";
			bonus_string += "<li>Increases normal production by " + (3 + this.reset_count) + "%</li>";
		}
		if (this.reset_count >= 2) {bonus_string += "<li>Increases normal click value by " + (0.8 + this.reset_count * 0.2).toFixed(1) + "% of production</li>"}
		if (this.reset_count >= 3) {bonus_string += "<li>Decreases normal buildings' prices by " + (2 + this.reset_count) + "%</li>"}
		if (this.reset_count >= 4) {bonus_string += "<li>Decreases the amount of time gambles take to generate draws and discards by " + (1 + this.reset_count) + "%</li>"}
		if (this.reset_count >= 5) {bonus_string += "<li>Decreases the amount of time investments take to return by " + (this.reset_count) + "%</li>"}
		bonus_string += "<br>";
		
		var future_string = "";
		future_string += "<li>Increases corruption production by 1000%</li>"
		future_string += "<li>Double the number of bad seeds each building produces</li>"
		if (this.reset_count == 0) {future_string += "<li>Increases normal production by " + (3 + this.reset_count + 1) + "%</li>"}
		if (this.reset_count == 1) {future_string += "<li>Increases normal click value by " + (0.8 + (this.reset_count + 1) * 0.2).toFixed(1) + "% of production</li>"}
		if (this.reset_count == 2) {future_string += "<li>Decreases normal buildings' prices by " + (2 + this.reset_count + 1) + "%</li>"}
		if (this.reset_count == 3) {future_string += "<li>Decreases the amount of time gambles take to generate draws and discards by " + (1 + this.reset_count + 1) + "%</li>"}
		if (this.reset_count == 4) {future_string += "<li>Decreases the amount of time investments take to return by " + (this.reset_count + 1) + "%</li>"}
		if (this.reset_count != 0) {future_string += "<li>Increases the bonuses from previous resets</li>"}
		future_string += "<br>";
		
		
		var close_button = $(document.createElement("img"));
		close_button.attr("src", "images/button_x_corruption.png");
		close_button.attr("class", "subgame_close");
		close_button.attr("onclick", "$('#corruption_reset_background').remove()");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_corruption_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x_corruption.png')");
		
		var background = $(document.createElement("div"));
		background.attr("class", "subgame_reset_background");
		background.attr("id", "corruption_reset_background");
		background.attr("onclick", "MENU_CLOSE = false;")
		background.css("border", "3px solid #087c00");
		background.css("border-radius", "10px");
		
		var reset_title = $(document.createElement("h1"));
		reset_title.css("text-align", "center");
		reset_title.css("color", "#0ED500");
		reset_title.html("Reset Corruption");
		
		var reset_cost = $(document.createElement("div"));
		reset_cost.css("color", "#10F800");
		if (this.credits < 1000000000 * Math.pow(this.reset_exponent, this.reset_count)) {reset_cost.css("color", "#e02900");}
		reset_cost.css("text-align", "center");
		reset_cost.html(" Reseting requires " + shortNumber(1000000000 * Math.pow(this.reset_exponent, this.reset_count)) + " corruption credits <br><br>");
		
		var reset_bonus = $(document.createElement("div"));
		reset_bonus.css("color", "#10F800");
		reset_bonus.html("Current Bonuses: <br>" + bonus_string);
		
		var reset_future = $(document.createElement("div"));
		reset_future.css("color", "#10F800");
		reset_future.html("Reseting now will: <br>" + future_string);
		
		var reset_button = $(document.createElement("center"));
		reset_button.html("<button id='reset_button_corruption' onclick='subgames[0].reset();'>Reset</button>");
		
		background.append(reset_title);
		background.append(reset_cost);
		background.append(reset_bonus);
		background.append(reset_future);
		background.append(reset_button);
		background.append(close_button);
		
		$("#corruption_background").append(background);
	}
	corruption_subgame.reset = function () {
		if (this.credits >= 1000000000 * Math.pow(this.reset_exponent, this.reset_count)) {
			this.credits = 0;
			this.reset_count += 1;
			this.click_value = 0;
			this.rotation_speed = 500;
			this.production = 0;
			this.vars.seed_production = 0;
			popupText("Corruption Reset", $("#corruption_reset").offset().left + $("#corruption_reset").width()/2, $("#corruption_reset").offset().top);
			
			this.upgrades = [];
			this.buildings = [];
			this.vars = {};
			
			this.initBuildings();
			this.initUpgrades();
			this.initVars();
			
			$("#corruption_background").remove(); 
			$("#corruption_reset_background").remove();
			
			this.createHTML();
		} else {
			popupText("Not Enough Corruption", $("#reset_button_corruption").offset().left + $("#reset_button_corruption").width()/2, $("#reset_button_corruption").offset().top);
		}
	}
	corruption_subgame.changeBuyCount = function (count) {
		this.buy_count = count;

		$("#corrupt_buy_count_1").attr("class", "");
		$("#corrupt_buy_count_5").attr("class", "");
		$("#corrupt_buy_count_10").attr("class", "");
		$("#corrupt_buy_count_50").attr("class", "");
		$("#corrupt_buy_count_10000").attr("class", "");
		
		$("#corrupt_buy_count_"+count).attr("class", "buy_count");
	}
	
	corruption_subgame.initBuildings = function () {
		this.buildings = [];
		
		var bad_seed = new CorruptionBuilding("Bad Seed", 100, 1, 0, "images/corruption_bad_seed.png", false, function () {});
		bad_seed.unlocked = true;
		bad_seed.available = true;
		this.buildings.push(bad_seed);

		var corrupt_farm = new CorruptionBuilding("Corrupt Farm", 5000, 50, 1, "images/corruption_corrupt_farm.png", true, function () {});
		corrupt_farm.available = true;
		this.buildings.push(corrupt_farm);

		var propaganda_center = new CorruptionBuilding("Propaganda Center", 250000, 1000, 0, "images/corruption_propaganda_center.png", true, function () {});
		this.buildings.push(propaganda_center);	
		
		var corrupt_banker = new CorruptionBuilding("Corrupt Banker", 2500000, 10000, 25, "images/corruption_corrupt_banker.png", true, function () {});
		this.buildings.push(corrupt_banker);
		
		var corrupt_recruiter = new CorruptionBuilding("Corrupt Recruiter", 100000000, 75000, 0, "images/corruption_corrupt_recruiter.png", true, function () {});
		this.buildings.push(corrupt_recruiter);	
		
		var con_artist = new CorruptionBuilding("Con Artist", 1000000000, 500000, 500, "images/corruption_con_artist.png", true, function () {});
		this.buildings.push(con_artist);	
		
		var corrupt_icon = new CorruptionBuilding("Icon Of Corruption", 50000000000, 5000000, 0, "images/corruption_corrupt_icon.png", true, function () {});
		this.buildings.push(corrupt_icon);	
		
		var corrupt_factory = new CorruptionBuilding("Corrupt Factory", 500000000000, 25000000, 10000, "images/corruption_corrupt_factory.png", true, function () {});
		this.buildings.push(corrupt_factory);
	}
	corruption_subgame.initUpgrades = function () {
		this.upgrades = [];
		//{ Corruption Upgrades
		var upgrade_0 = new CorruptionUpgrade( //{
			"Corrupt Clicks",
			"Each click will grant an additional 4 corruption.",
			"",
			1,
			19,
			25,
			function () {subgames[0].click_value += 4},
			function () {},
			function () {},
		);//}
		var upgrade_1 = new CorruptionUpgrade( //{
			"Green Thumb",
			"Each click will grant 1 additional bad seed.",
			"",
			1,
			19,
			25000,
			function () {},
			function () {},
			function () {},
		);//}		
		var upgrade_2 = new CorruptionUpgrade( //{
			"Tendrils of Corruption",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			100000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_3 = new CorruptionUpgrade( //{
			"Tendrils of Corruption II",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			1000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_4 = new CorruptionUpgrade( //{
			"Tendrils of Corruption III",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			10000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_5 = new CorruptionUpgrade( //{
			"Tendrils of Corruption IV",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			100000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_6 = new CorruptionUpgrade( //{
			"Tendrils of Corruption V",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			1000000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_7 = new CorruptionUpgrade( //{
			"Tendrils of Corruption VI",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			10000000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_8 = new CorruptionUpgrade( //{
			"Tendrils of Corruption VII",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			100000000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_9 = new CorruptionUpgrade( //{
			"Tendrils of Corruption VIII",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			1000000000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_10 = new CorruptionUpgrade( //{
			"Tendrils of Corruption IX",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			10000000000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_11 = new CorruptionUpgrade( //{
			"Tendrils of Corruption X",
			"Increases corruption production by 5%.",
			"",
			2,
			19,
			100000000000000,
			function () {subgames[0].production *= 1.05},
			function () {},
			function () {},
		);//}		
		var upgrade_12 = new CorruptionUpgrade( //{
			"Quick Split",
			"Instantly doubles current corruption (Note: this has one time use).",
			"",
			3,
			19,
			0,
			function () {},
			function () {subgames[0].credits *= 2},
			function () {},
		);//}		
		var upgrade_13 = new CorruptionUpgrade( //{
			"Quick Split II",
			"Instantly doubles current corruption (Note: this has one time use).",
			"",
			3,
			19,
			0,
			function () {},
			function () {subgames[0].credits *= 2},
			function () {},
		);//}		
		var upgrade_14 = new CorruptionUpgrade( //{
			"Quick Split III",
			"Instantly doubles current corruption (Note: this has one time use).",
			"",
			3,
			19,
			0,
			function () {},
			function () {subgames[0].credits *= 2},
			function () {},
		);//}		
		var upgrade_15 = new CorruptionUpgrade( //{
			"Sprouting Growth",
			"Increases bad seed production of corrupt farms by 400%.",
			"",
			4,
			19,
			1500000,
			function () {},
			function () {},
			function () {},
		);//}		
		var upgrade_16 = new CorruptionUpgrade( //{
			"Enduring Message",
			"Increases production by 1% per propaganda center owned.",
			"",
			5,
			19,
			50000000,
			function () {subgames[0].production *= 1 + subgames[0].buildings[2].count * 0.01},
			function () {},
			function () {},
		);//}		
		var upgrade_17 = new CorruptionUpgrade( //{
			"Cooked Books",
			"Increases bad seed production of corrupt bankers by 400%.",
			"",
			6,
			19,
			300000000,
			function () {},
			function () {},
			function () {},
		);//}		
		var upgrade_18 = new CorruptionUpgrade( //{
			"Racketeering",
			"Increases bad seed production of con artists by 400%.",
			"",
			7,
			19,
			100000000000,
			function () {},
			function () {},
			function () {},
		);//}		
		var upgrade_19 = new CorruptionUpgrade( //{
			"Corruption Production",
			"Increases bad seed production of corrupt factories by 400%.",
			"",
			8,
			19,
			5000000000000,
			function () {},
			function () {},
			function () {},
		);//}		
		var upgrade_20 = new CorruptionUpgrade( //{
			"Corrupt Assistant",
			"Unlocks an assistant that increases production in this subgame, and unlocks many unqiue abilities. The assistant grants larger bonuses and more abilities as time passes. This assistant persists through resets",
			"",
			9,
			29,
			10000000000000000000000000,
			function () {},
			function () {assistants[5].unlocked = true;updateSubgameButtons();},
			function () {},
		);//}

		this.upgrades.push(upgrade_0);
		this.upgrades.push(upgrade_1);
		this.upgrades.push(upgrade_2);
		this.upgrades.push(upgrade_3);
		this.upgrades.push(upgrade_4);
		this.upgrades.push(upgrade_5);
		this.upgrades.push(upgrade_6);
		this.upgrades.push(upgrade_7);
		this.upgrades.push(upgrade_8);
		this.upgrades.push(upgrade_9);
		this.upgrades.push(upgrade_10);
		this.upgrades.push(upgrade_11);
		this.upgrades.push(upgrade_12);
		this.upgrades.push(upgrade_13);
		this.upgrades.push(upgrade_14);
		this.upgrades.push(upgrade_15);
		this.upgrades.push(upgrade_16);
		this.upgrades.push(upgrade_17);
		this.upgrades.push(upgrade_18);
		this.upgrades.push(upgrade_19);
		this.upgrades.push(upgrade_20);
	//}

	}
	corruption_subgame.initVars = function () {
		this.vars = {};
		
		this.vars = {
			seed_production: 0,
			precise_seed: 0,
			recruiter_bonus: 0,
			icon_bonus: 0,
		}	
	}
	
	
	corruption_subgame.initBuildings();
	corruption_subgame.initUpgrades();
	corruption_subgame.initVars();
	
	subgames.push(corruption_subgame);
}
/** Represents a single building for the corruption subgame.
 * @constructor
 * @param {string} name - Name of the this building.
 * @param {int} cost - The base price of this building.
 * @param {float} base_production - The base amount of corruption credits this building will produce each second.
 * @param {float} seed_production - The base amount of bad seeds this building will produce each second.
 * @param {string} icon - The file path to the icon for this building.
 * @param {boolean} cost_increasing - Determines if this building costs more each time it is bought.
 * @param {function} onBuy - Function called when this building is bought.
 */
function CorruptionBuilding(name, cost, base_production, seed_production, icon, cost_increasing, onBuy) {
	this.name = name;
	this.base_cost = cost;
	this.cost = cost;
	this.base_production = base_production;
	this.production = base_production;
	this.cost_multiplier = 1.4;
	this.icon = icon;
	this.cost_increasing = cost_increasing;
	this.seed_base_production = seed_production;
	this.seed_production = seed_production;
	this.count = 0;
	this.onBuy = onBuy;
	this.unlocked = false;
	this.available = false;
	
	this.totalCost = function (count) {
		if (count == 10000) {count = getMaxNumberOfAffordableBuildings(subgames[0].credits, this.getCurrentCost(), this.cost_multiplier);}
		if (subgames[0].buildings.indexOf(this) == 0) {return count * 100;}
        return (this.base_cost * ((Math.pow(this.cost_multiplier, this.count) * (Math.pow(this.cost_multiplier, count) - 1)) / (this.cost_multiplier - 1)));
    };
    this.canBuy = function (count) {
		if (count == 10000) {count = getMaxNumberOfAffordableBuildings(subgames[0].credits, this.getCurrentCost(), this.cost_multiplier)}
		
        return this.totalCost(count) < subgames[0].credits;
    };
	
	this.buy = function (count) {
		if (subgames[0].credits > this.totalCost(subgames[0].buy_count)) {
			subgames[0].credits -= this.totalCost(subgames[0].buy_count);
			if (count == 10000) {this.count += getMaxNumberOfAffordableBuildings(subgames[0].credits, this.getCurrentCost(), this.cost_multiplier)}
			else {this.count += subgames[0].buy_count;}
			subgames[0].calculateProduction();

			$("#corruption_building_" + subgames[0].buildings.indexOf(this)).html(shortNumber(this.count));
		}
	}
	this.getCurrentCost = function () {
		return (this.base_cost) * Math.pow(this.cost_multiplier, this.count);
	}
	
	this.createHTML = function (container) {
			var i = subgames[0].buildings.indexOf(this);
			var seed_string = "";
			
			if (this.available && !this.unlocked) {
				var corruption_building = $(document.createElement("div"));
				corruption_building.attr("class", "corruption_building");
				corruption_building.attr("id", "corruption_available");
				corruption_building.attr("onmouseover","tooltip(this, 0, 19, 'Not Unlocked', 'Cost: ' + shortNumber(subgames[0].buildings["+i+"].cost) + '')");
				corruption_building.attr("onmouseout", "hideTooltip();");
					
					var corruption_building_img = $(document.createElement("img"));
					corruption_building_img.attr("src", "images/corruption_corrupt_question.png");
					
					corruption_building.append(corruption_building_img);	

				container.append(corruption_building);
			} else {
			
				if (subgames[0].buildings[i].seed_production != 0) {
					seed_string = ", and each produce ' + fancyNumber(subgames[0].buildings["+i+"].seed_production) + ' bad seeds per second";
				}
				if (i == 2) {
					seed_string = ", and each increases corruption production by 1%";
				}
				if (i == 4) {
					seed_string = ", and each increases the production of bad seeds by 0.1 every 10 minutes (' + fancyNumber(subgames[0].vars.recruiter_bonus) + ')";
				}			
				if (i == 6) {
					seed_string = ", and each increases total corruption production by a stacking 1% per hour (' + fancyNumber(Math.pow(1.01, subgames[0].vars.icon_bonus) * 100 - 100) + '%)";
				}
				
				var corruption_building = $(document.createElement("div"));
				corruption_building.attr("class", "corruption_building");
				corruption_building.attr("onmouseover","tooltip(this, 0, 19, '"+ subgames[0].buildings[i].name +"', 'You own ' + shortNumber(subgames[0].buildings["+i+"].count) + ' ' + subgames[0].buildings["+i+"].name +'s, that each produce ' + fancyNumber(subgames[0].buildings["+i+"].production) + ' corruption per second" + seed_string + ".<br>Cost '+ fancyNumber(subgames[0].buildings["+i+"].totalCost(subgames[0].buy_count)) + ((subgames[0].buy_count == 10000) ? (' (' + getMaxNumberOfAffordableBuildings(subgames[0].credits, subgames[0].buildings["+i+"].getCurrentCost(), subgames[0].buildings["+i+"].cost_multiplier) + ')') : ''))");
				corruption_building.attr("onmouseout", "hideTooltip();");
				corruption_building.attr("onclick", "subgames[0].buildings["+i+"].buy(subgames[0].buy_count)");
					
					var corruption_building_img = $(document.createElement("img"));
					corruption_building_img.attr("src", subgames[0].buildings[i].icon);
					
					var corruption_building_count = $(document.createElement("div"));
					corruption_building_count.attr("class", "corruption_count");
					corruption_building_count.attr("id", "corruption_building_" + i);
					corruption_building_count.html(subgames[0].buildings[i].count);
					
					corruption_building.append(corruption_building_img);	
					corruption_building.append(corruption_building_count);

				container.append(corruption_building);
				
				$("#corruption_available").remove();
			}
	}
}
/** Represents an upgrade for the corruption subgame.
 * @constructor
 * @param {string} name - Name of the this upgrade.
 * @param {string} description - Description shown on this upgrade's tooltip.
 * @param {string} flavor_text - Small flavor text to be shown on this upgrade's tooltip.
 * @param {int} x - The x location on the upgrade tiled map for this upgrade's icon
 * @param {int} y - The y location on the upgrade tiled map for this upgrade's icon
 * @param {int} price - The base cost of this upgrade.
 * @param {function} effect - This upgrade's effect, called each tick.
 * @param {function} onBuy - Function called when this upgrade is bought.
 * @param {function} evalTooltip - Function to generate tooltip.
 */
function CorruptionUpgrade(name, description, flavor_text, x, y, price, effect, onBuy, evalTooltip) {
    this.display_name = name;
    this.price = price;
    this.description = description;
    this.flavor_text = flavor_text;
    this.effect = effect;
    this.onBuy = onBuy || function () {};
    this.evalTooltip = evalTooltip || function () {};
    this.available = false;
    this.bought = false;
    this.x = x * 48;
    this.y = y * 48;

    this.updateHTML = function () {
        if (this.available && !this.bought) {
            var upgrade = $(document.createElement("div"));
			var expanded_description = upgradeDescription(this);
            upgrade.attr("style", "cursor:pointer;float:left;height:48px;width:48px;background:url(images/upgrade_sheet.png) -"+this.x+"px -"+this.y+"px;");
            upgrade.attr("onmouseover","updateUpgradeColor("+this.price+", subgames[0].credits);tooltip(this, -"+this.x/48+", -"+this.y/48+", '"+this.display_name+"', '"+expanded_description+"')");
            upgrade.attr("onmouseleave", "hideTooltip()");
            upgrade.attr("onclick", "subgames[0].upgrades["+subgames[0].upgrades.indexOf(this)+"].buy();");
            
            $("#corruption_upgrades_container").append(upgrade);
        }
    };    
	this.buy = function () {
        if (subgames[0].credits >= this.price && !this.bought) {
            subgames[0].credits -= this.price;
            this.bought = true;
            subgames[0].updateHTML();
            hideTooltip();
			this.onBuy();
        }
    };
    this.makeAvailable = function () {
        if (!this.availabe) {
            this.available = true;
            UPDATE_UPGRADES = true;
        }
    };

}
/** Updates buttons to open subgames and assistants. */
function updateSubgameButtons() {
	if (subgames[0].unlocked || assistants[0].unlocked || assistants[1].unlocked || assistants[2].unlocked || assistants[3].unlocked || assistants[4].unlocked || assistants[5].unlocked || assistants[6].unlocked || RESET_UNLOCKED || CHALLENGES_UNLOCKED || CURRENT_CHALLENGE != -1) {
		$("#subgame_title").show();
		$("#subgame_buttons_container").show();
		if (subgames[0].unlocked) {$("#corruption_subgame_button").show();} else {$("#corruption_subgame_button").hide();}
		if (assistants[0].unlocked) {$("#angelic_assistant_button").show();} else {$("#angelic_assistant_button").hide();}
		if (assistants[1].unlocked) {$("#demonic_assistant_button").show();} else {$("#demonic_assistant_button").hide();}
		if (assistants[2].unlocked) {$("#alien_assistant_button").show();} else {$("#alien_assistant_button").hide();}
		if (assistants[3].unlocked) {$("#research_assistant_button").show();} else {$("#research_assistant_button").hide();}
		if (assistants[4].unlocked) {$("#zen_assistant_button").show();} else {$("#zen_assistant_button").hide();}
		if (assistants[5].unlocked) {$("#corrupt_assistant_button").show();} else {$("#corrupt_assistant_button").hide();}
		if (assistants[6].unlocked) {$("#automation_assistant_button").show();} else {$("#automation_assistant_button").hide();}
		if (RESET_UNLOCKED) {$("#reset_menu_button").show()} else {$("#reset_menu_button").hide();}
		if (CHALLENGES_UNLOCKED) {$("#challenge_menu_button").show()} else {$("#challenge_menu_button").hide();}
		if (CURRENT_CHALLENGE != -1) {$("#challenge_display").show()} else {$("#challenge_display").hide();}
		updateCurrentChallenge();
	} else {
		$("#subgame_title").hide();
		$("#subgame_buttons_container").hide();
	}
}