import {vec4} from "gl-matrix";
import {getRandomVec4} from "./math";

export class Ball {
    position: vec4;
    color: vec4;
    speed: vec4;

    constructor(position: vec4, color: vec4, speed: vec4) {
        this.position = position;
        this.color = color;
        this.speed = speed;
    }
}

export function initBalls(count: number): Ball[] {
    let ret: Ball[] = [];
    for (let i = 0; i < count; i++) {
        ret.push(new Ball(
            getRandomVec4([-1, -1, -1, 0], [1, 1, 1, 0]),
            getRandomVec4([0, 0, 0, 1], [1, 1, 1, 1]),
            getRandomVec4([-1, -1, -1, 0], [1, 1, 1, 0])
        ));
    }
    return ret;
}