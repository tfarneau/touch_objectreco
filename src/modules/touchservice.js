export default class TouchService{

	constructor(canvas,opts){

		this.canvas = canvas;
		this.opts = opts;

		this.touches = [];
		this.object_touches = [];
		this.object = null;

		this.tmp = {};

		this.init_events();
		this.init_modes();
		this.set_mode('WAITING');

		if(this.opts.simulate === true){
			this.simulate_touches();
		}

	}

	// ----------------
	// Modes processing
	// ----------------

	update_status(status){
		$('.log-status').text(status);
	}

	init_modes(){

	}

	set_mode(mode){

		if(mode == "WAITING"){

			this.update_status('waiting object');
			
			this.tmp.mode = {
				step: 0
			};

			var that = this;
			document.addEventListener('touches_added', function(){
				if(that.object_touches.length < 3 ){

					that.object_touches.push(that.touches[that.touches.length-1].identifier);

					if(that.object_touches.length == 3){
						that.update_status('use recognized object');
						that.recognize_object(that.object_touches);
					}

				}
			});

			document.addEventListener('touch_removed', function(event,data){
				for(var i in that.object_touches){
					if(that.object_touches[i] == event.detail){
						that.object_touches.splice(i,1);
					}
				}
				if(that.object_touches.length < 3 ){ 
					that.object = null; 
					that.update_status('waiting object after removed');
				}
			});


		}

	}

	/*
		update_object()
		---
		Appelé de l'extérieur pour mettre à jour le tracé de l'objet	
	*/

	update_object(){

		if(this.object != null){
			this.recognize_object(this.object_touches);
		}

	}

	/*
		recognize_object(touches)
		---
		Reconnait l'objet à partir d'une liste d'identifiers de touches	
	*/

	recognize_object(touches){

		var _touches = [];
		
		_.each(this.touches, function(registered_touch){
			if(touches.indexOf(registered_touch.identifier) !== -1){
				_touches.push(registered_touch);
			}
		},this);

		touches = _touches;

		// Get distances

		var distances = [];
		var mindistance = 999*999;
		var mindistance_identifier = null;

		for(var i in touches){
			var touch1 = touches[i];
			for(var j in touches){
				var touch2 = touches[j];
				if(touch1.identifier !== touch2.identifier){
					var _identifier = touch1.identifier+"|"+touch2.identifier;
					distances[_identifier] = Math.sqrt( (touch1.clientX-touch2.clientX)*(touch1.clientX-touch2.clientX) + (touch1.clientY-touch2.clientY)*(touch1.clientY-touch2.clientY) );
					if(distances[_identifier] < mindistance){
						mindistance = distances[_identifier];
						mindistance_identifier = _identifier;
					}
				}
			}
		}

		// Get the 2 points of the smallest distance

		var points = [];
		var last_point = null;
		var identifiers = mindistance_identifier.split('|');

		for(var i in touches){
			var touch = touches[i];
			if(touch.identifier == identifiers[0]){
				points.push(touch);
			}else if(touch.identifier == identifiers[1]){
				points.push(touch);
			}else{
				last_point = touch;
			}
		}

		// Calculate the midpoint

		var midpoint_back = {
			x: (points[0].clientX+points[1].clientX)/2,
			y: (points[0].clientY+points[1].clientY)/2
		};

		var point_top = {
			x : last_point.clientX,
			y : last_point.clientY
		}

		var point_middle = {
			x: (midpoint_back.x+point_top.x)/2,
			y: (midpoint_back.y+point_top.y)/2
		}

		// Add the object

		this.object = {
			back : midpoint_back,
			top : point_top,
			middle : point_middle
		}

		// console.log(point_top.x)
	}

	// -----------------
	// Events processing
	// -----------------

	init_events(){

		var that = this;

		this.canvas.on('touchend',function(event){
			that.process_touchend(event);
		});

		this.canvas.on('touchstart',function(event){
			that.process_touchstart(event);
		});

		this.canvas.on('touchmove',function(event){
			that.process_touchmove(event);
		});

	}

	process_touchstart(event){

		var that = this;

		_.each(event.originalEvent.changedTouches, function(touch){ 
			that.touches.push(touch);
			document.dispatchEvent(new Event('touches_added'));
		});

	}

	process_touchend(event){

		var that = this,
			index = 0;

		_.each(that.touches, function(registered_touch){
			if(registered_touch !== undefined){
				var touch_identifier = event.originalEvent.changedTouches[0].identifier;
				if(registered_touch.identifier == touch_identifier){
					that.touches.splice(index,1); 
					document.dispatchEvent(new CustomEvent('touch_removed',{detail: touch_identifier}));
				}
			}
			index++;
		});

	}

	process_touchmove(event){

		var that = this;

		_.each(event.originalEvent.changedTouches, function(touch){ 
			for(var i in that.touches){
				if(touch.identifier == that.touches[i].identifier){
					that.touches[i] = touch;
				}
			}
		});

	}

	// -----------
	// Debug tools
	// -----------

	simulate_touches(){

		var simulate_coordinates = [
			{
				clientX: $(window).width()/2 - 300,
				clientY: $(window).height()/2,
				time: 1000,
				identifier: 99,
				event_name: "touchstart"
			},
			{
				clientX: null,
				clientY: null,
				time: 1200,
				identifier: 99,
				event_name: "touchend"
			},
			{
				clientX: $(window).width()/2,
				clientY: $(window).height()/2 - 50,
				time: 1400,
				identifier: 90,
				event_name: "touchstart"
			},
			{
				clientX: null,
				clientY: null,
				time: 1600,
				identifier: 90,
				event_name: "touchend"
			},
			{
				clientX: $(window).width()/2,
				clientY: $(window).height()/2 + 50,
				time: 1800,
				identifier: 91,
				event_name: "touchstart"
			},
			{
				clientX: $(window).width()/2 - 150,
				clientY: $(window).height()/2,
				time: 2000,
				identifier: 92,
				event_name: "touchstart"
			},
			{
				clientX: $(window).width()/2,
				clientY: $(window).height()/2 - 50,
				time: 2200,
				identifier: 93,
				event_name: "touchstart"
			},
			{
				clientX: null,
				clientY: null,
				time: 2700,
				identifier: 91,
				event_name: "touchend"
			},
			{
				clientX: $(window).width()/2 - 150,
				clientY: $(window).height()/2 - 100,
				time: 3000,
				identifier: 94,
				event_name: "touchstart"
			}
		];

		var index = 0;
		_.each(simulate_coordinates, function(coord){

			var that = this;
			setTimeout(function(){

				var e = new jQuery.Event(coord.event_name);
				e.originalEvent = {
					changedTouches : {
						0 : {
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
		setTimeout(function(){

			setInterval(function(){
				for(var i in that.touches){
					if(that.object_touches.indexOf(that.touches[i].identifier) != -1){
						that.touches[i].clientX += Math.floor(Math.random()*10)-5;
						that.touches[i].clientY += Math.floor(Math.random()*10)-5;
					}
				}
			},100);

		},3100);

	}

}