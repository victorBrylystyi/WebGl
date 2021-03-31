
class WebGlScript {
    constructor(code){
        this.code = code;
    }
    clone(){
        let cloneCode = {};
        Object.assign(cloneCode,this.code);
        return cloneCode;
    }
}
export { WebGlScript };