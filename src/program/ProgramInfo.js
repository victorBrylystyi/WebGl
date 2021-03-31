
class ProgramInfo {
    constructor(vertex = 0,fragment = 0,attributesName = 0 ,uniformNames = 0){
        this.vertex = vertex;
        this.fragment = fragment;
        this.attributesName = attributesName;
        this.uniformNames = uniformNames;
    }
    createInfo(){
        return {
            shadersCode:{
              vertex: this.vertex,
              fragment: this.fragment,
            },
            attributesName: this.attributesName,
            uniformNames: this.uniformNames,
          };
    }
}

export { ProgramInfo };