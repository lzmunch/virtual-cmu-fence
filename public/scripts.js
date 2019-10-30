var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 100;

var renderer = new THREE.WebGLRenderer();
//renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setSize( 400, 400 );
//document.body.appendChild( renderer.domElement );
$( function() {
  document.getElementById("import").appendChild( renderer.domElement );
});


var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

var origObject, scribbleObject; //can delete original and new objects

function loadObjMtl(path, objFile, mtlFile, pos){
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(path);
  mtlLoader.setPath(path);
  mtlLoader.load(mtlFile, function (materials) {

      materials.preload();

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(path);
      objLoader.load(objFile, function (object) {

          scene.add(object);
          object.position.y -= 60;
          object.position.z -= 50;
          console.log("loaded", object.position);
      });

  });  
}

//loadObjMtl('/examples/3d-obj-loader/assets/', 
loadObjMtl('/assets/models/r2-d2/', 
           'r2-d2.obj', 'r2-d2.mtl');

//document.addEventListener('keyup', (e) => {
//  if (e.code === "ArrowUp")
//    loadObjMtl('/examples/3d-obj-loader/assets/', 
//               'r2-d2.obj', 'r2-d2_scribble.mtl');
//  else if (e.code === "ArrowDown")
//    loadObjMtl('/examples/3d-obj-loader/assets/', 
//               'r2-d2.obj', 'r2-d2_scribble.mtl');
//  
//})

function changeToScribble(){
  loadObjMtl('/assets/models/r2-d2/', 
               'r2-d2.obj', 'r2-d2_scribble.mtl');
}

function changeToOriginal(){
  loadObjMtl('/assets/models/r2-d2/', 
               'r2-d2.obj', 'r2-d2.mtl');
}

function changeToFence(){
  loadObjMtl('/assets/models/fence/', 
               'fence_model_v1.obj', 'fence_model_v1.mtl', );
}

//TODO
function removeEntity(object) {
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove( selectedObject );
    animate();
}

var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
};

animate();