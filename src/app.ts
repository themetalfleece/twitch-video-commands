import { Client } from 'tmi.js';
import { commands, parameters } from '../commands';
import * as express from 'express';
import * as http from 'http';
import * as socket from 'socket.io';
import * as dotenv from 'dotenv';

/** initiate environmental variables */
dotenv.config();

/* initiate the http and socker server */
const app = express();
const server = new http.Server(app);
const io = socket(server);

/* listen to the given port */
server.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
});

/* serve the public directory as static files */
app.use(express.static('src/public'));

/* setup the tmi.js client and connect */
const client = Client({
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_PASSWORD,
    },
    channels: JSON.parse(process.env.TWITCH_CHANNELS),
});

client.connect();

/** stores information for using the cooldown feature */
const cooldown: {
    lastVideoPlayedAt: Date;
} = {
    lastVideoPlayedAt: null,
}

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    /** if the cooldown is reached, return right away */
    if (
        cooldown.lastVideoPlayedAt &&
        cooldown.lastVideoPlayedAt.getTime() / 1000 + parameters.cooldown > new Date().getTime() / 1000
    ) {
        return;
    }

    /* check if the lowercase string of every message starts with any of the given commands */
    const messageLowerCase = message.toLowerCase();
    for (const command of commands) {
        if (messageLowerCase.startsWith(command.commandName)) {
            /* emit a 'play-video' event with the specified source and type */
            io.sockets.emit('play-video', { src: command.src, type: command.type });
            console.log(`emited`, { src: command.src, type: command.type })
            cooldown.lastVideoPlayedAt = new Date();
        }
    }
});