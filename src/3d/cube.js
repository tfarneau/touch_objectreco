export default class Cube{

  constructor(size) {

    this.geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    this.material = new THREE.MeshLambertMaterial({color: 'blue' });
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    
  }
  
  update() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
  }
  
  get() {
    return this.cube;
  }

}