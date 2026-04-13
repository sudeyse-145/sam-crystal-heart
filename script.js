// --- 1. CONFIGURATION & DATA ---
const questions = [
    { 
        q: "First things first... do you know who this is for?", 
        opts: ["Me? (Sam)", "The most special girl"], 
        next: 1 
    },
    { 
        q: "What's our 'vibe' as a couple?", 
        opts: ["Total chaos", "Pure romance", "Best girl-friend"], 
        next: 2 
    },
    { 
        q: "If I could give you anything right now, what would it be?", 
        opts: ["A huge hug", "A million kisses", "The whole world"], 
        next: 3 
    },
    { 
        q: "Will you stay by my side through everything?", 
        opts: ["Yes", "Always & Forever"], 
        next: 4 
    },
    { 
        q: "Did this crystal heart make you smile today?", 
        opts: ["Yes, a lot!", "It's perfect"], 
        next: null 
    }
];

let scene, camera, renderer, heartMesh;
let currentQ = 0;
let targetScale = 1;
const particles = [];
const bgCanvas = document.getElementById('bg-canvas');
const ctx = bgCanvas.getContext('2d');

// --- 2. THE 3D ENGINE (THREE.JS) ---
function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create the Crystal Heart Geometry
    const shape = new THREE.Shape();
    shape.moveTo(25, 25);
    shape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    shape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    shape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    shape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    shape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    shape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateZ(Math.PI); 

    const material = new THREE.MeshPhongMaterial({
        color: 0xff4da6,
        emissive: 0x220011,
        shininess: 100,
        flatShading: true // Gives it the crystal look
    });

    heartMesh = new THREE.Mesh(geometry, material);
    
    // Adaptive scaling for mobile
    const startScale = window.innerWidth < 600 ? 0.07 : 0.1;
    heartMesh.scale.set(startScale, startScale, startScale);
    scene.add(heartMesh);

    // Lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 5);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Initialize Particles
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.4 + 0.1
        });
    }

    animate();
}

// --- 3. ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    if (heartMesh) {
        heartMesh.rotation.y += 0.012; // Slow elegant spin
        
        // Pulse logic
        const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.08;
        const finalScale = pulse * targetScale;
        const baseSize = window.innerWidth < 600 ? 0.07 : 0.1;
        heartMesh.scale.set(baseSize * finalScale, baseSize * finalScale, baseSize * finalScale);
    }

    // Draw Background
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        if (p.y < 0) p.y = bgCanvas.height;
    });

    renderer.render(scene, camera);
}

// --- 4. INTERACTIVE QUIZ LOGIC ---
function showQuestion() {
    const qData = questions[currentQ];
    const qText = document.getElementById('question');
    const optsDiv = document.getElementById('options');
    
    qText.innerText = qData.q;
    optsDiv.innerHTML = '';
    
    qData.opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            // Heart reacts to click
            targetScale = 1.4;
            setTimeout(() => targetScale = 1, 250);

            if (qData.next !== null) {
                currentQ = qData.next;
                showQuestion();
            } else {
                qText.innerText = "I love you more than words can say, Sam! ❤️";
                optsDiv.innerHTML = '';
            }
        };
        optsDiv.appendChild(btn);
    });
}

// --- 5. EVENT LISTENERS ---
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('bg-music').play();
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
});

window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    bgCanvas.width = w;
    bgCanvas.height = h;
});

// Launch!
initThreeJS();