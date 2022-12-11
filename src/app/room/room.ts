import { connected } from 'process';
import * as THREE from 'three';
import { Node } from './node';
import { Node3D } from './node3D';
import { Wall } from './wall';


export class Room {

    nodes: Node[]
    walls: Wall[]


    constructor() {

        this.nodes = []
        this.walls = []
    }

    /** Create a new Node */
    makeNode(vec: THREE.Vector3, connectTo?: Node) : Node {

        const node = new Node(vec)

        this.nodes.push(node)

        return node
    }
    
    /** Link connected nodes to each other */
    connectNodes(n1: Node, n2: Node) {

        n1.connect(n2)
        n2.connect(n1)
    }

    /** Delete node */
    deleteNode(node: Node) : boolean {

        const i = this.nodes.indexOf(node)

        if(i == -1) return false

        this.nodes.splice( i, 1 )

        return true
    }
    
    /** Make new Wall from two Nodes */
    makeWall(n1: Node, n2: Node) {

        this.connectNodes(n1, n2)

        let wall = new Wall(n1, n2, this)

        this.walls.push(wall)

        return wall
    }
    
    /** Remove wall from Room */
    removeWall(n1: Node, n2: Node) {

        let wall = new Wall(n1, n2, this)

        this.walls.push(wall)
    }
    
    /** Find wall with p1 and p2 */
    getWallByNodes(n1: Node, n2: Node) {

        for(let w of this.walls) {

            if(w.node1 === n1 && w.node2 === n2 || w.node1 === n2 && w.node2 === n1)
                return w
        }
        
        return null
    }

    getRndColor() {

        return '#' + Math.floor(Math.random()*16777215).toString(16)
    }
}