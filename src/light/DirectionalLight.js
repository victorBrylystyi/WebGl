import { Coordinates3D } from "../Coordinates3D";
import { Matrix } from "../math/Matrix";
import { CoreLight } from "./CoreLight";
/*
const BLACK = [0.0, 0.0, 0.0];
const WHITE = [1.0, 1.0, 1.0];
const RED   = [1.0, 0.0, 0.0];
const GREEN = [0.0, 1.0, 0.0];
const BLUE  = [0.0, 0.0, 1.0];
const YELLOW = [0.6,1.0,0.5];//(60,100%,50%)
*/
class DirectionalLight extends CoreLight{
    constructor (){
        super();
        this.typeLight = 'directional';
        this.worldPosition = new Coordinates3D();
        //this.position = new Coordinates3D();
        this.specularColor = [1.0,1.0,1.0];
        this.specularInt = 1.0;
        this.shininess = 10.0;
        this.k_vertex = 0.0;
        this._target = null;
    }
    set target (target){
        this._target = new Coordinates3D(target[0],target[1],target[2]);
    }
    get target (){
        return this._target;
    }
    update(){
        if (!this.target){
            this.position = Object.values(this.worldPosition);
        } else {
            this.position = new Matrix().subtractVectors(Object.values(this._target),Object.values(this.worldPosition)); 
        }
    }
}

export { DirectionalLight };