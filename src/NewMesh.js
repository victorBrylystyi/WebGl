import { Coordinates3D } from "./Coordinates3D";
import { Texture } from "./material/Texture";
import { Matrix } from "./math/Matrix";
import { ProgramRules } from "./program/ProgramRules";
import { WebGlScript } from "./program/WebGlScript";

class NewMesh {
    constructor(geometry,material){
        this.type = 'mesh';
        this.geometry = geometry.getGeometry();
        this.material = material;
        this.position = new Coordinates3D();
        this.rotation = new Coordinates3D(); 
        this.scale = new Coordinates3D(1,1,1);
    }
    update(){
        this.updateMeshMatrix();
    }
    drawMesh(gl,camera,light,material){

        let currentM = material || this.material;
        //console.log(currentM);
        this.checkProgram(gl,currentM); // создание программы если нет 
        this.checkShaders(gl,currentM); // создание шейдеров если нет 
            if (currentM.needCreateProgram){  // первое создание программы
                this.createNewProgram(gl,currentM);
                console.log(currentM);
            }
            if (currentM.needsRecompile && !currentM.needCreateProgram){ // рекомпиляция если изменилась логика шейдера 
                this.copmileProgram(gl,currentM);
            }
        gl.useProgram(currentM.ref); 
        this.setUniform(gl,currentM.programRef.uniforms,this.modelMatrix,camera,light,currentM,this.invTranspModelMatrix);
        this.setAttribute(gl,currentM.programRef.attributes,this.geometry);
        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.solid.info.numVertex);
    }
    createNewProgram(gl,material){
        this.updateDefinesShadersCode(material);
        this.compileShaders(gl,material);
        gl.attachShader(material.ref, material.shaders.vertex);
        gl.attachShader(material.ref, material.shaders.fragment);
        gl.linkProgram(material.ref);
        if (!gl.getProgramParameter(material.ref, gl.LINK_STATUS)){
            console.log(gl.getProgramInfoLog(material.ref));
            gl.deleteProgram(material.ref); 
        }
        material.programRef = this.getProgramRef(gl,material.ref);
        material.needCreateProgram = false;
    }
    copmileProgram(gl,material){
        this.updateDefinesShadersCode(material);
        this.compileShaders(gl,material);
        gl.linkProgram(material.ref);
        if (!gl.getProgramParameter(material.ref, gl.LINK_STATUS)){
            console.log(gl.getProgramInfoLog(material.ref));
            gl.deleteProgram(material.ref); 
        }
        material.needsRecompile = false;
        material.programRef = this.getProgramRef(gl,material.ref);
    }
    setAttribute(gl,aData,geometry){
        for (let key in aData.locations){
            switch (key){
                case 'a_normal':
                    if (!geometry[key]){
                        geometry[key] = {};
                        geometry[key].ref = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, geometry[key].ref); // вероятно можно делать 1 раз 
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.solid.cord.normals),gl.STATIC_DRAW);// вероятно можно делать 1 раз 
                    }
                    gl.bindBuffer(gl.ARRAY_BUFFER, geometry[key].ref);
                    gl.vertexAttribPointer(aData.locations[key], 3, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(aData.locations[key]);
                break;
                case 'a_position': 
                    if (!geometry[key]){
                        geometry[key] = {};
                        geometry[key].ref = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, geometry[key].ref); // вероятно можно делать 1 раз 
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.solid.cord.vertex),gl.STATIC_DRAW);// вероятно можно делать 1 раз 
                    }
                    gl.bindBuffer(gl.ARRAY_BUFFER, geometry[key].ref);
                    gl.vertexAttribPointer(aData.locations[key], 3, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(aData.locations[key]);

                break;
                case 'aTextureCoord':
                    if (!geometry[key]){
                        geometry[key] = {};
                        geometry[key].ref = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, geometry[key].ref); // вероятно можно делать 1 раз 
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.solid.cord.map),gl.STATIC_DRAW);// вероятно можно делать 1 раз
                    }
                    const num = 2;              // каждая координата состоит из 2 значений
                    const type = gl.FLOAT; // данные в буфере имеют тип 32 bit float
                    const normalize = false;    // не нормализуем
                    const stride = 0;           // сколько байт между одним набором данных и следующим
                    const offset = 0;           // стартовая позиция в байтах внутри набора данных
                    gl.bindBuffer(gl.ARRAY_BUFFER, geometry[key].ref);
                    gl.vertexAttribPointer(aData.locations[key], num, type, normalize, stride, offset);
                    gl.enableVertexAttribArray(aData.locations[key]);
                break;
            };
        }
    }
    setUniform(gl,uData,modelMatrix,camera,light,material,invTr){
        let cntrSampler = 0;
        for (let key in uData.locations){
            switch (key){
                case 'modelMatrix':
                    gl.uniformMatrix4fv(uData.locations[key], false, modelMatrix);
                break;
                case 'viewMatrix':
                    gl.uniformMatrix4fv(uData.locations[key], false, camera.viewMatrix);
                break;
                case 'projMatrix':
                    gl.uniformMatrix4fv(uData.locations[key], false, camera.projMatrix);
                break;
                case 'invTranspModelMatrix':
                    gl.uniformMatrix4fv(uData.locations[key], false, invTr);
                break;
                // ------------------------------------------ LIGHT --------------------------------------------
                case 'u_ambIntensity': 
                    gl.uniform1f(uData.locations[key], light.ambient.intensity);
                break;
                case 'u_ambLightColor': 
                    gl.uniform3fv(uData.locations[key], light.ambient.color);
                break;
                case 'u_lightColor':  // light color 
                //console.log(light.source.color);
                    gl.uniform3fv(uData.locations[key], light.source.color);
                break;
                case 'u_intensity':   // light intensity  
                    gl.uniform1f(uData.locations[key], light.source.intensity);
                break;
                case 'u_specularInt':   // spec intensity  
                //console.log(key);
                    gl.uniform1f(uData.locations[key], light.source.specularInt);
                break;
                case 'u_specularColor': // specular color 
                    gl.uniform3fv(uData.locations[key], light.source.specularColor);//
                break;
                case 'u_lightWorldPosition': // position light 
                //console.log(Object.values(light.source.positionLight));
                    gl.uniform3fv(uData.locations[key], Object.values(light.source.positionLight));
                break;
                case 'u_viewWorldPosition': // position view 
                    gl.uniform3fv(uData.locations[key], Object.values(camera.position));//
                break;
                case 'u_shininess':  
                    gl.uniform1f(uData.locations[key], light.source.shiniess);
                    //console.log(light.source.shiniess);
                break;
                case 'k_vertex':  
                    gl.uniform1f(uData.locations[key], light.source.k_vertex);
                break;
                case 'alpha':  
                gl.uniform1f(uData.locations[key], material[key]);
                break;
                // все ниже автоматизировать (дефолтный кейс)
                default: 
                    if (!material[key]){
                        break;
                    }
                    //console.log(getType(uData.info,key));
                    switch(getType(uData.info,key)){
                        case 'float':
                            gl.uniform1f(uData.locations[key], material[key]);
                        case 'vec3':
                            gl.uniform3fv(uData.locations[key], material[key]);
                        break;
                        case 'vec4':
                            gl.uniform4fv(uData.locations[key], material[key]);
                        break;
                        case 'mat4':
                            gl.uniformMatrix4fv(uData.locations[key], false, material[key]);
                            //console.log(1);
                        break;
                        case 'sampler2D':

                            cntrSampler++;

                                gl.activeTexture(gl.TEXTURE0+cntrSampler);

                                if (material[key].ref === null) {
                                    material[key].ref = gl.createTexture();
                                } 
                                gl.bindTexture(gl.TEXTURE_2D, material[key].ref);// Внимание, тут ref из Texture class -> material[uniformName].ref
                                if (material[key].needRedraw){
                                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                        
                                    if ((material[key].image === null||material[key].image.src==undefined)){
                                        gl.texImage2D(gl.TEXTURE_2D, material[key].level, gl.RGBA, material[key].width, material[key].height, material[key].border, gl.RGBA, gl.UNSIGNED_BYTE, material[key]._image);
                                    } else {
                                        gl.texImage2D(gl.TEXTURE_2D, material[key].level, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, material[key]._image);
                                    }
                                    material[key].needRedraw = false;
                                }
                                gl.uniform1i(uData.locations[key], 0+cntrSampler);// Внимание, тут ref из Uniform материала -> uniformsList[uniformName].ref         
                        break;   
                    }
                break;
            };
        }
        function getType(sourceInformation,key){
            for(let i=0;i<sourceInformation.length;i++){
                if (sourceInformation[i].name==key){
                    return getHumanTypeUniform(sourceInformation[i].type);
                }
            }
        }
        function getHumanTypeUniform(typeCode){
            let inpData = '';
            let humanType = '';
            // if (typeof(typeCode)!=='string'){
            //     inpData = new String(typeCode);
            // }
            switch (typeCode){
                case 5126: 
                    humanType = 'float';
                break;
                case 35664: 
                    humanType = 'vec2';
                break;
                case 35665: 
                    humanType = 'vec3';
                break;
                case 35666: 
                    humanType = 'vec4';
                break;
                case 35676: 
                    humanType = 'mat4';
                break;
                case 35678: 
                    humanType = 'sampler2D';
                break;               
            }
            return humanType;
        }
    }
    getProgramRef(gl,program){
        let data = {
            uniforms: {
                info: getParametrs(gl,program,gl.ACTIVE_UNIFORMS),
            },
            attributes: {
                info: getParametrs(gl,program,gl.ACTIVE_ATTRIBUTES),
            },
        };
        data.uniforms.locations = getUnifLocations(gl,program,data.uniforms.info);
        data.attributes.locations = getAtrLocations(gl,program,data.attributes.info);

        
        return data;

        function getParametrs(gl,program,type){
            let info = [];
            let numElements = gl.getProgramParameter(program, type);
            for (let i = 0; i < numElements; i++) {
                if (type==gl.ACTIVE_UNIFORMS){
                    info[i] = gl.getActiveUniform(program, i);
                } else if (type==gl.ACTIVE_ATTRIBUTES){
                    info[i] = gl.getActiveAttrib(program, i);
                }
            }
            return info;            
        }
        function getAtrLocations(gl,program,a){
            let atrLoc = {};
            
            for (let i=0;i<a.length;i++){
                atrLoc[a[i].name] = gl.getAttribLocation(program,a[i].name);
            }
            return atrLoc;
        }
        function getUnifLocations(gl,program,u){
            let unifLoc = {};
            for (let i=0;i<u.length;i++){
                unifLoc[u[i].name] = gl.getUniformLocation(program,u[i].name);
            }
            return unifLoc;
        }
    }
    compileShaders(gl,material){
        this.compileShader(gl,material.shaders.vertex,material.newShadersCode.vertex);
        this.compileShader(gl,material.shaders.fragment,material.newShadersCode.fragment);
    }
    checkProgram(gl,material){
        if (!material.ref){
            material.ref = gl.createProgram();
        }
    }
    checkShaders(gl,material){
        if (!material.shaders){
            material.shaders = {};
            material.shaders.vertex = gl.createShader(gl.VERTEX_SHADER);
            material.shaders.fragment = gl.createShader(gl.FRAGMENT_SHADER);
        }
    }
    updateDefinesShadersCode(material){
        material.newShadersCode = new WebGlScript(material.shadersCode).clone();
        let newCode = '';//null;
        const def = Object.keys(material.defines).map(define_key => "#define " + define_key);
        newCode= [...def, material.shadersCode.fragment].join('\n'); 
        material.newShadersCode.fragment = newCode;
        //return newCode;
    }
    compileShader(gl,shader,source){
        gl.shaderSource(shader, source);      
        gl.compileShader(shader);       
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){                        
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
    }
    updateMeshMatrix(){ 
        this.modelMatrix = new Matrix().multiplyToModel(this.position,this.scale,this.rotation);
        this.invTranspModelMatrix = new Matrix().invert(new Matrix().transpose(this.modelMatrix));
    }
}

export { NewMesh };