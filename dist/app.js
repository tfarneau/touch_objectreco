(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function _interopRequire(obj) {
	return obj && obj.__esModule ? obj["default"] : obj;
};

var App = _interopRequire(require("./app"));

$(function () {
	new App();
});

},{"./app":2}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// import Cube from './3d/cube';
// Modules

var TouchService = _interopRequire(require("./modules/touchservice"));

var DebugService = _interopRequire(require("./modules/debugservice"));

var Interface = _interopRequire(require("./modules/interface"));

var App = (function () {
	function App() {
		_classCallCheck(this, App);

		// this.debugService = new DebugService();
		this.ui = new Interface();
		this.ui.set_stage(0);

		this.settings = {
			debug: false,
			simulate_touch: false
		};

		this.tmp = {};

		this.createScene();
		this.touchService = new TouchService(this.canvas, {
			simulate: this.settings.simulate_touch
		});

		this.render();
	}

	_createClass(App, {
		createScene: {
			value: function createScene() {

				this.canvas = $("#main_canvas");
				this.canvas.attr("width", $(window).width());
				this.canvas.attr("height", $(window).height());

				this.stage = new createjs.Stage("main_canvas");

				createjs.Touch.enable(this.stage);
				createjs.Ticker.setFPS(24);
			}
		},
		render: {
			value: function render() {
				var _this = this;

				this.touchService.update_object();

				$(".log-touchesnb").text(this.touchService.select_touches.length);
				$(".log-touchesobjectnb").text(this.touchService.object_touches.length);

				if (this.settings.debug == true) {

					// Render touches

					this.tmp.log_touchs == undefined ? this.tmp.log_touchs = [] : null;

					for (var i in this.tmp.log_touchs) {
						this.tmp.log_touchs[i].graphics.clear();
						this.stage.removeChild[this.tmp.log_touchs[i]];
					}

					_.each(this.touchService.select_touches, function (touch) {

						this.tmp.log_touchs[touch.identifier] = new createjs.Shape();
						this.tmp.log_touchs[touch.identifier].graphics.beginFill("blue").drawCircle(0, 0, 5);
						this.stage.addChild(this.tmp.log_touchs[touch.identifier]);

						this.tmp.log_touchs[touch.identifier].set({ x: touch.clientX, y: touch.clientY });
					}, this);

					// Render object

					if (this.touchService.object !== null) {

						// Line

						if (this.tmp.log_object == undefined) {
							this.tmp.log_object = {};
							this.tmp.log_object.line = new createjs.Shape();
							this.tmp.log_object.circle = new createjs.Shape();
							this.tmp.log_object.circle_arc = new createjs.Shape();
							this.stage.addChild(this.tmp.log_object.line);
							this.stage.addChild(this.tmp.log_object.circle);
						} else {
							this.tmp.log_object.line.graphics.clear();
							this.tmp.log_object.circle.graphics.clear();
							this.tmp.log_object.circle_arc.graphics.clear();
						}

						this.tmp.log_object.line.graphics.setStrokeStyle(0.3);
						this.tmp.log_object.line.graphics.beginStroke("blue");
						this.tmp.log_object.line.graphics.moveTo(this.touchService.object.back.x, this.touchService.object.back.y);
						this.tmp.log_object.line.graphics.lineTo(this.touchService.object.top.x, this.touchService.object.top.y);
						this.tmp.log_object.line.graphics.endStroke();

						// Circle

						var distance = this.touchService.object.size;
						this.tmp.log_object.circle.graphics.setStrokeStyle(1).beginStroke("blue").drawCircle(0, 0, distance + 5);
						this.tmp.log_object.circle.x = this.touchService.object.middle.x;
						this.tmp.log_object.circle.y = this.touchService.object.middle.y;
					}
				}

				// console.log(this.stage.children)
				this.ui.update(this.stage, this.touchService.object, this.touchService.select_touches);

				requestAnimationFrame(function () {
					_this.render();
				});

				this.stage.update();

				/*this.objects.forEach((object) => {
    	object.update();
    });*/
			}
		},
		add: {
			value: function add(object) {

				this.objects.push(object);
			}
		}
	});

	return App;
})();

module.exports = App;

},{"./modules/debugservice":3,"./modules/interface":4,"./modules/touchservice":6}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var DebugService = (function () {
	function DebugService() {
		_classCallCheck(this, DebugService);
	}

	_createClass(DebugService, {
		debug: {
			value: function debug(app) {

				$(".log-touchesnb").text(app.touchService.select_touches.length);
				$(".log-touchesobjectnb").text(app.touchService.object_touches.length);

				// Render touches

				app.tmp.log_touchs == undefined ? app.tmp.log_touchs = [] : null;

				for (var i in app.tmp.log_touchs) {
					app.tmp.log_touchs[i].graphics.clear();
					app.stage.removeChild[app.tmp.log_touchs[i]];
				}

				_.each(app.touchService.select_touches, function (touch) {

					app.tmp.log_touchs[touch.identifier] = new createjs.Shape();
					app.tmp.log_touchs[touch.identifier].graphics.beginFill("blue").drawCircle(0, 0, 5);
					app.stage.addChild(app.tmp.log_touchs[touch.identifier]);

					app.tmp.log_touchs[touch.identifier].set({ x: touch.clientX, y: touch.clientY });
				}, app);

				// Render object

				if (app.touchService.object !== null) {

					// Line

					if (app.tmp.log_object == undefined) {
						app.tmp.log_object = {};
						app.tmp.log_object.line = new createjs.Shape();
						app.tmp.log_object.circle = new createjs.Shape();
						app.tmp.log_object.circle_arc = new createjs.Shape();
						app.stage.addChild(app.tmp.log_object.line);
						app.stage.addChild(app.tmp.log_object.circle);
					} else {
						app.tmp.log_object.line.graphics.clear();
						app.tmp.log_object.circle.graphics.clear();
						app.tmp.log_object.circle_arc.graphics.clear();
					}

					app.tmp.log_object.line.graphics.setStrokeStyle(0.3);
					app.tmp.log_object.line.graphics.beginStroke("blue");
					app.tmp.log_object.line.graphics.moveTo(app.touchService.object.back.x, app.touchService.object.back.y);
					app.tmp.log_object.line.graphics.lineTo(app.touchService.object.top.x, app.touchService.object.top.y);
					app.tmp.log_object.line.graphics.endStroke();

					// Circle

					var distance = Math.sqrt((app.touchService.object.back.x - app.touchService.object.top.x) * (app.touchService.object.back.x - app.touchService.object.top.x) + (app.touchService.object.back.y - app.touchService.object.top.y) * (app.touchService.object.back.y - app.touchService.object.top.y));
					app.tmp.log_object.circle.graphics.setStrokeStyle(1).beginStroke("blue").drawCircle(0, 0, distance + 5);
					app.tmp.log_object.circle.x = app.touchService.object.middle.x;
					app.tmp.log_object.circle.y = app.touchService.object.middle.y;
				}
			}
		}
	});

	return DebugService;
})();

module.exports = DebugService;

},{}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function _interopRequire(obj) {
	return obj && obj.__esModule ? obj["default"] : obj;
};

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var key in props) {
			var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
		}Object.defineProperties(target, props);
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
})();

var _classCallCheck = function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
};

var InterfaceSetup = _interopRequire(require("./interfacesetup"));

