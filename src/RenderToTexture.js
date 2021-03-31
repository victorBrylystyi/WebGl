
class RenderToTexture {
    constructor(){
        //this.canvas = canvas;
        //this.getContext();
        // this.fb = this.gl.createFramebuffer();
        // this.rb = this.gl.createRenderbuffer();
         this.textureShadowMap = 0;

    }
    renderToTexture(gl){
        this.mapSize = 1024;

        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer (gl.FRAMEBUFFER, this.fb);
        
        this.rb = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rb);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.mapSize, this.mapSize);

        this.textureShadowMap = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.textureShadowMap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.mapSize, this.mapSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureShadowMap, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rb);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    // getContext(){
    //     this.gl = this.canvas.getContext('webgl');
    // }
}
export { RenderToTexture };