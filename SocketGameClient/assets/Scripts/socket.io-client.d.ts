// Declare the shape of "socket.io-client/dist/socket.io.js"
declare module "socket.io-client/dist/socket.io.js" {
    import { io , Socket} from "socket.io-client";
    export default io;    
}