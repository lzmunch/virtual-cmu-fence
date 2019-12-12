var FENCE_FILENAME = "fence";

// THREE.js setup
var scene = new THREE.Scene();

var renderHeight = window.innerHeight * 0.9;
var renderWidth = window.innerWidth;
var camera = new THREE.OrthographicCamera( window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, - 500, 1000); 
camera.position.z = 17;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( renderWidth, renderHeight);

// setup scene environment
addBackground(scene);
addGroundModel(scene);

// controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// lighting
addLighting(scene);

// on document load
$( function() {
  showDefaultFence();
  document.getElementById("import-canvas").appendChild( renderer.domElement );

  // make sure file upload shows uploaded file name
$('#file-upload').change(function() {
  var i = $("#choose-file-label").clone();
  var filename = $('#file-upload')[0].files[0].name;
  var maxLen = 25;
  if (filename.length > maxLen)
    filename = filename.slice(0,maxLen-3) + "...";
  $(this).prev('label').text(filename);
});

});

var animate = function () {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render(scene, camera);
};

animate();

// object loading with texture
function loadObjMtl(folderPath, objFile, mtlFile, paths){
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(paths ? paths.tex : folderPath);
  mtlLoader.setPath(paths ? paths.mtl : folderPath);
  mtlLoader.load(mtlFile, function (materials) {

      materials.preload();

      materials.side = THREE.DoubleSide; 

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(paths ? paths.obj : folderPath);
      objLoader.load(objFile, function (object) {

          scene.add(object);
          object.rotation.y = Math.PI / 2;
          console.log("loaded", object.position);
      });

  });  
}

function showDefaultFence(){
  $.get('/assets/uploads/tex_image.jpg')
    .done(function() { 
      console.log("found tex_image, showing changed fence");
      changeToUpload();
    }).fail(function() { 
        console.log("not found! showing default");
        loadObjMtl('/assets/models/fence/', FENCE_FILENAME + '.obj', FENCE_FILENAME+'.mtl');
    })
}

// change texture of fence to image url in input field
function changeToUpload(){
  var path = "/assets/uploads/";
  loadObjMtl('/assets/models/fence/', 
             FENCE_FILENAME + '.obj', FENCE_FILENAME+'.mtl',
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

function addLighting(scene){
  var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), .25);
  keyLight.position.set(-100, 0, 100);
  var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.5);
  fillLight.position.set(100, 0, 100);
  var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  var hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ); 
  backLight.position.set(100, 0, -100).normalize();
  var frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
  scene.add(keyLight);
  scene.add(fillLight);
  scene.add(backLight);
  scene.add(frontLight);

}

function addBackground(scene){
  /*
  // full sphere
  var geometry = new THREE.SphereGeometry( 50, 60, 40 );
  geometry.scale( - 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( {
     map: new THREE.TextureLoader().load( 'https://i.imgur.com/1g6iK5n.jpg' )
  } );
  mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.y -= Math.PI / 5;
  scene.add( mesh );

  // bottom block half 
  geometry = new THREE.SphereBufferGeometry(50, 80, 60, 0, 2*Math.PI, 0, 0.5 * Math.PI);
  material = new THREE.MeshBasicMaterial( {color: 0x0, side: THREE.DoubleSide} );
  mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.x -= Math.PI;
  scene.add( mesh );
  */

  // top half only
  geometry = new THREE.SphereBufferGeometry(50, 80, 60, 0, 2*Math.PI, 0, 0.5 * Math.PI);
  material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( '/assets/background_half.jpg' ), side: THREE.BackSide } );
  mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.y -= Math.PI / 5 + Math.PI;
  scene.add( mesh );

  console.log("added background");
}

function addGroundModel(scene){

  var geometry = new THREE.CircleGeometry(50,50 );
  var material = new THREE.MeshBasicMaterial( {
     map: new THREE.TextureLoader().load( '/assets/models/ground_tex.jpg' )
  } );

  plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = Math.PI/2 + Math.PI;
  scene.add( plane );

  console.log("added ground");
  //bottom side
  /*
  var bottom_material = new THREE.MeshBasicMaterial( {color: 0x0, side: THREE.DoubleSide, transparent: true, opacity: 0.75} );
  var bottom_plane = new THREE.Mesh( geometry, bottom_material );
  bottom_plane.rotation.x = Math.PI/2 + Math.PI;
  bottom_plane.position.y -= 1;
  scene.add( bottom_plane );
  */
}