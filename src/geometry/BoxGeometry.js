import { Coordinates3D } from "../Coordinates3D";
import { CoreGeometry } from "./CoreGeometry";
import { RectangularGeometry } from "./RectangularGeometry";

class BoxGeometry extends CoreGeometry{
    constructor (w,h,d,x,y,z){
        super();
        this.w = w;
        this.h = h;
        this.d = d;
        this.start = new Coordinates3D(x,y,z);
        //this.createVertex();
    }
    createVertex(){
        let vertex = [];
        let frontRect = new RectangularGeometry(this.w,this.h,this.start.x,this.start.y,this.d/2);
        let backRect = new RectangularGeometry(this.w,this.h,this.start.x,this.start.y,-(this.d/2));

//--------------- TOP -----------------------------
        let topX0 = frontRect.cord[0];
        let topY0 = frontRect.cord[1];
        let topZ0 = frontRect.cord[2];

        let topX1 = frontRect.cord[3];
        let topY1 = frontRect.cord[4];
        let topZ1 = frontRect.cord[5];  

        let topX2 = backRect.cord[0];
        let topY2 = backRect.cord[1];
        let topZ2 = backRect.cord[2];
//----------------------------------------------------
        let topX3 = backRect.cord[3];
        let topY3 = backRect.cord[4];
        let topZ3 = backRect.cord[5];

        let topVertex =  [
            topX0,topY0,topZ0,
            topX1,topY1,topZ1,
            topX2,topY2,topZ2,
      
            topX2,topY2,topZ2,
            topX1,topY1,topZ1,
            topX3,topY3,topZ3,
        ];
//--------------- Bottom -----------------------------
        let bottomX0 = frontRect.cord[9];
        let bottomY0 = frontRect.cord[10];
        let bottomZ0 = frontRect.cord[11];

        let bottomX1 = frontRect.cord[15];
        let bottomY1 = frontRect.cord[16];
        let bottomZ1 = frontRect.cord[17];  

        let bottomX2 = backRect.cord[9];
        let bottomY2 = backRect.cord[10];
        let bottomZ2 = backRect.cord[11];
//----------------------------------------------------
        let bottomX3 = backRect.cord[15];
        let bottomY3 = backRect.cord[16];
        let bottomZ3 = backRect.cord[17];

        let bottomVertex =  [
            bottomX0,bottomY0,bottomZ0,
            bottomX1,bottomY1,bottomZ1,
            bottomX2,bottomY2,bottomZ2,

            bottomX2,bottomY2,bottomZ2,
            bottomX1,bottomY1,bottomZ1,
            bottomX3,bottomY3,bottomZ3,
        ];
        let leftVertex =  [
            topX0,topY0,topZ0,
            topX2,topY2,topZ2,
            bottomX0,bottomY0,bottomZ0,

            bottomX0,bottomY0,bottomZ0,
            topX2,topY2,topZ2,
            bottomX2,bottomY2,bottomZ2,
        ];
        let rightVertex =  [
            topX1,topY1,topZ1,
            topX3,topY3,topZ3,
            bottomX1,bottomY1,bottomZ1,

            bottomX1,bottomY1,bottomZ1,
            topX3,topY3,topZ3,
            bottomX3,bottomY3,bottomZ3,
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
            this.createGeometry('part',frontRect.cord,mapCord2D,frontNormals),
            this.createGeometry('part',backRect.cord,mapCord2D,backNormals),
            this.createGeometry('part',topVertex,mapCord2D,topNormals),
            this.createGeometry('part',bottomVertex,mapCord2D,bottomNormals),
            this.createGeometry('part',leftVertex,mapCord2D,leftNormals),
            this.createGeometry('part',rightVertex,mapCord2D,rightNormals),
        ];

        //vertex = vertex.concat(frontRect.cord,backRect.cord,topVertex,bottomVertex,leftVertex,rightVertex);
        return this.partsGeometry;
    }
}

export { BoxGeometry };