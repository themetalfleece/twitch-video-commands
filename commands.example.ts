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
        },
    ];
