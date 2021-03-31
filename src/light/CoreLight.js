
class CoreLight {
    constructor(){
        this.type = 'light';
        this.color = [];
        this.intensity = 0;
    }
    update(){}
    createDataToWebgl (){
        if (this.typeLight == 'ambient'){
            return {
                    color: this.color,
                    intensity:this.intensity,
                    type: this.typeLight,
            };
        } else {
            return {
                    color: this.color,
                    intensity: this.intensity,
                    positionLight: this.position,
                    shiniess: this.shininess,
                    specularColor: this.specularColor,
                    specularInt: this.specularInt,
                    k_vertex: this.k_vertex,
                    type: this.typeLight,
            };
        }
    }
}
export { CoreLight };