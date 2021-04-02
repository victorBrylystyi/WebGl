import { Coordinates3D } from "../Coordinates3D";
import { Matrix } from "../math/Matrix";

class Camera{
    constructor(type){
        this.type= type;
        this.position = new Coordinates3D();
        this.rotation = new Coordinates3D(); 
        this.scale = new Coordinates3D(1,1,1);
        this.ortographicSett = {
            right: 1,
            left: 0,
            top: 0, 
            bottom: 1, 
            far: 0,
            near: 0,
        };
        this.perspectiveSett = {
            zNear: 0.5,
            zFar: 0,
            fov: 60,
            aspect:0,
        };
        this.useLookAt = false;
        this.useRotationAroundTarget = false;
        this._target = new Coordinates3D();
        this.radiusRotation = 1000;
        this.fi = 0;
    }
    set target (newTarget){
        this._target = new Coordinates3D(newTarget[0],newTarget[1],newTarget[2]);
    }
    get target (){
        return Object.values(this._target);
    }
    updateCameraMtrx(){

        this.viewMatrix = new Matrix().identity();

        if (this.useLookAt){
            const lookAtMtrx = new Matrix().lookAt(Object.values(this.position),Object.values(this._target),[0,1,0]);
            this.viewMatrix = new Matrix().multiply(lookAtMtrx,this.viewMatrix);
        }
        if (this.useRotationAroundTarget){
                const rotArndTargetMtrx = new Matrix().yRotation(this.fi);
            this.viewMatrix = new Matrix().multiply(rotArndTargetMtrx,this.viewMatrix);
                //const targCord = new Coordinates3D(0,0,-500);
                const translToTarget = new Matrix().translate(this._target);
            this.viewMatrix = new Matrix().multiply(translToTarget,this.viewMatrix); // remove to target pos
                const radiusCord = new Coordinates3D(0,0,this.radiusRotation); // radius
            this.viewMatrix = new Matrix().translation(this.viewMatrix,radiusCord);
        }
        this.viewMatrix = new Matrix().invert(this.viewMatrix);
            const invMdlMtrx = new Matrix().invertModelMatrix(this.position,this.scale,this.rotation);
        if (!this.useLookAt) this.viewMatrix = new Matrix().multiply(invMdlMtrx,this.viewMatrix);

        switch (this.type){
            case 'ortho':
                this.ortographicMatrix = new Matrix().ortographic(this.ortographicSett);
                this.projMatrix = this.ortographicMatrix;
            break;
            case 'perspective':
                this.perspectiveMatrix = new Matrix().perspective(this.perspectiveSett);
                this.projMatrix = this.perspectiveMatrix;
            break;
        };
    }
}

export { Camera };