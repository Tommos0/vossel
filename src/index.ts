import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

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

const nTriangles = 12;

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
    const program = gl.createProgram()!;
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
    // prettier-ignore

    const positions = new Float32Array(repeat(3 * nTriangles)([0, 0, -20]));
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // 3. indices
    // prettier-ignore
    const indices = new Float32Array(range(3 * nTriangles));
    const indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    // 2. colours
    // prettier-ignore
    const colorData = [
        ...repeat(36)(
            repeat(3)([
                1.0, 0.0, 0.0,
            ])
        ),
        // ...repeat(2)(
        //     repeat(3)([
        //         0.0, 1.0, 0.0,
        //     ])
        // ),
        // ...repeat(2)(
        //     repeat(3)([
        //         0.0, 0.0, 1.0,
        //     ])
        // ),
        // ...repeat(2)(
        //     repeat(3)([
        //         1.0, 1.0, 0.0,
        //     ])
        // ),
        // ...repeat(2)(
        //     repeat(3)([
        //         0.0, 1.0, 1.0,
        //     ])
        // ),
        // ...repeat(2)(
        //     repeat(3)([
        //         1.0, 0.0, 1.0,
        //     ])
        // )
    ];
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
    // Fill background with one colour
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Instruct WebGL to draw triangles with a set of 3 vertices
    gl.drawArrays(gl.TRIANGLES, 0, nTriangles * 3);
};

const init = () => {
    const gl = createGLContext();
    setup(gl);
    draw(gl);
};

window.addEventListener("DOMContentLoaded", init);
