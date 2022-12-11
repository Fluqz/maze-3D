
import * as THREE from 'three'
import { Node } from './node'
import { Room } from './room'



/** WALL COORDINATES
 *                               n2  
 * |e2____________________________|_______________________________  e4
 * |                                                              |
 * |0 p1__________________________________________________________| p2__________________________ X
 * |                                                              |
 * |______________________________________________________________|
 * |e1                            |                                 e3
 * |                              n1
 * |
 * |e = Extrude 
 * |n = Normal
 * |
 * Z 
 */

export class Wall {

    static uid:number = 0

    id:number

    /** Corner 1 */
    node1: Node
    /** Corner 1 */
    node2: Node

    /** Left Bottom corner */
    v1: THREE.Vector3
    /** Left Top corner */
    v2: THREE.Vector3
    /** Right Bottom corner */
    v3: THREE.Vector3
    /** Right Top corner */
    v4: THREE.Vector3

    prevWall: Wall
    nextWall: Wall

    /** THREE Math line class */
    line: THREE.Line3

    /** Bottom normal */
    faceNormal1: THREE.Vector3
    /** Top normal */
    faceNormal2: THREE.Vector3

    room: Room

    constructor(c1: Node, c2: Node, room?: Room) {

        this.id = Wall.uid++

        this.node1 = c1
        this.node2 = c2
        this.room = room
        
        this.line = new THREE.Line3(c1.position.clone(), c2.position.clone())

        this.v1 = new THREE.Vector3()
        this.v2 = new THREE.Vector3()
        this.v3 = new THREE.Vector3()
        this.v4 = new THREE.Vector3()
        this.faceNormal1 = new THREE.Vector3()
        this.faceNormal2 = new THREE.Vector3()

        this.computeNormals()
    }

    get w() { return this.node1.position.distanceTo(this.node2.position) }
    get h() { return .2 }
    get d() { return .1 }

    get p1() { return this.node1.position }
    get p2() { return this.node2.position }

    /** Middle of p1 and p2 */
    get mid() {

        let x = (this.node1.position.x + this.node2.position.x) / 2
        let y = this.h / 2
        let z = (this.node1.position.z + this.node2.position.z) / 2

        return new THREE.Vector3(x, y, z)
    }
    
    /** Offsets vector3 in normal direction */
    public translateVec = (() => {

        let v = new THREE.Vector3()
        let v2 = new THREE.Vector3()

        return (p: THREE.Vector3, normal: THREE.Vector3, offset: number) => { 

            v.copy(p)
            v2.copy(normal)
            v2.multiplyScalar(offset)
            v.add(v2)

            p.copy(v)

            return p
        }
    })()
    
    /** Return the angle starting at x = 1 */
    public get angle() {  return this.computeAngle(this.p1, this.p2) } // DO SAME AS IN COMPUTE DEGREE DIFFERENCE

    /** Calculate angle between two points along the X axis  ( |/____ = 45 deg ) */
    public computeAngle = (p1: THREE.Vector3, p2: THREE.Vector3) => {

        return Math.atan2(p2.z - p1.z, p2.x - p1.x)
    }

