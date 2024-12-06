import {BaseRender} from "../utils/baseRender";
import {kBallCountDict, kSphereRadius, kSphereSlices, kSphereStacks, kUpdateRuns} from "./utils/constants";
import {SphereVerticesGenerator} from "../utils/sphereVerticesGenerator";
import {clampFloat} from "./utils/math";
import {initBalls} from "./utils/balls";

export abstract class Test1Render extends BaseRender {

    balls = initBalls(kBallCountDict[this.difficulty]);
    ballCounts: number = kBallCountDict[this.difficulty];

    // Assets
    ballMesh: SphereVerticesGenerator = new SphereVerticesGenerator(kSphereSlices, kSphereStacks, kSphereRadius);

    updateTestState(frameTime: number) {
        this.updateFPS();

        for (let i = 0; i < kUpdateRuns; i++) {
            this.balls.forEach(ball => {
                for (let k = 0; k < ball.position.length; k++) {
                    let [value, clamped] = clampFloat(ball.position[k] + ball.speed[k] * frameTime, -1, 1);
                    ball.position[k] = value;
                    if (clamped) {
                        ball.speed[k] = -ball.speed[k];
                    }
                }
            });
        }
    }
}

