import { Vector3 } from "three"
import { Cell } from "./cell"


/** A Wall represents a side of a square/cell */
export class Wall {
    
    p1: Vector3
    p2: Vector3

    constructor(p1: Vector3, p2: Vector3) {

        this.p1 = p1
        this.p2 = p2
    }
}

/** Will generate a Maze from a grid. */
export class MazeGenerator {

    /** Current Cell that is being checked */
    current: Cell
    /** Next cell */
    next: Cell

    /** Starting cell of the maze */
    start: Cell
    /** Goal. Last cell of the maze. */
    end: Cell

    /** Array of Cells making a grid */
    grid: Cell[] = []
    /** 
     * The array keeps track of all cells since it started creating a path. 
     * When finding a dead end, it is backtracking and popping cells of the stack 
     * till it finds a cell where a new path is possible.
     * */
    stack: Cell[] = []
    /** Array of all active Walls */
    walls: Wall[] = []
    /** Array of all active points */
    points: Vector3[] = []

    /** Amount of rows in the maze grid */
    rows: number
    /** Amount of rows in the maze grid */
    cols: number


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