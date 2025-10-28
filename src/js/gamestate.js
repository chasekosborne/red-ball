// singleton object for handling Game State
const GameHandler = (function () {
    let instance;

    function init() {
        return {
            // member variable(s)
            paused: false,

            // state modifiers
            pauseGame() {
                this.paused = true;
            },
            resumeGame() {
                this.paused = false;
            },
            // state getter
            isPaused() {
                return this.paused;
            }
        };
    }

    return {
        getInstance() {
            if (!instance) instance = init();
            return instance;
        }
    };
})();
const gameHandler = GameHandler.getInstance(); // reference to singleton object