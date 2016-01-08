export default class TouchService{

	constructor(canvas,opts){

		this.canvas = canvas;
		this.opts = opts;

		this.select_touches = [];
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
			document.addEventListener('object_touches_added', function(){
				console.log("recevied "+that.object_touches.length)

				if(that.object_touches.length == 2){
					that.update_status('use recognized object');
					that.recognize_object(that.object_touches);
				}

			});

			document.addEventListener('object_removed', function(event){
				that.object = null; 
				that.update_status('waiting object after removed');
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
			x : touches[0].clientX,
			y : touches[0].clientY
		}

		var point_top = {
			x : touches[1].clientX,
			y : touches[1].clientY
		}

		// Calculate the midpoint

		var point_middle = {
			x: (point_bottom.x+point_top.x)/2,
			y: (point_bottom.y+point_top.y)/2
		}

		// Add the object

		this.object = {
			back : point_bottom,
			top : point_top,
			middle : point_middle
		}

		this.object.size = Math.sqrt( (this.object.back.x-this.object.top.x)*(this.object.back.x-this.object.top.x) + (this.object.back.y-this.object.top.y)*(this.object.back.y-this.object.top.y) );
		this.object.angle =  Math.atan2(this.object.top.y - this.object.back.y, this.object.top.x - this.object.back.x) * 180 / Math.PI;

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

		console.log("EVENT - touchstart");
		document.dispatchEvent(new CustomEvent('touch_uniq', {detail: event}));

		var that = this;

		_.each(event.originalEvent.changedTouches, function(touch){ 

			// Choose between that.select_touches & that.object_touches

			if(that.object_touches.length == 2){ // If object is already on tab, it's a finger
				console.log("add s a finger");
				that.select_touches.push(touch);
			}else{ // Either, it's the object
				console.log("add an object");
				that.object_touches.push(touch);
				document.dispatchEvent(new CustomEvent('object_touches_added'));
			}

		});

	}

	process_touchend(event){

		console.log("EVENT - touchend");

		var that = this;

		// Is this a finger ?

		for(var itouch in event.originalEvent.changedTouches){ // For each touch

			// Determine if touch is a object or a finger
			var is_type = null;

			// Is this a finger ?
			for(var i = that.select_touches.length -1; i >= 0 ; i--){
			    if(that.select_touches[i].identifier == event.originalEvent.changedTouches[itouch].identifier){
			    	console.log('remove a finger');
			        that.select_touches.splice(i, 1);
			        is_type = "finger";
			    }
			}

			// Is this an object ?
			for(var i = that.object_touches.length -1; i >= 0 ; i--){
			    if(that.object_touches[i].identifier == event.originalEvent.changedTouches[itouch].identifier){
			    	console.log('remove an object');
			        is_type = "object";
			    }
			}

			// If it's an object
			if(is_type == "object"){
				that.object_touches = [];
				document.dispatchEvent(new CustomEvent('object_removed'));
			}

		}

	}

	process_touchmove(event){

		console.log("EVENT - touchmove");

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