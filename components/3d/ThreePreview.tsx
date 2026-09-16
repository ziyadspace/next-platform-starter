"use client";

import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getBox, getMaterial, getTemplate } from "@/data/catalog";
import { createArtworkTexture, createSurfaceTexture } from "@/components/3d/textureFactory";
import type { DesignDraft } from "@/types";

interface ThreePreviewProps {
  draft: DesignDraft;
  open: boolean;
  autoRotate: boolean;
  resetToken: number;
  previewName?: string;
}

interface ModelProps extends ThreePreviewProps {
  dimensions: [number, number, number];
}

function CameraReset({ resetToken }: { resetToken: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(5.4, 4.3, 6.2);
    camera.lookAt(0, 0.3, 0);
  }, [camera, resetToken]);
  return null;
}

function useBoxTextures(draft: DesignDraft) {
  const material = getMaterial(draft.materialId);
  const template = getTemplate(draft.templateId);
  const color = material.colors.find((item) => item.id === draft.materialColorId)?.hex ?? material.colors[0].hex;
  const surface = useMemo(() => createSurfaceTexture(material, color), [material, color]);
  const artworkResult = useMemo(() => createArtworkTexture(draft, material, template, color), [
    draft.name, draft.phrase, draft.year, draft.textColor, draft.fontSize, draft.fontWeight,
    draft.engravingDepth, draft.finish, material, template, color,
  ]);
  useEffect(() => () => surface.dispose(), [surface]);
  useEffect(() => () => artworkResult.texture.dispose(), [artworkResult]);
  return { material, color, surface, artwork: artworkResult.texture, artworkStyle: artworkResult.artwork };
}

type TextureBundle = ReturnType<typeof useBoxTextures>;
const TextureContext = createContext<TextureBundle | null>(null);

function useTextureBundle() {
  const value = useContext(TextureContext);
  if (!value) throw new Error("TextureContext is missing");
  return value;
}

function SurfaceMaterial({ draft }: { draft: DesignDraft }) {
  const { material, color, surface } = useTextureBundle();
  return (
    <meshStandardMaterial
      color={color}
      map={surface}
      bumpMap={surface}
      bumpScale={material.family === "paper" ? 0.008 : material.family === "wood" ? 0.028 : 0.018}
      roughness={material.family === "paper" && draft.finish === "gloss" ? 0.28 : material.family === "wood" ? 0.78 : 0.68}
      metalness={0.015}
    />
  );
}

function ArtworkPlane({ draft, width, depth, position, rotation = [-Math.PI / 2, 0, 0] }: {
  draft: DesignDraft;
  width: number;
  depth: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { material, artwork, artworkStyle } = useTextureBundle();
  return (
    <mesh position={position} rotation={rotation} renderOrder={2}>
      <planeGeometry args={[width * 0.82, depth * 0.82, 48, 48]} />
      <meshStandardMaterial
        map={artwork}
        alphaMap={artwork}
        transparent
        opacity={artworkStyle.opacity}
        roughness={artworkStyle.roughness}
        bumpMap={material.family === "paper" ? undefined : artwork}
        bumpScale={artworkStyle.bumpScale}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  );
}

function Piece({ draft, args, position, radius = 0.05 }: { draft: DesignDraft; args: [number, number, number]; position: [number, number, number]; radius?: number }) {
  return (
    <RoundedBox args={args} position={position} radius={radius} smoothness={3} castShadow receiveShadow>
      <SurfaceMaterial draft={draft} />
    </RoundedBox>
  );
}

function MagneticBox({ draft, open, dimensions }: ModelProps) {
  const lid = useRef<THREE.Group>(null);
  const [w, d, h] = dimensions;
  const t = Math.max(0.08, Math.min(w, d) * 0.045);
  useFrame((_, delta) => {
    if (!lid.current) return;
    lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, open ? -1.72 : 0, 5.5, delta);
  });
  return (
    <group>
      <Piece draft={draft} args={[w, t, d]} position={[0, -h / 2, 0]} />
      <Piece draft={draft} args={[t, h, d]} position={[-w / 2 + t / 2, 0, 0]} />
      <Piece draft={draft} args={[t, h, d]} position={[w / 2 - t / 2, 0, 0]} />
      <Piece draft={draft} args={[w - t * 2, h, t]} position={[0, 0, d / 2 - t / 2]} />
      <Piece draft={draft} args={[w - t * 2, h, t]} position={[0, 0, -d / 2 + t / 2]} />
      <group ref={lid} position={[0, h / 2, -d / 2 + t / 2]}>
        <Piece draft={draft} args={[w + t * 0.8, t * 1.6, d + t * 0.8]} position={[0, t * 0.55, d / 2 - t / 2]} />
        <ArtworkPlane draft={draft} width={w} depth={d} position={[0, t * 1.38, d / 2 - t / 2]} />
      </group>
      {open && <mesh position={[0, -h / 2 + t + 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w - t * 2.3, d - t * 2.3]} /><meshStandardMaterial color="#242826" roughness={0.96} /></mesh>}
    </group>
  );
}

