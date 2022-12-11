import * as THREE from 'three'
import { Node } from './node'
import { Node3D } from './node3D'
import { Room } from './room'
import { Wall } from './wall'
import { Wall3D } from './wall3D'





export class Room3D {

    obj: THREE.Object3D

    room: Room

    walls: Wall3D[] = []
    nodes: Node3D[] = []
    

    constructor(room: Room) {

        this.room = room

        this.obj = new THREE.Object3D()
        this.obj.name = 'room'
    }

    /** Create 3D Room */
    create() {

        this.room.nodes.forEach(node => {

            this.addNode(node)
        })

        this.room.walls.forEach(Wall => {

            this.addWall(Wall)
        })
    }

    update() {

        let i = 0
        for(let w of this.room.walls) {

            this.walls[i].wall = w

            if(this.walls.length > i) this.addWall(w)

            i++
        }

        if(this.walls.length > this.room.walls.length) this.walls.splice(this.room.walls.length, this.walls.length - this.room.walls.length)

        this.connectWalls()
    }


    connectWalls() {
        
        this.walls.forEach(wall => {
            wall.create()
        })
    }

    /** Add Node view */
    addNode(node: Node) : Node3D {

        let n = new Node3D()
        n.node = node

        this.obj.add(n.create())

        n.obj.position.y = 2.001

        this.nodes.push(n)

        return n
    } 

    /** Add Wall view */
    addWall(wall: Wall) {
        
        let w3D = new Wall3D(wall, this)

        this.obj.add(w3D.create())

        this.walls.push(w3D)

        this.connectWalls()
    }

    get3DByWall(wall: Wall) : Wall3D {

        for(let w of this.walls) {
            if(w.wall == wall) return w
        }

        return null
    }
    
    public getNodeBy3D = (obj: THREE.Object3D) => { 

        for(let n of this.nodes) {

            if(n.obj.id === obj.id) return n
        }
    }
    public getWallBy3D = (obj: THREE.Object3D) => { 

        for(let w of this.walls) {

            if(w.obj.id === obj.id) return w
        }
    }
}