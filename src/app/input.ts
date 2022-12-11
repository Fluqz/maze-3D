
export interface MouseMapping {

    mouseLeft?: number
    mouseMiddle?: number
    mouseWheelUp?: number
    mouseWheelDown?: number
    mouseRight?: number
}
export interface KeyboardMapping {

    forward?: number
    back?: number
    left?: number
    right?: number
    jump?: number
    interact?: number
}

export interface Mapping {

    mouse: MouseMapping
    keyboard: KeyboardMapping
}

export enum InputMappings {

    ArrowUp = 38,
    ArrowDown = 40,
    ArrowLeft = 37,
    ArrowRight = 39,
    W = 87,
    A = 65,
    S = 83,
    D = 68,
    Space = 32,
    Shift = 16,
    Ctrl = 17,
    Alt = 18,

    
}


export class Input {

    static isMouseDown: boolean = false
    static mouse: number[]
    static keyboard: number[]
    static mapping: Mapping = {

        mouse: {

        },
        keyboard: {
            forward: InputMappings.W,
            back: InputMappings.S,
            left: InputMappings.A,
            right: InputMappings.D,
            jump: InputMappings.Space
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

        console.log('pointerdown', e)

        if(!Input.mouse.includes(e.button)) Input.mouse.push(e.button)
    }

    onPointerUp(e) {

        // console.log('pointerup', e)

        if(Input.mouse.includes(e.button)) Input.mouse.splice(Input.mouse.indexOf(e.button), 1)
    }

    onKeyDown(e) {

        // console.log('keydown', e.key, e.code, e.keyCode, e)

        if(!Input.keyboard.includes(e.keyCode)) Input.keyboard.push(e.keyCode)
    }

    onKeyUp(e) {

        // console.log('keyup', e.key, e.code, e.keyCode, e)

        if(Input.keyboard.includes(e.keyCode)) Input.keyboard.splice(Input.keyboard.indexOf(e.keyCode), 1)
    }
}