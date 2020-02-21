export const server = {
    /** the port that the server will listen */
    port: 3000,
};

export const auth = {
    /** username of the twitch bot account */
    username: "botname",
    /** oauth of the twitch bot account */
    password: "oauth:...",
    /** the channels for the twitch bot to connect. They must start with a # */
    channels: ["#yourchannelname"],
};

export const parameters = {
    /** in seconds, a cooldown for playing videos */
    cooldown: 60,
};

export const commands: Array<{
    /** the lowercase string of the twitch chat message */
    commandName: string;
    /** the video source, which should be under /resources */
    src: string;
    /** the type of the video, i.e. "video/mp4" */
    type: string;
}> = [
        {
            commandName: '!demo',
            src: '/resources/demo.mp4',
            type: 'video/mp4',
        }
    ];
