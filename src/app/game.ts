
import * as THREE from 'three'

import { Environment } from './environment'
import { AssetManager } from './asset-manager'
import { Input } from './input'
import { Player } from './player'
import { Utils } from './util/utils'
import { GameObject } from './object'
import * as Tone from 'tone'

export class Game {

    static i: Game

    public dom: HTMLElement

    public w: number
    public h: number
    public ratio: number

    public static renderer: THREE.WebGLRenderer
    public static camera: THREE.PerspectiveCamera
    public static scene: THREE.Scene
    public static renderTarget: THREE.WebGLRenderTarget

    objects: GameObject[]

    player: Player

    env: Environment

    private clock: THREE.Clock
    private AFID: number

    constructor(dom: HTMLElement) {

        Game.i = this
        
        this.AFID = undefined
        this.clock
        this.dom = dom

        this.w = window.innerWidth
        this.h = window.innerHeight
        this.ratio = window.devicePixelRatio
    
        Game.renderer = new THREE.WebGLRenderer({ antialias: true })
        Game.renderer.setSize(this.w, this.h)
        Game.renderer.setClearColor(0xFFFFFF)
        Game.renderer.shadowMap.enabled = true
        Game.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.dom.append(Game.renderer.domElement)
    
        Game.camera = new THREE.PerspectiveCamera(100, this.w / this.h, .1, 1000)
        Game.camera.position.set(0, 3, 0)

        Game.renderTarget = new THREE.WebGLRenderTarget(this.w, this.h, {
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,

        })
    
        Game.scene = new THREE.Scene()
        // Game.scene.fog = new THREE.FogExp2( 0xefd1b5, .01 );
        Game.scene.fog = new THREE.Fog(0xFFFFFF, 5, 50)

        // Cubemap
        const cubeMap = new THREE.CubeTextureLoader()
            .setPath( 'assets/images/cubemap/' )
            .load( [
                'px.png',
                'nx.png',
                'py.png',
                'ny.png',
                'pz.png',
                'nz.png'
        ])
        // Game.scene.background = cubeMap
        // Game.scene.add(new THREE.GridHelper(1000, 1000))

        let dLight = new THREE.DirectionalLight(0xFFFFFF, .8)
        dLight.position.set(50, 50, 50)
        dLight.castShadow = true
        dLight.shadow.camera.far = 200
        dLight.shadow.camera.near = .1
        dLight.shadow.camera.top = 100
        dLight.shadow.camera.bottom = -100
        dLight.shadow.camera.left = -100
        dLight.shadow.camera.right = 100
        dLight.shadow.mapSize.width = 4096
        dLight.shadow.mapSize.height = 4096
        Game.scene.add(dLight)
        Game.scene.add(new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, .7))

        new Input(this.dom)

        this.objects = []

        this.player = undefined
        this.env = undefined

    }

    init() {
        console.log('INIT')

        this.clock = new THREE.Clock()

        this.loadAssets().then(() => {

            return new Promise((resolve) => {

                this.env = new Environment()
                this.env.create()
                Game.scene.add(this.env.obj)

                this.player = new Player(Game.camera)
                Game.scene.add(this.player.obj)


                this.loop()
    
                console.log('LOADED')

                resolve(null)
            })
        })
    }

    start() {
        
        Tone.Transport.start()

        for(let tree of this.env.trees) {

            tree.start(Tone.context.currentTime)
        }

    }

    update() {

        for(let p of Player.list) p.update(this.clock.getDelta())

        this.env.update(0)
    }

    loop() {

        window.cancelAnimationFrame(this.AFID)
        this.AFID = window.requestAnimationFrame(this.loop.bind(this))

        this.update()

        // Game.renderer.setRenderTarget(Game.renderTarget)
        // Game.renderer.render(Game.scene, Game.camera)
    
        // Game.renderer.setRenderTarget(null)
        Game.renderer.render(Game.scene, Game.camera)
    }

    loadAssets() {

        return new Promise(resolve => {

            AssetManager.onload = () => {
                console.log('RESOLVE MGMT')
                resolve(null)
            }

            AssetManager.load('https://hitpuzzle.b-cdn.net/SolSeat_VR_00075_joined2.glb')
            AssetManager.load('https://hitpuzzle.b-cdn.net/06627.glb')
            AssetManager.load('https://hitpuzzle.b-cdn.net/LOWPOLY1%20(1).glb')
            
        })
    }

    disposeAssets() {

        for(let a of AssetManager.assets.values()) {

            Utils.dispose(a.scene)
        }
    }

    resize() {

        this.w = window.innerWidth
        this.h = window.innerHeight
        this.ratio = window.devicePixelRatio

        Game.renderer.setSize(this.w, this.h)
        Game.renderer.setPixelRatio(this.ratio)

        Game.camera.aspect = this.w / this.h
        Game.camera.updateProjectionMatrix()
    }

    destroy() {

        this.disposeAssets()
    }
}