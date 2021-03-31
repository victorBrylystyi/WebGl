
class CoreGeometry {
    constructor(){
        this.partsGeometry = [];
        this.ref = null;
    }
    createGeometry (type,cordVertex,cordMap,cordNormals){
        return {
            type: type,
            cord:{
                vertex: cordVertex,
                map: cordMap,
                normals: cordNormals
            },
            info:{
                numVertex: cordVertex.length/3,
            }
        };
    }
    createSolidGeometry(faces){
        let vertexCord = [];
        let mapCord = [];
        let normals = [];
        let numVertex = 0;
        let solid = {};
        for (let i=0;i<faces.length;i++){
            normals = normals.concat(faces[i].cord.normals);
            vertexCord = vertexCord.concat(faces[i].cord.vertex);
            mapCord = mapCord.concat(faces[i].cord.map);

            numVertex += faces[i].info.numVertex;
        } 
        solid = this.createGeometry('solid',vertexCord,mapCord,normals,numVertex);
        solid.info.numParts = faces.length;
        return solid;
    }
    getGeometry(){
        let faces = this.createVertex();
        return {
            solid: this.createSolidGeometry(faces),
            parts: faces,
        };
    }
    createVertex(){}
}

export { CoreGeometry };