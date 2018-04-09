const neuron            = require('./socket_brain')
const validate_username = require('./validate_username')
const validate_message  = require('./validate_message')
const request           = require('request')
const CronJob           = require('cron').CronJob

const sio               = require('socket.io-client');
const v_neuron          = sio.connect("http://18.218.241.80:3009/", {
    reconnection: true
});

module.exports = function(port, io, dbase) {
  // neuron.on('connect', function () {


  v_neuron.on('play_video', function(arg) {
    io.sockets.emit('n2c', {type: 'play_video'})
  })

  v_neuron.on('next_video', function(arg) {
    console.log("received vid from brain", arg.title)
    for(user in my_clients) {
      my_clients[user].downloaded = 0
    }
    var url = arg.cdnurl
    var new_url = url.replace("http:", "https:")
    io.sockets.emit('n2c', {type: 'next_video', url: new_url, mime: arg.mime, index: arg.index, title: arg.title})
    setTimeout(function() {
      check_if_ready(6)
    }, 1000)
  })

  function check_if_ready(times) {
      if(times >= 0) {
        var num_users = Object.keys(my_clients).length
        var num_users_ready = 0
        for(user in my_clients) {
          num_users_ready += my_clients[user].downloaded
        }
        var threshold1 = 0.8;
        var percent_ready = num_users_ready / num_users
        if(percent_ready >= threshold1) {
          console.log("percent_ready:", percent_ready)
          v_neuron.emit('neuron_ready', 1)
        } else {
          if(num_users == 0) {
            v_neuron.emit('neuron_ready', 1)
          } else {
            console.log("not ready, percent_ready:", percent_ready)
            setTimeout(function() {
              check_if_ready(times-1)
            }, 1000)
          }
        }
      } else {
        v_neuron.emit('neuron_ready', 1) //falback case
      }
  }

  var strm_time_remain = 0
  var curr_user_count = 0
  var q_pos = 0
  var vids_remain = 0
  var my_clients = {}

    io.on('connection', function(socket){
      var ip = socket.handshake.headers["x-real-ip"]
      console.log("someone connected: " + ip)
      my_clients[socket.client.id] = {downloaded: 0}
      console.log("connected id", socket.client.id)

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
            my_clients[socket.client.id].downloaded = 1
          } catch(e) {
            console.log("couldnt set downloaded to 1")
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
      vids_remain:vids_remain,
      strm_time_remain: strm_time_remain,
      curr_user_count: curr_user_count,
      client: 1
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
          vids_remain = parsed_body['vids_remain']
          strm_time_remain = parsed_body['time_remain']
      })
  },40000)

}
