const neuron            = require('./socket_brain2')
const validate_username = require('./validate_username')
const validate_message  = require('./validate_message')
const request           = require('request')
const CronJob           = require('cron').CronJob
const ip                = require('ip')
const sio               = require('socket.io-client');
const v_neuron          = sio.connect("http://18.218.241.80:3009/", {
    reconnection: true
});

module.exports = function(port, io, dbase) {
  // neuron.on('connect', function () {
  var modal_delay = 5000
  var current_video = {port: port, servip: ip.address(),playing: 0, download_delay: 0, threshold: 0, ready_flag: 0, index: 0,duration: 0, num_finished: 0, played_on: 0, num_users: 0}
  var strm_time_remain = 0
  var curr_user_count = 0
  var q_pos = 0
  var vids_remain = 0
  var my_clients = {}


  v_neuron.on('play_video', function(arg) {
    current_video.playing = 1
    console.log("telling clients to play index:", current_video.index, "cv:", current_video)
    var now = new Date()
    current_video.played_on = now
    setTimeout(function() {
        current_video.playing = 0
    },current_video.duration + modal_delay)
    io.sockets.emit('n2c', {type: 'play_video'})
  })

  v_neuron.on('next_video', function(arg) {
    console.log("received vid from brain", arg.index)
    var num_users = 0
    for(user in my_clients) {
      num_users += 1
      my_clients[user].downloaded = 0
    }
    var new_url = arg.cdnurl.replace("http:", "https:")
    current_video.duration = arg.duration * 1000
    var download_delay = (arg.meta.bytes * 8) / 2000000 //number of total bits divided
                                                        //by number of bits per second for avg download
    download_delay = download_delay * 1000 //seconds to ms
    if(download_delay < 2000) {
      download_delay = 2000 // incase its a very small file, make delay 2 seconds
    }
    current_video.download_delay = download_delay
    console.log("num users:", num_users)
    current_video.num_users = num_users
    var threshold = 0.8
    if(num_users <= 5) {
      threshold = 0.4
    } else if(num_users <= 10) {
      threshold = 0.5
    } else if(num_users <= 50) {
      threshold = 0.6
    } else if(num_users <= 100) {
      threshold = 0.7
    }
    current_video.threshold = threshold
    current_video.ready_flag = 0
    current_video.num_finished = 0
    current_video.index = arg.index
    io.sockets.emit('n2c', {type: 'next_video', url: new_url, mime: arg.mime, index: arg.index, title: arg.title, width: arg.meta.width, height: arg.meta.height})
    console.log("setting fallback delay for", download_delay)
    setTimeout(function() {
      if(current_video.ready_flag == 0) {
        v_neuron.emit('neuron_ready', 1)
        current_video.ready_flag = 1
        console.log("FALLBACK USERS DIDNT FINISH DOWNLOADING IN TIME")
        //this is a fallback. tell brain
        //that everyone is ready once the average
        //downloader has finished
      }
    }, download_delay)
  })


  io.on('connection', function(socket){
    var ip = socket.handshake.headers["x-real-ip"]
    console.log("someone connected: " + ip)
    my_clients[socket.client.id] = {downloaded: 0}
    console.log("connected id", socket.client.id)
    socket.emit('n2c', {type: 'ready_check', cp: current_video.playing})
    neuron.emit('user_enter', 1)

    socket.on('disconnect', function() {
      var ip2 = socket.handshake.headers["x-real-ip"]
      console.log("someone disconnected: " + ip2)
      console.log("disconnected id:", socket.client.id)
      try {
          delete my_clients[socket.client.id]
      } catch(e) {
        console.log("couldnt find that key")
      }
      neuron.emit('user_leave', 1)
    })

    socket.on('c2n', function(arg) {
      console.log("received message from client", arg)
      if(arg.type == "enter_username") {
        validate_username(arg.username, function(resp) {
          console.log("emitting response")
          socket.emit('n2c', resp)
        })
      } else if(arg.type == "message") {
        validate_message(arg.message, arg.client_info, function(resp) {
          neuron.emit('n2b', resp)
          socket.emit('n2c', resp)
          socket.broadcast.emit('n2c', resp)
        })
      } else if(arg.type == 'vsync') {
        try {
          if(arg.index == current_video.index) {
              if(my_clients[socket.client.id].downloaded == 0) {
                my_clients[socket.client.id].downloaded = 1
                current_video.num_finished += 1
                var num_users = current_video.num_users
                var threshold = current_video.threshold
                if( (current_video.num_finished / num_users) >= threshold ) {
                    if(current_video.ready_flag == 0) {
                      v_neuron.emit('neuron_ready',1)
                      current_video.ready_flag = 1
                    }
                }
              }
          }
        } catch(e) {
          console.log("some error accessing user socket id")
          console.log(e)
        }
      } else {
        socket.emit('n2c', arg)
        neuron.emit('n2b', arg)
      }
    })

    // neuron.on('serv_ping', function(arg) {
    //   console.log("received ping")
    //   neuron.emit('serv_pong', 1)
    // })

    neuron.on('b2n', function(arg) {
      console.log("received message from brain", arg)
      socket.emit('n2c', arg)
    })
})

  setInterval(function() {
    var metad = {
      type: "meta",
      // vids_remain:vids_remain,
      strm_time_remain: strm_time_remain,
      curr_user_count: curr_user_count,
      client: 2
    }
    io.emit('n2c', metad)
  }, 42000) //one every 42 seconds

  setInterval(function() {
      var options = {
        url: "http://18.218.241.80:8089/meta_data",
        method: "POST"
      }
      request(options, function(err, response, body) {
          if(err) {
            console.log(err)
          }
          var parsed_body = JSON.parse(body)
          curr_user_count = parsed_body['count']
          // vids_remain = parsed_body['vids_remain']
          strm_time_remain = parsed_body['time_remain']
      })
  },40000) //every 40 seconds

}
