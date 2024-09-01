const fs = require('fs');
const util = require('util');
const https = require('https');
const express = require('express');
require('dotenv').config();

// TODO: remove

const { SSL_CERTIFICATE_FILE, SSL_PRIVATE_KEY_FILE, DEPLOY_KEY, SERVER_PORT } = process.env;
const exec = util.promisify(require('child_process').exec);

const port = parseInt(SERVER_PORT || '9615', 10);
const app = express()
app.use(express.json());

const certificate  = fs.readFileSync(SSL_CERTIFICATE_FILE, 'utf8');
const privateKey = fs.readFileSync(SSL_PRIVATE_KEY_FILE, 'utf8');
const credentials = {key: privateKey, cert: certificate};

const httpsServer = https.createServer(credentials, app);

app.get('/', (req, res) => {
  res.send('Hello there')
})

app.post('/deploy', (req, res) => {
  if (req.body?.key !== DEPLOY_KEY) {
    res.status(401);
    res.send('Unauthorized');
    return;
  }

  exec('git pull').then((resolve, reject) => {
    // TODO: add bun install after pull
    if (reject) {
      console.error(reject);
      res.status(500);
      res.send('Error');
    } else {
        res.send('Success');
    }
  });
});

//TODO: add http listener and redirect to https
httpsServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
