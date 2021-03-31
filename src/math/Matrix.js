import { Coordinates3D } from "../Coordinates3D";

class Matrix { 
      window(data){
        let w = new Coordinates3D(data.x,data.y,data.z);
        return [
          2 / w.x, 0, 0, 0,
          0, -2 / w.y, 0, 0,
          0, 0, 2 / w.z, 0,   
        -1, 1, 0, 1,
      ];
      }
      perspective(data){
        let fovInRadians = data.fov * Math.PI/180;
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fovInRadians);
        let rangeInv = 1.0 / (data.zNear - data.zFar);
        let a = f / data.aspect;
        let b = (data.zNear + data.zFar) * rangeInv;
        let c = data.zNear * data.zFar * rangeInv * 2.0;

        return [
          a, 0,  0, 0,
          0, f, 0, 0,
          0, 0,  b, -1,
          0, 0,  c, 0,
        ];
      }
      ortographic(data){
        let w = data.right - data.left;
        let h = data.top - data.bottom;
        let d = data.far - data.near;

        let tx = -((data.right + data.left)/w);
        let ty = -((data.top + data.bottom)/h);
        let tz = -((data.far + data.near)/d);
        return [
          2 / w, 0,     0,      0,
          0,     2 / h, 0,      0,
          0,     0,     -2 / d, 0,   
          tx,    ty,    tz,     1,
      ];
      }
      scale(data){
        let s = new Coordinates3D(data.x,data.y,data.z)
        return [
          s.x,0,0,0,
          0,s.y,0,0,
          0,0,s.z,0,
          0,0,0,1
        ];
      }
      translate(data=0){
        let t = new Coordinates3D(data.x,data.y,data.z);
        return[
          1,0,0,0,
          0,1,0,0,
          0,0,1,0,
          t.x,t.y,t.z,1
        ];
      }
      xRotation(a=0) {
        let c = Math.cos(a);
        let s = Math.sin(a);
        return [
          1, 0, 0, 0,
          0, c, -s, 0,
          0, s, c, 0,
          0, 0, 0, 1,
        ];
      }
      yRotation (a=0) {
        let c = Math.cos(a);
        let s = Math.sin(a);
        return [
          c, 0, s, 0,
          0, 1, 0, 0,
          -s, 0, c, 0,
          0, 0, 0, 1,
        ];
      }
      zRotation(a=0){
        return [
          Math.cos(a), -Math.sin(a),    0,    0,
          Math.sin(a),  Math.cos(a),    0,    0,
               0,       0,    1,    0,
               0,       0,    0,    1
        ];
      }
      multiplyMatrixAndPoint(matrix, point) {
        // Give a simple variable name to each part of the matrix, a column and row number
        let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
        let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
        let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
        let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
      
        // Now set some simple names for the point
        let x = point[0];
        let y = point[1];
        let z = point[2];
        let w = point[3];
      
        // Multiply the point against each part of the 1st column, then add together
        let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
      
        // Multiply the point against each part of the 2nd column, then add together
        let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
      
        // Multiply the point against each part of the 3rd column, then add together
        let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
      
        // Multiply the point against each part of the 4th column, then add together
        let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
      
        return [resultX, resultY, resultZ, resultW];
      }
      multiply(a,b){
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        return [
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];   
      }
      invert(a) {
      let out = [];
      let a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
      let a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
      let a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
      let a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    
      let b00 = a00 * a11 - a01 * a10;
      let b01 = a00 * a12 - a02 * a10;
      let b02 = a00 * a13 - a03 * a10;
      let b03 = a01 * a12 - a02 * a11;
      let b04 = a01 * a13 - a03 * a11;
      let b05 = a02 * a13 - a03 * a12;
      let b06 = a20 * a31 - a21 * a30;
      let b07 = a20 * a32 - a22 * a30;
      let b08 = a20 * a33 - a23 * a30;
      let b09 = a21 * a32 - a22 * a31;
      let b10 = a21 * a33 - a23 * a31;
      let b11 = a22 * a33 - a23 * a32;
    
      // Calculate the determinant
      let det =
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    
      if (!det) {
        return null;
      }
      det = 1.0 / det;
    
      out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
      out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
      out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
      out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
      out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
      out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
      out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
      out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
      out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
      out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
      out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
      out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
      out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
      out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
      out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
      out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    
      return out;
      }
      transpose(a) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        let out = [];

          out[0] = a[0];
          out[1] = a[4];
          out[2] = a[8];
          out[3] = a[12];
          out[4] = a[1];
          out[5] = a[5];
          out[6] = a[9];
          out[7] = a[13];
          out[8] = a[2];
          out[9] = a[6];
          out[10] = a[10];
          out[11] = a[14];
          out[12] = a[3];
          out[13] = a[7];
          out[14] = a[11];
          out[15] = a[15];
        
      
        return out;
      }
      multiplyToModel(dataPosition,dataScale,dataRotation){
        let modelMatrix = this.multiply(this.translate(dataPosition),this.xRotation(dataRotation.x));
            modelMatrix = this.multiply(modelMatrix,this.yRotation(dataRotation.y));
            modelMatrix = this.multiply(modelMatrix,this.zRotation(dataRotation.z));
            modelMatrix = this.multiply(modelMatrix,this.scale(dataScale));
        return modelMatrix;
      }
      invertModelMatrix(dataPosition,dataScale,dataRotation){
        return this.invert(this.multiplyToModel(dataPosition,dataScale,dataRotation));
      }
      normalize(v) {
        let dst = [];
        let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
          dst[0] = v[0] / length;
          dst[1] = v[1] / length;
          dst[2] = v[2] / length;
        }
        return dst;
      }
      subtractVectors(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
      }
      cross(a, b) {
        return [a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]];
      }
      lookAt(cameraPosition, target, up){
          var zAxis = this.normalize(
              this.subtractVectors(cameraPosition, target));
          var xAxis = this.normalize(this.cross(up, zAxis));
          var yAxis = this.normalize(this.cross(zAxis, xAxis));
      
          return [
             xAxis[0], xAxis[1], xAxis[2], 0,
             yAxis[0], yAxis[1], yAxis[2], 0,
             zAxis[0], zAxis[1], zAxis[2], 0,
             cameraPosition[0],
             cameraPosition[1],
             cameraPosition[2],
             1,
          ];
        }
      
}

