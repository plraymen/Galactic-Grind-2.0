/**
 * @fileOverview Handles the creation and logic of buildings.
 */
 
// Global array to store building objects
var buildings = [];
// Global array to store switch objects for mini-menus
var switches = [];

/** Represents a single building.
 * @constructor
 * @param {string} display_name - The name of the building to be displayed on this building's background.
 * @param {string} tab_name - The name of the building to be displayed inside this building's submenu.
 * @param {string} name - Lowercase version of the param tab_name with no spaces.
 * @param {string} description - The text to be displayed in submenu to describe this building's effects to the user.
 * @param {string} explanation - A detailed explanation to be displayed when user accesses this building's help menu.
 * @param {int} cost - The base price of this building.
 * @param {float} base_production - The base amount of credits this building will produce each second.
 * @param {int} tier - The tier for this building.
 * @param {array} upgrade - An array to store upgrades that are unlocked via purchasing this building.
 * @param {string} icon - The file path to the icon for this building.
 * @param {string} tab_icon - The file path to the icon to open this building's menu.
 * @param {string} tab_icon_hover - The file path to the hovered icon to open this building's menu.
 * @param {int} x - The x location on the upgrade tiled map for this building's buy new tooltip.
 * @param {int} y - The y location on the upgrade tiled map for this building's buy new tooltip.
 */
