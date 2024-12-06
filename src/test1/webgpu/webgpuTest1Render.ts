import shader from "../shaders/shader.wgsl";
import {Test1Render} from "../test1Render";


export class WebGPUTest1Render extends Test1Render {

    // Device/Context objects
    adapter: GPUAdapter;
    device: GPUDevice;
    context: GPUCanvasContext;
    format: GPUTextureFormat;

    // Pipeline objects
    objectPositionBuffer: GPUBuffer;
    objectColorBuffer: GPUBuffer;
    bindGroup: GPUBindGroup;
    pipeline: GPURenderPipeline;

    vbo: GPUBuffer;

    async Initialize() {

        await this.setupDevice();

        await this.makePipeline();

        requestAnimationFrame(this.animate);
    }

    async setupDevice() {
        this.adapter = <GPUAdapter>await navigator.gpu?.requestAdapter();
        this.device = <GPUDevice>await this.adapter?.requestDevice();
        this.context = <GPUCanvasContext>(this._context ? this._context : this.canvas.getContext("webgpu"));
        this.format = "bgra8unorm";
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: "opaque"
        });

    }

    async makePipeline() {

        this.objectPositionBuffer = this.device.createBuffer({
            size: this.balls.length * 4 * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.objectColorBuffer = this.device.createBuffer({
            size: this.balls.length * 4 * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: "read-only-storage",
                        hasDynamicOffset: false,
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: "read-only-storage",
                        hasDynamicOffset: false,
                    }
                }
            ]

        });

        this.bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.objectPositionBuffer
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: this.objectColorBuffer
                    }
                }
            ]
        });

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });


        const descriptor: GPUBufferDescriptor = {
            size: this.ballMesh.verticesData.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true // similar to HOST_VISIBLE, allows buffer to be written by the CPU
        };

        this.vbo = this.device.createBuffer(descriptor);

        //Buffer has been created, now load in the vertices
        new Float32Array(this.vbo.getMappedRange()).set(this.ballMesh.verticesData);
        this.vbo.unmap();

        //now define the buffer layout
        const bufferLayout: GPUVertexBufferLayout = {
            // arrayStride: 20,
            arrayStride: 16,
            attributes: [
                {
                    shaderLocation: 0,
                    format: "float32x4",
                    offset: 0
                },
                // {
                //     shaderLocation: 1,
                //     format: "float32x3",
                //     offset: 8
                // }
            ]
        }

        this.pipeline = this.device.createRenderPipeline({
            vertex: {
                module: this.device.createShaderModule({
                    code: shader
                }),
                entryPoint: "vs_main",
                buffers: [bufferLayout,]
            },

            fragment: {
                module: this.device.createShaderModule({
                    code: shader
                }),
                entryPoint: "fs_main",
                targets: [{
                    format: this.format
                }]
            },

            primitive: {
                topology: "triangle-list"
            },

            layout: pipelineLayout
        });

    }

    animate = () => {
        this.updateTestState(0.01);

        // let flatten_pos: number[] = [];
        // let flatten_color: number[] = [];
        // this.balls.forEach(ball => {
        //     ball.position.forEach( value => {
        //         flatten_pos.push(value);
        //     });
        //     ball.color.forEach( value => {
        //         flatten_color.push(value);
        //     });
        // });
        // let pos_data = new Float32Array(flatten_pos);
        // let color_data = new Float32Array(flatten_color);
        let pos_data = new Float32Array(this.balls.length * 4);
        let color_data = new Float32Array(this.balls.length * 4);
        this.balls.forEach((ball, index) => {
            pos_data.set(ball.position, index * 4);
            color_data.set(ball.color, index * 4);
        });

        this.device.queue.writeBuffer(this.objectPositionBuffer, 0, pos_data, 0, pos_data.length);
        this.device.queue.writeBuffer(this.objectColorBuffer, 0, color_data, 0, color_data.length);

        //command encoder: records draw commands for submission
        const commandEncoder: GPUCommandEncoder = this.device.createCommandEncoder();
        //texture view: image view to the color buffer in this case
        const textureView: GPUTextureView = this.context.getCurrentTexture().createView();
        //renderPass: holds draw commands, allocated from command encoder
        const renderPass: GPURenderPassEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                // clearValue: {r: 0.5, g: 0.0, b: 0.25, a: 1.0},
                clearValue: {r: 0.1, g: 0.1, b: 0.1, a: 1.0},
                loadOp: "clear",
                storeOp: "store"
            }]
        });

        renderPass.setPipeline(this.pipeline);
        renderPass.setVertexBuffer(0, this.vbo);
        renderPass.setBindGroup(0, this.bindGroup);
        // renderPass.draw(this.triangleMesh.vertex_count , this.balls.length, 0, 0);
        for (let i = 0; i < this.balls.length; i++) {
            renderPass.draw(this.ballMesh.vertices.length, 1, 0, i);
        }
        renderPass.end();

        this.device.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(this.animate);
    }

}
