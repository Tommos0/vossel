#version 300 es

layout (location=0) in vec2 position;
layout (location=1) in float index;
layout (location=2) in vec3 color;

out vec3 vColor;

vec3 vertex_offsets[36] = vec3[36](
    //front
    vec3(-1.,  1.,  1.),
    vec3(-1., -1.,  1.),
    vec3( 1.,  1.,  1.),

    vec3(-1., -1.,  1.),
    vec3( 1., -1.,  1.),
    vec3( 1.,  1.,  1.),

    //back
    vec3(-1.,  1.,  -1.),
    vec3(-1., -1.,  -1.),
    vec3( 1.,  1.,  -1.),

    vec3(-1., -1.,  -1.),
    vec3( 1., -1.,  -1.),
    vec3( 1.,  1.,  -1.),

    //top
    vec3(-1.,  1.,  1.),
    vec3(-1.,  1., -1.),
    vec3( 1.,  1.,  1.),

    vec3( 1.,  1., -1.),
    vec3(-1.,  1., -1.),
    vec3( 1.,  1.,  1.),

    //bottom
    vec3(-1., -1.,  1.),
    vec3(-1., -1., -1.),
    vec3( 1., -1.,  1.),

    vec3( 1., -1., -1.),
    vec3(-1., -1., -1.),
    vec3( 1., -1.,  1.),

    //left
    vec3(-1., -1.,  1.),
    vec3(-1.,  1.,  1.),
    vec3(-1.,  1., -1.),

    vec3(-1., -1.,  1.),
    vec3(-1., -1., -1.),
    vec3(-1.,  1., -1.),

    //right
    vec3( 1., -1.,  1.),
    vec3( 1.,  1.,  1.),
    vec3( 1.,  1., -1.),

    vec3( 1., -1.,  1.),
    vec3( 1., -1., -1.),
    vec3( 1.,  1., -1.)
);

float[6] colorScale = float[6](
    1.0, //front
    0.3, //back
    0.8, //top
    0.7, //bottom
    0.6, //left
    0.8  //right
);

float[6] depth = float[6](
     1.0, //front
     1.0, //back
     1.0, //top
     1.0, //bottom
     1.0, //left
     1.0  //right
);

void main() {
    vec3 position = vertex_offsets[uint(index)];
    gl_Position = vec4(
        position[0] + .5 * position[2],  // x
        position[1] + .5 * position[2],  // y
        -position[2],                    // z
        2.                               // w
    );
    vColor = colorScale[uint(index/6.)] * vec3(color[0], color[1], color[2]);
}
