import * as express from 'express';
import * as http from 'http';
import * as socket from 'socket.io';

export class Server {
    public app: express.Express;
    public server: http.Server;
    public io: socket.Server;

    constructor() {
        /* initiate the http and socker server */
        this.app = express();
        this.server = new http.Server(this.app);
        this.io = socket(this.server);

        /* listen to the given port */
        this.server.listen(process.env.SERVER_PORT, () => {
            console.log(`Listening on port ${process.env.SERVER_PORT}`);
        });

        /* serve the public directory as static files */
        this.app.use(express.static('src/public'));
    }
}

