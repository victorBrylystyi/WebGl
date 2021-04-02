import { defineProp } from "..";
import { WebGlScript } from "../program/WebGlScript";
import { Texture } from "./Texture";

class InitialMaterial {
    constructor(data){
        this.defines = {
            USE_COLOR: true,
        };
        this.alpha = 1.0;
        this.ref = null;
        this.shaders = null;
        this.v_color = [1.0,1.0,1.0,1.0];
        defineProp(this,"map",'USE_MAP');
        this.needCreateProgram = true;
        this.needRecompile = false;

        this.sortData(data);
    }
    sortData(data){
        if (data){
            if (data.color!==undefined){
                this.v_color = data.color;
            }
            if (data.map!==undefined){
                this.map = data.map
            }
        }
    }
    getShadersCode(code){
        this.shadersCode = new WebGlScript(code).clone();
    }

}

export { InitialMaterial };