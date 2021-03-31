import { Matrix } from "../math/Matrix";
import { WebGlScript } from "./WebGlScript";

const BLACK = [0.0, 0.0, 0.0];
const WHITE = [1.0, 1.0, 1.0];
const RED   = [1.0, 0.0, 0.0];
const GREEN = [0.0, 1.0, 0.0];
const BLUE  = [0.0, 0.0, 1.0];
const YELLOW = [0.6,1.0,0.5];//(60,100%,50%)

class ProgramRules {
    constructor (gl,shCode,defines){
        this.gl = gl;
        this.defines = defines;
        this.shaderCode = new WebGlScript(shCode).clone();
    
        this.textAtrUpdt = true;
        
        this.createGlProgram();
        this.createGlShaders();
        this.updateDefinesShadersCode(this.shaderCode,this.defines);
        this.createProgram(this.shaderCode);

        this.getProgramInfo();

        this.getAtrLocations(this.gl,this.program,this.aNames,this.aActiveInfo);
        this.getUnifLocations(this.gl,this.program,this.uNames,this.uActiveInfo);
        this.createBuffers();
    }
    update(code,def){
        this.shaderCode = new WebGlScript(code).clone();
        this.defines = def;
        this.recompile();
    }
    clearBuffers(){
        for (let key in this.aData){
            this.gl.deleteBuffer(this.buffers[key]);
        }
    }
    createBuffers(){
        this.buffers = {};
        for (let key in this.aData){
            this.buffers[key] = this.gl.createBuffer();
        }
    }
    // setUniform(modelMatrix,invTrModelMatrix,rules,camera,light){
    //     for (let key in this.uData){
    //         switch (key){
    //             case 'modelMatrix':
    //                 this.gl.uniformMatrix4fv(this.uData[key], false, modelMatrix);
    //             break;
    //             case 'viewMatrix':
    //                 this.gl.uniformMatrix4fv(this.uData[key], false, camera.viewMatrix);
    //             break;
    //             case 'projMatrix':
    //                 this.gl.uniformMatrix4fv(this.uData[key], false, camera.projMatrix);
    //             break;
    //             // все ниже автоматизировать (дефолтный кейс)
    //             default: 
    //                 if (!rules.material[key]){
    //                     break;
    //                 }
    //                 switch('type unif'){
    //                     case 'vec3':
    //                         this.gl.uniform3fv(this.uData[key], rules.material[key]);
    //                     break;
    //                 }
    //                 console.log(key);
    //             break;
    //         };
    //     }
    // }
    setAttribute(rules){
        for (let key in this.aData){
            switch (key){
                case 'a_normal':
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(rules.geometry.cord.normals),this.gl.STATIC_DRAW);

                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
                    this.gl.vertexAttribPointer(this.aData[key], 3, this.gl.FLOAT, false, 0, 0);//gl.vertexAttribPointer(scene.objects[i].progRules.atrLoc[key2], bufSett[k], gl.FLOAT, false, 0, 0);
                    this.gl.enableVertexAttribArray(this.aData[key]);
                break;
                case 'a_position':
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(rules.geometry.cord.vertex),this.gl.STATIC_DRAW);
    
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
                    this.gl.vertexAttribPointer(this.aData[key], 3, this.gl.FLOAT, false, 0, 0);//gl.vertexAttribPointer(scene.objects[i].progRules.atrLoc[key2], bufSett[k], gl.FLOAT, false, 0, 0);
                    this.gl.enableVertexAttribArray(this.aData[key]);
                break;
                // case 'a_color':
                //     //console.log(material);
                //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
                //     this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(),this.gl.STATIC_DRAW);
    
                //     //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
                //     this.gl.vertexAttribPointer(this.aData[key], 4, this.gl.FLOAT, false, 0, 0);
                //     this.gl.enableVertexAttribArray(this.aData[key]);
                // break;
                case 'aTextureCoord':
                    if (this.textAtrUpdt){
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
                        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(rules.geometry.cord.map),this.gl.STATIC_DRAW);

                        this.gl.bindTexture(this.gl.TEXTURE_2D, rules.material.texture);//rules.material.texture
    
                        // задаём параметры, чтобы можно было отрисовать изображение любого размера
                        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
                        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    
                            const num = 2;              // каждая координата состоит из 2 значений
                            const type = this.gl.FLOAT; // данные в буфере имеют тип 32 bit float
                            const normalize = false;    // не нормализуем
                            const stride = 0;           // сколько байт между одним набором данных и следующим
                            const offset = 0;           // стартовая позиция в байтах внутри набора данных
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
                        this.gl.vertexAttribPointer(this.aData[key], num, type, normalize, stride, offset);
                        this.gl.enableVertexAttribArray(this.aData[key]);
    
                        // загружаем изображение в текстуру
                        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, rules.material.data.map);

