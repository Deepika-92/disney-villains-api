const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { getAllVillains, getVillainBySlug, createNewVillain } = require('./controllers/villains')



app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainBySlug)

app.post('/villains', bodyParser.json(), createNewVillain)

app.listen((23360), () => {
  console.log('Listening to 23360 ...') // eslint-disable-line no-console
})

