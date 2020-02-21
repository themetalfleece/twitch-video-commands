# twitch-video-commands

## Plays a video on stream whenever a command is sent on twitch chat

### Setup in OBS (when you have the server URL)
1) Add a new Browser Source
2) Set the server URL as the URL field
3) (optional) Add a chroma key filter so the videos can have a transparent background

### Project Configuration
1) Edit `config.ts`
2) Follow the comments to configure the server, authentication and the parameters of the application
3) To setup the commands, add entries to the `commands` array, following the given interface
   * You should place your videos in the `/src/public/resources` directory

### Building and Running the application
1) Install [node.js](https://nodejs.org/en/download/), [yarn](https://classic.yarnpkg.com/en/docs/install)
2) Run `yarn` to install the project dependencies
3) To build the app, navigate to the project root and run `yarn build`
4) To run the app, navigate to the project root and run `yarn start`
5) The server will run on the port specified

### Project structure
1) `src/app.ts`: the server, which runs with `node`
2) `src/public`: the public files, which will be used by the front-end
