import { Quaternion, Vector3 } from "three";
import * as Tone from "tone";
import { M } from "./util/math";
import { Utils } from "./util/utils";

export class PositionalAudio {

    position: Vector3
    rotation: Quaternion
    scale: Vector3

    oscillator: Tone.Oscillator
    envelope: Tone.AmplitudeEnvelope
    gain: Tone.Gain

    frequency: number = 400

    range: number = 30


    constructor(frequency: number, range: number) {

        this.frequency = frequency
        this.range = range

        this.position = new Vector3()
        this.rotation = new Quaternion()
        this.scale = new Vector3()

        this.oscillator = new Tone.Oscillator(this.frequency)
        this.oscillator.type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType

        // this.envelope = new Tone.AmplitudeEnvelope(0, 1, 1, 1)
        this.gain = new Tone.Gain(.5)
        this.oscillator.connect(this.gain)
        this.gain.toDestination()
    }

    start(delta: number) : void {

        this.oscillator.start()
    }
    update(position: Vector3, delta: number) : void {

        const d = this.position.distanceTo(position)
        
        if(d > this.range) {
        
            this.gain.gain.setValueAtTime(0, delta)
            return
        }

        this.gain.gain.setValueAtTime(M.map(d, 0, this.range, .7, 0), delta)
    }
    stop(delta: number) : void {

        this.oscillator.stop(delta)
    }
}