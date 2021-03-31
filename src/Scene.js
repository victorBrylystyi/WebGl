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
        // if (this.needChekProg){
        //     if (this._ref){
        //         if (this._ref.needCreateProgram){
        //             this.createProgram(gl);
        //         }
        //         if (this._ref.needsRecompile){
        //             this.copmileProgram(gl,this._ref);
        //         }
        //         for (let i=0;i<this.meshs.length;i++){
        //             this.meshs[i].material = this._ref;
        //         }
        //     } else {
        //         for (let i=0;i<this.meshs.length;i++){
        //             this.meshs[i].material = this.meshs[i].originalMaterial;
        //             this.meshs[i].material.needsRecompile = true;
        //         }
        //     }
        //     this.needChekProg = false;
        // }
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
    // createProgram(gl){
    //     let refMaterial = this._ref;
    //     this.checkProgram(gl,refMaterial); // создание программы если нет 
    //     this.checkShaders(gl,refMaterial); // создание шейдеров если нет 
    //     if (refMaterial.needCreateProgram){  // первое создание программы
    //         this.createNewProgram(gl,refMaterial);
    //     }
    // }
    // createNewProgram(gl,material){
    //     this.updateDefinesShadersCode(material);
    //     this.compileShaders(gl,material);
    //     gl.attachShader(material.ref, material.shaders.vertex);
    //     gl.attachShader(material.ref, material.shaders.fragment);
    //     gl.linkProgram(material.ref);
    //     if (!gl.getProgramParameter(material.ref, gl.LINK_STATUS)){
    //         console.log(gl.getProgramInfoLog(material.ref));
    //         gl.deleteProgram(material.ref); 
    //     }
    //     material.programRef = this.getProgramRef(gl,material.ref);
    //     material.needCreateProgram = false;
    // }
    // copmileProgram(gl,material){
    //     this.updateDefinesShadersCode(material);
    //     this.compileShaders(gl,material);
    //     gl.linkProgram(material.ref);
    //     if (!gl.getProgramParameter(material.ref, gl.LINK_STATUS)){
    //         console.log(gl.getProgramInfoLog(material.ref));
    //         gl.deleteProgram(material.ref); 
    //     }
    //     material.needsRecompile = false;
    //     material.programRef = this.getProgramRef(gl,material.ref);
    // }
    // getProgramRef(gl,program){
    //     let data = {
    //         uniforms: {
    //             info: getParametrs(gl,program,gl.ACTIVE_UNIFORMS),
    //         },
    //         attributes: {
    //             info: getParametrs(gl,program,gl.ACTIVE_ATTRIBUTES),
    //         },
    //     };
    //     data.uniforms.locations = getUnifLocations(gl,program,data.uniforms.info);
    //     data.attributes.locations = getAtrLocations(gl,program,data.attributes.info);

        
    //     return data;

    //     function getParametrs(gl,program,type){
    //         let info = [];
    //         let numElements = gl.getProgramParameter(program, type);
    //         for (let i = 0; i < numElements; i++) {
    //             if (type==gl.ACTIVE_UNIFORMS){
    //                 info[i] = gl.getActiveUniform(program, i);
    //             } else if (type==gl.ACTIVE_ATTRIBUTES){
    //                 info[i] = gl.getActiveAttrib(program, i);
    //             }
    //         }
    //         return info;            
    //     }
    //     function getAtrLocations(gl,program,a){
    //         let atrLoc = {};
            
    //         for (let i=0;i<a.length;i++){
    //             atrLoc[a[i].name] = gl.getAttribLocation(program,a[i].name);
    //         }
    //         return atrLoc;
    //     }
    //     function getUnifLocations(gl,program,u){
    //         let unifLoc = {};
    //         for (let i=0;i<u.length;i++){
    //             unifLoc[u[i].name] = gl.getUniformLocation(program,u[i].name);
    //         }
    //         return unifLoc;
    //     }
    // }
    // compileShaders(gl,material){
    //     this.compileShader(gl,material.shaders.vertex,material.newShadersCode.vertex);
    //     this.compileShader(gl,material.shaders.fragment,material.newShadersCode.fragment);
    // }
    // checkProgram(gl,material){
    //     if (!material.ref){
    //         material.ref = gl.createProgram();
    //     }
    // }
    // checkShaders(gl,material){
    //     if (!material.shaders){
    //         material.shaders = {};
    //         material.shaders.vertex = gl.createShader(gl.VERTEX_SHADER);
    //         material.shaders.fragment = gl.createShader(gl.FRAGMENT_SHADER);
    //     }
    // }
    // updateDefinesShadersCode(material){
    //     material.newShadersCode = new WebGlScript(material.shadersCode).clone();
    //     let newCode = '';//null;
    //     const def = Object.keys(material.defines).map(define_key => "#define " + define_key);
    //     newCode= [...def, material.shadersCode.fragment].join('\n'); 
    //     material.newShadersCode.fragment = newCode;
    //     //return newCode;
    // }
    // compileShader(gl,shader,source){
    //     gl.shaderSource(shader, source);      
    //     gl.compileShader(shader);       
    //     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){                        
    //         console.log(gl.getShaderInfoLog(shader));
    //         gl.deleteShader(shader);
    //     }
    // }

}

export { Scene };