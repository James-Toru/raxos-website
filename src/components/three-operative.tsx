"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Box3,
  DirectionalLight,
  Euler,
  Group,
  LoopOnce,
  LoopRepeat,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  SRGBColorSpace,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { clone } from "three/addons/utils/SkeletonUtils.js";

type OperativePhase = "idle" | "entering" | "aiming" | "firing" | "cracked" | "modal";

type OperativeAssets = {
  character: Group;
  rifle: Group;
  run: AnimationClip;
  shoot: AnimationClip;
};

type OperativeRuntime = {
  actions: Record<"run" | "shoot", AnimationAction>;
  mixer: AnimationMixer;
};

let operativeAssetsPromise: Promise<OperativeAssets> | null = null;

function removeHorizontalRootMotion(clip: AnimationClip) {
  const copy = clip.clone();
  const hipsTrack = copy.tracks.find((track) => track.name.endsWith("Hips.position"));
  if (!hipsTrack) return copy;

  const values = hipsTrack.values;
  const originX = values[0];
  const originZ = values[2];
  for (let index = 0; index < values.length; index += 3) {
    values[index] = originX;
    values[index + 2] = originZ;
  }
  return copy;
}

export function preloadOperativeAssets() {
  if (operativeAssetsPromise) return operativeAssetsPromise;

  operativeAssetsPromise = Promise.all([
    new FBXLoader().loadAsync("/models/operative/firing-rifle.fbx"),
    fetch("/models/operative/run.json").then((response) => response.json()),
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync("/models/operative/laser-rifle-optimized.glb"),
  ]).then(([character, runJson, rifle]) => {
    const shoot = removeHorizontalRootMotion(character.animations[0]);
    shoot.name = "shoot";
    return {
      character,
      rifle: rifle.scene,
      run: AnimationClip.parse(runJson),
      shoot,
    };
  });

  return operativeAssetsPromise;
}

function playPhase(runtime: OperativeRuntime, phase: OperativePhase) {
  if (phase === "cracked" || phase === "modal" || phase === "idle" || phase === "firing") return;

  const action = phase === "entering" ? runtime.actions.run : runtime.actions.shoot;

  for (const candidate of Object.values(runtime.actions)) {
    if (candidate !== action) candidate.fadeOut(.14);
  }

  action.reset();
  action.enabled = true;
  action.clampWhenFinished = phase === "aiming";
  action.setLoop(phase === "entering" ? LoopRepeat : LoopOnce, phase === "entering" ? Infinity : 1);
  action.setEffectiveTimeScale(1);
  action.fadeIn(.16).play();
}

export function ThreeOperative({
  phase,
  onReady,
}: {
  phase: OperativePhase;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<OperativeRuntime | null>(null);
  const phaseRef = useRef(phase);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    phaseRef.current = phase;
    if (runtimeRef.current) playPhase(runtimeRef.current, phase);
  }, [phase]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const activeCanvas = canvas;

    let disposed = false;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    const renderer = new WebGLRenderer({ canvas: activeCanvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;

    const scene = new Scene();
    const camera = new PerspectiveCamera(27, 1, .1, 30);
    camera.position.set(0, 1.08, 5.25);
    camera.lookAt(0, 1.05, 0);

    const ambient = new AmbientLight(0x75808a, 1.35);
    const key = new DirectionalLight(0xf3f6ff, 2.8);
    key.position.set(-2.5, 4, 4);
    const rim = new DirectionalLight(0xff1825, 5.6);
    rim.position.set(3.5, 2.2, -2.5);
    scene.add(ambient, key, rim);

    const timer = new Timer();
    timer.connect(document);
    const handPosition = new Vector3();
    const handQuaternion = new Quaternion();
    const gripWorldOffset = new Vector3();
    const carriedRifleRotation = new Quaternion().setFromEuler(new Euler(0, 0, 0));
    const targetingRifleRotation = new Quaternion().setFromEuler(new Euler(-.06, -Math.PI / 2 + .34, -.08));
    const gripOffset = new Vector3(-.08, -.02, .035);

    function resize() {
      const width = Math.max(1, activeCanvas.clientWidth);
      const height = Math.max(1, activeCanvas.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(activeCanvas);
    resize();

    preloadOperativeAssets().then((assets) => {
      if (disposed) return;

      const character = clone(assets.character) as Group;
      character.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        child.frustumCulled = false;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        for (const material of materials) {
          if (!(material instanceof MeshStandardMaterial)) continue;
          material.roughness = Math.max(material.roughness, .58);
          material.metalness = Math.min(material.metalness, .18);
          if (material.map) material.map.colorSpace = SRGBColorSpace;
          material.needsUpdate = true;
        }
      });

      character.updateMatrixWorld(true);
      const initialBounds = new Box3().setFromObject(character);
      const initialSize = initialBounds.getSize(new Vector3());
      character.scale.setScalar(2.12 / initialSize.y);
      character.updateMatrixWorld(true);
      const bounds = new Box3().setFromObject(character);
      const center = bounds.getCenter(new Vector3());
      character.position.set(-center.x, -bounds.min.y, -center.z);
      scene.add(character);

      const rifleModel = assets.rifle.clone(true);
      rifleModel.updateMatrixWorld(true);
      const rifleSize = new Box3().setFromObject(rifleModel).getSize(new Vector3());
      rifleModel.scale.setScalar(.96 / Math.max(rifleSize.x, rifleSize.y, rifleSize.z));
      rifleModel.updateMatrixWorld(true);
      const rifleCenter = new Box3().setFromObject(rifleModel).getCenter(new Vector3());
      rifleModel.position.sub(rifleCenter);
      rifleModel.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        child.frustumCulled = false;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        for (const material of materials) {
          if (!(material instanceof MeshStandardMaterial)) continue;
          material.emissive.set(0x280006);
          material.emissiveIntensity = .72;
          material.roughness = Math.max(material.roughness, .46);
          material.needsUpdate = true;
        }
      });
      const rifle = new Group();
      rifle.add(rifleModel);
      scene.add(rifle);

      const rightHand = character.getObjectByName("mixamorigRightHand");
      const mixer = new AnimationMixer(character);
      const runtime: OperativeRuntime = {
        mixer,
        actions: {
          run: mixer.clipAction(assets.run.clone()),
          shoot: mixer.clipAction(assets.shoot.clone()),
        },
      };
      runtimeRef.current = runtime;
      playPhase(runtime, phaseRef.current);

      function render(timestamp?: number) {
        if (disposed) return;
        timer.update(timestamp);
        const delta = Math.min(timer.getDelta(), .05);
        mixer.update(delta);

        if (rightHand) {
          rightHand.getWorldPosition(handPosition);
          rightHand.getWorldQuaternion(handQuaternion);
          const targeting = phaseRef.current !== "entering";
          rifle.quaternion.copy(targeting ? targetingRifleRotation : handQuaternion.multiply(carriedRifleRotation));
          gripWorldOffset.copy(gripOffset).applyQuaternion(rifle.quaternion);
          rifle.position.copy(handPosition).add(gripWorldOffset);
          if (targeting) rifle.position.z += .16;
        }

        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(render);
      }

      onReadyRef.current?.();
      render();
    }).catch((error) => {
      console.error("Unable to load operative assets", error);
    });

    return () => {
      disposed = true;
      runtimeRef.current?.mixer.stopAllAction();
      runtimeRef.current = null;
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(animationFrame);
      timer.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="three-operative-canvas" aria-hidden="true" />;
}
