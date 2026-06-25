"use client";

import {
  ContactShadows,
  Environment,
  Float,
  MeshReflectorMaterial,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ArrowUpRight,
  BadgeCheck,
  Droplets,
  Leaf,
  PackageCheck,
  Play,
  Recycle,
  ShieldCheck,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

type ProgressRef = MutableRefObject<number>;

type Stage = {
  at: number;
  camera: [number, number, number];
  fov: number;
  lookAt: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

const desktopStages: Stage[] = [
  {
    at: 0,
    camera: [0, 0.05, 8.85],
    fov: 31,
    lookAt: [0.16, -0.05, 0],
    position: [1.44, -0.16, 0],
    rotation: [-0.08, -0.48, 0.02],
    scale: 0.82,
  },
  {
    at: 0.26,
    camera: [-0.3, 0.18, 9.3],
    fov: 29,
    lookAt: [-0.48, -0.04, 0],
    position: [-2.48, -0.14, 0.08],
    rotation: [0.02, 1.35, -0.03],
    scale: 0.48,
  },
  {
    at: 0.52,
    camera: [0.24, 0.0, 7.25],
    fov: 24,
    lookAt: [0.05, -0.02, 0],
    position: [1.62, -0.02, 0.26],
    rotation: [-0.1, 3.18, 0.03],
    scale: 0.92,
  },
  {
    at: 0.76,
    camera: [-0.2, 0.14, 7.45],
    fov: 28,
    lookAt: [0, 0.02, 0],
    position: [-0.28, 0.03, 0.12],
    rotation: [0.08, 4.72, -0.02],
    scale: 0.84,
  },
  {
    at: 1,
    camera: [0, 0.08, 8.1],
    fov: 30,
    lookAt: [0, 0, 0],
    position: [0.2, -0.03, 0],
    rotation: [0, 6.26, 0],
    scale: 0.84,
  },
];

const mobileStages: Stage[] = [
  {
    at: 0,
    camera: [0, 0.1, 10.15],
    fov: 34,
    lookAt: [0, -0.28, 0],
    position: [0, -2.92, 0],
    rotation: [-0.08, -0.32, 0.01],
    scale: 0.34,
  },
  {
    at: 0.28,
    camera: [0, 0.14, 9.75],
    fov: 33,
    lookAt: [0, -0.26, 0],
    position: [0, -2.72, 0.06],
    rotation: [0.02, 1.38, -0.02],
    scale: 0.36,
  },
  {
    at: 0.55,
    camera: [0.05, 0.08, 9.2],
    fov: 29,
    lookAt: [0, -0.24, 0],
    position: [0, -2.48, 0.2],
    rotation: [-0.08, 3.25, 0.01],
    scale: 0.44,
  },
  {
    at: 0.8,
    camera: [0, 0.12, 9.7],
    fov: 33,
    lookAt: [0, -0.26, 0],
    position: [0, -2.72, 0.08],
    rotation: [0.08, 4.8, -0.02],
    scale: 0.38,
  },
  {
    at: 1,
    camera: [0, 0.1, 9.85],
    fov: 34,
    lookAt: [0, -0.28, 0],
    position: [0, -2.78, 0],
    rotation: [0, 6.24, 0],
    scale: 0.36,
  },
];

const sustainabilityItems: Array<{
  Icon: LucideIcon;
  kicker: string;
  title: string;
  body: string;
}> = [
  {
    Icon: Leaf,
    kicker: "Material shift",
    title: "Built around renewable thinking",
    body: "A carton-first format moves daily hydration away from throwaway plastic and toward a lighter, more conscious ritual.",
  },
  {
    Icon: Recycle,
    kicker: "Cleaner cycle",
    title: "Designed for visible responsibility",
    body: "The pack puts the sustainability cue in the user's hand, making the better choice easy to understand and repeat.",
  },
  {
    Icon: Droplets,
    kicker: "Pure intent",
    title: "Water without the plastic aftertaste",
    body: "Premium packaged drinking water, framed as a sharper alternative to the familiar bottle.",
  },
];

const detailItems: Array<{
  Icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    Icon: PackageCheck,
    title: "Carton silhouette",
    body: "A shelf-visible form factor with a clean front face, built for modern retail, hospitality, and events.",
  },
  {
    Icon: Waves,
    title: "Liquid finish",
    body: "Gloss tuned lighting, soft reflection, and scroll movement give the pack a waterline presence.",
  },
  {
    Icon: ShieldCheck,
    title: "Protected pour",
    body: "The experience emphasizes sealed freshness and a minimal premium object you can trust at a glance.",
  },
  {
    Icon: Sparkles,
    title: "Quiet luxury",
    body: "Reduced copy, precise spacing, and tactile hover states keep the product at the center.",
  },
];

const missionStats = [
  { value: 93, suffix: "%", label: "there" },
  { value: 100, suffix: "%", label: "committed" },
  { value: 0, suffix: "x", label: "plastic bottle form" },
  { value: 1, suffix: "", label: "better daily choice" },
];

export default function PlastifreeExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) {
      return;
    }

    const updateNav = () => setNavSolid(window.scrollY > 24);
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: reduceMotion ? false : 0.65,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        const delay = Number(element.dataset.delay ?? 0);

        gsap.fromTo(
          element,
          {
            autoAlpha: reduceMotion ? 1 : 0.72,
            y: reduceMotion ? 0 : 44,
          },
          {
            autoAlpha: 1,
            delay,
            duration: reduceMotion ? 0.1 : 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
            y: 0,
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-splash]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, scaleX: 0.24 },
          {
            opacity: 1,
            scaleX: 1,
            duration: reduceMotion ? 0.1 : 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, root);

    return () => {
      window.removeEventListener("scroll", updateNav);
      ctx.revert();
    };
  }, []);

  return (
    <main ref={rootRef} className="experience-root">
      <CinematicScene progress={scrollProgress} />
      <div className="grain-layer" aria-hidden="true" />
      <div className="ambient-rays" aria-hidden="true" />

      <nav className={`top-nav ${navSolid ? "is-solid" : ""}`}>
        <a className="brand-lockup" href="#hero" aria-label="plastifree H2O">
          <span className="brand-mark">H2O</span>
          <span>plastifree H2O</span>
        </a>
        <div className="nav-links" aria-label="Primary navigation">
          <a href="#sustainability">Sustainability</a>
          <a href="#details">Details</a>
          <a href="#mission">Mission</a>
        </div>
        <a
          className="nav-cta"
          href="https://plastifreeh2o.com/"
          rel="noreferrer"
          target="_blank"
        >
          Order
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
        </a>
      </nav>

      <section id="hero" className="hero-section section-panel">
        <div className="hero-copy">
          <p className="eyebrow" data-reveal>
            Drink Sustainably, Live Responsibly
          </p>
          <h1 data-reveal data-delay="0.08">
            Water Liberated from Plastic
          </h1>
          <p className="hero-subhead" data-reveal data-delay="0.16">
            93% there. 100% committed to change.
          </p>
          <div className="hero-actions" data-reveal data-delay="0.24">
            <a
              className="premium-button"
              href="https://plastifreeh2o.com/"
              rel="noreferrer"
              target="_blank"
            >
              Order carton
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
            <a
              className="quiet-button"
              href="https://www.instagram.com/plastifreeindia/"
              rel="noreferrer"
              target="_blank"
            >
              <Play aria-hidden="true" size={17} fill="currentColor" />
              Brand world
            </a>
          </div>
        </div>
        <div className="hero-proof" data-reveal data-delay="0.32">
          <div>
            <span>Plastic-free packaged drinking water carton</span>
            <strong>Built for the next water habit.</strong>
          </div>
          <BadgeCheck aria-hidden="true" size={22} strokeWidth={1.6} />
        </div>
        <div className="scroll-cue" aria-hidden="true" />
      </section>

      <SplashDivider />

      <section
        id="sustainability"
        className="sustainability-section section-panel"
      >
        <div className="section-copy narrow">
          <p className="eyebrow" data-reveal>
            Sustainability
          </p>
          <h2 data-reveal data-delay="0.08">
            The most premium bottle is no bottle.
          </h2>
          <p className="section-lead" data-reveal data-delay="0.16">
            plastifree H2O turns a familiar product into a visible statement:
            clean hydration, considered packaging, and a public move away from
            plastic dependency.
          </p>
        </div>

        <div className="sustainability-grid">
          {sustainabilityItems.map(({ Icon, kicker, title, body }, index) => (
            <FeaturePanel
              key={title}
              Icon={Icon}
              body={body}
              delay={0.08 * index}
              kicker={kicker}
              title={title}
            />
          ))}
        </div>
      </section>

      <SplashDivider />

      <section id="details" className="details-section section-panel">
        <div className="section-copy">
          <p className="eyebrow" data-reveal>
            Product Details
          </p>
          <h2 data-reveal data-delay="0.08">
            A carton that behaves like a product launch.
          </h2>
          <p className="section-lead" data-reveal data-delay="0.16">
            The scroll brings the pack close enough to inspect, then pulls back
            into a lighter product-film rhythm. Every angle is there to make the
            alternative feel desirable, not dutiful.
          </p>
        </div>

        <div className="detail-grid">
          {detailItems.map(({ Icon, title, body }, index) => (
            <DetailTile
              key={title}
              Icon={Icon}
              body={body}
              delay={0.07 * index}
              title={title}
            />
          ))}
        </div>
      </section>

      <section id="mission" className="mission-section section-panel">
        <div className="mission-copy">
          <p className="eyebrow" data-reveal>
            Brand Mission
          </p>
          <h2 data-reveal data-delay="0.08">
            Make plastic feel outdated.
          </h2>
          <p className="section-lead" data-reveal data-delay="0.16">
            A better water experience should feel effortless: refined enough for
            premium spaces, simple enough for daily life, and clear enough to
            change what people reach for.
          </p>
        </div>

        <div className="mission-stats" data-reveal data-delay="0.22">
          {missionStats.map((stat) => (
            <div className="stat-block" key={stat.label}>
              <strong>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="closing-section section-panel">
        <div className="closing-copy" data-reveal>
          <p className="eyebrow">plastifree H2O</p>
          <h2>Pure water. Cleaner intent. No plastic bottle.</h2>
          <div className="hero-actions centered">
            <a
              className="premium-button"
              href="https://plastifreeh2o.com/"
              rel="noreferrer"
              target="_blank"
            >
              Start with one carton
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
            <a
              className="quiet-button"
              href="https://www.instagram.com/plastifreeindia/"
              rel="noreferrer"
              target="_blank"
            >
              <Sparkles aria-hidden="true" size={17} />
              Follow the launch
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>plastifree H2O</span>
        <a
          href="https://www.instagram.com/plastifreeindia/"
          rel="noreferrer"
          target="_blank"
        >
          Instagram
        </a>
      </footer>
    </main>
  );
}

function CinematicScene({ progress }: { progress: ProgressRef }) {
  return (
    <div className="scene-layer" aria-hidden="true">
      <Canvas
        camera={{ fov: 31, position: [0, 0, 7.8] }}
        dpr={[1, 1.65]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        shadows
      >
        <CameraRig progress={progress} />
        <ambientLight color="#f8ffff" intensity={1.85} />
        <directionalLight
          castShadow
          color="#ffffff"
          intensity={3.2}
          position={[3.6, 5.2, 4.2]}
          shadow-mapSize-height={1024}
          shadow-mapSize-width={1024}
        />
        <directionalLight
          color="#7edfd8"
          intensity={1.45}
          position={[-4.5, 1.8, 2.5]}
        />
        <pointLight color="#4abde8" intensity={34} position={[0.6, -1.3, 2.3]} />
        <Suspense fallback={<FallbackCarton progress={progress} />}>
          <WaterCarton progress={progress} />
        </Suspense>
        <WaterBubbles progress={progress} />
        <ReflectivePool />
        <ContactShadows
          blur={2.6}
          far={4.2}
          opacity={0.28}
          position={[0, -1.58, 0]}
          scale={7}
        />
        <Environment preset="city" resolution={128} />
      </Canvas>
    </div>
  );
}

function WaterCarton({ progress }: { progress: ProgressRef }) {
  const { scene } = useGLTF("/water.glb");
  const groupRef = useRef<THREE.Group>(null);
  const initializedRef = useRef(false);
  const { size } = useThree();

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;

      if (!mesh.isMesh) {
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) =>
          tuneMaterial(material.clone()),
        );
      } else {
        mesh.material = tuneMaterial(mesh.material.clone());
      }
    });

    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const target = sampleStage(progress.current, size.width < 760);
    const idle = Math.sin(state.clock.elapsedTime * 0.72) * 0.045;
    const glossRock = Math.sin(state.clock.elapsedTime * 0.36) * 0.018;

    if (!initializedRef.current) {
      group.position.set(
        target.position[0],
        target.position[1],
        target.position[2],
      );
      group.rotation.set(
        target.rotation[0],
        target.rotation[1],
        target.rotation[2],
      );
      group.scale.setScalar(target.scale);
      initializedRef.current = true;
    }

    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      target.position[0],
      3.5,
      delta,
    );
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      target.position[1] + idle,
      3.5,
      delta,
    );
    group.position.z = THREE.MathUtils.damp(
      group.position.z,
      target.position[2],
      3.5,
      delta,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      target.rotation[0] + glossRock,
      3.2,
      delta,
    );
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      target.rotation[1],
      3.2,
      delta,
    );
    group.rotation.z = THREE.MathUtils.damp(
      group.rotation.z,
      target.rotation[2] - glossRock,
      3.2,
      delta,
    );

    const nextScale = THREE.MathUtils.damp(
      group.scale.x,
      target.scale,
      3.4,
      delta,
    );
    group.scale.setScalar(nextScale);

  });

  return (
    <Float floatIntensity={0.34} rotationIntensity={0.08} speed={1.4}>
      <group ref={groupRef}>
        <primitive object={model} />
      </group>
    </Float>
  );
}

