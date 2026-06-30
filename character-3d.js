const THREE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js';

const runWhenReady = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
        return;
    }
    callback();
};

runWhenReady(async () => {
    const targets = [...document.querySelectorAll('[data-fa-3d-character]')];
    if (!targets.length) return;

    let THREE;
    try {
        THREE = await import(THREE_MODULE_URL);
    } catch (error) {
        console.warn('FaroAI 3D character fallback active.', error);
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    targets.forEach((canvas) => {
        try {
            createFaroCharacterScene(THREE, canvas, prefersReducedMotion);
        } catch (error) {
            console.warn('FaroAI 3D character could not start.', error);
        }
    });
});

function createFaroCharacterScene(THREE, canvas, prefersReducedMotion) {
    const variant = canvas.dataset.characterVariant || 'hero';
    const shell = canvas.closest('[data-fa-character-shell]');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const cameraZ = variant === 'matrix' ? 4.8 : 5.95;
    camera.position.set(0, 0.7, cameraZ);
    camera.lookAt(0, 0.06, 0);

    const ambient = new THREE.AmbientLight(0xdbeafe, 1.42);
    const key = new THREE.DirectionalLight(0xffffff, 2.3);
    key.position.set(2.4, 4.2, 3.6);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 9;
    key.shadow.camera.left = -2.5;
    key.shadow.camera.right = 2.5;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -2.5;
    const rim = new THREE.PointLight(0x5eead4, 4.8, 8);
    rim.position.set(-2.4, 1.2, 2.5);
    const blueFill = new THREE.PointLight(0x2563eb, 3.1, 8);
    blueFill.position.set(2.6, -0.7, 2.1);
    scene.add(ambient, key, rim, blueFill);

    const refs = buildCharacter(THREE, variant);
    scene.add(refs.root);
    refs.root.traverse((node) => {
        if (!node.isMesh) return;
        node.castShadow = true;
        node.receiveShadow = true;
    });

    const shadowCatcher = createShadowCatcher(THREE, variant);
    scene.add(shadowCatcher);
    refs.shadowCatcher = shadowCatcher;

    const clock = new THREE.Clock();
    let isVisible = true;
    let disposed = false;

    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const visibilityObserver = new IntersectionObserver((entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.05 });
    visibilityObserver.observe(canvas);

    const renderFrame = () => {
        const elapsed = clock.getElapsedTime();
        animateCharacter(THREE, refs, elapsed, variant, prefersReducedMotion);
        renderer.render(scene, camera);
        shell?.classList.add('is-3d-ready');
    };

    const tick = () => {
        if (disposed) return;
        if (isVisible) renderFrame();
        if (!prefersReducedMotion) requestAnimationFrame(tick);
    };

    renderFrame();
    if (!prefersReducedMotion) requestAnimationFrame(tick);

    window.addEventListener('pagehide', () => {
        disposed = true;
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        renderer.dispose();
    }, { once: true });
}

function buildCharacter(THREE, variant) {
    const root = new THREE.Group();
    const character = new THREE.Group();
    root.add(character);

    const materials = createMaterials(THREE);
    const body = mesh(THREE, new THREE.SphereGeometry(0.56, 48, 32), materials.suit);
    body.scale.set(0.88, 1.06, 0.62);
    body.position.set(0, -0.06, 0);
    character.add(body);

    const sideShell = mesh(THREE, new THREE.TorusGeometry(0.44, 0.018, 12, 80), materials.darkTrim);
    sideShell.position.set(0, -0.03, 0.12);
    sideShell.rotation.x = Math.PI / 2;
    sideShell.scale.set(1, 0.68, 1);
    character.add(sideShell);

    const torsoPlate = mesh(THREE, new THREE.CapsuleGeometry(0.2, 0.34, 8, 24), materials.torsoPanel);
    torsoPlate.scale.set(1.1, 1, 0.18);
    torsoPlate.position.set(0, 0.03, 0.53);
    torsoPlate.rotation.x = -0.08;
    character.add(torsoPlate);

    const chest = createChestMark(THREE);
    chest.position.set(0, 0.14, 0.575);
    chest.rotation.x = -0.08;
    character.add(chest);

    const collar = mesh(THREE, new THREE.TorusGeometry(0.43, 0.035, 16, 72), materials.blueTrim);
    collar.position.set(0, 0.62, 0.06);
    collar.rotation.x = Math.PI / 2;
    collar.scale.set(1, 0.62, 1);
    character.add(collar);

    [-0.34, 0.34].forEach((x) => {
        const shoulder = mesh(THREE, new THREE.SphereGeometry(0.17, 28, 18), materials.shoulder);
        shoulder.scale.set(0.96, 0.82, 0.72);
        shoulder.position.set(x, 0.43, 0.04);
        character.add(shoulder);
    });

    const head = new THREE.Group();
    head.position.set(0, 1.05, 0.06);
    character.add(head);

    const face = mesh(THREE, new THREE.SphereGeometry(0.46, 48, 32), materials.pig);
    face.scale.set(1.02, 0.88, 0.84);
    face.position.set(0, 0, 0.1);
    head.add(face);

    const helmet = mesh(THREE, new THREE.SphereGeometry(0.64, 64, 32), materials.glass);
    helmet.scale.set(1.08, 0.9, 0.92);
    helmet.position.set(0, 0, 0.08);
    head.add(helmet);

    const visorGlow = mesh(THREE, new THREE.PlaneGeometry(0.48, 0.13), materials.visorGlow);
    visorGlow.position.set(-0.17, 0.18, 0.64);
    visorGlow.rotation.z = -0.18;
    head.add(visorGlow);

    const rim = mesh(THREE, new THREE.TorusGeometry(0.54, 0.025, 18, 96), materials.cyan);
    rim.position.set(0, 0, 0.47);
    rim.scale.set(1.08, 0.78, 1);
    head.add(rim);

    const visorBand = mesh(THREE, new THREE.TorusGeometry(0.5, 0.012, 12, 96), materials.darkTrim);
    visorBand.position.set(0, -0.02, 0.49);
    visorBand.scale.set(1.08, 0.78, 1);
    head.add(visorBand);

    const haloA = mesh(THREE, new THREE.TorusGeometry(0.72, 0.009, 10, 120), materials.ringDim);
    haloA.position.set(0, 0.02, 0.02);
    haloA.rotation.x = Math.PI / 2.25;
    haloA.rotation.z = -0.38;
    head.add(haloA);

    const haloB = mesh(THREE, new THREE.TorusGeometry(0.66, 0.008, 10, 120), materials.ring);
    haloB.position.set(0, -0.02, 0.03);
    haloB.rotation.x = Math.PI / 2.1;
    haloB.rotation.z = 0.55;
    head.add(haloB);

    const snout = mesh(THREE, new THREE.SphereGeometry(0.16, 32, 18), materials.snout);
    snout.scale.set(1.28, 0.72, 0.46);
    snout.position.set(0, -0.055, 0.54);
    head.add(snout);

    [-0.08, 0.08].forEach((x) => {
        const nostril = mesh(THREE, new THREE.SphereGeometry(0.025, 16, 10), materials.nostril);
        nostril.scale.set(0.8, 1.25, 0.55);
        nostril.position.set(x, -0.052, 0.625);
        head.add(nostril);
    });

    const eyes = [];
    [-0.2, 0.2].forEach((x) => {
        const eye = mesh(THREE, new THREE.SphereGeometry(0.055, 24, 16), materials.eye);
        eye.position.set(x, 0.13, 0.49);
        eyes.push(eye);
        head.add(eye);
        const glint = mesh(THREE, new THREE.SphereGeometry(0.014, 12, 8), materials.eyeGlint);
        glint.position.set(x - 0.018, 0.15, 0.535);
        head.add(glint);
    });

    [-0.27, 0.27].forEach((x) => {
        const cheek = mesh(THREE, new THREE.SphereGeometry(0.035, 18, 10), materials.cheek);
        cheek.scale.set(1.35, 0.56, 0.3);
        cheek.position.set(x, -0.08, 0.52);
        head.add(cheek);
    });

    const smileCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.1, -0.17, 0.548),
        new THREE.Vector3(-0.035, -0.205, 0.568),
        new THREE.Vector3(0.035, -0.205, 0.568),
        new THREE.Vector3(0.1, -0.17, 0.548),
    ]);
    const smile = mesh(THREE, new THREE.TubeGeometry(smileCurve, 24, 0.009, 8, false), materials.smile);
    head.add(smile);

    [-0.38, 0.38].forEach((x) => {
        const ear = mesh(THREE, new THREE.SphereGeometry(0.13, 24, 14), materials.pig);
        ear.scale.set(0.64, 1.02, 0.38);
        ear.position.set(x, 0.24, -0.12);
        ear.rotation.z = x < 0 ? -0.42 : 0.42;
        head.add(ear);
    });

    [-0.62, 0.62].forEach((x) => {
        const pod = mesh(THREE, new THREE.CylinderGeometry(0.14, 0.14, 0.12, 32), materials.suit);
        pod.position.set(x, -0.02, 0.05);
        pod.rotation.z = Math.PI / 2;
        head.add(pod);
        const podCore = mesh(THREE, new THREE.TorusGeometry(0.095, 0.013, 10, 48), materials.cyan);
        podCore.position.set(x + (x < 0 ? -0.065 : 0.065), -0.02, 0.05);
        podCore.rotation.y = Math.PI / 2;
        head.add(podCore);
    });

    const waveArm = createArm(THREE, materials, -1);
    waveArm.position.set(-0.46, 0.38, 0.03);
    waveArm.rotation.z = 0.8;
    character.add(waveArm);

    const steadyArm = createArm(THREE, materials, 1);
    steadyArm.position.set(0.48, 0.2, 0.02);
    steadyArm.rotation.z = -0.46;
    character.add(steadyArm);

    const legs = [];
    [-0.24, 0.24].forEach((x) => {
        const leg = mesh(THREE, new THREE.CapsuleGeometry(0.115, 0.34, 10, 24), materials.suit);
        leg.position.set(x, -0.76, 0.03);
        leg.rotation.z = x < 0 ? 0.06 : -0.06;
        character.add(leg);
        legs.push(leg);

        const shoe = mesh(THREE, new THREE.SphereGeometry(0.18, 28, 16), materials.shoe);
        shoe.scale.set(1.34, 0.48, 0.72);
        shoe.position.set(x + (x < 0 ? -0.04 : 0.04), -1.0, 0.22);
        character.add(shoe);
    });

    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, -0.12, -0.32),
        new THREE.Vector3(0.74, -0.04, -0.26),
        new THREE.Vector3(0.7, 0.08, -0.2),
        new THREE.Vector3(0.58, 0.04, -0.14),
    ]);
    const tail = mesh(THREE, new THREE.TubeGeometry(tailCurve, 36, 0.026, 10, false), materials.snout);
    const tailRig = new THREE.Group();
    tailRig.add(tail);
    character.add(tailRig);

    const platform = new THREE.Group();
    const ringA = mesh(THREE, new THREE.TorusGeometry(1.02, 0.012, 12, 120), materials.ring);
    ringA.rotation.x = Math.PI / 2;
    const ringB = mesh(THREE, new THREE.TorusGeometry(0.66, 0.01, 12, 96), materials.ringDim);
    ringB.rotation.x = Math.PI / 2;
    ringB.position.y = 0.018;
    const pad = mesh(THREE, new THREE.CircleGeometry(0.56, 96), materials.pad);
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = -0.012;
    platform.position.set(0, -1.14, 0.02);
    platform.add(ringA, ringB, pad);
    root.add(platform);

    const sparks = createSparks(THREE, materials);
    root.add(sparks);

    if (variant === 'matrix') {
        character.scale.setScalar(1.42);
        character.position.set(0, -0.52, 0);
        character.rotation.y = -0.18;
        platform.visible = false;
        sparks.visible = false;
    } else {
        character.position.set(-0.2, 0.05, 0);
        character.rotation.y = -0.3;
    }

    return {
        root,
        character,
        characterBaseY: character.position.y,
        characterBaseScale: character.scale.clone(),
        characterBaseRotationY: character.rotation.y,
        head,
        haloA,
        haloB,
        waveArm,
        steadyArm,
        legs,
        eyes,
        tailRig,
        platform,
        ringA,
        ringB,
        sparks,
    };
}

