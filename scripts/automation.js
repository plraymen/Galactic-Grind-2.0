/**
 * @fileOverview Handles the automation of buying buildings, and automatically activating building effects.
 */

//Global array to store automation information.
var automation = [];
/** Autobuys buildings, and calls automationTick in each automation object. */
function automationTick() {
	for (var i = 0; i < automation.length; i++) {
		if (automation[i].autobuy) {
			buildings[i].buy(1);
		}
		if (automation[i].automationTick) {
			automation[i].automationTick();
		}
	}
}
/** Stores automation data of a building.
 * @constructor
 */
function Automation() {
	this.autobuy = false;
}
/** Initializes all automation data for each building. */
function initAutomation() {
	var cultist_automation = new Automation();
	
	cultist_automation.vars = {
		target_ritual: -1,
		target_cost: 0,
	}
	cultist_automation.createHTML = function () {
		var autoritual_div = $(document.createElement("div"));
			autoritual_div.attr("id", "autoritual_div");
			autoritual_div.attr("style", "font-size: 130%;");
			autoritual_div.html("<br>Automatic Rituals:");
		
        var ritual_rush = $(document.createElement("img"));
			ritual_rush.attr("src", "images/ritual_blood_rush.png").attr("width", "48").attr("id", "cultist_automation_0");
			ritual_rush.attr("class", "automatable");
			ritual_rush.attr("onclick", "automation[0].automate(0, 75, this);");        
			
		var ritual_time = $(document.createElement("img"));
			ritual_time.attr("src", "images/ritual_of_time.png").attr("width", "48").attr("id", "cultist_automation_1");
			ritual_time.attr("class", "automatable");
			ritual_time.attr("onclick", "automation[0].automate(1, 60, this);");		
			
		var ritual_purity = $(document.createElement("img"));
			ritual_purity.attr("src", "images/ritual_of_purity.png").attr("width", "48").attr("id", "cultist_automation_2");
			ritual_purity.attr("class", "automatable");
			ritual_purity.attr("onclick", "automation[0].automate(2, 110, this);");		
		
		var ritual_soot = $(document.createElement("img"));
			ritual_soot.attr("src", "images/ritual_of_soot.png").attr("width", "48").attr("id", "cultist_automation_3");
			ritual_soot.attr("class", "automatable");
			ritual_soot.attr("onclick", "automation[0].automate(3, 95, this);");		
			
		var ritual_karma = $(document.createElement("img"));
			ritual_karma.attr("src", "images/ritual_of_karma.png").attr("width", "48").attr("id", "cultist_automation_4");
			ritual_karma.attr("class", "automatable");
			ritual_karma.attr("onclick", "automation[0].automate(4, 75, this);");		
		
		var ritual_construction = $(document.createElement("img"));
			ritual_construction.attr("src", "images/ritual_of_construction.png").attr("width", "48").attr("id", "cultist_automation_5");
			ritual_construction.attr("class", "automatable");
			ritual_construction.attr("onclick", "automation[0].automate(5, 60, this);");
		
		$("#building_automation_background").append(autoritual_div);
		$("#building_automation_background").append(ritual_rush);
		$("#building_automation_background").append($(document.createTextNode(" ")));
		$("#building_automation_background").append(ritual_construction);
		$("#building_automation_background").append($(document.createTextNode(" ")));
		$("#building_automation_background").append(ritual_time);
		if (unlocks[1].unlocked) {
			$("#building_automation_background").append($(document.createTextNode(" ")));
			$("#building_automation_background").append(ritual_soot);
		}
		if (unlocks[2].unlocked) {
			$("#building_automation_background").append($(document.createTextNode(" ")));
			$("#building_automation_background").append(ritual_purity);
		}
		if (unlocks[3].unlocked) {
			$("#building_automation_background").append($(document.createTextNode(" ")));
			$("#building_automation_background").append(ritual_karma);
		}

		
		if (this.vars.target_ritual != -1) {
			$("#cultist_automation_" + this.vars.target_ritual).addClass("automated");
		}
	}
	cultist_automation.automate = function(ritual, cost, ele) {
		if (this.vars.target_ritual == ritual) {
			this.vars.target_ritual = -1;
			$(ele).removeClass("automated");
		} else {
			this.vars.target_ritual = ritual;
			this.vars.target_cost = cost;
			
			$('.automatable').each(function() {
				$(this).removeClass("automated");
			});
			
			$(ele).addClass("automated");
		}
	}
	cultist_automation.automationTick = function () {
		if (this.vars.target_ritual != -1) {
			performRitual(this.vars.target_ritual, this.vars.target_cost, true);
		}
	}
	
	var mine_automation = new Automation();
	
	mine_automation.vars = {};
	mine_automation.createHTML = function () {
		
	}
	

	var gambler_automation = new Automation();
	
	gambler_automation.vars = {
		auto_draw: false,
	}
	gambler_automation.createHTML = function () {
		var autodraw_div = $(document.createElement("div"));
			autodraw_div.attr("id", "autodraw_div");
			autodraw_div.attr("style", "font-size: 130%;");
			autodraw_div.html("<br>Autodraw:");
			
		var autodraw_button = $(document.createElement("div"));
			autodraw_button.attr("onclick", "automation[2].automate()");
			autodraw_button.attr("id", "autodraw_button");
			if (this.vars.auto_draw) {
				autodraw_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
				autodraw_button.html("ON");
			} else {
				autodraw_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
				autodraw_button.html("OFF");
			}
			
		$("#building_automation_background").append(autodraw_div);
		$("#building_automation_background").append(autodraw_button);
	}
	gambler_automation.automate = function () {
		this.vars.auto_draw = !this.vars.auto_draw;
		
		var autodraw_button = $("#autodraw_button");
		if (this.vars.auto_draw) {
			autodraw_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
			autodraw_button.html("ON");
		} else {
			autodraw_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
			autodraw_button.html("OFF");
		}
	}
	gambler_automation.automationTick = function () {
		if (this.vars.auto_draw && !karma_upgrades[38].bought) {
			drawCard(true);
		} else if (this.vars.auto_draw) {
			smarterGambler();
		}
	}

	var power_automation = new Automation();
	power_automation.vars = {};
	power_automation.createHTML = function () {
		
	}	
	
	var bank_automation = new Automation();
	
	bank_automation.vars = {
		auto_invest: false,
		auto_cash_to_gold: false,
		auto_gold_to_cash: false,
	}
	bank_automation.createHTML = function () {
		var autoinvest_div = $(document.createElement("div"));
			autoinvest_div.attr("id", "autoinvest_div");
			autoinvest_div.attr("style", "font-size: 130%;");
			autoinvest_div.html("<br>Autoinvest:");
			
		var autoinvest_button = $(document.createElement("div"));
			autoinvest_button.attr("onclick", "automation[4].automate(0)");
			autoinvest_button.attr("id", "autoinvest_button");
			if (this.vars.auto_invest) {
				autoinvest_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
				autoinvest_button.html("ON");
			} else {
				autoinvest_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
				autoinvest_button.html("OFF");
			}	
	
		if (buildings[1].count >= 1) {
			var autocash_div = $(document.createElement("div"));
				autocash_div.attr("id", "autocash_div");
				autocash_div.attr("style", "font-size: 130%;");
				autocash_div.html("<br>Auto-Cash-To-Gold:");
			
			var autocash_button = $(document.createElement("div"));
				autocash_button.attr("onclick", "automation[4].automate(1)");
				autocash_button.attr("id", "autocash_button");
				if (this.vars.auto_cash_to_gold) {
					autocash_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
					autocash_button.html("ON");
				} else {
					autocash_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
					autocash_button.html("OFF");
				}		
			
			var autogold_div = $(document.createElement("div"));
				autogold_div.attr("id", "autogold_div");
				autogold_div.attr("style", "font-size: 130%;");
				autogold_div.html("<br>Auto-Gold-To-Cash:");
			
			var autogold_button = $(document.createElement("div"));
				autogold_button.attr("onclick", "automation[4].automate(2)");
				autogold_button.attr("id", "autogold_button");
				if (this.vars.auto_gold_to_cash) {
					autogold_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
					autogold_button.html("ON");
				} else {
					autogold_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
					autogold_button.html("OFF");
				}
		}
			
		$("#building_automation_background").append(autoinvest_div);
		$("#building_automation_background").append(autoinvest_button);
		if (buildings[1].count >= 1) {
			$("#building_automation_background").append(autocash_div);
			$("#building_automation_background").append(autocash_button);
			$("#building_automation_background").append(autogold_div);
			$("#building_automation_background").append(autogold_button);
		}
	}
	bank_automation.automate = function (switcher) {
		if (switcher == 0) this.vars.auto_invest = !this.vars.auto_invest;
		else if (switcher == 1) this.vars.auto_cash_to_gold = !this.vars.auto_cash_to_gold;
		else if (switcher == 2) this.vars.auto_gold_to_cash = !this.vars.auto_gold_to_cash;
		
		var autoinvest_button = $("#autoinvest_button");
		if (this.vars.auto_invest) {
			autoinvest_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
			autoinvest_button.html("ON");
		} else {
			autoinvest_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
			autoinvest_button.html("OFF");
		}		
		
		if (buildings[1].count >= 1) {
			var autocash_button = $("#autocash_button");
			if (this.vars.auto_cash_to_gold) {
				autocash_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
				autocash_button.html("ON");
			} else {
				autocash_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
				autocash_button.html("OFF");
			}		
			
			var autogold_button = $("#autogold_button");
			if (this.vars.auto_gold_to_cash) {
				autogold_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
				autogold_button.html("ON");
			} else {
				autogold_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
				autogold_button.html("OFF");
			}
		}
	}
	bank_automation.automationTick = function () {
		if (this.vars.auto_invest) {
			invest(true);
		}
		if (this.vars.auto_cash_to_gold) {
			cashToGold(true);
		}		
		if (this.vars.auto_gold_to_cash) {
			goldToCash(true);
		}
	}
	
	var research_automation = new Automation();
	research_automation.vars = {};
	research_automation.createHTML = function () {
		
	}
	
	var factory_automation = new Automation();
	factory_automation.vars = {};
	factory_automation.createHTML = function () {
		var autobuy_div = $(document.createElement("div"));
			autobuy_div.attr("id", "autobuy_div");
			autobuy_div.attr("style", "font-size: 130%;");
			autobuy_div.html("<br>All Available Autobuys:<br><br>");
			
		var allon_button = $(document.createElement("div"));
			allon_button.attr("onclick", "automation[6].allOn()");
			allon_button.attr("id", "allon_button");
			allon_button.attr("style", "display:inline-block;font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#e8e8e8, #9c9c9c); margin: 8px; cursor: pointer; width: 140px;");
			allon_button.html("All On");
		
		var alloff_button = $(document.createElement("div"));
			alloff_button.attr("onclick", "automation[6].allOff()");
			alloff_button.attr("id", "alloff_button");
			alloff_button.attr("style", "display:inline-block;font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#e8e8e8, #9c9c9c); margin: 8px; cursor: pointer; width: 140px;");
			alloff_button.html("All Off");
		
		$("#building_automation_background").append(autobuy_div);
		$("#building_automation_background").append(allon_button);
		$("#building_automation_background").append(alloff_button);
		$("#building_automation_background").append(document.createElement("br"));
			
		for (var i = 0; i < buildings.length; i++) {
			if (buildings[i].unlocked) {
				var toggle = $(document.createElement("img"));
				toggle.attr("width", "32px");
				toggle.attr("inactive_autobuy", buildings[i].tab_icon);
				toggle.attr("active_autobuy", buildings[i].tab_icon_hover);
				if (!automation[i].autobuy) {
					toggle.attr("src", buildings[i].tab_icon);
				} else {
					toggle.attr("src", buildings[i].tab_icon_hover);
				}
				toggle.attr("onclick", "automation[6].automate($(this), " + i + ")")
				$("#building_automation_background").append(toggle);
			}
		}
	}
	factory_automation.automate = function (ele, i) {
		automation[i].autobuy = !automation[i].autobuy;
		if (automation[i].autobuy) {ele.attr("src", ele.attr("active_autobuy"))}
		else {ele.attr("src", ele.attr("inactive_autobuy"))}
	}
	factory_automation.allOn = function () {
		for (var i = 0; i < automation.length; i++) {
			if (buildings[i].count != 0) {automation[i].autobuy = true;}
			openAutomation(6);
			openAutomation(6);
		}
	}	
	factory_automation.allOff = function () {
		for (var i = 0; i < automation.length; i++) {
			if (buildings[i].count != 0) {automation[i].autobuy = false;}
			openAutomation(6);
			openAutomation(6);
		}
	}
	
	var bonus_automation = new Automation();
	bonus_automation.vars = {
		disabled: false,
	}
	bonus_automation.createHTML = function () {
		var disable_div = $(document.createElement("div"));
			disable_div.attr("id", "disable_div");
			disable_div.attr("style", "font-size: 130%;");
			disable_div.html("<br>Disable excess auto-activation:");
			
		var disable_button = $(document.createElement("div"));
			disable_button.attr("onclick", "automation[7].automate()");
			disable_button.attr("id", "disable_button");
			if (this.vars.disabled) {
				disable_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
				disable_button.html("ON");
			} else {
				disable_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
				disable_button.html("OFF");
			}
			
		$("#building_automation_background").append(disable_div);
		$("#building_automation_background").append(disable_button);
	}
	bonus_automation.automate = function () {
		this.vars.disabled = !this.vars.disabled;
		
		var disable_button = $("#disable_button");
		if (this.vars.disabled) {
			disable_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
			disable_button.html("ON");
		} else {
			disable_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
			disable_button.html("OFF");
		}
	}
	bonus_automation.automationTick = function () {}
	
	var click_automation = new Automation();
	click_automation.vars = {
		auto_path: false,
	};
	click_automation.createHTML = function () {
		var autopath_div = $(document.createElement("div"));
			autopath_div.attr("id", "autopath_div");
			autopath_div.attr("style", "font-size: 130%;");
			autopath_div.html("<br>Autopath:");
			
		var autopath_button = $(document.createElement("div"));
			autopath_button.attr("onclick", "automation[8].automate()");
			autopath_button.attr("id", "autopath_button");
			if (this.vars.auto_path) {
				autopath_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
				autopath_button.html("ON");
			} else {
				autopath_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
				autopath_button.html("OFF");
			}
			
		$("#building_automation_background").append(autopath_div);
		$("#building_automation_background").append(autopath_button);
	}
	click_automation.automate = function () {
		this.vars.auto_path = !this.vars.auto_path;
		
		var autopath_button = $("#autopath_button");
		if (this.vars.auto_path) {
			autopath_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
			autopath_button.html("ON");
		} else {
			autopath_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
			autopath_button.html("OFF");
		}
	}
	click_automation.automationTick = function () {
		if (this.vars.auto_path) {
			runPath(true);
		}
	}
	
	var cryogenic_automation = new Automation();
	cryogenic_automation.vars = {};
	cryogenic_automation.createHTML = function () {
		
	}
	
	var alien_automation = new Automation();
	alien_automation.vars = {};
	alien_automation.createHTML = function () {
		
	}
	
	var computer_automation = new Automation();
	computer_automation.vars = {};
	computer_automation.createHTML = function () {
		var autoloop_div = $(document.createElement("div"));
			autoloop_div.attr("id", "autoloop_div");
			autoloop_div.attr("style", "font-size: 130%;");
			autoloop_div.html("<br>Auto Loop Programs:");
			
		var autoloop_button = $(document.createElement("div"));
			autoloop_button.attr("onclick", "automation[11].automate()");
			autoloop_button.attr("id", "autoloop_button");
			if (minigames[11].vars.looping) {
				autoloop_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
				autoloop_button.html("ON");
			} else {
				autoloop_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
				autoloop_button.html("OFF");
			}
			
		$("#building_automation_background").append(autoloop_div);
		$("#building_automation_background").append(autoloop_button);
	}
	computer_automation.automate = function () {
		minigames[11].vars.looping = !minigames[11].vars.looping;
		
		var autoloop_button = $("#autoloop_button");
		if (minigames[11].vars.looping) {
			autoloop_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
			autoloop_button.html("ON");
		} else {
			autoloop_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
			autoloop_button.html("OFF");
		}		
	}
	
	var accel_automation = new Automation();
	accel_automation.vars = {};
	accel_automation.createHTML = function () {
		
	}
	
	var flux_automation = new Automation();
	flux_automation.vars = {
		target_flux: -1,
	}
	flux_automation.createHTML = function () {
		var autoflux_div = $(document.createElement("div"));
			autoflux_div.attr("id", "autoflux_div");
			autoflux_div.attr("style", "font-size: 130%;");
			autoflux_div.html("<br>Automatic Fluctuations:");
		
        var flux_production = $(document.createElement("img"));
			flux_production.attr("src", "images/fluctuation_variable_production.png").attr("width", "48").attr("id", "fluctuation_automation_0");
			flux_production.attr("class", "automatable");
			flux_production.attr("onclick", "automation[13].automate(0, this);");        
			
		var flux_clicks = $(document.createElement("img"));
			flux_clicks.attr("src", "images/fluctuation_variable_clicks.png").attr("width", "48").attr("id", "fluctuation_automation_1");
			flux_clicks.attr("class", "automatable");
			flux_clicks.attr("onclick", "automation[13].automate(1, this);");		
			
		var flux_prices = $(document.createElement("img"));
			flux_prices.attr("src", "images/fluctuation_variable_prices.png").attr("width", "48").attr("id", "fluctuation_automation_2");
			flux_prices.attr("class", "automatable");
			flux_prices.attr("onclick", "automation[13].automate(2, this);");		
		
		var flux_translation = $(document.createElement("img"));
			flux_translation.attr("src", "images/fluctuation_translation.png").attr("width", "48").attr("id", "fluctuation_automation_3");
			flux_translation.attr("class", "automatable");
			flux_translation.attr("onclick", "automation[13].automate(3, this);");		
			
		
		$("#building_automation_background").append(autoflux_div);
		$("#building_automation_background").append(flux_production);
		$("#building_automation_background").append($(document.createTextNode(" ")));
		$("#building_automation_background").append(flux_clicks);
		$("#building_automation_background").append($(document.createTextNode(" ")));
		$("#building_automation_background").append(flux_prices);
		$("#building_automation_background").append($(document.createTextNode(" ")));
		$("#building_automation_background").append(flux_translation);
		
		if (this.vars.target_flux != -1) {
			$("#fluctuation_automation_" + this.vars.target_flux).addClass("automated");
		}
	}
	flux_automation.automate = function(flux, ele) {
		if (this.vars.target_flux == flux) {
			this.vars.target_flux = -1;
			$(ele).removeClass("automated");
		} else {
			this.vars.target_flux = flux;
			
			$('.automatable').each(function() {
				$(this).removeClass("automated");
			});
			
			$(ele).addClass("automated");
		}
	}
	flux_automation.automationTick = function () {
		if (this.vars.target_flux != -1) {
			flux(this.vars.target_flux);
		}
	}
	
	var clone_automation = new Automation();
	clone_automation.vars = {
		auto_clone: false,
		last_clone: 0,
	};
	clone_automation.createHTML = function () {
		var autoclone_div = $(document.createElement("div"));
			autoclone_div.attr("id", "autopath_div");
			autoclone_div.attr("style", "font-size: 130%;");
			autoclone_div.html("<br>Autoclone:");
			
		var autoclone_button = $(document.createElement("div"));
			autoclone_button.attr("onclick", "automation[14].automate()");
			autoclone_button.attr("id", "autoclone_button");
			if (this.vars.auto_clone) {
				autoclone_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
				autoclone_button.html("ON");
			} else {
				autoclone_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
				autoclone_button.html("OFF");
			}
			
		$("#building_automation_background").append(autoclone_div);
		$("#building_automation_background").append(autoclone_button);
	}
	clone_automation.automate = function () {
		this.vars.auto_clone = !this.vars.auto_clone;
		
		var autoclone_button = $("#autoclone_button");
		if (this.vars.auto_clone) {
			autoclone_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#00b81c, #018f17); margin: 8px; cursor: pointer");
			autoclone_button.html("ON");
		} else {
			autoclone_button.attr("style", "font-size: 20px; font-weight: 900; color: black; background-color: #018f17; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#8f0101, #c40000); margin: 8px; cursor: pointer");
			autoclone_button.html("OFF");
		}
	}
	clone_automation.automationTick = function () {
		if (this.vars.auto_clone) {
			clone(this.vars.last_clone);
		}
	}
	
	var epiphany_automation = new Automation();
	epiphany_automation.vars = {};
	epiphany_automation.createHTML = function () {
		
	}
	
	var merchant_automation = new Automation();
	merchant_automation.vars = {};
	merchant_automation.createHTML = function () {
		
	}	
	
	var warp_automation = new Automation();
	warp_automation.vars = {};
	warp_automation.createHTML = function () {
		
	}	
	
	var stellar_automation = new Automation();
	stellar_automation.vars = {};
	stellar_automation.createHTML = function () {
		
	}	
	
	var temporal_automation = new Automation();
	temporal_automation.vars = {};
	temporal_automation.createHTML = function () {
		
	}
	
	var political_automation = new Automation();
	political_automation.vars = {
		target_decree: -1,
	}
	political_automation.createHTML = function () {
		var autodecree_div = $(document.createElement("div"));
			autodecree_div.attr("id", "autodecree_div");
			autodecree_div.attr("style", "font-size: 130%;");
			autodecree_div.html("<br>Automatic Decrees:");
		
        var decree_entertainment = $(document.createElement("img"));
			decree_entertainment.attr("src", "images/political_decree_entertainment.png").attr("width", "48").attr("id", "political_automation_0");
			decree_entertainment.attr("class", "automatable");
			decree_entertainment.attr("onclick", "automation[20].automate(0, this);");        
			
		var decree_collection = $(document.createElement("img"));
			decree_collection.attr("src", "images/political_decree_collection.png").attr("width", "48").attr("id", "political_automation_1");
			decree_collection.attr("class", "automatable");
			decree_collection.attr("onclick", "automation[20].automate(1, this);");		
			
		var decree_petty = $(document.createElement("img"));
			decree_petty.attr("src", "images/political_decree_petty.png").attr("width", "48").attr("id", "political_automation_2");
			decree_petty.attr("class", "automatable");
			decree_petty.attr("onclick", "automation[20].automate(2, this);");		
		
		var decree_help = $(document.createElement("img"));
			decree_help.attr("src", "images/political_decree_help.png").attr("width", "48").attr("id", "political_automation_3");
			decree_help.attr("class", "automatable");
			decree_help.attr("onclick", "automation[20].automate(3, this);");		
		
		$("#building_automation_background").append(autodecree_div);
		$("#building_automation_background").append(decree_entertainment);
		$("#building_automation_background").append($(document.createTextNode(" ")));
		$("#building_automation_background").append(decree_collection);
		$("#building_automation_background").append($(document.createTextNode(" ")));
		$("#building_automation_background").append(decree_petty);		
		$("#building_automation_background").append($(document.createTextNode(" ")));
		$("#building_automation_background").append(decree_help);
		
		if (this.vars.target_decree != -1) {
			$("#political_automation_" + this.vars.target_decree).addClass("automated");
		}
	}
	political_automation.automate = function(decree, ele) {
		if (this.vars.target_decree == decree) {
			this.vars.target_decree = -1;
			$(ele).removeClass("automated");
		} else {
			this.vars.target_decree = decree;

			$('.automatable').each(function() {
				$(this).removeClass("automated");
			});
			
			$(ele).addClass("automated");
		}
	}
	political_automation.automationTick = function () {
		if (this.vars.target_decree != -1) {
			decree(this.vars.target_decree, true);
		}
	}
	
	automation.push(cultist_automation);
	automation.push(mine_automation);
	automation.push(gambler_automation);
	automation.push(power_automation);
	automation.push(bank_automation);
	automation.push(research_automation);
	automation.push(factory_automation);
	automation.push(bonus_automation);
	automation.push(click_automation);
	automation.push(cryogenic_automation);
	automation.push(alien_automation);
	automation.push(computer_automation);
	automation.push(accel_automation);
	automation.push(flux_automation);
	automation.push(clone_automation);
	automation.push(epiphany_automation);
	automation.push(merchant_automation);
	automation.push(warp_automation);
	automation.push(stellar_automation);
	automation.push(temporal_automation);
	automation.push(political_automation);
}


