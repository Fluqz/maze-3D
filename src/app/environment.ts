import * as Tone from 'tone'
import * as THREE from 'three'
import { BoxGeometry, Group, Mesh, MeshPhongMaterial, MeshDepthMaterial, MeshNormalMaterial, Object3D, PlaneGeometry } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { AssetManager } from './asset-manager'
import { Game } from './game'
import { GameObject } from './object'
import { Tree } from './tree'
import { Utils } from './util/utils'
import { Player } from './player'


export class Environment extends GameObject {

    obj: Object3D

    trees: Tree[]

    ground: Mesh

    constructor() {
        super()


        this.trees = []
    }

    create() {

        this.obj = new Object3D()


        let ground = new Mesh(new PlaneGeometry(1000, 1000), new MeshPhongMaterial({ color: 0xEEFFFF}))
        ground.geometry.rotateX(-Math.PI / 2)
        ground.receiveShadow = true

        this.obj.add(ground)

        let geometry = new BoxGeometry(1, 25, 1)
        geometry.translate(0, 25 / 2, 0)
        let material = new MeshPhongMaterial({ color: 0x000000 })
        // let material = new MeshDepthMaterial()
        let tree: Tree

        for(let i = 0; i < 50; i++) {

            tree = new Tree(geometry, material)
            tree.create()

            tree.position.set((Math.random() * 100) - 50, 0, (Math.random() * 100) - 50)

            this.obj.add(tree.mesh)

            this.trees.push(tree)
        }
    }

    construct(): void {
        
    }

    update(delta: number) {

        this.obj.traverseVisible(o => {

            if(o instanceof Mesh) {

                o.scale.x = Math.sin(Tone.context.currentTime) + 1.5
                o.scale.y = Math.cos(Tone.context.currentTime) + 2
                o.scale.z = Math.sin(Tone.context.currentTime) + 1.5
                o.updateMatrix()
            }
        })

        for(let t of this.trees) t.update(Player.list[0].obj.position, Tone.context.currentTime)
    }

    destruct(): void {
        
        Utils.dispose(this.obj)
    }
}