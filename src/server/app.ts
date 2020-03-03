import * as dotenv from 'dotenv';
import { Server } from './init/Express';
import { Tmi } from './init/Tmi';
import { parameters } from '../../parameters';
import { Cooldown } from './utils/Cooldown';

/** initiate environmental variables */
dotenv.config();

export class App {
    private server: Server;
    private tmi: Tmi;

    /** stores information for using the cooldown feature */
    private cooldowns = {
        /** cooldown for emiting the video event */
        videoCommands: new Cooldown(parameters.videoCommands.cooldown),
        /** cooldown for sending a message saying that the video commands have a cooldown */
        videoCommandsCooldown: new Cooldown(60),
        /** cooldown for sending a message saying that the it's in sub-only mode */
        subscriberOnly: new Cooldown(parameters.subscriberOnly.notifyCooldown),
        /** cooldown for sending the video commands list */
        videoCommandsList: new Cooldown(parameters.videoCommandsList.cooldown),
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
            if (videoCommandsList.enabled && messageLowerCase.startsWith(videoCommandsList.command)) {
                if (!this.cooldowns.videoCommandsList.isReady()) { return; }

                client.say(channel, `Video commands: ${videoCommands.commands.map(({ commandName }) => commandName).sort().join(' ')}`);
                this.cooldowns.videoCommandsList.setEntry();

                return;
            }

            /* check against the commands */
            for (const command of videoCommands.commands) {
                if (messageLowerCase.startsWith(command.commandName)) {

                    /* for subscriber-only mode */
                    if (subscriberOnly.enabled && !tags.subscriber) {
                        /* notify if specified */
                        if (subscriberOnly.notifyAboutSubOnly && this.cooldowns.subscriberOnly.isReady()) {
                            client.say(channel, `@${tags.username}: video commands are currently in sub-only mode`);
                            this.cooldowns.subscriberOnly.setEntry();
                        }
                        return;
                    }

                    /** if the video commands cooldown is reached, notify if needed */
                    if (!this.cooldowns.videoCommands.isReady()) {
                        if (parameters.videoCommands.notifyAboutCooldown && this.cooldowns.videoCommandsCooldown.isReady()) {
                            client.say(channel, `Video commands have a ${parameters.videoCommands.cooldown} second cooldown`);
                            this.cooldowns.videoCommandsCooldown.setEntry();
                        }
                        return;
                    }

                    /* emit a 'play-video' event with the specified source and type */
                    this.server.io.sockets.emit('play-video', { src: command.src, type: command.type });
                    console.log(`emited`, { src: command.src, type: command.type });
                    this.cooldowns.videoCommands.setEntry();

                    return;
                }
            }
        });
    }
}

new App();
