/**
 * @fileOverview Handles the creation, use, and updation of hotkeys.
 */

//Global object to store hotkeys
var hotkeys = {};

//Global variables to track the user editing hotkeys
CHANGE_HOTKEY = false;
CHANGING_HOTKEY = null;
HOTKEY_ELEMENT = null;

//Event listener to trigger hotkey effects
document.addEventListener('keydown', (event) => {
	var key = event.key;

	if (CHANGE_HOTKEY) {
		changeHotkey(key);
	}
	else {
		if (CURRENT_TIER == 1) {
			if (key == hotkeys.building_1 && buildings[0].count >= 1) {toggleBuildingTab(buildings[0]);}
			if (key == hotkeys.building_2 && buildings[1].count >= 1) {toggleBuildingTab(buildings[1]);}
			if (key == hotkeys.building_3 && buildings[2].count >= 1) {toggleBuildingTab(buildings[2]);}
			if (key == hotkeys.building_4 && buildings[3].count >= 1) {toggleBuildingTab(buildings[3]);}
			if (key == hotkeys.building_5 && buildings[4].count >= 1) {toggleBuildingTab(buildings[4]);}
			if (key == hotkeys.building_6 && buildings[5].count >= 1) {toggleBuildingTab(buildings[5]);}
			if (key == hotkeys.building_7 && buildings[6].count >= 1) {toggleBuildingTab(buildings[6]);}
		}
		else if (CURRENT_TIER == 2) {
			if (key == hotkeys.building_1 && buildings[7].count >= 1) {toggleBuildingTab(buildings[7]);}
			if (key == hotkeys.building_2 && buildings[8].count >= 1) {toggleBuildingTab(buildings[8]);}
			if (key == hotkeys.building_3 && buildings[9].count >= 1) {toggleBuildingTab(buildings[9]);}
			if (key == hotkeys.building_4 && buildings[10].count >= 1) {toggleBuildingTab(buildings[10]);}
			if (key == hotkeys.building_5 && buildings[11].count >= 1) {toggleBuildingTab(buildings[11]);}
			if (key == hotkeys.building_6 && buildings[12].count >= 1) {toggleBuildingTab(buildings[12]);}
			if (key == hotkeys.building_7 && buildings[13].count >= 1) {toggleBuildingTab(buildings[13]);}
		} 
		else if (CURRENT_TIER == 3) {
			if (key == hotkeys.building_1 && buildings[14].count >= 1) {toggleBuildingTab(buildings[14]);}
			if (key == hotkeys.building_2 && buildings[15].count >= 1) {toggleBuildingTab(buildings[15]);}
			if (key == hotkeys.building_3 && buildings[16].count >= 1) {toggleBuildingTab(buildings[16]);}
			if (key == hotkeys.building_4 && buildings[17].count >= 1) {toggleBuildingTab(buildings[17]);}
			if (key == hotkeys.building_5 && buildings[18].count >= 1) {toggleBuildingTab(buildings[18]);}
			if (key == hotkeys.building_6 && buildings[19].count >= 1) {toggleBuildingTab(buildings[19]);}
			if (key == hotkeys.building_7 && buildings[20].count >= 1) {toggleBuildingTab(buildings[20]);}
		}

		if (key == hotkeys.switch_tabs) {
		  event.preventDefault();
		  if (CURRENT_TIER == 1 && TIER_2_UNLOCKED) {changeTier(2)}
		  else if (CURRENT_TIER == 2 && TIER_3_UNLOCKED) {changeTier(3)}
		  else if (CURRENT_TIER == 2 && !TIER_3_UNLOCKED) {changeTier(1)}
		  else if (CURRENT_TIER == 3) {changeTier(1)}
		}
		
		if (key == hotkeys.escape_tab) {
			$("#detail_container").hide();
			$("#global_container").hide();
			$("#offline_popup").hide();
			$("#menu_building").remove();
			$(".subgame_background").remove();
			$("#assistant_background").remove();
			$("#building_automation_background").remove();
		
			if (fullscreen) {
				$("#fullscreen_research").hide();
				fullscreen = false;
				$("#close_fullscreen").hide();
			}
		
			if (SHOWN_TAB != -1) {
				toggleBuildingTab(buildings[SHOWN_TAB]);
			}
			stopEdit();
			hideTooltip();
			//Pop into tutorial
		}

		if (key == hotkeys.activateRefill) {
			if ($("#cultist").is(":visible")) {refill(0)}
			else if ($("#gambler").is(":visible")) {refill(2)}
			else if ($("#power_plant").is(":visible")) {refill(3)}
			else if ($("#bank").is(":visible")) {refill(4)}
			else if ($("#research_center").is(":visible")) {refill(5)}
		} 
		else if (key == hotkeys.activatePower) {
			if (SHOWN_TAB < 7 && SHOWN_TAB != 3 && SHOWN_TAB != -1) {toggleOvercharge(SHOWN_TAB)}
		}
		else if (key == hotkeys.activateAlien) {
			if (SHOWN_TAB >= 7) {toggleAliencharge(SHOWN_TAB)}
		}
		else if (key == hotkeys.activateAutomation && buildings[6].count != 0) {
			if (SHOWN_TAB != -1) {
				openAutomation(SHOWN_TAB);
			}
		}		
	  
		else if (key == hotkeys.activate_building_1) {
			if ($("#cultist").is(":visible")) {performRitual(0, 75)}	  
			if ($("#gambler").is(":visible")) {drawCard()}	  
			if ($("#bank").is(":visible")) {invest()}	  
			if ($("#warp_facility").is(":visible")) {warp()}	  
			if ($("#mainframe_computer").is(":visible")) {program1()}	  
			if ($("#click_farm").is(":visible")) {editPath()}	  
			if ($("#acceleration_lab").is(":visible")) {accelTarget(0)}	  
			if ($("#temporal_research_lab").is(":visible")) {toggleTemporal(0)}	  
			if ($("#political_center").is(":visible")) {decree(0)}
			if ($("#fluctuation_lab").is(":visible")) {flux(0)}
		}  
		else if (key == hotkeys.activate_building_2) {
			if ($("#cultist").is(":visible")) {performRitual(5, 60)}	
			if ($("#gambler").is(":visible")) {discardCard()}	
			if ($("#bank").is(":visible") && buildings[1].count != 0) {cashToGold()}	
			if ($("#mainframe_computer").is(":visible")) {program2()}	
			if ($("#click_farm").is(":visible")) {runPath()}
			if ($("#acceleration_lab").is(":visible")) {accelTarget(1)}
			if ($("#temporal_research_lab").is(":visible")) {toggleTemporal(1)}	
			if ($("#political_center").is(":visible")) {decree(1)}
			if ($("#fluctuation_lab").is(":visible")) {flux(1)}
		}  
		else if (key == hotkeys.activate_building_3) {
			if ($("#cultist").is(":visible")) {performRitual(1, 60)}
			if ($("#gambler").is(":visible") && unlocks[5].unlocked) {shuffleDeck()}
			if ($("#bank").is(":visible") && buildings[1].count != 0) {goldToCash()}
			if ($("#mainframe_computer").is(":visible")) {program3()}
			if ($("#click_farm").is(":visible")) {resetPath()}
			if ($("#acceleration_lab").is(":visible")) {accelTarget(2)}
			if ($("#temporal_research_lab").is(":visible")) {toggleTemporal(2)}
			if ($("#political_center").is(":visible")) {decree(2)}
			if ($("#fluctuation_lab").is(":visible")) {flux(2)}
		}  
		else if (key == hotkeys.activate_building_4) {
			if ($("#cultist").is(":visible") && unlocks[1].unlocked) {performRitual(3, 95)}
			if ($("#gambler").is(":visible") && unlocks[6].unlocked) {peek()}
			if ($("#temporal_research_lab").is(":visible")) {toggleTemporal(3)}
			if ($("#political_center").is(":visible")) {decree(3)}
			if ($("#fluctuation_lab").is(":visible")) {flux(3)}			
		}
		else if (key == hotkeys.activate_building_5) {
			if ($("#cultist").is(":visible") && unlocks[2].unlocked) {performRitual(2, 110)}
			if ($("#temporal_research_lab").is(":visible")) {toggleTemporal(4)}	  			
		}
		else if (key == hotkeys.activate_building_6) {
			if ($("#cultist").is(":visible") && unlocks[3].unlocked) {performRitual(4, 75)}	 
			if ($("#temporal_research_lab").is(":visible")) {toggleTemporal(5)}
		} 
		
		else if (key == hotkeys.activateChallenge) {
			if ($("#cultist").is(":visible") && challenges[0].unlocked) {challengeSacrifice(0)}
		}
		
		else if (key == hotkeys.undo) {
		if (UNDO_BUILDING != -1) {
			if (minigames[5].vars.research_tree[25].researched) {
				addClockTicks(-UNDO_COUNT);
				if (CLOCK_TICKS <= 0) {CLOCK_TICKS = 0;}
				addClockTicks(0);
			}
			
			buildings[UNDO_BUILDING].count -= UNDO_COUNT;
			building_count = buildings[UNDO_BUILDING].count
			building_upgrades = buildings[UNDO_BUILDING].upgrade
			if (building_count < 10 && upgrades[building_upgrades[0]].available && !upgrades[building_upgrades[0]].bought) {
				upgrades[building_upgrades[0]].available = false;
				UPDATE_UPGRADES = true;
			}
			if (building_count < 25 && upgrades[building_upgrades[1]].available && !upgrades[building_upgrades[1]].bought) {
				upgrades[building_upgrades[1]].available = false;
				UPDATE_UPGRADES = true;
			}
			if (building_count < 50 && upgrades[building_upgrades[2]].available && !upgrades[building_upgrades[2]].bought) {
				upgrades[building_upgrades[2]].available = false;
				UPDATE_UPGRADES = true;
			}
			if (building_count < 75 && upgrades[building_upgrades[3]].available && !upgrades[building_upgrades[3]].bought) {
				upgrades[building_upgrades[3]].available = false;
				UPDATE_UPGRADES = true;
			}
			if (building_count < 100 && upgrades[building_upgrades[4]].available && !upgrades[building_upgrades[4]].bought) {
				upgrades[building_upgrades[4]].available = false;
				UPDATE_UPGRADES = true;
			}
			if (building_count < 125 && upgrades[building_upgrades[5]].available && !upgrades[building_upgrades[5]].bought) {
				upgrades[building_upgrades[5]].available = false;
				UPDATE_UPGRADES = true;
			}
			UNDO_BUILDING = -1;
			CREDITS += UNDO_PRICE;
			
			UPDATE_BUILDINGS = true;
			}
		}
		else if (key == hotkeys.miniMenu && SWITCHER) {
			var start = (CURRENT_TIER - 1) * 7;
			for (var i = start; i < start+7; i++) {
				if (buildings[i].unlocked) {buildings[i].switcher()}
			}
		}
	}
});
//Event listener handle right click functionality for the click farm
window.oncontextmenu = function (e) {
	var x = e.pageX;
	var y = e.pageY;
    if (minigames[8].vars.edit_path) {
		override = false;
		
		var len = minigames[8].vars.click_path.length;
		for (var i = len - 1; i >= 0; i--) {
			var click = minigames[8].vars.click_path[i];
			var click_x = click[0];
			var click_y = click[1];
			
			if (x > click_x && x < click_x + 45 && y > click_y && y < click_y + 60) {
				override = true;
				minigames[8].vars.click_path.splice(i, 1);
			}
		}
		
		if (!override) {
			minigames[8].vars.click_path.push([x, y]);	
		}
	}
    return false;     // cancel default menu
}
/** Instantiates the default values for the hotkeys. */
function initHotkeys() {
	hotkeys = {
		building_1: '1',
		building_2: '2',
		building_3: '3',
		building_4: '4',
		building_5: '5',
		building_6: '6',
		building_7: '7',
		switch_tabs: 'Tab',
		escape_tab: 'Escape',
		activateRefill: 'f',
		activatePower: 'd',
		activateAlien: 's',
		activateAutomation: 'a',
		activateChallenge: 'c',
		activate_building_1: 'q',
		activate_building_2: 'w',
		activate_building_3: 'e',
		activate_building_4: 'r',
		activate_building_5: 't',
		activate_building_6: 'y',
		undo: 'z',
		miniMenu: 'Control',
	}
}
/** Updates the specified hotkey to be the new value.
 * @param {string} hotkey - The name of the hotkey to change.
 * @param {string} new_value - The value to replace the current hotkey value.
 */
