/**
 * @fileOverview Handles the creation and logic for temporary bonuses and penalties.
 */

//Global arrays to store bonuses/penalties and building bonuses
var buffs = [];
var building_buffs = [];

/** Represents the temporary bonuses for individual buildings.
 * @constructor
 * @param {string} name - The name of the building buff.
 * @param {int} id - The index of the building buff in the building_buffs array.
 * @param {string} icon - The file path for the icon associated with this buff.
 * @param {function} effect - The effect of the bonus called every tick.
 * @param {int} duration - The length of the bonus in seconds.
 */
function BuildingBuff(name, id, icon, effect, duration) {
    this.name = name;
    this.icon = icon;
    this.effect = effect;
    this.duration = duration;
    this.time = 0;
    this.id = id;
}

var overcharge = new BuildingBuff("overcharge", 0, "images/building_buff_overcharge.png", function() {}, 10);
building_buffs.push(overcharge);

/** Represents the temporary global bonuses/penalties.
 * @constructor
 * @param {string} name - The name of the buff.
 * @param {int} id - The index of the buff in the buffs array.
 * @param {int} x - The x position of the icon on the buffs tile map.
 * @param {int} y - The y position of the icon on the buffs tile map.
 * @param {function} localTooltip - Function that returns the tooltip for the buffs.
 * @param {function} effect - Function is called each tick to in.
 * @param {boolean} stackable - Determines if repeating activations of this buff should result in more time or more stacks.
 */
