import { defineProp } from "..";
import { WebGlScript } from "../program/WebGlScript";
import { CoreMaterial } from "./CoreMaterial";
import { InitialMaterial } from "./InitialMaterial";

const shadersBasicMaterial = {
    color:{
        vertex: `
        attribute vec3 a_position;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
        }
    `,
        fragment: `
        precision mediump float;
    
        uniform vec4 v_color;
    
        void main() {
            gl_FragColor = v_color;
        }
    `,
    },
    map:{
        vertex: `
        attribute vec3 a_position;
        attribute vec2 aTextureCoord;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
    
        varying highp vec2 vTextureCoord;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
            vTextureCoord = aTextureCoord;
        }
    `,
        fragment: `
        precision mediump float;
    
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;
    
        void main() {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
    `,
    },
    mapAndColor:{
        vertex: `
        attribute vec3 a_position;
        attribute vec2 aTextureCoord;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
    
        varying highp vec2 vTextureCoord;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
            vTextureCoord = aTextureCoord;
        }
    `,
        fragment: `
        precision mediump float;

        uniform sampler2D uSampler;
        uniform vec4 v_color;

        varying highp vec2 vTextureCoord;

    
        void main() {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
            gl_FragColor = texelColor * v_color;
        }
    `,
    },
};
const prog = {
    vertex: `

        attribute vec3 a_position;
        attribute vec2 aTextureCoord;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
    
        varying highp vec2 vTextureCoord;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
            vTextureCoord = aTextureCoord;
        }
    `,
    fragment: `
        //#define USE_COLOR
        
        precision mediump float;

        uniform sampler2D uSampler;
        uniform vec4 v_color;

        varying highp vec2 vTextureCoord;

        vec4 vertexColor;

        #ifdef USE_MAP
            vertexColor *= texture2D(uSampler, vTextureCoord);
        #endif
        #ifdef USE_COLOR
            vertexColor *= v_color;
        #endif

        void main() {
            //highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
            //gl_FragColor = texelColor * v_color;
            gl_FragColor = vertexColor;
        }
    `,
    
};

const  basicProg ={ 
    vertex: `
        attribute vec3 a_position;
        attribute vec2 aTextureCoord;

        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;

        varying highp vec2 vTextureCoord;

        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0);
            vTextureCoord = aTextureCoord;
        }
    `,
    fragment: `
        precision highp float;

        #ifdef USE_MAP
            uniform sampler2D map;
        #endif

        #ifdef USE_COLOR
            uniform vec4 v_color;
        #endif

        #ifdef USE_SECONDMAP
            uniform sampler2D secondMap;
        #endif

        varying highp vec2 vTextureCoord;

        uniform float alpha;

        uniform vec3 u_lightWorldPosition;
        uniform vec3 u_viewWorldPosition;

        vec3 color;

        vec3 vertexColor = vec3(1.0, 1.0, 1.0);

        void main() {
            color = vec3 (1.0,1.0,1.0);

            #ifdef USE_MAP
                vec2 cord = vec2(vTextureCoord.x, 1.0 -vTextureCoord.y);//
                vertexColor *= texture2D(map, cord).rgb;
                //vertexColor *= texture2D(map, vTextureCoord).rgb;
                //vec2(vTextureCoord.x,1.0 - vTextureCoord.y);
            #endif

            #ifdef USE_SECONDMAP
                vertexColor *= texture2D(secondMap, vTextureCoord).rgb;
            #endif

            #ifdef USE_COLOR
                vertexColor *= v_color.rgb;
            #endif

            color *= vertexColor;

            gl_FragColor = vec4(color, v_color.a * alpha * (1.0-vertexColor.r));
        }
    `,
};



class BasicMaterial extends InitialMaterial{
    constructor(data){
        super(data);

        defineProp(this,"secondMap",'USE_SECONDMAP');
        this.getShadersCode(basicProg);
    }
    clone(){
        return new BasicMaterial(this.data);
    }
}

// class BasicMaterial extends CoreMaterial{
//     constructor(data){
//         super(data);
//         this.createShadersCode(new WebGlScript(shadersBasicMaterial).clone());
//     }
//     clone(){
//         return new BasicMaterial(this.data);
//     }
// }

export { BasicMaterial };

/*
const shadersBasicMaterial = {
    color:{
        vertex: `
        attribute vec3 a_position;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
        }
    `,
        fragment: `
        precision mediump float;
    
        uniform vec4 v_color;
    
        void main() {
            gl_FragColor = v_color;
        }
    `,
    },
    map:{
        vertex: `
        attribute vec3 a_position;
        attribute vec2 aTextureCoord;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
    
        varying highp vec2 vTextureCoord;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
            vTextureCoord = aTextureCoord;
        }
    `,
        fragment: `
        precision mediump float;
    
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;
    
        void main() {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
    `,
    },
    mapAndColor:{
        vertex: `
        attribute vec3 a_position;
        attribute vec2 aTextureCoord;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
    
        varying highp vec2 vTextureCoord;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
            vTextureCoord = aTextureCoord;
        }
    `,
        fragment: `
        precision mediump float;

        uniform sampler2D uSampler;
        uniform vec4 v_color;

        varying highp vec2 vTextureCoord;

    
        void main() {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
            gl_FragColor = texelColor * v_color;
        }
    `,
    }
};
*/
