/**
 * ELEGANT NETWORK CONSTELLATION
 * Minimal 3D Background - Clean & Focused
 *
 * Features:
 * - Orbiting Data Nodes (spheres)
 * - Dynamic Network Connections (lines)
 * - Particle Stars
 * - Smooth animations
 * - Depth fog and atmospheric lighting
 */
import * as THREE from 'three';
// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Scene
    fogDensity: 0.015,
    fogColor: 0x0a0e1a,
    // Camera
    cameraFOV: 65,
    cameraStartZ: 40,
    cameraScrollMultiplier: 50,
    // Data Nodes
    nodeCount: 25,
    nodeOrbitRadius: 28,
    nodeSize: 0.5,
    // Particles
    starParticleCount: 3000,
    // Colors
    primaryColor: 0x64ffda, // Green
    secondaryColor: 0x8892b0, // Slate
    accentColor: 0xa8b2d1, // Light slate
    // Animation speeds
    orbitSpeed: 0.0004,
    connectionDistance: 20
};
class NetworkConstellation {
    constructor(canvasId = 'sphere-canvas') {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.scrollProgress = 0;
        this.mouse = { x: 0, y: 0 };
        // Element groups
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.init();
    }
    init() {
        if (!this.canvas)
            return;
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        // Create scene elements
        this.createStarField();
        this.createNetworkNodes();
        this.createConnections();
        this.addEventListeners();
        this.animate();
    }
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(CONFIG.fogColor, CONFIG.fogDensity);
        this.scene.background = new THREE.Color(CONFIG.fogColor);
    }
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(CONFIG.cameraFOV, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, CONFIG.cameraStartZ);
    }
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
    }
    setupLighting() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x0a0e1a, 0.5);
        this.scene.add(ambient);
        // Directional light
        const directional = new THREE.DirectionalLight(0xa8b2d1, 0.8);
        directional.position.set(10, 10, 5);
        this.scene.add(directional);
        // Accent lights
        const accentLight1 = new THREE.PointLight(CONFIG.primaryColor, 1.5, 60);
        accentLight1.position.set(-25, 10, -20);
        this.scene.add(accentLight1);
        const accentLight2 = new THREE.PointLight(CONFIG.secondaryColor, 1.2, 50);
        accentLight2.position.set(20, -10, -25);
        this.scene.add(accentLight2);
    }
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(CONFIG.starParticleCount * 3);
        const colors = new Float32Array(CONFIG.starParticleCount * 3);
        for (let i = 0; i < CONFIG.starParticleCount; i++) {
            const radius = 150 + Math.random() * 150;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            // Star colors - cool tones
            const colorChoice = Math.random();
            if (colorChoice > 0.7) {
                colors[i * 3] = 0.39;
                colors[i * 3 + 1] = 0.98;
                colors[i * 3 + 2] = 0.85; // Green
            }
            else if (colorChoice > 0.5) {
                colors[i * 3] = 0.53;
                colors[i * 3 + 1] = 0.57;
                colors[i * 3 + 2] = 0.69; // Slate
            }
            else {
                colors[i * 3] = 0.7;
                colors[i * 3 + 1] = 0.75;
                colors[i * 3 + 2] = 0.85; // Light
            }
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const starMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
        this.particles.push(stars);
    }
    createNetworkNodes() {
        const sphereGeometry = new THREE.IcosahedronGeometry(CONFIG.nodeSize, 1);
        for (let i = 0; i < CONFIG.nodeCount; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: 0x112240,
                emissive: i % 2 === 0 ? CONFIG.primaryColor : CONFIG.accentColor,
                emissiveIntensity: 0.6,
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });
            const node = new THREE.Mesh(sphereGeometry, material);
            // Orbital positioning
            const orbitAngle = (i / CONFIG.nodeCount) * Math.PI * 2;
            const orbitRadius = CONFIG.nodeOrbitRadius + (Math.random() - 0.5) * 12;
            const orbitHeight = (Math.random() - 0.5) * 35;
            node.userData = {
                orbitAngle: orbitAngle,
                orbitRadius: orbitRadius,
                orbitHeight: orbitHeight,
                orbitSpeed: CONFIG.orbitSpeed + Math.random() * 0.0003,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.8 + Math.random() * 0.4
            };
            this.updateNodePosition(node);
            this.scene.add(node);
            this.nodes.push(node);
        }
    }
    updateNodePosition(node) {
        const { orbitAngle, orbitRadius, orbitHeight } = node.userData;
        node.position.set(Math.cos(orbitAngle) * orbitRadius, orbitHeight, Math.sin(orbitAngle) * orbitRadius - 20);
    }
    createConnections() {
        // Create connections between nearby nodes
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.nodes[i].position.distanceTo(this.nodes[j].position);
                if (distance < CONFIG.connectionDistance) {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(6);
                    positions[0] = this.nodes[i].position.x;
                    positions[1] = this.nodes[i].position.y;
                    positions[2] = this.nodes[i].position.z;
                    positions[3] = this.nodes[j].position.x;
                    positions[4] = this.nodes[j].position.y;
                    positions[5] = this.nodes[j].position.z;
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    const material = new THREE.LineBasicMaterial({
                        color: CONFIG.primaryColor,
                        transparent: true,
                        opacity: 0.15,
                        blending: THREE.AdditiveBlending
                    });
                    const line = new THREE.Line(geometry, material);
                    line.userData = {
                        node1: i,
                        node2: j,
                        baseOpacity: 0.15
                    };
                    this.scene.add(line);
                    this.connections.push(line);
                }
            }
        }
    }
    addEventListeners() {
        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        });
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        const elapsedTime = this.clock.getElapsedTime();
        // Animate network nodes
        this.nodes.forEach(node => {
            node.userData.orbitAngle += node.userData.orbitSpeed;
            this.updateNodePosition(node);
            // Pulse effect
            const pulse = Math.sin(elapsedTime * node.userData.pulseSpeed + node.userData.pulsePhase) * 0.5 + 0.5;
            node.material.emissiveIntensity = 0.4 + pulse * 0.4;
        });
        // Update connections
        this.connections.forEach(line => {
            const node1 = this.nodes[line.userData.node1];
            const node2 = this.nodes[line.userData.node2];
            const positions = line.geometry.attributes.position.array;
            positions[0] = node1.position.x;
            positions[1] = node1.position.y;
            positions[2] = node1.position.z;
            positions[3] = node2.position.x;
            positions[4] = node2.position.y;
            positions[5] = node2.position.z;
            line.geometry.attributes.position.needsUpdate = true;
            // Calculate distance-based opacity
            const distance = node1.position.distanceTo(node2.position);
            const normalizedDistance = distance / CONFIG.connectionDistance;
            const pulse = Math.sin(elapsedTime * 2) * 0.5 + 0.5;
            line.material.opacity = (1 - normalizedDistance) * (line.userData.baseOpacity + pulse * 0.1);
        });
        // Rotate star field slowly
        this.particles.forEach(particleSystem => {
            particleSystem.rotation.y += 0.00005;
        });
        // Camera movement
        const targetZ = CONFIG.cameraStartZ + this.scrollProgress * CONFIG.cameraScrollMultiplier;
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;
        // Mouse parallax
        this.camera.position.x += (this.mouse.x * 3 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 2 + 5 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, -25);
        this.renderer.render(this.scene, this.camera);
    }
}
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NetworkConstellation('sphere-canvas'); // Hero section
        new NetworkConstellation('contact-canvas'); // Contact section
    });
}
else {
    new NetworkConstellation('sphere-canvas'); // Hero section
    new NetworkConstellation('contact-canvas'); // Contact section
}
//# sourceMappingURL=three-background.js.map