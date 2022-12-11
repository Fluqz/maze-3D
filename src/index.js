
import * as P5 from 'p5'
import { Vector2, Vector3 } from 'three'

const container = document.getElementById('webGL')

document.addEventListener('keydown', (e) => {

    if(e.key == 'a') {

        analyse()
    }
})

window.addEventListener('focus', () => {

})
            
window.addEventListener('blur', () => {

})
            
window.onbeforeunload = () => {

}

window.onresize = () => {

}

const grid = []
let rows, cols
const d = 200
const stack = []
let current
let next
let walls = []

const maze = (p) => {

    p.setup = () => {

        p.createCanvas(window.innerWidth, window.innerHeight)

        cols = p.floor(p.width / d)
        rows = p.floor(p.height / d)
        
        for(let y = 0; y < rows; y++) {
            for(let x = 0; x < cols; x++) {


                let cell = new Cell(x, y)
                grid.push(cell)
            }
        }

        current = grid[0]

        console.log('grid', grid)
    }

    p.draw = () => {

        p.background(51)

        for(let i = 0; i < grid.length; i++) {

            grid[i].show()
        }

        current.visited = true
        current.highlight()
        next = current.checkNeighbours()

        if(next) {

            next.visited = true

            stack.push(current)

            removeWalls(current, next)

            current = next
        }
        else if(stack.length > 0) {

            current = stack.pop()
        }

        if(walls.length > 0) {

            for(let w of walls) {

                p.stroke(0, 255, 255)
                p.line(w[0].x, w[0].y, w[1].x, w[1].y)
            }
        }
    }

    function getCell(x, y) {

        if(x < 0 || y < 0 || x > cols -1 || y > rows -1) return null

        return grid[p.floor(x + y * cols)]
    }

    function Cell(x, y) {

        this.x = x
        this.y = y
        this.walls = [true, true, true, true]
        this.visited = false

        this.highlight = () => {

            var x = this.x * d
            var y = this.y * d
            p.noStroke()
            p.fill(0, 0, 150, 100)
            p.rect(x, y, d, d)
        }

        this.checkNeighbours = () => {

            var neighbours = []

            var top   = getCell(x, y - 1)
            var right = getCell(x + 1, y)
            var bot   = getCell(x, y + 1)
            var left  = getCell(x - 1, y)

            if(top && !top.visited) neighbours.push(top)
            if(right && !right.visited) neighbours.push(right)
            if(bot && !bot.visited) neighbours.push(bot)
            if(left && !left.visited) neighbours.push(left)

            if(neighbours.length > 0) {

                var r = p.floor(p.random(0, neighbours.length))
                return neighbours[r]
            }
            else return null
        }

        this.show = () => {

            var x = this.x * d
            var y = this.y * d

            p.stroke(255)
            if(this.walls[0]) p.line( x,     y,     x + d, y     ) // TOP
            if(this.walls[1]) p.line( x + d, y,     x + d, y + d ) // RIGHT
            if(this.walls[2]) p.line( x,     y + d, x + d, y + d ) // BOT
            if(this.walls[3]) p.line( x,     y,     x,     y + d ) // LEFT


            if(this.visited) {

                p.noStroke()
                p.fill(100, 30, 150)
                p.rect(x, y, d, d)
            }
        }
    }



    function removeWalls(a, b) {

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

function analyse() {

    walls = []

    for(let c of grid) {

        let x = c.x * d
        let y = c.y * d

        if(c.walls[0]) {
            let wall = []
            wall.push(new Vector2(x, y))
            wall.push(new Vector2(x + d, y))
            walls.push(wall)
        }
        if(c.walls[1]) {
            let wall = []
            wall.push(new Vector2(x + d, y))
            wall.push(new Vector2(x + d, y + d))
            walls.push(wall)
        }
        if(c.walls[2]) {
            let wall = []
            wall.push(new Vector2(x, y + d))
            wall.push(new Vector2(x + d, y + d))
            walls.push(wall)
        }
        if(c.walls[3]) {
            let wall = []
            wall.push(new Vector2(x, y))
            wall.push(new Vector2(x, y + d))
            walls.push(wall)
        }

    }
    console.log(walls)
}


const p5 = new P5(maze)