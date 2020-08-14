import { State } from "./index";

export const initControls = (state: State) => {
    const intervalSpeed = 10;

    enum KEYS {
        FORWARD = "w",
        BACKWARD = "s",
        LEFT = "a",
        RIGHT = "d",
    }

    const keyState: Record<KEYS, boolean> = {} as any;

    const clearKeyState = () =>
        Object.values(KEYS).forEach((k) => (keyState[k] = false));

    clearKeyState();

    const keyDownHandler = (e: KeyboardEvent) => {
        if (Object.values(KEYS).includes(e.key as KEYS)) {
            keyState[e.key as KEYS] = true;
        }
    };
    document.addEventListener("keydown", keyDownHandler);

    const keyupHandler = (e: KeyboardEvent) => {
        if (Object.values(KEYS).includes(e.key as KEYS)) {
            keyState[e.key as KEYS] = false;
        }
    };
    document.addEventListener("keyup", keyupHandler);

    const interval = setInterval(() => {
        if (keyState[KEYS.FORWARD]) {
            state.cameraZ += state.movementSpeed;
        }
        if (keyState[KEYS.BACKWARD]) {
            state.cameraZ -= state.movementSpeed;
        }
        if (keyState[KEYS.LEFT]) {
            state.cameraX -= state.movementSpeed;
        }
        if (keyState[KEYS.RIGHT]) {
            state.cameraX += state.movementSpeed;
        }
    }, intervalSpeed);

    return () => {
        document.removeEventListener("keydown", keyDownHandler);
        document.removeEventListener("keyup", keyDownHandler);
        clearInterval(interval);
    };
};
