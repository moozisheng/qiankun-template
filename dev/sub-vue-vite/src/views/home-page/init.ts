import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { fragmentshader, vertexshader } from './shader'
import { create3DText } from './createText'

export function init() {
  const SEPARATION = 100,
    AMOUNTX = 100,
    AMOUNTY = 100

  let container: HTMLDivElement
  let stats: Stats
  let camera: THREE.PerspectiveCamera
  let scene: THREE.Scene
  let renderer: THREE.WebGLRenderer

  let particles: THREE.Points
  let count = 0

  // let mouseX = 0,
  //   mouseY = 0

  let windowHalfX = window.innerWidth / 2
  let windowHalfY = window.innerHeight / 2

  init()
  animate()

  function init() {
    console.log('---------')

    scene = new THREE.Scene()
    stats = new Stats()
    container = createContainer()

    // //环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 5)
    ambientLight.name = 'ambientLight'
    scene.add(ambientLight)

    camera = createCamera()

    renderer = createRenderer(container)

    //
    createParticles(scene)

    create3DText(scene, 'web3D')

    window.addEventListener('resize', onWindowResize)
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onPointerMove(event: PointerEvent) {
    if (event.isPrimary === false) return

    mouseX = event.clientX - windowHalfX
    mouseY = event.clientY - windowHalfY
  }

  function animate() {
    requestAnimationFrame(animate)

    render()
    stats.update()
  }

  function render() {
    // camera.position.x += (mouseX - camera.position.x) * 0.05
    // camera.position.y += (-mouseY - camera.position.y) * 0.05
    // camera.lookAt(scene.position)

    const positions = particles.geometry.attributes.position.array
    const scales = particles.geometry.attributes.scale.array

    let i = 0,
      j = 0

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50

        scales[j] =
          (Math.sin((ix + count) * 0.3) + 1) * 20 + (Math.sin((iy + count) * 0.5) + 1) * 20

        i += 3
        j++
      }
    }

    particles.geometry.attributes.position.needsUpdate = true
    particles.geometry.attributes.scale.needsUpdate = true

    renderer.render(scene, camera)

    count += 0.1
  }

  function createContainer() {
    const container = document.createElement('div')
    document.body.appendChild(container)

    container.className = 'canvas-contaienr'
    container.style.touchAction = 'none'
    container.style.position = 'fixed'
    container.style.top = '0'
    // container.addEventListener('pointermove', onPointerMove)
    return container
  }
  function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 1000
    camera.position.y = 100
    // camera.position.set(-0.08422296247933674, 3.114500890270524, 10.881942432628843)

    const lookAt = new THREE.Vector3(0, 2, 0)
    camera.lookAt(lookAt)
    return camera
  }

  function createRenderer(container: HTMLDivElement) {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)
    return renderer
  }

  function createParticles(scene: THREE.Scene) {
    const numParticles = AMOUNTX * AMOUNTY

    const positions = new Float32Array(numParticles * 3)
    const scales = new Float32Array(numParticles)

    let i = 0,
      j = 0

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2 // x
        positions[i + 1] = 0 // y
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2 // z

        scales[j] = 1

        i += 3
        j++
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) }
      },
      vertexShader: vertexshader,
      fragmentShader: fragmentshader
    })

    particles = new THREE.Points(geometry, material)
    particles.rotateX(Math.PI / 10)
    scene.add(particles)
  }
}
