/**
 * @fileOverview Handles interactive effects from the minigames
 */
 
/** Represents a node in the research tree.
 * @constructor
 * @param {string} name - The name of the research node.
 * @param {string} description - The description to appear to the user's tooltip.
 * @param {int} sx - The x position of the research on the tile map.
 * @param {int} sy - The y position of the research on the tile map.
 * @param {int} x - The x position of the research node to appear on the canvas.
 * @param {int} y - The y position of the research node to appear on the canvas.
 * @param {int} cost - The number of research points required to research the node.
 * @param {int} max - The maximum number of times this node can be researched.
 * @param {function} effect - The effect of the research that is ran each tick.
 * @param {function} condition - The condition the user must meet to unlock this research.
 * @param {int} previous_research - The id of the research required to unlock this research.
 */
function Research(name, description, tooltip, sx, sy, x, y, cost, max, effect, condition, previous_research) {
	this.name = name;
	this.description = description;
	this.tooltip = tooltip;
    this.sx = sx * 48;
    this.sy = sy * 48;
	this.x = x;
	this.y = y;
	this.cost = cost;
	this.max = max;
	this.effect = effect;
	this.condition = condition;
	this.previous_research = previous_research;
	this.bought = 0;
	this.researched = false;
	
	/** Draws the research node on the specified canvas context.
	 * @param {object} ctx - The canvas context to draw onto.
	 */
	this.render = function (ctx) {
		ctx.drawImage(research_image, this.sx, this.sy, 48, 48, this.x - minigames[5].vars.research_camera.x, this.y - minigames[5].vars.research_camera.y, 48, 48);
	}
	/** Draws a stylized question mark on the canvas to hint a research node that is not yet available for the user.
	 * @param {object} ctx - The canvas context to draw onto.
	 */
	this.renderUnknown = function (ctx) {
		ctx.drawImage(research_image, 48*4, 0, 48, 48, this.x - minigames[5].vars.research_camera.x, this.y - minigames[5].vars.research_camera.y, 48, 48);
	}
	/** Draws a line connecting this research node with the previous research node.
	 * @param {object} ctx - The canvas context to draw onto.
	 */
	this.drawLine = function (ctx) {
		if (this.previous_research != null) {
			var p_node = minigames[5].vars.research_tree[this.previous_research];
			var camera = minigames[5].vars.research_camera;
			
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
/** Toggles the fullscreen canvas for drawing research nodes. */
function toggleResearchFullScreen() {
	if ($("#fullscreen_research").is(":hidden")) {
		$("#fullscreen_research").show();
		$("#close_fullscreen").show();
		$("#open_fullscreen").hide();
		minigames[5].vars.fullscreen = true;
		minigames[5].vars.research_ctx = document.getElementById("fullscreen_research").getContext("2d");
		minigames[5].vars.research_camera.x -= 225;
		minigames[5].vars.research_camera.y -= 135;
	} else {
		$("#fullscreen_research").hide();
		$("#close_fullscreen").hide();
		$("#open_fullscreen").show();
		if ($("#research_canvas").length) {minigames[5].vars.research_ctx = document.getElementById("research_canvas").getContext("2d");}
		minigames[5].vars.fullscreen = false;
		minigames[5].vars.research_camera.x += 225;
		minigames[5].vars.research_camera.y += 135;
	}
}
/** Draws all research nodes the player has access to. */
function renderResearch() {
	research = minigames[5].vars.research_tree;
	camera = minigames[5].vars.research_camera;
	var ctx = minigames[5].vars.research_ctx;
	fullscreen = minigames[5].vars.fullscreen;
	ctx.clearRect(0, 0, 300, 180);
	
	if (fullscreen) {
		ctx.fillStyle = "#e4e2c0";
		ctx.fillRect(0, 0, 750, 450);
	}
	
	ctx.lineWidth = 3;
	
	var len = research.length;
	for (var i = 1; i < len; i++) {
		if (!research[i].condition()) {continue}
		var previous = research[research[i].previous_research]
		if (previous.researched || (previous.previous_research != null && research[previous.previous_research].researched)) {
			research[i].drawLine(ctx);
		}
	}
	
	for (var i = 1; i < len; i++) {
		if (!research[i].condition()) {continue}
		var previous = research[research[i].previous_research]
		if (research[i].researched) {
			research[i].render(ctx);
			
			if (research[i].bought == research[i].max) {drawGradientCircle(research[i].x + 23, research[i].y + 23, 20)}
			
		} else if (previous.researched) {
			research[i].render(ctx);
			drawCircle(research[i].x + 24, research[i].y + 24, 22);
		}	else if ((previous.previous_research != null && research[previous.previous_research].researched)) {
			research[i].renderUnknown(ctx);
			drawCircle(research[i].x + 24, research[i].y + 24, 22);
		}
		
	}
	research[0].render(ctx);
	if (!research[0].researched) {drawCircle(research[0].x + 24, research[0].y + 24, 22)}
}
/** Draws a semi-opaque circle on the research or karma upgrades canvas to gray out nodes for the user.
 * @param {int} x - The x position to draw the circle.
 * @param {int} y - The y position to draw the circle.
 * @param {int} radius - The radius of the circle to draw.
 * @param {bool} karma - Determines whether circle is drawn on the karma or research canvas (true: karma, false: research).
 */
function drawCircle(x, y, radius, karma) {
	var game_ctx = minigames[5].vars.research_ctx;
	var camera = minigames[5].vars.research_camera;
	
	if (karma) {
		game_ctx = karma_tree.context;
		camera = karma_tree.camera;
	}
	
	game_ctx.beginPath();
    game_ctx.arc(x-camera.x, y-camera.y, radius, 0, 2 * Math.PI, false);
    game_ctx.fillStyle = "rgba(0,0,0,.4)";
    game_ctx.fill();
}
/** Lightens up an area on the canvas through a gradient circle.
 * @param {int} x - The x position to draw the circle.
 * @param {int} y - The y position to draw the circle.
 * @param {int} radius - The radius of the circle to draw.
 * @param {bool} karma - Determines whether circle is drawn on the karma or research canvas (true: karma, false: research).
 */
function drawGradientCircle(x, y, radius, karma) {
	var inner_radius = 14;
	var outer_radius = 22;
	var game_ctx = minigames[5].vars.research_ctx;
	var camera = minigames[5].vars.research_camera;
	
	if (karma) {
		game_ctx = karma_tree.context;
		camera = karma_tree.camera;
	}
	
	var gradient = game_ctx.createRadialGradient(x-camera.x, y-camera.y, inner_radius, x-camera.x, y-camera.y, outer_radius);
	gradient.addColorStop(0, 'rgba(20,255,3,0)');
	gradient.addColorStop(1, 'rgba(135,255,135,0.8)');
	
	game_ctx.globalCompositeOperation = "luminosity";
	game_ctx.beginPath();
    game_ctx.arc(x-camera.x, y-camera.y, radius, 0, 2 * Math.PI, false);
    game_ctx.fillStyle = gradient;
    game_ctx.fill();
	game_ctx.globalCompositeOperation = "source-over";
}
/** Handles mousemove event for the research canvas, to render tooltips when needed.
 * @param {event object} e - The event object for the mousemove event.
 */
function researchMouseDetection(e) {
	research = minigames[5].vars.research_tree;
	camera = minigames[5].vars.research_camera;
	
	var ele;
	if ($("#fullscreen_research").is(":hidden")) {
		var ele = $("#research_canvas");
	} else {
		var ele = $("#fullscreen_research");
	}
	
	var x = Math.floor(e.pageX - ele.offset().left);
	var y = Math.floor(e.pageY - ele.offset().top);
	
	for (var i = 0; i < research.length; i++) {
		if (!research[i].condition()) {continue}
		node = research[i];
		if ((node.previous_research == null) || (research[node.previous_research].researched)) {
			if (x + camera.x > node.x && x + camera.x < node.x + 48 && y + camera.y > node.y && y + camera.y < node.y + 48) {
				researchTooltip(node);
			}
		}
	}
	
	renderResearch();
}
/** Handles click event for the research canvas, allowing the user to unlock research nodes.
 * @param {event object} e - The event object for the click event.
 */
function researchClickDetection(e) {
	research = minigames[5].vars.research_tree;
	camera = minigames[5].vars.research_camera;
	
	var ele;
	if ($("#fullscreen_research").is(":hidden")) {
		var ele = $("#research_canvas");
	} else {
		var ele = $("#fullscreen_research");
	}
	
	var x = Math.floor(e.pageX - ele.offset().left);
	var y = Math.floor(e.pageY - ele.offset().top);
	
	for (var i = 0; i < research.length; i++) {
		if (!research[i].condition()) {continue}
		node = research[i];
		if ((node.previous_research == null) || (research[node.previous_research].researched)) {
			if (x + camera.x > node.x && x + camera.x < node.x + 48 && y + camera.y > node.y && y + camera.y < node.y + 48) {
				if (minigames[5].vars.research_points >= node.cost && node.bought < node.max) {
					node.bought ++;
					node.researched = true;
					
					minigames[5].vars.research_points -= node.cost;
					minigames[5].vars.researches_made += 1;
					
					buildings[5].stats["Researches Made"] = minigames[5].vars.researches_made;
					researchMouseDetection(e);
					
					updateBuildingEffects();
					
					var all_researched = true;
					for (var i = 0; i < research.length; i++) {
						if (!research[i].bought) {
							all_researched = false
						}
					}
					if (all_researched) {
						minigames[5].vars.mastery = true;
					}
				}
			}
		}
	}
}
/** Updates all minigames.
 * @param {float} dt - The time since the last frame.
 */
function updateMinigames(dt) {
    if (SHOWN_TAB != -1) {minigames[SHOWN_TAB].updateHTML();}
    for (var i = 0; i < minigames.length; i++) {
		var temp_dt = dt;
        if (buildings[i].count >= 1) {
			if (minigames[10].vars.powered_buildings.includes(i)) {
				temp_dt *= 0.75;
			}			
			
			if (minigames[14].vars.clone_targets.includes(i)) {
				temp_dt *= 2;
			}
			
			if (alien_target == i) {
				temp_dt *= 1.25;
			}
			
			if (kongBuys.galactic_expansion) {
				temp_dt *= 1.25;
			}
			
			temp_dt *= 1 + assistants[2].level * 0.001
			
			if (minigames[3].vars.powered_buildings.includes(i)) {
				if (upgrades[47].bought) {minigames[i].update(temp_dt * 1.6)}
				else {minigames[i].update(temp_dt * 1.5)}
			} else {
				minigames[i].update(temp_dt)
			}
		};
    }
}
/** Updates the description text for each building's submenu.
 * @param {int} building_id - The id of the building to pull data from.
 */
function updateBuildingExplanation(building_id) {
    var building = buildings[building_id];
	var red_multiplier;
	var green_percentage;
	// Factory Production
	if (building_id == 18) {
		red_multiplier = (minigames[18].vars.max_production / (building.production)).toFixed(2);
		green_percentage = (((minigames[18].vars.max_production * building.count) / PRODUCTION) * 100).toFixed(2);
	} else {
		red_multiplier = (PRODUCTION_MULTIPLIER * building.production_multiplier).toFixed(2);
		green_percentage = (((PRODUCTION_MULTIPLIER * building.production_multiplier * building.count * building.production) / PRODUCTION) * 100).toFixed(1);
	}
    
    $("#building_explanation").html(building.explanation + " You own <span style='color:#00a2bc;font-weight: 900;'>" + building.count + " " + building.tab_name + "s </span>that each produce <span style='color:#00a2bc;font-weight: 900;'>" + fancyNumber(building.production * building.production_multiplier) + " </span>credits every second, for a total of <span style='color:#00a2bc;font-weight: 900;'>" + fancyNumber(building.production * building.count * building.production_multiplier) + "</span> <span style='color:#ce1800;font-weight: 900;'>(x"+red_multiplier+")</span><span style='color:#3D9E00;font-weight: 900;'>("+green_percentage+"% of production)</span>.");
}
/** Updates the help text in the building submenu.
 */
function updateBuildingHelp() {
    if (SHOWN_TAB != -1) {minigames[SHOWN_TAB].updateDetails();}
}
/** Creates and returns a jquery element for the given upgrade array.
 * @param {array} upgrade - The upgrade array containing all necessary data for the element.
 * @param {int} default_x - The x location on the upgrade tilemap to pull from if the upgrade is not available.
 * @param {int} default_y - The y location on the upgrade tilemap to pull from if the upgrade is not available.
 * @param {boolean} full - Determines if the element should be opaque or not (true: opaque, false: semi-opaque).
 */
function stringUpgrade(upgrade, default_x, default_y, full) {
	var opac = 0.6;
	if (full) opac = 1;
	if (upgrades[upgrade[0]].bought) {
		var r_upgrade = upgrades[upgrade[0]];
		var upgrade_tooltip_value = "";
		if (r_upgrade.evalTooltip()) {upgrade_tooltip_value = "<br/>(" +r_upgrade.evalTooltip() + ")"}
		
		var expanded_description = r_upgrade.description + upgrade_tooltip_value + "<br><span style = \\\"color:#00db0a;text-shadow:0px 0px 2px #52d56a;font-size:18px;\\\">Price: " + fancyNumber(r_upgrade.price) + "</span><br><span style = \\\"font-size:10px;float:right\\\";>"+r_upgrade.flavor_text+"<span>";
		var upgrade_string = "";
		upgrade_string += "<div style='float:left;height:48px;width:48px;background:url(images/upgrade_sheet.png) -"+r_upgrade.x+"px -"+r_upgrade.y+"px;' ";
		upgrade_string += "onmouseover='tooltip(this, -"+r_upgrade.x/48+", -"+r_upgrade.y/48+", \""+r_upgrade.display_name+"\", \""+expanded_description+"\")'";
		upgrade_string += "onmouseleave='hideTooltip()'";
		
		upgrade_string += "></div>";
		return upgrade_string;
	} else if (upgrades[upgrade[0]].available) {
		var r_upgrade = upgrades[upgrade[0]];
		var upgrade_tooltip_value = "";
		if (r_upgrade.evalTooltip()) {upgrade_tooltip_value = "<br/>(" +r_upgrade.evalTooltip() + ")"}
		
		var expanded_description = r_upgrade.description + upgrade_tooltip_value + "<br><span style = \\\"color:#00db0a;text-shadow:0px 0px 2px #52d56a;font-size:18px;\\\">Price: " + fancyNumber(r_upgrade.price) + "</span><br><span style = \\\"font-size:10px;float:right\\\";>"+r_upgrade.flavor_text+"<span>";
		upgrade_string = "";
		upgrade_string += "<div style='opacity: "+opac+";float:left;height:48px;width:48px;background:url(images/upgrade_sheet.png) -"+r_upgrade.x+"px -"+r_upgrade.y+"px;' ";
		upgrade_string += "onmouseover='tooltip(this, -"+r_upgrade.x/48+", -"+r_upgrade.y/48+", \""+r_upgrade.display_name+"\", \""+expanded_description+"<br>Not bought yet\")'";
		upgrade_string += "onmouseleave='hideTooltip()'";
		
		upgrade_string += "></div>";
		return upgrade_string;
	} else if (upgrade[1]()) {
		var r_upgrade = upgrades[upgrade[0]];
		var upgrade_string = "";
		upgrade_string += "<div style='opacity: "+opac+";float:left;height:48px;width:48px;background:url(images/upgrade_sheet.png) -"+default_x*48+"px -"+default_y*48+"px;' ";
		upgrade_string += "onmouseover='tooltip(this, "+default_x+", "+default_y+", \""+r_upgrade.display_name+"\", \""+upgrade[2]+"\")'";
		upgrade_string += "onmouseleave='hideTooltip()'";
		upgrade_string += "></div>";
		
		return upgrade_string;
	} else {
		var upgrade_string = "";
		upgrade_string += "<div style='opacity: "+opac+";float:left;height:48px;width:48px;background:url(images/upgrade_sheet.png) -"+default_x*48+"px -"+default_y*48+"px;' ";
		upgrade_string += "onmouseover='tooltip(this, "+default_x+", "+default_y+", \"?????\", \"??????????????????????????????????????? Not Available Yet <br>???????????????????????????????????????\")'";
		upgrade_string += "onmouseleave='hideTooltip()'";
		upgrade_string += "></div>";
		
		return upgrade_string;
	}
}
/** Handles the user's activation of a ritual from the cultist minigame.
 * @param {int} ritual - The id of the ritual to be activated.
 * @param {int} cost - The amount of blood from the cultist minigame that is require for the ritual to be activated.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function performRitual(ritual, cost, noPopup) {
	if (!(upgrades[6].bought && minigames[0].vars.blood >= 0)) {
		if (minigames[0].vars.blood >= cost) {
			minigames[0].vars.blood -= cost;
			minigames[0].vars.blood_spent += cost;
		} else {
			return;
		}
	} else {
		minigames[0].vars.blood -= cost;
		minigames[0].vars.blood_spent += cost;
		
		if (minigames[0].vars.blood < 0 && assistants[0].abilities[0].available() && assistants[0].level >= 5) {
			minigames[0].vars.blood = 1;
			assistants[0].abilities[0].cd -= 1;
		}
	}
    
    switch (ritual) {
        case 0:
            buffs[0].activate(66);
            if (!noPopup) popupText("+25% Production", $("#ritual_0").offset().left + $("#ritual_0").width()/2, $("#ritual_0").offset().top);
            break;
        case 1: 
            addClockTicks(10);
            if (!noPopup) popupText("+10 Seconds", $("#ritual_1").offset().left + $("#ritual_1").width()/2, $("#ritual_1").offset().top);
            break;
        case 2:
            if (!noPopup) popupText(minigames[0].vars.soot_counters + " Soot removed", $("#ritual_2").offset().left + $("#ritual_2").width()/2, $("#ritual_2").offset().top);
            if (minigames[0].vars.soot_counters >= 20) {
                minigames[0].vars.purity_counters += 1
                if (!noPopup) popupText(minigames[0].vars.soot_counters + " Soot removed<br>+3% production", $("#ritual_2").offset().left + $("#ritual_2").width()/2, $("#ritual_2").offset().top);     
            }
            minigames[0].vars.soot_counters = 0;
            buildings[0].stats["Soot Reduction"] = "-" + minigames[0].vars.soot_counters + "%";
            break;
        case 3:
            buffs[1].activate(70);
            var bonus = 15 + 3 * minigames[0].vars.soot_counters;
            if (!noPopup) popupText("+"+bonus+"% Production", $("#ritual_3").offset().left + $("#ritual_3").width()/2, $("#ritual_3").offset().top);
            minigames[0].vars.soot_counters++;
            break;
        case 4:
            minigames[0].vars.karma_counters += 1;
            var karma_total = minigames[0].vars.karma_counters * (15 + (15 + (minigames[0].vars.karma_counters-1)*2))/2;
            if (!noPopup) popupText("+"+(15 + (minigames[0].vars.karma_counters-1)*2)+" Production", $("#ritual_4").offset().left + $("#ritual_4").width()/2, $("#ritual_4").offset().top);
            break;
        case 5:
            if (Math.random() < Math.pow(0.99, buildings[0].count)) {
                buildings[0].count++;UPDATE_BUILDINGS = true;
                if (!noPopup) popupText("+1 Cultist", $("#ritual_5").offset().left + $("#ritual_5").width()/2, $("#ritual_5").offset().top);
				buildings[0].unlockUpgrades();
            } else {
                if (!noPopup) popupText("Ritual Failed", $("#ritual_5").offset().left + $("#ritual_5").width()/2, $("#ritual_5").offset().top);
            }
            
            break;
    }

    minigames[0].vars.rituals_performed += 1;
	buildings[0].stats["Rituals Performed"] = minigames[0].vars.rituals_performed;
    if (minigames[0].vars.soot_counters) {buildings[0].stats["Soot Reduction"] = "-" + minigames[0].vars.soot_counters + "%"}
    if (minigames[0].vars.purity_counters) {buildings[0].stats["Purity Bonus"] = minigames[0].vars.purity_counters * 3 + "%"}
    if (minigames[0].vars.karma_counters) {buildings[0].stats["Karma Bonus"] = minigames[0].vars.karma_counters * (15 + (15 + (minigames[0].vars.karma_counters-1)*2))/2}
	
	buildings[0].stats["Blood Spent"] = minigames[0].vars.blood_spent;
    
	if (minigames[0].vars.rituals_performed >= 10) {upgrades[6].makeAvailable()}
	if (minigames[0].vars.rituals_performed >= 25) {upgrades[7].makeAvailable()}
	if (minigames[0].vars.rituals_performed >= 50) {upgrades[8].makeAvailable()}
	if (minigames[0].vars.rituals_performed >= 100) {upgrades[9].makeAvailable()}
	
	updateBuildingEffects();
	updateStorageBars();
    updateUnlocks();
}
/** Stores the building ids of the last several refills from the mine minigame.
 * @param {int} id - The id of the building to be stored.
 */
function mineStore(id) {
	minigames[1].vars.stored_ids.push(id);
	
	if (minigames[1].vars.stored_ids.length >= 10 - upgrades[193].bought) {
		minigames[1].vars.stored_ids.splice(0, 1);
		if (upgrades[193].bought && minigames[1].vars.stored_ids.length == 9) {
			minigames[1].vars.stored_ids.splice(0, 1);
		}
	}
}
/** Refills a building's currency using gold from the mine minigame.
 * @param {int} id - The id of the refill.
 */
function refill(id) {
	var cost_multiplier = 1 * Math.pow(1.1, minigames[1].vars.stored_ids.count(id));
	switch (id) {
		case 0: 
		
		var cost = 20;
		cost = Math.floor(cost * cost_multiplier);
			if (minigames[1].vars.gold >= cost && minigames[0].vars.blood != minigames[0].vars.max_blood) {
				popupText("Blood Refill", $("#cultist_gold_refill").offset().left + $("#cultist_gold_refill").width()/2, $("#cultist_gold_refill").offset().top);
				minigames[0].vars.blood = minigames[0].vars.max_blood;
				minigames[1].vars.gold -= cost;
				
				if (upgrades[16].bought) {buffs[2].activate(15)}
				if (minigames[5].vars.research_tree[13].researched) {minigames[1].vars.gold += minigames[5].vars.research_tree[13].bought}
				mineStore(id);
			}	
			break;
		case 2: 
			
			var cost = 25;
			cost = Math.floor(cost * cost_multiplier);
			if (minigames[1].vars.gold >= cost && !(minigames[2].vars.draw_charges == minigames[2].vars.draw_charges_max && minigames[2].vars.discard_charges == minigames[2].vars.discard_charges_max)) {
				popupText("Draw Refill", $("#gambler_gold_refill").offset().left + $("#gambler_gold_refill").width()/2, $("#gambler_gold_refill").offset().top);
				minigames[2].vars.draw_charges = minigames[2].vars.draw_charges_max
				minigames[2].vars.discard_charges = minigames[2].vars.discard_charges_max
				minigames[1].vars.gold -= cost;
				
				if (upgrades[16].bought) {buffs[2].activate(15)}
				if (minigames[5].vars.research_tree[13].researched) {minigames[1].vars.gold += minigames[5].vars.research_tree[13].bought}
				mineStore(id);
			}
			break;
		case 3:
		
			var cost = 15;
			cost = Math.floor(cost * cost_multiplier);
			if (minigames[1].vars.gold >= cost && !(minigames[3].vars.power >= minigames[3].vars.max_power-5)) {
				popupText("Power Refill", $("#power_plant_gold_refill").offset().left + $("#power_plant_gold_refill").width()/2, $("#power_plant_gold_refill").offset().top);
				minigames[3].vars.power = minigames[3].vars.max_power;
				minigames[1].vars.gold -= cost;
				
				if (upgrades[16].bought) {buffs[2].activate(15)}
				if (minigames[5].vars.research_tree[13].researched) {minigames[1].vars.gold += minigames[5].vars.research_tree[13].bought}
				mineStore(id);
			}
			break;
		case 4:

			var cost = 15;
			cost = Math.floor(cost * cost_multiplier);
			if (minigames[1].vars.gold >= cost && minigames[4].vars.investing) {
				minigames[4].vars.investment_time = -1;
				minigames[1].vars.gold -= cost;
			
				if (upgrades[16].bought) {buffs[2].activate(15)}
				if (minigames[5].vars.research_tree[13].researched) {minigames[1].vars.gold += minigames[5].vars.research_tree[13].bought}
				mineStore(id);
			}
		case 5:
			
			var cost = 20;
			cost = Math.floor(cost * cost_multiplier);
			if (minigames[1].vars.gold >= cost) {

				minigames[1].vars.gold -= cost;
				minigames[5].vars.research_points += 10;
			
				if (upgrades[16].bought) {buffs[2].activate(15)}
				if (minigames[5].vars.research_tree[13].researched) {minigames[1].vars.gold += minigames[5].vars.research_tree[13].bought}
				mineStore(id);
			}
	}
	updateBuildingEffects();
	updateStorageBars();
	hideTooltip();
}
/** Handles the user's activation of drawing a card in the gambler's minigame.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function drawCard(noPopup) {
	if (minigames[2].vars.draw_charges >= 1) {
		minigames[2].vars.draw_charges -= 1;
		var card = minigames[2].vars.deck.pop();
		draw(card, noPopup || false);	
		$("#deck_background").attr("src", "images/card_back.png");
		$("#deck_background_main").attr("src", "images/card_back.png");
		minigames[2].vars.discard_pile.push(card);
		var number = minigames[2].vars.discard_pile.peek() 
		if (number === undefined) {number = "blank";}
		$("#discard_pile").attr("src", "images/card_"+number+".png");
		$("#discard_pile_main").attr("src", "images/card_"+number+".png");
		if (minigames[2].vars.deck.length == 0) {shuffle()}
		minigames[2].updateHTML();
		
		if (minigames[2].vars.cards_drawn >= 10) {upgrades[36].makeAvailable();}
		if (minigames[2].vars.cards_drawn >= 25) {upgrades[37].makeAvailable();}
		if (minigames[2].vars.cards_drawn >= 50) {upgrades[38].makeAvailable();}
		if (minigames[2].vars.cards_drawn >= 100) {upgrades[39].makeAvailable();}
		
		updateStorageBars();
	}
	
	updateBuildingEffects();
}
/** Handles the user's activation of discarding a card in the gambler's minigame.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function discardCard(noPopup) {
	if (minigames[2].vars.discard_charges >= 1) {
		minigames[2].vars.discard_charges -= 1;
		var card = minigames[2].vars.deck.pop();
		minigames[2].vars.cards_discarded +=1;
		buildings[2].stats["Cards Discarded"] = minigames[2].vars.cards_discarded;
		minigames[2].vars.discard_pile.push(card);
		var number = minigames[2].vars.discard_pile.peek() 
		if (number === undefined) {number = "blank";}
		$("#discard_pile").attr("src", "images/card_"+number+".png");
		$("#discard_pile_main").attr("src", "images/card_"+number+".png");
		if (minigames[2].vars.deck.length == 0) {shuffle()}
		minigames[2].updateHTML();
		if (!noPopup) popupText("Card Discarded", $("#discard_button").offset().left + $("#discard_button").width()/2, $("#discard_button").offset().top);
		$("#deck_background").attr("src", "images/card_back.png");
		$("#deck_background_main").attr("src", "images/card_back.png");
	}
}
/** Triggers the effect associated with the given card.
 * @param {int} card - The id of the card to be triggered.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function draw(card, noPopup) {
	minigames[2].vars.cards_drawn += 1;
	buildings[2].stats["Cards Drawn"] = minigames[2].vars.cards_drawn;
	switch (card) {
		case 0: //Ace of spades
			minigames[2].vars.card_bonus += 0.01;
			if (!noPopup) popupText("+1% Production", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
		case 1: //Two of spades
			minigames[2].vars.card_bonus -= 0.01;
			if (!noPopup) popupText("-1% Production", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
		case 2: //Ace of clubs
			addClockTicks(15);
			if (!noPopup) popupText("+15 Seconds", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
		case 3: //Two of clubs
			CREDITS = Math.max(0, CREDITS - PRODUCTION * 20);
			if (!noPopup) popupText("-" + fancyNumber(PRODUCTION * 20) + " Credits", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
		case 4: //Ace of hearts
			buffs[3].activate(120);
			if (!noPopup) popupText("+20% Production", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
		case 5: //Two of hearts
			buffs[4].activate(60);
			if (!noPopup) popupText("-15% Production", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
		case 6: //Ace of Diamonds
			len = buffs.length;
			for (var i = 0; i < len; i++) {
				if (buffs[i].active) {
					buffs[i].activate(20);
				}
			}
			if (!noPopup) popupText("+20s Active Effects", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
		case 7: //Two of Diamonds
			var temp_buffs = []
			len = buffs.length;
			for (var i = 0; i < len; i++) {
				if (buffs[i].active) {
					temp_buffs.push(buffs[i]);
				}
			}
			var ran = Math.floor(Math.random() * temp_buffs.length)
			if (temp_buffs[ran]) {
				temp_buffs[ran].time = 0.1;
				if (!noPopup) popupText(temp_buffs[ran].name + " Removed", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			} else {
				if (!noPopup) popupText("No Effects Removed", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			}
			break;
		case 8: //Jack of Spades
			CREDITS += PRODUCTION * 20;
			minigames[2].vars.draw_charges += 1;
			if (!noPopup) popupText("+" + fancyNumber(PRODUCTION * 20) + " Credits,  +1 Draw", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
		case 9: //Jack of clubs
			for (var i = 0; i < 20; i++) {
				handleClick();
			}
			if (minigames[2].vars.discard_charges < minigames[2].vars.discard_charges_max) {minigames[2].vars.discard_charges += 1;}
			if (!noPopup) popupText("+20 Clicks, +1 Discard", $("#draw_button").offset().left + $("#draw_button").width()/2, $("#draw_button").offset().top);
			break;
	}
	buildings[2].stats["Gambling Bonus"] = Math.round((minigames[2].vars.card_bonus - 1) * 100) + "%";
}
/** Returns the string of the given card, including an HTML entity for each suit.
 * @param {int} card - The id of the card to be stringified.
 * @return {string} - The given card as a user understandable string.
 */
function cardToString(card) {
	switch (card) {
		case 0: //Ace of spades
			return "A&spades;"
			break;
		case 1: //Two of spades
			return "2&spades;"
			break;
		case 2: //Ace of clubs
			return "A&clubs;"
			break;
		case 3: //Two of clubs
			return "2&clubs;"
			break;
		case 4: //Ace of hearts
			return "A&hearts;"
			break;
		case 5: //Two of hearts
			return "2&hearts;"
			break;
		case 6: //Ace of Diamonds
			return "A&diams;"
			break;
		case 7: //Two of Diamonds
			return "2&diams;"
			break;
		case 8: //Jack of Spades
			return "J&spades;"
			break;
		case 9: //Jack of Clubs
			return "J&clubs;"
			break;
	}	
}
/** Handles the user's activation of shuffling the deck in the gambler's minigame.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function shuffleDeck(noPopup) {
	if (minigames[2].vars.deck.length <=3) {
		shuffle();
		if (!noPopup) popupText("Deck Shuffled", $("#shuffle_button").offset().left + $("#shuffle_button").width()/2, $("#shuffle_button").offset().top);	
	} else {
		if (!noPopup) popupText("Requires less than 3 cards to shuffle", $("#shuffle_button").offset().left + $("#shuffle_button").width()/2, $("#shuffle_button").offset().top);		
	}
}
/** Shuffles the deck for the gambler's minigame. */
function shuffle() {
	for (var i = 0; i < minigames[2].vars.deck.length; i++) {
		minigames[2].vars.discard_pile.push(minigames[2].vars.deck[i]);
	}
	minigames[2].vars.discard_pile = Array.from(new Set(minigames[2].vars.discard_pile))
	minigames[2].vars.deck = minigames[2].vars.discard_pile.shuffle();
	minigames[2].vars.discard_pile = [];
	$("#discard_pile").attr("src", "images/card_shuffle.png");
	$("#discard_pile_main").attr("src", "images/card_shuffle.png");
	$("#deck_background").attr("src", "images/card_back.png");
	$("#deck_background_main").attr("src", "images/card_back.png");
}
/** Returns a string with a stringified version of each card remaining in the gambler's deck.
 * @param {array} deck - An array containing card ids.
 * @return {string} - A string listing all remaining cards in the gambler's deck.
 */
function remainingCards(deck) {
	var string = "";
	
	for (var i = 0; i < 10; i++) {
		if (deck.includes(i)) {
					string += cardToString(deck[deck.indexOf(i)]) + " ";	
		}
	}
	
	return string;
}
/** Handles the user's activation of peeking at the deck in the gambler's minigame.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function peek(noPopup) {
	if (minigames[2].vars.peek_charges >= 1 && !($("#deck_background").attr("src") == "images/card_" + minigames[2].vars.deck.peek() + ".png")) {
		minigames[2].vars.peek_charges -= 1;
		$("#deck_background").attr("src", "images/card_" + minigames[2].vars.deck.peek() + ".png");
		$("#deck_background_main").attr("src", "images/card_" + minigames[2].vars.deck.peek() + ".png");
		if (!noPopup) popupText(cardToString(minigames[2].vars.deck.peek()) + " Next", $("#peek_button").offset().left + $("#peek_button").width()/2, $("#peek_button").offset().top);		
	}
}
/** Toggles the overcharge effect for the specified building.
 * @param {int} building - The id of the building to trigger the overcharge effect for.
 */
function toggleOvercharge(building) {
	if (!minigames[3].vars.powered_buildings.includes(building)) {
		minigames[3].vars.powered_buildings.push(building);
		$("#"+buildings[building].name+"_overcharge").attr("src", "images/building_icon_power.png");
		$("#"+buildings[building].name+"_overcharge_main").attr("src", "images/building_icon_power.png");
	} else {
		minigames[3].vars.powered_buildings.remove(building);
		$("#"+buildings[building].name+"_overcharge").attr("src", "images/misc_inactive_power.png");
		$("#"+buildings[building].name+"_overcharge_main").attr("src", "images/misc_inactive_power.png");
	}
	UPDATE_BUILDINGS = true;
}
/** Handles the user's activation of investing for the bank minigame.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function invest(noPopup) {
	var bank = minigames[4].vars;
	
	if (bank.investment_time <= 0 && (CREDITS >= PRODUCTION * 300 || upgrades[196].bought)) {
		bank.investment_time = 300;
		if (upgrades[224].bought) {bank.investment_time -= 10}
		if (challenges[4].unlocked) {bank.investment_time -= 30;}
		if (subgames[0].reset_count >= 5) {bank.investment_time /= 1 + (subgames[0].reset_count) * 0.01}
		bank.investment_value = PRODUCTION * 360;
		bank.investing = true;
		CREDITS -= PRODUCTION * 300;
		if (!noPopup) popupText(fancyNumber(PRODUCTION * 300) + " Credits Invested", $("#investment_icon").offset().left + $("#investment_icon").width()/2, $("#investment_icon").offset().top);

		buildings[4].stats["Investments Made"] += 1;
		
		if (upgrades[196].bought && CREDITS < 0 && assistants[0].abilities[0].available() && assistants[0].level >= 5) {
			CREDITS = 1;
			assistants[0].abilities[0].cd -= 1;
		}
		
		if (CURRENT_CHALLENGE == 4) {bank.investment_time = 25;}
		
		updateStorageBars();
	}  else {
		if (!noPopup) popupText("Not Enough Credits", $("#investment_icon").offset().left + $("#investment_icon").width()/2, $("#investment_icon").offset().top);
	}
	updateBuildingEffects();
}
/** Handles the user's activation of exchanging a temporary negative effect for gold for the mine minigame.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function cashToGold(noPopup) {
	if (!buffs[6].active) {
		buffs[6].activate(60);
		minigames[1].vars.gold += 1;
		if (!noPopup) popupText("+1 Gold", $("#cash_to_gold").offset().left + $("#cash_to_gold").width()/2, $("#cash_to_gold").offset().top);
	} else {
		if (!noPopup) popupText(Math.round(buffs[6].time) + " seconds remaining", $("#cash_to_gold").offset().left + $("#cash_to_gold").width()/2, $("#cash_to_gold").offset().top);	
	}
}
/** Handles the user's activation of exchanging a gold from the mine minigame for a temporary bonus.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
 function goldToCash(noPopup) {
	if (!buffs[5].active && minigames[1].vars.gold >= 2) {
		buffs[5].activate(60);
		minigames[1].vars.gold -= 2;
		if (!noPopup) popupText("+10% Production", $("#gold_to_cash").offset().left + $("#gold_to_cash").width()/2, $("#gold_to_cash").offset().top);	
	} else if (minigames[1].vars.gold <= 1) {
		if (!noPopup) popupText("Not Enough Gold", $("#gold_to_cash").offset().left + $("#gold_to_cash").width()/2, $("#gold_to_cash").offset().top);	
	} else {
		if (!noPopup) popupText(Math.round(buffs[5].time) + " seconds remaining", $("#gold_to_cash").offset().left + $("#gold_to_cash").width()/2, $("#gold_to_cash").offset().top);			
	}
}
/** Displays the tooltip for investing in the bank minigame.
 * @param {boolean} main - Determines if the tooltip is rendered inside the building's minimenu or submenu (true: minimenu, false: submenu).
 */
function investTooltip(main) {
	var ele = $("#investment_icon");
	if (main) {ele = $("#investment_icon_main")}
	if (!minigames[4].vars.investing) {
		tooltip(ele, 7, 6, "Investment", "Invest 5 minutes worth of production <span style='color:#00db0a;'>(" + fancyNumber(PRODUCTION * 300) + ")</span> to get that amount plus an additional 20% after 5 minutes <span style='color:#00db0a;'>(" + fancyNumber(PRODUCTION * 360) + ")</span><br><span style = \"font-size:10px;float:right\";>Hotkey: " + hotkeys.activate_building_1.toUpperCase() + " </span>");
	} else {
		tooltip(ele, 7, 6, "Investment", "This investment will return <span style='color:#00db0a;'>" + fancyNumber(minigames[4].vars.investment_value) + "</span> credits in " + Math.round(minigames[4].vars.investment_time ) + " seconds.", function () {return "This investment will return <span style='color:#00db0a;'>" + fancyNumber(minigames[4].vars.investment_value) + "</span> credits in " + Math.round(minigames[4].vars.investment_time ) + " seconds."}, true);	
	}
}
/** Handles the user's activation of warping forward for warp minigame.
 * @param {boolean} main - Determines if the user activated this from inside the building's minimenu or submenu (true: minimenu, false: submenu).
 */
function warp(main) {
	if (minigames[17].vars.warp_charges != 0) {		
		var ele = $("#warp_display");
		if (main) {ele = $("#warp_display_main")};
		
		minigames[17].vars.warp_charges -= 1;
		minigames[17].vars.warp_activations += 1;
		buildings[17].stats["Total Warps"] = minigames[17].vars.warp_activations;
		var bonus = PRODUCTION * (30 + upgrades[116].bought * 5);
		CREDITS += bonus;
		stats.credits_earned += bonus
		popupText("+" + fancyNumber(bonus) + " Credits", ele.offset().left + ele.width()/2, ele.offset().top);	

		if (upgrades[271].bought) {addClockTicks(5)}
		
		if (minigames[17].vars.warp_activations >= 20) {upgrades[270].makeAvailable();}
		if (minigames[17].vars.warp_activations >= 50) {upgrades[271].makeAvailable();}
		if (minigames[17].vars.warp_activations >= 100) {upgrades[272].makeAvailable();}
		if (minigames[17].vars.warp_activations >= 200) {upgrades[273].makeAvailable();}
		if (minigames[17].vars.warp_activations >= 500) {upgrades[274].makeAvailable();}
		if (minigames[17].vars.warp_activations >= 1000) {upgrades[275].makeAvailable();}
		if (minigames[17].vars.warp_activations >= 2000) {upgrades[276].makeAvailable();}
		
		updateStorageBars();
	}
	updateBuildingEffects();
}
/** Toggles the aliencharge effect for the specified building.
 * @param {int} building - The id of the building to trigger the aliencharge effect for.
 */
function toggleAliencharge(building) {
	if (!minigames[10].vars.powered_buildings.includes(building)) {
		minigames[10].vars.powered_buildings.push(building);
		//$(".aliencharge").attr("src", "images/misc_active_alien.png");
		$("#"+buildings[building].name+"_aliencharge").attr("src", "images/misc_active_alien.png");
		$("#"+buildings[building].name+"_aliencharge_main").attr("src", "images/misc_active_alien.png");
	} else {
		minigames[10].vars.powered_buildings.remove(building);
		$("#"+buildings[building].name+"_aliencharge").attr("src", "images/misc_inactive_alien.png");
		$("#"+buildings[building].name+"_aliencharge_main").attr("src", "images/misc_inactive_alien.png");
	}
	UPDATE_BUILDINGS = true;
}
/** Handles the user activating the first program in the computer minigame. */
function program1() {
	var programs_running = 0;
	if (minigames[11].vars.program_1 != 0) {programs_running += 1}
	if (minigames[11].vars.program_2 != 0) {programs_running += 1}
	if (minigames[11].vars.program_3 != 0) {programs_running += 1}

	if (programs_running < 1 + upgrades[156].bought && minigames[11].vars.program_1 == 0) {
		if (upgrades[153].bought) {
			addClockTicks(5);
		}
		
		minigames[11].vars.programs_ran += 1;
		buildings[11].stats["Programs Ran"] = minigames[11].vars.programs_ran;
		minigames[11].vars.program_1 = 1;
		minigames[11].vars.program_1_time = 60;
		buffs[8].activate(60);
		
		if (minigames[11].vars.programs_ran >= 4) {upgrades[153].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 10) {upgrades[154].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 20) {upgrades[155].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 30) {upgrades[156].makeAvailable();}
		
		updateStorageBars();
	}
	
	buildings[11].stats["Programs Ran"] = minigames[11].vars.programs_ran;
	updateBuildingEffects();
}
/** Handles the user activating the second program in the computer minigame. */
function program2() {
	var programs_running = 0;
	if (minigames[11].vars.program_1 != 0) {programs_running += 1}
	if (minigames[11].vars.program_2 != 0) {programs_running += 1}
	if (minigames[11].vars.program_3 != 0) {programs_running += 1}
	
	if (programs_running < 1 + upgrades[156].bought && minigames[11].vars.program_2 == 0) {
		if (upgrades[153].bought) {
			addClockTicks(5);
		}
		
		minigames[11].vars.programs_ran += 1;
		buildings[11].stats["Programs Ran"] = minigames[11].vars.programs_ran;
		minigames[11].vars.program_2 = 1;
		minigames[11].vars.program_2_time = 60;
		
		CREDITS += PRODUCTION * 20;
		
		if (minigames[11].vars.programs_ran >= 4) {upgrades[153].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 10) {upgrades[154].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 20) {upgrades[155].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 30) {upgrades[156].makeAvailable();}
		
		updateStorageBars();
	}
	
	buildings[11].stats["Programs Ran"] = minigames[11].vars.programs_ran;
	updateBuildingEffects();
}
/** Handles the user activating the third program in the computer minigame. */
function program3() {
	var programs_running = 0;
	if (minigames[11].vars.program_1 != 0) {programs_running += 1}
	if (minigames[11].vars.program_2 != 0) {programs_running += 1}
	if (minigames[11].vars.program_3 != 0) {programs_running += 1}
	
	if (programs_running < 1 + upgrades[156].bought && minigames[11].vars.program_3 == 0) {
		if (upgrades[153].bought) {
			addClockTicks(5);
		}
		
		minigames[11].vars.programs_ran += 1;
		buildings[11].stats["Programs Ran"] = minigames[11].vars.programs_ran;
		minigames[11].vars.program_3 = 1;
		minigames[11].vars.program_3_time = 60;
		
		addClockTicks(15);
		
		if (minigames[11].vars.programs_ran >= 4) {upgrades[153].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 10) {upgrades[154].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 20) {upgrades[155].makeAvailable();}
		if (minigames[11].vars.programs_ran >= 30) {upgrades[156].makeAvailable();}
		
		updateStorageBars();
	}
	
	buildings[11].stats["Programs Ran"] = minigames[11].vars.programs_ran;
	updateBuildingEffects();
}
/** Displays the the tooltip for the first program in the computer minigame. */
function program1Tooltip(self) {
	var color = ["#DDDDDD", "#DDDDDD", "#DDDDDD", "#DDDDDD"]
	color[minigames[11].vars.program_1] = "#96E5FF";
	
	tooltip(self, 5, 16, 'Program 1', '<span style="color:'+color[1]+'">1. Increases production by <span style="color:#00db0a;">20%</span> for 1 minute.</span><br><span style="color:'+color[2]+'">2. Decreases production by <span style="color:#ff1e2d;">20%</span> for 1 minute.</span><br><span style="color:'+color[3]+'">3. <span style="color:#00db0a;">Autoclicks</span> once per second for 1 minute.</span><br><span style="color:'+color[4]+'">4. Removes <span style="color:#ff1e2d;">10</span> seconds worth of time.</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>', function () {}, true);
}
/** Displays the the tooltip for the first program in the computer minigame. */
function program2Tooltip(self) {
	var color = ["#DDDDDD", "#DDDDDD", "#DDDDDD", "#DDDDDD"]
	color[minigames[11].vars.program_2] = "#96E5FF";
	
	tooltip(self, 5, 16, 'Program 2', '<span style="color:'+color[1]+'">1. Grants <span style="color:#00db0a;">20</span> seconds worth of production.</span><br><span style="color:'+color[2]+'">2. Removes <span style="color:#ff1e2d;">15</span> seconds worth of production.</span><br><span style="color:'+color[3]+'">3. <span style="color:#00db0a;">Doubles</span> the value from clicks for 1 minute.</span><br><span style="color:'+color[4]+'">4. <span style="color:#ff1e2d;">Halves</span> the value from clicks for 1 minute.</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>', function () {}, true);
}
/** Displays the the tooltip for the first program in the computer minigame. */
function program3Tooltip(self) {
	var color = ["#DDDDDD", "#DDDDDD", "#DDDDDD", "#DDDDDD"]
	color[minigames[11].vars.program_3] = "#96E5FF";
	
	tooltip(self, 5, 16, 'Program 3', '<span style="color:'+color[1]+'">1. Grants <span style="color:#00db0a;">15</span> seconds worth of time.</span><br><span style="color:'+color[2]+'">2. Decreases production by <span style="color:#ff1e2d;">25%</span> for 1 minute.</span><br><span style="color:'+color[3]+'">3. Increases production by <span style="color:#00db0a;">15%</span> for 1 minute.</span><br><span style="color:'+color[4]+'">4. Removes <span style="color:#ff1e2d;">5</span> seconds worth of time.</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>', function () {}, true);
}
/** Handles the user starting to edit the autoclick path for the click minigame. */
function editPath() {
	if (minigames[8].vars.edit_path) {
		stopEdit();
	} else {
		minigames[8].vars.edit_path = true;
	}
}
/** Handles the user setting the autoclick path for the click minigame. */
function stopEdit() {
	minigames[8].vars.edit_path = false;
	$("#click_farm_display").empty();
}
/** Handles the user activating the autoclick path for the click minigame. */
function runPath() {
	if (!minigames[8].vars.run_path && minigames[8].vars.stored_clicks >= minigames[8].vars.click_path.length) {
		stopEdit();
		minigames[8].vars.run_path = true;
	}
}
/** Handles the user resetting the autoclick path for the click minigame. */
function resetPath() {
	minigames[8].vars.click_path = [];
}
/** Handles the user changing or setting the bonus that will be active in the acceleration minigame. 
 * @param {int} target - The id of the target to be switched to.  
 */
function accelTarget(target) {
	if (target != minigames[12].vars.accel_target) {
		minigames[12].vars.accel_target = target;
		if (upgrades[166].bought) {
			minigames[12].vars.accel_bonus *= 0.33;
		} else {
			minigames[12].vars.accel_bonus = 0;
		}
		minigames[12].vars.accel_time = 30;
		
		updateStorageBars();
	}
	
	$("#accel_price").attr("style", "display:inline;cursor:pointer;opacity:0.6");
	$("#accel_price_main").attr("style", "display:inline;cursor:pointer;opacity:0.6");
	$("#accel_click").attr("style", "display:inline;cursor:pointer;opacity:0.6");
	$("#accel_click_main").attr("style", "display:inline;cursor:pointer;opacity:0.6");
	$("#accel_production").attr("style", "display:inline;cursor:pointer;opacity:0.6");
	$("#accel_production_main").attr("style", "display:inline;cursor:pointer;opacity:0.6");
	
	if (target == 0) {$("#accel_price").attr("style", "display:inline;cursor:pointer;opacity:1");$("#accel_price_main").attr("style", "display:inline;cursor:pointer;opacity:1");}
	if (target == 1) {$("#accel_click").attr("style", "display:inline;cursor:pointer;opacity:1");$("#accel_click_main").attr("style", "display:inline;cursor:pointer;opacity:1");}
	if (target == 2) {$("#accel_production").attr("style", "display:inline;cursor:pointer;opacity:1");$("#accel_production_main").attr("style", "display:inline;cursor:pointer;opacity:1");}

}
/** Handles the user activating the clone effect for the specified building. 
 * @param {int} target - The id of the building to have the clone effect applied to.  
 */
function clone(target) {
	if (minigames[14].vars.clone_charges > 0 && !minigames[14].vars.clone_targets.includes(target)) {
		minigames[14].vars.clone_targets.push(target);
		minigames[14].vars.clone_times.push(tweaker.minigames.clone_duration);
		minigames[14].vars.clone_charges -= 1;
		minigames[14].vars.total_clones += 1;
		buildings[14].stats["Total Clones"] = minigames[14].vars.total_clones;
		UPDATE_BUILDINGS = true;
		if ($("#building_clone").length) popupText("Cloned", $("#building_clone").offset().left + $("#building_clone").width()/2, $("#building_clone").offset().top);
		
		if (minigames[14].vars.total_clones >= 10) {upgrades[249].makeAvailable()}
		if (minigames[14].vars.total_clones >= 20) {upgrades[250].makeAvailable()}
		if (minigames[14].vars.total_clones >= 50) {upgrades[251].makeAvailable()}
		if (minigames[14].vars.total_clones >= 100) {upgrades[252].makeAvailable()}
		if (minigames[14].vars.total_clones >= 200) {upgrades[253].makeAvailable()}
		if (minigames[14].vars.total_clones >= 500) {upgrades[254].makeAvailable()}
		if (minigames[14].vars.total_clones >= 1000) {upgrades[255].makeAvailable()}
		
		automation[14].vars.last_clone = target;
		
		updateStorageBars();
	}
}
/** Calculates and returns the work rate of a tier one building as a percentage. 
 * @param {int} building_id - The id of the target to be switched to.  
 * @return {string} - The workrate percentage.  
 */
function calcWorkRate(building_id) {
	
	var tree_id = 18 + building_id;
	
	if (building_id == 6) {tree_id - 23}
	if (building_id == 5) {tree_id = 23}
	
	var temp_value = 1 * ( 1 + minigames[3].vars.powered_buildings.includes(building_id) * (.5 + upgrades[47].bought * .1)  ) * (1 + minigames[5].vars.research_tree[tree_id].bought * 0.01) * (building_id == alien_target ? 1.25 : 1) * (1 + assistants[2].level * 0.001) * (1 + minigames[14].vars.clone_targets.includes(building_id)) * (1 + (kongBuys.galactic_expansion * 0.25));
	
	//var temp_value = 100 + minigames[3].vars.powered_buildings.includes(building_id) * (50 + upgrades[47].bought * 10) + minigames[5].vars.research_tree[18 + building_id].bought;
	
	return Math.round(temp_value * 100) + "%";
}
/** Calculates and returns the work rate of a tier two building as a percentage. 
 * @param {int} building_id - The id of the target to be switched to.  
 * @return {string} - The workrate percentage.  
 */
function calcWorkRateTier2(building_id) {
	var temp_value = 1 * ( 1 - minigames[10].vars.powered_buildings.includes(building_id) * 0.25) * (building_id == alien_target ? 1.25 : 1) * (1 + assistants[2].level * 0.001) * (1 + minigames[14].vars.clone_targets.includes(building_id)) * (1 + (kongBuys.galactic_expansion * 0.25));
	
	return Math.round(temp_value * 100) + "%";
}
/** Handles the effects occurring when a fluctuation from the fluctuation minigame is triggered. */
function flux(flux_id) {
	switch (flux_id) {
		// Variable Production
		case 0:
			if (minigames[13].vars.flux_points > tweaker.minigames.flux_production_cost) {
				buffs[34].activate(90);
				popupText("Variable Production", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
				minigames[13].vars.flux_points -= tweaker.minigames.flux_production_cost;
				fluxActivated();
			}
			break;
		
		case 1:
			if (minigames[13].vars.flux_points > tweaker.minigames.flux_clicks_cost) {
				buffs[35].activate(90);
				popupText("Variable Clicks", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
				minigames[13].vars.flux_points -= tweaker.minigames.flux_clicks_cost;
				fluxActivated();
			}
			break;
			
		case 2:
			if (minigames[13].vars.flux_points > tweaker.minigames.flux_prices_cost) {
				buffs[36].activate(30);
				popupText("Variable Prices", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
				minigames[13].vars.flux_points -= tweaker.minigames.flux_prices_cost;
				fluxActivated();
			}
			break;
		case 3:
			if (minigames[13].vars.flux_points > tweaker.minigames.flux_translation_cost) {
				minigames[13].vars.flux_multiplier += 0.01
				popupText("Translation", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
				minigames[13].vars.flux_points -= tweaker.minigames.flux_translation_cost;
				fluxActivated();
			}
			break;
	}
}
function fluxActivated() {
	if (minigames[13].vars.total_fluxes >= 1) {upgrades[173].makeAvailable();}
	if (minigames[13].vars.total_fluxes >= 2) {upgrades[174].makeAvailable();}
	if (minigames[13].vars.total_fluxes >= 4) {upgrades[175].makeAvailable();}
	if (minigames[13].vars.total_fluxes >= 8) {upgrades[176].makeAvailable();}
	
	minigames[13].vars.total_fluxes += 1;
	buildings[13].stats["Total Fluctuations"] = minigames[13].vars.total_fluxes;
	
	if (minigames[13].vars.negative_time == 120) {
		minigames[13].vars.negative_time -= 1;
	} else {
		minigames[13].vars.negative_time = -1;
	}
	
	updateStorageBars();
}
/** Handles the effects occurring when a package delivery from the merchant minigame is triggered. */
function packageDelivery() {
	var package_type = minigames[16].vars.package_bonus;
	
	minigames[16].vars.package_bonus = Math.floor((Math.random() * 14));
	
	popupText(buildings[package_type].display_name + " Package", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
	
	if (package_type == 3) {minigames[3].vars.power = minigames[3].vars.max_power}
	else if (package_type == 10) {minigames[10].vars.alien_power = minigames[10].vars.max_power}
	else {minigames[package_type].update(600);}
	
	updateStorageBars();
}
/** Handles the user toggling an effect from the temporal minigame. 
 * @param {int} temporal_id - The id of the effect to be toggled.
 */
function toggleTemporal(temporal_id) {
	var active_effects = minigames[19].vars.active_effects;
	if (active_effects.includes(temporal_id)) {
		for (var i = active_effects.length - 1; i >= 0; i--) {
			if (active_effects[i] == temporal_id) {
				active_effects.splice(i, 1);
			}
		}
	} else {
		if (!(active_effects.length >= minigames[19].vars.max_active_effects)) {
			active_effects.push(temporal_id);
		}
	}
	updateTemporal();
	updateStorageBars();
}
/** Updates the classes of the temporal buttons to display to the user which effects are active. */
function updateTemporal() {
	for (var i = 0; i < 6; i++) {
		$("#temporal_" + i).removeClass("temporal_active");
		$("#temporal_" + i + "_main").removeClass("temporal_active");
		if (minigames[19].vars.active_effects.includes(i)) {
			$("#temporal_" + i).addClass("temporal_active");
			$("#temporal_" + i + "_main").addClass("temporal_active");
		}
	}
}
/** Handles the activating an effect (decree) from the political minigame. 
 * @param {int} decree_id - The id of the effect to be activated.
 * @param {boolean} noPopup - Determines if popup text should appear (true: no popup, false: popup text).
 */
function decree(decree_id, noPopup) {
	switch (decree_id) {
		case 0:
			if (minigames[20].vars.morale >= minigames[20].vars.max_morale) {
				minigames[20].vars.morale = 0;
				minigames[20].vars.entertainment_counters += 1;
				if (!noPopup) popupText("+1 Maximum Morale", $("#decree_0").offset().left + $("#decree_0").width()/2, $("#decree_0").offset().top);
				
				minigames[20].vars.total_decrees += 1;
				if (upgrades[288].bought) {addClockTicks(1)}
				updateStorageBars();
			}
			break;
		case 1:
			if (minigames[20].vars.morale >= tweaker.minigames.decree_collection_cost) {
				minigames[20].vars.morale -= tweaker.minigames.decree_collection_cost;
				var collection = PRODUCTION * 10;
				if (!noPopup) popupText(fancyNumber(collection) + " Collected", $("#decree_1").offset().left + $("#decree_1").width()/2, $("#decree_1").offset().top);
				
				setTimeout(function () {buffs[25].activate(8)}, 2000);
				minigames[20].vars.total_decrees += 1;
				if (upgrades[288].bought) {addClockTicks(1)}
				updateStorageBars();
			}
			break;
		case 2:
			if (minigames[20].vars.morale >= tweaker.minigames.decree_petty_cost) {
				minigames[20].vars.morale -= tweaker.minigames.decree_petty_cost;
				if (!noPopup) popupText("Petty Decree", $("#decree_2").offset().left + $("#decree_2").width()/2, $("#decree_2").offset().top);
				buffs[26].activate(3);
				if (!buffs[26].frozen) {minigames[20].vars.petty_counters += 1;}

				minigames[20].vars.total_decrees += 1;
				if (upgrades[288].bought) {addClockTicks(1)}
				updateStorageBars();
			}
			break;
		case 3: 
			if (minigames[20].vars.morale >= tweaker.minigames.decree_help_cost) {
				minigames[20].vars.morale -= tweaker.minigames.decree_help_cost;
				if (!noPopup) popupText("+25% Production", $("#decree_3").offset().left + $("#decree_3").width()/2, $("#decree_3").offset().top);
				buffs[27].activate(60);

				minigames[20].vars.total_decrees += 1;
				if (upgrades[288].bought) {addClockTicks(1)}
				updateStorageBars();
			}
			break;
	}
	buildings[20].stats["Total Decrees"] = minigames[20].vars.total_decrees;
	
	if (minigames[20].vars.total_decrees > 50) {upgrades[288].makeAvailable()}
	if (minigames[20].vars.total_decrees > 100) {upgrades[289].makeAvailable()}
	if (minigames[20].vars.total_decrees > 200) {upgrades[290].makeAvailable()}
	if (minigames[20].vars.total_decrees > 500) {upgrades[291].makeAvailable()}
	if (minigames[20].vars.total_decrees > 1000) {upgrades[292].makeAvailable()}
	if (minigames[20].vars.total_decrees > 2000) {upgrades[293].makeAvailable()}
	if (minigames[20].vars.total_decrees > 5000) {upgrades[294].makeAvailable()}
}
/** Handles the user activating a bonus factory bonus, the automatic activation from overflow. */
function activateBonus(self, bonus_index) {
	if (minigames[7].vars.length != 0) {
		if (self != null && self.attr("id") != "world_container") {hideTooltip();}
		
		var bonus = minigames[7].vars.bonuses_stored[bonus_index];
		minigames[7].vars.bonuses_stored.splice(bonus_index, 1);
	
		if (bonus == 0) {
			buffs[23].activate(60 + 12 * upgrades[114].bought);
			if (self != null) {popupText("+25% Production", self.offset().left + self.width()/2, self.offset().top);}
		} else if (bonus == 1) {
			addClockTicks(10);
			if (self != null) {popupText("+10 Seconds", self.offset().left + self.width()/2, self.offset().top);}
		} else if (bonus == 2) {
			buffs[33].activate(60 + 12 * upgrades[114].bought);
			if (self != null) {popupText("+30% Click Value", self.offset().left + self.width()/2, self.offset().top);}
		} else if (bonus == 3) {
			minigames[7].vars.package_bonus += 0.01;
			if (self != null) {popupText("+1% Permanently", self.offset().left + self.width()/2, self.offset().top);}
		}
		
		updateBonusPackages();
	}
}
function activateBonusTooltip(self, bonus_index) {
	var bonus_index = minigames[7].vars.bonuses_stored[bonus_index];
	var title_string = "";
	var content_string = "";
	if (bonus_index == 0) {
		title_string = "Production Bonus";
		content_string = "Activating this bonus will increase production by 15% for 60 seconds.";
	}
	else if (bonus_index == 1) {
		title_string = "Extra Seconds";
		content_string = "Activating this bonus will grant 10 extra seconds worth of time.";
	}
	else if (bonus_index == 2) {
		title_string = "Clicking Bonus";
		content_string = "Activating this bonus will increase the value from clicking by 30% for 60 seconds";
	}
	else if (bonus_index == 3) {
		title_string = "Permanent Bonus";
		content_string = "Activating this bonus will permanently increase production by 1%"
	}
	
	tooltip(self, 0, 12, title_string, content_string);
}

function updateBonusPackages() {
	var package_container = $("#package_container");
	if (package_container.length) {
		package_container.empty();
			
		for (var i = 0; i < minigames[7].vars.bonuses_stored.length; i++) {
			var icon = "images/bonus_production.png";
			
			if (minigames[7].vars.bonuses_stored[i] == 0) {icon = "images/bonus_production.png"}
			else if (minigames[7].vars.bonuses_stored[i] == 1) {icon = "images/bonus_extra_seconds.png"}
			else if (minigames[7].vars.bonuses_stored[i] == 2) {icon = "images/bonus_click.png"}
			else {icon = "images/bonus_permanent.png"}
			
			var bonus_icon = $(document.createElement("img"));
			bonus_icon.attr("onclick", "activateBonus($(this), " + i + ");$(this).remove();");
			bonus_icon.attr("src", icon);
			bonus_icon.attr("onmouseover", "activateBonusTooltip(this, "+i+")");
			bonus_icon.attr("onmouseout", "hideTooltip()");
			bonus_icon.css("cursor", "pointer");
			package_container.append(bonus_icon);
		}
	}
	var main_package_container = $("#package_container_main");
	if (main_package_container.length) {
		main_package_container.empty();
			
		for (var i = 0; i < minigames[7].vars.bonuses_stored.length; i++) {
			var icon = "images/bonus_production.png";
			
			if (minigames[7].vars.bonuses_stored[i] == 0) {icon = "images/bonus_production.png"}
			else if (minigames[7].vars.bonuses_stored[i] == 1) {icon = "images/bonus_extra_seconds.png"}
			else if (minigames[7].vars.bonuses_stored[i] == 2) {icon = "images/bonus_click.png"}
			else {icon = "images/bonus_permanent.png"}
			
			var bonus_icon = $(document.createElement("img"));
			bonus_icon.attr("onclick", "activateBonus($(this), " + i + ");$(this).remove();");
			bonus_icon.attr("src", icon);
			bonus_icon.attr("onmouseover", "activateBonusTooltip(this, "+i+")");
			bonus_icon.attr("onmouseout", "hideTooltip()");
			bonus_icon.attr("width", "28");
			bonus_icon.css("cursor", "pointer");
			main_package_container.append(bonus_icon);
		}
	}	
}
/* Toggles the click farm automatic click option */
function toggleAutoClick() {
	minigames[8].vars.autoclick = !minigames[8].vars.autoclick;
	
	if (minigames[8].vars.autoclick) {
		if ($("#click_farm_auto_button").length) $("#click_farm_auto_button").attr("src", "images/click_on.png");
		if ($("#click_farm_auto_button_main").length) $("#click_farm_auto_button_main").attr("src", "images/click_on.png");
	} else {
		$("#click_farm_auto_button").attr("src", "images/click_off.png");
		if ($("#click_farm_auto_button_main").length) $("#click_farm_auto_button_main").attr("src", "images/click_off.png");
	}
}