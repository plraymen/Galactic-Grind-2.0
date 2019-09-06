var research_image;
var karma_image;
var isDown = false;

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
$(document).ready(function() { 
    init();
});
