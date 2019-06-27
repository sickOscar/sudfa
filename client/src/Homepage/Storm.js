import React from 'react';
// import threeEntryPoint from './threejs/threeEntryPoint';
import * as THREE from 'three';

import noise from '../images/storm/noise.png';
import clouds from '../images/storm/clouds-1-tile.jpg';

export default class Storm extends React.Component {


  componentDidMount() {

    let loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      noise,
      (tex) => {
        const texture = tex;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
        loader.load(
          clouds,
          (tex) => {
            const bg = tex;
            bg.wrapS = THREE.RepeatWrapping;
            bg.wrapT = THREE.RepeatWrapping;
            bg.minFilter = THREE.LinearFilter;

            setTimeout(() => {

              threeEntryPoint(this.threeRootElement, texture, bg);

              // animate();
            })
          }
        );
      }
    );



  }

  render() {
    return (
      <div id="storm" ref={element => this.threeRootElement = element} />
    )
  }


}


const sourceVs = `
void main() {
    gl_Position = vec4( position, 1.0 );
}
`;

const sourceFs = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_noise;
uniform sampler2D u_bg;
uniform float u_scroll;

const vec3 cloudcolour = vec3(.07,0.0,.24);
const vec3 lightcolour = vec3(.25,0.6,1.);

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
  
  float noise1 = noise(vec3(uv * 3. * noise(vec3(uv * 3. + 100., u_time * 3. + 10.)), u_time * 2.))  * 2.;
  
  float noise2 = noise(vec3(uv + 2.35, u_time * 1.357 - 10.));
  
  uv.y -= u_scroll * .0001;
  
  uv += texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * .05, 1.) - .5 * .05).rg * 0.08 + noise1 * .008 * (1. - clamp(noise1 * noise1 * 2. + .2, 0., 1.));
  
  vec3 tex = texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * .02, 1.) - .5).rgb;
  
  uv.y -= u_scroll * .0001;
  vec3 tex1 = texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * .08, 1.)).rgb;
  
  uv.y -= u_scroll * .0001;
  vec3 tex2 = texture2D(u_bg, (uv * .8 + .5) * vec2(.5, 1.) - vec2(u_time * .1, 1.)).rgb;
  
  vec3 fragcolour = tex;
  
  float shade = tex.r;
  shade *= clamp(noise1 * noise2 * sin(u_time * 3.), .2, 10.);
  shade += shade * shade * 3.;
  shade -= (1. - clamp(tex1 * 4., 0., 1.).r) * .2;
  shade -= (1. - clamp(tex2 * 4., 0., 1.).r) * .1;
  
  fragcolour = mix(cloudcolour, lightcolour, shade);

  gl_FragColor = vec4(fragcolour, 1.);
}
`

let uniforms = {}

const threeEntryPoint = (containerElement, texture, bg) => {
  console.log(containerElement)

  const camera = new THREE.Camera();
  camera.position.z = 1;

  const scene =  new THREE.Scene();

  const geometry = new THREE.PlaneBufferGeometry( 2, 2 );

  uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_noise: { type: "t", value: texture },
    u_bg: { type: "t", value: bg },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    u_scroll: { type: 'f', value : 0 }
  };

  const material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: sourceVs,
    fragmentShader: sourceFs
  } );
  material.extensions.derivatives = true;

  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );

  containerElement.appendChild( renderer.domElement );

  bindEventListeners();
  render();

  function bindEventListeners() {
    window.onresize = resizeCanvas;
    resizeCanvas();
  }

  function resizeCanvas() {
    renderer.setSize( window.innerWidth, containerElement.offsetHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;

  }

  function render(delta) {
    // console.log('render', scene)
    requestAnimationFrame(render);
    uniforms.u_scroll.value = window.scrollY;
    uniforms.u_time.value = -1000 + delta * 0.0005;

    renderer.render( scene, camera );
  }
}
