
class Coordinates {
    constructor (x=0,y=0){
        this.x=x;
        this.y=y;
    }
    clone(){
        return new Coordinates(this.x,this.y);
    }
}
export { Coordinates };