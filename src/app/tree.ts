import { BufferGeometry, InstancedMesh, Material, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { Oscillator, AmplitudeEnvelope, Gain } from "tone";
import { getNote, getTonleiter, notes, tonleiter_pattern } from "./data/note-frequencies";
import { PositionalAudio } from "./positional-audio";


export class Tree extends PositionalAudio{

    mesh: Mesh

    geometry: BufferGeometry
    material: Material

    // add stuff like
    // Age (affect volume), height (affect range), strain (affect wave type)
    //

    constructor(geometry, material) {

        super(
            getTonleiter(
                getNote('C' + Math.round((Math.random() * 3) + 2))
            )[Math.round(Math.random() * tonleiter_pattern.length)].frequency
        , 30)
        // super(notes[Math.round(Math.random() * (notes.length - 1))].frequency, 40)
        // super((Math.random() * 300) + 100, 40)

        this.geometry = geometry
        this.material = material
    }

    create() {

        this.mesh = new Mesh(this.geometry, this.material)
        this.mesh.matrixAutoUpdate = false
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        this.mesh.scale.set(1, 1 + (Math.random() * 1), 1)
    }


    update(position: Vector3, delta: number): void {
        
        this.mesh.position.copy(this.position)
        this.mesh.updateMatrix()

        super.update(position, delta)
    }
}