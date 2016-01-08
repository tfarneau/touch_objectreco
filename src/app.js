// import Cube from './3d/cube';
// Modules

import TouchService from './modules/touchservice';
import DebugService from './modules/debugservice';
import Interface from './modules/interface';

export default class App{

	constructor(){

		// this.debugService = new DebugService();
		this.ui = new Interface();
		this.ui.set_stage(0);

		this.settings = {
			debug: false,
			simulate_touch: false
		};

		this.tmp = {};

		this.createScene();
		this.touchService = new TouchService(this.canvas,{
			simulate: this.settings.simulate_touch
		});

		this.render();

	}

	createScene(){

		this.canvas = $('#main_canvas');
		this.canvas.attr('width',$(window).width());
		this.canvas.attr('height',$(window).height());

		this.stage = new createjs.Stage('main_canvas');

		createjs.Touch.enable(this.stage);
		createjs.Ticker.setFPS(24);

	}

	render(){

		this.touchService.update_object();

		$('.log-touchesnb').text(this.touchService.select_touches.length);
		$('.log-touchesobjectnb').text(this.touchService.object_touches.length);

		if(this.settings.debug == true){ 

			// Render touches

			this.tmp.log_touchs == undefined ? this.tmp.log_touchs = [] : null;

			for(var i in this.tmp.log_touchs){
				this.tmp.log_touchs[i].graphics.clear();
				this.stage.removeChild[this.tmp.log_touchs[i]];
			}

			_.each(this.touchService.select_touches, function(touch){

				this.tmp.log_touchs[touch.identifier] = new createjs.Shape();
				this.tmp.log_touchs[touch.identifier].graphics.beginFill("blue").drawCircle(0, 0, 5);
				this.stage.addChild(this.tmp.log_touchs[touch.identifier]);
				
				this.tmp.log_touchs[touch.identifier].set({x: touch.clientX, y: touch.clientY});

			},this);

			// Render object

			if(this.touchService.object !== null){

				// Line

				if(this.tmp.log_object == undefined){
					this.tmp.log_object = {};
					this.tmp.log_object.line = new createjs.Shape();
					this.tmp.log_object.circle = new createjs.Shape();
					this.tmp.log_object.circle_arc = new createjs.Shape();
				    this.stage.addChild(this.tmp.log_object.line);
				    this.stage.addChild(this.tmp.log_object.circle);
				}else{
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
				this.tmp.log_object.circle.graphics.setStrokeStyle(1).beginStroke('blue').drawCircle(0, 0, distance+5);
				this.tmp.log_object.circle.x = this.touchService.object.middle.x;
				this.tmp.log_object.circle.y = this.touchService.object.middle.y;

			}

		}

		// console.log(this.stage.children)
		this.ui.update(this.stage, this.touchService.object, this.touchService.select_touches);

		requestAnimationFrame(() => {
			this.render();
		});

		this.stage.update();

		/*this.objects.forEach((object) => {
			object.update();
		});*/


	}

	add(object){

		this.objects.push(object);
		
	}

}