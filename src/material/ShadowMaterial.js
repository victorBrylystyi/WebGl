import { CoreMaterial } from "./CoreMaterial";
import { InitialMaterial } from "./InitialMaterial";

const shadersShadow = {
    vertex: `
        attribute vec3 a_position;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;

        vec4 pack_depth(const in float depth);

        varying vec4 depth; 
        varying float v_depth;
    
        void main() {
            vec4 position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0);

            depth = pack_depth(0.5*(position.z/position.w)+0.5);

            gl_Position = position;
        }
        vec4 pack_depth(const in float depth) {
                const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
                const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
                vec4 res = fract(depth * bit_shift);
                res -= res.xxyz * bit_mask;
                return res;
        }

    `,
    fragment: `
        precision highp float;
    
        varying float v_depth;
        varying vec4 depth; 

        float unpack_depth(const in vec4 rgba_depth); 

        void main() {
            float rsltDepth = unpack_depth(depth);
            gl_FragColor = vec4(rsltDepth,rsltDepth,rsltDepth,1.0);
            //gl_FragColor = vec4(v_depth,v_depth,v_depth,1.0);
            //gl_FragColor = vec4(v_depth,0.0,0.0,1.0);
        }
        float unpack_depth(const in vec4 rgba_depth) {
            const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
            float depth = dot(rgba_depth, bit_shift);
            return depth;
        }
    `,  
};

class ShadowMaterial extends InitialMaterial{
    constructor(data){
        super(data);
        this.getShadersCode(shadersShadow);
    }

}
// class ShadowMaterial extends CoreMaterial{
//     constructor(data){
//         super(data);
//         this.createShadersCode(shadersShadow);
//     }

// }
export { ShadowMaterial };