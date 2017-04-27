module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '13.55.63.37',
      username: 'ubuntu',
      pem: '../../../METEORITE.pem'
      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    },

  },

  meteor: {
    // TODO: change app name and path
    name: 'externalTestServer',
    path: '../../externalTestServer',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://ec2-13-55-63-37.ap-southeast-2.compute.amazonaws.com/',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

    docker: {
      // change to 'kadirahq/meteord' if your app is not using Meteor 1.4
      image: 'abernix/meteord:base',
    },

    // This is the maximum time in seconds it will wait
    // for your app to start
    // Add 30 seconds if the server has 512mb of ram
    // And 30 more if you have binary npm dependencies.
    deployCheckWaitTime: 60,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: false
  },

  mongo: {
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
