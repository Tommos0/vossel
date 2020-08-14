import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import { initControls } from "./controls";

const state = {
    cameraX: 0,
    cameraY: 0,
    cameraZ: 5,
    cameraPhi: 0, // angle with z axis around y axis (0: in z-direction, pi: -z direction)
    cameraTheta: 0, // angle with x,y plane
    movementSpeed: 0.04,

    someAngle: 0,
};
export type State = typeof state;
//
// setInterval(() => {
//     console.log(state);
// }, 1000);

const repeat = (n: number) => (x: any[]) => {
    let result: any[] = [];
    for (let i = 0; i < n; i++) {
        result = result.concat(x);
    }
    return result;
};

const range = (n: number) =>
    Array(n)
        .fill(null)
        .map((_, i) => i);

const createGLContext = () => {
    const canvas = document.createElement("canvas");
    canvas.height = window.innerHeight;
    // canvas.width = window.innerWidth;
    canvas.width = canvas.height;
    document.body.appendChild(canvas);

    const gl = canvas.getContext("webgl2");
    if (!gl) {
        throw new Error("WebGL 2.0 is not available in your browser :(");
    }
    return gl;
};

type Cube = {
    position: [number, number, number];
    color: [number, number, number];
};

const strToCubes = (str: string) => {
    const cubes: Cube[] = [];
    str.split("\n").forEach((line, y) =>
        line.split("").forEach((char, x) => {
            switch (char) {
                case "R":
                    cubes.push({
                        position: [-x * 2, y * 2, 0],
                        color: [1, 0, 0],
                    });
                    break;
                case "G":
                    cubes.push({
                        position: [-x * 2, y * 2, 0],
                        color: [0, 1, 0],
                    });
                    break;
                case "B":
                    cubes.push({
                        position: [-x * 2, y * 2, 0],
                        color: [0, 0, 1],
                    });
                    break;
            }
        })
    );

    return cubes;
};
// const cubes: Array<Cube> = [
//     {
//         position: [0, 0, 0],
//         color: [1, 0, 0],
//     },
//     {
//         position: [2, 0, 0],
//         color: [0, 0, 1],
//     },
//     {
//         position: [4, 0, 0],
//         color: [0, 1, 0],
//     },
// ];

const cubes = strToCubes(`
RRR GGG BBBBB
 R  G G B B B
 R  GGG B B B
`);

console.log(cubes);

let program: WebGLProgram;

const setup = (gl: WebGL2RenderingContext) => {
    // Set background to solid grey
    gl.clearColor(0.25, 0.25, 0.25, 1);

    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader));
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragmentShader));
    }

    // Link shaders to WebGL program
    program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }

    // Finally, activate WebGL program
    gl.useProgram(program);

    // Setup Geometry
    // Create a Vertex Buffer Object (VBO) and bind two buffers to it
    // 1. positions

    const positions = new Float32Array(
        ([] as number[]).concat(
            ...cubes.map((cube) => repeat(36)(cube.position))
        )
    );
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // 3. indices
    // prettier-ignore
    const indices = new Float32Array(repeat(cubes.length)(range(36)));
    const indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    // 2. colours
    // prettier-ignore
    const colorData = ([] as number[]).concat(
        ...cubes.map((cube) => repeat(36)(cube.color))
    )
    console.log(colorData);
    const colors = new Float32Array(colorData);
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(2);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
};

const draw = (gl: WebGL2RenderingContext) => {
    state.someAngle += 0.01;

    const cam_loc = gl.getUniformLocation(program, "camera_position");
    gl.uniform3fv(cam_loc, [state.cameraX, state.cameraY, state.cameraZ]);

    const angle_loc = gl.getUniformLocation(program, "some_angle");
    gl.uniform1f(angle_loc, state.someAngle);

    // Fill background with one colour
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Instruct WebGL to draw triangles with a set of 3 vertices
    gl.drawArrays(gl.TRIANGLES, 0, cubes.length * 36);
};

const init = () => {
    const gl = createGLContext();
    setup(gl);
    setInterval(() => draw(gl), 33);
    initControls(state);
};

window.addEventListener("DOMContentLoaded", init);
