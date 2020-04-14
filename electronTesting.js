const fs = require('fs');
const readline = require('readline');
const { app, BrowserWindow } = require('electron');

const {google} = require('googleapis');
const sampleClient = require('../sampleclient');



app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
 
})

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: sampleClient.oAuth2Client,
});

async function runSample(fileName) {
  const fileSize = fs.statSync(fileName).size;
  const res = await youtube.videos.insert(
    {
      part: 'id,snippet,status',
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title: 'Node.js YouTube Upload Test',
          description: 'Testing YouTube upload via Google APIs Node.js Client',
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(fileName),
      },
    },
    {
      // Use the `onUploadProgress` event from Axios to track the
      // number of bytes uploaded to this point.
      onUploadProgress: evt => {
        const progress = (evt.bytesRead / fileSize) * 100;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, null);
        process.stdout.write(`${Math.round(progress)}% complete`);
      },
    }
  );
  console.log('\n\n');
  console.log(res.data);
  return res.data;
}

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

app.whenReady().then(sampleClient
  .authenticate(scopes)
  .then(() => runSample("../../Downloads/testCoverage.mp4")))


// if (module === require.main) {
//   const fileName = process.argv[2];
//   sampleClient
//     .authenticate(scopes)
//     .then(() => runSample("../../Downloads/testCoverage.mp4"))
//     .catch(console.error);
// }


