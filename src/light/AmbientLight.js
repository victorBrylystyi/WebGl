import { CoreLight } from "./CoreLight";

class AmbientLight extends CoreLight {
    constructor (){
        super();
        this.typeLight = 'ambient';
    }

}

export { AmbientLight };