/**
 * @fileOverview Handles interfacing with Kongregate's services.
 */

//Global variable to track if IAP are enabled
var KONG_ENABLED = true;

//Global object storing the IAP of the user
var kongBuys = {
	autoclickers: 0,
	increased_speed: 0,
	expanded_corruption: false,
	experienced_assistants: false,
	galactic_expansion: false,
}
/** Sends the user's statistics to Kongregate's servers. */
function updateKongScores() {
	if (kongregate) {
		kongregate.stats.submit('Total Clicks', stats.total_clicks);
		kongregate.stats.submit('Extra Seconds Used', stats.total_clicks);
		kongregate.stats.submit('Credits Earned Exponent', Math.floor(Math.log(stats.credits_earned)));
	}
}
/** Displays the tooltip for the Galactic Shop button.
 * @param {element} self - The Galactic Shop element.
 */
function shopTooltip(self) {
	tooltip(self, 2, 2, "Galactic Shop", "Click open the galactic shop to spend kreds.", function () {}, true);
}
/** Request purchase of the specified item.
 * @param {int} item - The id of the item to buy.
 */
function kongPurchase(item) {
	if (kongregate) {
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
		switch (item) {
			case 0: 
				kongregate.mtx.purchaseItems(["hour_time"], handleExtraTimeBuy);
				break;
			case 1:
				kongregate.mtx.purchaseItems(["refill"], handleRefillBuy);
				break;
			case 2:
				if (FUTURE_KARMA_POINTS != KARMA_POINTS) {kongregate.mtx.purchaseItems(["instant_karma"], handleKarmaBuy);}
				else {popupText("No Karma Points<br>To Gain", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);}
				break;
			case 3:
				kongregate.mtx.purchaseItems(["autoclicker"], handleAutoclickerBuy);
				break;
			case 4:
				kongregate.mtx.purchaseItems(["increased_speed"], handleIncreasedSpeedBuy);
				break;
			case 5:
				if (!kongBuys.galactic_expansion) {kongregate.mtx.purchaseItems(["galactic_expansion"], handleGalacticExpansionBuy);}
				else {popupText("Already Bought", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);}
				break;			
			case 6:
				if (!kongBuys.experienced_assistants) {kongregate.mtx.purchaseItems(["experienced_assistants"], handleExperienceAssistantsBuy);}
				else {popupText("Already Bought", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);}
				break;			
			case 7:
				if (!kongBuys.expanded_corruption) {kongregate.mtx.purchaseItems(["expanded_corruption"], handleExpandedCorruptionBuy);}
				else {popupText("Already Bought", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);}
				break;
		}
	}
}
/** Handles the user buying extra time.
 * @param {object} result - A object with the status of the purchase returned by Kongregate.
 */
