import { Vector3 } from "three"
import { Cell } from "./cell"


export class Wall {
    
    p1: Vector3
    p2: Vector3

    constructor(p1: Vector3, p2: Vector3) {

        this.p1 = p1
        this.p2 = p2
    }
}

export class MazeGenerator {

    current: Cell
    next: Cell

    start: Cell
    end: Cell

    grid: Cell[] = []
    stack: Cell[] = []
    walls: Wall[] = []
    points: Vector3[] = []

    rows: number
    cols: number
    dimension: number = 200


    constructor(rows?:number, cols?:number) {

        this.rows = rows == undefined ? 10 : rows
        this.cols = cols == undefined ? 10 : cols

        let cell: Cell
        for(let y = 0; y < rows; y++) {
            for(let x = 0; x < cols; x++) {

                cell = new Cell(x, y)
                this.grid.push(cell)
            }
        }

        this.start = this.current = this.grid[0]
        this.end = this.grid[this.grid.length-1]
    }

    step() {

        this.current.visited = true
        this.next = this.current.checkNeighbours(
            this.getCell(this.current.x, this.current.y - 1),
            this.getCell(this.current.x + 1, this.current.y),
            this.getCell(this.current.x, this.current.y + 1),
            this.getCell(this.current.x - 1, this.current.y)
        )

        if(this.next) {

            this.next.visited = true

            this.stack.push(this.current)

            this.removeWalls(this.current, this.next)

            this.current = this.next
        }
        else if(this.stack.length > 0) {

            this.current = this.stack.pop()
        }
    }

    analyse() {

        this.walls = []
        this.points = []
        let d = 2

        this.start.walls[0] = false

        if(this.end.x + 1 > this.cols-1) this.end.walls[1] = false
        else if(this.end.x - 1 < 0) this.end.walls[3] = false
        else if(this.end.y - 1 < 0) this.end.walls[3] = false
        else if(this.end.y + 1 < this.rows-1) this.end.walls[3] = false

        for(let c of this.grid) {

            let x = c.x * d
            let y = c.y * d

            let wall: Wall
            if(c.walls[0]) {

                wall = new Wall(this.getPoint(x, y), this.getPoint(x + d, y))
                this.walls.push(wall)
            }
            if(c.walls[1]) {

                wall = new Wall(this.getPoint(x + d, y), this.getPoint(x + d, y + d))
                this.walls.push(wall)
            }
            if(c.walls[2]) {
                wall = new Wall(this.getPoint(x, y + d), this.getPoint(x + d, y + d))
                this.walls.push(wall)
            }
            if(c.walls[3]) {
                wall = new Wall(this.getPoint(x, y), this.getPoint(x, y + d))
                this.walls.push(wall)
            }
        }

        this.walls = this.removeDuplicates(this.walls)

        console.log('Walls',this.walls)
    }

    getPoint(x, y) {

        for(let p of this.points) {

            if(p.x == x && p.z == y) return p
        }

        let p = new Vector3(x, 0, y)
        this.points.push(p)

        return p
    }

    removeDuplicates(arr: Wall[]) {
        
        let newArr: Wall[] = []
        let duplicate: boolean

        for(let a of arr) {

            duplicate = false
            for(let n of newArr) {

                if(a.p1.equals(n.p1) && a.p2.equals(n.p2) &&
                    a.p2.equals(n.p1) && a.p1.equals(n.p2)) {

                    duplicate = true
                    break
                }
            }

            if(!duplicate) newArr.push(a) 
        }

        return newArr
    }
    



    getCell(x: number, y: number) {

        if(x < 0 || y < 0 || x > this.cols -1 || y > this.rows -1) return null

        return this.grid[Math.floor(x + y * this.cols)]
    }

    removeWalls(a, b) {

        let x = a.x - b.x
        let y = a.y - b.y

        if(x == 1) {

            a.walls[3] = false
            b.walls[1] = false
        }
        if(x == -1) {

            a.walls[1] = false
            b.walls[3] = false
        }

        if(y == 1) {

            a.walls[0] = false
            b.walls[2] = false
        }
        if(y == -1) {

            a.walls[2] = false
            b.walls[0] = false
        }
    }
}