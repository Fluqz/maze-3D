import { Game } from './app/game'
import { Globals } from './app/globals'


Globals.dom = document.getElementById('webGL')

const game = new Game(Globals.dom)
game.init()



document.addEventListener('keydown', (e) => {

})

window.addEventListener('focus', () => {

})
            
window.addEventListener('blur', () => {

})
            
window.onbeforeunload = () => {

    game.destroy()
}

window.onresize = () => {

    game.resize()

}
