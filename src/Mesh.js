import { Coordinates3D } from "./Coordinates3D";
import { BasicMaterial } from "./material/BasicMaterial";
import { ShadowMaterial } from "./material/ShadowMaterial";
import { Matrix } from "./math/Matrix";

class Mesh {
    constructor(geometry,material){
        this.type = 'mesh';
        this.geometry = geometry.getGeometry();
        this.material = material;
        this.position = new Coordinates3D();
        this.rotation = new Coordinates3D(); 
        this.scale = new Coordinates3D(1,1,1);
        this.dafaultMaterial = new BasicMaterial ({color: [1.0, 1.0, 1.0, 1.0]});
        this.createDisplayRules();
    }
    // checkNewMaterial(){
    //     let isMaterialArray = Array.isArray(this.material);
    //     if (isMaterialArray){
    //         for (let i=0;i<this.geometry.numParts;i++){
    //             if (this.material[i].needCreate){

    //             }
    //             if(material[i]!==undefined){
    //                 material[i].needCreate = false;
    //                 newMaterial[i] = material[i].clone();

    //             } else {
    //                 let clone = this.dafaultMaterial.clone();
    //                 clone.needCreate = false;
    //                 newMaterial[i] = clone;
    //             } 
    //         }
    //     } else {
    //         material.needCreate = false;
    //         newMaterial = material.clone();
    //     }
    // }
    // createDiffMaterial(){

    // }
    // createMonoMaterial(){}

    updateMonochromeMaterial(){
        for (let i=0;i<this.geometry.parts.length;i++){
            this.displayRules[i].material = this.material.clone();

            this.displayRules[i].progRules.update(this.material.shadersCode,this.material.defines);
            //this.displayRules[i].material.progRules.recompile(this.displayRules[i].material.defines);
            this.displayRules[i].material.needRecompile = false;
        }
    }
    updateDiffMaterial(index){
        this.displayRules[index].material = this.material[index].clone();

        this.displayRules[i].progRules.update(this.material[index].shadersCode,this.material[index].defines);
        //this.displayRules[index].material.progRules.recompile(this.displayRules[index].material.defines);
        this.displayRules[index].material.needRecompile = false;
    }
    checkNeedCreateNewDisplRules(){
        let rlo = false;
        let isMaterialArray = Array.isArray(this.material);
        if (isMaterialArray){
            for(let i=0;i<this.material.length;i++){
                rlo = rlo || this.material[i].needCreate;
            }
            if (rlo) {
                this.createDisplayRules();


            }
        } else {
            if (this.material.needCreate){
                this.createDisplayRules();
            }
        }
    }
    updateDisplayRules(){
        //this.createDisplayRules();
        //this.checkNeedCreateNewDisplRules(gl);
        if (this.monoChrome){
            if (this.material.needRecompile){
                this.updateMonochromeMaterial();
                this.material.needRecompile = false;
            } else if (this.material.needUpdateData){
                for (let i=0;i<this.geometry.parts.length;i++){
                    this.displayRules[i].material.data = this.material.data;
                    this.material.needUpdateData = false;
                }
            }
        } else {
            for (let i=0;i<this.geometry.parts.length;i++){
                if (this.material[i].needRecompile){
                    this.updateDiffMaterial(i);
                    this.material[i].needRecompile = false;
                } else if (this.material[i].needUpdateData){
                    this.displayRules[i].material.data = this.material[i].data;
                    this.material[i].needUpdateData = false;
                }
            }
        }
    }
    update(){
        this.updateDisplayRules();
        this.updateMeshMatrix();
    }
    createProgramRules(gl){
        for (let k=0;k<this.displayRules.length;k++){
            this.displayRules[k].progRules = this.displayRules[k].material.getProgram(gl);
        }
    }
    doProgram(gl,camera,light){
        for (let k=0;k<this.displayRules.length;k++){
            // gl.useProgram(this.displayRules[k].material.progRules.program);
            // this.displayRules[k].material.progRules.setUniform(
            //     this.modelMatrix,
            //     this.invTranspModelMatrix,
            //     this.displayRules[k],
            //     camera,
            //     light);
            //     this.displayRules[k].material.progRules.setAttribute(this.displayRules[k]);
            // gl.drawArrays(gl.TRIANGLES, 0, this.displayRules[k].geometry.info.numVertex);
            gl.useProgram(this.displayRules[k].progRules.program);
            this.displayRules[k].progRules.setUniform(
                this.modelMatrix,
                this.invTranspModelMatrix,
                this.displayRules[k],
                camera,
                light);
                this.displayRules[k].progRules.setAttribute(this.displayRules[k]);
            gl.drawArrays(gl.TRIANGLES, 0, this.displayRules[k].geometry.info.numVertex);
        }
        //this.doneSendAttribute  = false;
    }
    createDisplayRules(){
        let rules = [];
        let newMaterial = this.createMaterial(this.geometry.parts.length,this.material);
        for (let i=0;i<this.geometry.parts.length;i++){
            if (this.monoChrome){
                rules[i] = {
                    material: newMaterial.clone(),
                    geometry: this.geometry.parts[i]
                };
            } else {
                rules[i] = {
                    material: newMaterial[i].clone(),
                    geometry: this.geometry.parts[i]
                };
            }
        }
        //console.log(rules);
        this.displayRules = rules;
    }
    createMaterial(numParts,material){
        let newMaterial = new Array();
        let isMaterialArray = Array.isArray(material);
        this.monoChrome = !isMaterialArray;
        if (isMaterialArray){
            for (let i=0;i<numParts;i++){
                if(material[i]!==undefined){
                    material[i].needCreate = false;
                    newMaterial[i] = material[i].clone();

                } else {
                    let clone = this.dafaultMaterial.clone();
                    clone.needCreate = false;
                    newMaterial[i] = clone;
                } 
            }
        } else {
            material.needCreate = false;
            newMaterial = material.clone();
        }

        return newMaterial;
    }
    updateMeshMatrix(){ 
        this.modelMatrix = new Matrix().multiplyToModel(this.position,this.scale,this.rotation);
        this.invTranspModelMatrix = new Matrix().invert(new Matrix().transpose(this.modelMatrix));
    }
}

export { Mesh };

