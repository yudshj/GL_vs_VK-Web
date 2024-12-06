import {vec4} from "gl-matrix";

export abstract class VerticesGenerator {
    vertices: vec4[];
    verticesData: Float32Array;
    normals: vec4[];
    colors: vec4[];

    generateVertexData() {
        this.verticesData = new Float32Array(this.vertices.length * 4);
        this.vertices.forEach((vertex, index) => {
            this.verticesData.set(vertex, index * 4);
        });
    }
}