                        //console.log('a');
                    } else {
                        //let texture = this.gl.createTexture();
                        
                        this.gl.activeTexture(this.gl.TEXTURE0);
                        this.gl.bindTexture(this.gl.TEXTURE_2D, rules.material.texture);//rules.material.texture
                    }
                    this.textAtrUpdt = false;
  
                break;
            };
        }
    }

    setUniform(modelMatrix,invTrModelMatrix,rules,camera,light){
        for (let key in this.uData){
            switch (key){
                case 'modelMatrix':
                    this.gl.uniformMatrix4fv(this.uData[key], false, modelMatrix);
                break;
                case 'viewMatrix':
                    this.gl.uniformMatrix4fv(this.uData[key], false, camera.viewMatrix);
                break;
                case 'projMatrix':
                    this.gl.uniformMatrix4fv(this.uData[key], false, camera.projMatrix);
                break;
                // все ниже автоматизировать (дефолтный кейс)
                case 'uSampler':
                    // Указываем шейдеру, что мы связали текстуру с текстурным регистром 0
                    this.gl.uniform1i(this.uData[key], 0);
                break;
                // case 'v_color':
                //     this.gl.uniform4fv(this.uData[key], rules.material.data.color);
                // break;
                case 'v_color':
                    this.gl.uniform4fv(this.uData[key], rules.material.data.color);
                break;
// ------------------------------------------ LIGHT --------------------------------------------
                case 'u_ambIntensity': 
                    this.gl.uniform1f(this.uData[key], light.ambient.intensity);
                break;
                case 'u_ambLightColor': 
                    this.gl.uniform3fv(this.uData[key], light.ambient.color);
                break;
                case 'u_lightColor':  // light color 
                //console.log(light.source.color);
                    this.gl.uniform3fv(this.uData[key], light.source.color);
                break;
                case 'u_intensity':   // light intensity  
                    this.gl.uniform1f(this.uData[key], light.source.intensity);
                break;
                case 'u_specularInt':   // spec intensity  
                //console.log(key);
                    this.gl.uniform1f(this.uData[key], light.source.specularInt);
                break;
                case 'u_specularColor': // specular color 
                    this.gl.uniform3fv(this.uData[key], light.source.specularColor);//
                break;
                case 'invTranspModelMatrix':
                    this.gl.uniformMatrix4fv(this.uData[key], false, invTrModelMatrix);
                break;
                case 'u_lightWorldPosition': // position light 
                //console.log(Object.values(light.source.positionLight));
                    this.gl.uniform3fv(this.uData[key], Object.values(light.source.positionLight)); //[0, 0, 200][light.source.positionLight.x, light.source.positionLight.y, light.source.positionLight.z]
                break;
                case 'u_viewWorldPosition': // position view 
                    this.gl.uniform3fv(this.uData[key], Object.values(camera.position));//
                break;
                case 'u_shininess':  
                    this.gl.uniform1f(this.uData[key], light.source.shiniess);
                    //console.log(light.source.shiniess);
                break;
                case 'k_vertex':  
                    this.gl.uniform1f(this.uData[key], light.source.k_vertex);
                break;
                default: //
                break;
            };
        }
    }

    // updateAttribute(rules){
    //     for (let key in this.aData){
    //         switch (key){
    //             case 'a_normal':
    //                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
    //                  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(rules.geometry.cord.normals),this.gl.STATIC_DRAW);

    //                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
    //                  this.gl.vertexAttribPointer(this.aData[key], 3, this.gl.FLOAT, false, 0, 0);//gl.vertexAttribPointer(scene.objects[i].progRules.atrLoc[key2], bufSett[k], gl.FLOAT, false, 0, 0);
    //                  this.gl.enableVertexAttribArray(this.aData[key]);
    //             break;
    //             case 'a_position':
    //                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
    //                  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(rules.geometry.cord.vertex),this.gl.STATIC_DRAW);
    
    //                  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
    //                  this.gl.vertexAttribPointer(this.aData[key], 3, this.gl.FLOAT, false, 0, 0);//gl.vertexAttribPointer(scene.objects[i].progRules.atrLoc[key2], bufSett[k], gl.FLOAT, false, 0, 0);
    //                  this.gl.enableVertexAttribArray(this.aData[key]);
    //             break;
    //             // case 'a_color':
    //             //     //console.log(material);
    //             //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
    //             //     this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(),this.gl.STATIC_DRAW);
    
    //             //     //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
    //             //     this.gl.vertexAttribPointer(this.aData[key], 4, this.gl.FLOAT, false, 0, 0);
    //             //     this.gl.enableVertexAttribArray(this.aData[key]);
    //             // break;
    //             case 'aTextureCoord':
    //                  //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
    //                  //this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(rules.geometry.cord.map),this.gl.STATIC_DRAW);

    //                  //this.gl.bindTexture(this.gl.TEXTURE_2D, rules.material.texture);

    //                 // //задаём параметры, чтобы можно было отрисовать изображение любого размера
    //                 // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    //                 // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    //                 // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    //                 // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    //                     // const num = 2;              // каждая координата состоит из 2 значений
    //                     // const type = this.gl.FLOAT; // данные в буфере имеют тип 32 bit float
    //                     // const normalize = false;    // не нормализуем
    //                     // const stride = 0;           // сколько байт между одним набором данных и следующим
    //                     // const offset = 0;           // стартовая позиция в байтах внутри набора данных
    //                 //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[key]);
    //                 // this.gl.vertexAttribPointer(this.aData[key], num, type, normalize, stride, offset);
    //                 // this.gl.enableVertexAttribArray(this.aData[key]);

    //                 // // загружаем изображение в текстуру
    //                  //this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, rules.material.data.map);
    //             break;
    //         };
    //     }
    // }
    recompile(){
        this.updateDefinesShadersCode(this.shaderCode,this.defines);
        this.compileProgram(this.shaderCode);
        this.getProgramInfo();

        this.getAtrLocations(this.gl,this.program,this.aNames,this.aActiveInfo);
        this.getUnifLocations(this.gl,this.program,this.uNames,this.uActiveInfo);
    }
    updateDefinesShadersCode(shaderCode,defines){
        let newCode = null;
        const def = Object.keys(defines).map(define_key => "#define " + define_key);
        newCode= [...def, shaderCode.fragment].join('\n'); 
        shaderCode.fragment = newCode;
        //return newCode;
    }
    getAtrLocations(gl,program,atrNames,a){
        let atrLoc = {};
        // for (let i=0;i<atrNames.length;i++){
        //     atrLoc[atrNames[i]] = gl.getAttribLocation(program,atrNames[i]);
        // }
        for (let i=0;i<a.length;i++){
            atrLoc[a[i].name] = gl.getAttribLocation(program,a[i].name);
        }
        this.aData = atrLoc;
    }
    getUnifLocations(gl,program,unifNames,u){
        let unifLoc = {};
        // for (let i=0;i<unifNames.length;i++){
        //     unifLoc[unifNames[i]] = gl.getUniformLocation(program,unifNames[i]);
        // }
        for (let i=0;i<u.length;i++){
            unifLoc[u[i].name] = gl.getUniformLocation(program,u[i].name);
        }
        this.uData = unifLoc;
    }
    getProgramInfo(){
        let aInfo = [];
        let uInfo = [];
        const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttribs; i++) {
            aInfo[i] = this.gl.getActiveAttrib(this.program, i);
        }
        const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; ++i) {
            uInfo[i] = this.gl.getActiveUniform(this.program, i);
        }
        this.aActiveInfo = aInfo;
        this.uActiveInfo = uInfo;
        //console.log(aInfo,uInfo);
    }
    createGlProgram(){
        this.program = this.gl.createProgram();
    }
    createGlShaders(){
        this.shaders = {
            fragment: this.gl.createShader(this.gl.FRAGMENT_SHADER),
            vertex: this.gl.createShader(this.gl.VERTEX_SHADER),
        }
    }
    createProgram(code){
        this.compileShaders(this.shaders.vertex,code.vertex);
        this.compileShaders(this.shaders.fragment,code.fragment);

        this.gl.attachShader(this.program, this.shaders.vertex);
        this.gl.attachShader(this.program, this.shaders.fragment);
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)){
            console.log(this.gl.getProgramInfoLog(this.program));
            this.gl.deleteProgram(this.program); 
        }
    }
    compileProgram(code){
        //console.log(code);
        this.compileShaders(this.shaders.vertex,code.vertex);
        this.compileShaders(this.shaders.fragment,code.fragment);

        //this.gl.attachShader(this.program, this.shaders.vertex);
        //this.gl.attachShader(this.program, this.shaders.fragment);
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)){
            console.log(this.gl.getProgramInfoLog(this.program));
            this.gl.deleteProgram(this.program); 
        }
    }
    compileShaders(shader,source){
        this.gl.shaderSource(shader, source);      
        this.gl.compileShader(shader);       
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){                        
            console.log(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
        }
    }
}
export { ProgramRules };