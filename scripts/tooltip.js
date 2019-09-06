var popup_log = [];

function tooltip(element, x, y, title, content, refresh, upgrade_sheet) {
    $("#tooltip").show();
    
    x = -Math.abs(x);
    y = -Math.abs(y);
    
    if (refresh) {
        TOOLTIP_FUNCTION = refresh;   
    } else {
        TOOLTIP_FUNCTION = null;   
    }
    var icon = "";
    if (!refresh || upgrade_sheet) {
		icon = "url(images/upgrade_sheet.png) "+x*48+"px "+y*48+"px";
	} else {
		icon = "url(images/buff_sheet.png) "+x*48+"px "+y*48+"px";
	}
    $("#tooltip_icon").attr("style", "float:left;height:48px;width:48px;float:left;background:"+icon+";");
    $("#tooltip_title").html(title);
    $("#tooltip_content").html(content);
    
    var offset = $(element).offset();
    var height = $(element).height();
    var width = $(element).width();
    
    var offset_top = Math.max(offset.top + height/2 - $("#tooltip").height()/2, 0);
    var offset_left = offset.left + width;
	
	if (offset_left + $("#tooltip").width() > $(window).width()) {
		offset_left = offset.left - $("#tooltip").width() - 10
	}
	if (offset_top + $("#tooltip").height() > $(window).height()) {
		offset_top = $(window).height() - $("#tooltip").height() - 10;
	}
    
    if (width) {
        $("#tooltip").offset({ top: (offset_top), left: (offset_left)});
    }
}
function researchTooltip(node) {
	$("#tooltip").show();
	TOOLTIP_FUNCTION = null;
	
	var icon = "url(images/research_sheet.png) "+-node.sx+"px "+-node.sy+"px";
	
    $("#tooltip_icon").attr("style", "float:left;height:48px;width:48px;float:left;background:"+icon+";");
    $("#tooltip_title").html(node.name);
	var color_cost = "#00FF08";
	if (node.cost > minigames[5].vars.research_points) {color_cost = "#FF0000"}
	var research_string = "<br>Cost: <span style=\"color:" + color_cost + ";\">" + node.cost + "</span> research point(s)<br><span>Researched <span style=\"color:#00FFEE;\">" +node.bought+ "/" +node.max+ "</span> times</span>"  
    $("#tooltip_content").html(node.description + "<br>" + node.tooltip() + research_string);
	
	if ($("#fullscreen_research").is(":hidden")) {
		var ele = $("#research_canvas");
	} else {
		var ele = $("#fullscreen_research");
	}
	
    var x = ele.offset().left + node.x - minigames[5].vars.research_camera.x + 48;
    var y = ele.offset().top + node.y - minigames[5].vars.research_camera.y;
    
    $("#tooltip").offset({ top: (y), left: (x)});
}
function karmaTooltip(node) {
	$("#tooltip").show();
	TOOLTIP_FUNCTION = null;
	
	var icon = "url(images/karma_sheet.png) "+-node.sx+"px "+-node.sy+"px";
	
    $("#tooltip_icon").attr("style", "float:left;height:48px;width:48px;float:left;background:"+icon+";");
    $("#tooltip_title").html(node.name);
	var color_cost = "#ffd21f";
	if (node.cost > KARMA_POINTS - SPENT_KARMA_POINTS) {color_cost = "#FF0000"}
	var karma_string = "<br>Cost: <span style=\"color:" + color_cost + ";\">" + fancyNumber(node.cost) + "</span> Upgrade Points"  
    $("#tooltip_content").html(node.description + "<br>" + karma_string);
	
	var ele = $("#fullscreen_karma");
	
    var x = ele.offset().left + node.x - karma_tree.camera.x + 48;
    var y = ele.offset().top + node.y - karma_tree.camera.y;
    
    $("#tooltip").offset({ top: (y), left: (x)});
}
function updateTooltip() {
    if (TOOLTIP_FUNCTION != null) {
        $("#tooltip_content").html(TOOLTIP_FUNCTION());
    }
}
function hideTooltip() {
    $("#tooltip").hide();
}
function popupText(text, x, y) {
    var popup = $("#popup_text");
    popup.html(text);
    var w = popup.width()/2;
    popup.css("top", y+"px");
    popup.css("left", x-w+"px");
    popup.css("opacity", "1");
	
	popup_log.push(text);
	if (popup_log.length >= 16) {
		popup_log.shift();
	}
}
function globalStatisticTooltip(self) {
	var stat_string = "Credits Earned: " + fancyNumber(stats.credits_earned) + "<br>";
	stat_string += "Total Clicks: " + stats.total_clicks + "<br>";
	stat_string += "Time Played: " + secondsToTime(Math.floor(stats.time_played_real)) + "<br>" 
	
	
	tooltip(self, 6, 6, "View Statistics", stat_string + "Click to view more statistics", function () {return "Credits Earned: " + fancyNumber(stats.credits_earned) + "<br>" + "Total Clicks: " + stats.total_clicks + "<br>" + "Time Played: " + secondsToTime(Math.floor(stats.time_played_real)) + "<br>" + "Click to view more statistics"}, true);
}
function globalUpgradesTooltip(self) {
	tooltip(self, 8, 9, "View Upgrades", "Click to view the upgrades and their effects that you have already purchased.", function () {}, true);
}
function globalSettingsTooltip(self) {
	tooltip(self, 0, 8, "Settings", "Click to view or edit game settings.", function () {}, true);
}
function fullscreenTooltip(self) {
	tooltip(self, 8, 17, "Fullscreen", "Click to toggle fullscreen mode.", function () {}, true);
}
function globalInformationTooltip(self) {
	//var curr_string = "";
	curr_function = function () {
		return currencyString() + "Right click to toggle building currency display";
	}

	
	tooltip(self, 0, 0, "Currencies", curr_function(), function () {return curr_function()}, true);
}
function toggleCurrency() {
	if (!$("#currency_display").length) {
		var currency_display = $(document.createElement("div"));
		
		var curr_string = currencyString();
		curr_string += "<br>Right click to close";
			
		currency_display.attr("id", "currency_display");
		currency_display.attr("style", "position: absolute; width: 185px; z-index: 0; background: radial-gradient(rgba(200, 200, 200, 0.2), rgba(0, 0, 0, 0.2)), url(images/noise_blue.png); border: 2px solid black; border-radius: 4px;font-size:75%;");
		currency_display.html(curr_string);
		currency_display.attr("oncontextmenu", "toggleCurrency()");
		
		$("#button_container").append(currency_display);
	} else {
		$("#currency_display").remove();
	}
}
function updateCurrencyDisplay() {
	$("#currency_display").html(currencyString() + "<br>Right click to close");
}
function currencyString() {
	var curr_string = "";
	if (buildings[0].count != 0) {curr_string += "Blood: <span style='color:#ff1e2d;'>" + Math.floor(minigames[0].vars.blood) + "</span> <span style='color:#ff1ea4;'>(" + Math.round(100 * 0.5 * minigames[0].vars.max_blood/200)/100 + "/s)</span><br>"}
	if (buildings[1].count != 0) {curr_string += "Gold: <span style='color:#f6ff53;'>" + Math.floor(minigames[1].vars.gold) + "</span> <span style='color:#F8FF79;'>(" + Math.floor(minigames[1].vars.mine_time) + "s)</span><br>"}
	if (buildings[2].count != 0) {curr_string += "Card Draws: <span style='color:#5EC1FF;'>" + Math.floor(minigames[2].vars.draw_charges) + "</span> <span style='color:#ADDFFF;'>(" + Math.floor(minigames[2].vars.draw_time) + "s)</span><br>"}
	if (buildings[3].count != 0) {curr_string += "Power: <span style='color:#fddc24;'>" + Math.floor(minigames[3].vars.power) + "</span> <span style='color:#FD7024;'>(+" + Math.round((minigames[3].vars.power_rate) * 100) / 100 + "/s)</span><br>"}
	if (buildings[4].count != 0 && minigames[4].vars.investing) {curr_string += "Time Until Investment: <span style='color:#F5F5F5;'>" + secondsToTime(Math.round(minigames[4].vars.investment_time)) + "</span><br>"}
	if (buildings[5].count != 0) {curr_string += "Research Points: <span style='color:#36B8FF;'>" + Math.round(minigames[5].vars.research_points) + "</span> <span style='color:#36B8FF;'>(" + Math.floor(minigames[5].vars.research_time) + "s)</span><br>"}
	if (buildings[7].count != 0) {curr_string += "Next Bonus: <span style='color:#b56a00;'>" + Math.round(minigames[7].vars.bonus_time) + "s</span><br>"}
	if (buildings[8].count != 0) {curr_string += "Clicks: <span style='color:#87E2F5;'>" + Math.round(minigames[8].vars.stored_clicks) + "</span> <span style='color:#4A59FF;'>(" + Math.round(minigames[8].vars.click_time) + "s)</span><br>"}
	if (buildings[10].count != 0) {curr_string += "Alien Research: <span style='color:#CC79E8;'>" + Math.round(minigames[10].vars.alien_power) + "/" + minigames[10].vars.max_power + "</span> <span style='color:#DAA1ED;'>(+" + Math.round((minigames[10].vars.alien_power_rate) * 100) / 100 + "/s)</span><br>"}
	if (buildings[13].count != 0) {curr_string += "Fluctuation in: <span style='color:#F4FF1E;'>" + Math.round(minigames[13].vars.flux_time) + "s</span><br>"}
	
	return curr_string;
}
function saveTooltip(self) {
	var extra_text = ""
	
	if (settings.autosave_rate < 100) {
		extra_text = "Will automatically save once every " + settings.autosave_rate + " seconds";
	} else {
		extra_text = "Autosaving Disabled"
	}
	tooltip(self, 9, 0, "Save", "Click to save.<br>" + extra_text, function () {}, true);
}
function unlockBuildingTooltip(self, i) {
	var color = "color:#e02900;text-shadow:0px 0px 8px #ff451c;";
	if (CREDITS >= tierPrice(buildings[i].tier)) {
		color = "color:#00db0a;text-shadow:0px 0px 2px #52d56a;";
	}
	var description = buildings[i].description + '<br><span style = \"' + color + 'font-size:18px;\">Price: '+fancyNumber(tierPrice(CURRENT_TIER))+' Credits</span>';
    tooltip(self, buildings[i].x, buildings[i].y, buildings[i].tab_name, description);
}