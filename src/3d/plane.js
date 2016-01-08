export default class Plane{

  constructor() {

    this.geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    this.material = new THREE.MeshPhongMaterial({ color: 0x6C6C6C });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.receiveShadow = true;

    this.plane.rotation.x = -0.5 * Math.PI;
    this.plane.position.x = 0;
    this.plane.position.y = -3;
    this.plane.position.z = 0;

  }
  
  update() {
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
  }
  
  get() {
    return this.plane;
  }

}