function FallbackCarton({ progress }: { progress: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const initializedRef = useRef(false);
  const { size } = useThree();

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const target = sampleStage(progress.current, size.width < 760);

    if (!initializedRef.current) {
      group.position.set(
        target.position[0],
        target.position[1],
        target.position[2],
      );
      group.rotation.y = target.rotation[1];
      group.scale.setScalar(target.scale);
      initializedRef.current = true;
    }

    group.position.set(
      THREE.MathUtils.damp(group.position.x, target.position[0], 4, delta),
      THREE.MathUtils.damp(group.position.y, target.position[1], 4, delta),
      THREE.MathUtils.damp(group.position.z, target.position[2], 4, delta),
    );
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      target.rotation[1],
      4,
      delta,
    );
    group.scale.setScalar(
      THREE.MathUtils.damp(group.scale.x, target.scale, 4, delta),
    );
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.18, 2.05, 0.72]} />
        <meshPhysicalMaterial
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          color="#f7fbf8"
          metalness={0.03}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}

function CameraRig({ progress }: { progress: ProgressRef }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const initializedRef = useRef(false);
  const { size } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera) {
      return;
    }

    const target = sampleStage(progress.current, size.width < 760);

    if (!initializedRef.current) {
      camera.position.set(target.camera[0], target.camera[1], target.camera[2]);
      camera.fov = target.fov;
      lookAt.set(target.lookAt[0], target.lookAt[1], target.lookAt[2]);
      camera.lookAt(lookAt);
      camera.updateProjectionMatrix();
      initializedRef.current = true;
    }

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      target.camera[0],
      2.7,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      target.camera[1],
      2.7,
      delta,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      target.camera[2],
      2.7,
      delta,
    );
    camera.fov = THREE.MathUtils.damp(camera.fov, target.fov, 2.4, delta);
    camera.updateProjectionMatrix();

    lookAt.set(target.lookAt[0], target.lookAt[1], target.lookAt[2]);
    camera.lookAt(lookAt);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={31}
      position={[0, 0.05, 7.8]}
    />
  );
}

