


/** Cell is representing a Cell of a Grid.
 * It is having a x, y coordinate and 4 Wall on each side (Square).
 * Also a flag if the Cell was already visited
 */
export class Cell {
    
    /** X coordinate of the cell. Origin is left upper corner. */
    x: number
    /** Y coordinate of the cell. Origin is left upper corner. */
    y: number

    /** Active walls of this cell. TOP, RIGHT, BOTTOM, LEFT */
    walls: boolean[]

    /** Flag if the cell was visited already */
    visited: boolean

    private neighbours: Cell[]

    /** Make a new Cell with x, y coordinates. */
    constructor(x:number, y:number) {

        this.x = x
        this.y = y
        this.walls = [ true, true, true, true ]
        this.visited = false
    }

    /** Checks all neighbours of this Cell, wheather they are visited yet or not and 
     * returns a unvisited neighbouring cell.
     */
    checkNeighbours = (top: Cell, right: Cell, bot: Cell, left: Cell) : Cell => {

        this.neighbours = []

        if(top && !top.visited) this.neighbours.push(top)
        if(right && !right.visited) this.neighbours.push(right)
        if(bot && !bot.visited) this.neighbours.push(bot)
        if(left && !left.visited) this.neighbours.push(left)

        if(this.neighbours.length > 0) {

            var r = Math.floor(Math.random() * this.neighbours.length)
            return this.neighbours[r]
        }
        else return null
    }
}
