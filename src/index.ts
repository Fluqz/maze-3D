

import * as Tone from 'tone'
import { Game } from './app/game'
import { Globals } from "./app/globals"



Globals.dom = document.getElementById('webGL')


document.addEventListener('mousedown', () => {

    game.start()
})

let game = new Game(Globals.dom)
game.init()
            
window.onbeforeunload = () => {
    
    // game.destroy()
    return
}

window.onresize = () => {

    game.resize()
}