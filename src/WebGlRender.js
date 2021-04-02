import { Buffer } from "./Buffer";
import { PhongMaterial } from "./material/PhongMaterial";
import { ShadowMaterial } from "./material/ShadowMaterial";
import { Texture } from "./material/Texture";
import { ProgramRules } from "./program/ProgramRules";
import { FP, FN } from "./index";
import { ShadowDrawMaterail } from "./material/ShadowDrawMaterial";
import { BasicMaterial } from "./material/BasicMaterial";
import { Matrix } from "./math/Matrix";

class WebGlRender {
    constructor (canvas){
        this.canvas = canvas;
        this.getContext();
        this.frameBuffer = null;
        this.depthBuffer = null;
        this.targetTexture = null;
        this.useShadow = false; 
        this.superMaterial = null;
        this.shadowMaterial = null;
        this.shadowDraw = null;
    }
    rendering(scene,camera,activeBuffer,sceneActiveMaterial,clearColor){    
        
        scene.ref = sceneActiveMaterial;

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,activeBuffer);  // bind current frameBuffer 

        this.clearScreen(scene.background,clearColor); 
        this.update(scene,camera); 
        this.draw(scene,camera); 

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null);
    }
    render(scene,camera,shadowCamera,orthoScene,cam2){
        if (this.useShadow||true){ // if render to texture 
            // if (!this.superMaterial){ // create SuperMaterial if whant to see rslt like a texture in all meshs 
            //     this.superMaterial = new PhongMaterial({map:new Texture()});
            // }
            if (!this.shadowMaterial){
                this.shadowMaterial = new ShadowMaterial();
            }
            if (!this.targetTexture){ // if no target texture 
                this.targetTexture = new Texture(null,2048,2048);
                this.targetTexture.image = null;
                this.targetTexture.ref = this.gl.createTexture();
            }
            if (this.targetTexture && this.targetTexture.needRedraw){ // if need redraw target texture 
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture.ref);

                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.targetTexture.width, this.targetTexture.height, 0,
                          this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.targetTexture.image);

                this.targetTexture.needRedraw = false;
            }
            if (!this.frameBuffer){ // if no framebuffer for color 
                this.frameBuffer = this.gl.createFramebuffer();
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.frameBuffer); 
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.targetTexture.ref, 0);
            }
            if (!this.depthBuffer){ // if no renderbuffer for depth
                this.depthBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.targetTexture.width, this.targetTexture.height);
                this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBuffer);      
            }
            this.gl.viewport(0, 0, this.targetTexture.width, this.targetTexture.height);
            this.rendering(scene,shadowCamera,this.frameBuffer,this.shadowMaterial,true);  
        }

        // render to canvas 



        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height); // в рендеринг 
        this.rendering(scene,camera,null,null,true);

        // this.gl.clearDepth(1.0); 
        // this.gl.enable(this.gl.BLEND);

        // исходный фрагмент - тот который рисуется сейчас 
        // целевой - тот который находится во фреймбуфере 

        // this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.DST_COLOR); // src - исходный множитель; dst - целевой множитель 

        //исходным множителем является значение цвета исходного фрагмента
        // целевой множитель - значение цвета целевого фрагмента

        // this.gl.disable(this.gl.BLEND); // смешивание выкл



        // отрисовать в текстуру результат ShadowDrawMaterail({map: текстура глубины отрисованая ранее}) который расчитывает тень 
        // при отрисовке главной сцены вкл смешивание 
        // 

        if (!this.shadowDraw){
            this.shadowDraw = new ShadowDrawMaterail({map:this.targetTexture});
            this.shadowDraw.v_color = [1.0,1.0,1.0,1.0];
        }
        this.shadowDraw.viewLightMatrix = shadowCamera.viewMatrix;
        this.shadowDraw.projLightMatrix = shadowCamera.projMatrix;

        if (!this.targetTextureShadow){ // if no target texture 
            this.targetTextureShadow = new Texture(null,this.canvas.width,this.canvas.height);
            this.targetTextureShadow.image = null;
            this.targetTextureShadow.ref = this.gl.createTexture();
        }
        if (this.targetTextureShadow && this.targetTextureShadow.needRedraw){ // if need redraw target texture 
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTextureShadow.ref);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.targetTextureShadow.width, this.targetTextureShadow.height, 0,
                      this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.targetTextureShadow.image);

            this.targetTextureShadow.needRedraw = false;
        }
        if (!this.frameBufferDraw){ // if no framebuffer for color 
            this.frameBufferDraw = this.gl.createFramebuffer();
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.frameBufferDraw); 
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.targetTextureShadow.ref, 0);
        }
        if (!this.depthBufferDraw){ // if no renderbuffer for depth
            this.depthBufferDraw = this.gl.createRenderbuffer();
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBufferDraw);
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.targetTextureShadow.width, this.targetTextureShadow.height);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBufferDraw);      
        }
        this.gl.viewport(0, 0, this.targetTextureShadow.width, this.targetTextureShadow.height);
        this.rendering(scene,camera,this.frameBufferDraw,this.shadowDraw,true);  

        if (!this.superMaterialShadow){
            this.superMaterialShadow = new BasicMaterial({map:this.targetTextureShadow});//this.targetTextureShadow
        }  

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height); 
        this.rendering(orthoScene,cam2,null,this.superMaterialShadow,false); // отросцена отрокамера 

        this.gl.disable(this.gl.BLEND);
    }
    update(scene,camera){
        scene.update(this.gl);
        camera.updateCameraMtrx();
    }
    draw(scene,camera){
        scene.drawScene(this.gl,camera);
    }
    clearScreen(background,clearColor){
        if (clearColor){
            this.gl.clearColor(background[0],
                background[1],
                background[2],
                background[3]);  
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        // this.gl.enable(this.gl.CULL_FACE);
        // this.gl.cullFace(this.gl.BACK);  
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
         this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    }
    getContext(){
        this.gl = this.canvas.getContext('webgl');
    }
}


export { WebGlRender };
