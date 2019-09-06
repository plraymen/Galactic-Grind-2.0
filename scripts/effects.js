function effectTick() {
	if (settings.effects) {
		updateBuildingEffects();
	}
}

function updateBuildingEffects() {
	if (settings.effects) {
		if (CURRENT_TIER == 1) {
			updateCultistEffects();
			updateMineEffects();
			updateGamblerEffects();
			updatePowerEffects();
			updateBankEffects();
			updateResearchEffects();
		} else if (CURRENT_TIER == 2) {
			updateWarpEffects();
			updateAlienEffects();
			updateComputerEffects();
		}
	}
}

function disableEffects() {
	if (CURRENT_TIER == 1) {
		if (buildings[0].count > 0) {$("#buildingcultist").children().first().attr("src", "images/building_icon_cultist.png");}
		if (buildings[1].count > 0) {$("#buildingmine").children().first().css("filter", "");}
		if (buildings[2].count > 0) {$("#buildinggambler").children().first().attr("src", "images/building_icon_gambler.png");}
		if (buildings[3].count > 0) {$("#buildingpower_plant").children().first().css("filter", "");}
		if (buildings[4].count > 0) {$("#buildingbank").children().first().attr("src", "images/building_icon_bank.png");}
		if (buildings[5].count > 0) {$("#buildingresearch_center").children().first().attr("src", "images/building_icon_research.png");}
	} else if (CURRENT_TIER == 2) {
		if (buildings[7].count > 0) {$("#buildingwarp_facility").children().first().css("filter", "");}
		if (buildings[10].count > 0) {$("#buildingalien_lab").children().first().css("filter", "");}
		if (buildings[11].count > 0) {$("#buildingmainframe_computer").children().first().attr("src", "images/building_icon_computer.png");}
	}
}

function updateCultistEffects() {
	if (buildings[0].count > 0) {	
		var percentage = minigames[0].vars.blood / minigames[0].vars.max_blood;
		
		if (percentage < 0) {
			$("#buildingcultist").children().first().attr("src", "images/effect_icon_cultist_5.png");
		}		
		else if (percentage < 0.25) {
			$("#buildingcultist").children().first().attr("src", "images/effect_icon_cultist_1.png");
		}
		else if (percentage >= 0.25 && percentage < 0.50) {
			$("#buildingcultist").children().first().attr("src", "images/effect_icon_cultist_2.png");
		}	
		else if (percentage >= 0.50 && percentage < 0.75) {
			$("#buildingcultist").children().first().attr("src", "images/effect_icon_cultist_3.png");
		}	
		else if (percentage >= 0.75) {
			$("#buildingcultist").children().first().attr("src", "images/effect_icon_cultist_4.png");
		}
	}
}

function updateMineEffects() {
	if (buildings[1].count > 0) {
		var radius = Math.log(minigames[1].vars.gold + 1);
		$("#buildingmine").children().first().css("filter", "drop-shadow(0px 0px " + radius + "px #f5d130)");
	}
}

function updateGamblerEffects() {
	if (buildings[2].count > 0) {
		var percentage = minigames[2].vars.draw_charges / minigames[2].vars.draw_charges_max;
		
		if (percentage <= .50) {
			$("#buildinggambler").children().first().attr("src", "images/effect_icon_gambler_1.png");
		}
		else if (percentage < 1) {
			$("#buildinggambler").children().first().attr("src", "images/effect_icon_gambler_2.png");
		}	
		else if (percentage >= 1) {
			$("#buildinggambler").children().first().attr("src", "images/effect_icon_gambler_3.png");
		}	
	}
}

function updatePowerEffects() {
	if (buildings[3].count > 0) {
		var percentage = Math.log(minigames[3].vars.power / minigames[3].vars.max_power * 2 + 1);
		$("#buildingpower_plant").children().first().css("filter", "drop-shadow(0px 0px " + percentage * 2 + "px #53f9ff)");
	}
}

function updateBankEffects() {
	if (buildings[4].count > 0) {
		if (!minigames[4].vars.investing) {
			$("#buildingbank").children().first().attr("src", "images/effect_icon_bank_1.png");
		}
		else {
			$("#buildingbank").children().first().attr("src", "images/effect_icon_bank_2.png");
		}	
	}
}

function updateResearchEffects() {
	if (buildings[5].count > 0) {
		var research_points = minigames[5].vars.research_points;
		
		if (research_points == 0) {
			$("#buildingresearch_center").children().first().attr("src", "images/effect_icon_research_1.png");
		}
		else if (research_points <= 5) {
			$("#buildingresearch_center").children().first().attr("src", "images/effect_icon_research_2.png");
		}	
		else if (research_points <= 20) {
			$("#buildingresearch_center").children().first().attr("src", "images/effect_icon_research_3.png");
		}
		else if (research_points <= 50) {
			$("#buildingresearch_center").children().first().attr("src", "images/effect_icon_research_4.png");
		}		
		else {
			$("#buildingresearch_center").children().first().attr("src", "images/effect_icon_research_5.png");
		}
	}	
}

function updateWarpEffects() {
	if (buildings[7].count > 0) {
		var percentage = minigames[7].vars.warp_charges * 0.75;
		$("#buildingwarp_facility").children().first().css("filter", "drop-shadow(0px 0px " + percentage + "px #75ffff)");
	}
}

function updateAlienEffects() {
	if (buildings[10].count > 0) {
		var percentage = Math.log(minigames[10].vars.alien_power / minigames[10].vars.max_power * 2 + 1);
		$("#buildingalien_lab").children().first().css("filter", "drop-shadow(0px 0px " + percentage * 2 + "px #ffffb0)");
	}
}

function updateComputerEffects() {
	if (buildings[11].count > 0) {
		if (minigames[11].vars.program_1 || minigames[11].vars.program_2 || minigames[11].vars.program_3) {
			$("#buildingmainframe_computer").children().first().attr("src", "images/effect_icon_computer_1.png");
		} else {
			$("#buildingmainframe_computer").children().first().attr("src", "images/effect_icon_computer_2.png");
		}
	}
}