import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const canvas = document.querySelector('#bg')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
camera.position.z = 6

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

// ---------- Cloud network background ----------
const N = innerWidth < 700 ? 40 : 80
const LIMIT = { x: 11, y: 7, z: 3 }
const nodes = []
for (let i = 0; i < N; i++) {
  nodes.push({
    x: (Math.random() - 0.5) * LIMIT.x * 2,
    y: (Math.random() - 0.5) * LIMIT.y * 2,
    z: (Math.random() - 0.5) * LIMIT.z * 2,
    vx: (Math.random() - 0.5) * 0.008,
    vy: (Math.random() - 0.5) * 0.008,
    vz: (Math.random() - 0.5) * 0.004,
  })
}

const nodePos = new Float32Array(N * 3)
const nodeGeo = new THREE.BufferGeometry()
nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3))
scene.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({ color: 0x00ffd0, size: 0.09 })))

const linePos = new Float32Array(N * N * 6)
const lineGeo = new THREE.BufferGeometry()
lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
scene.add(new THREE.LineSegments(
  lineGeo,
  new THREE.LineBasicMaterial({ color: 0xb061ff, transparent: true, opacity: 0.3 })
))

function updateNetwork() {
  let v = 0
  for (let i = 0; i < N; i++) {
    const a = nodes[i]
    a.x += a.vx; a.y += a.vy; a.z += a.vz
    if (Math.abs(a.x) > LIMIT.x) a.vx *= -1
    if (Math.abs(a.y) > LIMIT.y) a.vy *= -1
    if (Math.abs(a.z) > LIMIT.z) a.vz *= -1
    nodePos[i * 3] = a.x; nodePos[i * 3 + 1] = a.y; nodePos[i * 3 + 2] = a.z

    for (let j = i + 1; j < N; j++) {
      const b = nodes[j]
      const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
      if (dx * dx + dy * dy + dz * dz < 6) {
        linePos[v++] = a.x; linePos[v++] = a.y; linePos[v++] = a.z
        linePos[v++] = b.x; linePos[v++] = b.y; linePos[v++] = b.z
      }
    }
  }
  nodeGeo.attributes.position.needsUpdate = true
  lineGeo.attributes.position.needsUpdate = true
  lineGeo.setDrawRange(0, v / 3)
}

// ---------- Mouse ----------
let mx = 0, my = 0
addEventListener('mousemove', (e) => {
  mx = (e.clientX / innerWidth - 0.5) * 2
  my = (e.clientY / innerHeight - 0.5) * 2
  gsap.to('.me', { rotationY: mx * 8, rotationX: -my * 8, duration: 0.6 })
})

function animate() {
  requestAnimationFrame(animate)
  updateNetwork()
  camera.position.x += (mx * 0.8 - camera.position.x) * 0.05
  camera.position.y += (-my * 0.8 - camera.position.y) * 0.05
  camera.lookAt(0, 0, 0)
  renderer.render(scene, camera)
}
animate()

// ---------- Intro + scroll animations ----------
gsap.from('.hero-text > *', { y: 40, opacity: 0, duration: 1, stagger: 0.15, delay: 0.3 })
gsap.from('.me', { scale: 0.6, opacity: 0, duration: 1.2, delay: 0.5 })

gsap.utils.toArray('h3').forEach((h) => {
  gsap.from(h, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: h, start: 'top 85%' } })
})
gsap.utils.toArray('.skill-box, .card').forEach((box) => {
  gsap.from(box, { x: -100, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform',
    scrollTrigger: { trigger: box, start: 'top 88%' } })
})
gsap.from('.about-text', { y: 30, opacity: 0, duration: 0.9,
  scrollTrigger: { trigger: '#about', start: 'top 75%' } })
gsap.from('#contact p.open, .tile', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, clearProps: 'transform',
  scrollTrigger: { trigger: '#contact', start: 'top 70%' } })

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})