$(document).ready(function() {
  window.socket.on('n2c', function(arg) {
    if(arg.type == "username_response") {
      if(arg.response == 1) {
        window.client_info.set_username(arg.username)
        $("#usrname_input").val("")
        $("#enter_usrname").hide()
        $("#usrname_input_button").hide()
        $("#usrname_input").hide()
        $("#chat_not_ready").hide()
        $("#get_name").hide()
        $("#chat_input_field").show()
        console.log(window.client_info)
      } else {
        $("#usrname_input").val("")
        $("#usrname_input_button").text("Try Again")
        alert("sorry bad username")
      }
    } else if(arg.type == "message") {
      var message = "<div id='msg0'>" + "<span class='color_"+arg.color+"'>" + arg.username + " </span>" + "<span id='msg1'>"+arg.message + "</span>"+"</div>"
      window.chat_manage.add(message)
    } else if(arg.type == "meta") {
        // $("#vr").text(arg.vids_remain)
        $("#cuc").text(arg.curr_user_count)
        $("#strm").text(arg.strm_time_remain)
    } else if(arg.type == "next_video") {
      var req = new XMLHttpRequest();
      req.open('GET', arg.url, true);
      req.responseType = 'blob';
      window.video_control.downloading = 1;
      console.log("sending!")
      req.onload = function() {
        console.log("received!")
        if(this.status === 200) {
          var vidBlob = this.response;
          window.video_control.downloading = 0;
          var vid = URL.createObjectURL(vidBlob);
          if(window.client_info.debug == 0) { //debug is a temporary flag to prevent video sync for testing
              window.socket.emit('c2n', {type: "vsync"})
              window.video_control.stage(vid,arg.mime, arg.index, arg.title, arg.width, arg.height)
          }
        }
      }
      req.onerror = function() {
        console.log("error oh no")
      }
      req.send();
    } else if(arg.type == "play_video") {
      window.video_control.play()
    } else if(arg.type == "ready_check") {
      if(arg.cp == 1) {
        console.log("server is currently playing a video, im not ready")
        window.video_control.im_ready = 0
      } else {
        window.video_control.im_ready = 1
      }
    }
    // var time = Date.now()
    // var srvmsg = "ORIGINAL SIP:" + arg.servip + ", CLIENT IP:" + arg.ip + ", CLIENT PORT:" + arg.port
    // var par = "<p>" + "I received "+ arg.rand + " from " + srvmsg + " at " + time + " a difference of " +(time-arg.time) +" ms</p><br>"
    // $("body").append(par)
    // console.log("I received ", arg.rand, " from ", srvmsg ," at ", time, " a difference of ", (time - arg.time))
    console.log(arg)
  })
})
// window.socket_control = {
//   socket: "",
//   init: function(socket) {
//     this.socket = socket
//   },
//   emit: function(key, arg) {
//     this.socket.emit(key, arg)
//   },
//   on: function(key, )
// }