var Interface = (function () {
	function Interface() {
		_classCallCheck(this, Interface);

		this.setup = new InterfaceSetup();
		this.stages = this.setup.get_stages();
		this.actual_stage = null;

		this.objects = [];
	}

	_createClass(Interface, {
		update: {
			value: function update(stage, object, touches) {

				if (this.actual_stage !== null) {

					var stage_setup = this.stages[this.actual_stage];

					// If objects for this stage doesn't exist
					if (this.objects[this.actual_stage] == undefined) {
						this.objects[this.actual_stage] = {};
					}

					// Title
					if (this.objects[this.actual_stage].text == undefined) {
						this.objects[this.actual_stage].text = new createjs.Text(stage_setup.title, "40px Raleway", "#ff7700");
						this.objects[this.actual_stage].text.y = 50;
						this.objects[this.actual_stage].text.x = stage.canvas.width / 2 - this.objects[this.actual_stage].text.getBounds().width / 2;
						stage.addChild(this.objects[this.actual_stage].text);
					}

					// Round around vehicle
					if (object !== null) {
						// Object is on the tab

						var size_object_round = object.size + 200;

						// Static part
						if (this.objects[this.actual_stage].round_static == undefined) {
							this.objects[this.actual_stage].round_static = new createjs.Bitmap("../img/round_static.png");
							stage.addChild(this.objects[this.actual_stage].round_static);
						}

						// Dynamic parts
						if (this.objects[this.actual_stage].round_dynamics == undefined) {
							this.objects[this.actual_stage].round_dynamics = [];
							this.objects[this.actual_stage].round_dynamics[0] = new createjs.Bitmap("../img/round_dynamic.png");
							this.objects[this.actual_stage].round_dynamics[1] = new createjs.Bitmap("../img/round_dynamic2.png");
							stage.addChild(this.objects[this.actual_stage].round_dynamics[0]);
							stage.addChild(this.objects[this.actual_stage].round_dynamics[1]);
						}

						// Move static part
						if (this.objects[this.actual_stage].round_static.getBounds() !== null) {
							// Image is loaded
							this.objects[this.actual_stage].round_static.regX = 512;
							this.objects[this.actual_stage].round_static.regY = 512;
							this.objects[this.actual_stage].round_static.scaleX = size_object_round / this.objects[this.actual_stage].round_static.getBounds().width;
							this.objects[this.actual_stage].round_static.scaleY = size_object_round / this.objects[this.actual_stage].round_static.getBounds().height;
							this.objects[this.actual_stage].round_static.x = object.middle.x;
							this.objects[this.actual_stage].round_static.y = object.middle.y;
						}

						// Move dynamic parts
						_.each(this.objects[this.actual_stage].round_dynamics, function (round, index) {
							if (round.getBounds() !== null) {
								var _rotation = object.angle * 2;
								if (index == 1) {
									_rotation = _rotation * 3;
								}
								round.regX = 512;
								round.regY = 512;
								round.scaleX = size_object_round / round.getBounds().width;
								round.scaleY = size_object_round / round.getBounds().height;
								round.x = object.middle.x;
								round.y = object.middle.y;
								round.rotation = _rotation;
							}
						});
					}

					// Buttons
					if (this.objects[this.actual_stage].buttons == undefined) {

						var margin_y = 50;
						var margin_x = 100;

						this.objects[this.actual_stage].buttons = [];

						var total_buttons = stage_setup.buttons.length;
						var per_side_buttons = Math.ceil(total_buttons / 2);
						var y_step = Math.ceil((stage.canvas.height - margin_y * 2) / per_side_buttons);
						var x_steps = 2;

						var html = "";
						_.each(stage_setup.buttons, function (button, index) {
							// Create html elements

							if (index < per_side_buttons) {
								var top = y_step * index + margin_y + y_step / 2;
								var left = margin_x;
								var style = "top:" + top + "px; left:" + left + "px;";
							} else {
								var top = y_step * (index - per_side_buttons) + margin_y + y_step / 2;
								var right = margin_x;
								var style = "top:" + top + "px; right:" + right + "px;";
							}

							html += "<div class='js-track button' data-index='" + index + "' style='" + style + "'><span>" + button.title + "</span><div class='button-childs'>";

							_.each(button.childs, function (child, index) {
								html += "<div class='js-track child-button' data-index='" + index + "-" + index + "'>" + child.title + "</div>";
							}, this);

							html += "</div></div>"

							/*this.objects[this.actual_stage].buttons[index] = new createjs.Text(button.title, "20px Raleway", "red");
       console.log(index+" < "+per_side_buttons);
       if(index < per_side_buttons){
       	this.objects[this.actual_stage].buttons[index].y = y_step*index+margin_y+y_step/2;
       	this.objects[this.actual_stage].buttons[index].x = margin_x;
       }else{
       	this.objects[this.actual_stage].buttons[index].y = y_step*(index-per_side_buttons)+margin_y+y_step/2;
       	this.objects[this.actual_stage].buttons[index].x = stage.canvas.width-margin_x-this.objects[this.actual_stage].buttons[index].getBounds().width;
       }
       	this.objects[this.actual_stage].buttons[index].onPress = function(event){
       	console.log("TOUCHED")
       }
       stage.addChild(this.objects[this.actual_stage].buttons[index]);*/

							;
						}, this);

						$(".js-interface").html(html);

						_.each(stage_setup.buttons, function (button, index) {
							// Create events
							this.objects[this.actual_stage].buttons[index] = $(".js-track[data-index=" + index + "]");
							this.objects[this.actual_stage].buttons[index].bind("touchstart", function (event) {
								$(this).toggleClass("is-selected");
							});
						}, this);
					}

					// Move interface
					var offset_x = 0;
					var offset_y = 0;
					if (object !== null) {
						var offset_x = object.middle.x / stage.canvas.width * 100 - 50;
						var offset_y = object.middle.y / stage.canvas.height * 100 - 50;
					}

					$(".js-interface").css("transform", "translate3d(" + offset_x + "px, " + offset_y + "px, 0)");
				}
			}
		},
		set_stage: {
			value: function set_stage(id) {
				this.actual_stage = id;
			}
		}
	});

	return Interface;
})();

module.exports = Interface;

},{"./interfacesetup":5}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var InterfaceSetup = (function () {
	function InterfaceSetup() {
		_classCallCheck(this, InterfaceSetup);

		this.stages = [{
			title: "Étape 1",
			id: "step1",
			buttons: [{
				title: "button 1",
				childs: [{
					title: "sub1"
				}, {
					title: "sub2"
				}, {
					title: "sub3"
				}]
			}, {
				title: "button 2",
				childs: [{
					title: "sub1"
				}, {
					title: "sub2"
				}, {
					title: "sub3"
				}, {
					title: "sub4"
				}]
			}, {
				title: "button 3"
			}, {
				title: "button 4"
			}]
		}];
	}

	_createClass(InterfaceSetup, {
		get_stages: {
			value: function get_stages() {
				return this.stages;
			}
		},
		get_stage: {
			value: function get_stage(id) {}
		}
	});

	return InterfaceSetup;
})();

module.exports = InterfaceSetup;

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TouchService = (function () {
	function TouchService(canvas, opts) {
		_classCallCheck(this, TouchService);

		this.canvas = canvas;
		this.opts = opts;

		this.select_touches = [];
		this.object_touches = [];
		this.object = null;

		this.tmp = {};

		this.init_events();
		this.init_modes();
		this.set_mode("WAITING");

		if (this.opts.simulate === true) {
			this.simulate_touches();
		}
	}

	_createClass(TouchService, {
		update_status: {

			// ----------------
			// Modes processing
			// ----------------

			value: function update_status(status) {
				$(".log-status").text(status);
			}
		},
		init_modes: {
			value: function init_modes() {}
		},
		set_mode: {
			value: function set_mode(mode) {

				if (mode == "WAITING") {

					this.update_status("waiting object");

					this.tmp.mode = {
						step: 0
					};

					var that = this;
					document.addEventListener("object_touches_added", function () {
						console.log("recevied " + that.object_touches.length);

						if (that.object_touches.length == 2) {
							that.update_status("use recognized object");
							that.recognize_object(that.object_touches);
						}
					});

					document.addEventListener("object_removed", function (event) {
						that.object = null;
						that.update_status("waiting object after removed");
					});
				}
			}
		},
		update_object: {

			/*
   	update_object()
   	---
   	Appelé de l'extérieur pour mettre à jour le tracé de l'objet	
   */

			value: function update_object() {

				if (this.object != null) {
					this.recognize_object(this.object_touches);
				}
			}
		},
		recognize_object: {

			/*
   	recognize_object(touches)
   	---
   	Reconnait l'objet à partir d'une liste d'identifiers de touches	
   */

			value: function recognize_object(touches) {

				/*var _touches = [];
    
    _.each(this.touches, function(registered_touch){
    	if(touches.indexOf(registered_touch.identifier) !== -1){
    		_touches.push(registered_touch);
    	}
    },this);
    	console.log("touches in recognize");
    console.log(_touches)
    	touches = _touches;*/

				var point_bottom = {
					x: touches[0].clientX,
					y: touches[0].clientY
				};

				var point_top = {
					x: touches[1].clientX,
					y: touches[1].clientY
				};

				// Calculate the midpoint

				var point_middle = {
					x: (point_bottom.x + point_top.x) / 2,
					y: (point_bottom.y + point_top.y) / 2
				};

				// Add the object

				this.object = {
					back: point_bottom,
					top: point_top,
					middle: point_middle
				};

				this.object.size = Math.sqrt((this.object.back.x - this.object.top.x) * (this.object.back.x - this.object.top.x) + (this.object.back.y - this.object.top.y) * (this.object.back.y - this.object.top.y));
				this.object.angle = Math.atan2(this.object.top.y - this.object.back.y, this.object.top.x - this.object.back.x) * 180 / Math.PI;
			}
		},
		init_events: {

			// -----------------
			// Events processing
			// -----------------

			value: function init_events() {

				var that = this;

				this.canvas.on("touchend", function (event) {
					that.process_touchend(event);
				});

				this.canvas.on("touchstart", function (event) {
					that.process_touchstart(event);
				});

				this.canvas.on("touchmove", function (event) {
					that.process_touchmove(event);
				});
			}
		},
		process_touchstart: {
			value: function process_touchstart(event) {

				console.log("EVENT - touchstart");
				document.dispatchEvent(new CustomEvent("touch_uniq", { detail: event }));

				var that = this;

				_.each(event.originalEvent.changedTouches, function (touch) {

					// Choose between that.select_touches & that.object_touches

					if (that.object_touches.length == 2) {
						// If object is already on tab, it's a finger
						console.log("add s a finger");
						that.select_touches.push(touch);
					} else {
						// Either, it's the object
						console.log("add an object");
						that.object_touches.push(touch);
						document.dispatchEvent(new CustomEvent("object_touches_added"));
					}
				});
			}
		},
		process_touchend: {
			value: function process_touchend(event) {

				console.log("EVENT - touchend");

				var that = this;

				// Is this a finger ?

				for (var itouch in event.originalEvent.changedTouches) {
					// For each touch

					// Determine if touch is a object or a finger
					var is_type = null;

					// Is this a finger ?
					for (var i = that.select_touches.length - 1; i >= 0; i--) {
						if (that.select_touches[i].identifier == event.originalEvent.changedTouches[itouch].identifier) {
							console.log("remove a finger");
							that.select_touches.splice(i, 1);
							is_type = "finger";
						}
					}

					// Is this an object ?
					for (var i = that.object_touches.length - 1; i >= 0; i--) {
						if (that.object_touches[i].identifier == event.originalEvent.changedTouches[itouch].identifier) {
							console.log("remove an object");
							is_type = "object";
						}
					}

					// If it's an object
					if (is_type == "object") {
						that.object_touches = [];
						document.dispatchEvent(new CustomEvent("object_removed"));
					}
				}
			}
		},
		process_touchmove: {
			value: function process_touchmove(event) {

				console.log("EVENT - touchmove");

				var that = this;

				_.each(event.originalEvent.changedTouches, function (touch) {
					for (var i in that.touches) {
						if (touch.identifier == that.touches[i].identifier) {
							that.touches[i] = touch;
						}
					}
				});
			}
		},
		simulate_touches: {

			// -----------
			// Debug tools
			// -----------

			value: function simulate_touches() {

				var simulate_coordinates = [{
					clientX: $(window).width() / 2 - 300,
					clientY: $(window).height() / 2,
					time: 1000,
					identifier: 99,
					event_name: "touchstart"
				}, {
					clientX: null,
					clientY: null,
					time: 1200,
					identifier: 99,
					event_name: "touchend"
				}, {
					clientX: $(window).width() / 2,
					clientY: $(window).height() / 2 - 50,
					time: 1400,
					identifier: 90,
					event_name: "touchstart"
				}, {
					clientX: null,
					clientY: null,
					time: 1600,
					identifier: 90,
					event_name: "touchend"
				}, {
					clientX: $(window).width() / 2,
					clientY: $(window).height() / 2 + 50,
					time: 1800,
					identifier: 91,
					event_name: "touchstart"
				}, {
					clientX: $(window).width() / 2 - 150,
					clientY: $(window).height() / 2,
					time: 2000,
					identifier: 92,
					event_name: "touchstart"
				}, {
					clientX: $(window).width() / 2,
					clientY: $(window).height() / 2 - 50,
					time: 2200,
					identifier: 93,
					event_name: "touchstart"
				}, {
					clientX: null,
					clientY: null,
					time: 2700,
					identifier: 91,
					event_name: "touchend"
				}, {
					clientX: $(window).width() / 2 - 150,
					clientY: $(window).height() / 2 - 100,
					time: 3000,
					identifier: 94,
					event_name: "touchstart"
				}];

				var index = 0;
				_.each(simulate_coordinates, function (coord) {

					var that = this;
					setTimeout(function () {

						var e = new jQuery.Event(coord.event_name);
						e.originalEvent = {
							changedTouches: {
								0: {
									clientX: coord.clientX,
									clientY: coord.clientY,
									identifier: coord.identifier
								}
							}
						};
						that.canvas.trigger(e);
					}, coord.time);
					index++;
				}, this);

				var that = this;
				setTimeout(function () {

					setInterval(function () {
						for (var i in that.touches) {
							if (that.object_touches.indexOf(that.touches[i].identifier) != -1) {
								that.touches[i].clientX += Math.floor(Math.random() * 10) - 5;
								that.touches[i].clientY += Math.floor(Math.random() * 10) - 5;
							}
						}
					}, 100);
				}, 3100);
			}
		}
	});

	return TouchService;
})();

