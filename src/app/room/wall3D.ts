import * as THREE from 'three'
import { Room3D } from './room3D'
import { Wall } from './wall'

export class Wall3D {

    static mat: THREE.Material

    obj: THREE.Object3D

    wall: Wall
    room3D: Room3D

    mesh: THREE.Mesh



    constructor(wall?: Wall, room3D?: Room3D) {

        this.wall = wall
        this.room3D = room3D
    }


    create() : THREE.Object3D {

        // if(this.obj) this.obj.children = []

        // Instantiate Object 3D
        this.obj = new THREE.Object3D()

        // LINE
        let lg = new THREE.BufferGeometry().setFromPoints([this.wall.p1, this.wall.p2])
        lg.translate(-this.wall.mid.x, this.wall.mid.y + .001, -this.wall.mid.z)
        let lm = new THREE.LineBasicMaterial({ color: 0x222222 })
        let lineM = new THREE.Line(lg, lm)
        this.obj.add(lineM)

        // EXTRUDE Line
        // Extrude line and calculate intersection points
        let vv1 = this.wall.connect1()
        let vv2 = this.wall.connect2()

        // console.log('Wall Normal', this.wall.faceNormal1)
        // console.log('Wall v1', vv1[0])
        // console.log('Wall v2', vv1[1])
        // console.log('Wall v3', vv2[0])
        // console.log('Wall v4', vv2[1])


        // Draw shape 
        let points3 = [
            this.wall.p1,
            vv1[0], // c1
            vv2[0], // c3
            this.wall.p2,
            vv2[1], // c4
            vv1[1], // c2
        ]

        // Convert from vec3 to vec2
        let points: THREE.Vector2[] = []
        for(let p of points3) points.push(new THREE.Vector2(p.x, p.z))

        // Extrude shape from 2D to 3D
        let shape = new THREE.Shape(points)
        Wall3D.mat = new THREE.MeshBasicMaterial({ 
            wireframe: false, 
            color: new THREE.Color(this.room3D.room.getRndColor()) ,
        })
        let extrude = new THREE.ExtrudeGeometry(shape, {
            steps: 1,
            depth: this.wall.h,
            bevelEnabled: false,
        })
        extrude.rotateX(Math.PI / 2)
        extrude.translate(-this.wall.mid.x, this.wall.mid.y, -this.wall.mid.z)
        let mesh = new THREE.Mesh(extrude, Wall3D.mat)
        extrude.computeVertexNormals()

        this.obj.add(mesh)

        this.obj.position.copy(this.wall.mid)



        // // HELPERS

        // // let rndC1 = this.room3D.room.getRndColor()
        // // let rndC2 = this.room3D.room.getRndColor()

        // // NORMALS and points
        // this.createPoint(points3[0].clone(), 0xFF00FF)
        // this.createPoint(points3[1].clone(), 0xFF00FF)
        // this.createPoint(points3[2].clone(), 0xFF00FF)
        // this.createPoint(points3[3].clone(), 0xFF00FF)
        // this.createPoint(points3[4].clone(), 0xFF00FF)
        // this.createPoint(points3[5].clone(), 0xFF00FF)

        // // 1
        // this.createNormalLine(this.wall.faceNormal1.clone(), this.wall.mid, 0x00FF00)

        // // 2
        // this.createNormalLine(this.wall.faceNormal2.clone(), this.wall.mid, 0xFF0000)

        return this.obj
    }


    /** Helper line */
    createNormalLine(dir, p1, color) {
        
        dir.multiplyScalar(.5)
        let p2 = new THREE.Vector3().copy(p1)
        p2.add(dir)

        let geo = new THREE.BufferGeometry().setFromPoints([p1, p2])
        // geo.translate(-this.wall.mid.x, -this.wall.mid.y, -this.wall.mid.z)
        let material = new THREE.LineBasicMaterial({ color: color })
        let normalLine = new THREE.Line(geo, material)
        this.room3D.obj.add(normalLine)

        return normalLine
    }

    /** Helper point */
    createPoint(p1, color, size = .008) {
        
        const geo = new THREE.SphereGeometry(size, 20, 20)
        const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: .7 })
        let m = new THREE.Mesh(geo, mat)
        m.name = 'v'

        this.room3D.obj.add(m)
        
        m.position.copy(p1)
        m.position.y = this.wall.h
        m.updateMatrix()

        return m
    }



    connect() {

        // let vv1 = this.wall.connect1()
        // let vv2 = this.wall.connect2()

        // for(let v of vv1) {

        //     this.createPoint(v.clone(), 0x00FFF6)
        //     // this.createNormalLine(v.clone(), this.wall.p1)
        // }

        // for(let v of vv2) {

        //     this.createPoint(v.clone(), 0x60FFF6)
        //     // this.createNormalLine(v.clone(), this.wall.p2)
        // }
    }
}