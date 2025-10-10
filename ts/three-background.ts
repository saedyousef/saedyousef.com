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

type StarLayer = {
    mesh: THREE.Points;
    rotationSpeed: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    baseSize: number;
    baseOpacity: number;
};

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Scene
    fogDensity: 0.006,
    fogColor: 0x0a0e1a,
    
    // Camera
    cameraFOV: 65,
    cameraStartZ: 40,
    cameraScrollMultiplier: 50,
    
    // Data Nodes
    nodeCount: 40,
    nodeOrbitRadius: 24,
    nodeSize: 0.5,
    
    // Particles
    starParticleCount: 8000,
    
    // Colors
    primaryColor: 0x64ffda,      // Green
    secondaryColor: 0x8892b0,    // Slate
    accentColor: 0xa8b2d1,       // Light slate
    
    // Animation speeds
    orbitSpeed: 0.0004,
    connectionDistance: 26
};

class NetworkConstellation {
    private canvas: HTMLElement | null;
    private scene: any;
    private camera: any;
    private renderer: any;
    private clock: any;
    private scrollProgress: number;
    private mouse: { x: number; y: number };
    private nodes: any[];
    private connections: any[];
    private particles: StarLayer[];

    constructor(canvasId: string = 'sphere-canvas') {
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
        if (!this.canvas) return;
        
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
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.cameraFOV,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, CONFIG.cameraStartZ);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas as HTMLCanvasElement,
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
        const layers = [
            {
                count: Math.floor(CONFIG.starParticleCount * 0.4),
                minRadius: 90,
                maxRadius: 160,
                size: 0.28,
                opacity: 1,
                rotationSpeed: 0.00012,
                twinkleSpeed: 1.05
            },
            {
                count: Math.floor(CONFIG.starParticleCount * 0.35),
                minRadius: 160,
                maxRadius: 260,
                size: 0.22,
                opacity: 0.85,
                rotationSpeed: 0.00008,
                twinkleSpeed: 0.8
            },
            {
                count: Math.floor(CONFIG.starParticleCount * 0.2),
                minRadius: 260,
                maxRadius: 380,
                size: 0.16,
                opacity: 0.6,
                rotationSpeed: 0.00004,
                twinkleSpeed: 0.55
            }
        ];

        layers.forEach(layerConfig => {
            const starLayer = this.generateStarLayer(layerConfig);
            this.scene.add(starLayer.mesh);
            this.particles.push(starLayer);
        });
    }

    private generateStarLayer(layerConfig: {
        count: number;
        minRadius: number;
        maxRadius: number;
        size: number;
        opacity: number;
        rotationSpeed: number;
        twinkleSpeed: number;
    }): StarLayer {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(layerConfig.count * 3);
        const colors = new Float32Array(layerConfig.count * 3);

        for (let i = 0; i < layerConfig.count; i++) {
            const radius = layerConfig.minRadius + Math.random() * (layerConfig.maxRadius - layerConfig.minRadius);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            const colorChoice = Math.random();
            if (colorChoice > 0.75) {
                colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0; // bright white
            } else if (colorChoice > 0.4) {
                colors[i * 3] = 0.75; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.9; // cyan tint
            } else {
                colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.82; colors[i * 3 + 2] = 1.0; // blue tint
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: layerConfig.size,
            vertexColors: true,
            transparent: true,
            opacity: layerConfig.opacity,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        material.depthWrite = false;
        material.needsUpdate = true;

        const mesh = new THREE.Points(geometry, material);
        mesh.renderOrder = -20;

        return {
            mesh,
            rotationSpeed: layerConfig.rotationSpeed,
            twinkleSpeed: layerConfig.twinkleSpeed,
            twinkleOffset: Math.random() * Math.PI * 2,
            baseSize: layerConfig.size,
            baseOpacity: layerConfig.opacity
        };
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

    updateNodePosition(node: any): void {
        const { orbitAngle, orbitRadius, orbitHeight } = node.userData;
        node.position.set(
            Math.cos(orbitAngle) * orbitRadius,
            orbitHeight,
            Math.sin(orbitAngle) * orbitRadius - 20
        );
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

        // Rotate and twinkle star layers
        this.particles.forEach(layer => {
            layer.mesh.rotation.y += layer.rotationSpeed;

            const materialCandidate = Array.isArray(layer.mesh.material)
                ? layer.mesh.material[0]
                : layer.mesh.material;
            const material = materialCandidate as THREE.PointsMaterial | undefined;

            if (material) {
                const twinkle = (Math.sin(elapsedTime * layer.twinkleSpeed + layer.twinkleOffset) + 1) * 0.5;
                const opacity = layer.baseOpacity * (0.6 + twinkle * 0.6);
                const size = layer.baseSize * (0.85 + twinkle * 0.35);

                material.opacity = Math.min(1, Math.max(0.1, opacity));
                material.size = Math.max(0.05, size);
                material.needsUpdate = true;
            }
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
        new NetworkConstellation('sphere-canvas');  // Hero section
        new NetworkConstellation('contact-canvas'); // Contact section
    });
} else {
    new NetworkConstellation('sphere-canvas');  // Hero section
    new NetworkConstellation('contact-canvas'); // Contact section
}
