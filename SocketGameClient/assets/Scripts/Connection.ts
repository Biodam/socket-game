import { _decorator, Component, Node, SystemEvent, director, systemEvent, EventKeyboard, Prefab, instantiate } from 'cc';
import io from 'socket.io-client/dist/socket.io.js';
import { LocalPlayer } from './LocalPlayer';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Connection')
export class Connection extends Component {

    @property({ type: Prefab })
    private prefabPlayer!: Prefab;

    private socket!: Socket;

    private players = new Array<Player>();
    private localPlayer!: Player;

    start() {
        // Client-side connection initialization
        console.log("Starting connection to socket.io server");

        this.socket = io('http://localhost:3000',
            {
                withCredentials: true,
                extraHeaders: {
                    "my-custom-header": "abcd"
                },
                transports: ['websocket', 'polling', 'flashsocket']
            });

        if (this.socket != undefined) {
            //Socket register of events
            this.socket.on("connect", () => {
                console.log(`Socket.ID: ${this.socket.id}`);
                //Instantiate local player
                this.localPlayer = this.addPlayer(this.socket.id);
                if (this.localPlayer != null) {
                    let lp = this.localPlayer.addComponent(LocalPlayer);
                    lp?.init(this.socket);
                }
            });

            this.socket.on("player-connect", (id: string) => {
                if (Array.isArray(id))
                    id = id[0];
                if (id != this.socket.id) {
                    //Instantiate remote player
                    this.addPlayer(id);
                }
            });

            this.socket.on("player-disconnect", (id: string) => {
                if (Array.isArray(id))
                    id = id[0];
                //Destroy instance of remote player
                if (id != this.socket.id) {
                    console.log(`player ${id} disconnected`);
                    this.removePlayer(id);
                }
            });

            this.socket.on("game-state-update", (gameState: any) => {
                if (Array.isArray(gameState))
                    gameState = gameState[0];
                //Update all player states based on game state received
                this.updateGameState(gameState);
            });
        }
    }

    updateGameState(gameState: any) {
        //console.log(JSON.stringify(gameState));

        gameState.playersStates.forEach(ps => {
            let found = this.players.find((p) => p.id == ps.id);
            if (found) {
                found.updateState(ps);
            } else {
                console.log(`could not find player ${ps.id}`)
            }
        });
    }

    addPlayer(id: string): Player | null {
        console.log(`adding player ${id}`);
        console.log(`player count: ${this.players.length}`);
        console.log([...this.players.keys()]);
        let scene = director.getScene();
        let instance = instantiate(this.prefabPlayer);
        instance.setParent(scene);
        let player = instance.getComponent(Player);
        if (player != null) {
            player.init(id);
            this.players.push(player);
        }
        else
            console.log("Could not add player to map");
        console.log(`player count: ${this.players.length}`);
        console.log([...this.players.keys()]);
        return player;
    }

    removePlayer(id: string) {
        console.log(`removePlayer start - player count: ${this.players.length} ${[...this.players.keys()]}`);
        let found = this.players.find((p) => p.id == id);
        if (found) {
            let foundIndex = this.players.indexOf(found);
            this.players.splice(foundIndex,1);
            found.node.destroy();            
        }
        console.log(`removePlayer end - player count: ${this.players.length} ${[...this.players.keys()]}`);
    }
}