function Buff(name, id, x, y, localTooltip, effect, stackable, negative) {
    this.name = name;
    this.x = -x*48;
    this.y = -y*48;
    this.localTooltip = localTooltip;
    this.effect = effect;
    this.id = id;
    this.stack_count = 1;
    this.time = 0;
    this.max_time = 0;
	this.negative = negative || false;
    this.active = false;
	this.frozen = false;
	/** Creates and appends the HTML for this buff's icon */
    this.createHTML = function () {
        this.removeHTML();

        var index = buffs.indexOf(this);
        var buff_background = $(document.createElement("div"));
		if (this.frozen) {
			buff_background.attr("style", "height:48px;width:48px;background:url(images/buff_background_frozen.png);").attr("class", "buff_background");
		} else if (!this.negative) {
			buff_background.attr("style", "height:48px;width:48px;background:url(images/buff_background.png);").attr("class", "buff_background");
		} else {
			buff_background.attr("style", "height:48px;width:48px;background:url(images/buff_background_negative.png);").attr("class", "buff_background");			
		}
        buff_background.attr("id", "buff_background_" + this.id);
        buff_background.attr("onmouseover", "buffs[" + index + "].showTooltip()");
        buff_background.attr("onmouseout", "hideTooltip()");
        
        var buff = $(document.createElement("div"));
        buff.attr("style", "top:0px;right:0px;position:absolute;height:48px;width:48px;background:url(images/buff_sheet.png) "+this.x+"px "+this.y+"px;");

		buff_background.off('click').click(
			function () {
				self.toggleFreeze();
				hideTooltip();
			}
		)
		
        var buff_time = $(document.createElement("div"));
	    buff_time.attr("id", "buff_"+this.id);
	    buff_time.attr("style", "position:absolute;left:0px;top:0px;height:48px;width:48px;background-color:#000000;opacity:0.5");
        
        $(buff_background).append(buff);
        $(buff_background).append(buff_time);
        $("#buff_container").append(buff_background);
		var self = this;
    };
	/** Toggle this buff's frozen property, to prevent the buff from being updated in a normal manner. */
	this.toggleFreeze = function () {
		if (buildings[9].count == 0) {return;}
		if (this.id == 26) {return;}

		if (minigames[9].vars.target_buff != buffs.indexOf(this)) {
			for (var i = 0; i < buffs.length; i++) {
				if (buffs[i].frozen) {
					buffs[i].toggleFreeze();
				}
			}
			
			minigames[9].vars.target_buff = buffs.indexOf(this);
			this.frozen = true;
			this.createHTML();
		} else {
			minigames[9].vars.target_buff = null;
			this.frozen = false;
			this.createHTML();
		}
	}
    /** Updates the HTML for this buff's icon. */
	this.updateHTML = function () {
        if (!this.active) {return;}
        var distance = this.time/this.max_time * 48;
        var y = 48 - distance;
        
        $("#buff_"+this.id).attr("style", "border-radius:3px;position:absolute;left:0px;top:"+y+"px;width:48px;height:"+distance+"px;background-color:#000000;opacity:0.5");
    };
	/** Removes the HTML of this buff's icon. */
    this.removeHTML = function () {
        $("#buff_background_" + this.id).remove();
    };
    /** Displays the tooltip for this buff. */
	this.showTooltip = function () {
         tooltip("#buff_background_"+this.id, this.x/48, this.y/48, this.name, this.localTooltip(), this.localTooltip);       
    };
    /** Sets this buff to be active for some time. 
	 *  @param {float} duration - The base length that this buff will stay active.
	 */
	this.activate = function (duration) {
		if (calm && this.id != 6) {return;}
        if (!stackable) {
			var store_count = 0
			if (assistants[0].level >= assistant_levels[3]) {store_count += 1}
			if (assistants[0].level >= assistant_levels[4]) {store_count += 1}
            
			if (!this.negative && stored_bonuses.length >= store_count) {
				angelic_release = true;
			}
			if (assistants[0].unlocked && stored_bonuses_enabled && !angelic_release && store_count > stored_bonuses.length && !this.negative && !(this.id == 17)) {
				stored_bonuses.push([this.id, duration]);
				setTimeout(function () {popupText("Bonus Stored", $("#angelic_assistant_button").offset().left + $("#angelic_assistant_button").width()/2 + 130, $("#angelic_assistant_button").offset().top)}, 1);
			} else {			
				this.createHTML();
				var kong_bonus = 1;
				if (!this.negative && kongBuys.galactic_expansion) {kong_bonus = 1.1}
				this.time += duration * (1 + 0.03 * minigames[5].vars.research_tree[16].bought + 0.002 * minigames[5].vars.research_tree[32].bought + 0.1 * (assistants[5].level > assistant_levels[3])) * kong_bonus;
				if (upgrades[116].bought) {this.time /= 1.05}
				this.active = true;
				if (this.time >= this.max_time) {
				   this.max_time = this.time;
				};
				
				if (minigames[5].vars.research_tree[17].researched) {
					minigames[5].vars.research_time -= 10;
				}	
				
				if (minigames[5].vars.research_tree[29].researched) {addClockTicks(1);}
				if (upgrades[258].bought) {addClockTicks(1);}
				
				if (upgrades[145].bought) {
					minigames[10].vars.alien_power += 5;
				}
				
				if (upgrades[232].bought && !this.negative) {this.time += 1;}						
				if (upgrades[251].bought && !this.negative) {this.time += 1;}				
				if (upgrades[235].bought && this.negative) {this.time -= 1;}
				
				if (angelic_release && !angelic_protection) {
					angelic_protection = true;
					for (var i = stored_bonuses.length - 1; i >= 0; i--) {
						var bonus = stored_bonuses.pop();
						buffs[bonus[0]].activate(bonus[1])
					}
					angelic_release = false;
					angelic_protection = false;
				}
				
				if (assistants[0].unlocked && !this.negative) {assistants[0].xp += 20}
				if (assistants[1].unlocked && this.negative) {assistants[1].xp += 30}
			}
			
			if (assistants[1].unlocked && this.negative && assistants[1].level >= assistant_levels[3] && assistants[1].abilities[3].available()) {
				this.time *= 0.5;
				assistants[1].abilities[3].cd -= 1;
				setTimeout(function () {popupText("Time Reduced", $("#demonic_assistant_button").offset().left + $("#demonic_assistant_button").width()/2 + 130, $("#demonic_assistant_button").offset().top)}, 1);
			}
        }
    };
	/** Updates the buff. 
	 *  @param {float} dt - Time time since the last frame.
	 */
	this.update = function (dt) {
      if (this.active && !this.frozen) {
        this.time -= dt / (1 + (minigames[19].vars.active_effects.includes(3) * (GAME_SPEED - 1) * 0.1));
        if (this.time <= 0) {
            this.time = 0;
            this.max_time = 0;
            this.active = false;
            this.stack_count = 1;
            this.removeHTML();
            hideTooltip();
			
			if (assistants[1].unlocked && assistants[1].level >= assistant_levels[0] && this.negative) {
				var neg = false;
				for (var i = 0; i < buffs.length; i++) {
					if (buffs[i].active && buffs[i].negative) {
						neg = true;
					}
				}
				if (!neg) {
					buffs[17].activate(60);
					vengeance_bonus = demonic_vengeance + 1;
					if (vengeance_bonus >= 20) {vengeance_bonus;}
					demonic_vengeance = 0;
				} else {
					demonic_vengeance += 1;
				}
			}
        }
      }
    };
    
}
/** Updates each bonus/penalty every tick.
 * @param {float} dt - The time since the last frame.
 */
