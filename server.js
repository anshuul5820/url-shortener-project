const express = require('express')
const ShortUrl = require('./models/shortUrl')
require('dotenv').config({ path: __dirname + '/.env' })

const app = express()
const mongoose = require('mongoose')

console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL)

app.set('view engine', 'ejs')
app.use(
  express.urlencoded({
    extended: false,
  })
)

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({
    full: req.body.fullurl,
  })
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)
  console.log(shortUrl)
  shortUrl.clicks++
  shortUrl.save()
  res.redirect(`https://${shortUrl.full}`)
})

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  console.log(shortUrls)
  res.render('index', { shortUrls })
})

app.listen(process.env.PORT || 5000, () =>
  console.log('server running on port 5000 🚀🚀🚀')
)
