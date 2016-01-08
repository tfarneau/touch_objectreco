export default class SpotLight{

  constructor() {
  	this.light = new THREE.SpotLight(0xffffff);
	this.light.position.set(-40, 60, -10);
	
    this.light.castShadow = true;
    this.light.shadowCameraNear = true;
  }
  
  update() {

  }
  
  get() {
    return this.light;
  }

}