function WaterBubbles({ progress }: { progress: ProgressRef }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 12, 12), []);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#dffffb",
        depthWrite: false,
        metalness: 0,
        opacity: 0.34,
        roughness: 0.05,
        transparent: true,
      }),
    [],
  );
  const particles = useMemo(
    () =>
      Array.from({ length: 86 }, (_, index) => ({
        drift: 0.04 + (index % 7) * 0.015,
        phase: index * 0.71,
        scale: 0.018 + ((index * 17) % 11) * 0.004,
        speed: 0.1 + ((index * 13) % 9) * 0.018,
        x: -3.1 + ((index * 53) % 100) / 100 * 6.2,
        y: -2.6 + ((index * 29) % 100) / 100 * 5.2,
        z: -1.5 + ((index * 37) % 100) / 100 * 1.6,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const time = clock.elapsedTime;
    const flow = progress.current * 1.55;

    particles.forEach((particle, index) => {
      const wrappedY =
        ((particle.y + time * particle.speed + flow) % 5.2) - 2.6;
      const sway = Math.sin(time * 0.8 + particle.phase) * particle.drift;
      const scale =
        particle.scale *
        (1 + Math.sin(time * 1.6 + particle.phase) * 0.18);

      dummy.position.set(particle.x + sway, wrappedY, particle.z);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, particles.length]}
      frustumCulled={false}
    />
  );
}

function ReflectivePool() {
  return (
    <mesh position={[0, -1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[3.25, 96]} />
      <MeshReflectorMaterial
        blur={[700, 140]}
        color="#e9faf6"
        depthScale={0.16}
        metalness={0.14}
        mirror={0.46}
        mixBlur={1.2}
        mixStrength={1.15}
        opacity={0.32}
        resolution={512}
        roughness={0.38}
        transparent
      />
    </mesh>
  );
}

function FeaturePanel({
  Icon,
  body,
  delay,
  kicker,
  title,
}: {
  Icon: LucideIcon;
  body: string;
  delay: number;
  kicker: string;
  title: string;
}) {
  return (
    <article
      className="feature-panel"
      data-delay={delay}
      data-reveal
      tabIndex={0}
    >
      <span className="icon-orbit">
        <Icon aria-hidden="true" size={24} strokeWidth={1.45} />
      </span>
      <p>{kicker}</p>
      <h3>{title}</h3>
      <span>{body}</span>
    </article>
  );
}

function DetailTile({
  Icon,
  body,
  delay,
  title,
}: {
  Icon: LucideIcon;
  body: string;
  delay: number;
  title: string;
}) {
  return (
    <article className="detail-tile" data-delay={delay} data-reveal tabIndex={0}>
      <Icon aria-hidden="true" size={22} strokeWidth={1.45} />
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function SplashDivider() {
  return (
    <div className="splash-divider" data-splash aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const element = ref.current;
    if (!element) {
      return;
    }

    const value = { current: 0 };
    const render = () => {
      element.textContent = `${Math.round(value.current)}${suffix}`;
    };

    const tween = gsap.to(value, {
      current: end,
      duration: 1.7,
      ease: "power3.out",
      onUpdate: render,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 86%",
      once: true,
      onEnter: () => tween.play(),
    });

    render();

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [end, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function sampleStage(progress: number, isMobile: boolean) {
  const stages = isMobile ? mobileStages : desktopStages;
  const clamped = THREE.MathUtils.clamp(progress, 0, 1);
  let index = 0;

  while (index < stages.length - 2 && clamped > stages[index + 1].at) {
    index += 1;
  }

  const from = stages[index];
  const to = stages[index + 1];
  const local = (clamped - from.at) / Math.max(to.at - from.at, 0.001);
  const t = local * local * (3 - 2 * local);

  return {
    camera: lerpTuple(from.camera, to.camera, t),
    fov: THREE.MathUtils.lerp(from.fov, to.fov, t),
    lookAt: lerpTuple(from.lookAt, to.lookAt, t),
    position: lerpTuple(from.position, to.position, t),
    rotation: lerpTuple(from.rotation, to.rotation, t),
    scale: THREE.MathUtils.lerp(from.scale, to.scale, t),
  };
}

function lerpTuple(
  from: [number, number, number],
  to: [number, number, number],
  amount: number,
): [number, number, number] {
  return [
    THREE.MathUtils.lerp(from[0], to[0], amount),
    THREE.MathUtils.lerp(from[1], to[1], amount),
    THREE.MathUtils.lerp(from[2], to[2], amount),
  ];
}

function tuneMaterial(material: THREE.Material) {
  const tuned = material as THREE.Material & {
    clearcoat?: number;
    clearcoatRoughness?: number;
    envMapIntensity?: number;
    metalness?: number;
    roughness?: number;
  };

  tuned.envMapIntensity = Math.max(tuned.envMapIntensity ?? 1, 1.45);
  tuned.metalness = Math.min(tuned.metalness ?? 0.02, 0.08);
  tuned.roughness = Math.min(tuned.roughness ?? 0.46, 0.38);
  tuned.clearcoat = Math.max(tuned.clearcoat ?? 0, 0.24);
  tuned.clearcoatRoughness = Math.min(tuned.clearcoatRoughness ?? 0.24, 0.2);
  tuned.needsUpdate = true;

  return tuned as THREE.Material;
}
