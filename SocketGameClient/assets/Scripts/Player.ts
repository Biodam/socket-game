
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    public id = "";

    public init(id: string) {
        this.id = id;
    }

    public updateState(playerState: any) {
        let currentPos = this.node.getPosition();
        let newPos = new Vec3(playerState.x, currentPos.y, playerState.z);
        this.node.setPosition(newPos);
    }

    start() {

    }

}