function updateBuffs(dt) {
    for (var i = 0; i < buffs.length; i++) {
        buffs[i].updateHTML();
        buffs[i].update(dt);
    }
}
/** Instantiates all buffs. */
function initBuffs() {
	var blood_rush = new Buff("Blood Rush", 0, 0, 0, function () {return "Increases production by 25%.<br><span style='float:left;'>"+ Math.round(buffs[0].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.25;}, false);
	var soot_bonus = new Buff("Soot Bonus", 1, 1, 0, function () {return "Increases production by "+Math.round((0.12 + minigames[0].vars.soot_counters * 0.03) * 100)+"%.<br><span style='float:left;'>"+ Math.round(buffs[1].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.12 + minigames[0].vars.soot_counters * 0.03;}, false);
	var gold_rush = new Buff("Gold Rush", 2, 2, 0, function () {return "Increases game speed by 50%.<br><span style='float:left;'>"+ Math.round(buffs[2].time) +"s remaining</span>";} ,function () {}, false);
	var lucky_draw = new Buff("Lucky Draw", 3, 3, 0, function () {return "Increases production by 20%.<br><span style='float:left;'>"+ Math.round(buffs[3].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.20;}, false);
	var unlucky_draw = new Buff("Unlucky Draw", 4, 4, 0, function () {return "Decreases production by 15%.<br><span style='float:left;'>"+ Math.round(buffs[4].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER /= 1.15;}, false, true);
	var bank_bonus = new Buff("Bank Bonus", 5, 5, 0, function () {return "Increases production by 10%.<br><span style='float:left;'>"+ Math.round(buffs[5].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.1;}, false);
	var bank_penalty = new Buff("Bank Penalty", 6, 6, 0, function () {return "Decreases production by 10%.<br><span style='float:left;'>"+ Math.round(buffs[6].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER /= 1.1;}, false, true);
	var economic_bubble = new Buff("Economic Bubble", 7, 7, 0, function () {return "Increases production by 12%.<br><span style='float:left;'>"+ Math.round(buffs[7].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.12;}, false);
	var program_1_bonus = new Buff("Program Bonus", 8, 8, 0, function () {return "Increases production by 20%.<br><span style='float:left;'>"+ Math.round(buffs[8].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.20;}, false);
	var program_1_penalty = new Buff("Program Penalty", 9, 9, 0, function () {return "Decreases production by 20%.<br><span style='float:left;'>"+ Math.round(buffs[9].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER /= 1.20;}, false, true);
	var program_1_click = new Buff("Programed Clicks", 10, 0, 1, function () {return "Auto-clicks once per second<br><span style='float:left;'>"+ Math.round(buffs[10].time) +"s remaining</span>";} ,function () {}, false);
	var program_2_double = new Buff("Doubled Clicks", 11, 0, 1, function () {return "Doubles the value from clicking<br><span style='float:left;'>"+ Math.round(buffs[11].time) +"s remaining</span>";} ,function () {}, false);
	var program_2_halfed = new Buff("Halved Clicks", 12, 0, 1, function () {return "Halves the value from clicking<br><span style='float:left;'>"+ Math.round(buffs[12].time) +"s remaining</span>";} ,function () {}, false, true);
	var program_3_penalty = new Buff("Program Penalty", 13, 9, 0, function () {return "Decreases production by 25%.<br><span style='float:left;'>"+ Math.round(buffs[13].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER /= 1.25;}, false, true);
	var program_3_bonus = new Buff("Program Bonus", 14, 8, 0, function () {return "Increases production by 15%.<br><span style='float:left;'>"+ Math.round(buffs[14].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.15;}, false);
	var flux_bonus = new Buff("Fluctuation Bonus", 15, 1, 1, function () {return "Increases production by "+Math.round((minigames[13].vars.flux_bonus_multiplier * 100)-100)+"%.<br><span style='float:left;'>"+ Math.round(buffs[15].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= minigames[13].vars.flux_bonus_multiplier;}, false);
	var flux_penalty = new Buff("Fluctuation Penalty", 16, 2, 1, function () {return "Decreases production by "+Math.round((minigames[13].vars.flux_bonus_multiplier * 100)-100)+"%.<br><span style='float:left;'>"+ Math.round(buffs[16].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER /= minigames[13].vars.flux_bonus_multiplier;}, false, true);
	var demonic_vengeance = new Buff("Demonic Vengeance", 17, 3, 1, function () {return "Increases production by "+Math.round(vengeance_bonus * 2)+"%.<br><span style='float:left;'>"+ Math.round(buffs[17].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1 + vengeance_bonus * 0.02;}, false, false);
	var demonic_fury = new Buff("Demonic Fury", 18, 4, 1, function () {return " Autoclicks 8 times a second.<br><span style='float:left;'>"+ Math.round(buffs[18].time) +"s remaining</span>";} ,function () {}, false, false);
	var demonic_blessing = new Buff("Demonic Blessing", 19, 5, 1, function () {return " Increases production by 15%.<br><span style='float:left;'>"+ Math.round(buffs[19].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.15;}, false, false);
	var demonic_curse = new Buff("Demonic Curse", 20, 5, 1, function () {return " Decreases production by 15%.<br><span style='float:left;'>"+ Math.round(buffs[20].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER /= 1.15;}, false, true);
	var intelligent_consumption = new Buff("Intelligent Consumption", 21, 6, 1, function () {return " Increases production by " + roundPlace(consumption_bonus * 100).toFixed(2) + "%.<br><span style='float:left;'>"+ Math.round(buffs[21].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1 + consumption_bonus;}, false, false);
	var inertia_bonus = new Buff("Inertia", 22, 7, 1, function () {return "Prevents production from changing.<br><span style='float:left;'>"+ Math.round(buffs[22].time) +"s remaining</span>";} ,function () {}, false, false);
	var factory_bonus = new Buff("Factory Bonus", 23, 8, 1, function () {return "Increases production by 12%.<br><span style='float:left;'>"+ Math.round(buffs[23].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.12;}, false, false);
	var factory_penalty = new Buff("Factory Penalty", 24, 8, 1, function () {return "Decreases production by 12%.<br><span style='float:left;'>"+ Math.round(buffs[24].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER /= 1.12;}, false, true);
	var decree_penalty = new Buff("Collection Exhaustion", 25, 0, 2, function () {return "Halts production.<br><span style='float:left;'>"+ Math.round(buffs[25].time) +"s remaining</span>";} ,function () {}, false, true);
	var petty_bonus = new Buff("Petty Bonus", 26, 1, 2, function () {return "Increases production by " + ((Math.pow(1.01, minigames[20].vars.petty_counters) - 1) * 100).toFixed(1) + "%.<br><span style='float:left;'>"+ Math.round(buffs[26].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1 + Math.pow(1.01, minigames[20].vars.petty_counters);}, false, false);
	var unwanted_bonus = new Buff("Unwanted Bonus", 27, 2, 2, function () {return "Increases production by 25%.<br><span style='float:left;'>"+ Math.round(buffs[27].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.25;}, false, false);
	var thoughtflare = new Buff("Thoughtflare", 28, 3, 2, function () {return "Triples game speed.<br><span style='float:left;'>"+ Math.round(buffs[28].time) +"s remaining</span>";} ,function () {}, false, false);
	var sustained_research = new Buff("Sustained Research", 29, 4, 2, function () {return "Increases the combined value of all bonuses from upgrades and buffs to the maximum value that they have been ("+((MAX_MULTIPLIER - 1) * 100).toFixed(2)+"%).<br><span style='float:left;'>"+ Math.round(buffs[29].time) +"s remaining</span>";} ,function () {}, false, false);
	var mine_sacrifice = new Buff("Mine Sacrifice", 30, 5, 2, function () {return "Increases production by 20%.<br><span style='float:left;'>"+ Math.round(buffs[30].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.20}, false, false);
	var power_sacrifice = new Buff("Power Sacrifice", 31, 6, 2, function () {return "Autoclicks twice per second.<br><span style='float:left;'>"+ Math.round(buffs[31].time) +"s remaining</span>";} ,function () {}, false, false);
	var underground_corruption = new Buff("Underground Corruption", 32, 7, 2, function () {return "Increases production by 25%.<br><span style='float:left;'>"+ Math.round(buffs[32].time) +"s remaining</span>";} ,function () {PRODUCTION_MULTIPLIER *= 1.25;}, false);

	buffs.push(blood_rush);
	buffs.push(soot_bonus);
	buffs.push(gold_rush);
	buffs.push(lucky_draw);
	buffs.push(unlucky_draw);
	buffs.push(bank_bonus);
	buffs.push(bank_penalty);
	buffs.push(economic_bubble);
	buffs.push(program_1_bonus);
	buffs.push(program_1_penalty);
	buffs.push(program_1_click);
	buffs.push(program_2_double);
	buffs.push(program_2_halfed);
	buffs.push(program_3_penalty);
	buffs.push(program_3_bonus);
	buffs.push(flux_bonus);
	buffs.push(flux_penalty);
	buffs.push(demonic_vengeance);
	buffs.push(demonic_fury);
	buffs.push(demonic_blessing);
	buffs.push(demonic_curse);
	buffs.push(intelligent_consumption);
	buffs.push(inertia_bonus);
	buffs.push(factory_bonus);
	buffs.push(factory_penalty);
	buffs.push(decree_penalty);
	buffs.push(petty_bonus);
	buffs.push(unwanted_bonus);
	buffs.push(thoughtflare);
	buffs.push(sustained_research);
	buffs.push(mine_sacrifice);
	buffs.push(power_sacrifice);
	buffs.push(underground_corruption);
}