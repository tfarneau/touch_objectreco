export default class AmbientLight{

  constructor() {
  	var ambiColor = "#0c0c0c";
    this.light = new THREE.AmbientLight(ambiColor);
  }
  
  update() {

  }
  
  get() {
    return this.light;
  }

}