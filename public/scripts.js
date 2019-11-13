var mtlTexFileStr = "fence_model_v1.jpg";
var mtlFileStr = 
  "newmtl Solid\n"+
  "Ka 1.0 1.0 1.0\n"+
  "Kd 1.0 1.0 1.0\n"+
  "Ks 0.0 0.0 0.0\n"+
  "d 1.0\n"+
  "Ns 0.0\n"+
  "illum 0\n"+
  "\n"+
  "newmtl fence_model_v1\n"+
  "Ka 1.0 1.0 1.0\n"+
  "Kd 1.0 1.0 1.0\n"+
  "Ks 0.0 0.0 0.0\n"+
  "d 1.0\n"+
  "Ns 0.0\n"+
  "illum 0\n"+
  "map_Kd " + mtlTexFileStr + "\n";

console.log(mtlFileStr);

// THREE.js setup
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 100;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( 400, 400 );

// on document load
$( function() {
  document.getElementById("import").appendChild( renderer.domElement );
  loadObjMtl('/assets/models/r2-d2/', 
           'r2-d2.obj', 'r2-d2.mtl');
});

// controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// lighting
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

// object loading with texture
// TODO add position
function loadObjMtl(path, objFile, mtlFile, paths){
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(paths ? paths.tex : path);
  mtlLoader.setPath(paths ? paths.mtl : path);
  mtlLoader.load(mtlFile, function (materials) {

      materials.preload();

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(paths? paths.obj : path);
      objLoader.load(objFile, function (object) {

          scene.add(object);
          object.position.y += 10;
          object.position.z += 50;
          console.log("loaded", object.position);
      });

  });  
}

// change tex functions
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
               'fence_model_v1.obj', 'fence_model_v1.mtl');
}

// https://i.imgur.com/3lo7B4V.jpg
// change texture of fence to image url in input field
function changeTex(){
//  var url = document.getElementById("img-url-input").value;
//  console.log(url);
//  var mtlFile = mtlTexFileStr;
  //  var mtlFile = 'fence_model_v1_scribble.mtl';

  var path = "/assets/uploads/";
  var mtlFile = 'fence_model_v1_upload.mtl'
  loadObjMtl('/assets/models/fence/', 
             'fence_model_v1.obj', mtlFile,
             { 
               obj: '/assets/models/fence/', 
               tex: '/assets/uploads/',
               mtl: '/assets/uploads/'
             }
            );
}

//TODO
function removeEntity(object) {
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove( selectedObject );
    animate();
}

function showUploadedImage(){
    console.log("show image");
    var img = document.createElement("img");
    img.src = "/assets/uploads/tex_image.jpg";
    document.getElementById("uploaded-img").appendChild(img);
}


var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
};

animate();