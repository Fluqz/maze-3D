
import * as THREE from "three"
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Globals } from "./globals"

export class AssetManager {

    /** Map of all glTF's loaded. { key: path, value: GLTF } */
    static assets = new Map<string, GLTF>()
    
    /** THREE.LoadingManager instance */
    static mgmt = new THREE.LoadingManager()
    /** THREE.GLTFLoader instance */
    static gltfLoader = new GLTFLoader(AssetManager.mgmt)

    static _onload : () => void
    static get onload() { return this._onload }
    static set onload(o) { 
        this._onload = o
        this.mgmt.onLoad = this._onload
    }


    /** Load or fetch a glTF model by path. */
    static load(path: string) {
        console.log('load')

        return new Promise((resolve, reject) => {

            if(!path) reject()

            const gltf = AssetManager.assets.get(path)
    
            if(gltf) {
                // console.log('CLONE')
                resolve(gltf)
            }
    
            AssetManager.gltfLoader.load(path, (gltf)=> {
    
                AssetManager.assets.set(path, gltf)

                resolve(gltf)
            },
            undefined,// progress => {  },
            error => { console.error(error); reject(); })
        })
    }
}