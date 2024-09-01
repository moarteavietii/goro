import './src/sentry';
import config from './src/config';

import fs from 'fs';
import https from 'https';
import express from 'express';

import { handleWebhook } from './src/webhook';
import { deploy } from "./src/deploy";

const port = parseInt(config.SERVER_PORT, 10);
const app = express()
app.use(express.json());

const certificate  = fs.readFileSync(config.SSL_CERTIFICATE_FILE, 'utf8');
const privateKey = fs.readFileSync(config.SSL_PRIVATE_KEY_FILE, 'utf8');
const credentials = {key: privateKey, cert: certificate};

const httpsServer = https.createServer(credentials, app);

app.get('/', (req, res) => {
  res.send('Hello there')
});

app.post('/deploy', async (req, res) => {
  // TODO: maybe make this a middleware
  const signature = req.headers["x-hub-signature-256"];
  const content = JSON.stringify(req.body);
  const verified = await handleWebhook(content, signature);

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
});
