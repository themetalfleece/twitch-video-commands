$(document).ready(() => {

    /* initiate socket */
    const socket = io();
    /* create a video player for the video element (id #mainVideo) */
    const player = videojs('mainVideo');

    /* upon receiving the play-video event */
    socket.on('play-video', (data) => {
        const { src, type } = data;
        /* set the source and type which we acquired by the event */
        player.src({ type, src });
        /* show the video player */
        player.show();
        /* play the video */
        player.play();
        /* as soon as the video ends, hide the player */
        player.on('ended', function () {
            player.hide();
        });
    })

});
