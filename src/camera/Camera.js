import { Coordinates3D } from "../Coordinates3D";
import { Matrix } from "../math/Matrix";

class Camera{
    constructor(type){
        this.type= type;
        this.position = new Coordinates3D();
        this.rotation = new Coordinates3D(); 
        this.scale = new Coordinates3D(1,1,1);
        this.ortographicSett = {
            right: 0,
            left: 0,
            top: 0, 
            bottom: 0, 
            far: 0,
            near: 0,
        };
        this.perspectiveSett = {
            zNear: 0.5,
            zFar: 0,
            fov: 60,
            aspect:0,
        };
    }
    updateCameraMtrx(){
        //let cameraMtrx = new Matrix().lookAt(Object.values(this.position),[0,0,-500],[0,1,0]);
        //this.viewMatrix = new Matrix().invert(cameraMtrx);
        this.viewMatrix = new Matrix().invertModelMatrix(this.position,this.scale,this.rotation);

        // let fPos = [1000,0,-500];
        // let cmrM = new Matrix().yRotation(this.rotation.y);
        // let tr = new Matrix().multiply(cmrM, new Matrix().translate(this.position));

        // let camPos = [tr[12],tr[13],tr[14]];


        //this.viewMatrix = new Matrix().lookAt(camPos,fPos,[0,1,0]);
        //this.viewMatrix = new Matrix().invert(this.viewMatrix);
        this.ortographicMatrix = new Matrix().ortographic(this.ortographicSett);
        this.perspectiveMatrix = new Matrix().perspective(this.perspectiveSett);
        //new Matrix().multiplyToModel(this.position,this.scale,this.rotation);
        if (this.type == 'ortho'){
            this.projMatrix = this.ortographicMatrix;
        } else if (this.type == 'perspective'){
            this.projMatrix = this.perspectiveMatrix;
        }
        //this.projMatrix = this.perspectiveMatrix;
    }
}

export { Camera };