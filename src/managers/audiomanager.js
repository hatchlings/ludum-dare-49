class AudioManager {

    play(scene, key) {
        const s = scene.sound.add(key);
        s.play();
    }

}

let audioManager = new AudioManager();
export default audioManager;
