import { ProgramRules } from "../program/ProgramRules";
import { WebGlPrograms } from "../program/WebGlPrograms";
import { WebGlScript } from "../program/WebGlScript";

class CoreMaterial {
    constructor (data){
        this.type = 'material';
        this.data = data;
        //this._data = data;
        //this._data = this.crData(data)
        // Object.defineProperty(this,'_data',{
        //     get(){
        //         let rslt = {};
        //         if (data){
        //             rslt = data;
        //         } else {
        //             rslt = {
        //                 color: [1.0,1.0,1.0,1.0],
        //                 map: null
        //             };
        //         }
        //     return rslt;
        //     }
        // });
        //console.log(this._data);
        //this._color =   [1.0,1.0,1.0,1.0];
        //this._map = null;
        this.struct = {
            color: (this.data.color!==undefined),
            map: (this.data.map!==undefined),
        };
        this.defines = {
            USE_COLOR: true,
        };
        this.needRecompile = false;
    }
    // crData(data){
    //     let rslt = {};
    //     if (data){
    //         rslt = data;
    //     } else {
    //         rslt = {
    //             color: [1.0,1.0,1.0,1.0],
    //         };
    //     }
    // return rslt;
    // }
    // set data(newData){
    //     if (newData){
    //         if (newData.hasOwnProperty('map')&(!this._data.hasOwnProperty('map'))){
    //             this.defines.USE_MAP = true;
    //             this.needRecompile = true;
    //         } else if ((!newData.hasOwnProperty('map'))&(this._data.hasOwnProperty('map'))){
    //             Reflect.deleteProperty(this.defines, 'USE_MAP');
    //             this.needRecompile = true;
    //         }
    //         this._data = newData;
    //     } else {
    //         this._data = {
    //             color: [1.0,1.0,1.0,1.0],
    //             map: null
    //         };
    //         Reflect.deleteProperty(this.defines, 'USE_MAP');
    //         this.needRecompile = true;
    //     }
    // }
    createShadersCode(code){
        //let data = Object.entries(this.data);
        if (!(this.struct.color||this.struct.map)){
                console.log('Add material! Color or/and map like {color:[0.0,0.0,0.0,1.0]}');
          } else if (this.struct.color & !this.struct.map){
                this.shadersCode = new WebGlScript(code.color).clone();
          } else if (!this.struct.color & this.struct.map){
                this.shadersCode = new WebGlScript(code.map).clone();
          } else if (this.struct.color & this.struct.map){
                this.shadersCode = new WebGlScript(code.mapAndColor).clone();
          }
          //console.log('crShCode',this.shadersCode);
    }

    getProgram(gl){ 
        //return new WebGlPrograms(gl).compilePr(this.shadersCode,this.defines);//
        this.progRules = new ProgramRules(gl,this.shadersCode);
    }
    makeWebGlDependenseFcn(gl){
        if (this.struct.map) this.createTexture(gl);
    }
    createTexture(gl){
        this.texture = gl.createTexture();
    }
    clone(){}
}

export { CoreMaterial }