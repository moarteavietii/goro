import './sentry';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv'
import express from 'express';

dotenv.config();

import { handleWebhook } from './webhook';
import { deploy } from "./deploy";

const { SSL_CERTIFICATE_FILE, SSL_PRIVATE_KEY_FILE, SERVER_PORT } = process.env;

// TODO: move this in a config file!
if (!SSL_CERTIFICATE_FILE || !SSL_PRIVATE_KEY_FILE) {
  console.error('Missing SSL_CERTIFICATE_FILE or SSL_PRIVATE_KEY_FILE in env');
  process.exit(1);
}

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
    await deploy(req.body?.head_commit?.modified?.includes('package.json'));
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
