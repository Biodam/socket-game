
import { _decorator, Component, Node, SystemEvent, systemEvent, EventKeyboard } from 'cc';
import { Socket } from 'socket.io-client';
const { ccclass, property } = _decorator;

@ccclass('LocalPlayer')
export class LocalPlayer extends Component {

    private horizontal = 0;
    private vertical = 0;

    //Keyboard constants ASCII key codes
    private _keyW = 87;
    private _keyS = 83;
    private _keyD = 68;
    private _keyA = 65;
    private _keyArrowUp = 38;
    private _keyArrowDown = 40;
    private _keyArrowRight = 39;
    private _keyArrowLeft = 37;
    private _keySpace = 32;

    private socket!: Socket;
    
    public init(socket: Socket) {
        this.socket = socket;
    }

    start() {
        //Input register of events        
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        //Handle vertical keyboard input
        if (event.keyCode == this._keyW || event.keyCode == this._keyArrowUp)
            this.vertical = 1;
        else if (event.keyCode == this._keyS || event.keyCode == this._keyArrowDown)
            this.vertical = -1;

        //Handle horizontal keyboard input
        if (event.keyCode == this._keyD || event.keyCode == this._keyArrowRight)
            this.horizontal = 1;
        else if (event.keyCode == this._keyA || event.keyCode == this._keyArrowLeft)
            this.horizontal = -1;

        this.sendInputToServer();
    }

    sendInputToServer() {
        this.socket.emit("player-input", { horizontal: this.horizontal, vertical: this.vertical });
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode == this._keyW || event.keyCode == this._keyArrowUp || event.keyCode == this._keyS || event.keyCode == this._keyArrowDown)
            this.vertical = 0;

        if (event.keyCode == this._keyD || event.keyCode == this._keyArrowRight || event.keyCode == this._keyA || event.keyCode == this._keyArrowLeft)
            this.horizontal = 0;

        this.sendInputToServer();
    }
}