function Building(display_name, tab_name, name, description, explanation, cost, base_production, tier, upgrade, icon, tab_icon, tab_icon_hover, x, y) {
    this.display_name = display_name;
    this.tab_name = tab_name;
    this.name = name;
    this.description = description;
    this.explanation = explanation;
    this.base_cost = cost;
    this.cost = cost;
    this.tier = tier;
    this.base_production = base_production;
    this.production = base_production;
    this.production_multiplier = 1;
    this.cost_multiplier = 1.2;
    this.upgrade = upgrade;
    this.icon = icon;
    this.tab_icon = tab_icon;
    this.tab_icon_hover = tab_icon_hover;
    this.count = 0;
	this.free_count = 0;
    this.x = -x;
    this.y = -y;
    this.unlocked = false;
	this.switched = false;
    this.minigame = null;
    this.buffs = [];
    this.stats = {
        "Credits Produced" : 0,
    };
    
    this.totalCost = function (count) {
		if (count == 10000) {count = getMaxNumberOfAffordableBuildings(CREDITS, this.getCurrentCost(), this.cost_multiplier)}
		
        return (this.cost * ((Math.pow(this.cost_multiplier, this.count - this.free_count) * (Math.pow(this.cost_multiplier, count) - 1)) / (this.cost_multiplier - 1))) / COST_REDUCTION;
    };
    this.canBuy = function (count) {
		if (count == 10000) {count = getMaxNumberOfAffordableBuildings(CREDITS, this.getCurrentCost(), this.cost_multiplier)}
		
        return this.totalCost(count) < CREDITS;
    };
    this.buy = function (count) {
		if (count == 10000) {count = getMaxNumberOfAffordableBuildings(CREDITS, this.getCurrentCost(), this.cost_multiplier)}
		
        if (this.canBuy(count)) {
			UNDO_COUNT = count;
			UNDO_PRICE = this.totalCost(count);
			UNDO_BUILDING = buildings.indexOf(this);
			UNDO_TIME = 10;
			
			
            CREDITS -= this.totalCost(count);
            this.count += count;
            UPDATE_BUILDINGS = true;
			updateBuildings();
            updateUnlocks();
			
			if (minigames[5].vars.research_tree[25].researched) {
				addClockTicks(count);
			}
			if (upgrades[197].bought) {
				minigames[5].vars.research_points += count;
			}
			
			if (minigames[12].vars.accel_target == 0) {
				minigames[12].vars.accel_bonus = Math.min(minigames[12].vars.accel_bonus + count * 0.01 , 0.15);
				minigames[12].vars.accel_time = 30;
				if (minigames[12].vars.accel_bonus == 0.15) {
					upgrades[163].makeAvailable();
					if (upgrades[163].available && upgrades[164].available && upgrades[165].available) {
						upgrades[166].makeAvailable();
					}
				}
			}
        }
		this.unlockUpgrades();
    };
	this.getCurrentCost = function () {
		return (this.cost) * Math.pow(this.cost_multiplier, this.count - this.free_count) / COST_REDUCTION
	}
	this.unlockUpgrades = function () {
        if (this.count >= 10 && this.upgrade[0] != undefined) {upgrades[this.upgrade[0]].makeAvailable()}
        if (this.count >= 25 && this.upgrade[1] != undefined) {upgrades[this.upgrade[1]].makeAvailable()}
        if (this.count >= 50 && this.upgrade[2] != undefined) {upgrades[this.upgrade[2]].makeAvailable()}
        if (this.count >= 75 && this.upgrade[3] != undefined) {upgrades[this.upgrade[3]].makeAvailable()}
        if (this.count >= 100 && this.upgrade[4] != undefined) {upgrades[this.upgrade[4]].makeAvailable()}
        if (this.count >= 125 && this.upgrade[5] != undefined) {upgrades[this.upgrade[5]].makeAvailable()}	
        if (this.count >= 150 && this.upgrade[6] != undefined) {upgrades[this.upgrade[6]].makeAvailable()}	
	}
    this.unlock = function () {
        if (CREDITS >= tierPrice(this.tier) && !this.unlocked) {
            CREDITS -= tierPrice(this.tier)
            this.count += 1;
            this.unlocked = true;
            this.createHTML();
            this.updateHTML();
			
			if (buildings.indexOf(this) < 7) {
				TIER_1_COUNT += 1;
			} else if (buildings.indexOf(this) < 14) {
				TIER_2_COUNT += 1;
			} else if (buildings.indexOf(this) < 21) {
				TIER_3_COUNT += 1;
			}
            testTierTwo();
			testTierThree();
			updateUnlocks();
            $("#tier_cost_display").html(fancyNumber(tierPrice(this.tier)));
            $("#menu_building").remove();
            hideTooltip();
			
			changeTier(this.tier);
        }
    };
    this.createHTML = function () {
        var container = $(document.createElement("div")).attr("class", "building").attr("id", "building"+this.name);
        container.attr("onclick", "if (!buildings["+buildings.indexOf(this)+"].switched) {buildings["+buildings.indexOf(this)+"].buy(BUY_COUNT)}");

            var icon = $(document.createElement("img"));
            icon.attr("src", this.icon).attr("class", "building_icon");
        
            var name = $(document.createElement("div"));
            name.attr("class", "building_name");
            name.html(this.display_name);
        
            var count = $(document.createElement("div"));
            count.attr("class", "building_count");
            count.html(this.count);
        
            var price = $(document.createElement("div"));
            price.attr("class", "building_price");
            price.html("120.000 Quintillion");
        
            var buff_container = $(document.createElement("div"));
            buff_container.attr("class", "building_buff");
			
			var switch_icon = $(document.createElement("img"));
			switch_icon.attr("class", "switch_icon");
			switch_icon.attr("src", "images/icon_switch.png");
			switch_icon.attr("onclick", "switchBuilding(" + buildings.indexOf(this) + ");stopProp(event)");
        
            var tab_icon = $(document.createElement("img"));
            tab_icon.attr("src", this.tab_icon).attr("class", "tab_icon");
            tab_icon.attr("onmousedown", "$(this).attr('src', '"+this.tab_icon_hover+"')");
            tab_icon.attr("onmouseleave", "$(this).attr('src', '"+this.tab_icon+"')");
            tab_icon.attr("onclick", "$(this).attr('src', '"+this.tab_icon+"');toggleBuildingTab(buildings["+buildings.indexOf(this)+"]);event.stopPropagation();");
        
        container.append(icon);
        container.append(name);
        container.append(count);
        container.append(price);
        container.append(buff_container);
        container.append(tab_icon);
        if (SWITCHER) {container.append(switch_icon)}
        $("#buildings_container").append(container);  
		
		if (this.switched) {
			this.switched = false;
			this.switcher();
		}
    };
    this.updateHTML = function () {
        if (!this.switched) {
			var building = $("#building"+this.name);
			building.find(".building_count").html(this.count);
			
			if (BUY_COUNT == 10000) {building.find(".building_price").html(fancyNumber(this.totalCost(BUY_COUNT)) + "(" + getMaxNumberOfAffordableBuildings(CREDITS, this.getCurrentCost(), this.cost_multiplier) + ")");}
			else {building.find(".building_price").html(fancyNumber(this.totalCost(BUY_COUNT)));}
			
			if (CREDITS < this.totalCost(BUY_COUNT)) {
				building.find(".building_price").attr("style", "color:#e02900;text-shadow:0px 0px 8px #ff451c");
			} else {
				building.find(".building_price").attr("style", "color:#085415;text-shadow:0px 0px 8px #32b54a");
			}
			
			var buff_container = building.find(".building_buff")
			buff_container.empty();
				if (minigames[3].vars.powered_buildings.includes(buildings.indexOf(this))) {
					var overcharge_icon = $(document.createElement("img")).attr("src", "images/building_buff_overcharge.png");
					buff_container.append(overcharge_icon);
				}
				
				if (minigames[10].vars.powered_buildings.includes(buildings.indexOf(this))) {
					var aliencharge_icon = $(document.createElement("img")).attr("src", "images/building_buff_alien.png");
					buff_container.append(aliencharge_icon);
				}
				
				if (alien_target == buildings.indexOf(this)) {
					var experiment_icon = $(document.createElement("img")).attr("src", "images/building_buff_research.png");
					buff_container.append(experiment_icon);
				}

				if (minigames[15].vars.epiphany_target == buildings.indexOf(this)) {
					var epiphany_icon = $(document.createElement("img")).attr("src", "images/building_buff_epiphany.png");
					buff_container.append(epiphany_icon);
				}
				
				if (minigames[14].vars.clone_targets.includes(buildings.indexOf(this))) {
					var clone_icon = $(document.createElement("img")).attr("src", "images/building_buff_clone.png");
					buff_container.append(clone_icon);
				}
			
			var len = this.buffs.length;
			for (var i = 0; i < len; i++) {
				var icon = $(document.createElement("img")).attr("src", this.buffs[i].icon);
				buff_container.append(icon);
			}
		}
    };
	this.updatePriceColor = function () {
		if (!this.switched) {
			var building = $("#building"+this.name);
			
			if (CREDITS < this.totalCost(BUY_COUNT)) {
				building.find(".building_price").attr("style", "color:#e02900;text-shadow:0px 0px 8px #ff451c");
			} else {
				building.find(".building_price").attr("style", "color:#085415;text-shadow:0px 0px 8px #32b54a");
			}
		}
	}
    this.renderMinigame = function () {
        console.log("No minigame to render");
    };
    this.addBuff = function (buff) {
        UPDATE_BUILDINGS = true;
        
        var len = this.buffs.length;
        for (var i = 0; i < len; i++) {
            if (this.buffs[i].name == buff.name) {
                
            } 
        }
        this.buffs.push(buff);
    };
	this.switcher = function () {
		this.switched = !this.switched;
		if (this.switched) {
			var children = $("#building"+this.name).children();
			$(children[1]).hide();
			$(children[2]).hide();
			$(children[3]).hide();
			$(children[4]).hide();
			
			var building_id = buildings.indexOf(this);
			$("#building"+this.name).append(switches[building_id].createHTML(this.name));
			$("#building"+this.name).append(switches[building_id].createStorageBar());
			switches[building_id].tooltip(this.name);
		} else {
			$("#building"+this.name).children().show();
			$("#switched"+this.name).remove();
			$("#storage_bar"+this.name).remove();
		}
	}	
}
/** Updates the HTML for each building's price display */
function updateBuildingPrices() {
	for (var i = 0; i < buildings.length; i++) {
		buildings[i].updatePriceColor();
	}
	
	if (CREDITS < tierPrice(CURRENT_TIER)) {
		$("#tier_cost_display").attr("style", "color:#e02900;text-shadow:0px 0px 8px #ff451c");
	} else {
		$("#tier_cost_display").attr("style", "color:#085415;text-shadow:0px 0px 8px #32b54a");
	}
}
/** Changes the building's displayed to the ones of the specified tier.
 * @param {int} tier - The tier to be switched to.
 */
