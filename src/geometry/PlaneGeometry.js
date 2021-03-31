import { Coordinates3D } from "../Coordinates3D";
import { CoreGeometry } from "./CoreGeometry";

class PlaneGeometry extends CoreGeometry {
    constructor (w,h,x,y,z){
        super();
        this.start = new Coordinates3D(x,y,z);
        this.w = w;
        this.h = h;
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
        const mapCord2D = [
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0 
        ];
        const frontNormals = [
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
        ];
        const backNormals = [
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
        ];
        const topNormals = [
            0.0,  -1.0,  0.0,
            0.0,  -1.0,  0.0,
            0.0,  -1.0,  0.0,

            0.0,  -1.0,  0.0,
            0.0,  -1.0,  0.0,
            0.0,  -1.0,  0.0,
        ];
        const bottomNormals = [
            0.0, 1.0,  0.0,
            0.0, 1.0,  0.0,
            0.0, 1.0,  0.0,

            0.0, 1.0,  0.0,
            0.0, 1.0,  0.0,
            0.0, 1.0,  0.0,
        ];
        const leftNormals = [
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,

            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
        ];
        const rightNormals = [
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
        ];

        this.partsGeometry = [
            this.createGeometry('part',vertex,mapCord2D,frontNormals),
        ];

        //vertex = vertex.concat(frontRect.cord,backRect.cord,topVertex,bottomVertex,leftVertex,rightVertex);
        return this.partsGeometry;
    }

}

export { PlaneGeometry };