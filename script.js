// --- 1. START SCREEN & AUDIO ---
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const bgMusic = document.getElementById('bg-music');

startBtn.addEventListener('click', () => {
    startScreen.style.opacity = '0';
    setTimeout(() => startScreen.remove(), 1000);
    bgMusic.play();
});

// --- 2. THREE.JS 3D CRYSTAL HEART ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create Heart Shape
const x = 0, y = 0;
const heartShape = new THREE.Shape();
heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7, x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };
const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
geometry.center(); 
geometry.rotateZ(Math.PI);
geometry.scale(0.15, 0.15, 0.15);

// Interactive Colors
const heartColors = [0xff4da6, 0xff0000, 0x9400d3, 0xffffff];
let currentColorIndex = 0;

const material = new THREE.MeshPhongMaterial({
    color: heartColors[currentColorIndex],
    emissive: 0x220011,
    shininess: 200,
    flatShading: true
});

const heartMesh = new THREE.Mesh(geometry, material);
scene.add(heartMesh);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 5);
scene.add(directionalLight);

camera.position.z = 7;

// --- 3. INTERACTION LOGIC (Mouse & Click) ---
let mouseX = 0;
let mouseY = 0;
let targetScale = 1;

window.addEventListener('mousemove', (event) => {
    // Calculate mouse position relative to center (-1 to 1)
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('mousedown', () => {
    // 1. Change color on click
    currentColorIndex = (currentColorIndex + 1) % heartColors.length;
    heartMesh.material.color.setHex(heartColors[currentColorIndex]);
    
    // 2. Immediate Pulse
    targetScale = 1.8;
    setTimeout(() => targetScale = 1, 200);

    // 3. Create a burst of phrases/particles
    for(let i = 0; i < 5; i++) {
        setTimeout(createFloatingPhrase, i * 100);
    }
});

// --- 4. BACKGROUND PARTICLES & FLOWING TEXT ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 150; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
        color: '#ffb6c1'
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        if (p.y < -10) p.y = canvas.height + 10;
    });
}

const lovePhrases = ["I love Sam", "Sam + Me", "Forever", "You're my world", "❤️", "My Crystal Heart"];

function createFloatingPhrase() {
    if(startScreen.style.opacity !== '0') return; 
    const phraseEl = document.createElement("div");
    phraseEl.classList.add("floating-phrase");
    phraseEl.innerText = lovePhrases[Math.floor(Math.random() * lovePhrases.length)];
    phraseEl.style.left = `${Math.floor(Math.random() * 80) + 10}vw`;
    document.body.appendChild(phraseEl);
    setTimeout(() => { phraseEl.remove(); }, 8000);
}
setInterval(createFloatingPhrase, 2500);

// --- 5. ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // Interaction 1: Heart follows mouse slightly
    heartMesh.rotation.y += 0.01 + (mouseX * 0.05);
    heartMesh.rotation.x = (mouseY * 0.5);

    // Interaction 2: Smooth Heartbeat + Click Pulse
    const time = Date.now() * 0.003;
    const basePulse = 1 + Math.sin(time) * 0.08; 
    const finalScale = basePulse * targetScale;
    heartMesh.scale.set(finalScale, finalScale, finalScale);

    drawParticles();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});