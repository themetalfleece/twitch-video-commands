import { Client } from 'tmi.js';

export class Tmi {
    public client: Client;

    constructor() {
        /* setup the tmi.js client and connect */
        this.client = Client({
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

        this.client.connect();
    }
}