function createMaterials(THREE) {
    return {
        suit: new THREE.MeshStandardMaterial({ color: 0xe9eef7, roughness: 0.52, metalness: 0.1 }),
        torsoPanel: new THREE.MeshStandardMaterial({ color: 0xf8fbff, roughness: 0.38, metalness: 0.16 }),
        shoulder: new THREE.MeshStandardMaterial({ color: 0xd7e4f4, roughness: 0.44, metalness: 0.18 }),
        pig: new THREE.MeshStandardMaterial({ color: 0xffd6dd, roughness: 0.62, metalness: 0.02 }),
        snout: new THREE.MeshStandardMaterial({ color: 0xffa6b7, roughness: 0.58, metalness: 0.02 }),
        cheek: new THREE.MeshStandardMaterial({ color: 0xffb8c5, roughness: 0.64, metalness: 0.01, transparent: true, opacity: 0.66 }),
        smile: new THREE.MeshStandardMaterial({ color: 0x7a3440, roughness: 0.7 }),
        nostril: new THREE.MeshStandardMaterial({ color: 0x6b2d38, roughness: 0.72 }),
        eye: new THREE.MeshStandardMaterial({ color: 0x151b2d, roughness: 0.26, metalness: 0.1 }),
        eyeGlint: new THREE.MeshBasicMaterial({ color: 0xffffff }),
        shoe: new THREE.MeshStandardMaterial({ color: 0x165b9f, roughness: 0.4, metalness: 0.18 }),
        blueTrim: new THREE.MeshStandardMaterial({ color: 0x0f6abf, roughness: 0.34, metalness: 0.28 }),
        darkTrim: new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x0ea5e9, emissiveIntensity: 0.12, roughness: 0.22, metalness: 0.36 }),
        visorGlow: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false }),
        cyan: new THREE.MeshStandardMaterial({ color: 0x5eead4, emissive: 0x0ea5e9, emissiveIntensity: 0.55, roughness: 0.18, metalness: 0.22 }),
        ring: new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.56 }),
        ringDim: new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.38 }),
        pad: new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.08 }),
        glass: new THREE.MeshPhysicalMaterial({
            color: 0xb8f3ff,
            metalness: 0,
            roughness: 0.04,
            transparent: true,
            opacity: 0.32,
            transmission: 0.28,
            thickness: 0.24,
        }),
    };
}

