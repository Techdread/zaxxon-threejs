export class InputHandler {
    constructor() {
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            Space: false
        };

        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event) {
        const key = event.code === 'Space' ? 'Space' : event.code;
        if (this.keys.hasOwnProperty(key)) {
            event.preventDefault();
            this.keys[key] = true;
        }
    }

    handleKeyUp(event) {
        const key = event.code === 'Space' ? 'Space' : event.code;
        if (this.keys.hasOwnProperty(key)) {
            event.preventDefault();
            this.keys[key] = false;
        }
    }

    isPressed(key) {
        return this.keys[key] || false;
    }
}
