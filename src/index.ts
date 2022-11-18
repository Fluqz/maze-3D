

import * as Tone from 'tone'
import { Game } from './app/game'
import { Globals } from "./app/globals"



Globals.dom = document.getElementById('webGL')

let isPause = true

document.addEventListener('mousedown', () => {

    if(isPause) {
        isPause = false
        game.start()
    }
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