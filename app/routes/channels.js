const express = require('express')
const router = express.Router()

const channels = require('../lib/channels')

const Chromecast = require('../models/Chromecast')
const Channel = require('../models/Channel')

const port = require('../lib/config').port
const squashKeyedArrays = require('../lib/squashKeyedArrays')
const cleanObject = require('../lib/cleanObject')

router.use((req, res, next) => {
  if (req.body.URLs) req.body.URLs = req.body.URLs.filter(u => u.trim() != '')
  next()
})

router.get('/', (req, res) => {
  res.render('index', { render: 'channels', channels: channels.list() })
})

router
  .route('/new')
  .get((req, res) => {
    res.render('index', {
      render: 'channel',
      host: `${req.protocol}://${req.hostname}:${port}/`
    })
  })
  .post((req, res) => channels.create(req.body, id => res.send(id)))

router.get('/:channel_id', (req, res) => {
  let channel = channels.withId(req.params.channel_id)
  console.log("preview1=>",JSON.stringify(channel));
  let urls =[]
      for (let i =0; i<= channel.URLs.length;i++){
        if(channel.URLs[i] !=='' && channel.durations[i] !== ''){
          u = {
            url : channel.URLs[i],
            duration: channel.durations[i]
          }
          urls.push(u);
        }
      }
   // let newUrls = urls.filter(function(v){return v.url!==''})
     //channel.list = newUrls;
    let newChanell = {
      list: urls,
      _id:channel._id,
      name:channel.name,
      layout:channel.layout,
      duration:channel.duration,
      URLs:channel.URLs
    }
  if (channel)
    res.render(`layouts/${channel.layout}`, {
      channel: newChanell,
      casting: false
    })
  else res.render('layouts/empty', { casting: false })
})

router
  .route('/:channel_id/edit')
  .get((req, res) => {
    let channel = channels.withId(req.params.channel_id)
    let urls =[]
    console.log("edit chanel=>"+JSON.stringify(channel));

    if(channel) {
      for (let i =0; i<=channel.URLs.length;i++){
      
        if(channel.durations[i] !== ''){
          u = {
            url : channel.URLs[i],
            duration: channel.durations[i]
          }
          urls.push(u);
        }
          
      }
         
    }

    let newUrls = urls.filter(function(v){return v.url!==''});
    channel.list = newUrls;
    console.log("urls=>"+JSON.stringify(newUrls));

    let newChanell = {
      list: newUrls,
      _id:channel._id,
      name:channel.name,
      layout:channel.layout,
      duration:channel.duration,
      URLs:channel.URLs

    }
    console.log("edit==>",JSON.stringify(channel.list));
    if (newChanell)
      res.render('index', {
        render: 'channel',
        channel: newChanell,
        host: `${req.protocol}://${req.hostname}:${port}/`
      })
    else res.render('index', {})
  })
  .post((req, res) => {
    channels.update(req.params.channel_id, squashKeyedArrays(req.body), id =>
      res.send(id)
    )
  })
  .delete((req, res) =>
    channels.remove(req.params.channel_id, () => res.sendStatus(200))
  )

module.exports = router
