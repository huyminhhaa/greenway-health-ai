/**
 * Cảnh 3D ở hero: mô hình sản phẩm Greenway dựng bằng three.js từ ảnh bao bì thật
 * (texture trong public/products/3d, tạo từ ảnh cửa hàng: cắt mặt hộp, trải phẳng nhãn lọ).
 *  - Hộp Welllab Omega-3 và lọ thủy tinh hổ phách, nắp nhôm, nhãn quấn quanh thân
 *  - Lọ Welllab C-Complex Plus
 *  - Gói Balancer Slim phồng hai mặt
 *  - Hộp trà TeaVitall Express Balance 9
 * Xoay 360° bằng kéo, có quán tính; rê chuột vào món nào thì món đó nhô lên.
 * Màu mặt bên/nắp là màu vật liệu lấy mẫu từ ảnh sản phẩm (dữ liệu, không phải màu giao diện).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export interface ProductScene {
  setPlaying: (playing: boolean) => void;
  dispose: () => void;
}

const TEX = '/products/3d/';
const GROUND_Y = -2.2;

/** Lọ Welllab đo từ ảnh: 1px ảnh = K đơn vị; thân lọ bán kính 174px. */
const K = 0.82 / 174;

interface Model {
  root: THREE.Group;
  base: THREE.Vector3;
  baseRotY: number;
  phase: number;
  delay: number;
  hover: number;
}

