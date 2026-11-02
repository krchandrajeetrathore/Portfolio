import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const canvas = document.querySelector('#bg')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))


const count = 1500
const pos = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 30
const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
const stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x00ffd0, size: 0.03 }))
scene.add(stars)


let mx = 0, my = 0
addEventListener('mousemove', (e) => {
  mx = (e.clientX / innerWidth - 0.5) * 2
  my = (e.clientY / innerHeight - 0.5) * 2
  gsap.to('.me', { rotationY: mx * 8, rotationX: -my * 8, duration: 0.6 })
})

function animate() {
  requestAnimationFrame(animate)
  stars.rotation.y += 0.0004
  camera.position.x += (mx * 0.6 - camera.position.x) * 0.05
  camera.position.y += (-my * 0.6 - camera.position.y) * 0.05
  renderer.render(scene, camera)
}
animate()


gsap.from('.hero-text > *', { y: 40, opacity: 0, duration: 1, stagger: 0.15, delay: 0.3 })
gsap.from('.me', { scale: 0.6, opacity: 0, duration: 1.2, delay: 0.5 })


gsap.utils.toArray('h3').forEach((h) => {
  gsap.from(h, {
    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: h, start: 'top 85%' }
  })
})

gsap.utils.toArray('.skill-box, .card').forEach((box) => {
  gsap.from(box, {
    x: -60, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform',
    scrollTrigger: { trigger: box, start: 'top 88%' }
  })
})

gsap.from('#about p', {
  y: 30, opacity: 0, duration: 0.9,
  scrollTrigger: { trigger: '#about', start: 'top 75%' }
})
gsap.from('#contact p.open, .contact-links a', {
  y: 30, opacity: 0, duration: 0.8, stagger: 0.15,
  scrollTrigger: { trigger: '#contact', start: 'top 70%' }
})


addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})