function changeTier(tier) {
	if (CURRENT_TIER != tier) {
		$("#button_tier_1").attr("src", "images/tier_1.png");
		$("#button_tier_2").attr("src", "images/tier_2.png");
		$("#button_tier_3").attr("src", "images/tier_3.png");
		$("#button_tier_" + tier).attr("src", "images/tier_" + tier + "_active.png");
	}
	
	CURRENT_TIER = tier;
	UPDATE_BUILDINGS = true;
	
	$("#buy_new").hide();
	
	if (tier == 1 && TIER_1_COUNT < 7) {
		$("#buy_new").show();
	} else if (tier == 2 && TIER_2_COUNT < 7) {
		$("#buy_new").show();
	} else if (tier == 3 && TIER_3_COUNT < 7) {
		$("#buy_new").show();
	}
	
    var len = buildings.length;
    for (var i = 0; i < len; i++) {
		//buildings[i].switched = false;
        $("#building"+buildings[i].name).remove();
		if (buildings[i].tier == CURRENT_TIER && buildings[i].unlocked) {buildings[i].createHTML();}
		UPDATE_BUILDINGS = true;
		
    }
	
	$("#tier_cost_display").html(fancyNumber(tierPrice(CURRENT_TIER)));
	updateBuildingEffects();
	updateBuildingPrices();
	updateBuildings();
}
/** Updates each building's HTML */
function updateBuildings() {
    if (!UPDATE_BUILDINGS) return;
    
    var len = buildings.length;
    for (var i = 0; i < len; i++) {
        if (buildings[i].tier == CURRENT_TIER) {buildings[i].updateHTML();}
    }
    
    UPDATE_BUILDINGS = false;
}
/** Instantiates all buildings, and each building's stats. */
function initBuildings() {
    var cultist = new Building("Cultist",
                               "Cultist", 
                               "cultist",
                               "Cultists generate blood which can be used to activate a variety of effects.",
                               "Cultists slowly generate blood which can be used to activate various effects, using the below buttons.",
                               83.33, 
                               4, 
                               1,
                               [0, 1, 2, 3, 4, 5, 99],
                               "images/building_icon_cultist.png", 
                               "images/building_tab_cultist.png", 
                               "images/building_tab_cultist_hover.png",
                               5,
                               1);
    cultist.stats["Rituals Performed"] = 0;
    cultist.stats["Blood Spent"] = 0;
	
	var mine = new Building("Mine",
                               "Mine", 
                               "mine",
                               "Mines slowly produce gold bars, which can be exchange for various other currencies.",
                               "Mines slowly produce gold bars, which can be exchange for various other currencies. How many gold bars you own is displayed below.",
                               83.33, 
                               4, 
                               1,
                               [10, 11, 12, 13, 14, 15, 100],
                               "images/building_icon_mine.png", 
                               "images/building_tab_mine.png", 
                               "images/building_tab_mine_hover.png",
                               3,
                               2);
    mine.stats["Gold Mined"] = 0;
    
    var gambler = new Building("Gambler",
                               "Gambler", 
                               "gambler",
                               "Gamblers slowly store card draws. These can be used to activate one of many random effects. After one effect is activated, that effect will not be chosen until all others are chosen first.",
                               "Gamblers slowly store card draws. These can be used to activate one of many random effects. After one effect is activated, that effect will not be chosen until all others are chosen first.",
                               83.33, 
                               4, 
                               1,
                               [30, 31, 32, 33, 34, 35, 101],
                               "images/building_icon_gambler.png", 
                               "images/building_tab_gambler.png", 
                               "images/building_tab_gambler_hover.png",
                               5,
                               4);
    gambler.stats["Cards Drawn"] = 0;
    gambler.stats["Cards Discarded"] = 0;
	
	var power = new Building("Power",
                               "Power Plant", 
                               "power_plant",
                               "Power Plants generate power that can be used to temporarily increase production and working speed of other buildings.",
                               "Power Plants generate power that can be used to temporarily increase production and working speed of other buildings by 50%. This can be activated inside other building&#39;s tabs.",
                               83.33, 
                               4, 
                               1,
                               [40, 41, 42, 43, 44, 45, 102],
                               "images/building_icon_power.png", 
                               "images/building_tab_power.png", 
                               "images/building_tab_power_hover.png",
                               0,
                               5);
	
	var bank = new Building("Bank",
                               "Bank", 
                               "bank",
                               "Banks grant the ability to lend money for a greater pay-off later, and the ability to buy gold bars (gold bars can be used in exchange for other building&#39;s currencies).",
                               "Banks grant the ability to lend money for a greater pay-off later, and the ability to buy gold bars (gold bars can be used in exchange for other building&#39;s currencies).",
                               83.33, 
                               4, 
                               1,
                               [50, 51, 52, 53, 54, 55, 103],
                               "images/building_icon_bank.png", 
                               "images/building_tab_bank.png", 
                               "images/building_tab_bank_hover.png",
                               5,
                               6);
    bank.stats["Investments Made"] = 0;
	
	var research = new Building("Research",
                               "Research Center", 
                               "research_center",
                               "Research Centers slowly generate research points which can be used to buy various effects.",
                               "Research Centers slowly generate research points which can be used to buy various effects from the pannable area below.",
                               83.33, 
                               4, 
                               1,
                               [60, 61, 62, 63, 64, 65, 104],
                               "images/building_icon_research.png", 
                               "images/building_tab_research.png", 
                               "images/building_tab_research_hover.png",
                               0,
                               7);
	research.stats["Researches Made"] = 0;
	
	var factory = new Building("Factory",
                               "Factory", 
                               "factory",
                               "Factories grant the ability to automate various aspects of other buildings.",
                               "Factories grant the ability to automate various aspects of other buildings.",
                               83.33, 
                               4, 
                               1,
                               [66, 67, 68, 69, 70, 71, 105],
                               "images/building_icon_factory.png", 
                               "images/building_tab_factory.png", 
                               "images/building_tab_factory_hover.png",
                               0,
                               8);
	
	var bonus = new Building("Bonus",
						    "Bonus Factory", 
						    "bonus_factory",
						    "Bonus factories slowly store random bonuses which can later be manually activated.",
						    "Bonus factories slowly store random bonuses which can later be manually activated.",
						    1423828125000000, //Cost 1.42 Quadrillion
						    10000000000000, //10 Trillion Production
						    2,
						    [107, 108, 109, 110, 111, 112],
						    "images/building_icon_buff.png", 
						    "images/building_tab_buff.png", 
						    "images/building_tab_buff_hover.png",
						    0,
						    12);
							
	bonus.stats["Total Bonuses"] = 0;
							
	var click = new Building("Click",
						    "Click Farm", 
						    "click_farm",
						    "Click farms slowly generate clicks which can be used to click in a predetermined path.",
						    "Click farms slowly generate clicks which can be used to click in a predetermined path.",
						    1423828125000000, //Cost 1.42 Quadrillion
						    10000000000000, //10 Trillion Production
						    2,
						    [117, 118, 119, 120, 121, 122],
						    "images/building_icon_click.png", 
						    "images/building_tab_click.png", 
						    "images/building_tab_click_hover.png",
						    0,
						    13);
							
	click.stats["Clicks Made"] = 0;
							
	var cryogenic = new Building("Cryogenic",
						    "Cryogenic Lab", 
						    "cryogenic_lab",
						    "Cryogenic labs allow you to freeze one temporary bonus at a time. This essentially allows you to store a temporary bonus for later use.",
						    "Cryogenic labs allow you to freeze one temporary bonus at a time. This essentially allows you to store a temporary bonus for later use. Click on a temporary bonus to freeze it.",
						    1423828125000000, //Cost 1.42 Quadrillion
						    10000000000000, //10 Trillion Production
						    2,
						    [127, 128, 129, 130, 131, 132],
						    "images/building_icon_cryogenic.png", 
						    "images/building_tab_cryogenic.png", 
						    "images/building_tab_cryogenic_hover.png",
						    0,
						    14);
							
	var alien = new Building("Alien",
						    "Alien Lab", 
						    "alien_lab",
						    "Alien Labs generate alien research, which can be used to boost the production of other buildings by 75%, but decreases the building&#39;s work rate by 25%.",
						    "Alien Labs generate alien research, which can be used to boost the production of other buildings by 75%, but decreases the building&#39;s work rate by 25%.",
						    1423828125000000, //Cost 1.42 Quadrillion
						    10000000000000, //10 Trillion Production
						    2,
						    [137, 138, 139, 140, 141, 142],
						    "images/building_icon_alien.png", 
						    "images/building_tab_alien.png", 
						    "images/building_tab_alien_hover.png",
						    0,
						    15);
							
	var computer = new Building("Computer",
						    "Mainframe Computer", 
						    "mainframe_computer",
						    "Mainframe computers grants the ability to activate &quot;programs&quot;. These programs have 2 positive and 2 negative effects that will occur over time.",
						    "Mainframe computers grants the ability to activate &quot;programs&quot;. These programs have 2 positive and 2 negative effects that will occur over time.",
						    1423828125000000, //Cost 1.42 Quadrillion
						    10000000000000, //10 Trillion Production
						    2,
						    [147, 148, 149, 150, 151, 152],
						    "images/building_icon_computer.png", 
						    "images/building_tab_computer.png", 
						    "images/building_tab_computer_hover.png",
						    0,
						    16);
							
	computer.stats["Programs Ran"] = 0;
							
	var acceleration = new Building("Accel",
						    "Acceleration Lab", 
						    "acceleration_lab",
						    "Acceleration labs grant the ability to toggle though various effects that increase in power during continuous use.",
						    "Acceleration labs grant the ability to toggle though various effects that increase in power during continuous use.",
						    1423828125000000, //Cost 1.42 Quadrillion
						    10000000000000, //10 Trillion Production
						    2,
						    [157, 158, 159, 160, 161, 162],
						    "images/building_icon_acceleration.png", 
						    "images/building_tab_acceleration.png", 
						    "images/building_tab_acceleration_hover.png",
						    0,
						    17);
							
	var fluctuation = new Building("Flux",
						    "Fluctuation Lab", 
						    "fluctuation_lab",
						    "Fluctuation labs will produce one large random effect once every 25 to 35 minutes.",
						    "Fluctuation labs will produce one large random effect once every 25 to 35 minutes.",
						    1423828125000000, //Cost 1.42 Quadrillion
						    10000000000000, //10 Trillion Production
						    2,
						    [167, 168, 169, 170, 171, 172],
						    "images/building_icon_fluctuation.png", 
						    "images/building_tab_fluctuation.png", 
						    "images/building_tab_fluctuation_hover.png",
						    0,
						    18);
							
	fluctuation.stats["Total Fluctuations"] = 0;	
	
	var clone = new Building("Clone",
						    "Cloning Lab", 
						    "cloning_lab",
						    "Periodically can double the production and work rate of a tier 1 or tier 2 building.",
						    "Can double the production and work rate of a tier 1 or tier 2 building. This can be activated inside other building&#39;s tabs. Base production is " + tweaker.general.tier_3_base_multiplier + "x the greatest base production of all tier 1 or tier 2 buildings increased by 0.2% per the maximum number of one building owned.",
						    83330000000000000000000000000, //Cost 83.33 Octillion
						    0, //0 Trillion Production
						    3,
						    [167, 168, 169, 170, 171, 172],
						    "images/building_icon_clone.png", 
						    "images/building_tab_clone.png", 
						    "images/building_tab_clone_hover.png",
						    0,
						    24);
							
	clone.stats["Total Clones"] = 0;
	
	var epiphany = new Building("Epiphany",
						    "Epiphany Center", 
						    "epiphany_center",
						    "Periodically triples the production of a random tier 1 or tier 2 building for a short time.",
						    "Once every 5 minutes triples the production of a random tier 1 or tier 2 building for 30 seconds. Base production is " + tweaker.general.tier_3_base_multiplier + "x the greatest base production of all tier 1 or tier 2 buildings increased by 0.2% per the maximum number of one building owned.",
						    83330000000000000000000000000, //Cost 83.33 Octillion
						    0, //0 Trillion Production
						    3,
						    [167, 168, 169, 170, 171, 172],
						    "images/building_icon_epiphany.png", 
						    "images/building_tab_epiphany.png", 
						    "images/building_tab_epiphany_hover.png",
						    0,
						    25);
							
	epiphany.stats["Total Epiphanies"] = 0;	
	
	var merchant = new Building("Merchant",
						    "Merchant", 
						    "merchant",
						    "Periodically advances a random tier one or tier two building forward 10 minutes.",
						    "Once every 5 minutes advances a random tier one or tier two building forward 10 minutes.",
						    83330000000000000000000000000, //Cost 83.33 Octillion
						    0, //0 Trillion Production
						    3,
						    [167, 168, 169, 170, 171, 172],
						    "images/building_icon_trading.png", 
						    "images/building_tab_trading.png", 
						    "images/building_tab_trading_hover.png",
						    0,
						    26);
							
	merchant.stats["Total Packages"] = 0;
	
	var warp = new Building("Warp",
						    "Warp Facility", 
						    "warp_facility",
						    "Warp facilities grant the ability to grant a small time-frame worth of production periodically.",
						    "Warp facilities grant the ability to grant a small time-frame worth of production periodically. Base production is " + tweaker.general.tier_3_base_multiplier + "x the greatest base production of all tier 1 or tier 2 buildings increased by 0.2% per the maximum number of one building owned.",
						    83330000000000000000000000000, //Cost 83.33 Octillion
						    0, //0 Trillion Production
						    3,
						    [107, 108, 109, 110, 111, 112],
						    "images/building_icon_warp.png", 
						    "images/building_tab_warp.png", 
						    "images/building_tab_warp_hover.png",
						    0,
						    27);
	
	warp.stats["Total Warps"] = 0;	
	
	var stellar = new Building("Stellar",
						    "Stellar Factory", 
						    "stellar_factory",
						    "Stellar Factories&apos; production will not decrease, even when temporary bonuses wear off.",
						    "Stellar Factories&apos; production will not decrease, even when temporary bonuses wear off. Base production is " + tweaker.general.tier_3_base_multiplier + "x the greatest base production of all tier 1 or tier 2 buildings increased by 0.2% per the maximum number of one building owned.",
						    83330000000000000000000000000, //Cost 83.33 Octillion
						    0, //0 Trillion Production
						    3,
						    [277, 278, 279, 280],
						    "images/building_icon_stellar.png", 
						    "images/building_tab_stellar.png", 
						    "images/building_tab_stellar_hover.png",
						    0,
						    28);	
							
	var temporal = new Building("Temporal",
						    "Temporal Research Lab", 
						    "temporal_research_lab",
						    "Temporal Research Labs grants the ability to toggle various effects that effect the passage of time.",
						    "Temporal Research Labs grants the ability to toggle various effects that effect the passage of time. Base production is " + tweaker.general.tier_3_base_multiplier + "x the greatest base production of all tier 1 or tier 2 buildings increased by 0.2% per the maximum number of one building owned.",
						    83330000000000000000000000000, //Cost 83.33 Octillion
						    0, //0 Trillion Production
						    3,
						    [281, 282, 283, 284, 285, 286, 287],
						    "images/building_icon_temporal.png", 
						    "images/building_tab_temporal.png", 
						    "images/building_tab_temporal_hover.png",
						    0,
						    29);	
							
	var political = new Building("Political",
						    "Political Center", 
						    "political_center",
						    "Political centers grant the ability to periodically activate decrees that have a variety of effects.",
						    "Political centers grant the ability to periodically activate decrees that have a variety of effects. Base production is " + tweaker.general.tier_3_base_multiplier + "x the greatest base production of all tier 1 or tier 2 buildings increased by 0.2% per the maximum number of one building owned.",
						    83330000000000000000000000000, //Cost 83.33 Octillion
						    0, //0 Trillion Production
						    3,
						    [],
						    "images/building_icon_political.png", 
						    "images/building_tab_political.png", 
						    "images/building_tab_political_hover.png",
						    0,
						    30);
							   
    buildings.push(cultist);
	buildings.push(mine);
    buildings.push(gambler);
    buildings.push(power);
    buildings.push(bank);
    buildings.push(research);
    buildings.push(factory);
    buildings.push(bonus);
    buildings.push(click);
    buildings.push(cryogenic);
    buildings.push(alien);
    buildings.push(computer);
    buildings.push(acceleration);
    buildings.push(fluctuation);
    buildings.push(clone);
    buildings.push(epiphany);
    buildings.push(merchant);
    buildings.push(warp);
    buildings.push(stellar);
    buildings.push(temporal);
    buildings.push(political);
}
/** Unlocks the specified building.
 * @param {string} name - The name of the building to unlock.
 */
