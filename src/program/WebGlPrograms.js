import { ProgramRules } from "./ProgramRules";
import { WebGlScript } from "./WebGlScript";



//  NOT USE NOW 22.03.21


class WebGlPrograms {
    constructor(gl){
        this.gl = gl;
    }
    compilePr(shadersCode,defines){
        let atributes = [];
        let uniforms = [];
        // let fragment = new Object();
        // let vertex = new Object();
        let aInfo = [];
        let uInfo = [];

        let program = this.createProgram(shadersCode.vertex,shadersCode.fragment);

        
        const def = Object.keys(defines).map(define_key => "#define " + define_key);
        shadersCode.fragment = [...def, shadersCode.fragment].join('/n'); 

        //let info = [];
        const numAttribs = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < numAttribs; i++) {
                aInfo[i] = this.gl.getActiveAttrib(program, i);
                atributes[i]=this.gl.getActiveAttrib(program, i).name;
            }
        const numUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < numUniforms; ++i) {
                uInfo [i] = this.gl.getActiveUniform(program, i);
                uniforms[i]=this.gl.getActiveUniform(program, i).name;
            }



        console.log(aInfo);
        //console.log(shadersCode);

        return  new ProgramRules(this.gl,program,atributes,uniforms,aInfo,uInfo);
    }
    createShaders(type,source){
        let shader = this.gl.createShader(type); 
        this.gl.shaderSource(shader, source);      
        this.gl.compileShader(shader);            
        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){                        
            return shader;
        }
        else {
            console.log(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
        }
    }
    createProgram(vertex,fragment){

        let program = this.gl.createProgram();
        this.gl.attachShader(program, this.createShaders(this.gl.VERTEX_SHADER,vertex));
        this.gl.attachShader(program, this.createShaders(this.gl.FRAGMENT_SHADER,fragment));
        this.gl.linkProgram(program);
        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
          return program; 
        }
        else {
            console.log(this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
        }
    }
}
export { WebGlPrograms };


/*

        if ((camera === undefined)&(mesh.material === undefined)){
            vertex = `
                attribute vec3 a_position;

                uniform mat4 modelMatrix;

                varying vec4 und_color;

                void main() {
                    gl_Position = modelMatrix * vec4(a_position.xyz,1.0); 
                    und_color = gl_Position * 0.5 + 0.5;
                }
            `;
            fragment = `
                precision mediump float;

                varying vec4 und_color;

                void main() {
                    gl_FragColor = und_color;
                }
            `;
            atrNames = ['a_position'];
            uniformVarNames =['modelMatrix'];
        }
        else if ((camera === undefined)&(mesh.material !== undefined)){
            vertex = `
                attribute vec3 a_position;
                attribute vec4 a_color;
        
                uniform mat4 modelMatrix;
        
                varying vec4 v_color;
        
                void main() {
                    gl_Position = modelMatrix * vec4(a_position.xyz,1.0);
                    v_color = a_color;
                }
            `;
            fragment = mesh.material.getFragmentCode();
            atrNames = ['a_position','a_color'];
            uniformVarNames =['modelMatrix'];
        }
        else if ((camera !== undefined)&(mesh.material === undefined)){
            vertex = `
                attribute vec3 a_position;

                uniform mat4 modelMatrix;
                uniform mat4 viewMatrix;
                uniform mat4 projMatrix;

                varying vec4 und_color;

                void main() {
                    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0);
                    und_color = gl_Position * 0.5 + 0.5;
                }
            `;
            fragment = `
                precision mediump float;

                varying vec4 und_color;

                void main() {
                    gl_FragColor = und_color;
                }
            `;
            atrNames = ['a_position'];
            uniformVarNames = ['modelMatrix','viewMatrix','projMatrix'];
        }
        else if ((camera !== undefined)&(mesh.material !== undefined)){
            vertex = `
                attribute vec3 a_position;
                attribute vec4 a_color;

                uniform mat4 modelMatrix;
                uniform mat4 viewMatrix;
                uniform mat4 projMatrix;

                varying vec4 v_color;

                void main() {
                    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); 
                    v_color = a_color;
                }
            `;
            fragment = mesh.material.getFragmentCode();
            atrNames = ['a_position','a_color'];
            uniformVarNames = ['modelMatrix','viewMatrix','projMatrix'];
        }
*/