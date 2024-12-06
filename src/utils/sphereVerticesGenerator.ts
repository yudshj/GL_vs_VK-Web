import {vec4} from "gl-matrix";
import {VerticesGenerator} from "./verticesGenerator";


export class SphereVerticesGenerator extends VerticesGenerator {
    constructor(slices: number, stacks: number, radius: number, useSphere: boolean = true) {
        super();
        if (useSphere) {
            this.generateVerticesAndNormals(slices, stacks, radius);
        } else {
            const point1: vec4 = [0.0, 0.5, 0.0, 1.0];
            const point2: vec4 = [-0.5, -0.5, 0.0, 1.0];
            const point3: vec4 = [0.5, -0.5, 0.0, 1.0];
            const point4: vec4 = [1.0, 0.5, 0.0, 1.0];
            this.vertices = [point1, point2, point3, point1, point3, point4];
        }
        this.generateVertexData();
    }

    // 3D spherical coordinates to 3D cartesian coordinates
    static pointOf(theta: number, phi: number, radius: number, normalize: boolean): vec4 {
        let ret: vec4 = [radius * Math.cos(theta) * Math.cos(phi),
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta),
            1.0];

        if (normalize) {
            vec4.normalize(ret, ret);
        }
        return ret;
    }

    generateVerticesAndNormals(slices: number, stacks: number, radius: number) {
        this.vertices = [];
        this.normals = [];
        const sliceStep = Math.PI * 2.0 / slices;
        const stackStep = Math.PI / stacks;

        for (let stack = 0; stack < stacks; ++stack) {
            let theta = stack * stackStep - Math.PI / 2.0;
            let thetaNext = (stack + 1) * stackStep - Math.PI / 2.0;

            for (let slice = 0; slice < slices; ++slice) {
                let phi = slice * sliceStep;
                let phiNext = (slice + 1) * sliceStep;

                this.vertices.push(SphereVerticesGenerator.pointOf(theta, phi, radius, false));
                this.vertices.push(SphereVerticesGenerator.pointOf(theta, phiNext, radius, false));
                this.vertices.push(SphereVerticesGenerator.pointOf(thetaNext, phi, radius, false));

                this.vertices.push(SphereVerticesGenerator.pointOf(thetaNext, phi, radius, false));
                this.vertices.push(SphereVerticesGenerator.pointOf(theta, phiNext, radius, false));
                this.vertices.push(SphereVerticesGenerator.pointOf(thetaNext, phiNext, radius, false));


                this.normals.push(SphereVerticesGenerator.pointOf(theta, phi, 1.0, true));
                this.normals.push(SphereVerticesGenerator.pointOf(theta, phiNext, 1.0, true));
                this.normals.push(SphereVerticesGenerator.pointOf(thetaNext, phi, 1.0, true));

                this.normals.push(SphereVerticesGenerator.pointOf(thetaNext, phi, 1.0, true));
                this.normals.push(SphereVerticesGenerator.pointOf(theta, phiNext, 1.0, true));
                this.normals.push(SphereVerticesGenerator.pointOf(thetaNext, phiNext, 1.0, true));
            }
        }

    }
}
