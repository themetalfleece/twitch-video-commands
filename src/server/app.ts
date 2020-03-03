import * as dotenv from 'dotenv';
import { Server } from './init/Express';
import { Tmi } from './init/Tmi';
import { parameters } from '../../parameters';

/** initiate environmental variables */
dotenv.config();

export class App {
    private server: Server;
    private tmi: Tmi;

    /** stores information for using the cooldown feature */
    private cooldown: {
        lastVideoPlayedAt: Date;
    } = {
            lastVideoPlayedAt: null,
        }

    constructor() {
        this.server = new Server();
        this.tmi = new Tmi();

        this.setEventListeners();
    }

    private setEventListeners() {
        const { client } = this.tmi;
        const { videoCommands, videoCommandsList, subscriberOnly } = parameters;

        client.on('message', (channel, tags, message, self) => {
            if (self) { return; }

            /** always compare the lowercase of the message */
            const messageLowerCase = message.toLowerCase();

            /** check for the video commands list */
            if (videoCommandsList?.enabled && messageLowerCase.startsWith(videoCommandsList.command)) {
                client.say(channel, `Video commands: ${videoCommands.commands.map(({ commandName }) => commandName).sort().join(' ')}`);
                return;
            }

            /** if the cooldown is reached, return right away */
            if (
                this.cooldown.lastVideoPlayedAt &&
                this.cooldown.lastVideoPlayedAt.getTime() / 1000 + videoCommands.cooldown > new Date().getTime() / 1000
            ) {
                return;
            }

            /* check against the commands */
            for (const command of videoCommands.commands) {
                if (messageLowerCase.startsWith(command.commandName)) {
                    /* for subscriber-only mode */
                    if (subscriberOnly?.enabled && !tags.subscriber) {
                        /* notify if specified */
                        if (subscriberOnly.notifyAboutSubOnly) {
                            client.say(channel, `@${tags.username}: video commands are currently in sub-only mode`);
                        }
                        return;
                    }

                    /* emit a 'play-video' event with the specified source and type */
                    this.server.io.sockets.emit('play-video', { src: command.src, type: command.type });
                    console.log(`emited`, { src: command.src, type: command.type });
                    this.cooldown.lastVideoPlayedAt = new Date();
                    return;
                }
            }
        });
    }
}

new App();
