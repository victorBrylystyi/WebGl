import { Coordinates3D } from "./Coordinates3D";
import { WebGlScript } from "./program/WebGlScript";

class Scene {
    constructor(){
        this.meshs = [];
        this.lights = [];
        this.background = [0.0, 0.0, 0.0, 1.0];
        this.needUpdate = false;
        this.needChekProg = false;
        this._ref = null;
    }
    set ref(m){
        this._ref = m;
        //this.needChekProg = true;
    }
    get ref(){
        return this._ref;
    }
    createLightRules (){
        let rules = {};
        for (let i=0;i<this.lights.length;i++){

            if (this.lights[i].typeLight=='ambient'){
                rules.ambient = this.lights[i].createDataToWebgl();
            }else {
                this.lights[i].update();
                rules.source = this.lights[i].createDataToWebgl();
            }
        }
        if (rules['ambient'] == undefined){
            rules['ambient'] = {
                color: [0.0,0.0,0.0],
                intensity: 0.0,
            };
        } 
        if (rules['source'] == undefined){
            rules['source']= {
                color: [0.0,0.0,0.0],
                intensity: 0,
                positionLight: new Coordinates3D(),
                shiniess: 0.0,
                specularColor: [0.0,0.0,0.0],
                specularInt: 0.0,
                k_vertex: 1.0,
            };
        }
        this.lightRules = rules;
        //console.log(rules);
    }
    add(object){
        if (object.type == 'mesh'){
            this.meshs = this.meshs.concat(object);
        } else if (object.type == 'light') {
            this.lights = this.lights.concat(object);
        }
        this.needUpdate = true;
    }
    update(gl){
        if (this.needUpdate){ 
            // for (let i=0;i<this.meshs.length;i++){
            //     for (let k=0;k<this.meshs[i].displayRules.length;k++){
            //         this.meshs[i].displayRules[k].material.makeWebGlDependenseFcn(gl);
            //     }
            //     this.meshs[i].createProgramRules(gl);
            //     console.log(this.meshs[i]);
            // }
            //this.needUpdate = false;
            //console.log(this.ref);
            console.log(this.meshs);
            this.needUpdate = false;
        }
        if (this.lights.length>0){
            this.createLightRules();
        }
        for (let i=0;i<this.meshs.length;i++){
            this.meshs[i].update();
        }
    }
    drawScene(gl,camera){
        for (let i=0;i<this.meshs.length;i++){
            this.meshs[i].drawMesh(gl,camera,this.lightRules,this.ref);
        }
    }

}

export { Scene };