function unlockBuilding(name) {
    var len = buildings.length;
    for (var i = 0; i < len; i++) {
        if (buildings[i].name == name) {
            buildings[i].unlock();
        }
    }
}
/** Calculates the price to unlock the next building of the specified tier.
 * @param {int} tier - The tier to use for calculation.
 * @return - The price of the next building.
 */
function tierPrice(tier) {
    var tier_unlocked = 0;
    var tier_1_base_cost = 1;

    for (var i = 0; i < buildings.length; i++) {
        var building = buildings[i];
        if (building.tier == tier && building.unlocked) {
            tier_unlocked += 1;   
        }
    }
        
    var cost = Math.pow(150, tier_unlocked);
	
	if (tier == 2) {cost = Math.pow(150, tier_unlocked) * 1000000000000000}
	
	if (tier == 3) {cost = Math.pow(150, tier_unlocked) * 100000000000000000000000000000}
    
    return cost;
}
/** Creates the HTML for the submenu of the given building object.
 * @param {Building} building - The building to be used to create the submenu.
 */
function createBuildingTab(building) {
    $(".building_tab").remove();
    
    var building = building;
    var building_index = buildings.indexOf(building);
    
    var tab = $(document.createElement("div"));
    tab.attr("id", building.name).attr("class", "building_tab")
    
    
    var title = $(document.createElement("div"));
    title.attr("class", "building_tab_title");
    title.html(building.tab_name);
    
    var sidebar = $(document.createElement("div"));
    sidebar.attr("class", "building_tab_sidebar").attr("id", "building_tab_sidebar");
    
    
    var stats = $(document.createElement("img"));
    stats.attr("src", "images/icon_stats.png");
    stats.attr("style", "cursor:pointer");
	stats.attr("onclick", "minigames["+building_index+"].createDetails();$('#detail_container').children(':nth-child(3)').children(':nth-child(2)').show();MENU_CLOSE = false;$('#detail_container').attr('onclick', 'MENU_CLOSE = false;');")
    stats.attr("onmouseover","tooltip(this, -0, -0, '"+building.display_name+"'+' Stats', calculateStats("+building_index+"))");
    stats.attr("onmouseout", "hideTooltip();");
    
    var help = $(document.createElement("img"));
    help.attr("src", "images/icon_info.png");
    help.attr("style", "cursor:pointer");
    help.attr("onmouseover","tooltip(this, 1, -0, '"+building.display_name+"'+' Help', 'Click to view detailed information about this building, including stats, help, and upgrades.');MENU_CLOSE = false;");
    help.attr("onmouseout", "hideTooltip();");
    help.attr("onclick", "minigames["+building_index+"].createDetails();MENU_CLOSE = false;$('#detail_container').attr('onclick', 'MENU_CLOSE = false;');")    
	
	var building_upgrade_container = $(document.createElement("div"));
		building_upgrade_container.attr("style", "position:relative;z-index:19");
		building_upgrade_container.attr("id", "hover_upgrade_container");
		building_upgrade_container.attr("onmouseenter", "hoverUpgrades("+building_index+")");
		building_upgrade_container.attr("onmouseleave", "$('#upgrade_hover_display').remove();")
	
	var building_upgrades = $(document.createElement("img"));
    building_upgrades.attr("src", "images/icon_upgrades.png");
    building_upgrades.attr("style", "cursor:pointer");
	
	building_upgrade_container.append(building_upgrades);
    
    var close_button = $(document.createElement("img"));
    close_button.attr("src", "images/button_x.png").attr("height", "48").attr("width", "48");
    close_button.attr("onclick", "toggleBuildingTab(buildings["+building_index+"]);");
    close_button.attr("style", "position:absolute;left:0px;top:12px;cursor:pointer");
	close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
	close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
    
    sidebar.append(stats);
    sidebar.append(help);
    sidebar.append(building_upgrade_container);
    
    tab.append(sidebar);
    tab.append(title);
    tab.append(close_button);
    $("#center_content").append(tab);
    
    minigames[building_index].createHTML();
    SHOWN_TAB = building_index;
}
/** Creates the HTML for the specified building's upgrades to be displayed on hover.
 * @param {int} building_id - The index of the building to be displayed.
 */
