const fs = require('fs');
const util = require('util');
const https = require('https');
const express = require('express');
require('dotenv').config();

import { handleWebhook } from './webhook';

const { SSL_CERTIFICATE_FILE, SSL_PRIVATE_KEY_FILE, SERVER_PORT } = process.env;
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

app.post('/deploy', async (req, res) => {
  // TODO: maybe make this a middleware
  const content = JSON.stringify(req.body);
  const signature = req.headers["x-hub-signature-256"];
  const verified = await handleWebhook(signature, content);

  if (!verified) {
    res.status(401);
    res.send('Unauthorized');
    return;
  }

  console.log('deploying');

  try {
    await exec('git pull');

    if (req.body.modified.includes('package.json')) {
      await exec('bun install');
    }

    console.log('deploy successful');
    res.send('Success');
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send('Error');
  }
});

//TODO: add http listener and redirect to https
httpsServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
