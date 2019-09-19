/**
 * @fileOverview Contains all logic for the tutorial.
 */

//Global variables to store tutorial information
var tutorial_list = [];
var tutorial_running = false;
var current_tutorial = null;

/** Represents a subsection of the tutorial.
 * @constructor
 * @param {array} stepList - An array of objects containing information for each step in the subtutorial.
 */
function SubTutorial(stepList) {
	this.stepList = stepList;
	this.triggered = false;
	this.running = false;
	this.clickHandler = null;
	this.step = 0;
	/** If this tutorial is not already begun, then the tutorial will be started. */
	this.trigger = function () {
		if (settings.skip_tutorial) {
			this.triggered = true;
		}
		if (!this.triggered) {
			this.running = true;
			this.triggered = true;
			this.stepForward();
			current_tutorial = this;
			tutorial_running = true;
		}
	}
	/** Resets this tutorial subsection. */
	this.reset = function () {
		this.step = 0;
		this.running = false;
		this.triggered = false;
	}
	/** Moves this tutorial to the next instruction. */
	this.stepForward = function () {
		if (this.step < this.stepList.length) {
			if (this.step == 0) {
				$("#dark_box_container").fadeIn();
			}
			var stepper = this.stepList[this.step];
			var lastStepper = this.stepList[this.step - 1] || null;
			if (lastStepper != null && !lastStepper.got_it) {
				$("#"+lastStepper.element_id).off("click", currentTutorialStep);
			}
			if (!stepper.got_it) {
				$("#"+stepper.element_id).on("click", currentTutorialStep);
			}
			if (stepper.hide_menus) {
				$("#detail_container").hide();
				$("#global_container").hide();
				$(".subgame_background").remove();
				if (SHOWN_TAB != -1) {
					toggleBuildingTab(buildings[SHOWN_TAB]);
				}
			}

			highlightBox(stepper.element_id);
			showTutorialText(stepper.pip_text, stepper.element_id, stepper.relative_x, stepper.relative_y, stepper.got_it);
			this.step++;
		} else {
			var lastStepper = this.stepList[this.step - 1] || null;
			if (lastStepper != null && !lastStepper.got_it) {
				$("#"+lastStepper.element_id).off("click", currentTutorialStep);
			}
			this.end();
		}
	}
	/** Stops this tutorial. */
	this.end = function () {
		this.running = false;
		current_tutorial = null;
		$("#tutorial_text_container").fadeOut();
		$("#dark_box_container").fadeOut();
		
		var lastStepper = this.stepList[this.step - 1] || null;
		
		if (lastStepper != null && !lastStepper.got_it) {
			$("#"+lastStepper.element_id).off("click", currentTutorialStep);
		}
	}
}
/** Instantiates all subsections of the tutorial. */
function initSubTutorials() {
	var baseTutorial = new SubTutorial(
	[
		{
			element_id: "world_bg",
			pip_text: "Welcome to Galactic Grind, Click on the globe to start the tutorial.",
			relative_x: 50,
			relative_y: 10,
			got_it: false,
			hide_menus: false,
		},
		{
			element_id: "credits_display",
			pip_text: "Displayed here is your credits. Credits is the main currency used to purchase everything.",
			relative_x: 50,
			relative_y: 10,
			got_it: true,
			hide_menus: false,
		},		
		{
			element_id: "credits_display",
			pip_text: "Credits can be obtained either by clicking the globe, or automated by buying buildings.",
			relative_x: 50,
			relative_y: 10,
			got_it: true,
			hide_menus: false,
		},	
		{
			element_id: "buy_new",
			pip_text: "Click Unlock New to choose a starting building (all buildings have similar starting functionality).",
			relative_x: -50,
			relative_y: 1,
			got_it: false,
			hide_menus: false,
		}
	]
	)
	
	var upgradeTutorial = new SubTutorial(
	[
		{
			element_id: "improved_clicks",
			pip_text: "Buy the Improved Clicks upgrade, this upgrade will make your clicks generate 3 more credits per click.",
			relative_x: 10,
			relative_y: 1,
			got_it: false,
			hide_menus: true,
		},
		{
			element_id: "left_content",
			pip_text: "This area here contains all the upgrades that you will unlock in the future.",
			relative_x: 1,
			relative_y: 20,
			got_it: true,
			hide_menus: false,
		},
			{
			element_id: "left_content",
			pip_text: "More upgrades will unlock as you buy more buildings, and as you generate more credits.",
			relative_x: 1,
			relative_y: 20,
			got_it: true,
			hide_menus: false,
		},
		/*{
			element_id: "global_upgrades",
			pip_text: "This button here allows you to view all previous upgrades you have bought.",
			relative_x: 25,
			relative_y: 1,
			got_it: true,
			hide_menus: false,
		},*/
	]
	)
	
	tutorial_list.push(baseTutorial);
	tutorial_list.push(upgradeTutorial);
}
/** Displays text near the specified element for the tutorial.
 * @param {string} text - The text to be displayed.
 * @param {string} relation_element_id - The id of the element to create the text near.
 * @param {int} relative_x - The x offset of the tutorial text.
 * @param {int} relative_y - The y offset of the tutorial text.
 * @param {boolean} got_it - Determines if a got it button should be displayed.
 */
function showTutorialText(text, relation_element_id, relative_x, relative_y, got_it) {
	var ele = $("#"+relation_element_id);
	
	var offset = ele.offset();
	ele_top = offset.top;
	ele_left = offset.left;
	ele_bottom = offset.top + ele.outerHeight(true);
	ele_right = offset.left + ele.outerWidth(true);
	
	if (relative_x >= 0) {
		$("#tutorial_text_container").css("left", ele_right + relative_x + "px");
	} else {
		$("#tutorial_text_container").css("left", ele_left + relative_x - $("#tutorial_text_container").width()  + "px");
	}
	if (relative_y >= 0) {
		$("#tutorial_text_container").css("top", ele_top + relative_y + "px");
	} 
	
	if (got_it) {
		$("#tutorial_got_it_button").show();
	} else {
		$("#tutorial_got_it_button").hide();
	}
	
	$("#tutorial_text_container").fadeIn();
	$("#tutorial_content").html(text);
}
/** Makes the screen semi-opaque except at target element.
 * @param {string} element_id - The id of the element to be shown.
 */
function highlightBox(element_id) {
	var ele = $("#"+element_id);
	
	var offset = ele.offset();
	ele_top = offset.top;
	ele_left = offset.left;
	ele_bottom = offset.top + ele.outerHeight(true);
	ele_right = offset.left + ele.outerWidth(true);
	
	$("#dark_box_1").attr("style", "height:100%;width:" + Math.floor(ele_left) + "px;position:absolute;left:0px;top:0px;pointer-events:auto");
	$("#dark_box_2").attr("style", "width:100%;height:" + Math.floor(ele_top) + "px;position:absolute;left:0px;top:0px;pointer-events:auto");	
	
	$("#dark_box_3").attr("style", "height:100%;width:" + ($(window).width() - Math.floor(ele_right)) + "px;position:absolute;right:0px;bottom:0px;pointer-events:auto");
	$("#dark_box_4").attr("style", "width:100%;height:" + ($(window).height() - Math.floor(ele_bottom)) + "px;position:absolute;right:0px;bottom:0px;pointer-events:auto");
}
/** Steps the current tutorial forward. */
function currentTutorialStep() {
	current_tutorial.stepForward();
}
