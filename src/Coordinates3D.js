
class Coordinates3D {
    constructor (x=0,y=0,z=0){
        this.x=x;
        this.y=y;
        this.z=z;
    }
    clone(){
        return new Coordinates3D(this.x,this.y,this.z);
    }
}
export { Coordinates3D };