module.exports = TouchService;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGZhcm5lYXUvU2l0ZXMvcHJvamVjdF9kczIvc3JjL21haW4uanMiLCIvVXNlcnMvdGZhcm5lYXUvU2l0ZXMvcHJvamVjdF9kczIvc3JjL2FwcC5qcyIsIi9Vc2Vycy90ZmFybmVhdS9TaXRlcy9wcm9qZWN0X2RzMi9zcmMvbW9kdWxlcy9kZWJ1Z3NlcnZpY2UuanMiLCIvVXNlcnMvdGZhcm5lYXUvU2l0ZXMvcHJvamVjdF9kczIvc3JjL21vZHVsZXMvaW50ZXJmYWNlLmpzIiwiL1VzZXJzL3RmYXJuZWF1L1NpdGVzL3Byb2plY3RfZHMyL3NyYy9tb2R1bGVzL2ludGVyZmFjZXNldHVwLmpzIiwiL1VzZXJzL3RmYXJuZWF1L1NpdGVzL3Byb2plY3RfZHMyL3NyYy9tb2R1bGVzL3RvdWNoc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7QUFFYixJQUFJLGVBQWUsR0FBRyxTQUFBLGVBQUEsQ0FBVSxHQUFHLEVBQUU7QUFBRSxRQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUM7Q0FBRSxDQUFDOztBQUU5RixJQUpPLEdBQUcsR0FBQSxlQUFBLENBQUEsT0FBQSxDQUFNLE9BQU8sQ0FBQSxDQUFBLENBQUE7O0FBRXZCLENBQUMsQ0FBQyxZQUFNO0FBQ1AsS0FBSSxHQUFHLEVBQUUsQ0FBQztDQUNWLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7SUNESSxZQUFZLDJCQUFNLHdCQUF3Qjs7SUFDMUMsWUFBWSwyQkFBTSx3QkFBd0I7O0lBQzFDLFNBQVMsMkJBQU0scUJBQXFCOztJQUV0QixHQUFHO0FBRVosVUFGUyxHQUFHLEdBRVY7d0JBRk8sR0FBRzs7O0FBS3RCLE1BQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUMxQixNQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckIsTUFBSSxDQUFDLFFBQVEsR0FBRztBQUNmLFFBQUssRUFBRSxLQUFLO0FBQ1osaUJBQWMsRUFBRSxLQUFLO0dBQ3JCLENBQUM7O0FBRUYsTUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7O0FBRWQsTUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLE1BQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQztBQUNoRCxXQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjO0dBQ3RDLENBQUMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7RUFFZDs7Y0F0Qm1CLEdBQUc7QUF3QnZCLGFBQVc7VUFBQSx1QkFBRTs7QUFFWixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNoQyxRQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDOztBQUU5QyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFL0MsWUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLFlBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTNCOztBQUVELFFBQU07VUFBQSxrQkFBRTs7O0FBRVAsUUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFbEMsS0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xFLEtBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEUsUUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUM7Ozs7QUFJOUIsU0FBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7O0FBRW5FLFVBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUM7QUFDaEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDL0M7O0FBRUQsTUFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxVQUFTLEtBQUssRUFBQzs7QUFFdkQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdELFVBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOztBQUUzRCxVQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO01BRWhGLEVBQUMsSUFBSSxDQUFDLENBQUM7Ozs7QUFJUixTQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLElBQUksRUFBQzs7OztBQUlwQyxVQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBQztBQUNuQyxXQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDekIsV0FBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hELFdBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNsRCxXQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbkQsV0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDbkQsTUFBSTtBQUNKLFdBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDMUMsV0FBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QyxXQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQ2hEOztBQUVELFVBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RELFVBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELFVBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNHLFVBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pHLFVBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7Ozs7QUFJOUMsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQzdDLFVBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEdBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkcsVUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxD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SUFBSSxTQUFTLEVBQUM7QUFDbEMsU0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFNBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQyxTQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakQsU0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2xELFNBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFNBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ2pELE1BQUk7QUFDSixTQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3pDLFNBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0MsU0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztNQUMvQzs7QUFFRCxRQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyRCxRQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyRCxRQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RyxRQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RyxRQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7O0FBSTdDLFNBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUEsSUFBRyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBLElBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBRSxDQUFDO0FBQzFSLFFBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMs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LElBQUksQ0FBQyxPQUFPLEVBQUM7QUFDekIsV0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDO0FBQ2hFLFlBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsQ0FBQztBQUMxRCxZQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDMUQ7T0FDRDtNQUNELEVBQUMsR0FBRyxDQUFDLENBQUM7S0FFUCxFQUFDLElBQUksQ0FBQyxDQUFDO0lBRVI7Ozs7UUF0Vm1CLFlBQVk7OztpQkFBWixZQUFZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBcHAgZnJvbSAnLi9hcHAnO1xuXG4kKCgpID0+IHtcblx0bmV3IEFwcCgpO1xufSk7IiwiLy8gaW1wb3J0IEN1YmUgZnJvbSAnLi8zZC9jdWJlJztcbi8vIE1vZHVsZXNcblxuaW1wb3J0IFRvdWNoU2VydmljZSBmcm9tICcuL21vZHVsZXMvdG91Y2hzZXJ2aWNlJztcbmltcG9ydCBEZWJ1Z1NlcnZpY2UgZnJvbSAnLi9tb2R1bGVzL2RlYnVnc2VydmljZSc7XG5pbXBvcnQgSW50ZXJmYWNlIGZyb20gJy4vbW9kdWxlcy9pbnRlcmZhY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHB7XG5cblx0Y29uc3RydWN0b3IoKXtcblxuXHRcdC8vIHRoaXMuZGVidWdTZXJ2aWNlID0gbmV3IERlYnVnU2VydmljZSgpO1xuXHRcdHRoaXMudWkgPSBuZXcgSW50ZXJmYWNlKCk7XG5cdFx0dGhpcy51aS5zZXRfc3RhZ2UoMCk7XG5cblx0XHR0aGlzLnNldHRpbmdzID0ge1xuXHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0c2ltdWxhdGVfdG91Y2g6IGZhbHNlXG5cdFx0fTtcblxuXHRcdHRoaXMudG1wID0ge307XG5cblx0XHR0aGlzLmNyZWF0ZVNjZW5lKCk7XG5cdFx0dGhpcy50b3VjaFNlcnZpY2UgPSBuZXcgVG91Y2hTZXJ2aWNlKHRoaXMuY2FudmFzLHtcblx0XHRcdHNpbXVsYXRlOiB0aGlzLnNldHRpbmdzLnNpbXVsYXRlX3RvdWNoXG5cdFx0fSk7XG5cblx0XHR0aGlzLnJlbmRlcigpO1xuXG5cdH1cblxuXHRjcmVhdGVTY2VuZSgpe1xuXG5cdFx0dGhpcy5jYW52YXMgPSAkKCcjbWFpbl9jYW52YXMnKTtcblx0XHR0aGlzLmNhbnZhcy5hdHRyKCd3aWR0aCcsJCh3aW5kb3cpLndpZHRoKCkpO1xuXHRcdHRoaXMuY2FudmFzLmF0dHIoJ2hlaWdodCcsJCh3aW5kb3cpLmhlaWdodCgpKTtcblxuXHRcdHRoaXMuc3RhZ2UgPSBuZXcgY3JlYXRlanMuU3RhZ2UoJ21haW5fY2FudmFzJyk7XG5cblx0XHRjcmVhdGVqcy5Ub3VjaC5lbmFibGUodGhpcy5zdGFnZSk7XG5cdFx0Y3JlYXRlanMuVGlja2VyLnNldEZQUygyNCk7XG5cblx0fVxuXG5cdHJlbmRlcigpe1xuXG5cdFx0dGhpcy50b3VjaFNlcnZpY2UudXBkYXRlX29iamVjdCgpO1xuXG5cdFx0JCgnLmxvZy10b3VjaGVzbmInKS50ZXh0KHRoaXMudG91Y2hTZXJ2aWNlLnNlbGVjdF90b3VjaGVzLmxlbmd0aCk7XG5cdFx0JCgnLmxvZy10b3VjaGVzb2JqZWN0bmInKS50ZXh0KHRoaXMudG91Y2hTZXJ2aWNlLm9iamVjdF90b3VjaGVzLmxlbmd0aCk7XG5cblx0XHRpZih0aGlzLnNldHRpbmdzLmRlYnVnID09IHRydWUpeyBcblxuXHRcdFx0Ly8gUmVuZGVyIHRvdWNoZXNcblxuXHRcdFx0dGhpcy50bXAubG9nX3RvdWNocyA9PSB1bmRlZmluZWQgPyB0aGlzLnRtcC5sb2dfdG91Y2hzID0gW10gOiBudWxsO1xuXG5cdFx0XHRmb3IodmFyIGkgaW4gdGhpcy50bXAubG9nX3RvdWNocyl7XG5cdFx0XHRcdHRoaXMudG1wLmxvZ190b3VjaHNbaV0uZ3JhcGhpY3MuY2xlYXIoKTtcblx0XHRcdFx0dGhpcy5zdGFnZS5yZW1vdmVDaGlsZFt0aGlzLnRtcC5sb2dfdG91Y2hzW2ldXTtcblx0XHRcdH1cblxuXHRcdFx0Xy5lYWNoKHRoaXMudG91Y2hTZXJ2aWNlLnNlbGVjdF90b3VjaGVzLCBmdW5jdGlvbih0b3VjaCl7XG5cblx0XHRcdFx0dGhpcy50bXAubG9nX3RvdWNoc1t0b3VjaC5pZGVudGlmaWVyXSA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHRcdFx0XHR0aGlzLnRtcC5sb2dfdG91Y2hzW3RvdWNoLmlkZW50aWZpZXJdLmdyYXBoaWNzLmJlZ2luRmlsbChcImJsdWVcIikuZHJhd0NpcmNsZSgwLCAwLCA1KTtcblx0XHRcdFx0dGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnRtcC5sb2dfdG91Y2hzW3RvdWNoLmlkZW50aWZpZXJdKTtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMudG1wLmxvZ190b3VjaHNbdG91Y2guaWRlbnRpZmllcl0uc2V0KHt4OiB0b3VjaC5jbGllbnRYLCB5OiB0b3VjaC5jbGllbnRZfSk7XG5cblx0XHRcdH0sdGhpcyk7XG5cblx0XHRcdC8vIFJlbmRlciBvYmplY3RcblxuXHRcdFx0aWYodGhpcy50b3VjaFNlcnZpY2Uub2JqZWN0ICE9PSBudWxsKXtcblxuXHRcdFx0XHQvLyBMaW5lXG5cblx0XHRcdFx0aWYodGhpcy50bXAubG9nX29iamVjdCA9PSB1bmRlZmluZWQpe1xuXHRcdFx0XHRcdHRoaXMudG1wLmxvZ19vYmplY3QgPSB7fTtcblx0XHRcdFx0XHR0aGlzLnRtcC5sb2dfb2JqZWN0LmxpbmUgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0XHRcdFx0XHR0aGlzLnRtcC5sb2dfb2JqZWN0LmNpcmNsZSA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHRcdFx0XHRcdHRoaXMudG1wLmxvZ19vYmplY3QuY2lyY2xlX2FyYyA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xuXHRcdFx0XHQgICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnRtcC5sb2dfb2JqZWN0LmxpbmUpO1xuXHRcdFx0XHQgICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnRtcC5sb2dfb2JqZWN0LmNpcmNsZSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHRoaXMudG1wLmxvZ19vYmplY3QubGluZS5ncmFwaGljcy5jbGVhcigpO1xuXHRcdFx0XHRcdHRoaXMudG1wLmxvZ19vYmplY3QuY2lyY2xlLmdyYXBoaWNzLmNsZWFyKCk7XG5cdFx0XHRcdFx0dGhpcy50bXAubG9nX29iamVjdC5jaXJjbGVfYXJjLmdyYXBoaWNzLmNsZWFyKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnRtcC5sb2dfb2JqZWN0LmxpbmUuZ3JhcGhpY3Muc2V0U3Ryb2tlU3R5bGUoMC4zKTtcblx0XHRcdFx0dGhpcy50bXAubG9nX29iamVjdC5saW5lLmdyYXBoaWNzLmJlZ2luU3Ryb2tlKFwiYmx1ZVwiKTtcblx0XHRcdFx0dGhpcy50bXAubG9nX29iamVjdC5saW5lLmdyYXBoaWNzLm1vdmVUbyh0aGlzLnRvdWNoU2VydmljZS5vYmplY3QuYmFjay54LCB0aGlzLnRvdWNoU2VydmljZS5vYmplY3QuYmFjay55KTtcblx0XHRcdFx0dGhpcy50bXAubG9nX29iamVjdC5saW5lLmdyYXBoaWNzLmxpbmVUbyh0aGlzLnRvdWNoU2VydmljZS5vYmplY3QudG9wLngsIHRoaXMudG91Y2hTZXJ2aWNlLm9iamVjdC50b3AueSk7XG5cdFx0XHRcdHRoaXMudG1wLmxvZ19vYmplY3QubGluZS5ncmFwaGljcy5lbmRTdHJva2UoKTtcblxuXHRcdFx0XHQvLyBDaXJjbGVcblxuXHRcdFx0XHR2YXIgZGlzdGFuY2UgPSB0aGlzLnRvdWNoU2VydmljZS5vYmplY3Quc2l6ZTtcblx0XHRcdFx0dGhpcy50bXAubG9nX29iamVjdC5jaXJjbGUuZ3JhcGhpY3Muc2V0U3Ryb2tlU3R5bGUoMSkuYmVnaW5TdHJva2UoJ2JsdWUnKS5kcmF3Q2lyY2xlKDAsIDAsIGRpc3RhbmNlKzUpO1xuXHRcdFx0XHR0aGlzLnRtcC5sb2dfb2JqZWN0LmNpcmNsZS54ID0gdGhpcy50b3VjaFNlcnZpY2Uub2JqZWN0Lm1pZGRsZS54O1xuXHRcdFx0XHR0aGlzLnRtcC5sb2dfb2JqZWN0LmNpcmNsZS55ID0gdGhpcy50b3VjaFNlcnZpY2Uub2JqZWN0Lm1pZGRsZS55O1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnN0YWdlLmNoaWxkcmVuKVxuXHRcdHRoaXMudWkudXBkYXRlKHRoaXMuc3RhZ2UsIHRoaXMudG91Y2hTZXJ2aWNlLm9iamVjdCwgdGhpcy50b3VjaFNlcnZpY2Uuc2VsZWN0X3RvdWNoZXMpO1xuXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnN0YWdlLnVwZGF0ZSgpO1xuXG5cdFx0Lyp0aGlzLm9iamVjdHMuZm9yRWFjaCgob2JqZWN0KSA9PiB7XG5cdFx0XHRvYmplY3QudXBkYXRlKCk7XG5cdFx0fSk7Ki9cblxuXG5cdH1cblxuXHRhZGQob2JqZWN0KXtcblxuXHRcdHRoaXMub2JqZWN0cy5wdXNoKG9iamVjdCk7XG5cdFx0XG5cdH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIERlYnVnU2VydmljZXtcblxuXHRjb25zdHJ1Y3Rvcigpe1xuXG5cdH1cblxuXHRkZWJ1ZyhhcHApe1xuXG5cdFx0JCgnLmxvZy10b3VjaGVzbmInKS50ZXh0KGFwcC50b3VjaFNlcnZpY2Uuc2VsZWN0X3RvdWNoZXMubGVuZ3RoKTtcblx0XHQkKCcubG9nLXRvdWNoZXNvYmplY3RuYicpLnRleHQoYXBwLnRvdWNoU2VydmljZS5vYmplY3RfdG91Y2hlcy5sZW5ndGgpO1xuXG5cdFx0Ly8gUmVuZGVyIHRvdWNoZXNcblxuXHRcdGFwcC50bXAubG9nX3RvdWNocyA9PSB1bmRlZmluZWQgPyBhcHAudG1wLmxvZ190b3VjaHMgPSBbXSA6IG51bGw7XG5cblx0XHRmb3IodmFyIGkgaW4gYXBwLnRtcC5sb2dfdG91Y2hzKXtcblx0XHRcdGFwcC50bXAubG9nX3RvdWNoc1tpXS5ncmFwaGljcy5jbGVhcigpO1xuXHRcdFx0YXBwLnN0YWdlLnJlbW92ZUNoaWxkW2FwcC50bXAubG9nX3RvdWNoc1tpXV07XG5cdFx0fVxuXG5cdFx0Xy5lYWNoKGFwcC50b3VjaFNlcnZpY2Uuc2VsZWN0X3RvdWNoZXMsIGZ1bmN0aW9uKHRvdWNoKXtcblxuXHRcdFx0YXBwLnRtcC5sb2dfdG91Y2hzW3RvdWNoLmlkZW50aWZpZXJdID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdFx0XHRhcHAudG1wLmxvZ190b3VjaHNbdG91Y2guaWRlbnRpZmllcl0uZ3JhcGhpY3MuYmVnaW5GaWxsKFwiYmx1ZVwiKS5kcmF3Q2lyY2xlKDAsIDAsIDUpO1xuXHRcdFx0YXBwLnN0YWdlLmFkZENoaWxkKGFwcC50bXAubG9nX3RvdWNoc1t0b3VjaC5pZGVudGlmaWVyXSk7XG5cdFx0XHRcblx0XHRcdGFwcC50bXAubG9nX3RvdWNoc1t0b3VjaC5pZGVudGlmaWVyXS5zZXQoe3g6IHRvdWNoLmNsaWVudFgsIHk6IHRvdWNoLmNsaWVudFl9KTtcblxuXHRcdH0sYXBwKTtcblxuXHRcdC8vIFJlbmRlciBvYmplY3RcblxuXHRcdGlmKGFwcC50b3VjaFNlcnZpY2Uub2JqZWN0ICE9PSBudWxsKXtcblxuXHRcdFx0Ly8gTGluZVxuXG5cdFx0XHRpZihhcHAudG1wLmxvZ19vYmplY3QgPT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0YXBwLnRtcC5sb2dfb2JqZWN0ID0ge307XG5cdFx0XHRcdGFwcC50bXAubG9nX29iamVjdC5saW5lID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG5cdFx0XHRcdGFwcC50bXAubG9nX29iamVjdC5jaXJjbGUgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0XHRcdFx0YXBwLnRtcC5sb2dfb2JqZWN0LmNpcmNsZV9hcmMgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcblx0XHRcdCAgICBhcHAuc3RhZ2UuYWRkQ2hpbGQoYXBwLnRtcC5sb2dfb2JqZWN0LmxpbmUpO1xuXHRcdFx0ICAgIGFwcC5zdGFnZS5hZGRDaGlsZChhcHAudG1wLmxvZ19vYmplY3QuY2lyY2xlKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRhcHAudG1wLmxvZ19vYmplY3QubGluZS5ncmFwaGljcy5jbGVhcigpO1xuXHRcdFx0XHRhcHAudG1wLmxvZ19vYmplY3QuY2lyY2xlLmdyYXBoaWNzLmNsZWFyKCk7XG5cdFx0XHRcdGFwcC50bXAubG9nX29iamVjdC5jaXJjbGVfYXJjLmdyYXBoaWNzLmNsZWFyKCk7XG5cdFx0XHR9XG5cblx0XHRcdGFwcC50bXAubG9nX29iamVjdC5saW5lLmdyYXBoaWNzLnNldFN0cm9rZVN0eWxlKDAuMyk7XG5cdFx0XHRhcHAudG1wLmxvZ19vYmplY3QubGluZS5ncmFwaGljcy5iZWdpblN0cm9rZShcImJsdWVcIik7XG5cdFx0XHRhcHAudG1wLmxvZ19vYmplY3QubGluZS5ncmFwaGljcy5tb3ZlVG8oYXBwLnRvdWNoU2VydmljZS5vYmplY3QuYmFjay54LCBhcHAudG91Y2hTZXJ2aWNlLm9iamVjdC5iYWNrLnkpO1xuXHRcdFx0YXBwLnRtcC5sb2dfb2JqZWN0LmxpbmUuZ3JhcGhpY3MubGluZVRvKGFwcC50b3VjaFNlcnZpY2Uub2JqZWN0LnRvcC54LCBhcHAudG91Y2hTZXJ2aWNlLm9iamVjdC50b3AueSk7XG5cdFx0XHRhcHAudG1wLmxvZ19vYmplY3QubGluZS5ncmFwaGljcy5lbmRTdHJva2UoKTtcblxuXHRcdFx0Ly8gQ2lyY2xlXG5cblx0XHRcdHZhciBkaXN0YW5jZSA9IE1hdGguc3FydCggKGFwcC50b3VjaFNlcnZpY2Uub2JqZWN0LmJhY2sueC1hcHAudG91Y2hTZXJ2aWNlLm9iamVjdC50b3AueCkqKGFwcC50b3VjaFNlcnZpY2Uub2JqZWN0LmJhY2sueC1hcHAudG91Y2hTZXJ2aWNlLm9iamVjdC50b3AueCkgKyAoYXBwLnRvdWNoU2VydmljZS5vYmplY3QuYmFjay55LWFwcC50b3VjaFNlcnZpY2Uub2JqZWN0LnRvcC55KSooYXBwLnRvdWNoU2VydmljZS5vYmplY3QuYmFjay55LWFwcC50b3VjaFNlcnZpY2Uub2JqZWN0LnRvcC55KSApO1xuXHRcdFx0YXBwLnRtcC5sb2dfb2JqZWN0LmNpcmNsZS5ncmFwaGljcy5zZXRTdHJva2VTdHlsZSgxKS5iZWdpblN0cm9rZSgnYmx1ZScpLmRyYXdDaXJjbGUoMCwgMCwgZGlzdGFuY2UrNSk7XG5cdFx0XHRhcHAudG1wLmxvZ19vYmplY3QuY2lyY2xlLnggPSBhcHAudG91Y2hTZXJ2aWNlLm9iamVjdC5taWRkbGUueDtcblx0XHRcdGFwcC50bXAubG9nX29iamVjdC5jaXJjbGUueSA9IGFwcC50b3VjaFNlcnZpY2Uub2JqZWN0Lm1pZGRsZS55O1xuXG5cdFx0fVxuXG5cdH1cbn0iLCJpbXBvcnQgSW50ZXJmYWNlU2V0dXAgZnJvbSAnLi9pbnRlcmZhY2VzZXR1cCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJmYWNle1xuXG5cdGNvbnN0cnVjdG9yKCl7XG5cblx0XHR0aGlzLnNldHVwID0gbmV3IEludGVyZmFjZVNldHVwKCk7XG5cdFx0dGhpcy5zdGFnZXMgPSB0aGlzLnNldHVwLmdldF9zdGFnZXMoKTtcblx0XHR0aGlzLmFjdHVhbF9zdGFnZSA9IG51bGw7XG5cblx0XHR0aGlzLm9iamVjdHMgPSBbXTtcblxuXHR9XG5cblx0dXBkYXRlKHN0YWdlLCBvYmplY3QsIHRvdWNoZXMpe1xuXG5cdFx0aWYodGhpcy5hY3R1YWxfc3RhZ2UgIT09IG51bGwpe1xuXG5cdFx0XHR2YXIgc3RhZ2Vfc2V0dXAgPSB0aGlzLnN0YWdlc1t0aGlzLmFjdHVhbF9zdGFnZV07XG5cblx0XHRcdC8vIElmIG9iamVjdHMgZm9yIHRoaXMgc3RhZ2UgZG9lc24ndCBleGlzdFxuXHRcdFx0aWYodGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXSA9PSB1bmRlZmluZWQpeyBcblx0XHRcdFx0dGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXSA9IHt9OyBcblx0XHRcdH1cblxuXHRcdFx0Ly8gVGl0bGVcblx0XHRcdGlmKHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0udGV4dCA9PSB1bmRlZmluZWQpe1xuXHRcdFx0XHR0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnRleHQgPSBuZXcgY3JlYXRlanMuVGV4dChzdGFnZV9zZXR1cC50aXRsZSwgXCI0MHB4IFJhbGV3YXlcIiwgXCIjZmY3NzAwXCIpO1xuXHRcdFx0XHR0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnRleHQueSA9IDUwO1xuXHRcdFx0XHR0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnRleHQueCA9IHN0YWdlLmNhbnZhcy53aWR0aC8yLXRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0udGV4dC5nZXRCb3VuZHMoKS53aWR0aC8yO1xuXHRcdFx0XHRzdGFnZS5hZGRDaGlsZCh0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnRleHQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSb3VuZCBhcm91bmQgdmVoaWNsZVxuXHRcdFx0aWYob2JqZWN0ICE9PSBudWxsKXsgLy8gT2JqZWN0IGlzIG9uIHRoZSB0YWJcblxuXHRcdFx0XHR2YXIgc2l6ZV9vYmplY3Rfcm91bmQgPSBvYmplY3Quc2l6ZSArIDIwMDtcblxuXHRcdFx0XHQvLyBTdGF0aWMgcGFydFxuXHRcdFx0XHRpZih0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnJvdW5kX3N0YXRpYyA9PSB1bmRlZmluZWQpe1xuXHRcdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0ucm91bmRfc3RhdGljID0gbmV3IGNyZWF0ZWpzLkJpdG1hcCgnLi4vaW1nL3JvdW5kX3N0YXRpYy5wbmcnKTtcblx0XHRcdFx0XHRzdGFnZS5hZGRDaGlsZCh0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnJvdW5kX3N0YXRpYyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEeW5hbWljIHBhcnRzXG5cdFx0XHRcdGlmKHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0ucm91bmRfZHluYW1pY3MgPT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0XHR0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnJvdW5kX2R5bmFtaWNzID0gW107XG5cdFx0XHRcdFx0dGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXS5yb3VuZF9keW5hbWljc1swXSA9IG5ldyBjcmVhdGVqcy5CaXRtYXAoJy4uL2ltZy9yb3VuZF9keW5hbWljLnBuZycpO1xuXHRcdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0ucm91bmRfZHluYW1pY3NbMV0gPSBuZXcgY3JlYXRlanMuQml0bWFwKCcuLi9pbWcvcm91bmRfZHluYW1pYzIucG5nJyk7XG5cdFx0XHRcdFx0c3RhZ2UuYWRkQ2hpbGQodGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXS5yb3VuZF9keW5hbWljc1swXSk7XG5cdFx0XHRcdFx0c3RhZ2UuYWRkQ2hpbGQodGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXS5yb3VuZF9keW5hbWljc1sxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdC8vIE1vdmUgc3RhdGljIHBhcnRcblx0XHRcdFx0aWYodGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXS5yb3VuZF9zdGF0aWMuZ2V0Qm91bmRzKCkgIT09IG51bGwpeyAvLyBJbWFnZSBpcyBsb2FkZWRcblx0XHRcdFx0XHR0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnJvdW5kX3N0YXRpYy5yZWdYID0gNTEyO1xuXHRcdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0ucm91bmRfc3RhdGljLnJlZ1kgPSA1MTI7XG5cdFx0XHRcdFx0dGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXS5yb3VuZF9zdGF0aWMuc2NhbGVYID0gc2l6ZV9vYmplY3Rfcm91bmQgLyB0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnJvdW5kX3N0YXRpYy5nZXRCb3VuZHMoKS53aWR0aDtcblx0XHRcdFx0XHR0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnJvdW5kX3N0YXRpYy5zY2FsZVkgPSBzaXplX29iamVjdF9yb3VuZCAvIHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0ucm91bmRfc3RhdGljLmdldEJvdW5kcygpLmhlaWdodDtcblx0XHRcdFx0XHR0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLnJvdW5kX3N0YXRpYy54ID0gb2JqZWN0Lm1pZGRsZS54O1xuXHRcdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0ucm91bmRfc3RhdGljLnkgPSBvYmplY3QubWlkZGxlLnk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNb3ZlIGR5bmFtaWMgcGFydHNcblx0XHRcdFx0Xy5lYWNoKHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0ucm91bmRfZHluYW1pY3MsIGZ1bmN0aW9uKHJvdW5kLCBpbmRleCl7XG5cdFx0XHRcdFx0aWYocm91bmQuZ2V0Qm91bmRzKCkgIT09IG51bGwpe1xuXHRcdFx0XHRcdFx0dmFyIF9yb3RhdGlvbiA9IG9iamVjdC5hbmdsZSoyO1xuXHRcdFx0XHRcdFx0aWYoaW5kZXggPT0gMSl7IF9yb3RhdGlvbiA9IF9yb3RhdGlvbiozOyB9XG5cdFx0XHRcdFx0XHRyb3VuZC5yZWdYID0gNTEyO1xuXHRcdFx0XHRcdFx0cm91bmQucmVnWSA9IDUxMjtcblx0XHRcdFx0XHRcdHJvdW5kLnNjYWxlWCA9IHNpemVfb2JqZWN0X3JvdW5kIC8gcm91bmQuZ2V0Qm91bmRzKCkud2lkdGg7XG5cdFx0XHRcdFx0XHRyb3VuZC5zY2FsZVkgPSBzaXplX29iamVjdF9yb3VuZCAvIHJvdW5kLmdldEJvdW5kcygpLmhlaWdodDtcblx0XHRcdFx0XHRcdHJvdW5kLnggPSBvYmplY3QubWlkZGxlLng7XG5cdFx0XHRcdFx0XHRyb3VuZC55ID0gb2JqZWN0Lm1pZGRsZS55O1xuXHRcdFx0XHRcdFx0cm91bmQucm90YXRpb24gPSBfcm90YXRpb247XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBCdXR0b25zXG5cdFx0XHRpZih0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLmJ1dHRvbnMgPT0gdW5kZWZpbmVkKXtcblxuXHRcdFx0XHR2YXIgbWFyZ2luX3kgPSA1MDtcblx0XHRcdFx0dmFyIG1hcmdpbl94ID0gMTAwO1xuXG5cdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0uYnV0dG9ucyA9IFtdO1xuXG5cdFx0XHRcdHZhciB0b3RhbF9idXR0b25zID0gc3RhZ2Vfc2V0dXAuYnV0dG9ucy5sZW5ndGg7XG5cdFx0XHRcdHZhciBwZXJfc2lkZV9idXR0b25zID0gTWF0aC5jZWlsKHRvdGFsX2J1dHRvbnMvMik7XG5cdFx0XHRcdHZhciB5X3N0ZXAgPSBNYXRoLmNlaWwoKHN0YWdlLmNhbnZhcy5oZWlnaHQtbWFyZ2luX3kqMikvcGVyX3NpZGVfYnV0dG9ucyk7XG5cdFx0XHRcdHZhciB4X3N0ZXBzID0gMjtcblxuXHRcdFx0XHR2YXIgaHRtbCA9IFwiXCI7XG5cdFx0XHRcdF8uZWFjaChzdGFnZV9zZXR1cC5idXR0b25zLCBmdW5jdGlvbihidXR0b24sIGluZGV4KXsgLy8gQ3JlYXRlIGh0bWwgZWxlbWVudHNcblxuXHRcdFx0XHRcdGlmKGluZGV4IDwgcGVyX3NpZGVfYnV0dG9ucyl7XG5cdFx0XHRcdFx0XHR2YXIgdG9wID0geV9zdGVwKmluZGV4K21hcmdpbl95K3lfc3RlcC8yO1xuXHRcdFx0XHRcdFx0dmFyIGxlZnQgPSBtYXJnaW5feDtcblx0XHRcdFx0XHRcdHZhciBzdHlsZSA9IFwidG9wOlwiK3RvcCtcInB4OyBsZWZ0OlwiK2xlZnQrXCJweDtcIjtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHZhciB0b3AgPSB5X3N0ZXAqKGluZGV4LXBlcl9zaWRlX2J1dHRvbnMpK21hcmdpbl95K3lfc3RlcC8yO1xuXHRcdFx0XHRcdFx0dmFyIHJpZ2h0ID0gbWFyZ2luX3g7XG5cdFx0XHRcdFx0XHR2YXIgc3R5bGUgPSBcInRvcDpcIit0b3ArXCJweDsgcmlnaHQ6XCIrcmlnaHQrXCJweDtcIjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRodG1sICs9IFwiPGRpdiBjbGFzcz0nanMtdHJhY2sgYnV0dG9uJyBkYXRhLWluZGV4PSdcIitpbmRleCtcIicgc3R5bGU9J1wiK3N0eWxlK1wiJz48c3Bhbj5cIitidXR0b24udGl0bGUrXCI8L3NwYW4+PGRpdiBjbGFzcz0nYnV0dG9uLWNoaWxkcyc+XCI7XG5cblx0XHRcdFx0XHRfLmVhY2goYnV0dG9uLmNoaWxkcywgZnVuY3Rpb24oY2hpbGQsIGluZGV4KXtcblx0XHRcdFx0XHRcdGh0bWwgKz0gXCI8ZGl2IGNsYXNzPSdqcy10cmFjayBjaGlsZC1idXR0b24nIGRhdGEtaW5kZXg9J1wiK2luZGV4K1wiLVwiK2luZGV4K1wiJz5cIitjaGlsZC50aXRsZStcIjwvZGl2PlwiO1xuXHRcdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHRcdFx0aHRtbCArPSBcIjwvZGl2PjwvZGl2PlwiXG5cblx0XHRcdFx0XHQvKnRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0uYnV0dG9uc1tpbmRleF0gPSBuZXcgY3JlYXRlanMuVGV4dChidXR0b24udGl0bGUsIFwiMjBweCBSYWxld2F5XCIsIFwicmVkXCIpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGluZGV4K1wiIDwgXCIrcGVyX3NpZGVfYnV0dG9ucyk7XG5cdFx0XHRcdFx0aWYoaW5kZXggPCBwZXJfc2lkZV9idXR0b25zKXtcblx0XHRcdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0uYnV0dG9uc1tpbmRleF0ueSA9IHlfc3RlcCppbmRleCttYXJnaW5feSt5X3N0ZXAvMjtcblx0XHRcdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0uYnV0dG9uc1tpbmRleF0ueCA9IG1hcmdpbl94O1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0dGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXS5idXR0b25zW2luZGV4XS55ID0geV9zdGVwKihpbmRleC1wZXJfc2lkZV9idXR0b25zKSttYXJnaW5feSt5X3N0ZXAvMjtcblx0XHRcdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0uYnV0dG9uc1tpbmRleF0ueCA9IHN0YWdlLmNhbnZhcy53aWR0aC1tYXJnaW5feC10aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLmJ1dHRvbnNbaW5kZXhdLmdldEJvdW5kcygpLndpZHRoO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMub2JqZWN0c1t0aGlzLmFjdHVhbF9zdGFnZV0uYnV0dG9uc1tpbmRleF0ub25QcmVzcyA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiVE9VQ0hFRFwiKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdGFnZS5hZGRDaGlsZCh0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLmJ1dHRvbnNbaW5kZXhdKTsqL1xuXG5cdFx0XHRcdH0sIHRoaXMpO1xuXHRcblx0XHRcdFx0JCgnLmpzLWludGVyZmFjZScpLmh0bWwoaHRtbCk7XG5cblx0XHRcdFx0Xy5lYWNoKHN0YWdlX3NldHVwLmJ1dHRvbnMsIGZ1bmN0aW9uKGJ1dHRvbiwgaW5kZXgpeyAvLyBDcmVhdGUgZXZlbnRzXG5cdFx0XHRcdFx0dGhpcy5vYmplY3RzW3RoaXMuYWN0dWFsX3N0YWdlXS5idXR0b25zW2luZGV4XSA9ICQoJy5qcy10cmFja1tkYXRhLWluZGV4PScraW5kZXgrJ10nKTtcblx0XHRcdFx0XHR0aGlzLm9iamVjdHNbdGhpcy5hY3R1YWxfc3RhZ2VdLmJ1dHRvbnNbaW5kZXhdLmJpbmQoJ3RvdWNoc3RhcnQnLGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0XHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLXNlbGVjdGVkJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0sIHRoaXMpO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIE1vdmUgaW50ZXJmYWNlXG5cdFx0XHR2YXIgb2Zmc2V0X3ggPSAwO1xuXHRcdFx0dmFyIG9mZnNldF95ID0gMDtcblx0XHRcdGlmKG9iamVjdCAhPT0gbnVsbCl7XG5cdFx0XHRcdHZhciBvZmZzZXRfeCA9IChvYmplY3QubWlkZGxlLngvc3RhZ2UuY2FudmFzLndpZHRoKjEwMCktNTA7XG5cdFx0XHRcdHZhciBvZmZzZXRfeSA9IChvYmplY3QubWlkZGxlLnkvc3RhZ2UuY2FudmFzLmhlaWdodCoxMDApLTUwO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCcuanMtaW50ZXJmYWNlJykuY3NzKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGUzZCgnK29mZnNldF94KydweCwgJytvZmZzZXRfeSsncHgsIDApJylcblxuXHRcdH1cblxuXHR9XG5cblx0c2V0X3N0YWdlKGlkKXtcblx0XHR0aGlzLmFjdHVhbF9zdGFnZSA9IGlkO1xuXHR9XG5cblxuXG5cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRlcmZhY2VTZXR1cHtcblxuXHRjb25zdHJ1Y3Rvcigpe1xuXG5cdFx0dGhpcy5zdGFnZXMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdHRpdGxlOiBcIsOJdGFwZSAxXCIsXG5cdFx0XHRcdGlkOiBcInN0ZXAxXCIsXG5cdFx0XHRcdGJ1dHRvbnM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0aXRsZTogXCJidXR0b24gMVwiLFxuXHRcdFx0XHRcdFx0Y2hpbGRzOiBbXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogXCJzdWIxXCJcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcInN1YjJcIlxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IFwic3ViM1wiXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRpdGxlOiBcImJ1dHRvbiAyXCIsXG5cdFx0XHRcdFx0XHRjaGlsZHM6IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcInN1YjFcIlxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IFwic3ViMlwiXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogXCJzdWIzXCJcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcInN1YjRcIlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0aXRsZTogXCJidXR0b24gM1wiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0aXRsZTogXCJidXR0b24gNFwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0XTtcblxuXHR9XG5cblx0Z2V0X3N0YWdlcygpe1xuXHRcdHJldHVybiB0aGlzLnN0YWdlcztcblx0fVxuXG5cdGdldF9zdGFnZShpZCl7XG5cblx0fVxuXG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUb3VjaFNlcnZpY2V7XG5cblx0Y29uc3RydWN0b3IoY2FudmFzLG9wdHMpe1xuXG5cdFx0dGhpcy5jYW52YXMgPSBjYW52YXM7XG5cdFx0dGhpcy5vcHRzID0gb3B0cztcblxuXHRcdHRoaXMuc2VsZWN0X3RvdWNoZXMgPSBbXTtcblx0XHR0aGlzLm9iamVjdF90b3VjaGVzID0gW107XG5cdFx0dGhpcy5vYmplY3QgPSBudWxsO1xuXG5cdFx0dGhpcy50bXAgPSB7fTtcblxuXHRcdHRoaXMuaW5pdF9ldmVudHMoKTtcblx0XHR0aGlzLmluaXRfbW9kZXMoKTtcblx0XHR0aGlzLnNldF9tb2RlKCdXQUlUSU5HJyk7XG5cblx0XHRpZih0aGlzLm9wdHMuc2ltdWxhdGUgPT09IHRydWUpe1xuXHRcdFx0dGhpcy5zaW11bGF0ZV90b3VjaGVzKCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tXG5cdC8vIE1vZGVzIHByb2Nlc3Npbmdcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHVwZGF0ZV9zdGF0dXMoc3RhdHVzKXtcblx0XHQkKCcubG9nLXN0YXR1cycpLnRleHQoc3RhdHVzKTtcblx0fVxuXG5cdGluaXRfbW9kZXMoKXtcblxuXHR9XG5cblx0c2V0X21vZGUobW9kZSl7XG5cblx0XHRpZihtb2RlID09IFwiV0FJVElOR1wiKXtcblxuXHRcdFx0dGhpcy51cGRhdGVfc3RhdHVzKCd3YWl0aW5nIG9iamVjdCcpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnRtcC5tb2RlID0ge1xuXHRcdFx0XHRzdGVwOiAwXG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdvYmplY3RfdG91Y2hlc19hZGRlZCcsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwicmVjZXZpZWQgXCIrdGhhdC5vYmplY3RfdG91Y2hlcy5sZW5ndGgpXG5cblx0XHRcdFx0aWYodGhhdC5vYmplY3RfdG91Y2hlcy5sZW5ndGggPT0gMil7XG5cdFx0XHRcdFx0dGhhdC51cGRhdGVfc3RhdHVzKCd1c2UgcmVjb2duaXplZCBvYmplY3QnKTtcblx0XHRcdFx0XHR0aGF0LnJlY29nbml6ZV9vYmplY3QodGhhdC5vYmplY3RfdG91Y2hlcyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSk7XG5cblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ29iamVjdF9yZW1vdmVkJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHR0aGF0Lm9iamVjdCA9IG51bGw7IFxuXHRcdFx0XHR0aGF0LnVwZGF0ZV9zdGF0dXMoJ3dhaXRpbmcgb2JqZWN0IGFmdGVyIHJlbW92ZWQnKTtcblx0XHRcdH0pO1xuXG5cblx0XHR9XG5cblx0fVxuXG5cdC8qXG5cdFx0dXBkYXRlX29iamVjdCgpXG5cdFx0LS0tXG5cdFx0QXBwZWzDqSBkZSBsJ2V4dMOpcmlldXIgcG91ciBtZXR0cmUgw6Agam91ciBsZSB0cmFjw6kgZGUgbCdvYmpldFx0XG5cdCovXG5cblx0dXBkYXRlX29iamVjdCgpe1xuXG5cdFx0aWYodGhpcy5vYmplY3QgIT0gbnVsbCl7XG5cdFx0XHR0aGlzLnJlY29nbml6ZV9vYmplY3QodGhpcy5vYmplY3RfdG91Y2hlcyk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKlxuXHRcdHJlY29nbml6ZV9vYmplY3QodG91Y2hlcylcblx0XHQtLS1cblx0XHRSZWNvbm5haXQgbCdvYmpldCDDoCBwYXJ0aXIgZCd1bmUgbGlzdGUgZCdpZGVudGlmaWVycyBkZSB0b3VjaGVzXHRcblx0Ki9cblxuXHRyZWNvZ25pemVfb2JqZWN0KHRvdWNoZXMpe1xuXG5cdFx0Lyp2YXIgX3RvdWNoZXMgPSBbXTtcblx0XHRcblx0XHRfLmVhY2godGhpcy50b3VjaGVzLCBmdW5jdGlvbihyZWdpc3RlcmVkX3RvdWNoKXtcblx0XHRcdGlmKHRvdWNoZXMuaW5kZXhPZihyZWdpc3RlcmVkX3RvdWNoLmlkZW50aWZpZXIpICE9PSAtMSl7XG5cdFx0XHRcdF90b3VjaGVzLnB1c2gocmVnaXN0ZXJlZF90b3VjaCk7XG5cdFx0XHR9XG5cdFx0fSx0aGlzKTtcblxuXHRcdGNvbnNvbGUubG9nKFwidG91Y2hlcyBpbiByZWNvZ25pemVcIik7XG5cdFx0Y29uc29sZS5sb2coX3RvdWNoZXMpXG5cblx0XHR0b3VjaGVzID0gX3RvdWNoZXM7Ki9cblxuXHRcdHZhciBwb2ludF9ib3R0b20gPSB7XG5cdFx0XHR4IDogdG91Y2hlc1swXS5jbGllbnRYLFxuXHRcdFx0eSA6IHRvdWNoZXNbMF0uY2xpZW50WVxuXHRcdH1cblxuXHRcdHZhciBwb2ludF90b3AgPSB7XG5cdFx0XHR4IDogdG91Y2hlc1sxXS5jbGllbnRYLFxuXHRcdFx0eSA6IHRvdWNoZXNbMV0uY2xpZW50WVxuXHRcdH1cblxuXHRcdC8vIENhbGN1bGF0ZSB0aGUgbWlkcG9pbnRcblxuXHRcdHZhciBwb2ludF9taWRkbGUgPSB7XG5cdFx0XHR4OiAocG9pbnRfYm90dG9tLngrcG9pbnRfdG9wLngpLzIsXG5cdFx0XHR5OiAocG9pbnRfYm90dG9tLnkrcG9pbnRfdG9wLnkpLzJcblx0XHR9XG5cblx0XHQvLyBBZGQgdGhlIG9iamVjdFxuXG5cdFx0dGhpcy5vYmplY3QgPSB7XG5cdFx0XHRiYWNrIDogcG9pbnRfYm90dG9tLFxuXHRcdFx0dG9wIDogcG9pbnRfdG9wLFxuXHRcdFx0bWlkZGxlIDogcG9pbnRfbWlkZGxlXG5cdFx0fVxuXG5cdFx0dGhpcy5vYmplY3Quc2l6ZSA9IE1hdGguc3FydCggKHRoaXMub2JqZWN0LmJhY2sueC10aGlzLm9iamVjdC50b3AueCkqKHRoaXMub2JqZWN0LmJhY2sueC10aGlzLm9iamVjdC50b3AueCkgKyAodGhpcy5vYmplY3QuYmFjay55LXRoaXMub2JqZWN0LnRvcC55KSoodGhpcy5vYmplY3QuYmFjay55LXRoaXMub2JqZWN0LnRvcC55KSApO1xuXHRcdHRoaXMub2JqZWN0LmFuZ2xlID0gIE1hdGguYXRhbjIodGhpcy5vYmplY3QudG9wLnkgLSB0aGlzLm9iamVjdC5iYWNrLnksIHRoaXMub2JqZWN0LnRvcC54IC0gdGhpcy5vYmplY3QuYmFjay54KSAqIDE4MCAvIE1hdGguUEk7XG5cblx0fVxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIEV2ZW50cyBwcm9jZXNzaW5nXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cblx0aW5pdF9ldmVudHMoKXtcblxuXHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdHRoaXMuY2FudmFzLm9uKCd0b3VjaGVuZCcsZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0dGhhdC5wcm9jZXNzX3RvdWNoZW5kKGV2ZW50KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuY2FudmFzLm9uKCd0b3VjaHN0YXJ0JyxmdW5jdGlvbihldmVudCl7XG5cdFx0XHR0aGF0LnByb2Nlc3NfdG91Y2hzdGFydChldmVudCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmNhbnZhcy5vbigndG91Y2htb3ZlJyxmdW5jdGlvbihldmVudCl7XG5cdFx0XHR0aGF0LnByb2Nlc3NfdG91Y2htb3ZlKGV2ZW50KTtcblx0XHR9KTtcblxuXHR9XG5cblx0cHJvY2Vzc190b3VjaHN0YXJ0KGV2ZW50KXtcblxuXHRcdGNvbnNvbGUubG9nKFwiRVZFTlQgLSB0b3VjaHN0YXJ0XCIpO1xuXHRcdGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd0b3VjaF91bmlxJywge2RldGFpbDogZXZlbnR9KSk7XG5cblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRfLmVhY2goZXZlbnQub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcywgZnVuY3Rpb24odG91Y2gpeyBcblxuXHRcdFx0Ly8gQ2hvb3NlIGJldHdlZW4gdGhhdC5zZWxlY3RfdG91Y2hlcyAmIHRoYXQub2JqZWN0X3RvdWNoZXNcblxuXHRcdFx0aWYodGhhdC5vYmplY3RfdG91Y2hlcy5sZW5ndGggPT0gMil7IC8vIElmIG9iamVjdCBpcyBhbHJlYWR5IG9uIHRhYiwgaXQncyBhIGZpbmdlclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImFkZCBzIGEgZmluZ2VyXCIpO1xuXHRcdFx0XHR0aGF0LnNlbGVjdF90b3VjaGVzLnB1c2godG91Y2gpO1xuXHRcdFx0fWVsc2V7IC8vIEVpdGhlciwgaXQncyB0aGUgb2JqZWN0XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiYWRkIGFuIG9iamVjdFwiKTtcblx0XHRcdFx0dGhhdC5vYmplY3RfdG91Y2hlcy5wdXNoKHRvdWNoKTtcblx0XHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ29iamVjdF90b3VjaGVzX2FkZGVkJykpO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0fVxuXG5cdHByb2Nlc3NfdG91Y2hlbmQoZXZlbnQpe1xuXG5cdFx0Y29uc29sZS5sb2coXCJFVkVOVCAtIHRvdWNoZW5kXCIpO1xuXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0Ly8gSXMgdGhpcyBhIGZpbmdlciA/XG5cblx0XHRmb3IodmFyIGl0b3VjaCBpbiBldmVudC5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzKXsgLy8gRm9yIGVhY2ggdG91Y2hcblxuXHRcdFx0Ly8gRGV0ZXJtaW5lIGlmIHRvdWNoIGlzIGEgb2JqZWN0IG9yIGEgZmluZ2VyXG5cdFx0XHR2YXIgaXNfdHlwZSA9IG51bGw7XG5cblx0XHRcdC8vIElzIHRoaXMgYSBmaW5nZXIgP1xuXHRcdFx0Zm9yKHZhciBpID0gdGhhdC5zZWxlY3RfdG91Y2hlcy5sZW5ndGggLTE7IGkgPj0gMCA7IGktLSl7XG5cdFx0XHQgICAgaWYodGhhdC5zZWxlY3RfdG91Y2hlc1tpXS5pZGVudGlmaWVyID09IGV2ZW50Lm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbaXRvdWNoXS5pZGVudGlmaWVyKXtcblx0XHRcdCAgICBcdGNvbnNvbGUubG9nKCdyZW1vdmUgYSBmaW5nZXInKTtcblx0XHRcdCAgICAgICAgdGhhdC5zZWxlY3RfdG91Y2hlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHQgICAgICAgIGlzX3R5cGUgPSBcImZpbmdlclwiO1xuXHRcdFx0ICAgIH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSXMgdGhpcyBhbiBvYmplY3QgP1xuXHRcdFx0Zm9yKHZhciBpID0gdGhhdC5vYmplY3RfdG91Y2hlcy5sZW5ndGggLTE7IGkgPj0gMCA7IGktLSl7XG5cdFx0XHQgICAgaWYodGhhdC5vYmplY3RfdG91Y2hlc1tpXS5pZGVudGlmaWVyID09IGV2ZW50Lm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbaXRvdWNoXS5pZGVudGlmaWVyKXtcblx0XHRcdCAgICBcdGNvbnNvbGUubG9nKCdyZW1vdmUgYW4gb2JqZWN0Jyk7XG5cdFx0XHQgICAgICAgIGlzX3R5cGUgPSBcIm9iamVjdFwiO1xuXHRcdFx0ICAgIH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgaXQncyBhbiBvYmplY3Rcblx0XHRcdGlmKGlzX3R5cGUgPT0gXCJvYmplY3RcIil7XG5cdFx0XHRcdHRoYXQub2JqZWN0X3RvdWNoZXMgPSBbXTtcblx0XHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ29iamVjdF9yZW1vdmVkJykpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxuXHRwcm9jZXNzX3RvdWNobW92ZShldmVudCl7XG5cblx0XHRjb25zb2xlLmxvZyhcIkVWRU5UIC0gdG91Y2htb3ZlXCIpO1xuXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0Xy5lYWNoKGV2ZW50Lm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMsIGZ1bmN0aW9uKHRvdWNoKXsgXG5cdFx0XHRmb3IodmFyIGkgaW4gdGhhdC50b3VjaGVzKXtcblx0XHRcdFx0aWYodG91Y2guaWRlbnRpZmllciA9PSB0aGF0LnRvdWNoZXNbaV0uaWRlbnRpZmllcil7XG5cdFx0XHRcdFx0dGhhdC50b3VjaGVzW2ldID0gdG91Y2g7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHR9XG5cblx0Ly8gLS0tLS0tLS0tLS1cblx0Ly8gRGVidWcgdG9vbHNcblx0Ly8gLS0tLS0tLS0tLS1cblxuXHRzaW11bGF0ZV90b3VjaGVzKCl7XG5cblx0XHR2YXIgc2ltdWxhdGVfY29vcmRpbmF0ZXMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdGNsaWVudFg6ICQod2luZG93KS53aWR0aCgpLzIgLSAzMDAsXG5cdFx0XHRcdGNsaWVudFk6ICQod2luZG93KS5oZWlnaHQoKS8yLFxuXHRcdFx0XHR0aW1lOiAxMDAwLFxuXHRcdFx0XHRpZGVudGlmaWVyOiA5OSxcblx0XHRcdFx0ZXZlbnRfbmFtZTogXCJ0b3VjaHN0YXJ0XCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGNsaWVudFg6IG51bGwsXG5cdFx0XHRcdGNsaWVudFk6IG51bGwsXG5cdFx0XHRcdHRpbWU6IDEyMDAsXG5cdFx0XHRcdGlkZW50aWZpZXI6IDk5LFxuXHRcdFx0XHRldmVudF9uYW1lOiBcInRvdWNoZW5kXCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGNsaWVudFg6ICQod2luZG93KS53aWR0aCgpLzIsXG5cdFx0XHRcdGNsaWVudFk6ICQod2luZG93KS5oZWlnaHQoKS8yIC0gNTAsXG5cdFx0XHRcdHRpbWU6IDE0MDAsXG5cdFx0XHRcdGlkZW50aWZpZXI6IDkwLFxuXHRcdFx0XHRldmVudF9uYW1lOiBcInRvdWNoc3RhcnRcIlxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0Y2xpZW50WDogbnVsbCxcblx0XHRcdFx0Y2xpZW50WTogbnVsbCxcblx0XHRcdFx0dGltZTogMTYwMCxcblx0XHRcdFx0aWRlbnRpZmllcjogOTAsXG5cdFx0XHRcdGV2ZW50X25hbWU6IFwidG91Y2hlbmRcIlxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0Y2xpZW50WDogJCh3aW5kb3cpLndpZHRoKCkvMixcblx0XHRcdFx0Y2xpZW50WTogJCh3aW5kb3cpLmhlaWdodCgpLzIgKyA1MCxcblx0XHRcdFx0dGltZTogMTgwMCxcblx0XHRcdFx0aWRlbnRpZmllcjogOTEsXG5cdFx0XHRcdGV2ZW50X25hbWU6IFwidG91Y2hzdGFydFwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRjbGllbnRYOiAkKHdpbmRvdykud2lkdGgoKS8yIC0gMTUwLFxuXHRcdFx0XHRjbGllbnRZOiAkKHdpbmRvdykuaGVpZ2h0KCkvMixcblx0XHRcdFx0dGltZTogMjAwMCxcblx0XHRcdFx0aWRlbnRpZmllcjogOTIsXG5cdFx0XHRcdGV2ZW50X25hbWU6IFwidG91Y2hzdGFydFwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRjbGllbnRYOiAkKHdpbmRvdykud2lkdGgoKS8yLFxuXHRcdFx0XHRjbGllbnRZOiAkKHdpbmRvdykuaGVpZ2h0KCkvMiAtIDUwLFxuXHRcdFx0XHR0aW1lOiAyMjAwLFxuXHRcdFx0XHRpZGVudGlmaWVyOiA5Myxcblx0XHRcdFx0ZXZlbnRfbmFtZTogXCJ0b3VjaHN0YXJ0XCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGNsaWVudFg6IG51bGwsXG5cdFx0XHRcdGNsaWVudFk6IG51bGwsXG5cdFx0XHRcdHRpbWU6IDI3MDAsXG5cdFx0XHRcdGlkZW50aWZpZXI6IDkxLFxuXHRcdFx0XHRldmVudF9uYW1lOiBcInRvdWNoZW5kXCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGNsaWVudFg6ICQod2luZG93KS53aWR0aCgpLzIgLSAxNTAsXG5cdFx0XHRcdGNsaWVudFk6ICQod2luZG93KS5oZWlnaHQoKS8yIC0gMTAwLFxuXHRcdFx0XHR0aW1lOiAzMDAwLFxuXHRcdFx0XHRpZGVudGlmaWVyOiA5NCxcblx0XHRcdFx0ZXZlbnRfbmFtZTogXCJ0b3VjaHN0YXJ0XCJcblx0XHRcdH1cblx0XHRdO1xuXG5cdFx0dmFyIGluZGV4ID0gMDtcblx0XHRfLmVhY2goc2ltdWxhdGVfY29vcmRpbmF0ZXMsIGZ1bmN0aW9uKGNvb3JkKXtcblxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXG5cdFx0XHRcdHZhciBlID0gbmV3IGpRdWVyeS5FdmVudChjb29yZC5ldmVudF9uYW1lKTtcblx0XHRcdFx0ZS5vcmlnaW5hbEV2ZW50ID0ge1xuXHRcdFx0XHRcdGNoYW5nZWRUb3VjaGVzIDoge1xuXHRcdFx0XHRcdFx0MCA6IHtcblx0XHRcdFx0XHRcdFx0Y2xpZW50WDogY29vcmQuY2xpZW50WCxcblx0XHRcdFx0XHRcdFx0Y2xpZW50WTogY29vcmQuY2xpZW50WSxcblx0XHRcdFx0XHRcdFx0aWRlbnRpZmllcjogY29vcmQuaWRlbnRpZmllclxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dGhhdC5jYW52YXMudHJpZ2dlcihlKTtcblxuXHRcdFx0fSwgY29vcmQudGltZSk7IFxuXHRcdFx0aW5kZXgrKztcblxuXHRcdH0sIHRoaXMpO1xuXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdFx0Zm9yKHZhciBpIGluIHRoYXQudG91Y2hlcyl7XG5cdFx0XHRcdFx0aWYodGhhdC5vYmplY3RfdG91Y2hlcy5pbmRleE9mKHRoYXQudG91Y2hlc1tpXS5pZGVudGlmaWVyKSAhPSAtMSl7XG5cdFx0XHRcdFx0XHR0aGF0LnRvdWNoZXNbaV0uY2xpZW50WCArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApLTU7XG5cdFx0XHRcdFx0XHR0aGF0LnRvdWNoZXNbaV0uY2xpZW50WSArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApLTU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LDEwMCk7XG5cblx0XHR9LDMxMDApO1xuXG5cdH1cblxufSJdfQ==