/*
The following code was kindly given by Elestan
*/

function canDraw() {
    return (minigames[2].vars.draw_charges >= 1);
}
function canDiscard() {
    return (minigames[2].vars.discard_charges >= 1);
}
function canShuffle() {
    return (unlocks[5].unlocked && (minigames[2].vars.deck.length <= 3));
}
function canPeek() {
    return (unlocks[6].unlocked && (minigames[2].vars.peek_charges >= 1));
}
function havePeeked() {
    return ($("#deck_background").attr("src") == "images/card_" + minigames[2].vars.deck.peek() + ".png" || $("#deck_background_main").attr("src") == "images/card_" + minigames[2].vars.deck.peek() + ".png");
}
function nextCard() {
    return (minigames[2].vars.deck.peek());
}
function isBadCard(card) {
    return ((card == 1) || (card == 3) || (card == 5) || (card == 7));
}

// Evaluate the quality of the remaining cards
function getDeckQuality() { 
    var bad_count = 0;
    var good_count = 0;
    for (var i = 0; i < minigames[2].vars.deck.length; ++i) {
        var card = minigames[2].vars.deck[i];
        if (isBadCard(card)) {
            ++bad_count;
        } else {
            ++good_count;
        }
    }
    if (good_count == 0) return 0;  // All bad
    if (bad_count == 0) return 3;  // All good
    if (bad_count > good_count) return 1;  // Mostly bad
    return 2;  // Even odds or better.
}

function smarterGambler() {
    // Deal with certain outcomes first
    if (havePeeked() && !isBadCard(nextCard())) { drawCard(true); return; }
    var deckQuality = getDeckQuality();
    if (deckQuality > 2) { drawCard(true);  return; }

    // Shuffles are free, so prefer them when the odds are poor
    if ((deckQuality < 2) && canShuffle()) { shuffleDeck(true);  return; }

    // More certain outcomes
    if (deckQuality == 0) { discardCard(true);  return; }
    if (havePeeked() && isBadCard(nextCard())) { discardCard(true);  return; }

    // Forced choices
    if (canDraw() && !canDiscard()) { drawCard(true); return; }
    if (!canDraw() && canDiscard()) { discardCard(true); return; }

    // Try to peek
    if (canPeek()) { peek(true); return; }

    // Play the odds
    if (deckQuality < 2) { discardCard(true); return; }
    drawCard(true);
    return;
}