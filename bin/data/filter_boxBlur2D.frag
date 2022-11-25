#version 120

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2        u_resolution;
uniform float       u_time;

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

#define BOXBLUR_2D
#include "lygia/sample/clamp2edge.glsl"
#define BOXBLUR_SAMPLER_FNC(TEX, UV) sampleClamp2edge(TEX, UV)
#include "lygia/filter/boxBlur.glsl"

#include "lygia/draw/digits.glsl"

void main (void) {
    vec3 color = vec3(0.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 uv = st;
    st.y = 1.0 - st.y;

    float ix = floor(st.x * 5.0);
    float kernel_size = max(1.0, ix * 4.0);

    color += boxBlur(u_tex0, st, pixel, int(kernel_size)).rgb;

    color += digits(uv - vec2(ix/5.0 + 0.01, 0.01), kernel_size, 0.0);
    color -= step(.99, fract(uv.x * 5.0));

    gl_FragColor = vec4(color,1.0);
}
