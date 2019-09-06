/**
 * @fileOverview Group of helper functions to generate HTML for various icons.
 */

/** Returns an image element for the refill icon.
 * @param {int} building_id - The id of the building to display the refill icon.
 * @param {string} title - The title to be displayed on the tooltip for the element.
 * @param {string} text - The text to be displayed on the tooltip for the element.
 * @param {boolean} main - Determines if this icon is for the building's minimenu or submenu (true: minimenu, false: submenu).
 * @return {element} - The image element generated.
 */
function htmlGoldRefill(building_id, title, text, main) {
	var building = buildings[building_id];
	var ele = $(document.createElement("img"));
	
	ele.attr("class", "gold_refill").attr("id", building.name + "_gold_refill").css("cursor", "pointer");
	//if (main) {ele.addClass("switcher_icon")}
	ele.attr("src", "images/building_icon_mine.png");
	if (main) {ele.attr("height", "28").attr("width", "28").addClass("switcher_icon");}
	else {ele.attr("height", "48").attr("width", "48");}
	ele.attr("onclick", "refill(" + building_id + ")");
	ele.attr("onmouseover","tooltip(this, 3, 2, '" + title + "', '" + text + ", for the cost of '+ Math.floor(20 * Math.pow(1.1, minigames[1].vars.stored_ids.count(" + building_id + "))) +' gold bars.<br>You currently own <span style=\"color:#FFFB1C\">' + minigames[1].vars.gold + '</span> gold bars.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activateRefill.toUpperCase() + '</span>')");
	ele.attr("onmouseout", "hideTooltip();");
	
	return ele;
}
/** Returns an image element for the power icon.
 * @param {int} building_id - The id of the building to display the power icon.
 * @param {boolean} main - Determines if this icon is for the building's minimenu or submenu (true: minimenu, false: submenu).
 * @return {element} - The image element generated.
 */
function htmlPower(building_id, main) {
	var building = buildings[building_id];
	var ele = $(document.createElement("img"));
	
	ele.attr("class", "overcharge").attr("id", building.name + "_overcharge").css("cursor", "pointer");
	if (!minigames[3].vars.powered_buildings.includes(building_id)) {
		ele.attr("src", "images/misc_inactive_power.png");
	} else {
		ele.attr("src", "images/building_icon_power.png");
	}
	if (main) {ele.attr("height", "28").attr("width", "28").attr("id", building.name + "_overcharge_main").addClass("switcher_icon");}
	else {ele.attr("height", "48").attr("width", "48");}
	ele.attr("onclick", "toggleOvercharge(" + building_id + ")");
	ele.attr("onmouseover","tooltip(this, 0, 5, 'Overcharge', 'Toggle to increases production and working speed of this building by 50%.<br>You currently have <span style=\"color:#FFFC5C\">' + Math.round(minigames[3].vars.power) + '</span> seconds worth of power.', function () {return 'Toggle to increases production and working speed of this building by 50%.<br>You currently have <span style=\"color:#FFFC5C\">' + Math.round(minigames[3].vars.power) + '</span> seconds worth of power.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activatePower.toUpperCase() + ' </span>'}, true)");
	ele.attr("onmouseout", "hideTooltip();");
	
	return ele;
}
/** Returns an image element for the challenge icon.
 * @param {int} building_id - The id of the building to display the challenge icon.
 * @param {boolean} main - Determines if this icon is for the building's minimenu or submenu (true: minimenu, false: submenu).
 * @return {element} - The image element generated.
 */
function htmlTabChallenge(building_id, main) {
	var building = buildings[building_id];
	var ele = $(document.createElement("img"));
	
	ele.attr("class", "challenge").attr("id", building.name + "_challenge").css("cursor", "pointer");
	ele.attr("src", "images/challenge_" + building_id + ".png");
	if (main) {ele.attr("height", "28").attr("width", "28").addClass("switcher_icon");}
	else {ele.attr("height", "48").attr("width", "48");}
	ele.attr("onclick", "challengeSacrifice(" + building_id + ")");
	ele.attr("onmouseover","tooltip(this, " + building_id + ", 31, '" + challenges[building_id].name + "', '" + challenges[building_id].tab_description + "<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activateChallenge.toUpperCase() + '</span>')");
	ele.attr("onmouseout", "hideTooltip();");
	
	return ele;
}
/** Returns an image element for the clone icon.
 * @param {int} building_id - The id of the building to display the clone icon.
 * @param {boolean} main - Determines if this icon is for the building's minimenu or submenu (true: minimenu, false: submenu).
 * @return {element} - The image element generated.
 */
function htmlClone(building_id, main) {
	var ele = $(document.createElement("img"));

	ele.attr("src", "images/misc_clone.png")
	ele.attr("class", "clone").attr("id", "building_clone").css("cursor", "pointer");
	if (main) {ele.attr("height", "28").attr("width", "28").addClass("switcher_icon");}
	else {ele.attr("height", "48").attr("width", "48");}
	ele.attr("onclick", "clone(" + building_id + ");hideTooltip();");
	ele.attr("onmouseover","tooltip(this, 0, 24, 'Clone', 'Click to double the production and work rate of this building for 90 seconds.<br>You currently have <span style=\"color:#CD60FF\">' + Math.round(minigames[14].vars.clone_charges) + '</span> clones ready for use.')");
	ele.attr("onmouseout", "hideTooltip();");
	
	return ele;
}
/** Returns an image element for the alien power icon.
 * @param {int} building_id - The id of the building to display the alien power icon.
 * @param {boolean} main - Determines if this icon is for the building's minimenu or submenu (true: minimenu, false: submenu).
 * @return {element} - The image element generated.
 */
