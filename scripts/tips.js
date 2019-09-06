var tip_queue = [];
var tips = [];
var pips = [];

var queue_timer = 0;

function Tip(text, condition, precedence) {
    this.text = text;
    this.condition = condition;
    this.shown = false;
    
    this.test = function () {
        if (this.condition() && !this.shown) {
			var slotted = false;
			for (var i = 0; i < tip_queue.length; i++) {
				if (slotted) {continue}
				if (tip_queue[i].precedence < this.precedence) {
					tip_queue.splice(i, 0, this);
					slotted = true;
				}
			}
			if (!slotted) {tip_queue.push(this)}
            this.shown = true;
        }
    }
}
function tipTick(dt) {
	if (!$("#tip_container").is(":visible")) {queue_timer += dt;}
    
    if (queue_timer >= 60) {
        queue_timer = 0;
        
		var tip_displayed = false;
		
		for (var i = 0; i < tip_queue.length; i++) {
			if (tip_queue[i].condition() && !tip_displayed && !settings.disable_tips) {
				HTMLTip(tip_queue[i]);
				tip_queue.splice(i, 1);
				tip_displayed = true;
			} else if (!tip_queue[i].condition) {
				tip_queue.splice(i, 1);
			}
		}
    }
}
function HTMLTip(tip) {
    var text = tip.text;
    
    $("#tip_container").fadeIn();
    $("#tip_content").html(text);
}
function initTips() {
    var tip_buy_buildings = new Tip("Quick Tip: You can buy multiples of each building by clicking on their background.", function () {return TIER_1_COUNT - TIER_ONE_COUNT == 0;}, 10);
    var tip_tier_two = new Tip("Quick Tip: You can buy tier two buildings by clicking the \"2\" button on the right.", function () {return TIER_2_UNLOCKED == true}, 9);
    var tip_tier_three = new Tip("Quick Tip: You can buy tier two buildings by clicking the \"3\" button on the right.", function () {return TIER_3_UNLOCKED == true}, 9);
    var tip_compound_bonuses = new Tip("Quick Tip: Temporary bonuses compound with each other.", function () {return stats.credits_earned >= 100000000;}, 2);
    var tip_reset = new Tip("Quick Tip: It is a good idea to reset when you will have 2-10 times as many karma points as before.", function () {return KARMA_POINTS >= 90 && FUTURE_KARMA_POINTS > KARMA_POINTS * 2;}, 7);
    var tip_gold = new Tip("Quick Tip: Gold refills cost 10% more for targeting a singular building stacking up to 9x.", function () {return buildings[1].count >= 15;}, 2);
    var tip_settings = new Tip("Quick Tip: You can tweak settings to your liking via the gear icon on the left.", function () {return true;}, 1);
    var tip_negative = new Tip("Quick Tip: If prepared for, most negative effects can be mitigated.", function () {return stats.credits_earned >= 100000000000;}, 1);
    var tip_friends = new Tip("Quick Tip: You can receive extra bonuses for your friends playing.", function () {return stats.credits_earned >= 100000;}, 1);
    var tip_buy = new Tip("Quick Tip: You buy various effects in shop (button on the left).", function () {return stats.credits_earned >= 1000000;}, 1);
    
    tips.push(tip_buy_buildings); //0
    tips.push(tip_tier_two); //1
    tips.push(tip_compound_bonuses); //2
    tips.push(tip_tier_three); //3
    tips.push(tip_reset); //4
    tips.push(tip_gold); //5
    tips.push(tip_settings); //6
    tips.push(tip_negative); //7
    tips.push(tip_friends); //8
    tips.push(tip_buy); //9
}

function createPip(element, group) {
    var pip = new Pip(element, group);
    
    pips.push(pip);
    
    updatePips();
}
function updatePips() {    
    var len = pips.length;
    for (var i = 0; i < len; i++) {
		HTMLPip(pips[i].element, pips[i]);
    }
}
function Pip(element, group) {
    this.element = element;
    this.hover = true;
    this.group = group || null;
}
function HTMLPip(element_id, pip) {
    var element = $(element_id);
    if (!element.length) {return;}
    var pip = $(document.createElement('img'));
    
    var ele_top = element.position().top;
    var ele_left = element.position().left;
        
    var pip_top = ele_top - 16;
    var pip_left = ele_left + element.width();
    
    pip.attr("src", "images/exclimation_pip.png").attr("class", "pip").attr("id", "pip_"+element.attr("id"));
    pip.attr("style", "position:absolute;top:"+pip_top+"px;left:"+pip_left+"px;z-index:120980109");
    
    if (pip.hover) {
        element.on("mouseenter", function () {
            element.off("mouseenter");
            $("#pip_"+element.attr("id")).fadeOut().remove();
            pips.splice(pips.indexOf(pip), 1);
        })
    }
    
   element.parent().append(pip);
}

/*
function HTMLPip(element_id, pip) {	
	var element = $(element_id);
	if (!element.length) {return;};
	if (!element.is("img")) {
		return HTMLPipNormal(element_id, pip);
	}
	if (element.hasClass("unlocked")) {return;};

	element.addClass("unlocked");
    if (pip.hover) {
        element.on("mouseenter", function () {
            element.off("mouseenter");
            $("#pip_"+element.attr("id")).fadeOut().remove();
            pips.splice(pips.indexOf(pip), 1);
		});
	}
	$(element_id).after('<img src="images/exclimation_pip.png" class="img_pip" id="pip_'+element.attr("id")+'"/>');
}
*/
//Lambda Expression