function DrawerBox({ draft, open, dimensions }: ModelProps) {
  const drawer = useRef<THREE.Group>(null);
  const [w, d, h] = dimensions;
  const t = Math.max(0.08, Math.min(w, d) * 0.045);
  useFrame((_, delta) => {
    if (!drawer.current) return;
    drawer.current.position.z = THREE.MathUtils.damp(drawer.current.position.z, open ? d * 0.74 : 0, 5, delta);
  });
  return (
    <group>
      <Piece draft={draft} args={[w, t, d]} position={[0, h / 2 - t / 2, 0]} />
      <Piece draft={draft} args={[w, t, d]} position={[0, -h / 2 + t / 2, 0]} />
      <Piece draft={draft} args={[t, h - t * 2, d]} position={[-w / 2 + t / 2, 0, 0]} />
      <Piece draft={draft} args={[t, h - t * 2, d]} position={[w / 2 - t / 2, 0, 0]} />
      <ArtworkPlane draft={draft} width={w} depth={d} position={[0, h / 2 + 0.008, 0]} />
      <group ref={drawer}>
        <Piece draft={draft} args={[w - t * 2.2, t, d - t * 1.8]} position={[0, -h / 2 + t * 1.4, 0]} />
        <Piece draft={draft} args={[w - t * 2.2, h - t * 2, t * 1.25]} position={[0, 0, d / 2 - t * 1.2]} />
        <Piece draft={draft} args={[w - t * 2.2, h - t * 2, t]} position={[0, 0, -d / 2 + t * 1.25]} />
      </group>
    </group>
  );
}

function LidBaseBox({ draft, open, dimensions }: ModelProps) {
  const lid = useRef<THREE.Group>(null);
  const [w, d, h] = dimensions;
  const t = Math.max(0.08, Math.min(w, d) * 0.045);
  useFrame((_, delta) => {
    if (!lid.current) return;
    lid.current.position.y = THREE.MathUtils.damp(lid.current.position.y, open ? h * 1.15 : h / 2, 5, delta);
    lid.current.position.x = THREE.MathUtils.damp(lid.current.position.x, open ? w * 0.22 : 0, 5, delta);
    lid.current.rotation.z = THREE.MathUtils.damp(lid.current.rotation.z, open ? -0.16 : 0, 5, delta);
  });
  return (
    <group>
      <Piece draft={draft} args={[w, t, d]} position={[0, -h / 2, 0]} />
      <Piece draft={draft} args={[t, h, d]} position={[-w / 2 + t / 2, 0, 0]} />
      <Piece draft={draft} args={[t, h, d]} position={[w / 2 - t / 2, 0, 0]} />
      <Piece draft={draft} args={[w - t * 2, h, t]} position={[0, 0, d / 2 - t / 2]} />
      <Piece draft={draft} args={[w - t * 2, h, t]} position={[0, 0, -d / 2 + t / 2]} />
      <group ref={lid} position={[0, h / 2, 0]}>
        <Piece draft={draft} args={[w + t * 1.25, t * 1.75, d + t * 1.25]} position={[0, t * 0.5, 0]} />
        <ArtworkPlane draft={draft} width={w} depth={d} position={[0, t * 1.39, 0]} />
      </group>
    </group>
  );
}

function ProductModel(props: ThreePreviewProps) {
  const box = getBox(props.draft.boxId);
  const size = box.sizes.find((item) => item.id === props.draft.sizeId) ?? box.sizes[0];
  const [realW, realD, realH] = size.dimensions;
  const scale = 4.6 / Math.max(realW, realD);
  const dimensions: [number, number, number] = [realW * scale, realD * scale, realH * scale];
  const draft = props.previewName ? { ...props.draft, name: props.previewName } : props.draft;
  const modelProps = { ...props, draft, dimensions };
  const textures = useBoxTextures(draft);
  let model = <MagneticBox {...modelProps} />;
  if (draft.boxId === "drawer") model = <DrawerBox {...modelProps} />;
  if (draft.boxId === "lid-base") model = <LidBaseBox {...modelProps} />;
  return <TextureContext.Provider value={textures}>{model}</TextureContext.Provider>;
}

export default function ThreePreview(props: ThreePreviewProps) {
  return (
    <Canvas
      dpr={[1, 1.65]}
      shadows
      camera={{ position: [5.4, 4.3, 6.2], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.02; }}
    >
      <color attach="background" args={["#edf3ef"]} />
      <fog attach="fog" args={["#edf3ef", 10, 18]} />
      <ambientLight intensity={1.35} />
      <hemisphereLight args={["#fff7ec", "#183a34", 1.1]} />
      <directionalLight position={[4, 7, 5]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-5, 6, 2]} angle={0.55} penumbra={0.85} intensity={4.2} color="#f9d9a6" />
      <group position={[0, 0.1, 0]} rotation={[0, -0.2, 0]}>
        <ProductModel {...props} />
      </group>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.28} scale={10} blur={2.8} far={4.5} color="#0e302a" />
      <OrbitControls autoRotate={props.autoRotate} autoRotateSpeed={0.85} enablePan={false} minDistance={5.3} maxDistance={10.5} minPolarAngle={0.38} maxPolarAngle={Math.PI / 2.03} target={[0, 0.15, 0]} />
      <CameraReset resetToken={props.resetToken} />
    </Canvas>
  );
}
