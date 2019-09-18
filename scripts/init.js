/**
 * @fileOverview Handles the initialization of all game elements when the page loads.
 */
 
//Global variables to cache canvas tile maps
var research_image;
var karma_image;
var isDown = false;

/** Calls functions to initialize most game objects.
 * @param {boolean} soft - Determines if the initialization was called directly after a soft reset.
 */
function init(soft) {
    $("#popup_text").css("opacity", 0);
    
	initSwitches();
    initBuildings();
    initUpgrades();
    initMinigames();
    initTips();
    initUnlocks();
	initSubgames();
	initAssistants();
	initBuffs();
	initHotkeys();
	initSubTutorials();
	initAchievements();
	initAutomation();
	initChallenges();
	initKarmaUpgrades();
	//tutorial
	
	research_image = new Image();
    research_image.src = "images/research_sheet.png";
	karma_image = new Image();
	karma_image.src = "images/karma_sheet.png";
    
	load();

	updateUnlocks();
	updateSubgameButtons();
	updateAchievements();
    
    fastTick();
    slowTick();
	effectTick();
	
	if (KONG_ENABLED) {
		kongregateAPI.loadAPI(function(){
			window.kongregate = kongregateAPI.getAPI();
			loadPurchases();
			kongregate.services.addEventListener("login", onKongregateInPageLogin);
		});
	}
	
	if (!soft) {window.setTimeout(function () {tutorial_list[0].trigger();}, 500);}
}
//Event handler to call init() on page load
$(document).ready(function() { 
    init();
});