function updateHotkey(hotkey, new_value) {
	hotkeys[hotkey] = newValue;
}
/** Sets all hotkey values to their default values. */
function resetHotkeys() {
	initHotkeys();
}
/** Creates and appends the HTML for the menu to edit hotkeys. */
function hotkeyMenu() {
	var hotkey_menu = $(document.createElement("div"));
	hotkey_menu.attr("id", "hotkey_menu");
	hotkey_menu.attr("onclick", "MENU_CLOSE = false");
	hotkey_menu.attr("style", "text-align:center;z-index:9999;overflow-y: scroll;");
	var heading = $(document.createElement("div"));
	
	var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#hotkey_menu').remove();CHANGE_HOTKEY = false;");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
	
		var hotkey_table = $(document.createElement("table"));
			var hotkey_row = $(document.createElement("tr"));
				var hotkey_data_name = $(document.createElement("th"));
				hotkey_data_name.html("Action");
				
				var hotkey_data_value = $(document.createElement("th"));
				hotkey_data_value.html("Hotkey");

			hotkey_row.append(hotkey_data_name);
			hotkey_row.append(hotkey_data_value);
			hotkey_table.append(hotkey_row);
		
		for (var key in hotkeys) {
			var hotkey_name = ""
			var value = hotkeys[key];
			var hotkey_row = $(document.createElement("tr"));
				
			if (key == 'building_1') {hotkey_name = "Building Menu 1"}
			if (key == 'building_2') {hotkey_name = "Building Menu 2"}
			if (key == 'building_3') {hotkey_name = "Building Menu 3"}
			if (key == 'building_4') {hotkey_name = "Building Menu 4"}
			if (key == 'building_5') {hotkey_name = "Building Menu 5"}
			if (key == 'building_6') {hotkey_name = "Building Menu 6"}
			if (key == 'building_7') {hotkey_name = "Building Menu 7"}
			if (key == 'switch_tabs') {hotkey_name = "Switch Tabs"}
			if (key == 'escape_tab') {hotkey_name = "Escape All Menus"}
			if (key == 'activateRefill') {hotkey_name = "Activate Refill"}
			if (key == 'activatePower') {hotkey_name = "Toggle Power"}
			if (key == 'activateAlien') {hotkey_name = "Toggle Research"}
			if (key == 'activateAutomation') {hotkey_name = "Open Automation"}
			if (key == 'activateChallenge') {hotkey_name = "Challenge Sacrifice"}
			if (key == 'activate_building_1') {hotkey_name = "Building Action 1"}
			if (key == 'activate_building_2') {hotkey_name = "Building Action 2"}
			if (key == 'activate_building_3') {hotkey_name = "Building Action 3"}
			if (key == 'activate_building_4') {hotkey_name = "Building Action 4"}
			if (key == 'activate_building_5') {hotkey_name = "Building Action 5"}
			if (key == 'activate_building_6') {hotkey_name = "Building Action 6"}
			if (key == 'undo') {hotkey_name = "Undo"}
			if (key == 'miniMenu') {hotkey_name = "Toggle Mini Menus"}
			
				var hotkey_data_name = $(document.createElement("td"));
				hotkey_data_name.html(hotkey_name);
				
				var hotkey_data_value = $(document.createElement("td"));
				hotkey_data_value.html(value);
				hotkey_data_value.attr("onclick", "triggerHotkeyChange(this)")
				hotkey_data_value.attr("data-hotkey_name", key);
				hotkey_data_value.attr("data-hotkey_value", value);
				hotkey_data_value.attr("style", "cursor:pointer")

			hotkey_row.append(hotkey_data_name);
			hotkey_row.append(hotkey_data_value);
			hotkey_table.append(hotkey_row);
		}
	hotkey_menu.append(close_button);
	hotkey_menu.append(hotkey_table);
	
	$(document.body).append(hotkey_menu);
}
/** Changes the currently selected hotkey to the new value, and updates the hotkey menu accordingly. */
function changeHotkey(toKey) {
	HOTKEY_ELEMENT.html(toKey);
	updateHotkey(CHANGING_HOTKEY, toKey);
	
	ele.attr("style", "cursor:pointer");
	ele.removeClass("blinking");
	
	CHANGE_HOTKEY = false;
	CHANGING_HOTKEY = null;
	HOTKEY_ELEMENT = null;
}
/** Function fired when the user begins to edit a hotkey. */
function triggerHotkeyChange(element) {
	ele = $(element);
	
	ele.attr("style", "cursor:pointer");
	ele.addClass("blinking");
	
	key = ele.attr("data-hotkey_name");
	value = ele.attr("data-hotkey_value");
	
	CHANGE_HOTKEY = true;
	CHANGING_HOTKEY = key;
	HOTKEY_ELEMENT = ele;
}
// Event handler to handle clicking out of submenus functionality
$(document).on("click", function () {
	if (MENU_CLOSE && settings.menu_close) {
		$("#assistant_background").remove();
		$("#challenge_popup").remove();
		$("#global_container").hide();
		$("#achievement_container").remove();
		$("#corruption_background").remove(); $("#corruption_reset_background").remove();
		$("#detail_container").hide();
		$("#wipe_popup").hide();
		$("#save_popup").hide();
		$("#hotkey_menu").remove();CHANGE_HOTKEY = false;
		$("#offline_popup").hide();
		$("#building_automation_background").remove();
		$("#soft_reset_background").remove();
		$("#soft_reset_confirmation").remove();
		$("#kong_shop").remove();
		$("#login_popup").remove();
	}
	MENU_CLOSE = true;
});
/** Switches the document into fullscreen mode. */
function openFullscreen() {
  elem = document.documentElement;
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
	$("#global_fullscreen").attr("src", "images/close_fullscreen.png");
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
	$("#global_fullscreen").attr("src", "images/fullscreen.png");
  }
}