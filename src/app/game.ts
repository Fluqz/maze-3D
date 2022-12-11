
import * as THREE from 'three'

import * as Stats from 'stats.js'
import { Input } from './input'
import { Player } from './player'
import { AssetManager } from './asset-manager'
import { Utils } from './util/utils'
import { MazeGenerator } from './maze/maze'
import { Node } from './room/node'
import { Room } from './room/room'
import { Room3D } from './room/room3D'
import { Vector3 } from 'three'
import { Wall } from './room/wall'

export class Game {

    static i: Game

    public dom: HTMLElement

    public w: number
    public h: number
    public ratio: number

    public static renderer: THREE.WebGLRenderer
    public static camera: THREE.PerspectiveCamera
    public static scene: THREE.Scene

    player: Player

    private clock: THREE.Clock
    private AFID: number

    private stats: Stats

    constructor(dom: HTMLElement) {

        Game.i = this
        
        this.AFID = null
        this.clock
        this.dom = dom

        this.w = window.innerWidth
        this.h = window.innerHeight
        this.ratio = window.devicePixelRatio

        this.stats = new Stats()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        Game.renderer = new THREE.WebGLRenderer({ antialias: true })
        Game.renderer.setSize(this.w, this.h)
        Game.renderer.setClearColor(0xf4eedb)
        Game.renderer.shadowMap.enabled = true
        Game.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.dom.append(Game.renderer.domElement)
    
        Game.camera = new THREE.PerspectiveCamera(100, this.w / this.h, .1, 1000)
        Game.camera.position.set(0, 3, 0)

        Game.scene = new THREE.Scene()
        
        // Game.scene.fog = new THREE.FogExp2( 0xefd1b5, .01 );
        // Game.scene.fog = new THREE.Fog(0xf4eedb, 1, 50)

        // Cubemap
        // const cubeMap = new THREE.CubeTextureLoader()
        //     .setPath( 'assets/images/cubemap/' )
        //     .load( [
        //         'px.png',
        //         'nx.png',
        //         'py.png',
        //         'ny.png',
        //         'pz.png',
        //         'nz.png'
        // ])
        // Game.scene.background = cubeMap
        Game.scene.add(new THREE.GridHelper(1000, 1000))

        let dLight = new THREE.DirectionalLight(0xf4eedb, .8)
        dLight.position.set(50, 50, 50)
        dLight.castShadow = true
        dLight.shadow.camera.far = 200
        dLight.shadow.camera.near = .1
        dLight.shadow.camera.top = 200
        dLight.shadow.camera.bottom = -200
        dLight.shadow.camera.left = -200
        dLight.shadow.camera.right = 200
        dLight.shadow.mapSize.width = 4096
        dLight.shadow.mapSize.height = 4096
        Game.scene.add(dLight)
        Game.scene.add(new THREE.HemisphereLight(0xf4eedb, 0xf4eedb, .7))

        new Input(this.dom)
    }

    init() {
        console.log('INIT')

        this.clock = new THREE.Clock()


        this.loadAssets().then(() => {

            return new Promise((resolve) => {

                this.player = new Player(Game.camera)
                Game.scene.add(this.player.obj)

                const mg = new MazeGenerator(10, 10)
                mg.step()
        
                while(mg.stack.length > 0) {
        
                    mg.step()
                }
                mg.analyse()


                let room = new Room()
                let node1
                let node2
                let wall

                let points: Vector3[] = []
                for(let p of mg.points) {

                    node1 = room.makeNode(p)
                }


                const getNode = (p: Vector3) => {

                    for(let n of room.nodes) {

                        if(p.equals(n.position)) return n
                    }

                    return null
                }

                for(let w of mg.walls) {

                    wall = room.makeWall(getNode(w.p1), getNode(w.p2))
                }


                let room3D = new Room3D(room)
                room3D.create()
                room3D.obj.scale.set(5, 50, 5)
                Game.scene.add(room3D.obj)

                this.loop()
    
                console.log('LOADED')

                resolve(null)
            })
        })
    }

    update() {

        for(let p of Player.list) p.update(this.clock.getDelta())
    }

    loop() {

        this.stats.begin()

        this.update()

        Game.renderer.render(Game.scene, Game.camera)

        this.stats.end()

        window.cancelAnimationFrame(this.AFID)
        this.AFID = window.requestAnimationFrame(this.loop.bind(this))
    }

    loadAssets() {

        return new Promise(resolve => {

            AssetManager.onload = () => {
                console.log('Assets ready')
                resolve(null)
            }
            resolve(null)

            // AssetManager.load('https://hitpuzzle.b-cdn.net/SolSeat_VR_00075_joined2.glb')
            // AssetManager.load('https://hitpuzzle.b-cdn.net/06627.glb')
            // AssetManager.load('https://hitpuzzle.b-cdn.net/LOWPOLY1%20(1).glb')
            
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