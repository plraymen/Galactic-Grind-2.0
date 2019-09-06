var unlocks = [];

function unlock(element, condition, pip) {
    this.element = element;
    this.condition = condition;
    this.pip = pip || function () {};
    this.unlocked = false;
    this.update = function () {
		if (this.unlocked) {return;}
		if (!(this.element.constructor === Array)) {
			if (this.condition() && ($("#"+this.element).length != 0)) {
				$("#"+this.element).show();
				setTimeout(this.pip, 150);
				this.unlocked = true;
			} else {
				$("#"+this.element).hide();
			}
		} else {
			if (this.condition()) {
				for (var i = 0; i < element.length; i++) {
					if ($("#"+this.element[i]).length != 0) {
						var ele = this.element[i];
						var temp_pip = function () {createPip($("#"+ele))};
						setTimeout(temp_pip, 50);
						this.unlocked = true;
					}
				}
			} else {
				for (var i = 0; i < element.length; i++) {
					$("#"+this.element[i]).hide();
				}
			}
		}
    };
}

function updateUnlocks() {
    len = unlocks.length;
    for (var i = 0; i < len; i++) {
        unlocks[i].update();
    }
}
function updateCreditUnlocks() {
	if (CREDITS >= 2000000) {upgrades[23].makeAvailable();}
	if (CREDITS >= 5000) {upgrades[72].makeAvailable();}
	if (CREDITS >= 500000) {upgrades[73].makeAvailable();}
	if (CREDITS >= 50000000) {upgrades[74].makeAvailable();}
	if (CREDITS >= 5000000000) {upgrades[75].makeAvailable();}
	if (CREDITS >= 3000) {upgrades[76].makeAvailable();}
	if (CREDITS >= 25000) {upgrades[77].makeAvailable();}
	if (CREDITS >= 7500000) {upgrades[78].makeAvailable();}
	if (CREDITS >= 750000000) {upgrades[79].makeAvailable();}
	
	if (CREDITS >= 100000000000) {upgrades[296].makeAvailable();}
	if (CREDITS >= 1000000000000) {upgrades[297].makeAvailable();}
	if (CREDITS >= 10000000000000) {upgrades[298].makeAvailable();}
	if (CREDITS >= 100000000000000) {upgrades[299].makeAvailable();}
	
	if (CREDITS >= 100000000) {upgrades[94].makeAvailable();}
	if (CREDITS >= 25000000000) {upgrades[95].makeAvailable();}
	if (CREDITS >= 1000000000000) {upgrades[96].makeAvailable();}
	if (CREDITS >= 100000000000) {upgrades[97].makeAvailable();}
	if (CREDITS >= 10000000000000) {upgrades[98].makeAvailable();}
	if (CREDITS >= 50000000000000) {upgrades[106].makeAvailable();}
	if (CREDITS >= 7500000000000) {upgrades[205].makeAvailable();}
	if (CREDITS >= 100000000000000) {upgrades[206].makeAvailable();}
	if (CREDITS >= 500000000000000000) {upgrades[207].makeAvailable();}
	if (CREDITS >= 5000000000000000000000) {upgrades[208].makeAvailable();}
	if (CREDITS >= 50000000000000000000000000) {upgrades[209].makeAvailable();}
	if (CREDITS >= 500000000000000000000000000000) {upgrades[210].makeAvailable();}
	
	if (CREDITS >= 10000000000000000000 && buildings[7].count != 0) {upgrades[211].makeAvailable();}
	if (CREDITS >= 10000000000000000000 && buildings[8].count != 0) {upgrades[212].makeAvailable();}
	if (CREDITS >= 10000000000000000000 && buildings[9].count != 0) {upgrades[213].makeAvailable();}
	if (CREDITS >= 10000000000000000000 && buildings[10].count != 0) {upgrades[214].makeAvailable();}
	if (CREDITS >= 10000000000000000000 && buildings[11].count != 0) {upgrades[215].makeAvailable();}
	if (CREDITS >= 10000000000000000000 && buildings[12].count != 0) {upgrades[216].makeAvailable();}
	if (CREDITS >= 10000000000000000000 && buildings[13].count != 0) {upgrades[217].makeAvailable();}	
	
	if (CREDITS >= 750000000000000000000000000 && buildings[7].count != 0) {upgrades[300].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000 && buildings[8].count != 0) {upgrades[301].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000 && buildings[9].count != 0) {upgrades[302].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000 && buildings[10].count != 0) {upgrades[303].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000 && buildings[11].count != 0) {upgrades[304].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000 && buildings[12].count != 0) {upgrades[305].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000 && buildings[13].count != 0) {upgrades[306].makeAvailable();}	
	
	if (CREDITS >= 750000000000000000000000000000 && buildings[7].count != 0) {upgrades[308].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000000 && buildings[8].count != 0) {upgrades[309].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000000 && buildings[9].count != 0) {upgrades[310].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000000 && buildings[10].count != 0) {upgrades[311].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000000 && buildings[11].count != 0) {upgrades[312].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000000 && buildings[12].count != 0) {upgrades[313].makeAvailable();}
	if (CREDITS >= 750000000000000000000000000000 && buildings[13].count != 0) {upgrades[314].makeAvailable();}
	
	if (CREDITS >= 850000000000000000000000000) {upgrades[307].makeAvailable();}
	
	if (CREDITS >= 500000000 && buildings[0].count != 0) {upgrades[80].makeAvailable();}
	if (CREDITS >= 500000000 && buildings[1].count != 0) {upgrades[81].makeAvailable();}
	if (CREDITS >= 500000000 && buildings[2].count != 0) {upgrades[82].makeAvailable();}
	if (CREDITS >= 500000000 && buildings[3].count != 0) {upgrades[83].makeAvailable();}
	if (CREDITS >= 500000000 && buildings[4].count != 0) {upgrades[84].makeAvailable();}
	if (CREDITS >= 500000000 && buildings[5].count != 0) {upgrades[85].makeAvailable();}
	if (CREDITS >= 500000000 && buildings[6].count != 0) {upgrades[86].makeAvailable();}
	if (CREDITS >= 26000000000 && buildings[0].count != 0) {upgrades[87].makeAvailable();}
	if (CREDITS >= 26000000000 && buildings[1].count != 0) {upgrades[88].makeAvailable();}
	if (CREDITS >= 26000000000 && buildings[2].count != 0) {upgrades[89].makeAvailable();}
	if (CREDITS >= 26000000000 && buildings[3].count != 0) {upgrades[90].makeAvailable();}
	if (CREDITS >= 26000000000 && buildings[4].count != 0) {upgrades[91].makeAvailable();}
	if (CREDITS >= 26000000000 && buildings[5].count != 0) {upgrades[92].makeAvailable();}
	if (CREDITS >= 26000000000 && buildings[6].count != 0) {upgrades[93].makeAvailable();}
	
	
	if (CREDITS >= 250000000000) {upgrades[203].makeAvailable();}
	//Reset Upgrade
	if (CREDITS >= 1000000000000000000000000 && !RESET_UNLOCKED) {upgrades[204].makeAvailable();}
	//Challenges Upgrades
	if (CREDITS >= 100000000000000000000 && !CHALLENGES_UNLOCKED && CURRENT_CHALLENGE == -1) {upgrades[295].makeAvailable();}
	
	//Subgames
	if (CREDITS >= 1000000000000000000000 && !subgames[0].unlocked) {upgrades[177].makeAvailable();}
	//Assistants
	if (CREDITS >= 10000000000000) {upgrades[199].makeAvailable();}
	if (CREDITS >= 10000000000000000000000000) {upgrades[200].makeAvailable();}
	if (CREDITS >= 500000000000000000000000000) {upgrades[201].makeAvailable();}
	if (CREDITS >= 10000000000000000000) {upgrades[218].makeAvailable();}
	if (CREDITS >= 500000000000000000000000000000) {upgrades[323].makeAvailable();}
	if (CREDITS >= 2500 && !SWITCHER) {upgrades[324].makeAvailable();}
	//Helping Hands
	//if (CREDITS >= 5000) {upgrades[202].makeAvailable();}
	
	if (CREDITS >= 20 && !upgrades[20].bought) {
		window.setTimeout(function () {tutorial_list[1].trigger();}, 100);
	}
}
function initUnlocks() {
    var game_speed_unlock = new unlock("clock_container", function () {return !!CLOCK_TICKS}, function () {createPip($("#clock_container"));});
    //var ritual_speed_unlock = new unlock("ritual_1", function () {return !!CLOCK_TICKS}, function () {createPip($("#ritual_1"));});
    var ritual_purity_unlock = new unlock("ritual_2", function () {return buildings[0].count >= 55}, function () {createPip($("#ritual_2"));});
    var ritual_soot_unlock = new unlock("ritual_3", function () {return buildings[0].count >= 15}, function () {createPip($("#ritual_3"));});
    var ritual_karma_unlock = new unlock("ritual_4", function () {return buildings[0].count >= 15}, function () {createPip($("#ritual_4"));});
    var gold_unlock = new unlock(["cultist_gold_refill", "gambler_gold_refill", "power_plant_gold_refill", "research_center_gold_refill", "bank_gold_refill"], function () {return buildings[1].count >= 1}, function () {});
    var shuffle = new unlock("shuffle_button", function () {return upgrades[36].bought}, function () {createPip($("#shuffle_button"));});
    var peek = new unlock("peek_button", function () {return upgrades[37].bought}, function () {createPip($("#peek_button"));});
    var overcharge = new unlock(["cultist_overcharge", "mine_overcharge", "gambler_overcharge", "bank_overcharge", "research_center_overcharge", "factory_overcharge"], function () {return buildings[3].count >= 1}, function () {});
    var bank_gold = new unlock(["cash_to_gold", "gold_to_cash"], function () {return buildings[1].count >= 1}, function () {});
    var tier_2_button = new unlock(["button_tier_1", "button_tier_2"], function () {return TIER_2_UNLOCKED}, function () {});
    var aliencharge = new unlock(["warp_aliencharge", "click_aliencharge", "cryogenic_aliencharge", "alien_aliencharge", "computer_aliencharge"], function () {return buildings[10].count >= 1}, function () {});
    var computer_loop = new unlock("computer_loop", function () {return upgrades[154].bought}, function () {createPip($("#computer_loop"));});
	var tier_3_button = new unlock(["button_tier_3"], function () {return TIER_3_UNLOCKED}, function () {});
    var clone = new unlock(["building_clone"], function () {return buildings[14].count >= 1}, function () {});
	var automation = new unlock(["cultist_automation", "mine_automation", "gambler_automation", "power_plant_automation", "bank_automation", "research_center_automation"], function () {return buildings[6].count >= 1}, function () {});
	var challenge_cultist = new unlock("cultist_challenge", function () {return challenges[0].unlocked}, function () {createPip($("#cultist_challenge"));});
	var challenge_mine = new unlock("mine_challenge", function () {return challenges[1].unlocked}, function () {createPip($("#mine_challenge"));});
	var challenge_gambler = new unlock("gambler_challenge", function () {return challenges[2].unlocked}, function () {createPip($("#gambler_challenge"));});
	var challenge_power_plant = new unlock("power_plant_challenge", function () {return challenges[3].unlocked}, function () {createPip($("#power_plant_challenge"));});
	var challenge_bank = new unlock("bank_challenge", function () {return challenges[4].unlocked}, function () {createPip($("#bank_challenge"));});
	var challenge_research_center = new unlock("research_center_challenge", function () {return challenges[5].unlocked}, function () {createPip($("#research_center_challenge"));});
	var challenge_factory = new unlock("factory_challenge", function () {return challenges[6].unlocked}, function () {createPip($("#factory_challenge"));});
    
    unlocks.push(game_speed_unlock); //0
    unlocks.push(ritual_soot_unlock); //1
    unlocks.push(ritual_purity_unlock); //2
    unlocks.push(ritual_karma_unlock); //3
    unlocks.push(gold_unlock); //4
    unlocks.push(shuffle); //5
    unlocks.push(peek); //6
    unlocks.push(overcharge); //7
    unlocks.push(bank_gold); //8
    unlocks.push(tier_2_button); //9
    unlocks.push(aliencharge); //10
    unlocks.push(computer_loop); //11
    unlocks.push(tier_3_button); //12
    unlocks.push(clone); //13
    unlocks.push(automation); //14
    unlocks.push(challenge_cultist); //15
    unlocks.push(challenge_mine); //16
    unlocks.push(challenge_gambler); //17
    unlocks.push(challenge_power_plant); //18
    unlocks.push(challenge_bank); //19
    unlocks.push(challenge_research_center); //20
    unlocks.push(challenge_factory); //21
}
function testTierTwo() {
	if (TIER_1_COUNT >= 7 && !TIER_2_UNLOCKED) {
		TIER_2_UNLOCKED = true;
		$("#button_tier_1").show();
		$("#button_tier_2").show();
	}
}
function testTierThree() {
	if (TIER_2_COUNT >= 7 && !TIER_3_UNLOCKED) {
		TIER_3_UNLOCKED = true;
		$("#button_tier_3").show();
	}
}