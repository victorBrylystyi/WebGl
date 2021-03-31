import { CoreMaterial } from "./CoreMaterial";
import { InitialMaterial } from "./InitialMaterial";

const shadersShadow = {
    vertex: `
        attribute vec3 a_position;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
    
        varying float v_depth;
    
        void main() {
            vec4 position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0);
            float zBuf = position.z/position.w;
            v_depth = 0.5 + zBuf*0.5;
            gl_Position = position;
        }
        vec4 pack_depth(const in float depth)
            {
            const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
            const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
            vec4 res = fract(depth * bit_shift);
            res -= res.xxyz * bit_mask;
            return res;
            }

float unpack_depth(const in vec4 rgba_depth)
{
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float depth = dot(rgba_depth, bit_shift);
    return depth;
}
    `,
    fragment: `
        precision highp float;
    
        varying float v_depth;
    
        void main() {
            gl_FragColor = vec4(v_depth,v_depth,v_depth,1.0);
            //gl_FragColor = vec4(v_depth,0.0,0.0,1.0);
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