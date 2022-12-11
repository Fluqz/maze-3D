import * as THREE from 'three'
import { Node } from './node'





export class Node3D {

    obj: THREE.Object3D
    mesh: THREE.Mesh

    node: Node

    constructor(node?: Node) {

        this.node = node
    }

    create() : THREE.Object3D {
        
        this.obj = new THREE.Object3D()
        this.obj.name = 'node'

        // const geo = new THREE.CircleGeometry(.05, 20).rotateX(-Math.PI / 2)
        // const mat = new THREE.MeshBasicMaterial({ color: 0xFF8800, transparent: true, opacity: .3 })
        // this.mesh = new THREE.Mesh(geo, mat)
        // this.mesh.name = 'node.mesh'

        // this.obj.add(this.mesh)
        
        // this.obj.position.copy(this.node.position)

        return this.obj
    }
}