
export interface MouseMapping {

    mouseLeft?: string
    mouseMiddle?: string
    mouseWheelUp?: string
    mouseWheelDown?: string
    mouseRight?: string
}
export interface KeyboardMapping {

    forward?: string
    back?: string
    left?: string
    right?: string
    jump?: string
    interact?: string
}

export interface Mapping {

    mouse: MouseMapping
    keyboard: KeyboardMapping
}

export enum InputMappings {

    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    W = 'w',
    A = 'a',
    S = 's',
    D = 'd',
    Space = 'space',
    Shift = 'Shift',
    Ctrl = 'Ctrl',
    Alt = 'Alt',

    
}

export class Input {

    static isMouseDown: boolean = false
    static mouse: string[]
    static keyboard: string[]
    static mapping: Mapping = {

        mouse: {

        },
        keyboard: {
            forward: 'w',
            back: 's',
            left: 'a',
            right: 'd',
            jump: ' '
        }
    }

    private dom: HTMLElement



    constructor(dom: HTMLElement) {

        this.dom = dom

        Input.mouse = []
        Input.keyboard = []

        this.dom.addEventListener('pointerdown', this.onPointerDown.bind(this), false)
        this.dom.addEventListener('pointerup', this.onPointerUp.bind(this), false)
        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
        document.addEventListener('keyup', this.onKeyUp.bind(this), false)
    }

    static on(map:string) {

        if(Input.mapping.keyboard.hasOwnProperty(map)) {

            return Input.keyboard.includes(Input.mapping.keyboard[map])
        }
        else if(Input.mapping.mouse.hasOwnProperty(map)) {

            return Input.mouse.includes(Input.mapping.mouse[map])
        }
    }

    static setMapping() {}

    onPointerDown(e) {

        // console.log('pointerdown', e)

        if(!Input.mouse.includes(e.button)) Input.mouse.push(e.button)
    }

    onPointerUp(e) {

        // console.log('pointerup', e)

        if(Input.mouse.includes(e.button)) Input.mouse.splice(Input.mouse.indexOf(e.button), 1)
    }

    onKeyDown(e) {

        // console.log('keydown', e)

        if(!Input.keyboard.includes(e.key)) Input.keyboard.push(e.key)
    }

    onKeyUp(e) {

        // console.log('keyup', e)

        if(Input.keyboard.includes(e.key)) Input.keyboard.splice(Input.keyboard.indexOf(e.key), 1)
    }
}