const MAX_FRAME_COUNT = 64;
const MAX_FRAME_TIME = 1_000;   // milliseconds
// "easy" | "medium" | "hard"

export enum Difficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}

export abstract class BaseRender {

    difficulty: Difficulty;

    canvas: HTMLCanvasElement;
    kAspectRatio: number;

    lastFrameTime: number = performance.now();
    lastFrameCount: number = 0;
    _context: WebGL2RenderingContext | GPUCanvasContext;

    constructor(canvas: HTMLCanvasElement, context: WebGL2RenderingContext | GPUCanvasContext, difficulty: Difficulty = Difficulty.Easy) {
        this.canvas = canvas;
        this.kAspectRatio = canvas.width / canvas.height;
        this._context = context;

        this.difficulty = difficulty;
    }

    abstract animate(): void;

    abstract Initialize(): void;

    updateFPS() {
        this.lastFrameCount++;
        const now = performance.now();
        if (this.lastFrameCount >= MAX_FRAME_COUNT || now - this.lastFrameTime >= MAX_FRAME_TIME) {
            const fps = 1000.0 * this.lastFrameCount / (now - this.lastFrameTime);
            this.lastFrameTime = now;
            this.lastFrameCount = 0;

            const msg: string = fps.toFixed(3) + " fps";
            console.log(msg);
            document.title = msg;
        }
    }

}
