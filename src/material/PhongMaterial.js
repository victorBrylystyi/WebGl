import { defineProp } from "..";
import { WebGlPrograms } from "../program/WebGlPrograms";
import { WebGlScript } from "../program/WebGlScript";
import { Base } from "./Base";
import { CoreMaterial } from "./CoreMaterial";
import { InitialMaterial } from "./InitialMaterial";

const  newShdrsProg ={ 
    vertex: `
        attribute vec3 a_position;
        attribute vec2 aTextureCoord;
        attribute vec3 a_normal;

        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;

        uniform mat4 invTranspModelMatrix;

        varying highp vec2 vTextureCoord;

        varying vec3 world_Vertex;
        varying vec3 world_Normal;

        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0);
            vTextureCoord = aTextureCoord;
            world_Vertex = (modelMatrix * vec4(a_position.xyz,1.0)).xyz;
            world_Normal = mat3(invTranspModelMatrix) * a_normal;

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


        uniform float k_vertex;

        uniform float u_ambIntensity;
        uniform vec3 u_ambLightColor;

        uniform float u_intensity;
        uniform vec3 u_lightColor;

        uniform float u_shininess;

        uniform vec3 u_specularColor;
        uniform float u_specularInt;

        uniform vec3 u_lightWorldPosition;
        uniform vec3 u_viewWorldPosition;

        varying vec3 world_Vertex;
        varying vec3 world_Normal;

        vec3 ambient_color;
        vec3 diffuse_color;
        vec3 specular_color;

        vec3 color;

        vec3 vertexColor = vec3(1.0, 1.0, 1.0);


        void main() {

            ambient_color = u_ambLightColor * u_ambIntensity; // фоновое освещение 1 на всю сцену

                vec3 normal = normalize(world_Normal);
                float k = clamp(k_vertex, 0.0, 1.0);

                vec3 to_light = u_lightWorldPosition - k * world_Vertex;
                to_light = normalize(to_light);

                float cos_angle = dot(normal,to_light); 
                cos_angle = clamp(cos_angle, 0.0, 1.0);

            diffuse_color = cos_angle * u_lightColor * u_intensity;  

                vec3 to_View = u_viewWorldPosition -  k * world_Vertex;//
                to_View = normalize(to_View);

                vec3 halfVector = normalize(to_View + to_light);

            specular_color = (pow(dot(normal, halfVector), u_shininess) * u_specularColor) * u_specularInt;

            #ifdef USE_MAP
                vertexColor *= texture2D(map, vTextureCoord).rgb;
            #endif

            #ifdef USE_SECONDMAP
                vertexColor *= texture2D(secondMap, vTextureCoord).rgb;
            #endif

            #ifdef USE_COLOR
                vertexColor *= v_color.rgb;
            #endif
                    
            color = ambient_color; 
            color += vertexColor.rgb * diffuse_color; //
            color += specular_color;

            gl_FragColor = vec4(color, v_color.a);
        }
    `,
};

class PhongMaterial extends InitialMaterial{
    constructor(data){
        super(data);
        defineProp(this,"secondMap",'USE_SECONDMAP');
        this.getShadersCode(newShdrsProg);
    }
}


export { PhongMaterial };

/*
 // программа есть не один источник света 

            // light_color = vec3(0);
            // для каждого источника света light_color += 
                //cos_angle[текущего источника] * u_lightColor[текущего источника] * u_intensity[текущего источника];
            // specular = СУММ(specular_light[текущего источника]);
            //rslt = ambient_color =(u_lightColor * u_intensity);
            // rslt += v_color.rgb * light_color;
            // rslt += specular;



    // specular вариант вычисления 
                    reflection = 2.0 * cos_angle * normal - to_light;
                reflection = normalize(reflection);
                
                to_camera = -1.0 * v_Vertex;
                to_camera = normalize(to_camera);

                cos_angle = dot(reflection, to_camera);
                cos_angle = clamp(cos_angle, 0.0, 1.0);
                cos_angle = pow(cos_angle, u_shininess);

                if (cos_angle > 0.0) {
                    specular_color = u_lightColor * cos_angle;
                    diffuse_color = diffuse_color * (1.0 - cos_angle);
                  } else {
                    specular_color = vec3(0.0, 0.0, 0.0);
                  }
*/

/*
const shadersPhongMaterial = {
    color:{
        vertex: `
        attribute vec3 a_position;
        attribute vec3 a_normal;
    
        uniform vec3 u_lightWorldPosition;
        uniform vec3 u_viewWorldPosition;
        uniform mat4 modelMatrix;
        uniform mat4 invTranspModelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;

        varying vec3 v_normal;
        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); 

            v_normal =  mat3(invTranspModelMatrix) * a_normal;
            vec3 surfaceWorldPosition = mat3(modelMatrix) * a_position.xyz;
            v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
            v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
        }
    `,
        fragment: `
        precision mediump float;
    
        uniform vec4 v_color;
        uniform vec3 u_reverseLightDirection;
        uniform float u_shininess;

        uniform vec3 u_lightColor;
        uniform vec3 u_specularColor;

        varying vec3 v_normal;
        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;

        void main() {
            vec3 normal = normalize(v_normal);
            vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
            vec3 surfaceToViewDirection = normalize(v_surfaceToView);
            vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

            //float light = dot(normal, u_reverseLightDirection);
            float light = dot(normal, surfaceToLightDirection);
            float specular = 0.0;
            
            if (light > 0.0) {
              specular = pow(dot(normal, halfVector), u_shininess);
            }

            gl_FragColor = v_color;
            gl_FragColor.rgb *=  light * u_lightColor;
            gl_FragColor.rgb += specular * u_specularColor;
        }
    `,
    },
    map:{
        vertex: `
        attribute vec3 a_position;
        attribute vec2 aTextureCoord;
        attribute vec3 aVertexNormal;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
        uniform mat4 uNormalMatrix;
    
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
            vTextureCoord = aTextureCoord;
            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(1, 1, 1);
            highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      
            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
        }
    `,
        fragment: `
        precision mediump float;

        uniform sampler2D uSampler;

        varying highp vec3 vLighting;
        varying highp vec2 vTextureCoord;

    
        void main() {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        }
    `,
    },
    mapAndColor:{
        vertex: `
        attribute vec3 a_position;
        attribute vec2 aTextureCoord;
        attribute vec3 aVertexNormal;
    
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projMatrix;
        uniform mat4 uNormalMatrix;
    
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;
    
        void main() {
            gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position.xyz,1.0); //
            vTextureCoord = aTextureCoord;
            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(1, 1, 1);
            highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      
            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
        }
    `,
        fragment: `
        precision mediump float;

        uniform sampler2D uSampler;
        uniform vec4 v_color;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

    
        void main() {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord)*color;
            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        }
    `,
    }
};


*/

