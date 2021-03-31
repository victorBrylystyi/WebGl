"use strict";

class RenderingUpdate {
    constructor(speed,fi,dt=1,s=2 * Math.PI/180){
        this.f=fi;
        this.dt=dt;
        this.s=s;
        this.speed=speed;
    }
    incAngle(){
        //return this.f + this.s * this.dt;
        this.f+= this.s * this.dt*this.speed;
    }
}
export { RenderingUpdate };