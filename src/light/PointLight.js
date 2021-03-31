import { Coordinates3D } from "../Coordinates3D";
import { CoreLight } from "./CoreLight";

class PointLight extends CoreLight{
    constructor (){
        super();
        this.typeLight = 'point'; 
        this.position = new Coordinates3D();
        this.specularColor = [1.0,1.0,1.0];
        this.specularInt = 1.0;
        this.shininess = 10.0;
        this.k_vertex = 1.0;
    }
}

export { PointLight };