export function mountProductScene(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean }): ProductScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  const small = window.matchMedia('(max-width: 40rem)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  // Ánh sáng cửa sổ ấm từ trên trái, đổ bóng mềm
  const key = new THREE.DirectionalLight(0xfff3df, 2.2);
  key.position.set(-5, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  key.shadow.radius = 10;
  key.shadow.blurSamples = 16;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe8f4ff, 0.8);
  rim.position.set(6, 4, -6);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xdfe6d8, 0.5));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  ground.receiveShadow = true;
  scene.add(ground);

  const world = new THREE.Group();
  // Lệch phải và lên cao một chút: góc dưới trái dành cho nhãn liều dùng.
  world.position.set(0.55, 0.3, 0);
  scene.add(world);

  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const tex = (name: string) => {
    const t = keep(loader.load(TEX + name, () => !running && renderOnce()));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    return t;
  };
  const paper = (color: number, roughness = 0.62) => keep(new THREE.MeshStandardMaterial({ color, roughness }));
  const shadowed = (o: THREE.Object3D) => o.traverse((m) => ((m as THREE.Mesh).isMesh ? ((m.castShadow = true), (m.receiveShadow = true)) : 0));

  /* ---------------- Hộp giấy ---------------- */
  function box(front: string, w: number, h: number, d: number, c: { left: number; right: number; top: number; back: number }) {
    const geo = keep(new RoundedBoxGeometry(w, h, d, 3, 0.035));
    // Thứ tự mặt: +x, -x, +y, -y, +z (trước), -z (sau)
    const frontMat = keep(new THREE.MeshStandardMaterial({ map: tex(front), roughness: 0.5 }));
    const mesh = new THREE.Mesh(geo, [paper(c.right), paper(c.left), paper(c.top), paper(c.back), frontMat, paper(c.back)]);
    const g = new THREE.Group();
    g.add(mesh);
    shadowed(g);
    return g;
  }

  /* ---------------- Lọ thủy tinh Welllab ---------------- */
  // Biên dạng tiện theo ảnh (px tính từ đáy lọ, bán kính px)
  const glassProfile = [
    [0, 0], [140, 0], [162, 4], [172, 14], [174, 34], [174, 440], [171, 466], [160, 486], [136, 502], [118, 512], [117, 520], [117, 552],
  ].map(([r, y]) => new THREE.Vector2(r * K, y * K));
  const glassGeo = keep(new THREE.LatheGeometry(glassProfile, 72));
  const glassMat = keep(
    new THREE.MeshPhysicalMaterial({
      color: 0x6b3510,
      roughness: 0.07,
      metalness: 0,
      transmission: 0.45,
      thickness: 0.7,
      ior: 1.5,
      attenuationColor: 0x5a2606,
      attenuationDistance: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.4,
    }),
  );
  // Nắp nhôm có khía
  const capGeo = keep(new THREE.CylinderGeometry(124 * K, 124 * K, 78 * K, 72, 1));
  const capTopGeo = keep(new THREE.CircleGeometry(121 * K, 72));
  const capMat = keep(new THREE.MeshStandardMaterial({ color: 0xd4d6d6, metalness: 1, roughness: 0.28 }));
  const ridgeTex = (() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 8;
    const g = c.getContext('2d')!;
    for (let x = 0; x < 256; x += 4) {
      g.fillStyle = x % 8 ? 'rgb(150 150 150)' : 'rgb(255 255 255)';
      g.fillRect(x, 0, 4, 8);
    }
    const t = keep(new THREE.CanvasTexture(c));
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(3, 1);
    return t;
  })();
  const capSideMat = keep(new THREE.MeshStandardMaterial({ color: 0xd4d6d6, metalness: 1, roughness: 0.32, bumpMap: ridgeTex, bumpScale: 2 }));

  function bottle(label: string) {
    const g = new THREE.Group();
    const glass = new THREE.Mesh(glassGeo, glassMat);
    g.add(glass);
    // Nhãn: trụ hở bọc sát thân, u = 0.5 hướng về phía trước (+z)
    const labelH = (568 - 204) * K;
    const labelGeo = keep(new THREE.CylinderGeometry(175.5 * K, 175.5 * K, labelH, 96, 1, true, Math.PI, Math.PI * 2));
    const labelMat = keep(new THREE.MeshPhysicalMaterial({ map: tex(label), roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.3 }));
    const lab = new THREE.Mesh(labelGeo, labelMat);
    lab.position.y = (650 - 568) * K + labelH / 2;
    g.add(lab);
    const cap = new THREE.Mesh(capGeo, [capSideMat, capMat, capMat]);
    cap.position.y = 552 * K + 39 * K;
    g.add(cap);
    const top = new THREE.Mesh(capTopGeo, capMat);
    top.rotation.x = -Math.PI / 2;
    top.position.y = 552 * K + 78.5 * K;
    g.add(top);
    // tâm nhóm ở giữa chiều cao lọ
    g.children.forEach((c) => (c.position.y -= (630 * K) / 2));
    shadowed(g);
    return g;
  }

  /* ---------------- Gói Balancer phồng ---------------- */
  function sachet(front: string, w: number, h: number, depth: number, backColor: number) {
    const g = new THREE.Group();
    // Mỗi mặt là một tấm phồng về phía +z; mặt sau được quay 180° nên phồng về phía -z.
    const make = (side: 'front' | 'back', mat: THREE.Material) => {
      const geo = keep(new THREE.PlaneGeometry(w, h, 40, 56));
      const pos = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i) / w + 0.5;
        const v = pos.getY(i) / h + 0.5;
        // mép ép phẳng 6%, phần giữa phồng
        const eu = Math.max(0, Math.min(1, (u - 0.04) / 0.92));
        const ev = Math.max(0, Math.min(1, (v - 0.06) / 0.88));
        const z = depth * Math.pow(Math.sin(Math.PI * eu), 0.55) * Math.pow(Math.sin(Math.PI * ev), 0.4);
        pos.setZ(i, z);
      }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, mat);
      if (side === 'back') m.rotation.y = Math.PI;
      return m;
    };
    const foil = { roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.18, metalness: 0.05 };
    g.add(make('front', keep(new THREE.MeshPhysicalMaterial({ map: tex(front), ...foil }))));
    g.add(make('back', keep(new THREE.MeshPhysicalMaterial({ color: backColor, ...foil }))));
    shadowed(g);
    return g;
  }

  /* ---------------- Bố trí ---------------- */
  const omegaBox = box('omega-box.jpg', 1.62, 3.05, 0.98, { left: 0xaaca90, right: 0xe7e3d0, top: 0x52585d, back: 0xdeddc9 });
  const omegaBottle = bottle('omega-label.jpg');
  const ccBottle = bottle('cc-label.jpg');
  ccBottle.scale.setScalar(0.82);
  const balancer = sachet('balancer-sachet.jpg', 1.95, 2.76, 0.16, 0xdfd766);
  const tea = box('tea-front.jpg', 3.0, 1.64, 0.62, { left: 0x807595, right: 0x807595, top: 0x948bbd, back: 0x948bbd });

  const layout: { obj: THREE.Group; pos: [number, number, number]; rotY: number; rotZ?: number }[] = [
    { obj: omegaBox, pos: [-0.55, 0.35, -0.9], rotY: 0.32 },
    { obj: omegaBottle, pos: [0.85, -0.45, 0.6], rotY: -0.25 },
    { obj: balancer, pos: [-2.85, 0.75, 0.1], rotY: 0.42, rotZ: 0.12 },
    { obj: tea, pos: [2.55, 1.45, -1.4], rotY: -0.5, rotZ: -0.06 },
    { obj: ccBottle, pos: [2.75, -0.95, 0.9], rotY: -0.45 },
  ];

  const models: Model[] = layout.map((l, i) => {
    const root = new THREE.Group();
    root.add(l.obj);
    l.obj.rotation.z = l.rotZ ?? 0;
    root.position.set(...l.pos);
    root.rotation.y = l.rotY;
    root.userData.index = i;
    world.add(root);
    return { root, base: new THREE.Vector3(...l.pos), baseRotY: l.rotY, phase: i * 1.3, delay: i * 0.08, hover: 0 };
  });

  /* ---------------- Khung hình ---------------- */
  let running = false;
  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Khung hẹp (điện thoại): thu cả cụm lại cho vừa bề ngang, đẩy lên trên để chừa chỗ cho nhãn liều dùng.
    const narrow = camera.aspect < 1.2;
    world.scale.setScalar(narrow ? 0.78 : 1);
    world.position.set(narrow ? 0.2 : 0.55, narrow ? 0.85 : 0.3, 0);
    camera.position.set(0, 1.2, camera.aspect < 0.8 ? 15 : narrow ? 12.6 : 13.5);
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
    if (!running) renderOnce();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement ?? canvas);

  /* ---------------- Tương tác ---------------- */
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velYaw = 0;
  let yaw = 0;
  let pitch = 0;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(10, 10);

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.dataset.dragging = 'true';
  };
  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = dx * 0.006;
      yaw += velYaw;
      pitch = THREE.MathUtils.clamp(pitch + dy * 0.004, -0.35, 0.35);
    }
    if (!running) renderOnce();
  };
  const onLeave = () => pointer.set(10, 10);
  const onUp = (e: PointerEvent) => {
    dragging = false;
    delete canvas.dataset.dragging;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  /* ---------------- Vòng lặp ---------------- */
  let raf = 0;
  const start = performance.now();
  let last = start;
  const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4);
  const roots = models.map((m) => m.root);

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - start) / 1000;
    const still = opts.reducedMotion;

    if (!dragging) {
      velYaw *= 0.95;
      yaw += velYaw;
      pitch += (0 - pitch) * Math.min(1, dt * 1.5);
    }
    world.rotation.y = yaw + (still ? 0 : Math.sin(t * 0.18) * 0.22);
    world.rotation.x = pitch;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(roots, true)[0];
    let hovered = -1;
    if (hit) {
      let o: THREE.Object3D | null = hit.object;
      while (o && o.parent !== world) o = o.parent;
      hovered = (o?.userData.index as number | undefined) ?? -1;
    }
    canvas.style.cursor = dragging ? 'grabbing' : hovered >= 0 ? 'pointer' : '';

    for (let i = 0; i < models.length; i++) {
      const m = models[i];
      m.hover += ((i === hovered && !dragging ? 1 : 0) - m.hover) * Math.min(1, dt * 8);
      const intro = still ? 1 : ease((t - m.delay) / 0.9);
      const bob = still ? 0 : Math.sin(t * ((2 * Math.PI) / 8) + m.phase) * 0.1;
      m.root.position.set(m.base.x, m.base.y + bob + m.hover * 0.28 - (1 - intro) * 0.8, m.base.z);
      // mỗi món tự xoay nhẹ qua lại để lộ khối 3D, rê chuột thì quay hẳn về phía người xem
      const sway = still ? 0 : Math.sin(t * 0.32 + m.phase) * 0.35;
      m.root.rotation.y = m.baseRotY * (1 - m.hover) + sway * (1 - m.hover);
      m.root.scale.setScalar((0.85 + 0.15 * intro) * (1 + m.hover * 0.05));
    }

    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  }
  const renderOnce = () => frame(performance.now());

  const setPlaying = (playing: boolean) => {
    if (playing === running) return;
    running = playing;
    if (playing) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else cancelAnimationFrame(raf);
  };

  resize();
  renderOnce();

  return {
    setPlaying: (p) => setPlaying(p && !opts.reducedMotion),
    dispose: () => {
      setPlaying(false);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      disposables.forEach((d) => d.dispose());
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