export { Matrix };

/*   // another variant create matrix 
      createOrtographic(data){
        let left = data.left;
        let right = data.right;
        let top = data.top;
        let bottom = data.bottom;
        let near = data.near;
        let far = data.far;

        let M = [];

        let widthRatio  = 1.0 / (right - left);
        let heightRatio = 1.0 / (top - bottom);
        let depthRatio  = 1.0 / (far - near);
    
        let sx = 2 * widthRatio;
        let sy = 2 * heightRatio;
        let sz = -2 * depthRatio;
    
        let tx = -(right + left) * widthRatio;
        let ty = -(top + bottom) * heightRatio;
        let tz = -(far + near) * depthRatio;
    
        M[0] = sx;  M[4] = 0;   M[8] = 0;   M[12] = tx;
        M[1] = 0;   M[5] = sy;  M[9] = 0;   M[13] = ty;
        M[2] = 0;   M[6] = 0;   M[10] = sz; M[14] = tz;
        M[3] = 0;   M[7] = 0;   M[11] = 0;  M[15] = 1;
    
        return M;
      }
      createFrustum(left, right, bottom, top, near, far){
        let M = [];
        let sx = 2 * near / (right - left);
        var sy = 2 * near / (top - bottom);
  
        let c2 = - (far + near) / (far - near);
        let c1 = 2 * near * far / (near - far);

        let A = (right + left) / (right - left);
        let B = (top + bottom) / (top - bottom);
  
        let tx = -near * (left + right) / (right - left);
        let ty = -near * (bottom + top) / (top - bottom);
  
        M[0] = sx; M[4] = 0;  M[8] = 0;    M[12] = tx;
        M[1] = 0;  M[5] = -sy; M[9] = 0;    M[13] = ty;
        M[2] = 0;  M[6] = 0;  M[10] = c2;  M[14] = c1;
        M[3] = 0;  M[7] = 0;  M[11] = -1;  M[15] = 0;

        return M;
      }
      createPerspective(data){
       let fovy = data.fov;
       let aspect = data.aspect;
       let near = data.zNear;
       let far = data.zFar;
       
       let half_fovy = (fovy * Math.PI/180) / 2;

       let top = near * Math.tan(half_fovy);
       let bottom = -top;
       let right = top * aspect;
       let left = -right;
 
       return this.createFrustum(left, right, bottom, top, near, far);
      }

*/