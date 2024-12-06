import {Test1Render} from "../test1Render";
import vs_glsl from "../shaders/vert.glsl";
import fs_glsl from "../shaders/frag.glsl";

export class WebGLTest1Render extends Test1Render {
    context: WebGL2RenderingContext;
    private program: WebGLProgram;
    private vao: WebGLVertexArrayObject;
    private buffer: WebGLBuffer;

    Initialize() {
        this.context = <WebGL2RenderingContext>(this._context ? this._context : this.canvas.getContext("webgl2"));
        this.program = <WebGLProgram>this.context.createProgram();
        this.vao = <WebGLVertexArrayObject>this.context.createVertexArray();
        this.buffer = <WebGLBuffer>this.context.createBuffer();
        this.context.clearColor(0.1, 0.1, 0.1, 1.0);

        this.initProgram();
        this.initVBO();
        this.initVAO();

        requestAnimationFrame(this.animate);
    }

    animate = () => {
        this.context.clear(this.context.COLOR_BUFFER_BIT);

        this.updateTestState(0.01);

        this.context.useProgram(this.program);
        this.context.bindVertexArray(this.vao);

        for (let i = 0; i < this.ballCounts; i++) {
            this.context.uniform4fv(this.context.getUniformLocation(this.program, "objPosition"), this.balls[i].position);
            this.context.uniform4fv(this.context.getUniformLocation(this.program, "objColor"), this.balls[i].color);
            this.context.drawArrays(this.context.TRIANGLES, 0, Math.floor(this.ballMesh.vertices.length / 3));
        }

        this.context.bindVertexArray(null);
        this.context.useProgram(null);

        requestAnimationFrame(this.animate);
    }

    initProgram() {
        let vs = <WebGLShader>this.context.createShader(this.context.VERTEX_SHADER);
        let fs = <WebGLShader>this.context.createShader(this.context.FRAGMENT_SHADER);
        this.context.shaderSource(vs, vs_glsl);
        this.context.shaderSource(fs, fs_glsl);
        this.context.compileShader(vs);
        this.context.compileShader(fs);
        this.context.attachShader(this.program, vs);
        this.context.attachShader(this.program, fs);
        this.context.linkProgram(this.program);
        this.context.useProgram(this.program);

        if (!this.context.getShaderParameter(vs, this.context.COMPILE_STATUS)) {
            console.log("VS", this.context.getShaderInfoLog(vs));
        }
        if (!this.context.getShaderParameter(fs, this.context.COMPILE_STATUS)) {
            console.log("FS", this.context.getShaderInfoLog(fs));
        }
        if (!this.context.getProgramParameter(this.program, this.context.LINK_STATUS)) {
            console.log(this.context.getProgramInfoLog(this.program));
            alert("Could not initialize shaders.");
        }
    }


    initVBO() {
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, this.ballMesh.verticesData, this.context.STATIC_DRAW);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, null);
    }

    initVAO() {
        this.context.bindVertexArray(this.vao);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
        let vertexPositionAttribute = this.context.getAttribLocation(this.program, "vertexPosition");
        this.context.enableVertexAttribArray(vertexPositionAttribute);
        this.context.vertexAttribPointer(0, 4, this.context.FLOAT, false, 0, 0);
        // this.gl.drawArrays(this.gl.TRIANGLES, 0, vertices.length);
        this.context.bindBuffer(this.context.ARRAY_BUFFER, null);
        this.context.bindVertexArray(null);
    }


}
