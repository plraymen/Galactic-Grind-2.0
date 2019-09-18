/**
 * @fileOverview Handles the creation and interaction of independent menus.
 */

/** Creates the menu that allows the player to choose a new building to unlock. */
function createBuildingMenu() {
    if (document.getElementById("menu_building")) {return;}
    
    var container = $(document.createElement("div"));
    container.attr("id", "menu_building");
    
    var title = $(document.createElement("div"));
    title.html("Choose a Building to Unlock").attr("class", "menu_building_title");
    container.append(title);
    
    var len = buildings.length;
    for (var i = 0; i < len; i ++) {
        if (buildings[i].tier == CURRENT_TIER && !buildings[i].unlocked) {
            var icon = $(document.createElement("img"));
            icon.attr("src", buildings[i].tab_icon);
			icon.attr("data-stored_src", buildings[i].tab_icon_hover);
			icon.attr("data-original_src", buildings[i].tab_icon);
            
            var description = buildings[i].description + '<br><span style = \"color:#00db0a;text-shadow:0px 0px 2px #52d56a;font-size:18px;\">Price: '+fancyNumber(tierPrice(CURRENT_TIER))+' Credits</span>';
            icon.attr("onmouseover", "unlockBuildingTooltip(this, " + i + ")");
            icon.attr("onmouseleave", "hideTooltip();$(this).attr('src', $(this).attr('data-original_src'))");
			icon.attr("class", "building_menu_icon");
            icon.attr("onclick", "unlockBuilding('"+buildings[i].name+"');");
            
            container.append(icon);
            container.append($(document.createTextNode(" ")));
            if (i == 3) {container.append($(document.createElement("br")))}
        }
    }
    
    container.append($(document.createElement("br")));
    
    var cancel_button = $(document.createElement("img"));
    cancel_button.attr("src", "images/button_cancel.png");
    cancel_button.attr("style", "cursor:pointer;");
    cancel_button.attr("onclick", "$('#menu_building').remove();");
    
    container.append(cancel_button);
    
    $("#menu_container").append(container);
}
/** Updates the current by count to the specified value (10000 = buy max).
 * @param {int} count - The value to replace the current buy count.
 */
function changeBuyCount(count) {
    BUY_COUNT = count;
    $("#buy_count_1").attr("class", "");
    $("#buy_count_5").attr("class", "");
    $("#buy_count_10").attr("class", "");
    $("#buy_count_50").attr("class", "");
    $("#buy_count_10000").attr("class", "");
    
    $("#buy_count_"+count).attr("class", "buy_count");
    
    UPDATE_BUILDINGS = true;
    updateBuildings();
}
/** Updates the extra second display. */
function updateClockDisplay() {
    var container = $("#clock_container");
    var icon = $("#speed_icon");
    var speed_display = $("#speed_display");
    var time_remaining = $("#time_remaining");
    
    if (GAME_SPEED == 1) {if (icon.attr("src") != "images/ui_speed_1.png") {icon.attr("src", "images/ui_speed_1.png")}}
    else if (GAME_SPEED < 5) {if (icon.attr("src") != "images/ui_speed_2.png") {icon.attr("src", "images/ui_speed_2.png")}}
    else if (GAME_SPEED >= 5) {if (icon.attr("src") != "images/ui_speed_3.png") {icon.attr("src", "images/ui_speed_3.png")}}
    
    var icon_left = container.width()/2 - icon.width()/2; 
    icon.css({ top: 1, left: icon_left });
    
    var display_left = container.width()/2 - icon.width()/2 - speed_display.width() - 8;
    speed_display.css({ top : 7, left : display_left});
    
    var time_left = container.width()/2 + icon.width()/2 + 8;
    time_remaining.css({ top : 7, left : time_left});
}
/** Switches the location on the screen where temporary bonuses and the credit display is. */
function toggleBuffLocation() {
	if (SHOWN_TAB == -1) {
		$("#center_content").append($("#buff_container"));
		$("#buff_container").removeClass("buff_bottom");
		$("#small_credits_display").hide();
		$("#buff_container").hide().fadeIn();
	} else {
		$(document.body).append($("#buff_container"));
		$("#buff_container").addClass("buff_bottom");
		$("#buff_container").hide().fadeIn();
		$("#small_credits_display").show();
	}
}
/** Opens the menu to import or export the save file. 
 * @param {event} event - The click event (will be canceled)
 */
function openImportExport(event) {
	$("#export_textarea").val("Click export to export your save, or paste a save here then click import to import a save.");
	$("#save_popup").show();
	
	stopProp(event);
}
/** Opens the menu to wipe the current save file. 
 * @param {event} event - The click event (will be canceled)
 */
function openWipeSave(event) {
	$("#wipe_popup").show();
	
	stopProp(event);
}