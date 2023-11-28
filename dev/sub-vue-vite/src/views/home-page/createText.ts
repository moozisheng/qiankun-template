import {
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Vector2,
  ShaderMaterial,
} from "three";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import {} from "three";

// 创建 EffectComposer 对象，用于处理后期效果
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// RenderPass 通道会在当前场景和摄像机的基础上渲染出一个新场景
// OutlinePass 通道可以勾勒场景中物体的轮廓
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

// BloomPass 通道通过增强场景中明亮的区域来模拟真实世界中的摄像机
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";

// UnrealBloomPass 通道与 THREE.Bloom 类似，但它实现的效果更接近 Unreal 3D 引擎的 Bloom 效果
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

export const create3DText = async (
  scene: Scene,
  text: string,
  fontUrl?: string
) => {
  const font = await loadFont(defaultFontUrl);
  const textMesh = createText(font, text);
  scene.add(textMesh);
  return textMesh;
};

const defaultFontUrl =
  //   "https://unpkg.com/three@0.150.1/examples/fonts/droid/droid_sans_regular.typeface.json";
  "https://unpkg.com/three@0.150.1/examples/fonts/helvetiker_regular.typeface.json";

const loadFont = (url = defaultFontUrl): Promise<Font> => {
  return new Promise((resolve) => {
    new FontLoader().load(url, (font) => {
      resolve(font);
    });
  });
};

function createText(font: Font, text: string) {
  const textGeo: any = new TextGeometry(text, {
    font: font,
    size: 3,
    height: 0.2,
    curveSegments: 120,
    bevelEnabled: false,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  textGeo.computeBoundingBox();

  const centerOffset =
    -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

  const textMesh = new Mesh(
    textGeo,
    new MeshBasicMaterial({
      color: "#ef77eb",
    })
  );
  textMesh.position.y = 0.1;
  textMesh.position.x = centerOffset;
  return textMesh;
}

export const addComposer = (params: {
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  composer: EffectComposer;
  passConfig: {
    outlinePass?: {
      selectedObjects: any[];
    };
  };
}) => {
  const { scene, renderer, camera, passConfig, composer } = params;
  // 创建渲染轮廓的通道
  const outlinePass = new OutlinePass(
    new Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera,
    passConfig?.outlinePass?.selectedObjects
  );
  outlinePass.edgeStrength = 6.0; // 高光边缘强度
  outlinePass.pulsePeriod = 0; // 数值越大，律动感越慢
  outlinePass.edgeGlow = 2; // 边缘微光强度
  outlinePass.edgeThickness = 4.0; // 高光厚度
  outlinePass.visibleEdgeColor.set("#ff6bf3"); // 高光颜色
  composer.addPass(outlinePass);

  //   添加拒抗齿效果
  const effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );
  composer.addPass(effectFXAA);

  const unrealBloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    0.15,
    0,
    0
  );
  composer.addPass(unrealBloomPass);

  const vertexShader = `varying vec2 vUv;

    void main() {

        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }`;

  const fragmentShader = `
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;

    varying vec2 vUv;

    void main() {

        gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

    }`;

  const mixPass = new ShaderPass(
    new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: composer.renderTarget2.texture },
      },
      vertexShader,
      fragmentShader,
      defines: {},
    }),
    "baseTexture"
  );
  mixPass.needsSwap = true;

  //   composer.addPass(mixPass);
};
