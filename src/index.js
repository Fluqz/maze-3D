

import * as Tone from 'tone'
import { Game } from './app/game'
import { Globals } from "./app/globals"



Globals.dom = document.getElementById('webGL')

// let game = new Game(Globals.dom)
// game.init()

            
window.onbeforeunload = function () {
    
    // game.destroy()
    return
}