function handleExtraTimeBuy(result) {
	if (result.success) {
		addClockTicks(3600);
		useItem("hour_time");
		updateShopHTML();
		popupText("+1 Hour", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
	} else {
		console.log("Transaction not completed");
	}
}
/** Handles the user buying a refill.
 * @param {object} result - A object with the status of the purchase returned by Kongregate.
 */
function handleRefillBuy(result) {
	if (result.success) {
		minigames[0].vars.blood = minigames[0].vars.max_blood;
		minigames[1].vars.gold += 60;
		minigames[2].vars.draw_charges = minigames[2].vars.draw_charges_max;
		minigames[2].vars.discard_charges = minigames[2].vars.discard_charges_max;
		minigames[2].vars.peek_charges = minigames[2].vars.peek_charges_max;
		minigames[3].vars.power = minigames[3].vars.max_power;
		if (minigames[4].vars.investing) {minigames[4].vars.investment_time = 1;}
		minigames[5].vars.research_points += 60;
		minigames[8].vars.stored_clicks = minigames[8].vars.max_clicks;
		minigames[10].vars.alien_power = minigames[10].vars.max_power;
		minigames[13].vars.flux_time = 0;
		minigames[14].vars.clone_charges = minigames[14].vars.clone_max_charges;
		minigames[15].vars.epiphany_time = 1;
		minigames[16].vars.package_time = 10;
		minigames[20].vars.morale = minigames[20].vars.max_morale;
		useItem("refill");
		updateShopHTML();
		popupText("Refilled", $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
	} else {
		console.log("Transaction not completed");
	}
}
/** Handles the user buying instant karma.
 * @param {object} result - A object with the status of the purchase returned by Kongregate.
 */
function handleKarmaBuy(result) {
	if (result.success) {
		popupText("+" + FUTURE_KARMA_POINTS - KARMA_POINTS, $("#world_container").offset().left + $("#world_container").width()/2, $("#world_container").offset().top);
		KARMA_POINTS = FUTURE_KARMA_POINTS;
		updateShopHTML();
		useItem("instant_karma");
	} else {
		console.log("Transaction not completed");
	}
}
/** Handles the user buying an autoclicker.
 * @param {object} result - A object with the status of the purchase returned by Kongregate.
 */
function handleAutoclickerBuy(result) {
	if (result.success) {
		kongBuys.autoclickers += 1;
		updateShopHTML();
		//useItem("autoclicker");
	} else {
		console.log("Transaction not completed");
	}
}
/** Handles the user buying increased speed.
 * @param {object} result - A object with the status of the purchase returned by Kongregate.
 */
function handleIncreasedSpeedBuy(result) {
	if (result.success) {
		kongBuys.increased_speed += 1;
		updateShopHTML();
	} else {
		console.log("Transaction not completed");
	}
}
/** Handles the user buying galactic expansion.
 * @param {object} result - A object with the status of the purchase returned by Kongregate.
 */
function handleGalacticExpansionBuy(result) {
	if (result.success) {
		kongBuys.galactic_expansion = true;
		updateShopHTML();
	} else {
		console.log("Transaction not complete")
	}
}
/** Handles the user buying experienced assistants.
 * @param {object} result - A object with the status of the purchase returned by Kongregate.
 */
function handleExperienceAssistantsBuy(result) {
	if (result.success) {
		kongBuys.experienced_assistants = true;
		for (var i = 0; i < assistants.length; i++) {
			assistants[i].level += 5;
		}
		updateShopHTML();
	} else {
		console.log("Transaction not complete");
	}
}
/** Handles the user buying expanded corruption.
 * @param {object} result - A object with the status of the purchase returned by Kongregate.
 */
function handleExpandedCorruptionBuy(result) {
	if (result.success) {
		kongBuys.expanded_corruption = true;
		updateShopHTML();
	} else {
		console.log("Transaction not complete");
	}
}
/** Removes the item from the player's account (used for temporary effects such as buying extra time).
 * @param {string} identifier - The name of the item to remove.
 */
function useItem(identifier) {
	var item_removed = false;
	kongregate.mtx.requestUserItemList(null, function (result) {
		if (result.success) {
			for (var i = 0; i < result.data.length; i++) {
				if (item_removed) {continue}
				var item = result.data[i];
				if (item.identifier == identifier) {
					kongregate.mtx.useItemInstance(item.id, function () {itemList()});
					item_removed = true;
				}
			}
		}
	});
}
/** Logs the list of all items that the are in the player's account. */
function itemList() {
	kongregate.mtx.requestUserItemList(null, function (result) {
		console.log("User item list received, success: " + result.success);
			if(result.success) {
				for(var i=0; i < result.data.length; i++) {
					var item = result.data[i];
					console.log(item);
			}
		  }
	});
};
/** Loads all the user's previous purchases. */
function loadPurchases() {
	var late_popup = false;
	if (!$("#offline_popup").is(":visible")) {
		$("#offline_popup").show()
		$("#offline_intro").hide();
		$("#offline_contents").empty();
		late_popup = true;
	} else {
		$("#offline_intro").show();
		$("#offline_contents").show();
	}
	
	var extra_times = 0;
	var autoclickers = 0;
	var increased_speed = 0;
	var refill = false;
	var galactic_expansion = false;
	var expanded_corruption = false;
	var experienced_assistants = false;
	
	if (kongregate) {
		kongregate.mtx.requestUserItemList(null, function (result) {
			if (result.success) {
				for (var i = result.data.length - 1; i >= 0; i--) {
					var item = result.data[i];
					
					if (item.identifier == "hour_time") {item.success = true;item.purchase_id = item.id; handleExtraTimeBuy(item); extra_times += 1;}
					if (item.identifier == "refill") {item.success = true;item.purchase_id = item.id; hanldeRefillBuy(item); refill = true;}
					if (item.identifier == "autoclicker") {autoclickers += 1;}
					if (item.identifier == "increased_speed") {increased_speed += 1;}
					if (item.identifier == "galactic_expansion") {galactic_expansion = true;}
					if (item.identifier == "expanded_corruption") {expanded_corruption = true;}
					if (item.identifier == "experienced_assistants") {experienced_assistants = true;}
				}
				
				if ($("#offline_contents").length) {
					if (extra_times != 0) {$("#offline_contents").append("<br>The " + extra_times + " hour(s) worth of extra time that you bought has been added successfully.")}
					if (refill) {$("#offline_contents").append("<br>The refill that you bought has been added successfully.")}
					/*if (autoclickers > kongBuys.autoclickers) {
						kongBuys.autoclickers = autoclickers;
						$("#offline_contents").append("<br>The " + autoclickers + " autoclickers you bought have been add successfully.");
					}					
					if (increased_speed > kongBuys.increased_speed) {
						kongBuys.increased_speed = increased_speed;
						$("#offline_contents").append("<br>The " + increased_speed + " instances of Increased Speed you bought have been added successfully.");
					}
					
					if (galactic_expansion && !kongBuys.galactic_expansion) {
						kongBuys.galactic_expansion = true;
						$("#offline_contents").append("<br>The Galactic Expansion that you bought has been added successfully.");
					}
					
					if (expanded_corruption && !kongBuys.expanded_corruption) {
						kongBuys.expanded_corruption = true;
						$("#offline_contents").append("<br>The Expanded Corruption that you bought has been added successfully.");
					}					
					
					if (experienced_assistants && !kongBuys.experienced_assistants) {
						kongBuys.experienced_assistants = true;
						$("#offline_contents").append("<br>The Experienced Assistants that you bought has been added successfully.");
					}*/
					var downgrade = false;
					
					if (kongBuys.autoclickers > autoclickers || kongBuys.increased_speed > increased_speed || (kongBuys.galactic_expansion && !galactic_expansion) || (kongBuys.expanded_corruption && !expanded_corruption) || (kongBuys.experienced_assistants && !experienced_assistants)) {
						downgrade = true;
					}
					
					kongBuys.autoclickers = autoclickers;
					kongBuys.increased_speed = increased_speed;
					kongBuys.galactic_expansion = galactic_expansion;
					kongBuys.expanded_corruption = expanded_corruption;
					kongBuys.experienced_assistants = experienced_assistants;
					
					var purchase_string = "";
					if (autoclickers || increased_speed || galactic_expansion || expanded_corruption || experienced_assistants) {purchase_string += "Your purchases ("}
					if (kongBuys.autoclickers > 0) {purchase_string += autoclickers + " Autoclickers, "}
					if (kongBuys.increased_speed > 0) {purchase_string += "+" + increased_speed + " Max Speed, "}
					if (galactic_expansion) {purchase_string += "Galactic Expansion, "}
					if (expanded_corruption) {purchase_string += "Expanded Corruption, "}
					if (experienced_assistants) {purchase_string += "Experienced Assistants, "}
					if (autoclickers || increased_speed || galactic_expansion || expanded_corruption || experienced_assistants) {purchase_string = purchase_string.substring(0, purchase_string.length - 2); purchase_string += ") have been loaded."}
					
					$("#offline_contents").append("<br>" + purchase_string)
					
					if (downgrade) {
						$("#offline_contents").append("<br>You previous purchases were not loaded. Please log in to the account used to purchase these bonuses if you would like to recieve them.")
					}
					
					if (!downgrade && extra_times == 0 && !refill && purchase_string == "" && late_popup) {$("#offline_popup").hide()}
					$("#offline_login").hide();
				}
			  } else {
				  $("#offline_contents").append("<br><span id='offline_login'>Note: you are not logged in, please <span style='text-decoration: underline; cursor: pointer' onclick = 'kongregate.services.showRegistrationBox();'>Log In</span> to get any account specific items you may have.</span>");
				  
					kongBuys.autoclickers = 0;
					kongBuys.increased_speed = 0;
					kongBuys.galactic_expansion = false;
					kongBuys.expanded_corruption = false;
					kongBuys.experienced_assistants = false;
			  }
		});
	}
}
/** Opens the Galactic Shop. */
function openShop() {
	$("#kong_shop").remove();
		
	var background = $(document.createElement("div"));
		background.attr("class", "kong_shop");
		background.attr("id", "kong_shop");
		background.css("border", "3px solid black");
		background.css("border-radius", "10px");
		background.css("text-align", "center");
		background.on("click", function () {MENU_CLOSE = false;});
		
	var close_button = $(document.createElement("img"));
		close_button.attr("src", "images/button_x.png").attr("height", "48").attr("width", "48");
		close_button.attr("onclick", "$('#kong_shop').remove();");
		close_button.attr("style", "position:absolute;right:0px;top:0px;cursor:pointer");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
		
	var title = $(document.createElement("div"));
		title.html("Galactic Shop");
		title.css("font-size", "180%");
		//title.css("color", "black");
		//title.css("text-shadow", "0px 0px 1px #AAAAAA");
		title.attr("class", "detail_title");

	var content = $(document.createElement("div"));
	content.attr("id", "kong_shop_content");
	content.css("font-weight", "bold");

	background.append(close_button);
	background.append(title);
	background.append(document.createElement("br"));
	background.append(content);
	background.append(document.createElement("br"));
	background.append(document.createElement("br"));
	
	$(document.body).append(background);
	
	updateShopHTML();
}
/** Updates the Galactic Shop. */
function updateShopHTML() {
	var content = $("#kong_shop_content");
	content.empty();
	
	var galactic_container = $(document.createElement("div"));
		galactic_container.attr("class", "kong_container");

		var galactic_icon = $(document.createElement("img"));
			galactic_icon.attr("src", "images/kong_galactic_expansion.png");
		var galactic_text = $(document.createElement("div"));
			galactic_text.html("<span>Galactic Expansion</span><br>Increases production by 50%, building workrate by 25%, bonus duration by 10%, and offline production by 5%.<br>Cost: 50 Creds<br><br>");
		var galactic_button = $(document.createElement("span"));
			if (kongBuys.galactic_expansion) {galactic_button.html("Bought")} else {galactic_button.html("Buy")}
			galactic_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #fcff1f; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#fcff1f, #ff9130); margin: 8px;");
			galactic_button.attr("class", "gambler_button").attr("id","galactic_button");
			if (!kongBuys.galactic_expansion) {galactic_button.attr("onclick", "kongPurchase(5)");}
	
	galactic_container.append(galactic_icon);
	galactic_container.append(galactic_text);
	galactic_container.append(galactic_button);
		
	content.append(galactic_container);	
	
	var experience_container = $(document.createElement("div"));
		experience_container.attr("class", "kong_container");

		var experience_icon = $(document.createElement("img"));
			experience_icon.attr("src", "images/kong_experienced_assistants.png");
		var experience_text = $(document.createElement("div"));
			experience_text.html("<span>Experienced Assistants</span><br>+5 assistant level, doubles the rate that assistants level up, and abilities will recharge 25% faster.<br>Cost: 40 Kreds<br><br>");
		var experience_button = $(document.createElement("span"));
			if (kongBuys.experienced_assistants) {experience_button.html("Bought")} else {experience_button.html("Buy")}
			experience_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #fcff1f; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#fcff1f, #ff9130); margin: 8px;");
			experience_button.attr("class", "gambler_button").attr("id","experience_button");
			if (!kongBuys.experienced_assistants) {experience_button.attr("onclick", "kongPurchase(6)");}
	
	experience_container.append(experience_icon);
	experience_container.append(experience_text);
	experience_container.append(experience_button);
		
	content.append(experience_container);	
	
	var corrupt_container = $(document.createElement("div"));
		corrupt_container.attr("class", "kong_container");

		var corrupt_icon = $(document.createElement("img"));
			corrupt_icon.attr("src", "images/kong_expanded_corruption.png");
		var corrupt_text = $(document.createElement("div"));
			corrupt_text.html("<span>Expanded Corruption</span><br>Double the production bad seeds, and doubles the rate that bad seeds are generated.<br><br>Cost: 40 Kreds<br><br>");
		var corrupt_button = $(document.createElement("span"));
			if (kongBuys.expanded_corruption) {corrupt_button.html("Bought")} else {corrupt_button.html("Buy")}
			corrupt_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #fcff1f; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#fcff1f, #ff9130); margin: 8px;");
			corrupt_button.attr("class", "gambler_button").attr("id","corrupt_button");
			if (!kongBuys.expanded_corruption) {corrupt_button.attr("onclick", "kongPurchase(7)");}
	
	corrupt_container.append(corrupt_icon);
	corrupt_container.append(corrupt_text);
	corrupt_container.append(corrupt_button);
		
	content.append(corrupt_container);	
	
	var autoclicker_container = $(document.createElement("div"));
		autoclicker_container.attr("class", "kong_container");

		var autoclicker_icon = $(document.createElement("img"));
			autoclicker_icon.attr("src", "images/kong_autoclicker.png");
		var autoclicker_text = $(document.createElement("div"));
			autoclicker_text.html("<span>Autoclicker</span><br>Automatically clicks a stacking 1 time per second<br>Owned: "+kongBuys.autoclickers+".<br><br>Cost: 25 Kreds<br><br>");
		var autoclicker_button = $(document.createElement("span"));
			autoclicker_button.html("Buy")
			autoclicker_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #fcff1f; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#fcff1f, #ff9130); margin: 8px;");
			autoclicker_button.attr("class", "gambler_button").attr("id","autoclicker_button");
			autoclicker_button.attr("onclick", "kongPurchase(3)");
	
	autoclicker_container.append(autoclicker_icon);
	autoclicker_container.append(autoclicker_text);
	autoclicker_container.append(autoclicker_button);
		
	content.append(autoclicker_container);	
	
	var speed_container = $(document.createElement("div"));
		speed_container.attr("class", "kong_container");

		var speed_icon = $(document.createElement("img"));
			speed_icon.attr("src", "images/kong_increased_speed.png");
		var speed_text = $(document.createElement("div"));
			speed_text.html("<span>Increased Speed</span><br>Increases maximum game speed by 1<br><br>Owned: "+kongBuys.increased_speed+".<br><br>Cost: 15 Kreds<br><br>");
		var speed_button = $(document.createElement("span"));
			speed_button.html("Buy")
			speed_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #fcff1f; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#fcff1f, #ff9130); margin: 8px;");
			speed_button.attr("class", "gambler_button").attr("id","increased_speed_button");
			speed_button.attr("onclick", "kongPurchase(4)");
	
	speed_container.append(speed_icon);
	speed_container.append(speed_text);
	speed_container.append(speed_button);
		
	content.append(speed_container);	
	
	var hour_container = $(document.createElement("div"));
		hour_container.attr("class", "kong_container");

		var hour_icon = $(document.createElement("img"));
			hour_icon.attr("src", "images/kong_extra_hour.png");
		var hour_text = $(document.createElement("div"));
			hour_text.html("<span>Extra Hour</span><br><br>Instantly grants 1 hour worth of extra time<br><br><br>Cost: 10 Kreds<br><br>");
		var hour_button = $(document.createElement("span"));
			hour_button.html("Buy")
			hour_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #fcff1f; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#fcff1f, #ff9130); margin: 8px;");
			hour_button.attr("class", "gambler_button").attr("id","extra_hour_button");
			hour_button.attr("onclick", "kongPurchase(0)");
	
	hour_container.append(hour_icon);
	hour_container.append(hour_text);
	hour_container.append(hour_button);
		
	content.append(hour_container);	
	
	var karma_container = $(document.createElement("div"));
		karma_container.attr("class", "kong_container");

		var karma_icon = $(document.createElement("img"));
			karma_icon.attr("src", "images/kong_instant_karma.png");
		var karma_text = $(document.createElement("div"));
			karma_text.html("<span>Instant Karma</span><br>Gain all Karma points that you would get from resetting without losing progress.<br><br>Cost: 10 Kreds<br><br>");
		var karma_button = $(document.createElement("span"));
			karma_button.html("Buy")
			karma_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #fcff1f; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#fcff1f, #ff9130); margin: 8px;");
			karma_button.attr("class", "gambler_button").attr("id","instant_karma_button");
			karma_button.attr("onclick", "kongPurchase(2)");
	
	karma_container.append(karma_icon);
	karma_container.append(karma_text);
	karma_container.append(karma_button);
		
	content.append(karma_container);	
	
	var refill_container = $(document.createElement("div"));
		refill_container.attr("class", "kong_container");

		var refill_icon = $(document.createElement("img"));
			refill_icon.attr("src", "images/kong_refill.png");
		var refill_text = $(document.createElement("div"));
			refill_text.html("<span>Refill</span><br>Instantly refills the currency of each building, grants 60 gold bars, and 60 research points.<br>Cost: 10 Kreds<br><br>");
		var refill_button = $(document.createElement("span"));
			refill_button.html("Buy")
			refill_button.attr("Style", "font-size: 20px; font-weight: 900; color: black; background-color: #fcff1f; border: 3px solid black; border-radius: 4px; padding:5px; background-image: linear-gradient(#fcff1f, #ff9130); margin: 8px;");
			refill_button.attr("class", "gambler_button").attr("id","refill_kong_button");
			refill_button.attr("onclick", "kongPurchase(1)");
	
	refill_container.append(refill_icon);
	refill_container.append(refill_text);
	refill_container.append(refill_button);
		
	content.append(refill_container);
}
/** Opens the menu requesting the user log into kongregate. */
function openLoginMenu() {
	$("#login_popup").remove();
		
	var background = $(document.createElement("div"));
		background.attr("class", "login_popup");
		background.attr("id", "login_popup");
		background.css("border", "3px solid black");
		background.css("border-radius", "10px");
		background.css("text-align", "center");
		background.on("click", function () {MENU_CLOSE = false;});
		
	var close_button = $(document.createElement("img"));
		close_button.attr("src", "images/button_x.png").attr("height", "48").attr("width", "48");
		close_button.attr("onclick", "$('#login_popup').remove();");
		close_button.attr("style", "position:absolute;right:0px;top:0px;cursor:pointer");
		close_button.attr("onmouseover", "$(this).attr('src', 'images/button_x_hover.png')");
		close_button.attr("onmouseout", "$(this).attr('src', 'images/button_x.png')");
		
	var title = $(document.createElement("div"));
		title.html("Login");
		title.css("font-size", "180%");
		title.attr("class", "detail_title");
		
	var login_button = $(document.createElement("button"));
		login_button.html("Login");
		login_button.attr("type", "button");
		login_button.attr("class", "basic_button");
		login_button.attr("onclick", "kongregate.services.showRegistrationBox();$('#login_popup').remove();");	
		
	var closure_button = $(document.createElement("button"));
		closure_button.html("Close");
		closure_button.attr("type", "button");
		closure_button.attr("class", "basic_button");
		closure_button.attr("onclick", "$('#login_popup').remove();");
		
	var content = $(document.createElement("div"));
	content.attr("id", "login_software");
	//content.css("color", "black");
	content.css("font-weight", "bold");
	content.html("Please login or register to Kongregate to have access to the store.")

	background.append(close_button);
	background.append(title);
	background.append(document.createElement("br"));
	background.append(document.createElement("br"));
	background.append(content);
	background.append(document.createElement("br"));
	background.append(document.createElement("br"));
	background.append(login_button);	
	background.append(document.createTextNode("  "));
	background.append(closure_button);
	
	$(document.body).append(background);
}
/** Event triggered when the user logs into kongregate in real time. */
function onKongregateInPageLogin() {
	loadPurchases();
	console.log("Event Fired Successfully")
}
