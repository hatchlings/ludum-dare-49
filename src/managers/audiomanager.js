class AudioManager {

    play(scene, key, config) {
        const s = scene.sound.add(key);
        s.play(config || {});
    }

}

let audioManager = new AudioManager();
export default audioManager;