function createShadowCatcher(THREE, variant) {
    const shadow = mesh(
        THREE,
        new THREE.PlaneGeometry(variant === 'matrix' ? 1.55 : 2.25, variant === 'matrix' ? 0.72 : 1.05),
        new THREE.ShadowMaterial({ color: 0x0f172a, opacity: variant === 'matrix' ? 0.18 : 0.23, transparent: true }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(variant === 'matrix' ? 0 : -0.04, -1.16, 0.12);
    shadow.receiveShadow = true;
    return shadow;
}

function createArm(THREE, materials, side) {
    const arm = new THREE.Group();
    const upper = mesh(THREE, new THREE.CapsuleGeometry(0.09, 0.36, 10, 22), materials.suit);
    upper.position.set(0.03 * side, -0.2, 0.02);
    upper.rotation.z = -0.08 * side;
    const cuff = mesh(THREE, new THREE.TorusGeometry(0.095, 0.012, 8, 36), materials.blueTrim);
    cuff.position.set(0.03 * side, -0.4, 0.02);
    cuff.rotation.x = Math.PI / 2;
    const hand = mesh(THREE, new THREE.SphereGeometry(0.13, 24, 16), materials.suit);
    hand.scale.set(1, 0.86, 0.72);
    hand.position.set(0.05 * side, -0.52, 0.09);
    arm.add(upper, cuff, hand);

    for (let index = 0; index < 3; index += 1) {
        const finger = mesh(THREE, new THREE.CapsuleGeometry(0.018, 0.11, 5, 10), materials.suit);
        finger.position.set((index - 1) * 0.045 + 0.05 * side, -0.62, 0.12);
        finger.rotation.z = (index - 1) * 0.16;
        arm.add(finger);
    }
    return arm;
}

function createChestMark(THREE) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(28, 0, 226, 128);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(0.58, '#14b8a6');
    gradient.addColorStop(1, '#e74c3c');
    context.font = '900 78px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    context.fillStyle = gradient;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Fa', 128, 66);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    return mesh(THREE, new THREE.PlaneGeometry(0.5, 0.25), material);
}

