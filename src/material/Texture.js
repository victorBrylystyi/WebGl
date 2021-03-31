const defaultImage = {
    width: 2,
    height: 2,
    data: new Uint8Array([ // Создаем буффер из массива
        255, 255, 0, 255, // 1 pixel 255, 255, 255, 255,
        255, 0, 255, 255, // 2 pixel
        0, 255, 255, 255, // 3 pixel
        0, 255, 0, 255 // 4 pixel
      ]),
      
    //   data: new UintBuffer([
    //     255, 255, 255, 255, // 1 pixel
    //     255, 255, 255, 255, // 2 pixel
    //     255, 255, 255, 255, // 3 pixel
    //     255, 255, 255, 255 // 4 pixel
    //   ]),

  };




class Texture {
    constructor(image = null,width,height){
        //this.target = gl.TEXTURE_2D;
        this.level = 0;
        //this.internalformat = gl.RGBA;
        //this.format =  gl.RGBA;
        this.border = 0;
        //this.type = gl.UNSIGNED_BYTE;
        this.width = width || defaultImage.width;
        this.height = height || defaultImage.height;
        this._image = image || defaultImage.data;
        this.ref = null;
        this.needRedraw = true;
    }
    set image (im){
        this._image = im;
        this.needRedraw = true;
    }
    get image (){
        return this._image;
    }
}

export { Texture };