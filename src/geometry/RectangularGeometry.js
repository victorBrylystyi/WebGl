
import { Coordinates3D } from "../Coordinates3D";
import { CoreGeometry } from "./CoreGeometry";

class RectangularGeometry {
    constructor(w,h,x,y,z){
      this.start = new Coordinates3D(x,y,z);
      this.w = w;
      this.h = h;
      this.createVertex();
    }
    createVertex(){
        let x0 = this.start.x;
        let x1 = x0+ this.w;
        let y0 = this.start.y;
        let y1 = y0+this.h; 
        let z0 = this.start.z;

        let vertex =  [
            x0,y0,z0,
            x1,y0,z0,
            x0,y1,z0,
      
            x0,y1,z0,
            x1,y0,z0,
            x1,y1,z0,
        ];
        this.cord = vertex;
        this.numVertex = vertex.length / 3;
        //this.offsetBytes = vertex.length * 4;
        this.numFaces = 1;
    }

}

export { RectangularGeometry };
