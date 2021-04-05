import { InitialMaterial } from "./InitialMaterial";

const drawShadowShader = {
    vertex: `
    attribute vec3 a_position;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projMatrix;

    uniform mat4 viewLightMatrix;
    uniform mat4 projLightMatrix;

    varying vec3 v_lightPos;
    //varying vec4 lightPos;

    void main() {
        gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0);

        vec4 lightPos = projLightMatrix * viewLightMatrix * modelMatrix * vec4(a_position.xyz,1.0);
        vec3 lightPosDNC = lightPos.xyz/lightPos.w;
        v_lightPos = vec3(0.5,0.5,0.5) + lightPosDNC * vec3(0.5,0.5,0.5); //  -1 >> +1   //  0 >> +1
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

        varying vec3 v_lightPos;

        //float thisShadow = 1.0;  // коэф затенения 

        vec3 color = vec3(1.0,1.0,1.0);

        float bias = 0.007;

        void main() {

            #ifdef USE_MAP
                vec2 shdwMap = v_lightPos.xy;
                vec4 shadowMapColor = texture2D(map, shdwMap);

                float z_ShadowMap = shadowMapColor.r;

                // if (z_ShadowMap + bias <= v_lightPos.z){ 
                //     thisShadow = 0.01;
                // }

                float thisShadow = v_lightPos.z - bias > z_ShadowMap ? 0.01 : 1.0;


            #endif

            #ifdef USE_COLOR
                color *= v_color.rgb;
            #endif

            color *= thisShadow;

            gl_FragColor = vec4(color,1.0);
            //gl_FragColor = vec4(thisShadow);
           //gl_FragColor = vec4(vec3(v_lightPos.z,v_lightPos.z,v_lightPos.z),1.0);
           //gl_FragColor = vec4(vec3(z_ShadowMap,z_ShadowMap,z_ShadowMap),1.0);
        }
`,  
};

class ShadowDrawMaterail extends InitialMaterial{
    constructor(data){
        super(data);
        this.getShadersCode(drawShadowShader);
    }
}

export { ShadowDrawMaterail };