function createSparks(THREE, materials) {
    const group = new THREE.Group();
    const points = [
        [-0.92, 0.72, -0.12],
        [0.92, 0.98, -0.18],
        [-0.72, -0.34, 0.1],
        [0.82, -0.2, -0.08],
        [0.18, 1.72, -0.2],
    ];
    points.forEach(([x, y, z], index) => {
        const spark = mesh(THREE, new THREE.SphereGeometry(index % 2 ? 0.027 : 0.021, 12, 8), index % 2 ? materials.ringDim : materials.ring);
        spark.position.set(x, y, z);
        group.add(spark);
    });
    return group;
}

function animateCharacter(THREE, refs, elapsed, variant, prefersReducedMotion) {
    const t = prefersReducedMotion ? 0.62 : elapsed;
    const hop = Math.sin(t * 2.55);
    const softHop = Math.max(0, hop) * (variant === 'matrix' ? 0.06 : 0.14);
    const landingSquash = Math.max(0, -hop) * (variant === 'matrix' ? 0.018 : 0.035);
    const breath = Math.sin(t * 1.8) * 0.014;
    const turn = Math.sin(t * 0.82);

    refs.character.position.y = refs.characterBaseY + softHop + Math.sin(t * 1.35) * 0.018;
    refs.character.scale.set(
        refs.characterBaseScale.x * (1 + landingSquash - breath * 0.28),
        refs.characterBaseScale.y * (1 - landingSquash * 0.9 + breath),
        refs.characterBaseScale.z * (1 + landingSquash * 0.7 - breath * 0.14),
    );
    refs.character.rotation.y = refs.characterBaseRotationY + turn * (variant === 'matrix' ? 0.58 : 0.48);
    refs.character.rotation.z = Math.sin(t * 1.4) * (variant === 'matrix' ? 0.022 : 0.04);
    refs.character.rotation.x = Math.sin(t * 0.9) * 0.026;
    refs.head.rotation.x = Math.sin(t * 1.25) * 0.055;
    refs.head.rotation.y = Math.sin(t * 0.92) * 0.22 - turn * 0.08;
    refs.haloA.rotation.z = -0.38 + t * 0.38;
    refs.haloB.rotation.z = 0.55 - t * 0.5;
    refs.waveArm.rotation.z = 0.76 + Math.sin(t * 3.4) * 0.34;
    refs.waveArm.rotation.x = Math.sin(t * 2.2) * 0.16;
    refs.steadyArm.rotation.z = -0.42 + Math.sin(t * 1.7) * 0.05;
    refs.tailRig.rotation.y = Math.sin(t * 3.2) * 0.28;
    refs.tailRig.rotation.z = Math.sin(t * 2.4) * 0.12;

    refs.legs.forEach((leg, index) => {
        leg.rotation.z = (index === 0 ? 0.06 : -0.06) + Math.sin(t * 2.1 + index) * 0.035;
    });

    const blink = Math.sin(t * 3.1) > 0.965 ? 0.16 : 1;
    refs.eyes.forEach((eye) => {
        eye.scale.y = blink;
    });

    refs.ringA.rotation.z = t * 0.62;
    refs.ringB.rotation.z = -t * 0.9;
    refs.platform.scale.setScalar(1 + Math.sin(t * 2.1) * 0.02);
    if (refs.shadowCatcher) {
        refs.shadowCatcher.scale.setScalar(1 + softHop * 0.45);
        refs.shadowCatcher.material.opacity = (variant === 'matrix' ? 0.15 : 0.2) - softHop * 0.22;
    }
    refs.sparks.children.forEach((spark, index) => {
        spark.position.y += Math.sin(t * 1.7 + index) * 0.0015;
        spark.scale.setScalar(0.8 + Math.sin(t * 2.4 + index) * 0.22);
    });

    refs.root.rotation.x = variant === 'matrix' ? 0.02 : -0.02;
}

function mesh(THREE, geometry, material) {
    return new THREE.Mesh(geometry, material);
}
