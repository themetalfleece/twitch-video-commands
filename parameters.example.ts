export const parameters = {
    /** in seconds, a cooldown for playing videos */
    videoCommands: {
        /** cooldown for the video commands */
        cooldown: 60,
        /** notify that the given video commands can't be played due to the cooldown */
        notifyAboutCooldown: true,
        /** the video commands to use */
        commands: [
            {
                /** the lowercase string of the twitch chat message */
                commandName: '!demo',
                /** the video source, which should be under /resources */
                src: '/resources/demo.mp4',
                /** the type of the video, i.e. "video/mp4" */
                type: 'video/mp4',
            },
        ]
    },
    subscriberOnly: {
        /** whether only subscribers can trigger the videos */
        enabled: false,
        /** notify a that it's in sub-only mode if a non-sub send a video command */
        notifyAboutSubOnly: true,
        /** cooldown for notifyAboutSubOnly */
        notifyCooldown: 60,
    },
    videoCommandsList: {
        /** whether the list of commands is enabled or not */
        enabled: true,
        /** the command to show a list of video commands */
        command: '!vcommands',
        /** cooldown for the list of commands */
        cooldown: 30,
    },
};
