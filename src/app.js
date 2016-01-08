// import Cube from './3d/cube';
// Modules

import TouchService from './modules/touchservice';

export default class App{

	constructor(){

		this.settings = {
			debug: true,
			simulate_touch: false
		};

		this.tmp = {};

		this.objects = [];

		this.createScene();
		this.touchService = new TouchService(this.canvas,{
			simulate: this.settings.simulate_touch
		});
		this.render();

		// this.touchService.

		// this.stage.touchstart = function(e){
		// 	console.log("coucou")
		// }

		// Multi-touch

		/*
			this.add(new Cube({
				width: 2,
				height: 2,
				depth: 2
			}));
		 */

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

		if(this.settings.debug == true){

			$('.log-touchesnb').text(this.touchService.touches.length);

			// Render touches

			this.tmp.log_touchs == undefined ? this.tmp.log_touchs = [] : null;

			for(var i in this.tmp.log_touchs){
				this.tmp.log_touchs[i].graphics.clear();
				this.stage.removeChild[this.tmp.log_touchs[i]];
			}

			_.each(this.touchService.touches, function(touch){

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

				var distance = Math.sqrt( (this.touchService.object.back.x-this.touchService.object.top.x)*(this.touchService.object.back.x-this.touchService.object.top.x) + (this.touchService.object.back.y-this.touchService.object.top.y)*(this.touchService.object.back.y-this.touchService.object.top.y) );
				this.tmp.log_object.circle.graphics.setStrokeStyle(1).beginStroke('blue').drawCircle(0, 0, distance+5);
				this.tmp.log_object.circle.x = this.touchService.object.middle.x;
				this.tmp.log_object.circle.y = this.touchService.object.middle.y;

				// Circle arc


			}

		}

		requestAnimationFrame(() => {
			this.render();
		});

		this.objects.forEach((object) => {
			object.update();
		});

		this.stage.update();

	}

	add(object){

		this.objects.push(object);
		
	}

}