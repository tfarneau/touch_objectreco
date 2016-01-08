import InterfaceSetup from './interfacesetup';


export default class Interface{

	constructor(){

		this.setup = new InterfaceSetup();
		this.stages = this.setup.get_stages();
		this.actual_stage = null;

		this.objects = [];

	}

	update(stage, object, touches){

		if(this.actual_stage !== null){

			var stage_setup = this.stages[this.actual_stage];

			// If objects for this stage doesn't exist
			if(this.objects[this.actual_stage] == undefined){ 
				this.objects[this.actual_stage] = {}; 
			}

			// Title
			if(this.objects[this.actual_stage].text == undefined){
				this.objects[this.actual_stage].text = new createjs.Text(stage_setup.title, "40px Raleway", "#ff7700");
				this.objects[this.actual_stage].text.y = 50;
				this.objects[this.actual_stage].text.x = stage.canvas.width/2-this.objects[this.actual_stage].text.getBounds().width/2;
				stage.addChild(this.objects[this.actual_stage].text);
			}

			// Round around vehicle
			if(object !== null){ // Object is on the tab

				var size_object_round = object.size + 200;

				// Static part
				if(this.objects[this.actual_stage].round_static == undefined){
					this.objects[this.actual_stage].round_static = new createjs.Bitmap('../img/round_static.png');
					stage.addChild(this.objects[this.actual_stage].round_static);
				}

				// Dynamic parts
				if(this.objects[this.actual_stage].round_dynamics == undefined){
					this.objects[this.actual_stage].round_dynamics = [];
					this.objects[this.actual_stage].round_dynamics[0] = new createjs.Bitmap('../img/round_dynamic.png');
					this.objects[this.actual_stage].round_dynamics[1] = new createjs.Bitmap('../img/round_dynamic2.png');
					stage.addChild(this.objects[this.actual_stage].round_dynamics[0]);
					stage.addChild(this.objects[this.actual_stage].round_dynamics[1]);
				}
				
				// Move static part
				if(this.objects[this.actual_stage].round_static.getBounds() !== null){ // Image is loaded
					this.objects[this.actual_stage].round_static.regX = 512;
					this.objects[this.actual_stage].round_static.regY = 512;
					this.objects[this.actual_stage].round_static.scaleX = size_object_round / this.objects[this.actual_stage].round_static.getBounds().width;
					this.objects[this.actual_stage].round_static.scaleY = size_object_round / this.objects[this.actual_stage].round_static.getBounds().height;
					this.objects[this.actual_stage].round_static.x = object.middle.x;
					this.objects[this.actual_stage].round_static.y = object.middle.y;
				}

				// Move dynamic parts
				_.each(this.objects[this.actual_stage].round_dynamics, function(round, index){
					if(round.getBounds() !== null){
						var _rotation = object.angle*2;
						if(index == 1){ _rotation = _rotation*3; }
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
			if(this.objects[this.actual_stage].buttons == undefined){

				var margin_y = 50;
				var margin_x = 100;

				this.objects[this.actual_stage].buttons = [];

				var total_buttons = stage_setup.buttons.length;
				var per_side_buttons = Math.ceil(total_buttons/2);
				var y_step = Math.ceil((stage.canvas.height-margin_y*2)/per_side_buttons);
				var x_steps = 2;

				var html = "";
				_.each(stage_setup.buttons, function(button, index){ // Create html elements

					if(index < per_side_buttons){
						var top = y_step*index+margin_y+y_step/2;
						var left = margin_x;
						var style = "top:"+top+"px; left:"+left+"px;";
					}else{
						var top = y_step*(index-per_side_buttons)+margin_y+y_step/2;
						var right = margin_x;
						var style = "top:"+top+"px; right:"+right+"px;";
					}

					html += "<div class='js-track button' data-index='"+index+"' style='"+style+"'><span>"+button.title+"</span><div class='button-childs'>";

					_.each(button.childs, function(child, index){
						html += "<div class='js-track child-button' data-index='"+index+"-"+index+"'>"+child.title+"</div>";
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

				}, this);
	
				$('.js-interface').html(html);

				_.each(stage_setup.buttons, function(button, index){ // Create events
					this.objects[this.actual_stage].buttons[index] = $('.js-track[data-index='+index+']');
					this.objects[this.actual_stage].buttons[index].bind('touchstart',function(event){
						$(this).toggleClass('is-selected');
					});
				}, this);

			}

			// Move interface
			var offset_x = 0;
			var offset_y = 0;
			if(object !== null){
				var offset_x = (object.middle.x/stage.canvas.width*100)-50;
				var offset_y = (object.middle.y/stage.canvas.height*100)-50;
			}

			$('.js-interface').css('transform','translate3d('+offset_x+'px, '+offset_y+'px, 0)')

		}

	}

	set_stage(id){
		this.actual_stage = id;
	}




}