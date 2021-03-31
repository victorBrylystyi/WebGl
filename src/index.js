"use strict";
 // webpack - вместо -webpack-dev-server -> webpack serve --open 
import { BasicMaterial } from "./material/BasicMaterial";
import { Camera } from "./camera/Camera";
import { Mesh } from "./Mesh";
import { RectangularGeometry } from "./geometry/RectangularGeometry";
import { Scene } from "./Scene";
import { TriangleGeometry } from "./geometry/TriangleGeometry";
import { WebGlRender } from "./WebGlRender";
import { BoxGeometry } from "./geometry/BoxGeometry";
import { Matrix } from "./math/Matrix";
import { PhongMaterial,shadersPhongMaterial } from "./material/PhongMaterial";
import { AmbientLight } from "./light/AmbientLight";
import { DirectionalLight } from "./light/DirectionalLight";
import { PointLight } from "./light/PointLight";
import { PlaneGeometry } from "./geometry/PlaneGeometry";
import * as dat from 'dat.gui';
import { RenderToTexture } from "./RenderToTexture";
import { Base } from "./material/Base";
import { NewMesh } from "./NewMesh";
import { Texture } from "./material/Texture";

const BLACK = [0.0, 0.0, 0.0, 1.0];
const WHITE = [1.0, 1.0, 1.0, 1.0];
const RED   = [1.0, 0.0, 0.0, 1.0];
const GREEN = [0.0, 1.0, 0.0, 1.0];
const BLUE  = [0.0, 0.0, 1.0, 1.0];

export const defineProp = (object, property, define = null, initialValue = null) => {
  let value = initialValue;
  Object.defineProperty(object, property, {
    get: function() { return value; },
    set: function(newValue) { 
      value = newValue;
          if (newValue) {
            if (!object.defines.hasOwnProperty(define)) {
              object.defines[define] = true;
              object.needsRecompile = true;
            }
          } else {
            if (object.defines.hasOwnProperty(define)) {
              Reflect.deleteProperty(object.defines, define);
              object.needsRecompile = true;
            }
          } 
    },
    enumerable: true,
    configurable: true
  });
  //console.log(value);
};
  
export function FP (boolSignal,prevBoolSignal){
    let rlo = false;
    rlo = !prevBoolSignal && boolSignal;
  return rlo;
}

export function FN (boolSignal,prevBoolSignal){
  let rlo = false;
  rlo = prevBoolSignal && !boolSignal;
  return rlo;
}

let image2 = new Image();
image2.src = '../tiles.jpeg';

let image = new Image();
//image.src = '../Devs_Title_Card.png';
image.src = '../westworld-4.jpeg';

 //image2.onload = function() {
  image2.onload = function(){
    main(image,image2);
  };
 //};

