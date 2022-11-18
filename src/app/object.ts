import { Object3D, Quaternion, Vector3 } from "three";



export abstract class GameObject /* extends Object3D */ {

    abstract obj: Object3D

    // abstract position: Vector3
    // abstract rotation: Quaternion
    // abstract scale: Vector3

    abstract construct?() : void
    abstract update?(delta?: number) : void
    abstract destruct?() : void
}