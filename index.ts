const util = require('util');
const exec = util.promisify(require('child_process').exec);

const express = require('express');
const app = express()
const port = 9615

app.get('/', (req, res) => {
  res.send('Hello there')
})

app.post('/deploy', (req, res) => {
  exec('git pull origin master').then((resolve, reject) => {
    if(reject) {
      console.error(reject);
      res.status(500);
      res.send('Error');
    } else {
        res.send('Success');
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
