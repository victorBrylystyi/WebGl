import { ProgramRules } from "../program/ProgramRules";
import { WebGlPrograms } from "../program/WebGlPrograms";
import { WebGlScript } from "../program/WebGlScript";

class Base {
    constructor(data){
        this.ref = null;
        this.defines = {
            USE_COLOR: true,
        };
        this._data = this.createData(data);
        this.needRecompile = false;
        this.needUpdateData = false;
        this.needCreate = true;
    }
    set data(newData){
        this._data = this.createData(newData);
    }
    get data(){
        return this._data;
    }
    getShadersCode(code){
        this.shadersCode = new WebGlScript(code).clone();
    }
    updateDefines(newData){
        if (newData.hasOwnProperty('map')){
            if (!this.defines.hasOwnProperty('USE_MAP')){
                this.defines.USE_MAP = true;
                this.needRecompile = true;
            }
        } else {
            if (this.defines.hasOwnProperty('USE_MAP')){
                Reflect.deleteProperty(this.defines, 'USE_MAP');
                this.needRecompile = true;
            }
        }
    }
    createData(data){
        this.needUpdateData = true;
        let rslt = {};
        if (data){
            if (!data.hasOwnProperty('color')){
                rslt = data;
                rslt.color = [1.0,1.0,1.0,1.0];
            } else {
                rslt = data;   
            }

        } else {
            rslt = {
                color: [1.0,1.0,1.0,1.0],
            };
        }
        this.updateDefines(rslt);
        return rslt;
    }
    getProgram(gl){ 
        //this.progRules = new ProgramRules(gl,this.shadersCode,this.defines);
        return new ProgramRules(gl,this.shadersCode,this.defines);
    }
    makeWebGlDependenseFcn(gl){
        //if (this.defines.USE_MAP) this.createTexture(gl);
        this.createTexture(gl);
    }
    createTexture(gl){
        this.texture = gl.createTexture();
    }
}

export { Base };