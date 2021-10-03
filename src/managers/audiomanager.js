class AudioManager {

    play(scene, key) {
        const sound = scene.sound.add(key);
        sound.play();
    }

}

let audioManager = new AudioManager();
export default audioManager;