function htmlAlienPower(building_id, main) {
	var building = buildings[building_id];
	var ele = $(document.createElement("img"));
	
	ele.attr("class", "aliencharge").attr("id", building.name + "_aliencharge").css("cursor", "pointer");
	if (!minigames[10].vars.powered_buildings.includes(building_id)) {
		ele.attr("src", "images/misc_inactive_alien.png");
	} else {
		ele.attr("src", "images/misc_active_alien.png");
	}
	if (main) {ele.attr("height", "28").attr("width", "28").attr("id", building.name + "_aliencharge_main").addClass("switcher_icon");}
	else {ele.attr("height", "48").attr("width", "48");}
	ele.attr("onclick", "toggleAliencharge(" + building_id + ")");
	ele.attr("onmouseover","tooltip(this, 3, 15, 'Alien Reseach', 'Toggle to increases production of this building by 75%, but reduce its work rate by 25%.<br>You currently have <span style=\"color:#DA89F5\">' + Math.round(minigames[10].vars.alien_power) + '</span> seconds worth of research.', function () {return 'Toggle to increases production of this building by 75%, but reduce its work rate by 25%.<br>You currently have <span style=\"color:#DA89F5\">' + Math.round(minigames[10].vars.alien_power) + '</span> seconds worth of research.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activateAlien.toUpperCase() + ' </span>'}, true)");
	ele.attr("onmouseout", "hideTooltip();");
	
	return ele;
}
/** Returns an image element for the factory automation icon.
 * @param {int} building_id - The id of the building to display the automation icon.
 * @param {boolean} main - Determines if this icon is for the building's minimenu or submenu (true: minimenu, false: submenu).
 * @return {element} - The image element generated.
 */
function htmlAutomation(building_id, main) { 
	var building = buildings[building_id];
	var ele = $(document.createElement("img"));
	
	ele.attr("class", "automation").attr("id", building.name + "_automation").css("cursor", "pointer");
	ele.attr("src", "images/building_icon_factory.png");
	if (main) {ele.attr("height", "28").attr("width", "28").addClass("switcher_icon");}
	else {ele.attr("height", "48").attr("width", "48");}
	ele.attr("onclick", "openAutomation(" + building_id + ")");
	ele.attr("onmouseover","tooltip(this, 2, 8, 'Automation', 'Opens the automation menu for this building.<br>Hotkey: ' + hotkeys.activateAutomation.toUpperCase() + '</span>')");
	ele.attr("onmouseout", "hideTooltip();");
	
	return ele;
}
/** Opens the automation menu for the given building.
 * @param {int} building_id - The id of the building to be loaded into the automation menu.
 */
function openAutomation(building_id) {
	if (!$("#building_automation_background").length) {
		var background = $(document.createElement("div"));
			background.attr("class", "building_automation_background");
			background.attr("id", "building_automation_background");
			background.attr("onclick", "MENU_CLOSE = false;")
			background.css("border", "3px solid black");
			background.css("border-radius", "10px");
			background.css("text-align", "center");
			
		var title = $(document.createElement("div"));
            title.attr("class", "detail_title");
			title.html(buildings[building_id].display_name + "<br>Automation");
			
		var close_button = $(document.createElement("img"));
			close_button.attr("src", "images/button_x.png").attr("height", "48").attr("width", "48");
			close_button.attr("onclick", "$('#building_automation_background').remove()");
			close_button.attr("style", "position:absolute;right:0px;top:0px;cursor:pointer");
			close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
			close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
			
		var autobuy_div = $(document.createElement("div"));
			autobuy_div.attr("id", "autobuy_div");
			autobuy_div.attr("style", "font-size: 130%;")
			
		background.append(title);
		background.append(close_button);
		background.append(autobuy_div);
		$(document.body).append(background);
		
		if (building_id != 6) {updateAutobuyButton(building_id)};
		automation[building_id].createHTML();
		
		hideTooltip();
	} else {
		$("#building_automation_background").remove();
	}
	MENU_CLOSE = false;
}
/** Updates the the autobuy button and text elements for the given's building automation menu.
 * @param {int} building_id - The id of the building to be updated in the automation menu.
 */
function updateAutobuyButton(building_id) {
	$("#autobuy_div").empty();
	var html_string = "Autobuy " + buildings[building_id].display_name + ": ";
	if (automation[building_id].autobuy) {
		html_string += "ON <img style='position:relative;top:8px;cursor:pointer' onclick='automation["+building_id+"].autobuy = false;updateAutobuyButton("+building_id+");' height='32' width='32' src='" + buildings[building_id].tab_icon_hover + "'>";
	} else {
		html_string += "OFF <img style='position:relative;top:8px;cursor:pointer' onclick='automation["+building_id+"].autobuy = true;updateAutobuyButton("+building_id+");' height='32' width='32' src='" + buildings[building_id].tab_icon + "'>"
	}
	$("#autobuy_div").html(html_string);
}
/** Updates the icon in the bonus minigame to display if the next bonus will be positive or negative. */
function updateBonusIcon() {
	if (minigames[7].vars.bonus_iteration == (3 + upgrades[114].bought)) {
		$("#bonus_icon").attr("src", "images/bonus_malfunction.png");
		$("#bonus_icon_main").attr("src", "images/bonus_malfunction.png");
	} else {
		$("#bonus_icon").attr("src", "images/bonus_normal.png")
		$("#bonus_icon_main").attr("src", "images/bonus_normal.png")
	}
	
	if (minigames[7].vars.disabled) {
		$("#bonus_icon").css("filter", "grayscale(100%)");
		$("#bonus_icon_main").css("filter", "grayscale(100%)");
	} else {
		$("#bonus_icon").css("filter", "grayscale(0%)");
		$("#bonus_icon_main").css("filter", "grayscale(0%)");
	}
}