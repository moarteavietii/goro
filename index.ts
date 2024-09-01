const express = require('express')
const app = express()
const port = 9615

app.get('/', (req, res) => {
  res.send('Hello there')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
