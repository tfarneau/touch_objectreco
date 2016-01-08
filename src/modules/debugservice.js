export default class DebugService{

	constructor(){

	}

	debug(app){

		$('.log-touchesnb').text(app.touchService.select_touches.length);
		$('.log-touchesobjectnb').text(app.touchService.object_touches.length);

		// Render touches

		app.tmp.log_touchs == undefined ? app.tmp.log_touchs = [] : null;

		for(var i in app.tmp.log_touchs){
			app.tmp.log_touchs[i].graphics.clear();
			app.stage.removeChild[app.tmp.log_touchs[i]];
		}

		_.each(app.touchService.select_touches, function(touch){

			app.tmp.log_touchs[touch.identifier] = new createjs.Shape();
			app.tmp.log_touchs[touch.identifier].graphics.beginFill("blue").drawCircle(0, 0, 5);
			app.stage.addChild(app.tmp.log_touchs[touch.identifier]);
			
			app.tmp.log_touchs[touch.identifier].set({x: touch.clientX, y: touch.clientY});

		},app);

		// Render object

		if(app.touchService.object !== null){

			// Line

			if(app.tmp.log_object == undefined){
				app.tmp.log_object = {};
				app.tmp.log_object.line = new createjs.Shape();
				app.tmp.log_object.circle = new createjs.Shape();
				app.tmp.log_object.circle_arc = new createjs.Shape();
			    app.stage.addChild(app.tmp.log_object.line);
			    app.stage.addChild(app.tmp.log_object.circle);
			}else{
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

			var distance = Math.sqrt( (app.touchService.object.back.x-app.touchService.object.top.x)*(app.touchService.object.back.x-app.touchService.object.top.x) + (app.touchService.object.back.y-app.touchService.object.top.y)*(app.touchService.object.back.y-app.touchService.object.top.y) );
			app.tmp.log_object.circle.graphics.setStrokeStyle(1).beginStroke('blue').drawCircle(0, 0, distance+5);
			app.tmp.log_object.circle.x = app.touchService.object.middle.x;
			app.tmp.log_object.circle.y = app.touchService.object.middle.y;

		}

	}
}