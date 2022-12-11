



export class Cell {
    
    x: number
    y: number

    walls: boolean[]

    visited: boolean

    constructor(x:number, y:number) {

        this.x = x
        this.y = y
        this.walls = [true, true, true, true]
        this.visited = false
    }

    checkNeighbours = (top: Cell, right: Cell, bot: Cell, left: Cell) => {

        var neighbours = []

        if(top && !top.visited) neighbours.push(top)
        if(right && !right.visited) neighbours.push(right)
        if(bot && !bot.visited) neighbours.push(bot)
        if(left && !left.visited) neighbours.push(left)

        if(neighbours.length > 0) {

            var r = Math.floor(Math.random() * neighbours.length)
            return neighbours[r]
        }
        else return null
    }
}
