//const neuron            = require('./socket_brain')
const validate_username = require('./validate_username')
const validate_message  = require('./validate_message')
// const request           = require('request')
// const CronJob           = require('cron').CronJob

module.exports = function(port, io, dbase) {
  // neuron.on('connect', function () {

  var strm_time_remain = 0
  var curr_user_count = 0
  var q_pos = 0
  var vids_remain = 0

    io.on('connection', function(socket){
      var ip = socket.handshake.headers["x-real-ip"]
      console.log("someone connected: " + ip)
      console.log("connected id", socket.client.id)

      //neuron.emit('user_enter', 1)

      socket.on('disconnect', function() {
        var ip2 = socket.handshake.headers["x-real-ip"]
        console.log("someone disconnected: " + ip2)
        console.log("disconnected id:", socket.client.id)
        //neuron.emit('user_leave', 1)
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
            //neuron.emit('n2b', resp)
            socket.emit('n2c', resp)
            socket.broadcast.emit('n2c', resp)
          })
        } else {
          socket.emit('n2c', arg)
          //neuron.emit('n2b', arg)
        }
      })

      // neuron.on('b2n', function(arg) {
      //   console.log("received message from brain", arg)
      //   socket.emit('n2c', arg)
      // })
  })



}
