import {vec4} from "gl-matrix";

export function getRandomVec4(min: vec4, max: vec4): vec4 {
    return [Math.random() * (max[0] - min[0]) + min[0],
        Math.random() * (max[1] - min[1]) + min[1],
        Math.random() * (max[2] - min[2]) + min[2],
        Math.random() * (max[3] - min[3]) + min[3]];
}

export function clampFloat(value: number, min: number, max: number): [number, boolean] {
    if (value < min) {
        return [min, true];
    }
    if (value > max) {
        return [max, true];
    }
    return [value, false];
}