    public get2LineIntersectionPoint(p1: THREE.Vector2, p2: THREE.Vector2, p3: THREE.Vector2, p4: THREE.Vector2) {

        // Check if none of the lines are of length 0
        if ((p1.x === p2.x && p1.y === p2.y) || (p3.x === p4.x && p3.y === p4.y)) {
            return null
        }
    
        let denominator = ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y))
      
        // Lines are parallel
        if (denominator === 0) {
            return null
        }
    
        let ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator
        let ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator
    
        // is the intersection along the segments
        //   if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        //       return null
        //   }
      
        // Return a object with the x and y coordinates of the intersection
        let x = p1.x + ua * (p2.x - p1.x)
        let y = p1.y + ua * (p2.y - p1.y)

        //   console.log('ip', x, y)
        return new THREE.Vector2(x, y)
    }


    /** Returns the intersection points of node1 for this wall */
    private tmp1: THREE.Vector3 = new THREE.Vector3()
    private tmp2: THREE.Vector3 = new THREE.Vector3()
    private tmp3: THREE.Vector3 = new THREE.Vector3()
    private tmp4: THREE.Vector3 = new THREE.Vector3()
    public connect1() {

        this.computeNormals()

        let walls: Wall[] = []

        if(this.node1.nodes.length === 0) return null
        else if(this.node1.nodes.length === 1) {
            // Draw free standing side of wall -> rectangular
            this.translateVec(this.v1.copy(this.p1), this.faceNormal1, this.d / 2)
            this.translateVec(this.v2.copy(this.p1), this.faceNormal2, this.d / 2)
            return [this.v1, this.v2]
        }
        else if(this.node1.nodes.length > 1) {

            // console.log('Multiple connections 1', this.node1)

            // Connect
            // Filter all walls connected to node2 & sort by angle
            walls = this.room.walls.filter((w:Wall) => w.getOpposite(this.node1) != null)
            walls.sort((a:Wall, b:Wall) => { 

                return this.computeAngle(this.node1.position, a.getOpposite(this.node1).position) - this.computeAngle(this.node1.position, b.getOpposite(this.node1).position)
            })

            // Get left and right
            let i = walls.indexOf(this)
            let w1 = walls[i === walls.length - 1 ? 0 : i + 1] // Wall above
            let w2 = walls[i === 0 ? walls.length - 1 : i - 1] // Wall below

            // console.log('wall angle from node', this.computeAngle(this.node1.position, this.getOpposite(this.node1).position), this.p1, this.p2)
            // walls.forEach(w => console.log('sorted wall angle 1', w.id, this.computeAngle(this.node1.position, w.getOpposite(this.node1).position)))
            // console.log(this.id, w1.id, w2.id)

            // Create two lines from 4 points to calculate the intersection point of one side of this wall and one of w1
            // Side 1 is the positive normal side. 
            let ps3: THREE.Vector3[]
            if(this.node1 === w1.node1) {

                ps3 = [
                    this.translateVec(this.tmp1.copy(this.getOpposite(this.node1).position), this.faceNormal1, this.d / 2),
                    this.translateVec(this.tmp2.copy(this.node1.position), this.faceNormal1, this.d / 2),
                    w1.translateVec(this.tmp3.copy(this.node1.position), w1.faceNormal2, this.d / 2),
                    w1.translateVec(this.tmp4.copy(w1.getOpposite(this.node1).position), w1.faceNormal2, this.d / 2),
                ]
            }
            else {
                
                ps3 = [
                    this.translateVec(this.tmp1.copy(this.getOpposite(this.node1).position), this.faceNormal1, this.d / 2),
                    this.translateVec(this.tmp2.copy(this.node1.position), this.faceNormal1, this.d / 2),
                    w1.translateVec(this.tmp3.copy(this.node1.position), w1.faceNormal1, this.d / 2),
                    w1.translateVec(this.tmp4.copy(w1.getOpposite(this.node1).position), w1.faceNormal1, this.d / 2),
                ]
            }

            // convert from vec3 to vec2
            let ps2: THREE.Vector2[] = []
            for(let p of ps3) ps2.push(new THREE.Vector2(p.x, p.z))

            // Calculate the intersection point
            let ip = this.get2LineIntersectionPoint(ps2[0], ps2[1], ps2[2], ps2[3])
            // If ip is null -> lines are parallel -> set to rectangular shape and use the extruded points instead
            if(ip === null) this.v1.copy(this.translateVec(this.tmp1.copy(this.node1.position), this.faceNormal1, this.d / 2))
            else this.v1.set(ip.x, 0, ip.y)


            // Create two lines from 4 points to calculate the intersection point of one side of this wall and one of w2
            // Side 2 is the negated normal side
            if(this.node1 === w2.node1) {

                ps3 = [

                    this.translateVec(this.tmp1.copy(this.getOpposite(this.node1).position), this.faceNormal2, this.d / 2),
                    this.translateVec(this.tmp2.copy(this.node1.position), this.faceNormal2, this.d / 2),
                    w2.translateVec(this.tmp3.copy(this.node1.position), w2.faceNormal1, this.d / 2),
                    w2.translateVec(this.tmp4.copy(w2.getOpposite(this.node1).position), w2.faceNormal1, this.d / 2)
                ]
            }
            else {

                ps3 = [

                    this.translateVec(this.tmp1.copy(this.getOpposite(this.node1).position), this.faceNormal2, this.d / 2),
                    this.translateVec(this.tmp2.copy(this.node1.position), this.faceNormal2, this.d / 2),
                    w2.translateVec(this.tmp3.copy(this.node1.position), w2.faceNormal2, this.d / 2),
                    w2.translateVec(this.tmp4.copy(w2.getOpposite(this.node1).position), w2.faceNormal2, this.d / 2)
                ]
            }

            // Convert from vec3 to vec2
            ps2 = []
            for(let p of ps3) ps2.push(new THREE.Vector2(p.x, p.z))

            // Calculate intersection point
            ip = this.get2LineIntersectionPoint(ps2[0], ps2[1], ps2[2], ps2[3])

            // If ip is null -> lines are parallel -> set to rectangular shape and use the extruded points instead
            if(ip === null) this.v2.copy(this.translateVec(this.tmp1.copy(this.node1.position), this.faceNormal2, this.d / 2))
            else this.v2.set(ip.x, 0, ip.y)

            return [this.v1, this.v2]
        }
    }

    /** Returns the intersection points of node2 for this wall */
    public connect2() {

        this.computeNormals()

        let walls: Wall[] = []

        if(this.node2.nodes.length === 0) return null
        else if(this.node2.nodes.length === 1) {
            // Draw free standing side of wall -> rectangular
            this.v3.copy(this.translateVec(this.tmp1.copy(this.p2), this.faceNormal1, this.d / 2))
            this.v4.copy(this.translateVec(this.tmp2.copy(this.p2), this.faceNormal2, this.d / 2))
            return [this.v3, this.v4]
        }
        else if(this.node2.nodes.length > 1) {

            // console.log('Multiple connections 2', this.node2)
            // Connect
            // Filter all walls connected to node2 & sort by angle starting from node2
            walls = this.room.walls.filter((w:Wall) => w.getOpposite(this.node2) != null)
            walls.sort((a:Wall, b:Wall) => { 
                
                return this.computeAngle(this.node2.position, a.getOpposite(this.node2).position) - this.computeAngle(this.node2.position, b.getOpposite(this.node2).position)
            })

            // Get neighboured walls
            let i = walls.indexOf(this)
            let w1 = walls[i === 0 ? walls.length - 1 : i - 1] // Wall below
            let w2 = walls[i === walls.length - 1 ? 0 : i + 1] // Wall above

            // console.log('wall angle from node', this.computeAngle(this.node2.position, this.getOpposite(this.node2).position), this.p1, this.p2)
            // walls.forEach(w => console.log('sorted wall angle 2', w.id, this.computeAngle(this.node2.position, w.getOpposite(this.node2).position)))
            // console.log(this.id, w1.id, w2.id)

            // Create two lines from 4 points to calculate the intersection point of one side of this wall and one of w1
            // Side 1 is the positive normal side.
            let ps3: THREE.Vector3[]
            if(this.node2 === w1.node2) {

                ps3 = [
                    this.translateVec(this.tmp1.copy(this.getOpposite(this.node2).position), this.faceNormal1, this.d / 2),
                    this.translateVec(this.tmp2.copy(this.node2.position), this.faceNormal1, this.d / 2),
                    w1.translateVec(this.tmp3.copy(this.node2.position), w1.faceNormal2, this.d / 2),
                    w1.translateVec(this.tmp4.copy(w1.getOpposite(this.node2).position), w1.faceNormal2, this.d / 2),
                ]
            }
            else {
                
                ps3 = [
                    this.translateVec(this.tmp1.copy(this.getOpposite(this.node2).position), this.faceNormal1, this.d / 2),
                    this.translateVec(this.tmp2.copy(this.node2.position), this.faceNormal1, this.d / 2),
                    w1.translateVec(this.tmp3.copy(this.node2.position), w1.faceNormal1, this.d / 2),
                    w1.translateVec(this.tmp4.copy(w1.getOpposite(this.node2).position), w1.faceNormal1, this.d / 2),
                ]
            }

            // convert from vec3 to vec2
            let ps2: THREE.Vector2[] = []
            for(let p of ps3) ps2.push(new THREE.Vector2(p.x, p.z))

            // Calculate the intersection point
            let ip = this.get2LineIntersectionPoint(ps2[0], ps2[1], ps2[2], ps2[3])
            
            // If ip is null -> lines are parallel -> set to rectangular shape and use the extruded points instead
            if(ip === null) this.v3.copy(this.translateVec(this.tmp1.copy(this.node2.position), this.faceNormal1, this.d / 2))
            else this.v3.set(ip.x, 0, ip.y)


            // Create two lines from 4 points to calculate the intersection point of one side of this wall and one of w2
            // Side 2 is the negated normal side
            if(this.node2 === w2.node2) {

                ps3 = [
                    this.translateVec(this.tmp1.copy(this.getOpposite(this.node2).position), this.faceNormal2, this.d / 2),
                    this.translateVec(this.tmp2.copy(this.node2.position), this.faceNormal2, this.d / 2),
                    w2.translateVec(this.tmp3.copy(this.node2.position), w2.faceNormal1, this.d / 2),
                    w2.translateVec(this.tmp4.copy(w2.getOpposite(this.node2).position), w2.faceNormal1, this.d / 2)
                ]
            }
            else {

                ps3 = [
                    this.translateVec(this.tmp1.copy(this.getOpposite(this.node2).position), this.faceNormal2, this.d / 2),
                    this.translateVec(this.tmp2.copy(this.node2.position), this.faceNormal2, this.d / 2),
                    w2.translateVec(this.tmp3.copy(this.node2.position), w2.faceNormal2, this.d / 2),
                    w2.translateVec(this.tmp4.copy(w2.getOpposite(this.node2).position), w2.faceNormal2, this.d / 2)
                ]
            }

            // Convert from vec3 to vec2
            ps2 = []
            for(let p of ps3) ps2.push(new THREE.Vector2(p.x, p.z))

            // Calculate intersection point
            ip = this.get2LineIntersectionPoint(ps2[0], ps2[1], ps2[2], ps2[3])

            // If ip is null -> lines are parallel -> set to rectangular shape and use the extruded points instead
            if(ip === null) this.v4.copy(this.translateVec(this.tmp1.copy(this.node2.position), this.faceNormal2, this.d / 2))
            else this.v4.set(ip.x, 0, ip.y)

            return [this.v3, this.v4]
        }
    }

    /** Get the other Node of this wall */
    public getOpposite(n: Node) {

        if(this.node1 === n) return this.node2
        else if(this.node2 === n) return this.node1
        else return null
    }

    /** Calculate the normals perpendicular to p1-p2 line */
    public computeNormals = (() => {

        let v = new THREE.Vector3()

        return () => {

            v.set(this.p2.x - this.p1.x, 0, this.p2.z - this.p1.z)
            v.normalize()

            this.faceNormal1.set(-v.z, 0, v.x)
            this.faceNormal2.set(v.z, 0, -v.x)
        }
    })()
}