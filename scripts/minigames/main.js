/**
 * @fileOverview Handles the creation and updating of minigame objects
 */

//Global minigame array
var minigames = [];

/** Holds the data and the methods to handle the minigames associated with each building.
 * @constructor
 */
function Minigame() {
    this.vars = {};
    this.createHTML = function () {};
    this.updateHTML = function () {};
    this.createDetails = function () {};
    this.updateDetails = function () {};
    this.update = function () {};
}

/** Instantiates all minigames, and add necessary methods and data. */
function initMinigames() {
    var cultist_minigame = new Minigame();
    
    cultist_minigame.vars = {
        blood : 100,
        max_blood : 100,
		blood_spent: 0,
        soot_counters : 0,
        purity_counters : 0,
        karma_counters : 0,
        rituals_performed: 0,
    };
	cultist_minigame.upgrades = [
		[0, function () {return true;}, "Unlocks once you own 10 cultists."],
		[1, function () {return buildings[0].count >= 10;}, "Unlocks once you own 25 cultists."],
		[2, function () {return buildings[0].count >= 25;}, "Unlocks once you own 50 cultists."],
		[3, function () {return buildings[0].count >= 50;}, "Unlocks once you own 75 cultists."],
		[4, function () {return buildings[0].count >= 75;}, "Unlocks once you own 100 cultists."],
		[5, function () {return buildings[0].count >= 100;}, "Unlocks once you own 125 cultists."],
		[99, function () {return buildings[0].count >= 125;}, "Unlocks once you own 150 cultists."],
		[6, function () {return true;}, "Unlocks once you activate 10 rituals."],
		[7, function () {return true;}, "Unlocks once you activate 25 rituals."],
		[8, function () {return true;}, "Unlocks once you activate 50 rituals."],
		[9, function () {return true;}, "Unlocks once you activate 100 rituals."],
		[80, function () {return true;}, "Unlocks once you reach 500 million credits."],
		[87, function () {return true;}, "Unlocks once you reach 26 Billion credits."],
		[178, function () {return true;}, "Unlocks once you spend more than one day playing."],
		[192, function () {return true;}, "Unlocks with the achievement Cult Mastery."],
	];
    cultist_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlGoldRefill(0, "Refill Blood", "Increases your current amount of blood to the maximum value"));
		$("#building_tab_sidebar").append(htmlPower(0));
		$("#building_tab_sidebar").append(htmlAutomation(0));
		$("#building_tab_sidebar").append(htmlClone(0));
		$("#building_tab_sidebar").append(htmlTabChallenge(0));
		
        var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[0].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[0].count + " " + buildings[0].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[0].production * buildings[0].production_multiplier) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[0].production * buildings[0].count * buildings[0].production_multiplier) + "</span>.");
        
        minigame_container.append(explanation);
        
        var blood_container = $(document.createElement("div"));
        
            var blood = $(document.createElement("span"));
            blood.attr("style", "color:red;font-size:32px").attr("id", "current_blood");
            blood.html("100/");
            var max_blood = $(document.createElement("span"));
            max_blood.attr("style", "color:red;font-size:32px").attr("id", "max_blood");
            max_blood.html("100 Blood");
        
        blood_container.append(blood).append(max_blood);
        
        
        var ritual_rush = $(document.createElement("img"));
        ritual_rush.attr("src", "images/ritual_blood_rush.png").attr("class", "ritual").attr("id", "ritual_0").attr("width", "64");
        ritual_rush.attr("onclick", "performRitual(0, 75);");
        ritual_rush.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Blood Rush', 'Increases production by <span style=\"color:#00db0a;\">25%</span> for 66 seconds. <br><span>Cost: 75 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')");
        ritual_rush.attr("onmouseout", "hideTooltip()");
        
        var ritual_time = $(document.createElement("img"));
        ritual_time.attr("src", "images/ritual_of_time.png").attr("class", "ritual").attr("id", "ritual_1").attr("width", "64");
        ritual_time.attr("onclick", "performRitual(1, 60)");
        ritual_time.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Time', 'Grants 10 seconds worth of time. <br><span>Cost: 60 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')");
        ritual_time.attr("onmouseout", "hideTooltip()");

        var ritual_purity = $(document.createElement("img"));
        ritual_purity.attr("onclick", "performRitual(2, 110)");
        ritual_purity.attr("src", "images/ritual_of_purity.png").attr("class", "ritual").attr("id", "ritual_2").attr("width", "64");
        ritual_purity.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Purity', 'Resets the ritual of soot activations to 0. If more than 20 soot activations removed this way, production is permanantly increased by <span style=\"color:#00db0a;\">3%</span>. <br><span>Cost: 110 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_5.toUpperCase() + ' </span>')");
        ritual_purity.attr("onmouseout", "hideTooltip()");
        
        var ritual_soot = $(document.createElement("img"));
        ritual_soot.attr("src", "images/ritual_of_soot.png").attr("class", "ritual").attr("id", "ritual_3").attr("width", "64");
        ritual_soot.attr("onclick", "performRitual(3, 95)");
        ritual_soot.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Soot', 'Increases production by 15% + 3% for each previous ritual of soot activation <span style=\"color:#00db0a;\">('+Math.round((0.15 + minigames[0].vars.soot_counters * 0.03) * 100)+'%)</span>. This effect lasts 70 seconds. Each activation also permanently decreases production 1% <span style=\"color:#ff1e2d;\">(-'+Math.round(minigames[0].vars.soot_counters)+'%)</span>.<br><span>Cost: 95 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_4.toUpperCase() + ' </span>')");
        ritual_soot.attr("onmouseout", "hideTooltip()");
        
        var ritual_karma = $(document.createElement("img"));
        ritual_karma.attr("onclick", "performRitual(4, 75)");
        ritual_karma.attr("src", "images/ritual_of_karma.png").attr("class", "ritual").attr("id", "ritual_4").attr("width", "64");
        ritual_karma.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Karma', 'Increases the base production of cultists by 15 + 2 for each ritual of karma permanently (Currently: <span style=\"color:#00db0a;\">'+minigames[0].vars.karma_counters * (15 + (15 + (minigames[0].vars.karma_counters-1)*2))/2+'</span>). This effect persists through resets.<br><span>Cost: 75 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_6.toUpperCase() + ' </span>')");
        ritual_karma.attr("onmouseout", "hideTooltip()");
        
        var ritual_construction = $(document.createElement("img"));
        ritual_construction.attr("onclick", "performRitual(5, 60);");
        ritual_construction.attr("src", "images/ritual_of_construction.png").attr("class", "ritual").attr("id", "ritual_5").attr("width", "64");
        ritual_construction.attr("onmouseover", "tooltip('#'+this.id, 5, 1, 'Ritual of Construction', 'Instantly grants 1 free cultist, but has a 1% stacking chance of failure per cultist owned ('+Math.round((Math.pow(0.99, buildings[0].count)) * 1000) / 10+'% chance of success).<br><span>Cost: 60 Blood</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')");
        
        ritual_construction.attr("onmouseout", "hideTooltip()");
        
        minigame_container.append(blood_container);
        minigame_container.append(ritual_rush);
        minigame_container.append(ritual_construction);
        minigame_container.append(ritual_time);
        minigame_container.append(ritual_soot);
        minigame_container.append(ritual_purity);
        minigame_container.append(ritual_karma);
        
        $(".building_tab").append(minigame_container);
        
        updateUnlocks(); 
    };
    cultist_minigame.updateHTML = function () {
        $("#current_blood").html(Math.floor(this.vars.blood) + "/");
        $("#max_blood").html(Math.floor(this.vars.max_blood) + " Blood");
        updateBuildingExplanation(0);
    };
    cultist_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Cultist");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Cultists generate blood at a rate of <span style='color:#ff1e2d;'>" + Math.round(100 * 0.5 * this.vars.max_blood/200)/100 + "</span> per second. This currency is used to activate various effects (listed under the rituals tab) using the blue buttons inside the cultist menu."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[0].stats["Credits Produced"]) + "</span><br>";
            stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[0].production * buildings[0].count * buildings[0].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
            stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[0].production * buildings[0].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[0].production) +" per cultist)</span><br>";
            stats_string += "Cultists Owned: <span style='color:#ff8300;'>" + buildings[0].count + "</span><br>";
            stats_string += "Blood: <span style='color:#ff1e2d;'>" + Math.round(this.vars.blood) + "</span> <span style='color:#ff1ea4;'>(" + Math.round(100 * 0.5 * this.vars.max_blood/200)/100 + "/s)</span><br>";
            stats_string += "Maximum Blood: <span style='color:#ff1e2d;'>" + Math.round(this.vars.max_blood) + "</span><br>";
            stats_string += "Blood Spent: <span style='color:#ff1e2d;'>" + fancyNumber(this.vars.blood_spent) + "</span><br>";
            stats_string += "Rituals Performed: <span style='color:#ff1e2d;'>" + Math.round(this.vars.rituals_performed) + "</span><br>";
            if (unlocks[1].unlocked) {stats_string += "Soot: <span style='color:#888888;'>-" + Math.round(this.vars.soot_counters) + "%</span><br>";}
            if (unlocks[2].unlocked) {stats_string += "Purity Bonus: <span style='color:#fff728;'>+" + Math.round(this.vars.purity_counters) + "</span> <span style='color:#fffc59;'>(" + Math.round(this.vars.purity_counters) * 3 + "%)</span><br>";}
            if (unlocks[3].unlocked) {stats_string += "Karma Bonus: <span style='color:#ff1e2d;'>" + Math.round(this.vars.karma_counters) + "</span> <span style='color:#ff1ea4;'>(+" + minigames[0].vars.karma_counters * (15 + (15 + (minigames[0].vars.karma_counters-1)*2))/2 + " production)</span><br>";}
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
        
        var rituals = $(document.createElement("div"));
        rituals.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var rituals_header = $(document.createElement("div"));
            rituals_header.html("Rituals (Click To Toggle)");
            rituals.append(rituals_header);
            var rituals_content = $(document.createElement("div"));
            rituals_content.attr("id", "rituals_help");
            var rituals_string = "";
			
            rituals_string += "<hr><div class='ritual_container'><img src='images/ritual_blood_rush.png'><span style='font-size:32px;'>Blood Rush</span><br><br>Increases production by 25% for the duration of 66 seconds.<br>Cost: 75 Blood<br><br><br></div><hr>";
			
            rituals_string += "<hr><div class='ritual_container'><img src='images/ritual_of_construction.png'><span style='font-size:20px;'>Ritual of Construction</span><br><br>Instantly grants one free cultist, but has a cumulative 1% chance of failure for each cultist you own.(" + Math.round((Math.pow(0.99, buildings[0].count)) * 1000) / 10+ "% success)<br>Cost: 60 Blood<br><br></div><hr>";
			
            rituals_string += "<hr><div class='ritual_container'><img src='images/ritual_of_time.png'><span style='font-size:20px;'>Ritual of Time</span><br><br>Instantly grants 10 seconds worth of time. This can be used to temporarily increase game speed.<br>Cost: 60 Blood<br><br><br></div><hr>";
            
			if (unlocks[1].unlocked) {
				rituals_string += "<hr><div class='ritual_container'><img src='images/ritual_of_soot.png'><span style='font-size:20px;'>Ritual of Soot</span><br>Increases production by 15% + 3% for each previous ritual of soot activation ("+Math.round((0.15 + minigames[0].vars.soot_counters * 0.03) * 100)+"%), for 2 minutes. Each activation also permanently decreases production by -1% (-" + Math.round(minigames[0].vars.soot_counters) + "%). <br>Cost: 60 Blood</div><hr>";
			} else {
				rituals_string += "<hr><div class='ritual_container'><img src='images/ritual_unknown.png'><span/ style='font-size:20px;'>??????????????</span><br><br>????????????????<br><br>Unlock this ritual by owning 15 cultists. <br><br>Cost: ????????????<br><br></div><hr>";	
			}
			if (unlocks[1].unlocked && !unlocks[2].unlocked) {
				rituals_string += "<hr><div class='ritual_container'><img src='images/ritual_unknown.png'><span style='font-size:20px;'>??????????????</span><br><br>????????????????<br><br>Unknown <br><br>Cost: ????????????<br><br></div><hr>";	
			} else if (unlocks[2].unlocked) {
				rituals_string += "<hr><div class='ritual_container'><img src='images/ritual_of_purity.png'><span style='font-size:20px;'>Ritual of Purity</span><br><br>Removes all soot. If 20 or more soot is removed this way, production is permanently increased by 3%. (Currently:" + minigames[0].vars.purity_counters * 5 + "%)<br>Cost: 110 Blood</div><br><br><hr>";
			}
            rituals_content.html(rituals_string); 
            rituals_content.css("text-align", "left");
            rituals_content.toggle();
            rituals.append(rituals_content);

        var upgrades = $(document.createElement("div"));
        upgrades.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[0].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[0].upgrades[i]);
			}
			
  
            upgrades_content.html(upgrades_string, 2, 0); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades.append(upgrades_content);
			
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(rituals);
        detail_container.append(upgrades);
        detail_container.append(close_button);
    };
    cultist_minigame.updateDetails = function () {            
        var stats_string = "";
        stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[0].stats["Credits Produced"]) + "</span><br>";
        stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[0].production * buildings[0].count * buildings[0].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
        stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[0].production * buildings[0].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[0].production) +" per cultist)</span><br>";
        stats_string += "Cultists Owned: <span style='color:#ff8300;'>" + buildings[0].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRate(0) + "</span><br>";
        stats_string += "Blood: <span style='color:#ff1e2d;'>" + Math.round(this.vars.blood) + "</span> <span style='color:#ff1ea4;'>(" + Math.round(100 * 0.5 * this.vars.max_blood/200)/100 + "/s)</span><br>";
        stats_string += "Maximum Blood: <span style='color:#ff1e2d;'>" + Math.round(this.vars.max_blood) + "</span><br>";
		stats_string += "Blood Spent: <span style='color:#ff1e2d;'>" + fancyNumber(this.vars.blood_spent) + "</span><br>";
        stats_string += "Rituals Activated: <span style='color:#ff1e2d;'>" + Math.round(this.vars.rituals_performed) + "</span><br>";
        if (unlocks[1].unlocked) {stats_string += "Soot: <span style='color:#888888;'>-" + Math.round(this.vars.soot_counters) + "%</span><br>";}
        if (unlocks[2].unlocked) {stats_string += "Purity Bonus: <span style='color:#fff728;'>+" + Math.round(this.vars.purity_counters) + "</span> <span style='color:#fffc59;'>(" + Math.round(this.vars.purity_counters) * 3 + "%)</span><br>";}
        if (unlocks[3].unlocked) {stats_string += "Karma Bonus: <span style='color:#ff1e2d;'>" + Math.round(this.vars.karma_counters) + "</span> <span style='color:#ff1ea4;'>(+" + minigames[0].vars.karma_counters * (15 + (15 + (minigames[0].vars.karma_counters-1)*2))/2 + " production)</span><br>";}
        $("#stats_help").html(stats_string);
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[0].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[0].upgrades[i], 2, 0);
		}
		$("#upgrades_help").html(upgrades_string);
    };
    cultist_minigame.update = function (dt) {
		dt *= 1 + 0.01 * minigames[5].vars.research_tree[18].bought;
	
        vars = this.vars;
        vars.blood += dt/2 * vars.max_blood/200 * (1 + (CURRENT_CHALLENGE == 0) * 10);
        vars.max_blood = Math.floor(100 + buildings[0].count/4 + minigames[5].vars.research_tree[12].bought * 6 + upgrades[220].bought * 10 + challenges[0].unlocked * 30);
		if (vars.blood > vars.max_blood) {vars.blood = vars.max_blood}
    };
    
	var mine_minigame = new Minigame();
	
	mine_minigame.vars = {
		mine_time : 60,
		mine_max_time : 60,
		gold_mined : 0,
		gold : 0,
		golden_deeds: 0,
		stored_ids: [],
	}
	mine_minigame.upgrades = [
		[10, function () {return true;}, "Unlocks once you own 10 mines."],
		[11, function () {return buildings[1].count >= 10;}, "Unlocks once you own 25 mines."],
		[12, function () {return buildings[1].count >= 25;}, "Unlocks once you own 50 mines."],
		[13, function () {return buildings[1].count >= 50;}, "Unlocks once you own 75 mines."],
		[14, function () {return buildings[1].count >= 75;}, "Unlocks once you own 100 mines."],
		[15, function () {return buildings[1].count >= 100;}, "Unlocks once you own 125 mines."],
		[100, function () {return buildings[1].count >= 125;}, "Unlocks once you own 150 mines."],
		[16, function () {return true;}, "Unlocks once you mine 10 gold bars."],
		[17, function () {return true;}, "Unlocks once you mine 25 gold bars."],
		[18, function () {return true;}, "Unlocks once you mine 50 gold bars."],
		[19, function () {return true;}, "Unlocks once you mine 100 gold bars."],
		[81, function () {return true;}, "Unlocks once you reach 500 million credits."],
		[88, function () {return true;}, "Unlocks once you reach 26 Billion credits."],
		[182, function () {return true;}, "Unlocks once you spend more than three days playing."],
		[193, function () {return true;}, "Unlocks with the achievement Mine Mastery."],
	];
	mine_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlPower(1));
		$("#building_tab_sidebar").append(htmlAutomation(1));
		$("#building_tab_sidebar").append(htmlClone(1));
		$("#building_tab_sidebar").append(htmlTabChallenge(1));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[1].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[1].count + " " + buildings[1].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[1].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[1].production * buildings[1].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var gold_icon = $(document.createElement("img"));
		gold_icon.attr("src", "images/building_icon_mine.png").attr("style", "display:inline;");
		
		minigame_container.append(gold_icon);
		
		var gold_display = $(document.createElement("span"));
		gold_display.attr("id", "gold_display").attr("style", "font-size:25px;color:#CFB53B;position:relative;top:-26px;left:5px;").html("Gold: 0 (29s)");
		
		minigame_container.append(gold_display);
		
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	mine_minigame.updateHTML = function () {
		$("#gold_display").html("Gold: " + this.vars.gold + " (" + Math.round(this.vars.mine_time) + "s)");
        updateBuildingExplanation(1);
	}
	mine_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Mine");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Mines slowly generate gold bars (one every "+this.vars.mine_max_time+"s). These gold bars can be used in exchange for other building's currencies. After storing more than 100 gold bars gold, the time it takes to generate gold bars starts to increase"); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[1].stats["Credits Produced"]) + "</span><br>";
            stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[1].production * buildings[1].count * buildings[1].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
            stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[1].production * buildings[1].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[1].production) +" per mine)</span><br>";
            stats_string += "Mines Owned: <span style='color:#ff8300;'>" + buildings[1].count + "</span><br>";
            stats_string += "Gold: <span style='color:#f6ff53;'>" + Math.round(this.vars.gold) + "</span><br>";
            stats_string += "Gold Mined: <span style='color:#f6ff53;'>" + Math.round(this.vars.gold_mined) + "</span><br>";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades = $(document.createElement("div"));
		upgrades.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[1].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[1].upgrades[i], 1, 0);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();")
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades);
        detail_container.append(close_button);
    };		
	mine_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[1].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[1].production * buildings[1].count * buildings[1].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[1].production * buildings[1].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[1].production) +" per mine)</span><br>";
		stats_string += "Mines Owned: <span style='color:#ff8300;'>" + buildings[1].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRate(1) + "</span><br>";
		stats_string += "Gold: <span style='color:#f6ff53;'>" + Math.round(this.vars.gold) + "</span><br>";
		stats_string += "Gold Mined: <span style='color:#f6ff53;'>" + Math.round(this.vars.gold_mined) + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[1].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[1].upgrades[i], 1, 0);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	mine_minigame.update = function (dt) {
		dt *= 1 + 0.01 * minigames[5].vars.research_tree[19].bought;
		
		this.vars.mine_time -= dt;
		if (this.vars.mine_time <= 0) {
			this.vars.mine_time += this.vars.mine_max_time;
			
			if (this.vars.gold > 100) {
				this.vars.mine_time += (this.vars.gold - 100) / 2;
			}
			
			this.vars.gold_mined += 1;
			buildings[1].stats["Gold Mined"] ++;
			this.vars.gold += 1;
			
			if (this.vars.gold_mined >= 10) {upgrades[16].makeAvailable()}
			if (this.vars.gold_mined >= 25) {upgrades[17].makeAvailable()}
			if (this.vars.gold_mined >= 50) {upgrades[18].makeAvailable()}
			if (this.vars.gold_mined >= 100) {upgrades[19].makeAvailable()}
		
			if (upgrades[17].bought) {this.vars.golden_deeds += 1;}
			if (upgrades[18].bought) {this.vars.mine_time -= 10;}
			if (upgrades[221].bought) {this.vars.mine_time -= 1;}
			
			if (CURRENT_CHALLENGE == 1) {this.vars.mine_time = this.vars.gold}
		}
	}
	
	var gambler_minigame = new Minigame();
	
	gambler_minigame.vars = {
		cards_drawn: 0,
		cards_discarded: 0,
		shuffles: 0,
		draw_time: 60,
		discard_time : 120,
		peek_time: 600,
		draw_charges: 5,
		draw_charges_max: 5,
		discard_charges: 3,
		discard_charges_max: 3,
		peek_charges: 2,
		peek_charges_max: 2,
		deck: [7, 1, 3 ,4, 2, 5, 6, 0], //[0: Space of Aids, 1: Two of Spades, 2, Ace of Clubs, 3: Two of Clubs, 4: Ace of Hearts, 5: Two of Hearts, 6: Ace of diamonds, 7: Two of Diamonds, 8: Jack of Spades, 9: Jack of clubs]
		discard_pile: [],
		card_bonus: 1,
	}
	gambler_minigame.upgrades = [
		[30, function () {return true;}, "Unlocks once you own 10 gamblers."],
		[31, function () {return buildings[2].count >= 10;}, "Unlocks once you own 25 gamblers."],
		[32, function () {return buildings[2].count >= 25;}, "Unlocks once you own 50 gamblers."],
		[33, function () {return buildings[2].count >= 50;}, "Unlocks once you own 75 gamblers."],
		[34, function () {return buildings[2].count >= 75;}, "Unlocks once you own 100 gamblers."],
		[35, function () {return buildings[2].count >= 100;}, "Unlocks once you own 125 gamblers."],
		[101, function () {return buildings[2].count >= 125;}, "Unlocks once you own 150 gamblers."],
		[36, function () {return true;}, "Unlocks once you draw 10 cards."],
		[37, function () {return true;}, "Unlocks once you draw 25 cards."],
		[38, function () {return true;}, "Unlocks once you draw 50 cards."],
		[39, function () {return true;}, "Unlocks once you draw 100 cards."],
		[82, function () {return true;}, "Unlocks once you reach 500 million credits."],
		[89, function () {return true;}, "Unlocks once you reach 26 Billion credits."],
		[179, function () {return true;}, "Unlocks once you spend more than one day playing."],
		[194, function () {return true;}, "Unlocks with the achievement Gambling Mastery."],
	];
	gambler_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlGoldRefill(2, "Refill Draws", "Increases your current amount of draws and discards to their maximum value"));
		$("#building_tab_sidebar").append(htmlPower(2));
		$("#building_tab_sidebar").append(htmlAutomation(2));
		$("#building_tab_sidebar").append(htmlClone(2));
		$("#building_tab_sidebar").append(htmlTabChallenge(2));
				
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[2].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[2].count + " " + buildings[2].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[2].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[2].production * buildings[2].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var draw_button = $(document.createElement("span"));
			draw_button.html("Draw&nbsp;" + this.vars.draw_charges +"/"+ this.vars.draw_charges_max);
			draw_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #54BEE3; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#0ABAF5, #076787); margin: 8px;");
			draw_button.attr("class", "gambler_button").attr("id","draw_button");
			draw_button.attr("onclick", "drawCard();");
			
		var discard_button = $(document.createElement("span"));
			discard_button.html("Discard&nbsp;" + this.vars.discard_charges +"/"+ this.vars.discard_charges_max);
			discard_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #ff3300; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#F5450A, #872707); margin: 8px;");
			discard_button.attr("class", "gambler_button").attr("id","discard_button");
			discard_button.attr("onclick", "discardCard();");
			
		var shuffle_button = $(document.createElement("span"));
			shuffle_button.html("Shuffle");
			shuffle_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #FFF700; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#F5F10A, #878707); margin: 8px;");
			shuffle_button.attr("class", "gambler_button").attr("id","shuffle_button");
			shuffle_button.attr("onclick", "shuffleDeck()");

		var peek_button = $(document.createElement("span"));
			peek_button.html("Peek&nbsp;" + this.vars.peek_charges +"/"+ this.vars.peek_charges_max);
			peek_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#44F50A, #278707); margin: 8px;");
			peek_button.attr("class", "gambler_button").attr("id","peek_button");
			peek_button.attr("onclick", "peek()");
		
		var deck_icon = $(document.createElement("img"));
		deck_icon.attr("src", "images/card_back.png").attr("style", "display:inline;").attr("id", "deck_background");
		deck_icon.attr("onmouseover","tooltip(this, 7, 4, 'Remaining Cards', 'This deck contains the following cards:<br>' + remainingCards(minigames[2].vars.deck) + '<br>Open the help menu for details for each of their effects.')");
		deck_icon.attr("onmouseout", "hideTooltip();");
		
		var discard_icon = $(document.createElement("img"));
	
		var number = minigames[2].vars.discard_pile.peek();
		if (number == undefined) {number = "blank"}
		
		discard_icon.attr("src", "images/card_"+number+".png").attr("style", "display:inline;").attr("id", "discard_pile");
		discard_icon.attr("onmouseover","tooltip(this, 7, 4, 'Discard Pile', 'This discard contains the follow cards:<br>' + remainingCards(minigames[2].vars.discard_pile) + '<br>Open the help menu for details for each of their effects.')");
		discard_icon.attr("onmouseout", "hideTooltip();");
		
		minigame_container.append(document.createElement("br"));
		minigame_container.append(draw_button);
		minigame_container.append(discard_button);
		minigame_container.append(document.createElement("br"));
		minigame_container.append(document.createElement("br"));
		minigame_container.append(shuffle_button);
		minigame_container.append(peek_button);
		minigame_container.append(document.createElement("br"));
		minigame_container.append(document.createElement("br"));
		minigame_container.append(deck_icon);
		minigame_container.append(document.createTextNode(" "));
		minigame_container.append(discard_icon);

			
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	gambler_minigame.updateHTML = function () {
		$("#discard_button").html("Discard&nbsp;" + this.vars.discard_charges +"/"+ this.vars.discard_charges_max);
		$("#draw_button").html("Draw&nbsp;" + this.vars.draw_charges +"/"+ this.vars.draw_charges_max);
		$("#peek_button").html("Peek&nbsp;" + this.vars.peek_charges +"/"+ this.vars.peek_charges_max);
        updateBuildingExplanation(2);
	}
	gambler_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Gambler");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Gamblers slowly store card draws, and card discards. Each time a card is drawn the effect associated with that card will be activated (see card tab for details). Discarding a card will cause the top card to be discarded and no effect activated. After all of the cards have been drawn or discarded all the cards will be shuffled back."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
			
        var cards = $(document.createElement("div"));
        cards.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var cards_header = $(document.createElement("div"));
            cards_header.html("Cards (Click To Toggle)");
            cards.append(cards_header);
            var cards_content = $(document.createElement("div"));
            cards_content.attr("id", "cards_help");
            var cards_string = "";
			cards_string += "A&spades;: <span style='color:#ff8300;'>Permanently increases production by 1%</span><br>";
			cards_string += "2&spades;: <span style='color:#ff8300;'>Permanently decreases production by 1%</span><br>";
			cards_string += "A&hearts;: <span style='color:#ff8300;'>Increases production by 20% for 2 minutes.</span><br>";
			cards_string += "2&hearts;: <span style='color:#ff8300;'>Decreases production by 15% for 1 minute.</span><br>";
			cards_string += "A&clubs;: <span style='color:#ff8300;'>Grants 15 seconds worth of time.</span><br>";
			cards_string += "2&clubs;: <span style='color:#ff8300;'>Removes 20 seconds worth of production.</span><br>";
			cards_string += "A&diams;: <span style='color:#ff8300;'>Increases the active time of all current active effects by 20 seconds.</span><br>";
			cards_string += "2&diams;: <span style='color:#ff8300;'>Removes one current active effects chosen at random.</span><br>";
			if (upgrades[38].bought) {
				cards_string += "J&spades;: <span style='color:#ff8300;'>Instantly grants 20 seconds worth of production, and grants a free draw.</span><br>";
				cards_string += "J&clubs;: <span style='color:#ff8300;'>Instantly clicks 20 times, and grants a free discard.</span><br>";
			}
            cards_content.html(cards_string); 
            cards_content.css("text-align", "left");
            cards_content.toggle();
            cards.append(cards_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[2].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[2].upgrades[i], 3, 0);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(cards);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	gambler_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[2].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[2].production * buildings[2].count * buildings[2].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[2].production * buildings[2].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[2].production) +" per gambler)</span><br>";
		stats_string += "Gamblers Owned: <span style='color:#ff8300;'>" + buildings[2].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRate(2) + "</span><br>";
		stats_string += "Cards Remaining: <span style='color:#ff8300;'>"
		stats_string += remainingCards(minigames[2].vars.deck);
		stats_string += "</span><br>";
		stats_string += "Discard Pile: <span style='color:#ff8300;'>";
		stats_string += remainingCards(minigames[2].vars.discard_pile);
		stats_string += "</span><br>";
		stats_string += "Available Draws: <span style='color:#5EC1FF;'>" + Math.round(this.vars.draw_charges) + "/" + Math.round(this.vars.draw_charges_max) + " (" + Math.round(this.vars.draw_time)+"s)</span><br>";
		stats_string += "Cards Drawn: <span style='color:#6673FF;'>" + Math.round(this.vars.cards_drawn) + "</span><br>";
		stats_string += "Available Discards: <span style='color:#5EC1FF;'>" + Math.round(this.vars.discard_charges) + "/" + Math.round(this.vars.discard_charges_max) + " (" + Math.round(this.vars.discard_time)+"s)</span><br>";
		stats_string += "Cards Discarded: <span style='color:#6673FF;'>" + Math.round(this.vars.cards_discarded) + "</span><br>";
		stats_string += "Gambling Bonus: <span style='color:#6673FF;'>" + Math.round((this.vars.card_bonus - 1) * 100) + "%</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[2].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[2].upgrades[i], 3, 0);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	gambler_minigame.update = function (dt) {
		dt *= 1 + (0.01 * minigames[5].vars.research_tree[20].bought) + (3 * (CURRENT_CHALLENGE == 2));
		
		this.vars.draw_charges_max = (5 + minigames[5].vars.research_tree[14].bought) * (upgrades[39].bought + 1) + (upgrades[222].bought);
		this.vars.discard_charges_max = (3) * (upgrades[39].bought + 1);
		this.vars.peek_charges_max = 2 + upgrades[194].bought * 6;
		
		if (this.vars.draw_charges < this.vars.draw_charges_max) {this.vars.draw_time -= dt};
		if (this.vars.discard_charges < this.vars.discard_charges_max) {this.vars.discard_time -= dt};
		if (this.vars.peek_charges < this.vars.peek_charges_max) {this.vars.peek_time -= dt};
		
		if (this.vars.draw_time <= 0) {
			this.vars.draw_time += 60;
			if (subgames[0].reset_count >= 4) {this.vars.draw_time /= 1 + (subgames[0].reset_count + 1) * 0.01}
			this.vars.draw_charges += 1;
			
			if (this.vars.draw_charges > this.vars.draw_charges_max) {this.vars.draw_charges = this.vars.draw_charges_max;}
		}
		else if (this.vars.discard_time <= 0) {
			this.vars.discard_time += 120;
			if (subgames[0].reset_count >= 4) {this.vars.discard_time /= 1 + (subgames[0].reset_count + 1) * 0.01}
			this.vars.discard_charges += 1;
			
			if (this.vars.discard_charges > this.vars.discard_charges_max) {this.vars.discard_charges = this.vars.discard_charges_max;}
		}
		else if (this.vars.peek_time <= 0) {
			this.vars.peek_time += 600;
			this.vars.peek_charges += 1;
			
			if (challenges[2].unlocked) {this.vars.peek_time = 150}
			if (this.vars.peek_charges > this.vars.peek_charges_max) {this.vars.peek_charges = this.vars.peek_charges_max;}
		}
		
		if (CURRENT_CHALLENGE == 2) {
			for (var i = minigames[2].vars.deck.length - 1; i >= 0; i--) {
				var card = minigames[2].vars.deck[i];
				if (card == 1 || card == 3 || card == 5 || card == 7) {
					minigames[2].vars.discard_pile.push(card);
					minigames[2].vars.deck.splice(i, 1);
				}
			}
		}
	}
	
	var power_minigame = new Minigame();
	
	power_minigame.vars = {
		power: 100,
		max_power: 100,
		power_generated: 0,
		power_rate: 1,
		previous_power: 100,
		powered_buildings: [],
	}
	power_minigame.upgrades = [
		[40, function () {return true;}, "Unlocks once you own 10 power plants."],
		[41, function () {return buildings[3].count >= 10;}, "Unlocks once you own 25 power plants."],
		[42, function () {return buildings[3].count >= 25;}, "Unlocks once you own 50 power plants."],
		[43, function () {return buildings[3].count >= 50;}, "Unlocks once you own 75 power plants."],
		[44, function () {return buildings[3].count >= 75;}, "Unlocks once you own 100 power plants."],
		[45, function () {return buildings[3].count >= 100;}, "Unlocks once you own 125 power plants."],
		[102, function () {return buildings[3].count >= 125;}, "Unlocks once you own 150 power plants."],
		[46, function () {return true;}, "Unlocks once you generate 1000 seconds worth of power."],
		[47, function () {return true;}, "Unlocks once you generate 2500 seconds worth of power."],
		[48, function () {return true;}, "Unlocks once you generate 5000 seconds worth of power."],
		[49, function () {return true;}, "Unlocks once you generate 10000 seconds worth of power."],
		[83, function () {return true;}, "Unlocks once you reach 500 million credits."],
		[90, function () {return true;}, "Unlocks once you reach 26 Billion credits."],
		[180, function () {return true;}, "Unlocks once you spend more than two days playing."],
		[195, function () {return true;}, "Unlocks with the achievement Electric Mastery."],
	];
	power_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlGoldRefill(3, "Refill Power", "Increases your current amount of power to its maximum value"));
		$("#building_tab_sidebar").append(htmlAutomation(3));
		$("#building_tab_sidebar").append(htmlClone(3));
		$("#building_tab_sidebar").append(htmlTabChallenge(3));
				
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[3].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[3].count + " " + buildings[3].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[3].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[3].production * buildings[3].count) + "</span>.");
        
        minigame_container.append(explanation);
	
		var power_icon = $(document.createElement("img"));
		power_icon.attr("src", "images/building_icon_power.png").attr("style", "display:inline;");
		
		minigame_container.append(power_icon);
		
		var power_display = $(document.createElement("span"));
		power_display.attr("id", "power_display").attr("style", "font-size:25px;color:#CFB53B ;position:relative;top:-26px;left:5px;").html("Power: " + this.vars.power + "/" + this.vars.max_power);
		
		minigame_container.append(power_display);
			
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	power_minigame.updateHTML = function () {
		$("#power_display").html("Power: " + Math.round(this.vars.power) + "/" + this.vars.max_power);
        updateBuildingExplanation(3);
	}
	power_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Power");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Power Plants generate power that can be used to temporarily increase production and working speed of other buildings by 50%. This power can be activated inside other building&#39;s tabs."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[3].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[3].upgrades[i], 4, 0);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	power_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[3].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[3].production * buildings[3].count * buildings[3].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[3].production * buildings[3].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[3].production) +" per power plant)</span><br>";
		stats_string += "Power Plants Owned: <span style='color:#ff8300;'>" + buildings[3].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRate(3) + "</span><br>";
		stats_string += "Power: <span style='color:#fddc24;'>" + Math.round(this.vars.power) + "/" + minigames[3].vars.max_power + "</span> <span style='color:#FD7024;'>(+" + Math.round((this.vars.power_rate) * 100) / 100 + "/s)</span><br>";
		stats_string += "Power Generated: <span style='color:#fddc24;'>" + fancyNumber(minigames[3].vars.power_generated) + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[3].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[3].upgrades[i], 4, 0);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	power_minigame.update = function (dt) {
		dt *= 1 + 0.01 * minigames[5].vars.research_tree[21].bought;
		
		this.vars.max_power = 99 + buildings[3].count + upgrades[46].bought * 50 + minigames[5].vars.research_tree[15].bought * 30;
		this.vars.power_rate = (0.5 + (buildings[3].count / 300)) + (upgrades[49].bought * 0.25) + (upgrades[195].bought * 0.25) + (upgrades[223].bought * 0.1 + (challenges[3].unlocked * 0.3));
		
		this.vars.power = Math.min(this.vars.power + this.vars.power_rate * dt, this.vars.max_power);
		
		if (this.vars.powered_buildings.length >= 1) {
			this.vars.power_generated += this.vars.power_rate * dt;
		}
		
		this.vars.power -= (this.vars.powered_buildings.length) * dt;
		
		
		if (this.vars.power <= 0) {
			this.vars.power = 0;
			this.vars.powered_buildings = [];
			$(".overcharge").attr("src", "images/misc_inactive_power.png");
			UPDATE_BUILDINGS = true;
		}
		
		this.vars.previous_power = this.vars.power;
		
		buildings[3].stats["Power Generated"] = fancyNumber(this.vars.power_generated);
		
		if (this.vars.power_generated >= 1000 && !upgrades[46].available) {upgrades[46].makeAvailable();}
		if (this.vars.power_generated >= 2500 && !upgrades[47].available) {upgrades[47].makeAvailable();}
		if (this.vars.power_generated >= 5000 && !upgrades[48].available) {upgrades[48].makeAvailable();}
		if (this.vars.power_generated >= 10000 && !upgrades[49].available) {upgrades[49].makeAvailable();}
		
		if (CURRENT_CHALLENGE == 3) {this.vars.power = this.vars.max_power}
	}
	
	var bank_minigame = new Minigame();
	
	bank_minigame.vars = {
		investing: false,
		mastery: false,
		investment_time: -1,
		investment_value: 0,
		investments_made: 0,
		charity_counters: 0,
	}
	bank_minigame.upgrades = [
		[50, function () {return true;}, "Unlocks once you own 10 banks."],
		[51, function () {return buildings[4].count >= 10;}, "Unlocks once you own 25 banks."],
		[52, function () {return buildings[4].count >= 25;}, "Unlocks once you own 50 banks."],
		[53, function () {return buildings[4].count >= 50;}, "Unlocks once you own 75 banks."],
		[54, function () {return buildings[4].count >= 75;}, "Unlocks once you own 100 banks."],
		[55, function () {return buildings[4].count >= 100;}, "Unlocks once you own 125 banks."],
		[103, function () {return buildings[4].count >= 125;}, "Unlocks once you own 150 banks."],
		[56, function () {return true;}, "Unlocks once you receive a investment return 5 times."],
		[57, function () {return true;}, "Unlocks once you receive a investment return 10 times."],
		[58, function () {return true;}, "Unlocks once you receive a investment return 15 times."],
		[59, function () {return true;}, "Unlocks once you receive a investment return 20 times."],
		[84, function () {return true;}, "Unlocks once you reach 500 million credits."],
		[91, function () {return true;}, "Unlocks once you reach 26 Billion credits."],
		[181, function () {return true;}, "Unlocks once you spend more than two days playing."],
		[196, function () {return true;}, "Unlocks with the achievement Long Term Financing."],
	];
	bank_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlGoldRefill(4, "Instant Investment", "Instantly completes current investment"));
		$("#building_tab_sidebar").append(htmlPower(4));
		$("#building_tab_sidebar").append(htmlAutomation(4));
		$("#building_tab_sidebar").append(htmlClone(4));
		$("#building_tab_sidebar").append(htmlTabChallenge(4));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[3].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[3].count + " " + buildings[3].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[3].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[3].production * buildings[3].count) + "</span>.");
        
        minigame_container.append(explanation);
		
        minigame_container.append(document.createElement("br"));
	
		
		var investment_container = $(document.createElement("span"));
		investment_container.attr("style", "position:relative");
		
			var investment_icon = $(document.createElement("img"));
			investment_icon.attr("src", "images/bank_investment.png").attr("style", "display:inline;cursor:pointer;").attr("id", "investment_icon");
			investment_icon.attr("onclick", "invest()");
			investment_container.attr("onmouseover", "investTooltip()");
			investment_container.attr("onmouseout", "hideTooltip();");

			var investment_time = $(document.createElement("div"));
			investment_time.attr("id", "investment_time");
			investment_time.attr("style", "border-radius:2px;position:absolute;left:0px;top:0px;height:48px;width:48px;background-color:#000000;opacity:0.5");
		
			investment_container.append(investment_icon);
			investment_container.append(investment_time);
		minigame_container.append(investment_container);
		
		minigame_container.append(document.createTextNode("  "))
		
		
		//if (buildings[])
		var cash_to_gold_icon = $(document.createElement("img"));
		cash_to_gold_icon.attr("src", "images/bank_cash_to_gold.png").attr("style", "display:inline;cursor:pointer;");
		cash_to_gold_icon.attr("onclick", "cashToGold()").attr("id", "cash_to_gold");
		cash_to_gold_icon.attr("onmouseover","tooltip(this, 6, 6, 'Cash To Gold', 'Buy 1 gold bar for at the cost of <span style=\"color:#ff1e2d;\">-10%</span> production for 1 minute.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')");
		cash_to_gold_icon.attr("onmouseout", "hideTooltip()");
		
		minigame_container.append(cash_to_gold_icon);
		
		minigame_container.append(document.createTextNode("  "))
		
		var gold_to_cash_icon = $(document.createElement("img"));
		gold_to_cash_icon.attr("src", "images/bank_gold_to_cash.png").attr("style", "display:inline;cursor:pointer;").attr("id", "gold_to_cash");
		gold_to_cash_icon.attr("onclick", "goldToCash()")
		gold_to_cash_icon.attr("onmouseover","tooltip(this, 6, 6, 'Gold To Cash', 'Exchange 2 gold bars for a <span style=\"color:#00db0a;\">10%</span> bonus to production for 1 minute.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')");
		gold_to_cash_icon.attr("onmouseout", "hideTooltip()");	
		
		minigame_container.append(gold_to_cash_icon);
		
	
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	bank_minigame.updateHTML = function () {
        updateBuildingExplanation(4);
	}
	bank_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Bank");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Banks grant the ability to lend money for a greater pay-off later, and the ability to buy gold bars (gold bars can be used in exchange for other building&#39;s currencies)."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[4].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[4].upgrades[i], 5, 0);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
		
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	bank_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[4].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[4].production * buildings[4].count * buildings[4].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[4].production * buildings[4].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[4].production) +" per bank)</span><br>";
		stats_string += "Banks Owned: <span style='color:#ff8300;'>" + buildings[4].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRate(4) + "</span><br>";
		stats_string += "Investments Made: <span style='color:#F5F5F5;'>" + minigames[4].vars.investments_made + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[4].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[4].upgrades[i], 5, 0);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	bank_minigame.update = function (dt) {
		this.vars.investment_time -= dt;
		
		dt *= 1 + 0.01 * minigames[5].vars.research_tree[22].bought;
		
		if (this.vars.investment_time <= 0 && this.vars.investing) {
			this.vars.investing = false;
			CREDITS += this.vars.investment_value;
			this.vars.investments_made += 1;
			popupText("Investment Returned:" + fancyNumber(this.vars.investment_value), $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
			hideTooltip();
			
			if (upgrades[56].bought) {CREDITS += PRODUCTION * 20}
			if (upgrades[57].bought) {buffs[7].activate(60)}
			if (upgrades[58].bought) {this.vars.charity_counters += 1}
			if (upgrades[59].bought && Math.random() < (Math.pow(0.99, buildings[4].count) / 2)) {
                buildings[4].count++;
				UPDATE_BUILDINGS = true;
				buildings[4].unlockUpgrades();
            }
			
			if (this.vars.investments_made >= 5) {upgrades[56].makeAvailable();}
			if (this.vars.investments_made >= 10) {upgrades[57].makeAvailable();}
			if (this.vars.investments_made >= 15) {upgrades[58].makeAvailable();}
			if (this.vars.investments_made >= 20) {upgrades[59].makeAvailable();}
			
			//Count Total Positive Buffs
			var count = 0;
			for (var i = 0; i < buffs.length; i++) {
				if (!buffs[i].negative) {count++}
			}
			
			if (count >= 5 && this.vars.mastery == false) {this.vars.mastery = true}
		}
		
		if (this.vars.investment_time >= 0) {
			var distance = this.vars.investment_time/300 * 64;
			var y = 64 - distance - 51;
			$("#investment_time").attr("style", "border-radius:4px;position:absolute;left:0px;top:"+y+"px;height:"+distance+"px;width:64px;background-color:#000000;opacity:0.5");
		
		} else {
			$("#investment_time").attr("style", "position:absolute;left:0px;top:0px;height:0px;width:64px;background-color:#000000;opacity:0.5");		
		}
		
	}
	
	var research_minigame = new Minigame();
	
	research_minigame.vars = {
		research_points: 0,
		researches_made: 0,
		research_time: 60,
		research_time_max: 60,
		mastery: false,
		fullscreen: false,
		research_ctx: 0,
		research_tree: [
			new Research("Expanding Knowledge", "Increases the production of research centers by 0.5% for each research completed.", function () {return "(" + Math.round(0.005 * minigames[5].vars.researches_made * 1000)/10 + "%)"}, 0, 0, 120, 64, 1, 1, function () {buildings[5].production_multiplier *= 1 + 0.005 * minigames[5].vars.researches_made;}, function () {return true}, null), //0
			new Research("Timely Workers", "Increases production by 5% while using extra seconds.", function () {return ""}, 1, 0, 250, 64, 6, 1, function () {if (GAME_SPEED != 1) {PRODUCTION_MULTIPLIER *= 1.05;}}, function () {return true}, 0), //1
			new Research("Trickle of Time", "Once per minute grants one free second of time.", function () {return ""}, 2, 0, 350, 64, 4, 3, function () {}, function () {return true}, 1), //2
			new Research("Warp Speed", "Increases maximum speed of extra seconds by 1.", function () {return ""}, 3, 0, 450, 64, 10, 1, function () {}, function () {return true}, 2), //3
			new Research("Smart Clicks", "Increases value of clicks by 1% of production.", function () {return ""}, 5, 0, 162, 174, 10, 1, function () {CLICK_PRODUCTION += 0.01}, function () {return true}, 0), //4
			new Research("Curiosity", "Decreases the amount of time it takes to generate a research point by 1 second.", function () {return ""}, 6, 0, 78, 174, 2, 10, function () {}, function () {return true}, 0), //5
			new Research("Efficient Cultists", "Increases production of cultists by 2%.", function () {return ""}, 7, 0, -50, 96, 1, 10, function () {buildings[0].production_multiplier *= 1 + 0.02 * this.bought}, function () {return buildings[0].count != 0}, 0), //6
			new Research("Efficient Mines", "Increases production of mines by 2%.", function () {return ""}, 8, 0, -50, 32, 1, 10, function () {buildings[1].production_multiplier *= 1 + 0.02 * this.bought}, function () {return buildings[1].count != 0}, 0), //7
			new Research("Efficient Gamblers", "Increases production of gamblers by 2%.", function () {return ""}, 9, 0, -50, 160, 1, 10, function () {buildings[2].production_multiplier *= 1 + 0.02 * this.bought}, function () {return buildings[2].count != 0}, 0), //8
			new Research("Efficient Power", "Increases production of power plants by 2%.", function () {return ""}, 0, 1, -50, -32, 1, 10, function () {buildings[3].production_multiplier *= 1 + 0.02 * this.bought}, function () {return buildings[3].count != 0}, 0), //9
			new Research("Efficient Banks", "Increases production of banks by 2%.", function () {return ""}, 1, 1, -50, 224, 1, 25, function () {buildings[4].production_multiplier *= 1 + 0.02 * this.bought}, function () {return buildings[4].count != 0}, 0), //10
			new Research("Efficient Factories", "Increases production of factories by 2%.", function () {return ""}, 2, 1, -50, -96, 1, 10, function () {buildings[6].production_multiplier *= 1 + 0.02 * this.bought}, function () {return buildings[6].count != 0}, 0), //11
			new Research("Cultist Storage", "Increases cultist&#39;s maximum blood by 6.", function () {return ""}, 3, 1, -150, 96, 10, 3, function () {}, function () {return buildings[0].count != 0}, 6), //12
			new Research("Gold Rebates", "Each time gold is spent to refill a building currency, 1 gold bar is refunded.", function () {return ""}, 4, 1, -150, 32, 10, 2, function () {}, function () {return buildings[1].count != 0}, 7), //13
			new Research("Gambler&#39;s Storage", "Increases gambler&#39;s maximum draws by 1.", function () {return ""}, 5, 1, -150, 160, 10, 3, function () {}, function () {return buildings[2].count != 0}, 8), //14
			new Research("Power Storage", "Increases power&#39;s maximum power by 30.", function () {return ""}, 6, 1, -150, -32, 10, 3, function () {}, function () {return buildings[3].count != 0}, 9), //15
			new Research("Warehouses", "Increases the duration of bonuses by 3%.", function () {return ""}, 8, 1, -150, -96, 10, 3, function () {}, function () {return buildings[6].count != 0}, 11), //16
			new Research("Observation Study", "Decreases the amount of time until the next research point by 10 seconds each time a bonus is activated.", function () {return ""}, 4, 2, 78, 274, 15, 1, function () {}, function () {return true}, 5), //17
			new Research("Accelerated Rituals", "Increases work rate of cultists by 1%.", function () {return ""}, 9, 1, -250, 96, 3, 5, function () {}, function () {return true}, 12), //18
			new Research("Accelerated Mines", "Increases work rate of mines by 1%.", function () {return ""}, 0, 2, -250, 32, 3, 5, function () {}, function () {return true}, 13), //19
			new Research("Accelerated Gambling", "Increases work rate of gamblers by 1%.", function () {return ""}, 1, 2, -250, 160, 3, 5, function () {}, function () {return true}, 14), //20
			new Research("Accelerated Lightning", "Increases work rate of power plants by 1%.", function () {return ""}, 2, 2, -250, -32, 3, 5, function () {}, function () {return true}, 15), //21
			new Research("Accelerated Banking", "Increases work rate of banks by 1%.", function () {return ""}, 3, 2, -150, 224, 3, 5, function () {}, function () {return buildings[4].count != 0}, 10), //22
			new Research("Click Boost", "Each click produces 25% more credits for each bonus active.", function () {return ""}, 5, 2, 162, 274, 20, 1, function () {}, function () {return true}, 4), //23
			new Research("Epiphanic Stockpile", "Will grant 10 Research points upon resetting.", function () {return ""}, 6, 2, 78, 374, 5, 30, function () {}, function () {return true}, 17), //24
			new Research("Real-Estate Deal", "Every time a building is bought one second worth of time is granted.", function () {return ""}, 7, 2, 250, -26, 15, 1, function () {}, function () {return true}, 0), //25
			new Research("Timely Clicks", "Every 10 clicks decreases the amount of time until the next research point by 1 second.", function () {return ""}, 8, 2, 162, 374, 10, 1, function () {}, function () {return true}, 23), //26
			new Research("Efficient Haggling", "Decreases the cost of all buildings by 1%", function () {return ""}, 9, 2, 350, -26, 5, 1, function () {COST_REDUCTION += 0.01}, function () {return true}, 25), //27
			new Research("Cautious Progress", "Increases production by 3%.", function () {return ""}, 0, 3, 262, 274, 15, 1, function () {PRODUCTION_MULTIPLIER *= 1.03}, function () {return true}, 23), //28
			new Research("Frantic Pace", "Grants one second worth of time each time a bonus is activated.", function () {return ""}, 1, 3, -22, 274, 15, 1, function () {}, function () {return true}, 17), //29
			new Research("Shoulders of Giants", "Increases production of all buildings by 1% for every 300 tier one buildings owned.", function () {return "(" + Math.round(TIER_ONE_COUNT / (300)  * 10) / 10+ "%)"}, 2, 3, 120, -96, 60, 1, function () {PRODUCTION_MULTIPLIER *= 1 + TIER_ONE_COUNT / (30000) }, function () {return TIER_2_UNLOCKED}, 0), //30
			new Research("Advanced Negotiations", "Decreases the cost of all buildings by 0.1%.", function () {return fancyNumber(this.bought / 10) + "%"}, 3, 3, 120, -246, 10, 20, function () {COST_REDUCTION += 0.001 * this.bought}, function () {return TIER_2_UNLOCKED}, 30), //31
			new Research("Advanced Elongation", "Increases the duration of temporary bonuses by 0.2%.", function () {return fancyNumber(this.bought / 5) + "%"}, 4, 3, 20, -246, 15, 20, function () {}, function () {return TIER_2_UNLOCKED}, 30), //32
			new Research("Advanced Automation", "Increases offline production by 0.2%.", function () {return fancyNumber(this.bought / 5) + "%"}, 5, 3, 220, -246, 20, 20, function () {OFFLINE_PRODUCTION += 0.002 * this.bought}, function () {return TIER_2_UNLOCKED}, 30), //33
			new Research("Advanced Clicking", "Increases value of clicks by 0.1% of production.", function () {return fancyNumber(this.bought / 10) + "%"}, 6, 3, 320, -246, 20, 20, function () {CLICK_PRODUCTION += 0.001 * this.bought}, function () {return TIER_2_UNLOCKED}, 30), //34
			new Research("Advanced Production", "Increases production by 0.1%.", function () {return fancyNumber(this.bought / 10) + "%"}, 7, 3, -80, -246, 10, 20, function () {PRODUCTION_MULTIPLIER *= 1 + 0.001 * this.bought;}, function () {return TIER_2_UNLOCKED}, 30), //35
		],
		research_camera: {
			x: 0,
			y: 0,
			start_x: 0,
			start_y: 0,
			pan_x: 0,
			pan_y: 0,
		}
	}
	research_minigame.upgrades = [
		[60, function () {return true;}, "Unlocks once you own 10 research centers."],
		[61, function () {return buildings[4].count >= 10;}, "Unlocks once you own 25 research centers."],
		[62, function () {return buildings[4].count >= 25;}, "Unlocks once you own 50 research centers."],
		[63, function () {return buildings[4].count >= 50;}, "Unlocks once you own 75 research centers."],
		[64, function () {return buildings[4].count >= 75;}, "Unlocks once you own 100 research centers."],
		[65, function () {return buildings[4].count >= 100;}, "Unlocks once you own 125 research centers."],
		[104, function () {return buildings[4].count >= 125;}, "Unlocks once you own 150 research centers."],
		[85, function () {return true;}, "Unlocks once you reach 500 million credits."],
		[92, function () {return true;}, "Unlocks once you reach 26 Billion credits."],
		[182, function () {return true;}, "Unlocks once you spend more than three days playing."],
		[197, function () {return true;}, "Unlocks with the achievement Research Mastery."],
	];
	research_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlGoldRefill(5, "Research Funding", "Instantly grants 10 research points"));
		$("#building_tab_sidebar").append(htmlPower(5));
		$("#building_tab_sidebar").append(htmlAutomation(5));
		$("#building_tab_sidebar").append(htmlClone(5));
		$("#building_tab_sidebar").append(htmlTabChallenge(5));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[5].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[5].count + " " + buildings[5].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[5].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[5].production * buildings[5].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var research_display = $(document.createElement("span"));
		research_display.attr("id", "research_display").attr("style", "font-size:25px;color:#3B55CF ;position:relative;left:5px;").html("Research Points: " + this.vars.research_points);
		
		var canvas = document.createElement('canvas');

		canvas.id = "research_canvas";
		canvas.width = 300;
		canvas.height = 180;
		canvas.style.border = "3px solid black";
		canvas.style.borderRadius = "5px";
		canvas.style.cursor = "grab";
		
		canvas.onmousedown = function(e) {
			isDown = true;

			var map_camera = minigames[5].vars.research_camera;
			
			map_camera.start_x = e.offsetX + map_camera.x;
			map_camera.start_y = e.offsetY + map_camera.y;
			
			document.getElementById("research_canvas").style.cursor = "grabbing";
			
		}
		canvas.onmouseup = function(e) {
			isDown = false;
			document.getElementById("research_canvas").style.cursor = "grab";
		}
		canvas.onmouseout = function(e) {
			hideTooltip();
			isDown = false;
			//document.getElementById("canvas_map").style.cursor = "grab";
		}
		canvas.onmousemove = function(e) {
			hideTooltip();
			researchMouseDetection(e);
			var map_camera = minigames[5].vars.research_camera;

			if(!isDown) return;

			var x = e.offsetX;
			var y = e.offsetY;

			map_camera.x -= x - map_camera.start_x + map_camera.x;
			map_camera.y -= y - map_camera.start_y + map_camera.y;
			
			

			//if (map_camera.x < 0 ) {map_camera.x = 0;}
			//if (map_camera.y < 0 ) {map_camera.y = 0;}
			//if (map_camera.x + map_camera.width > MAP_WIDTH) {map_camera.x = MAP_WIDTH - map_camera.width}
			//if (map_camera.y + map_camera.height > MAP_HEIGHT) {map_camera.y = MAP_HEIGHT - map_camera.height}
			
			renderResearch();
		}
		canvas.onclick = function(e) {
			researchClickDetection(e);
		}
		
        minigame_container.append(research_display);
        minigame_container.append(document.createElement("br"));
		
		minigames[5].vars.research_ctx = canvas.getContext("2d");
			
		minigame_container.append($(canvas));
		
		var fullscreen_icon = $(document.createElement("img")).attr("src", "images/fullscreen.png");
		fullscreen_icon.attr("style", "cursor:pointer").attr("id", "open_fullscreen");
		fullscreen_icon.attr("onclick", "toggleResearchFullScreen()");
		
		minigame_container.append(document.createElement("br"));
		
		minigame_container.append(fullscreen_icon);
	
        $(".building_tab").append(minigame_container);
		
		minigames[5].vars.research_camera.x = 0;
		minigames[5].vars.research_camera.y = 0;
		minigames[5].vars.research_camera.start_x = 0;
		minigames[5].vars.research_camera.start_x = 0;
		minigames[5].vars.research_camera.pan_y = 0;
		minigames[5].vars.research_camera.pan_x = 0;
		
        updateUnlocks();
		renderResearch();
	}
	research_minigame.updateHTML = function () {
		$("#research_display").html("Research Points: " +this.vars.research_points + " (" + Math.round(this.vars.research_time) + "s)");
		renderResearch();
        updateBuildingExplanation(5);
	}
	research_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Research");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Research Centers slowly generate research points which can be used to buy various effects."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[5].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[5].upgrades[i], 6, 0);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	research_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[5].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[5].production * buildings[5].count * buildings[5].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[5].production * buildings[5].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[5].production) +" per research center)</span><br>";
		stats_string += "Research Centers Owned: <span style='color:#ff8300;'>" + buildings[5].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRate(5) + "</span><br>";
		stats_string += "Research Points: <span style='color:#5036FF;'>" + minigames[5].vars.research_points + "</span> <span style='color:#36B8FF;'>(" + Math.floor(minigames[5].vars.research_time) + "s)</span> <br>";
		stats_string += "Researches Made: <span style='color:#5036FF;'>" + minigames[5].vars.researches_made + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[5].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[5].upgrades[i], 6, 0);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	research_minigame.update = function (dt) {
		this.vars.research_time -= dt;
		
		if (this.vars.research_time <= 0) {
			this.vars.research_time_max = 60 - minigames[5].vars.research_tree[5].bought - upgrades[225].bought;
			
			this.vars.research_time += this.vars.research_time_max;
			this.vars.research_points += 1;
		}
		
		if (CURRENT_CHALLENGE == 5) {this.vars.research_time_max = 1; if (this.vars.research_time > this.vars.research_time_max) {this.vars.research_time = 1}}
	}
	
	var factory_minigame = new Minigame();
	
	factory_minigame.vars = {
		max_production: 0,
	}
	factory_minigame.upgrades = [
		[66, function () {return true;}, "Unlocks once you own 10 factories."],
		[67, function () {return buildings[6].count >= 10;}, "Unlocks once you own 25 factories."],
		[68, function () {return buildings[6].count >= 25;}, "Unlocks once you own 50 factories."],
		[69, function () {return buildings[6].count >= 50;}, "Unlocks once you own 75 factories."],
		[70, function () {return buildings[6].count >= 75;}, "Unlocks once you own 100 factories."],
		[71, function () {return buildings[6].count >= 100;}, "Unlocks once you own 125 factories."],
		[105, function () {return buildings[6].count >= 125;}, "Unlocks once you own 150 factories."],
		[86, function () {return true;}, "Unlocks once you reach 500 million credits."],
		[93, function () {return true;}, "Unlocks once you reach 26 Billion credits."],
		[184, function () {return true;}, "Unlocks once you spend more than four days playing."],
		[198, function () {return true;}, "Unlocks with the achievement Factory Mastery."],
	];
	factory_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlPower(6));
		$("#building_tab_sidebar").append(htmlAutomation(6));
		$("#building_tab_sidebar").append(htmlClone(6));
		$("#building_tab_sidebar").append(htmlTabChallenge(6));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[3].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[3].count + " " + buildings[3].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[3].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[3].production * buildings[3].count) + "</span>.");
        
        minigame_container.append(explanation);
	
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	factory_minigame.updateHTML = function () {
        updateBuildingExplanation(6);
	}
	factory_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Factory");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Factories grant the ability to automate various aspects of other buildings."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[6].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[6].upgrades[i], 7, 0);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	factory_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[6].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[6].production * buildings[6].count * buildings[6].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[6].production * buildings[6].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[6].production) +" per factory)</span><br>";
		stats_string += "Factories Owned: <span style='color:#ff8300;'>" + buildings[6].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRate(6) + "</span><br>";
		$("#stats_help").html(stats_string);
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[6].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[6].upgrades[i], 7, 0);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	factory_minigame.update = function (dt) {
		
	}
	
    var bonus_minigame = new Minigame();
	
	bonus_minigame.vars = {
		total_bonuses: 0,
		total_malfunctions: 0,
		bonus_time: 90,
		bonus_max_time: 90,
		bonus_iteration: 0,
		disabled: false,
	}
	bonus_minigame.upgrades = [
		[107, function () {return true;}, "Unlocks once you own 10 warp facilities."],
		[108, function () {return buildings[7].count >= 10;}, "Unlocks once you own 25 bonus factories."],
		[109, function () {return buildings[7].count >= 25;}, "Unlocks once you own 50 bonus factories."],
		[110, function () {return buildings[7].count >= 50;}, "Unlocks once you own 75 bonus factories."],
		[111, function () {return buildings[7].count >= 75;}, "Unlocks once you own 100 bonus factories."],
		[112, function () {return buildings[7].count >= 100;}, "Unlocks once you own 125 bonus factories."],
		[113, function () {return true;}, "Unlocks once bonus factories produce more than 40 bonuses."],
		[114, function () {return true;}, "Unlocks once bonus factories produce more than 80 bonuses."],
		[115, function () {return true;}, "Unlocks once bonus factories produce more than 160 bonuses."],
		[116, function () {return true;}, "Unlocks once bonus factories produce more than 240 bonuses."],
		[185, function () {return true;}, "Unlocks once you spend more than five days playing."],
	];
	bonus_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAlienPower(7));
		$("#building_tab_sidebar").append(htmlAutomation(7));
		$("#building_tab_sidebar").append(htmlClone(7));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[7].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[7].count + " " + buildings[7].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[7].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[7].production * buildings[7].count) + "</span>.");
        
        minigame_container.append(explanation);
	
		var bonus_minigame_display = $(document.createElement("span"));
		bonus_minigame_display.attr("id", "bonus_minigame_display").attr("style", "font-size:25px;color:#7a4801 ;").html("Next Effect: " + Math.round(this.vars.bonus_time) + "s");
		
		var bonus_icon = $(document.createElement("img"));
		bonus_icon.attr("id", "bonus_icon")
		bonus_icon.attr("src", "images/bonus_normal.png").attr("style", "display:inline;cursor:pointer");
		bonus_icon.attr("onclick", "minigames[7].vars.disabled = !minigames[7].vars.disabled;updateBonusIcon()").attr("onmouseover","tooltip(this, 0, 12, 'Halt Production', 'Click to toggle this building&apos;s production of bonuses')").attr("onmouseout", "hideTooltip();");
		
		minigame_container.append(bonus_minigame_display);
		minigame_container.append($(document.createElement("br")));
		minigame_container.append(bonus_icon);
		
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
		updateBonusIcon();
	}
	bonus_minigame.updateHTML = function () {
		$("#bonus_minigame_display").html("Next Effect: " + Math.round(this.vars.bonus_time) + "s");
        updateBuildingExplanation(7);
	}
	bonus_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Bonus Factory");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Bonus Factories grant a 12% bonus for 30 seconds once every 90 seconds, every 4th time the bonus will be replaced by a -12% reduction for 45 seconds."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[7].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[7].upgrades[i], 7, 21);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	bonus_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[7].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[7].production * buildings[7].count * buildings[7].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[7].production * buildings[7].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[7].production) +" per warp facility)</span><br>";
		stats_string += "Bonus Factories Owned: <span style='color:#ff8300;'>" + buildings[7].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(7) + "</span><br>";
		stats_string += "Total Bonuses: <span style='color:#9e6e2b;'>" + minigames[7].vars.total_bonuses + "</span><br>";
		stats_string += "Total Malfunctions: <span style='color:#9e6e2b;'>" + minigames[7].vars.total_malfunctions + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[7].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[7].upgrades[i], 7, 21);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	bonus_minigame.update = function (dt) {
		this.vars.bonus_time -= dt;
		if (this.vars.disabled) {this.vars.bonus_time += dt}
		
		if (this.vars.bonus_time <= 0) {
			this.vars.bonus_time = this.vars.bonus_max_time - upgrades[113].bought * 15 - upgrades[230].bought;
			
			this.vars.bonus_iteration += 1;
			if (this.vars.bonus_iteration % (4 + upgrades[114].bought)  == 0) {
				this.vars.bonus_iteration = 0;
				this.vars.total_malfunctions += 1;
				buffs[24].activate(45);
			} else {
				this.vars.total_bonuses += 1;
				buffs[23].activate(30);
			}
			updateBonusIcon();
		}
		
		buildings[7].stats["Total Bonuses"] = this.vars.total_bonuses;
		buildings[7].stats["Total Malfunctions"] = this.vars.total_malfunctions;
		
		if (this.vars.total_bonuses >= 40) {upgrades[113].makeAvailable()}
		if (this.vars.total_bonuses >= 80) {upgrades[114].makeAvailable()}
		if (this.vars.total_bonuses >= 160) {upgrades[115].makeAvailable()}
		if (this.vars.total_bonuses >= 240) {upgrades[116].makeAvailable()}
	}
	
    var click_minigame = new Minigame();
	
	click_minigame.vars = {
		clicks_made: 0,
		stored_clicks: 0,
		max_clicks: 20,
		click_time: 5,
		click_path: [], //Filled with [x, y] arrays
		click_position: 0,
		press_time: 0.5,
		edit_path: false,
		run_path: false,
	}
	click_minigame.upgrades = [
		[117, function () {return true;}, "Unlocks once you own 10 click farms."],
		[118, function () {return buildings[8].count >= 10;}, "Unlocks once you own 25 click farms."],
		[119, function () {return buildings[8].count >= 25;}, "Unlocks once you own 50 click farms."],
		[120, function () {return buildings[8].count >= 50;}, "Unlocks once you own 75 click farms."],
		[121, function () {return buildings[8].count >= 75;}, "Unlocks once you own 100 click farms."],
		[122, function () {return buildings[8].count >= 100;}, "Unlocks once you own 125 click farms."],
		[123, function () {return true;}, "Unlocks once click farms have auto-clicked 200 times."],
		[124, function () {return true;}, "Unlocks once click farms have auto-clicked 400 times."],
		[125, function () {return true;}, "Unlocks once click farms have auto-clicked 700 times."],
		[126, function () {return true;}, "Unlocks once click farms have auto-clicked 1200 times."],
		[186, function () {return true;}, "Unlocks once you spend more than five days playing."],
	];
	click_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAlienPower(8));
		$("#building_tab_sidebar").append(htmlAutomation(8));
		$("#building_tab_sidebar").append(htmlClone(8));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[8].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[8].count + " " + buildings[8].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[8].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[8].production * buildings[8].count) + "</span>.");
        
        minigame_container.append(explanation);
	
		var click_minigame_display = $(document.createElement("span"));
		click_minigame_display.attr("id", "click_minigame_display").attr("style", "font-size:25px;color:#0007C4 ;").html("Clicks: " + this.vars.stored_clicks + "/" + this.vars.max_clicks + " (" + Math.round(this.vars.click_time) + "s)");
		
		var edit_button = $(document.createElement("span"));
			edit_button.html("Edit&nbsp;Path");
			edit_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#44F50A, #278707); margin: 8px;");
			edit_button.attr("class", "gambler_button").attr("id","edit_button");
			edit_button.attr("onclick", "editPath()");
			
		var run_button = $(document.createElement("span"));
			run_button.html("Run&nbsp;Path");
			run_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#44F50A, #278707); margin: 8px;");
			run_button.attr("class", "gambler_button").attr("id","run_button");
			run_button.attr("onclick", "runPath()");
			
		var reset_button = $(document.createElement("span"));
			reset_button.html("Reset&nbsp;Path");
			reset_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #4DFF00; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#44F50A, #278707); margin: 8px;");
			reset_button.attr("class", "gambler_button").attr("id","reset_button");
			reset_button.attr("onclick", "resetPath()");
		minigame_container.append(click_minigame_display);
		minigame_container.append($("<br>"));
		minigame_container.append($("<br>"));
		minigame_container.append(edit_button);		
		minigame_container.append($("<br>"));
		minigame_container.append($("<br>"));
		minigame_container.append(run_button)		
		minigame_container.append($("<br>"));
		minigame_container.append($("<br>"));
		minigame_container.append(reset_button);
			
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	click_minigame.updateHTML = function () {
		$("#click_minigame_display").html("Clicks: " + this.vars.stored_clicks + "/" + this.vars.max_clicks + " (" + Math.round(this.vars.click_time) + "s)");
        updateBuildingExplanation(8);
	}
	click_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Click Farm");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Click farms slowly generate clicks which can be used to click in a predetermined path."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[8].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[8].upgrades[i], 9, 10);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	click_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[8].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[8].production * buildings[8].count * buildings[8].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[8].production * buildings[8].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[8].production) +" per click farm)</span><br>";
		stats_string += "Click Farms Owned: <span style='color:#ff8300;'>" + buildings[8].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(8) + "</span><br>";
		stats_string += "Clicks Made: <span style='color:#87E2F5;'>" + Math.round(this.vars.clicks_made) + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[8].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[8].upgrades[i], 9, 10);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	click_minigame.update = function (dt) {
		if (this.vars.edit_path) {
			$("#click_farm_display").empty();
			
			var len = this.vars.click_path.length;
			for (var i = 0; i < len; i++) {
				var click = this.vars.click_path[i];
				
				var background = $(document.createElement("div"));
				background.attr("id", "click_" + i);
				background.attr("style", "pointer-events: none;position:absolute;left:" + (click[0] - 17) + "px;top:" + (click[1] - 4) + "px;background-image: url('images/building_icon_click.png');height:64px;width:64px;");
				background.html(i+1);
				
				$("#click_farm_display").append(background);
			}
			
			if (!$("#click_farm_overlay").length) {
					var click_farm_overlay = $(document.createElement("div"));
						click_farm_overlay.attr("id", "click_farm_overlay");
						click_farm_overlay.attr("style", "position: fixed;width:100%;height:100%;top:0px;left:0px;background-color: rgba(0,0,100,0.3);pointer-events:none");
					
					var click_farm_text = $(document.createElement("div"));
						click_farm_text.attr("style","text-align:center;transform: translate(-50%,0%);position:absolute;left:50%;top:120px;text-shadow : 0px 0px 8px #000000;");
						click_farm_text.html("Right click to choose add that location to the click path<br>Click 'Edit Path' or press the escape hotkey to exit")
						
					click_farm_overlay.append(click_farm_text);
					$(document.body).append(click_farm_overlay);
			}
		} else {
			$("#click_farm_overlay").remove();
		}
		
		if (this.vars.run_path) {
			if (this.vars.click_position >= this.vars.click_path.length) {
				//$("#click_farm_clicker").hide();
				this.vars.run_path = false;
				this.vars.click_position = 0;
			} else {
				this.vars.press_time -= dt;
				if (this.vars.press_time <= 0) {
					$("#click_farm_clicker").show();
					$("#click_farm_clicker").fadeOut();
					$("#click_farm_clicker").attr("style", "pointer-events:none;position:absolute;left:" + (minigames[8].vars.click_path[this.vars.click_position][0] - 17) + "px;top:" + (minigames[8].vars.click_path[this.vars.click_position][1]-4) + "px;");
					this.vars.stored_clicks -= 1;
					MENU_CLOSE = false;
					document.elementFromPoint(minigames[8].vars.click_path[this.vars.click_position][0], minigames[8].vars.click_path[this.vars.click_position][1]).click();
					this.vars.click_position += 1;
					this.vars.clicks_made += 1;
					buildings[8].stats["Clicks Made"] = this.vars.clicks_made;
					if (!upgrades[124].bought) {this.vars.press_time = 0.5;} else {this.vars.press_time = 0.4;}
					
					if (this.vars.clicks_made >= 200) {upgrades[123].makeAvailable();}
					if (this.vars.clicks_made >= 400) {upgrades[124].makeAvailable();}
					if (this.vars.clicks_made >= 700) {upgrades[125].makeAvailable();}
					if (this.vars.clicks_made >= 1200) {upgrades[126].makeAvailable();}
				}
			}
		}
		
		
		this.vars.max_clicks = Math.floor(20 + buildings[8].count * 0.5 + upgrades[123].bought * 15 + upgrades[231].bought * 5);
		
		if (this.vars.stored_clicks < this.vars.max_clicks) {
			this.vars.click_time -= dt;
		}
		
		if (this.vars.click_time <= 0) {
			this.vars.click_time += 5 - upgrades[125].bought;
			this.vars.stored_clicks += 1;
			
			if (this.vars.stored_clicks > this.vars.max_clicks) {
				this.vars.stored_clicks = this.vars.max_clicks;
			}			
		}
	}
	
    var cryogenic_minigame = new Minigame();
	
	cryogenic_minigame.vars = {
		target_buff: null,
	}
	cryogenic_minigame.upgrades = [
		[127, function () {return true;}, "Unlocks once you own 10 cryogenic labs."],
		[128, function () {return buildings[9].count >= 10;}, "Unlocks once you own 25 cryogenic labs."],
		[129, function () {return buildings[9].count >= 25;}, "Unlocks once you own 50 cryogenic labs."],
		[130, function () {return buildings[9].count >= 50;}, "Unlocks once you own 75 cryogenic labs."],
		[131, function () {return buildings[9].count >= 75;}, "Unlocks once you own 100 cryogenic labs."],
		[132, function () {return buildings[9].count >= 100;}, "Unlocks once you own 125 cryogenic labs."],
		[187, function () {return true;}, "Unlocks once you spend more than five days playing."],
	];
	cryogenic_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAlienPower(9));
		$("#building_tab_sidebar").append(htmlAutomation(9));
		$("#building_tab_sidebar").append(htmlClone(9));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[7].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[7].count + " " + buildings[7].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[7].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[7].production * buildings[7].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var buff_display = $(document.createElement("span"));
		buff_display.attr("id", "buff_display").attr("style", "font-size:25px;color:#0093B0;").html("Buff Frozen: None");
		
		minigame_container.append(buff_display);
			
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	cryogenic_minigame.updateHTML = function () {
		if (this.vars.target_buff == null) {$("#buff_display").html("Buff Frozen: None");}
		else {$("#buff_display").html("Buff Frozen: " + buffs[this.vars.target_buff].name)}
        updateBuildingExplanation(9);
	}
	cryogenic_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Cryogenic Lab");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Cryogenic labs allow you to freeze one temporary bonus at a time. Click on the temporary bonus to toggle freezing it. This essentially allows you to store a temporary bonus for later use."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[9].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[9].upgrades[i], 7, 11);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	cryogenic_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[9].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[9].production * buildings[9].count * buildings[9].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[9].production * buildings[9].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[9].production) +" per cryogenic lab)</span><br>";
		stats_string += "Cryogenic Labs Owned: <span style='color:#ff8300;'>" + buildings[9].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(9) + "</span><br>";
		if (this.vars.target_buff != null) {stats_string += "Buff Frozen: <span style='color:#3DCFFF;'>" + buffs[this.vars.target_buff].name + "</span><br>";}
		else {stats_string += "Buff Frozen: <span style='color:#3DCFFF;'>None</span><br>";}
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[9].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[9].upgrades[i], 7, 11);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	cryogenic_minigame.update = function (dt) {
	}

    var alien_minigame = new Minigame();
	
	alien_minigame.vars = {
		alien_power: 100,
		max_power: 100,
		alien_power_generated: 0,
		alien_power_rate: 1,
		powered_buildings: [],
	}
	alien_minigame.upgrades = [
		[137, function () {return true;}, "Unlocks once you own 10 alien labs."],
		[138, function () {return buildings[10].count >= 10;}, "Unlocks once you own 25 alien labs."],
		[139, function () {return buildings[10].count >= 25;}, "Unlocks once you own 50 alien labs."],
		[140, function () {return buildings[10].count >= 50;}, "Unlocks once you own 75 alien labs."],
		[141, function () {return buildings[10].count >= 75;}, "Unlocks once you own 100 alien labs."],
		[142, function () {return buildings[10].count >= 100;}, "Unlocks once you own 125 alien labs."],
		[143, function () {return true;}, "Unlocks once you generate 1000 seconds worth of research."],
		[144, function () {return true;}, "Unlocks once you generate 2500 seconds worth of research."],
		[145, function () {return true;}, "Unlocks once you generate 5000 seconds worth of research."],
		[146, function () {return true;}, "Unlocks once you generate 10000 seconds worth of research."],
		[188, function () {return true;}, "Unlocks once you spend more than five days playing."],
	];
	alien_minigame.createHTML = function () {	
		$("#building_tab_sidebar").append(htmlAlienPower(10));
		$("#building_tab_sidebar").append(htmlAutomation(10));
		$("#building_tab_sidebar").append(htmlClone(10));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[10].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[10].count + " " + buildings[10].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[10].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[10].production * buildings[10].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var alien_power_icon = $(document.createElement("img"));
		alien_power_icon.attr("src", "images/building_icon_alien.png").attr("style", "display:inline;");
		
		minigame_container.append(alien_power_icon);
		
		var alien_power_display = $(document.createElement("span"));
		alien_power_display.attr("id", "alien_power_display").attr("style", "font-size:25px;color:#9700C9 ;position:relative;top:-26px;left:5px;").html("Research: " + this.vars.alien_power + "/" + this.vars.max_power);
		
		minigame_container.append(alien_power_display);
				
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	alien_minigame.updateHTML = function () {
		$("#alien_power_display").html("Research: " + Math.round(this.vars.alien_power) + "/" + this.vars.max_power);
        updateBuildingExplanation(10);
	}
	alien_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Alien Research Lab");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Alien Labs generate alien research, which can be used to boost the production of other buildings by 75%, but decreases the building&#39;s work rate by 25%."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[10].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[10].upgrades[i], 8, 11);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	alien_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[10].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[10].production * buildings[10].count * buildings[10].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[10].production * buildings[10].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[10].production) +" per alien lab)</span><br>";
		stats_string += "Alien Labs Owned: <span style='color:#ff8300;'>" + buildings[10].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(10) + "</span><br>";
		stats_string += "Research: <span style='color:#CC79E8;'>" + Math.round(this.vars.alien_power) + "/" + minigames[10].vars.max_power + "</span> <span style='color:#DAA1ED;'>(+" + Math.round((this.vars.alien_power_rate) * 100) / 100 + "/s)</span><br>";
		stats_string += "Research Generated: <span style='color:#CC79E8;'>" + fancyNumber(minigames[10].vars.alien_power_generated) + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[10].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[10].upgrades[i], 8, 11);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	alien_minigame.update = function (dt) {
		this.vars.max_power = 60 + Math.floor(buildings[10].count * 0.5) + upgrades[143].bought * 30 + upgrades[233].bought * 5;
		this.vars.alien_power_rate = (0.5 + (buildings[10].count / 200)) + upgrades[144].bought * 0.4;
		
		this.vars.alien_power = Math.min(this.vars.alien_power + this.vars.alien_power_rate * dt, this.vars.max_power);
		
		if (this.vars.powered_buildings.length >= 1) {
			this.vars.alien_power_generated += this.vars.alien_power_rate * dt;
		}
		
		this.vars.alien_power -= (this.vars.powered_buildings.length) * dt;
		
		
		if (this.vars.alien_power <= 0) {
			this.vars.alien_power = 0;
			this.vars.powered_buildings = [];
			$(".aliencharge").attr("src", "images/misc_inactive_alien.png");
			UPDATE_BUILDINGS = true;
		}
		
		this.vars.previous_power = this.vars.power;
		
		buildings[10].stats["Alien Research Generated"] = fancyNumber(minigames[10].vars.alien_power_generated);
		
		if (this.vars.alien_power_generated >= 1000 && !upgrades[143].available) {upgrades[143].makeAvailable();}
		if (this.vars.alien_power_generated >= 2500 && !upgrades[144].available) {upgrades[144].makeAvailable();}
		if (this.vars.alien_power_generated >= 5000 && !upgrades[145].available) {upgrades[145].makeAvailable();}
		if (this.vars.alien_power_generated >= 10000 && !upgrades[146].available) {upgrades[146].makeAvailable();}
	}
	
	var computer_minigame = new Minigame();
	
	computer_minigame.vars = {
		program_1: 0, //0 Not running, 1 = function 1 etc
		program_1_click_time: 1,
		program_1_time: 60,
		program_2: 0,
		program_2_time: 60,
		program_3: 0,
		program_3_time: 60,
		programs_ran: 0,
		looping: false,
	}
	computer_minigame.upgrades = [
		[147, function () {return true;}, "Unlocks once you own 10 mainframe computers."],
		[148, function () {return buildings[11].count >= 10;}, "Unlocks once you own 25 mainframe computers."],
		[149, function () {return buildings[11].count >= 25;}, "Unlocks once you own 50 mainframe computers."],
		[150, function () {return buildings[11].count >= 50;}, "Unlocks once you own 75 mainframe computers."],
		[151, function () {return buildings[11].count >= 75;}, "Unlocks once you own 100 mainframe computers."],
		[152, function () {return buildings[11].count >= 100;}, "Unlocks once you own 125 mainframe computers."],
		[153, function () {return true;}, "Unlocks once you run a program 4 times."],
		[154, function () {return true;}, "Unlocks once you run a program 10 times."],
		[155, function () {return true;}, "Unlocks once you run a program 20 times."],
		[156, function () {return true;}, "Unlocks once you run a program 30 times."],
		[189, function () {return true;}, "Unlocks once you spend more than five days playing."],
	];
	computer_minigame.createHTML = function () {	
		$("#building_tab_sidebar").append(htmlAlienPower(11));
		$("#building_tab_sidebar").append(htmlAutomation(11));
		$("#building_tab_sidebar").append(htmlClone(11));
				
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[11].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[11].count + " " + buildings[11].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[11].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[11].production * buildings[11].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var program_1_button = $(document.createElement("span"));
			program_1_button.html("Program&nbsp;1");
			program_1_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #54BEE3; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#0ABAF5, #076787); margin: 8px;");
			program_1_button.attr("class", "gambler_button").attr("id","program_1_button");
			program_1_button.attr("onclick", "program1();");
			program_1_button.attr("onmouseover","program1Tooltip(this);");
			program_1_button.attr("onmouseout", "hideTooltip();");
			
		var program_2_button = $(document.createElement("span"));
			program_2_button.html("Program&nbsp;2");
			program_2_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #54BEE3; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#0ABAF5, #076787); margin: 8px;");
			program_2_button.attr("class", "gambler_button").attr("id","program_2_button");
			program_2_button.attr("onclick", "program2();");
			program_2_button.attr("onmouseover","program2Tooltip(this);");
			program_2_button.attr("onmouseout", "hideTooltip();");
			
		var program_3_button = $(document.createElement("span"));
			program_3_button.html("Program&nbsp;3");
			program_3_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #54BEE3; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#0ABAF5, #076787); margin: 8px;");
			program_3_button.attr("class", "gambler_button").attr("id","program_3_button");
			program_3_button.attr("onclick", "program3();");
			program_3_button.attr("onmouseover","program3Tooltip(this);");
			program_3_button.attr("onmouseout", "hideTooltip();");
			
		var run_display = $(document.createElement("span"));
		run_display.attr("id", "run_display").attr("style", "font-size:25px;color:#0093B0;").html("");
		
		minigame_container.append($("<br>"));
		minigame_container.append(program_1_button);
		minigame_container.append(program_2_button);
		minigame_container.append($("<br>"));
		minigame_container.append($("<br>"));
		minigame_container.append(program_3_button);
		minigame_container.append($("<br>"));
		minigame_container.append($("<br>"));
		minigame_container.append(run_display);
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	computer_minigame.updateHTML = function () {
		var program_string = "";
		if (this.vars.program_1 != 0) {program_string += "Program 1 Running<br>"};
		if (this.vars.program_2 != 0) {program_string += "Program 2 Running<br>"};
		if (this.vars.program_3 != 0) {program_string += "Program 3 Running<br>"};
		$("#run_display").html(program_string);
        updateBuildingExplanation(11);
	}
	computer_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Mainframe Computer");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Mainframe computers grants the ability to activate &quot;programs&quot;. These programs have 2 positive and 2 negative effects that will occur over time. Each effect will occur once per minute over a 4 minute interval."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[11].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[11].upgrades[i], 9, 11);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	computer_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[11].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[11].production * buildings[11].count * buildings[11].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[11].production * buildings[11].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[11].production) +" per mainframe computer)</span><br>";
		stats_string += "Mainframe Computers Owned: <span style='color:#ff8300;'>" + buildings[11].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(11) + "</span><br>";
		stats_string += "Programs Ran: <span style='color:#ff8300;'>" + Math.round(this.vars.programs_ran) + "</span><br>";
		$("#stats_help").html(stats_string); 	
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[11].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[11].upgrades[i], 9, 11);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	computer_minigame.update = function (dt) {
		if (buffs[10].active && !buffs[10].frozen) {
			this.vars.program_1_click_time -= dt;
			if (this.vars.program_1_click_time <= 0) {
				handleClick();
				this.vars.program_1_click_time += 1;
			}
		}
		
		if (this.vars.program_1 != 0) {
			this.vars.program_1_time -= dt;
			if (this.vars.program_1_time <= 0) {
				var looped = false;
				
				if (this.vars.program_1 == 1) {buffs[9].activate(60)}
				else if (this.vars.program_1 == 2) {buffs[10].activate(60)}
				else if (this.vars.program_1 == 3) {addClockTicks(-10);if (CLOCK_TICKS < 0) {CLOCK_TICKS = 0;addClockTicks(0);}}
				//else if (this.vars.program_1 == 4 && !upgrades[154].bought) {this.vars.program_1 = -1;}
				else if (this.vars.program_1 == 4 && this.vars.looping) {this.vars.program_1 = 0;looped = true;program1();}
				else if (this.vars.program_1 == 4) {this.vars.program_1 = -1;}
				
				if (!looped) {this.vars.program_1++;}
				this.vars.program_1_time=60;
			}
		}
		
		if (this.vars.program_2 != 0) {
			this.vars.program_2_time -= dt;
			if (this.vars.program_2_time <= 0) {
				var looped = false;
				
				if (this.vars.program_2 == 1) {CREDITS = Math.max(0, CREDITS - PRODUCTION * 20);}
				else if (this.vars.program_2 == 2) {buffs[11].activate(60)}
				else if (this.vars.program_2 == 3) {buffs[12].activate(60)}
				//else if (this.vars.program_2 == 4 && !upgrades[154].bought) {this.vars.program_2 = -1;}
				else if (this.vars.program_2 == 4 && this.vars.looping) {this.vars.program_2 = 0;looped = true;program2();} 
				else if (this.vars.program_2 == 4) {this.vars.program_2 = -1;}
				
				if (!looped) {this.vars.program_2++;}
				this.vars.program_2_time=60;
			}
		}
		
		if (this.vars.program_3 != 0) {
			this.vars.program_3_time -= dt;
			if (this.vars.program_3_time <= 0) {
				var looped = false;
				
				if (this.vars.program_3 == 1) {buffs[13].activate(60)}
				else if (this.vars.program_3 == 2) {buffs[14].activate(60)}
				else if (this.vars.program_3 == 3) {addClockTicks(-5);if (CLOCK_TICKS < 0) {CLOCK_TICKS = 0;addClockTicks(0);}}
				//else if (this.vars.program_3 == 4 && !upgrades[154].bought) {this.vars.program_3 = -1;}
				else if (this.vars.program_3 == 4 && this.vars.looping) {this.vars.program_3 = 0;looped = true;program3();} 
				else if (this.vars.program_3 == 4) {this.vars.program_3 = -1;}
				
				if (!looped) {this.vars.program_3++;}
				this.vars.program_3_time=60;
			}
		}
			
	}

	var acceleration_minigame = new Minigame();
	
	acceleration_minigame.vars = {
		accel_target: -1, //0 = Prices, 1 = Clicks, 2 = Production
		accel_bonus: 0,
		accel_time: 30,
		charge_time: 300,
		charge_time_max: 300,
		max_charges: 0,
		
	}
	acceleration_minigame.upgrades = [
		[157, function () {return true;}, "Unlocks once you own 10 acceleration labs."],
		[158, function () {return buildings[12].count >= 10;}, "Unlocks once you own 25 acceleration labs."],
		[159, function () {return buildings[12].count >= 25;}, "Unlocks once you own 50 acceleration labs."],
		[160, function () {return buildings[12].count >= 50;}, "Unlocks once you own 75 acceleration labs."],
		[161, function () {return buildings[12].count >= 75;}, "Unlocks once you own 100 acceleration labs."],
		[162, function () {return buildings[12].count >= 100;}, "Unlocks once you own 125 acceleration labs."],
		[163, function () {return true;}, "Unlocks once you reach the 15% acceleration bonus for building cost reduction."],
		[164, function () {return true;}, "Unlocks once you reach the 15% acceleration bonus for clicks."],
		[165, function () {return true;}, "Unlocks once you reach the 15% acceleration bonus for production."],
		[166, function () {return true;}, "Unlocks once you reach 15% for each acceleration bonus."],
		[190, function () {return true;}, "Unlocks once you spend more than five days playing."],
	];
	acceleration_minigame.createHTML = function () {	
		$("#building_tab_sidebar").append(htmlAlienPower(12));
		$("#building_tab_sidebar").append(htmlAutomation(12));
		$("#building_tab_sidebar").append(htmlClone(12));
				
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[12].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[12].count + " " + buildings[12].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[12].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[12].production * buildings[12].count) + "</span>.");
        
        minigame_container.append(explanation);

		var accel_price_icon = $(document.createElement("img"));
		accel_price_icon.attr("src", "images/accel_building.png").attr("style", "display:inline;cursor:pointer").attr("id", "accel_price");
		accel_price_icon.attr("onclick", "accelTarget(0);").attr("onmouseover","tooltip(this, 0, 17, 'Accelerated Construction', 'Click to toggle a bonus that decreases the cost of buildings by 1% for each other building bought in the last 30 seconds (max 15%).<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')").attr("onmouseout", "hideTooltip();");
		
		minigame_container.append(accel_price_icon);
		minigame_container.append($(document.createTextNode(" ")));
		
		var accel_click_icon = $(document.createElement("img"));
		accel_click_icon.attr("src", "images/accel_click.png").attr("style", "display:inline;cursor:pointer").attr("id", "accel_click");
		accel_click_icon.attr("onclick", "accelTarget(1)").attr("onmouseover","tooltip(this, 0, 17, 'Accelerated Clicking', 'Click to toggle a bonus that increases the value from clicking by 0.1% per click for 30 seconds (max 15%).<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')").attr("onmouseout", "hideTooltip();");
		
		minigame_container.append(accel_click_icon);
		minigame_container.append($(document.createTextNode(" ")));
		
		var accel_click_production = $(document.createElement("img"));
		accel_click_production.attr("src", "images/accel_production.png").attr("style", "display:inline;cursor:pointer").attr("id", "accel_production");;
		accel_click_production.attr("onclick", "accelTarget(2);").attr("onmouseover","tooltip(this, 0, 17, 'Accelerated Production', 'Click to toggle a bonus that increases production by 5% for 30 seconds each time an upgrade is bought (max 15%).<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')").attr("onmouseout", "hideTooltip();");
		
		minigame_container.append(accel_click_production);
		minigame_container.append($(document.createElement("br")));
		
		var accel_display = $(document.createElement("span"));
		accel_display.attr("id", "accel_display").attr("style", "font-size:25px;color:#C70000;").html("");

		minigame_container.append(accel_display);
		
        $(".building_tab").append(minigame_container);
		
		var target = this.vars.accel_target;
		$("#accel_price").attr("style", "display:inline;cursor:pointer;opacity:0.6");
		$("#accel_click").attr("style", "display:inline;cursor:pointer;opacity:0.6");
		$("#accel_production").attr("style", "display:inline;cursor:pointer;opacity:0.6");
		
		if (target == 0) {$("#accel_price").attr("style", "display:inline;cursor:pointer;opacity:1");}
		if (target == 1) {$("#accel_click").attr("style", "display:inline;cursor:pointer;opacity:1");}
		if (target == 2) {$("#accel_production").attr("style", "display:inline;cursor:pointer;opacity:1");}
		
        updateUnlocks();
	}
	acceleration_minigame.updateHTML = function () {
		if (this.vars.accel_target == 0) {$("#accel_display").html("Building Reduction: " + Math.round(this.vars.accel_bonus * 100) + "% (" + Math.round(this.vars.accel_time) + "s)")}
		if (this.vars.accel_target == 1) {$("#accel_display").html("Click Bonus: " + Math.round(this.vars.accel_bonus * 100) + "% (" + Math.round(this.vars.accel_time) + "s)")}
		if (this.vars.accel_target == 2) {$("#accel_display").html("Production Bonus: " + Math.round(this.vars.accel_bonus * 100) + "% (" + Math.round(this.vars.accel_time) + "s)")}
        updateBuildingExplanation(12);
	}
	acceleration_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Acceleration<br>Lab");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Acceleration labs grant the ability to toggle though various effects that increase in power during continuous use."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[12].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[12].upgrades[i], 6, 14);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	acceleration_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[12].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[12].production * buildings[12].count * buildings[12].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[12].production * buildings[12].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[12].production) +" per acceleration lab)</span><br>";
		stats_string += "Acceleration Labs Owned: <span style='color:#ff8300;'>" + buildings[12].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(12) + "</span><br>";
		$("#stats_help").html(stats_string); 	
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[12].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[12].upgrades[i], 6, 14);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	acceleration_minigame.update = function (dt) {
		if (this.vars.accel_bonus != 0) {
			this.vars.accel_time -= dt;
		
			if (this.vars.accel_time <= 0) {
				this.vars.accel_time = 30;
				this.vars.accel_bonus = 0;
			}
		}
	}
	
	var fluctuation_minigame = new Minigame();
	
	fluctuation_minigame.vars = {
		flux_time: 1800,
		flux_effect: 0, //0 = production, 1 = clocks ticks, 2 = 250% clicks, 3 = 200 clicks, 4 = negative production, 5 = removes clock ticks, 6 = prevents clicks 
		flux_multiplier: 1,
		flux_bonus_multiplier: 1.5,
		next_flux: 0,
		total_fluxes: 0,
	}
	fluctuation_minigame.upgrades = [
		[167, function () {return true;}, "Unlocks once you own 10 fluctuation labs."],
		[168, function () {return buildings[13].count >= 10;}, "Unlocks once you own 25 fluctuation labs."],
		[169, function () {return buildings[13].count >= 25;}, "Unlocks once you own 50 fluctuation labs."],
		[170, function () {return buildings[13].count >= 50;}, "Unlocks once you own 75 fluctuation labs."],
		[171, function () {return buildings[13].count >= 75;}, "Unlocks once you own 100 fluctuation labs."],
		[172, function () {return buildings[13].count >= 100;}, "Unlocks once you own 125 fluctuation labs."],
		[173, function () {return true;}, "Unlocks once 1 fluctuation has occurred."],
		[174, function () {return true;}, "Unlocks once 2 fluctuations have occurred."],
		[175, function () {return true;}, "Unlocks once 4 fluctuations have occurred."],
		[176, function () {return true;}, "Unlocks once 8 fluctuation have occurred."],
		[191, function () {return true;}, "Unlocks once you spend more than five days playing."],
	];
	fluctuation_minigame.createHTML = function () {	
		$("#building_tab_sidebar").append(htmlAlienPower(13));
		$("#building_tab_sidebar").append(htmlAutomation(13));
		$("#building_tab_sidebar").append(htmlClone(13));
				
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[13].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[13].count + " " + buildings[13].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[13].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[13].production * buildings[13].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var flux_display = $(document.createElement("span"));
		flux_display.attr("id", "flux_display").attr("style", "font-size:25px;color:#1db000;").html("Next fluctuation happening in 30-40 minutes");
		
		minigame_container.append(flux_display);
		
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	fluctuation_minigame.updateHTML = function () {
		var flux_string = ""
		if (upgrades[173].bought) {
			flux_string += secondsToTime(Math.floor(this.vars.flux_time));
		}
		else {
			if (minigames[13].vars.flux_time <= 600) {flux_string = "1-10 minutes"}
			else if (minigames[13].vars.flux_time <= 1200) {flux_string = "10-20 minutes"}
			else if (minigames[13].vars.flux_time <= 1800) {flux_string = "20-30 minutes"}
			else {flux_string = "30-35 minutes"}
		}
		if (upgrades[174].bought) {
			flux_string += " "
			switch (minigames[13].vars.next_flux) {
				case 0:
					flux_string += "and will increase production"
				break;
				case 1:
					flux_string += "and will grant extra seconds worth of time"
				break;
				case 2:
					flux_string += "and will instantly click repeatedly"
				break;
				case 3:
					flux_string += "and will reduce production"
				break;
				case 4:
					flux_string += "and will remove extra seconds worth of time"
				break;
			}
		}
		$("#flux_display").html("Next fluctuation happening in " + flux_string);
		updateBuildingExplanation(13);
	}
	fluctuation_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Fluctuation<br>Lab");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Fluctuation labs will produce one large random effect once every 25 to 35 minutes."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[13].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[13].upgrades[i], 7, 14);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	fluctuation_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[13].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[13].production * buildings[13].count * buildings[13].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[13].production * buildings[13].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[13].production) +" per fluctuation lab)</span><br>";
		stats_string += "Fluctuation Labs Owned: <span style='color:#ff8300;'>" + buildings[13].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(13) + "</span><br>";
		stats_string += "Total Fluctuations: <span style='color:#F4FF1E;'>" + this.vars.total_fluxes + "</span><br>";
		$("#stats_help").html(stats_string); 	
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[13].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[13].upgrades[i], 7, 14);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	fluctuation_minigame.update = function (dt) {
		this.vars.flux_time -= dt;
		
		if (this.vars.flux_time < 0) {
			flux();
			
			this.vars.flux_time = 1500 + Math.random() * 600;
			this.vars.flux_effect = Math.floor(Math.random() * 7);
			this.vars.flux_multilier += 0.8 + Math.random() * 0.4;
			
			if (upgrades[175].bought) {this.vars.flux_time -= 120;}
			if (upgrades[236].bought) {this.vars.flux_time -= 20;}
		}
	}
	
	var clone_minigame = new Minigame();
	
	clone_minigame.vars = {
		clone_charges: 1,
		clone_max_charges: tweaker.minigames.clone_max_charges,
		clone_charge_time: tweaker.minigames.clone_recharge_duration,
		clone_charge_time_max: tweaker.minigames.clone_recharge_duration,
		clone_targets: [],
		clone_times: [],
		total_clones: 0,
	}
	clone_minigame.upgrades = [
		[249, function () {return true;}, "Unlocks once 10 clones have been activated."],
		[250, function () {return true;}, "Unlocks once 20 clones have been activated."],
		[251, function () {return true;}, "Unlocks once 50 clones have been activated."],
		[252, function () {return true;}, "Unlocks once 100 clones have been activated."],
		[253, function () {return true;}, "Unlocks once 200 clones have been activated."],
		[254, function () {return true;}, "Unlocks once 500 clones have been activated."],
		[255, function () {return true;}, "Unlocks once 1000 clones have been activated."],
	];
	clone_minigame.createHTML = function () {	
		$("#building_tab_sidebar").append(htmlAutomation(14));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[14].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[14].count + " " + buildings[14].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[14].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[14].production * buildings[14].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var clone_display = $(document.createElement("span"));
		clone_display.attr("id", "clone_display").attr("style", "font-size:25px;color:#7000a3;").html("Available Clones: " + this.vars.clone_charges + "/" + this.vars.clone_max_charges + " (" + Math.round(this.vars.clone_charge_time) + "s)");
		
		minigame_container.append(clone_display);
		
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	clone_minigame.updateHTML = function () {
		$("#clone_display").html("Available Clones: " + this.vars.clone_charges + "/" + this.vars.clone_max_charges + " (" + Math.round(this.vars.clone_charge_time) + "s)");
		updateBuildingExplanation(14);
	}
	clone_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Cloning Lab");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Once every 10 minutes can double the production and work rate of a tier 1 or tier 2 building for 1 minute and 30 seconds."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[14].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[14].upgrades[i], 8, 14);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	clone_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[14].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[14].production * buildings[14].count * buildings[14].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[14].production * buildings[14].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[14].production) +" per cloning lab)</span><br>";
		stats_string += "Cloning Labs Owned: <span style='color:#ff8300;'>" + buildings[14].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(14) + "</span><br>";
		stats_string += "Clones available: <span style='color:#CD60FF;'>" + this.vars.clone_charges + "</span> <span style='color:#CD60FF;'>("+ Math.round(this.vars.clone_charge_time)+ "s)</span><br>";
		stats_string += "Total Clones: <span style='color:#CD60FF;'>" + this.vars.total_clones + "</span><br>";
		$("#stats_help").html(stats_string); 	
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[14].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[14].upgrades[i], 8, 14);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	clone_minigame.update = function (dt) {
		this.vars.clone_max_charges = 2 + upgrades[250].bought;
		this.vars.clone_charge_time_max = 600 - upgrades[249].bought * 60
		
		for (var i = this.vars.clone_targets.length - 1; i >= 0; i--) {
			this.vars.clone_times[i] -= dt;
			if (this.vars.clone_times[i] <= 0) {
				this.vars.clone_times.splice(i, 1);
				this.vars.clone_targets.splice(i, 1);
				UPDATE_BUILDINGS = true;
			}
		}
		
		if (this.vars.clone_max_charges != this.vars.clone_charges) {
			this.vars.clone_charge_time -= dt;
			if (this.vars.clone_charge_time <= 0) {
				this.vars.clone_charges += 1;
				this.vars.clone_charge_time += this.vars.clone_charge_time_max; 
				
				if (this.vars.clone_charges > this.vars.clone_max_charges) {this.vars.clone_charges = this.vars.clone_max_charges;}
				if (this.vars.clone_charges == this.vars.clone_max_charges) {this.vars.clone_charge_time = this.vars.clone_charge_time_max;}
			}
		}
	}
	
	var epiphany_minigame = new Minigame();
	
	epiphany_minigame.vars = {
		epiphany_duration: 30,
		epiphany_time: 300,
		epiphany_max_time: 300,
		epiphany_target: -1,
		epiphany_target_next: Math.floor(Math.random() * 14),
		total_epiphanies: 0,
	}
	epiphany_minigame.upgrades = [
		[256, function () {return true;}, "Unlocks once 20 epiphanies have occurred."],
		[257, function () {return true;}, "Unlocks once 50 epiphanies have occurred."],
		[258, function () {return true;}, "Unlocks once 100 epiphanies have occurred."],
		[259, function () {return true;}, "Unlocks once 200 epiphanies have occurred."],
		[260, function () {return true;}, "Unlocks once 500 epiphanies have occurred."],
		[261, function () {return true;}, "Unlocks once 1000 epiphanies have occurred."],
		[262, function () {return true;}, "Unlocks once 2000 epiphanies have occurred."],
	];
	epiphany_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAutomation(15));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[15].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[15].count + " " + buildings[15].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[15].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[15].production * buildings[15].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var target_text = "";
		if (this.vars.epiphany_target != -1) {
			target_text = "<br>Targeting: " + buildings[this.vars.epiphany_target].tab_name + "";
		}
		
		var epiphany_display = $(document.createElement("span"));
		epiphany_display.attr("id", "epiphany_display").attr("style", "font-size:25px;color:#1900f9;").html("Next Epiphany: " + Math.round(this.vars.epiphany_time) + "s" + target_text);
		
		minigame_container.append(epiphany_display);
		
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	epiphany_minigame.updateHTML = function () {
		var target_text = "";
		if (this.vars.epiphany_target != -1) {
			target_text = "<br>Targeting: " + buildings[this.vars.epiphany_target].tab_name + "";
		}
		var foresight = "";
		if (upgrades[257].bought) {
			foresight = "<br>Next Target: " + buildings[this.vars.epiphany_target_next].tab_name + "";
		}
		$("#epiphany_display").html("Next Epiphany: " + Math.round(this.vars.epiphany_time) + "s" + target_text + foresight);
		updateBuildingExplanation(15);
	}
	epiphany_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Epiphany<br>Center");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Once every 5 minutes triples the production of a random tier 1 or tier 2 building for 30 seconds."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[15].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[15].upgrades[i], 9, 14);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	epiphany_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[15].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[15].production * buildings[15].count * buildings[15].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[15].production * buildings[15].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[15].production) +" per epiphany center)</span><br>";
		stats_string += "Epiphany Centers Owned: <span style='color:#ff8300;'>" + buildings[15].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(15) + "</span><br>";
		stats_string += "Next Epiphany: <span style='color:#1fe1ff;'>" + Math.floor(this.vars.epiphany_time) + "s</span><br>";
		stats_string += "Total Epiphanies: <span style='color:#1fe1ff;'>" + this.vars.total_epiphanies + "</span><br>";
		$("#stats_help").html(stats_string); 	
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[15].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[15].upgrades[i], 9, 14);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	epiphany_minigame.update = function (dt) {
		this.vars.epiphany_time -= dt;
		this.vars.epiphany_duration -= dt;
		
		if (this.vars.epiphany_time <= 0) {
			this.vars.epiphany_time = this.vars.epiphany_max_time;
			this.vars.epiphany_target = this.vars.epiphany_target_next;
			this.vars.total_epiphanies += 1;
			buildings[15].stats["Total Epiphanies"] = this.vars.total_epiphanies;
			this.vars.epiphany_target_next = Math.floor(Math.random() * 14);
			this.vars.epiphany_duration = 30;
			
			UPDATE_BUILDINGS = true;
			
			if (this.vars.total_epiphanies >= 20) {upgrades[256].makeAvailable();}
			if (this.vars.total_epiphanies >= 50) {upgrades[257].makeAvailable();}
			if (this.vars.total_epiphanies >= 100) {upgrades[258].makeAvailable();}
			if (this.vars.total_epiphanies >= 200) {upgrades[259].makeAvailable();}
			if (this.vars.total_epiphanies >= 500) {upgrades[260].makeAvailable();}
			if (this.vars.total_epiphanies >= 1000) {upgrades[261].makeAvailable();}
			if (this.vars.total_epiphanies >= 2000) {upgrades[262].makeAvailable();}
			
			if (upgrades[256].bought) {this.vars.epiphany_time -= 30}
		}
		
		if (this.vars.epiphany_duration <= 0) {
			this.vars.epiphany_duration = 30;
			this.vars.epiphany_target = -1;
			
			UPDATE_BUILDINGS = true;
		}
	}
	
	var merchant_minigame = new Minigame();
	
	merchant_minigame.vars = {
		package_time: 300,	
		package_max_time: 300,
		package_bonus: Math.floor(Math.random() * 14),
		total_packages: 0,
		package_delievered: false,
	}
	merchant_minigame.upgrades = [
		[263, function () {return true;}, "Unlocks once 20 deliveries have occurred."],
		[264, function () {return true;}, "Unlocks once 50 deliveries have occurred."],
		[265, function () {return true;}, "Unlocks once 100 deliveries have occurred."],
		[266, function () {return true;}, "Unlocks once 200 deliveries have occurred."],
		[267, function () {return true;}, "Unlocks once 500 deliveries have occurred."],
		[268, function () {return true;}, "Unlocks once 1000 deliveries have occurred."],
		[269, function () {return true;}, "Unlocks once 2000 deliveries have occurred."],
	];
	merchant_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAutomation(16));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[16].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[16].count + " " + buildings[16].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[16].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[16].production * buildings[16].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var merchant_display = $(document.createElement("span"));
		merchant_display.attr("id", "merchant_display").attr("style", "font-size:25px;color:#c70000;").html("Next Delivery: " + Math.round(this.vars.package_time) + "s");
		
		minigame_container.append(merchant_display);
		
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	merchant_minigame.updateHTML = function () {
		var target = "";
		if (upgrades[264].bought) {
			target = "<br>Next Target: " + buildings[this.vars.package_bonus].tab_name;
		}
		$("#merchant_display").html("Next Delivery: " + Math.round(this.vars.package_time) + "s" + target);
		updateBuildingExplanation(16);
	}
	merchant_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Merchant");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Once every 5 minutes advances a random tier one or tier two building forward 10 minutes."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[16].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[16].upgrades[i], 9, 22);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	merchant_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[16].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[16].production * buildings[16].count * buildings[16].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[16].production * buildings[16].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[16].production) +" per merchant)</span><br>";
		stats_string += "Merchants Owned: <span style='color:#ff8300;'>" + buildings[16].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(16) + "</span><br>";
		stats_string += "Total Packages: <span style='color:#e80000;'>" + this.vars.total_packages + "</span><br>";
		$("#stats_help").html(stats_string); 	
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[16].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[16].upgrades[i], 9, 22);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	merchant_minigame.update = function (dt) {
		this.vars.package_time -= dt;
		
		if (this.vars.package_time <= 0) {
			this.vars.package_time = this.vars.package_max_time;
			this.vars.total_packages += 1;
			this.vars.package_delievered = false;
			buildings[16].stats["Total Packages"] = minigames[16].vars.total_packages;
			
			if (upgrades[263].bought) {this.vars.package_time -= 30}
			if (upgrades[265].bought) {this.vars.package_time -= 30}
	
			if (this.vars.total_packages >= 20) {upgrades[263].makeAvailable();}
			if (this.vars.total_packages >= 50) {upgrades[264].makeAvailable();}
			if (this.vars.total_packages >= 100) {upgrades[265].makeAvailable();}
			if (this.vars.total_packages >= 200) {upgrades[266].makeAvailable();}
			if (this.vars.total_packages >= 500) {upgrades[267].makeAvailable();}
			if (this.vars.total_packages >= 1000) {upgrades[268].makeAvailable();}
			if (this.vars.total_packages >= 2000) {upgrades[269].makeAvailable();}
			$("#merchant_animation").remove();
		}
		
		if (this.vars.package_time <= 6 && this.vars.package_time > 0) {
			if (this.vars.package_time < 2 && !this.vars.package_delievered) {
				packageDelivery();
				this.vars.package_delievered = true;
			}
			
			if (!($("#merchant_animation").length)) {
				var ani = $(document.createElement("img"));
				ani.attr("id", "merchant_animation");
				ani.attr("src", "images/building_icon_trading.png");
				ani.attr("style", "position:absolute;");
				ani.css("left", $(window).width()/2 - $(ani).width()/2 - 108 + "px");
				ani.css("top", $(window).height() - ($(window).height() / this.vars.package_time) + 60 + "px");
				
				$("body").append(ani);
			} else {
				$("#merchant_animation").css("top", $(window).height() - ($(window).height() / this.vars.package_time) + 60 + "px");
			}
		}
	}
	
    var warp_minigame = new Minigame();
	
	warp_minigame.vars = {
		warp_charges: 3,
		warp_max_charges: 10,
		warp_activations: 0,
		warp_time: 180,
		warp_max_time: 300,
	}
	warp_minigame.upgrades = [
		[270, function () {return true;}, "Unlocks once you warp forward 20 times."],
		[271, function () {return true;}, "Unlocks once you warp forward 50 times."],
		[272, function () {return true;}, "Unlocks once you warp forward 100 times."],
		[273, function () {return true;}, "Unlocks once you warp forward 200 times."],
		[274, function () {return true;}, "Unlocks once you warp forward 500 times."],
		[275, function () {return true;}, "Unlocks once you warp forward 1000 times."],
		[276, function () {return true;}, "Unlocks once you warp forward 2000 times."],
	];
	warp_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAutomation(17));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[17].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[17].count + " " + buildings[17].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[17].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[17].production * buildings[17].count) + "</span>.");
        
        minigame_container.append(explanation);
	
		var warp_icon = $(document.createElement("img"));
		warp_icon.attr("src", "images/building_icon_warp.png").attr("style", "display:inline;cursor:pointer");
		warp_icon.attr("onclick", "warp();").attr("onmouseover","tooltip(this, 0, 12, 'Warp Forward', 'Instantly grants 30 seconds worth of production <span style=\"color:#00db0a;\">('+fancyNumber(PRODUCTION * 30)+')</span>.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')").attr("onmouseout", "hideTooltip();");
		
		minigame_container.append(warp_icon);
		
		var warp_display = $(document.createElement("span"));
		warp_display.attr("id", "warp_display").attr("style", "font-size:25px;color:#0093B0 ;position:relative;top:-26px;left:5px;").html("Warps: " + this.vars.warp_charges + "/" + this.vars.warp_max_charges + " (" + Math.round(this.vars.warp_time) + "s)");
		
		minigame_container.append(warp_display);
			
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	warp_minigame.updateHTML = function () {
		$("#warp_display").html("Warps: " + this.vars.warp_charges + "/" + this.vars.warp_max_charges + " (" + Math.round(this.vars.warp_time) + "s)");
        updateBuildingExplanation(17);
	}
	warp_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Warp");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Warp facilities grant the ability to grant 30 seconds worth of production instantly. This effect is stored once every 3 minutes, and stored up to 10 times. This 30 gain will not effect temporary bonuses or any other time based effects."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[17].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[17].upgrades[i], 8, 10);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	warp_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[17].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[17].production * buildings[7].count * buildings[7].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[17].production * buildings[7].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[17].production) +" per warp facility)</span><br>";
		stats_string += "Warp Facilities Owned: <span style='color:#ff8300;'>" + buildings[17].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(17) + "</span><br>";
		stats_string += "Warps: <span style='color:#87E2F5;'>" + Math.round(this.vars.warp_charges) + "/" + minigames[17].vars.warp_max_charges + "</span> <span style='color:#4A59FF;'>(" + Math.round(this.vars.warp_time) + "s)</span><br>";
		stats_string += "Warps Activated: <span style='color:#87E2F5;'>" + minigames[17].vars.warp_activations + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[17].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[17].upgrades[i], 8, 10);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	warp_minigame.update = function (dt) {

	if (upgrades[270].bought) {minigames[17].vars.warp_max_charges = 15}
	if (upgrades[272].bought) {minigames[17].vars.warp_max_time = 275}
	
		if (this.vars.warp_charges < this.vars.warp_max_charges) {
			this.vars.warp_time -= dt;
		}
		
		if (this.vars.warp_time <= 0) {
			this.vars.warp_time += this.vars.warp_max_time;
			this.vars.warp_charges += 1;
			
			if (this.vars.warp_charges > this.vars.warp_max_charges) {
				this.vars.warp_charges = this.vars.warp_max_charges;
			}
		}
	}
	
    var stellar_minigame = new Minigame();
	
	stellar_minigame.vars = {
		max_production: 0,
	}
	stellar_minigame.upgrades = [
		[277, function () {return true;}, "Unlocks once you buy 10 stellar factories."],
		[278, function () {return true;}, "Unlocks once you buy 25 stellar factories."],
		[279, function () {return true;}, "Unlocks once you buy 50 stellar factories."],
		[280, function () {return true;}, "Unlocks once you buy 75 stellar factories."],
	];
	stellar_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAutomation(18));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[18].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[18].count + " " + buildings[18].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[17].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[18].production * buildings[18].count) + "</span>.");
        
        minigame_container.append(explanation);
			
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
	}
	stellar_minigame.updateHTML = function () {
        updateBuildingExplanation(18);
	}
	stellar_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Stellar<br>Factory");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Stellar Factories&apos; production will not decrease, even when temporary bonuses wear off."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[18].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[18].upgrades[i], 7, 25);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	stellar_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[18].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[18].production * buildings[18].count * buildings[18].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[18].production * buildings[18].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[18].production) +" per stellar factory)</span><br>";
		stats_string += "Stellar Factories Owned: <span style='color:#ff8300;'>" + buildings[18].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(18) + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[18].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[18].upgrades[i], 7, 25);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	stellar_minigame.update = function (dt) {
	}
	
    var temporal_minigame = new Minigame();
	
	temporal_minigame.vars = {
		active_effects: [], //0 bottle, 1 fast forward, 2 clicks, 3 lethargy, 4 endless, 5 experience
		max_active_effects: 2,
	}
	temporal_minigame.upgrades = [
		[281, function () {return true;}, "Unlocks once you buy 10 temporal research labs."],
		[282, function () {return true;}, "Unlocks once you buy 25 temporal research labs."],
		[283, function () {return true;}, "Unlocks once you buy 50 temporal research labs."],
		[284, function () {return true;}, "Unlocks once you buy 75 temporal research labs."],
		[285, function () {return true;}, "Unlocks once you buy 100 temporal research labs."],
		[286, function () {return true;}, "Unlocks once you buy 125 temporal research labs."],
		[287, function () {return true;}, "Unlocks once you buy 150 temporal research labs."],
	];
	temporal_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAutomation(19));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[18].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[19].count + " " + buildings[19].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[19].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[19].production * buildings[19].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var temporal_display = $(document.createElement("span"));
			temporal_display.attr("id", "temporal_display").attr("style", "font-size:25px;color:#006e6e ;position:relative;top:-26px;left:5px;").html("Maximum Effects: " + this.vars.max_active_effects);
		
		var temporal_bottle = $(document.createElement("img"));
			temporal_bottle.attr("src", "images/temporal_bottle.png").attr("class", "temporal").attr("id", "temporal_0").attr("width", "64");
			temporal_bottle.attr("onclick", "toggleTemporal(0);");
			temporal_bottle.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Time in a bottle', 'Toggle to have time run at 1% of its normal rate, and have 1.2 seconds worth of time granted each real second.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')");
			temporal_bottle.attr("onmouseout", "hideTooltip()");		
			
		var temporal_fast_forward = $(document.createElement("img"));
			temporal_fast_forward.attr("src", "images/temporal_fast_forward.png").attr("class", "temporal").attr("id", "temporal_1").attr("width", "64");
			temporal_fast_forward.attr("onclick", "toggleTemporal(1);");
			temporal_fast_forward.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Fast Forward', 'Toggle to increase production by 15%.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')");
			temporal_fast_forward.attr("onmouseout", "hideTooltip()");		
			
		var temporal_quick_clicks = $(document.createElement("img"));
			temporal_quick_clicks.attr("src", "images/temporal_click.png").attr("class", "temporal").attr("id", "temporal_2").attr("width", "64");
			temporal_quick_clicks.attr("onclick", "toggleTemporal(2);");
			temporal_quick_clicks.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Quick Clicks', 'Toggle to increase the value from clicking by 10% for each increment of game speed.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')");
			temporal_quick_clicks.attr("onmouseout", "hideTooltip()");		
			
		var temporal_lethargy = $(document.createElement("img"));
			temporal_lethargy.attr("src", "images/temporal_lethargy.png").attr("class", "temporal").attr("id", "temporal_3").attr("width", "64");
			temporal_lethargy.attr("onclick", "toggleTemporal(3);");
			temporal_lethargy.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Lethargy', 'Toggle to have temporary effects last 10% longer for each increment of bonus game speed.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_4.toUpperCase() + ' </span>')");
			temporal_lethargy.attr("onmouseout", "hideTooltip()");		
			
		var temporal_endless = $(document.createElement("img"));
			temporal_endless.attr("src", "images/temporal_endless.png").attr("class", "temporal").attr("id", "temporal_4").attr("width", "64");
			temporal_endless.attr("onclick", "toggleTemporal(4);");
			temporal_endless.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Endless Expedience', 'Toggle to gain one second worth of extra time every 7 seconds.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_5.toUpperCase() + ' </span>')");
			temporal_endless.attr("onmouseout", "hideTooltip()");		
			
		var temporal_experience = $(document.createElement("img"));
			temporal_experience.attr("src", "images/temporal_experience.png").attr("class", "temporal").attr("id", "temporal_5").attr("width", "64");
			temporal_experience.attr("onclick", "toggleTemporal(5);");
			temporal_experience.attr("onmouseover", "tooltip('#'+this.id, 0, 29, 'Quick Experience', 'Toggle to double the rate that assistants gain progress towards the next level.<br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_6.toUpperCase() + ' </span>')");
			temporal_experience.attr("onmouseout", "hideTooltip()");
			
		$(minigame_container).append($(document.createElement("br")));
		$(minigame_container).append($(document.createElement("br")));
		$(minigame_container).append(temporal_display);
		$(minigame_container).append($(document.createElement("br")));
		$(minigame_container).append(temporal_bottle);
		$(minigame_container).append($(document.createTextNode(" ")));
		$(minigame_container).append(temporal_fast_forward);
		$(minigame_container).append($(document.createTextNode(" ")));
		$(minigame_container).append(temporal_quick_clicks);
		$(minigame_container).append($(document.createTextNode(" ")));
		$(minigame_container).append(temporal_lethargy);
		$(minigame_container).append($(document.createTextNode(" ")));
		$(minigame_container).append(temporal_endless);
		$(minigame_container).append($(document.createTextNode(" ")));
		$(minigame_container).append(temporal_experience);
			
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
		updateTemporal();
	}
	temporal_minigame.updateHTML = function () {
        updateBuildingExplanation(19);
	}
	temporal_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Temporal Research<br>Laboratory");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Temporal Research Labs grants the ability to toggle various effects that effect the passage of time."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[19].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[19].upgrades[i], 8, 25);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	temporal_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[19].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[19].production * buildings[19].count * buildings[19].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[19].production * buildings[19].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[19].production) +" per temporal laboratory)</span><br>";
		stats_string += "Temporal Laboratories Owned: <span style='color:#ff8300;'>" + buildings[19].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(19) + "</span><br>";
		$("#stats_help").html(stats_string); 		
		
		var upgrades_string = "";
		
		for (var i = 0; i < minigames[19].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[19].upgrades[i], 8, 25);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	temporal_minigame.update = function (dt) {
		this.vars.max_active_effects = 2 + Math.floor(buildings[19].count * 0.01) + upgrades[282].bought;
	}
	
	var political_minigame = new Minigame();
	
	political_minigame.vars = {
        morale : 100,
        max_morale : 100,
        entertainment_counters : 0,
		petty_counters: 0,
        total_decrees: 0,
	}
	political_minigame.upgrades = [
		[288, function () {return true;}, "Unlocks once 50 decrees have occurred."],
		[289, function () {return true;}, "Unlocks once 100 decrees have occurred."],
		[290, function () {return true;}, "Unlocks once 200 decrees have occurred."],
		[291, function () {return true;}, "Unlocks once 500 decrees have occurred."],
		[292, function () {return true;}, "Unlocks once 1000 decrees have occurred."],
		[293, function () {return true;}, "Unlocks once 2000 decrees have occurred."],
		[294, function () {return true;}, "Unlocks once 5000 decrees have occurred."],
	];
	political_minigame.createHTML = function () {
		$("#building_tab_sidebar").append(htmlAutomation(20));
		
		var minigame_container = $(document.createElement("div"));
        minigame_container.attr("style", "margin-top:40px;margin-left:100px;margin-right:100px;text-align:center;position:relative;");

        var explanation = $(document.createElement("div"));
        explanation.attr("style", "color:black;font-size:18px;").attr("id", "building_explanation");
        explanation.html(buildings[18].explanation + " You own <span style='color:#0091a8;font-weight:bold'>" + buildings[20].count + " " + buildings[20].tab_name + "s </span>that each produce <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[20].production) + " </span>credits every second, for a total of <span style='color:#0091a8;font-weight:bold'>" + fancyNumber(buildings[20].production * buildings[20].count) + "</span>.");
        
        minigame_container.append(explanation);
		
		var political_display = $(document.createElement("span"));
			political_display.attr("id", "political_display").attr("style", "font-size:25px;color:#986500 ;position:relative;top:-26px;left:5px;").html("Morale: " + Math.floor(this.vars.morale) + "/" + this.vars.max_morale);
		
		var decree_entertainment = $(document.createElement("img"));
			decree_entertainment.attr("src", "images/political_decree_entertainment.png").attr("class", "decree").attr("id", "decree_0").attr("width", "64");
			decree_entertainment.attr("onclick", "decree(0);");
			decree_entertainment.attr("onmouseover", "tooltip('#'+this.id, 0, 30, 'Forced Entertainment', 'Permanently increases maximum morale by <span style=\"color:#ffd21f;\">1</span>. <br><span>Cost: 100% of Maximum Morale</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_1.toUpperCase() + ' </span>')");
			decree_entertainment.attr("onmouseout", "hideTooltip()");		
			
		var decree_collection = $(document.createElement("img"));
			decree_collection.attr("src", "images/political_decree_collection.png").attr("class", "decree").attr("id", "decree_1").attr("width", "64");
			decree_collection.attr("onclick", "decree(1);");
			decree_collection.attr("onmouseover", "tooltip('#'+this.id, 0, 30, 'Early Collection', 'Instantly grants <span style=\"color:#ffd21f;\">10</span> seconds worth of production. After a 2 second delay production will be halted for 8 seconds<br><span>Cost: 55 Morale</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_2.toUpperCase() + ' </span>')");
			decree_collection.attr("onmouseout", "hideTooltip()");		
			
		var decree_petty = $(document.createElement("img"));
			decree_petty.attr("src", "images/political_decree_petty.png").attr("class", "decree").attr("id", "decree_2").attr("width", "64");
			decree_petty.attr("onclick", "decree(2);");
			decree_petty.attr("onmouseover", "tooltip('#'+this.id, 0, 30, 'Petty Decree', 'Increases production by a stacking <span style=\"color:#ffd21f;\">1%</span> for 3 seconds<br><span>Cost: 15 Morale</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_3.toUpperCase() + ' </span>')");
			decree_petty.attr("onmouseout", "hideTooltip()");		
			
		var decree_help = $(document.createElement("img"));
			decree_help.attr("src", "images/political_decree_help.png").attr("class", "decree").attr("id", "decree_3").attr("width", "64");
			decree_help.attr("onclick", "decree(3);");
			decree_help.attr("onmouseover", "tooltip('#'+this.id, 0, 30, 'Unwanted Help', 'Increases production by <span style=\"color:#ffd21f;\">25%</span> for 60 seconds<br><span>Cost: 110 Morale</span><br><span style = \"font-size:10px;float:right\";>Hotkey: ' + hotkeys.activate_building_4.toUpperCase() + ' </span>')");
			decree_help.attr("onmouseout", "hideTooltip()");
			
			
		$(minigame_container).append($(document.createElement("br")));
		$(minigame_container).append($(document.createElement("br")));
		$(minigame_container).append(political_display);
		$(minigame_container).append($(document.createElement("br")));
		$(minigame_container).append(decree_entertainment);
		$(minigame_container).append($(document.createTextNode(" ")));		
		$(minigame_container).append(decree_collection);
		$(minigame_container).append($(document.createTextNode(" ")));		
		$(minigame_container).append(decree_petty);
		$(minigame_container).append($(document.createTextNode(" ")));		
		$(minigame_container).append(decree_help);
		$(minigame_container).append($(document.createTextNode(" ")));
			
        $(".building_tab").append(minigame_container);
		
        updateUnlocks();
		updateTemporal();
	}
	political_minigame.updateHTML = function () {
		$("#political_display").html("Morale: " + Math.floor(this.vars.morale) + "/" + this.vars.max_morale);
        updateBuildingExplanation(20);
	}
	political_minigame.createDetails = function () {
        var detail_container = $("#detail_container");
        detail_container.empty();
        detail_container.show();
        
        var title = $(document.createElement("div"));
        
        title.attr("class", "detail_title");
        title.html("Political<br>Center");
        
        var description = $(document.createElement("div"));
        description.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var description_header = $(document.createElement("div"));
            description_header.html("Details (Click To Toggle)");
            description.append(description_header);
            var description_content = $(document.createElement("div"));
            description_content.html("&nbsp;&nbsp;&nbsp;Political centers grant the ability to periodically activate decrees that have a variety of effects."); 
            description_content.css("text-align", "left");
            description_content.toggle();
            description.append(description_content);

        var stats = $(document.createElement("div"));
        stats.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var stats_header = $(document.createElement("div"));
            stats_header.html("Stats (Click To Toggle)");
            stats.append(stats_header);
            var stats_content = $(document.createElement("div"));
            stats_content.attr("id", "stats_help");
            var stats_string = "";
            stats_content.html(stats_string); 
            stats_content.css("text-align", "left");
            stats_content.toggle();
            stats.append(stats_content);
	
		var upgrades_tab = $(document.createElement("div"));
		upgrades_tab.attr("class", "expandable").attr("onclick", "$(this).children(':nth-child(2)').slideToggle('slow')");
            var upgrades_header = $(document.createElement("div"));
            upgrades_header.html("Upgrades (Click To Toggle)");
            upgrades_tab.append(upgrades_header);
            var upgrades_content = $(document.createElement("div"));
            upgrades_content.attr("id", "upgrades_help");
            var upgrades_string = "";
			
			for (var i = 0; i < minigames[20].upgrades.length; i++) {
				upgrades_string += stringUpgrade(minigames[20].upgrades[i], 9, 25);
			}
			
  
            upgrades_content.html(upgrades_string); 
            upgrades_content.css("text-align", "left");
            upgrades_content.toggle();
            upgrades_tab.append(upgrades_content);
        
        var close_button = $(document.createElement("img"));
        close_button.attr("src", "images/button_x.png");
        close_button.attr("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
        close_button.attr("onclick", "$('#detail_container').hide();");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
        
        detail_container.append(title);
        detail_container.append(description);
        detail_container.append(stats);
        detail_container.append(upgrades_tab);
        detail_container.append(close_button);
    };		
	political_minigame.updateDetails = function () {
		var stats_string = "";
		stats_string += "Credits Produced: <span style='color:#00db0a;'>" + fancyNumber(buildings[20].stats["Credits Produced"]) + "</span><br>";
		stats_string += "Total Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[20].production * buildings[19].count * buildings[20].production_multiplier * PRODUCTION_MULTIPLIER) + "/s</span><br>";
		stats_string += "Base Production: <span style='color:#00db0a;'>" + fancyNumber(buildings[20].production * buildings[19].count) + "/s</span><br>&nbsp;&nbsp; <span style='color:#00db0a;'>("+ fancyNumber(buildings[20].production) +" per political center)</span><br>";
		stats_string += "Political Centers Owned: <span style='color:#ff8300;'>" + buildings[20].count + "</span><br>";
		stats_string += "Work Rate: <span style='color:#ff8300;'>" + calcWorkRateTier2(20) + "</span><br>";
		stats_string += "Total Decrees: <span style='color:#ffd21f;'>" + this.vars.total_decrees + "</span><br>";
		$("#stats_help").html(stats_string);

		var upgrades_string = "";

		for (var i = 0; i < minigames[20].upgrades.length; i++) {
			upgrades_string += stringUpgrade(minigames[20].upgrades[i], 9, 25);
		}
		$("#upgrades_help").html(upgrades_string);
	}
	political_minigame.update = function (dt) {
		this.vars.max_morale = 100 + this.vars.entertainment_counters + upgrades[289].bought * 50;
		this.vars.morale += (dt/2 * ((buildings[20].count / 100) + 1)) + (0.1 * dt * upgrades[290].bought);
		
		if (this.vars.morale > this.vars.max_morale) {this.vars.morale = this.vars.max_morale}
		
		if (!buffs[26].active) {this.vars.petty_counters = 0}
	}
	
	minigames.push(cultist_minigame);
    minigames.push(mine_minigame);
    minigames.push(gambler_minigame);
    minigames.push(power_minigame);
    minigames.push(bank_minigame);
    minigames.push(research_minigame);
    minigames.push(factory_minigame);
    minigames.push(bonus_minigame);
    minigames.push(click_minigame);
    minigames.push(cryogenic_minigame);
    minigames.push(alien_minigame);
    minigames.push(computer_minigame);
    minigames.push(acceleration_minigame);
    minigames.push(fluctuation_minigame);
    minigames.push(clone_minigame);
    minigames.push(epiphany_minigame);
    minigames.push(merchant_minigame);
    minigames.push(warp_minigame);
    minigames.push(stellar_minigame);
    minigames.push(temporal_minigame);
    minigames.push(political_minigame);
}
