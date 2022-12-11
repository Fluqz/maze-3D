import { Wall } from './wall'


export class Node {

    /** Linked node connections */
    nodes: Node[]

    /** Point v3 */
    position: THREE.Vector3

    constructor(vec: THREE.Vector3) {

        this.position = vec
        this.nodes = []
    }

    /** Store connection */
    connect(node: Node) {

        if(this.nodes.indexOf(node) !== -1) return

        this.nodes.push(node)
        node.connect(node)
    }

    /** Free connection */
    disconnect(node?: Node) {

        if(this.nodes.indexOf(node) === -1) return

        this.nodes.splice(this.nodes.indexOf(node), 1)
    }
}