// ======================================================
// MOIRÉ
// tree1.js
// Tree Model Loader
// ======================================================

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export function createTree1(scene, position = { x: 0, y: 0, z: 0 }) {

    loader.load(
        "/src/assets/models/tree.glb",

        (gltf) => {

            const tree = gltf.scene;

            tree.position.set(
                position.x,
                position.y,
                position.z
            );

            tree.scale.set(
                1,
                1,
                1
            );

            scene.add(tree);

        },

        undefined,

        (error) => {
            console.error("Tree1 failed to load:", error);
        }
    );

}