function main (image1,image2){
  let canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  
  window.addEventListener('resize',function(){
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  });
  
  // let image3 = new Image();
  // image3.src = '../tiles.jpeg';
  
  // let image = new Image();
  // //image.src = '../Devs_Title_Card.png';
  // image.src = '../westworld-4.jpeg';
  //westworld-4.jpeg
  
  let camera = new Camera('perspective'); 
  let orthoCamera = new Camera('ortho');

  orthoCamera.ortographicSett.right = canvas.width;
  orthoCamera.ortographicSett.bottom = canvas.height;
  orthoCamera.ortographicSett.left = 0;
  orthoCamera.ortographicSett.top = 0;
  //orthoCamera.ortographicSett.near = -6000;
  orthoCamera.ortographicSett.near = 0;
  orthoCamera.ortographicSett.far = 1000;

  camera.perspectiveSett.zFar = 6000;
  camera.perspectiveSett.aspect = canvas.width/canvas.height;
  
  let fi = 0;
  let renderer = new WebGlRender(canvas);

  const gui = new dat.GUI();
  
  let boxGeom = new BoxGeometry(200,200,200,-200/2,-200/2,-200/2);
  let boxGeom2 = new BoxGeometry(200,200,200,-200/2,-200/2,-200/2);
  let planeGeometry = new PlaneGeometry(1000,1000,-1000/2,-1000/2);//-1000/2,-1000/2,-1000/2
  let planeGeometry2 = new PlaneGeometry(256,256);//-1000/2,-1000/2,-1000/2
  let planematerial = new PhongMaterial({map:new Texture(image2)});
  let planematerial2 = new PhongMaterial({map:new Texture(image2)});
  //let planematerial = new PhongMaterial({color: WHITE});
  let boxMaterialv4 = new PhongMaterial({color:RED});//map:new Texture(image1),
  let boxMaterialv5 = new PhongMaterial({color:RED});//map:new Texture(image1),
  let plane = new NewMesh(planeGeometry,planematerial);
  let plane2 = new NewMesh(planeGeometry2,planematerial2);
  let box = new NewMesh(boxGeom,boxMaterialv4);
  let box2 = new NewMesh(boxGeom2,boxMaterialv5);
  let scene = new Scene();
  let scene2 = new Scene();
  
  scene.background = WHITE;
  scene2.background = BLACK;
  
  const light = new AmbientLight();
  light.color = [1.0, 1.0, 1.0];
  light.intensity = 0.0;
  
  const light2 = new DirectionalLight();
    light2.worldPosition.x = 0;
    light2.worldPosition.y = -200;
    light2.worldPosition.z = 0;
    light2.color = [1.0, 1.0, 1.0];
    light2.shininess = 200.0;
    light2.intensity = 1.0;
    light2.addTarget([0.0,0.0,0.0]);

  const light3 = new PointLight();
    light3.color = [1.0, 1.0, 1.0];
    light3.intensity = 1.0;
    light3.shininess = 200.0;
    light3.specularInt = 1.0;
    light3.position.y = 300;
    light3.position.z = -300;

  camera.position.y = 500;
  camera.position.z = 500;
  camera.rotation.x  = 0.4;


  let ui = {
    directionalLigth:{
      mainFolder:gui.addFolder('Directional light'),
    },
    pointLight:{
      mainFolder:gui.addFolder('Point light'),
    },
    camera:{
      mainFolder:gui.addFolder('Camera'),
    },
    material:{
      mainFolder:gui.addFolder('Material'),
      menu:{
        changeBox: false,
        changeScene: false,
        changePlane: false,
        addSecMap: false,
        shadowMap: false,
      },
    },
  };
  ui.directionalLigth.mainFolder.add(light2,'shininess',0,400,10);
  ui.pointLight.mainFolder.add(light3,'shininess',0,400,10);
  ui.directionalLigth.subFolder = {
    worldPosition: ui.directionalLigth.mainFolder.addFolder('World position'),
    targetPosition: ui.directionalLigth.mainFolder.addFolder('Target position')
  };
  ui.pointLight.subFolder = {
    position: ui.pointLight.mainFolder.addFolder('Position'),
  };
  ui.camera.subFolder = {
    position: ui.camera.mainFolder.addFolder('Position'),
    rotation: ui.camera.mainFolder.addFolder('Rotation'),
  };


  if (light2.target !== undefined){
    ui.directionalLigth.subFolder.targetPosition.add(light2.target, 'x', -600, 600, 10);
    ui.directionalLigth.subFolder.targetPosition.add(light2.target, 'y', -600, 600, 10);
    ui.directionalLigth.subFolder.targetPosition.add(light2.target, 'z', -600, 600, 10);
  }
  let sceneMaterial = new PhongMaterial({map:new Texture()});

  let changeBoxMaterial = function (rlo){
    if (rlo){
      box.material.map = new Texture(image1);
    } else {
       box.material.map = null;
    }
  };
  let changeSceneMaterial = function (rlo){
    if (rlo){
      scene.ref = sceneMaterial;
    } else {
      scene.ref = null;
    }
  };
  let changePlaneMaterial = function (rlo){
    if (rlo){
      plane.material.map = new Texture(image1);
    } else {
      plane.material.map = new Texture(image2);
    }
  };
  let addSecMapMaterial = function (rlo){
    if (rlo){
      plane.material.secondMap = new Texture(image1);
      box.material.secondMap = new Texture(image2);

    } else {
      plane.material.secondMap = null;
      box.material.secondMap = null;
    }
  };
  let changeStatusShadowMap = function (rlo){
    if (rlo){
      renderer.useShadow = true;
    } else {
      renderer.useShadow = false;
      //scene.ref = null;
    }
  };


  ui.material.mainFolder.add(ui.material.menu,'changeBox')
                        .name('Change Box Material')
                        .listen()
                        .onChange(changeBoxMaterial);
  ui.material.mainFolder.add(ui.material.menu,'changeScene')
                        .name('Change Scene Material')
                        .listen()
                        .onChange(changeSceneMaterial);
  ui.material.mainFolder.add(ui.material.menu,'changePlane')
                        .name('Change Plane Material')
                        .listen()
                        .onChange(changePlaneMaterial);
  ui.material.mainFolder.add(ui.material.menu,'addSecMap')
                        .name('Add Second Material')
                        .listen()
                        .onChange(addSecMapMaterial);
  ui.material.mainFolder.add(ui.material.menu,'shadowMap')
                        .name('Shanow Map')
                        .listen()
                        .onChange(changeStatusShadowMap);
                          
  ui.directionalLigth.subFolder.worldPosition.add(light2.worldPosition, 'x', -600, 600, 10);
  ui.directionalLigth.subFolder.worldPosition.add(light2.worldPosition, 'y', -600, 600, 10);
  ui.directionalLigth.subFolder.worldPosition.add(light2.worldPosition, 'z', -600, 600, 10);

  ui.pointLight.subFolder.position.add(light3.position, 'x', -600, 600, 10);
  ui.pointLight.subFolder.position.add(light3.position, 'y', -600, 600, 10);
  ui.pointLight.subFolder.position.add(light3.position, 'z', -600, 600, 10);

  ui.camera.subFolder.position.add(camera.position, 'x', -1000, 1000, 10);
  ui.camera.subFolder.position.add(camera.position, 'y', -1000, 1000, 10);
  ui.camera.subFolder.position.add(camera.position, 'z', -1000, 1000, 10);

  ui.camera.subFolder.rotation.add(camera.rotation, 'x', -Math.PI, Math.PI, 0.1);//Math.PI/2
  ui.camera.subFolder.rotation.add(camera.rotation, 'y', -Math.PI, Math.PI, 0.1);
  ui.camera.subFolder.rotation.add(camera.rotation, 'z',  -Math.PI, Math.PI,  0.1);

  scene.add(light);
  scene.add(light2);
  scene.add(box);
  scene.add(plane);

  scene2.add(plane2);

  let sceneMat = new PhongMaterial({map:new Texture()});


  plane.position.x = 0;
  plane.position.y = -600;
  plane.position.z = -500;
  
  plane.rotation.x = Math.PI/2;//180;
  //plane.rotation.x = 2*Math.PI;//180;
  plane.scale.x = 4;
  plane.scale.y = 4;


  plane2.position.x = 0;
  plane2.position.y = -600;
  plane2.position.z = -500;
  
  plane2.rotation.x = Math.PI/2;//180;
  //plane2.rotation.x = 2*Math.PI;//180;
  plane2.scale.x = 4;
  plane2.scale.y = 4;
  
  let tPrev = window.performance.now();
  let dT = 0;

  render();

  function render (){  // render target 

    dT =  (window.performance.now()-tPrev)*60/1000;
    //console.log(window.performance.now());
    //console.log(dT,window.performance.now(),tPrev);
    //console.log(dT);
    fi += 0.005*dT;
  
    box.position.x = 0;//canvas.width/2;
    box.position.y = 0;//canvas.height/2;
    box.position.z = -500;//Math.sin(fi)*1500;

    box2.position.x = 0;//canvas.width/2;
    box2.position.y = 0;//canvas.height/2;
    box2.position.z = -500;//Math.sin(fi)*1500;
  
    orthoCamera.position.x= light2.worldPosition.x;
    orthoCamera.position.y= light2.worldPosition.y;
    orthoCamera.position.z= light2.worldPosition.z;
  


    box.rotation.x = fi;
    box.rotation.y = fi;
    //box.rotation.z = fi;

    box2.rotation.x = fi;
    box2.rotation.y = fi;
    //box2.rotation.z = fi;
  
    orthoCamera.ortographicSett.right = canvas.width;
    orthoCamera.ortographicSett.bottom = canvas.height;

    camera.perspectiveSett.aspect = canvas.width/canvas.height;
  
    renderer.render(scene,camera,orthoCamera); // рисуем главную сцену 
    //renderer.render(scene2,orthoCamera2,orthoCamera); // рисуем главную сцену 
    
    tPrev = window.performance.now();
  
    requestAnimationFrame(render);
  }
}

/* shadow
    //renderer.activeFrameBuffer = depth_Buffer;
    renderer.activeFrameBuffer = true;

    //scene.material = depth.material
    //renderer.render(scene,orthoCamera,depth_Buffer); // отрисовали текстуру 

    //renderer.activeFrameBuffer = null; // отвязываем текстуру 
    renderer.activeFrameBuffer = false;

       // renderer.render(scene2,camera); // орто сцена для дебага 
*/



