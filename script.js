// --- 1. GLOBAL VARIABLES ---
let scene, camera, renderer, heartMesh, bgMusic;
let targetScale = 1;
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const bgCanvas = document.getElementById('bg-canvas');
const ctx = bgCanvas.getContext('2d');
const particles = [];

// --- 2. INITIALIZE SCENE ---
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create Heart
    const shape = new THREE.Shape();
    shape.moveTo(25, 25);
    shape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    shape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    shape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    shape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    shape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    shape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateZ(Math.PI); 

    const material = new THREE.MeshPhongMaterial({
        color: 0xff4da6,
        shininess: 100,
        flatShading: true
    });

    heartMesh = new THREE.Mesh(geometry, material);
    heartMesh.scale.set(0.08, 0.08, 0.08); // Scaled for mobile
    scene.add(heartMesh);

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 5);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Particle Setup
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2
        });
    }

    animate();
}

// --- 3. ANIMATION & PARTICLES ---
function animate() {
    requestAnimationFrame(animate);

    if (heartMesh) {
        heartMesh.rotation.y += 0.01;
        // Heartbeat
        const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.08;
        const finalScale = pulse * targetScale;
        heartMesh.scale.set(0.08 * finalScale, 0.08 * finalScale, 0.08 * finalScale);
    }

    // Draw Stars
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    ctx.fillStyle = "white";
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        if (p.y < 0) p.y = bgCanvas.height;
    });

    renderer.render(scene, camera);
}

// --- 4. QUIZ LOGIC ---
const questions = [
    { q: "Do you know how much I love you?", opts: ["A lot", "Infinity", "No🤮🤮🤮"], next: 1 },
    { q: "Favorite thing about us?", opts: ["Nothing", "Everything"], next: 2 },
    { q: "Ready for forever, Sam?", opts: ["Yes!", "Absolutely", "Never love U🤮🤮🤮"], next: null }
];
let currentQ = 0;

function showQuestion() {
    const qData = questions[currentQ];
    document.getElementById('question').innerText = qData.q;
    const opts = document.getElementById('options');
    opts.innerHTML = '';
    
    qData.opts.forEach(o => {
        const b = document.createElement('button');
        b.className = 'quiz-btn';
        b.innerText = o;
        b.onclick = () => {
            targetScale = 1.5; // Visual feedback
            setTimeout(() => targetScale = 1, 200);
            if(qData.next !== null) {
                currentQ = qData.next;
                showQuestion();
            } else {
                document.getElementById('question').innerText = "I love you Sam! ❤️";
                opts.innerHTML = '';
            }
        };
        opts.appendChild(b);
    });
}

// --- 5. START UP ---
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    document.getElementById('bg-music').play();
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
});

// Run Init
init();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
});