function hoverUpgrades(building_id) {
	$("#upgrade_hover_display").remove();
	
	var upgrades_string = "<div style='position:absolute;left:52px;top:-16px;width:340px;'><br>";
	
	for (var i = 0; i < minigames[building_id].upgrades.length; i++) {
		upgrades_string += stringUpgrade(minigames[building_id].upgrades[i], upgradeHelpX(building_id), upgradeHelpY(building_id), true);
	}
	
	upgrades_string += "</div>"
	
	var upgrade_display = $(document.createElement("div"));
		upgrade_display.attr("id", "upgrade_hover_display");
		upgrade_display.attr("style", "z-index:99999999;width:340px;");
	upgrade_display.html(upgrades_string);
	
	$("#hover_upgrade_container").append(upgrade_display);
}
/** Toggles the submenu of the given building object.
 * @param {Building} building - The building to be used to create the submenu.
 */
function toggleBuildingTab(building) {
	hideTooltip();
	
    if (!document.getElementById(building.name)) {
		$(".tab_icon").removeClass("tab_icon_extended");
		var temp = $("#building" + building.name).find(".tab_icon");
		temp.addClass("tab_icon_extended");
        createBuildingTab(building);
    } else {
        $(".building_tab").remove();
		$("#building_automation_background").remove();
		$(".tab_icon").removeClass("tab_icon_extended");
		$("#fullscreen_research").hide();
		$("#close_fullscreen").hide();
		minigames[5].vars.fullscreen = false;
		minigames[5].vars.research_camera.x += 225;
		minigames[5].vars.research_camera.y += 135;
        SHOWN_TAB = -1;
    }
	
	toggleBuffLocation();
}
/** Generates the statistics to be displayed for the specified building.
 * @param {int} building_id - The index of the building to be displayed.
 * @return {string} - The statistics text.
 */
function calculateStats(building_id) {
    var building = buildings[building_id];
    
    var stats_string = "";
    for (var property in building.stats) {
      if (building.stats.hasOwnProperty(property)) {
        stats_string += property + ": " + fancyNumber(building.stats[property]);
        stats_string += "<br>"
      }
    }
    
    return stats_string;
}
/** Sets the TIER_ONE_COUNT variable to be the total number of tier one buildings. */
function tierOneCount() {
	TIER_ONE_COUNT = 0;
	for (var i = 0; i < 7; i++) {
		TIER_ONE_COUNT += buildings[i].count;
	}
}
/** Utility function modified from Jim808's code: https://www.reddit.com/r/incremental_games/comments/3tki2w/incremental_game_math_functions/ */
function getMaxNumberOfAffordableBuildings(money, singlePurchaseCost, costBase) {
        if (singlePurchaseCost > money) {
            return 1;
        }
        var result = Math.log(1 + ((costBase - 1) * money / singlePurchaseCost)) / Math.log(costBase);
        result = Math.floor(result);

        return result;
}
