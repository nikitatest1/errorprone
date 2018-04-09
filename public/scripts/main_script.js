$(document).ready(function() {
    socket = io.connect()
    console.log(window.socket)

    $("#chat_not_ready").hover(function() {
        $("#chat_not_ready").fadeTo(200,1)
        $("#get_name").fadeTo(200,1)
        $("#chat_input_field").hide()
    }, function() {
        $("#chat_input_field").show()
        $("#chat_not_ready").fadeTo(200,0)
        $("#get_name").fadeTo(200,0)
    })

    $(".chat_opts_butts").hover(function() {
        $(this).fadeTo(100,0.3)
    }, function() {
        $(this).fadeTo(100,1)
    })

    $(".pick_color").hover(function() {
      $(this).fadeTo(100,0.3)
    }, function() {
      $(this).fadeTo(100,1)
    })

    $("#chatoptions").hover(function() {
        $(this).fadeTo(100,0.3)
    }, function() {
        $(this).fadeTo(100,1)
    })

    $("#chatsubmit").hover(function() {
      $("#chatsubmit").fadeTo(200,0.5)
    }, function() {
      $("#chatsubmit").fadeTo(200,1)
    })

    $("#get_name").hover(function() {
      $("#get_name").fadeTo(100,0.3)
    }, function() {
      $("#get_name").fadeTo(100,1)
    })

    $("#get_name").click(function() {
      $("#enter_usrname").css("z-index", '11')
      $("#enter_usrname").css("opacity", "1")
    })

    $("#usrname_input_button").click(function() {
      var username = $("#usrname_input").val()
      $("#usrname_input_button").text("...")
      window.socket.emit('c2n', {type: "enter_username", username: username})
    })

    $("#chatsubmit").click(function() {
      var message = $("#chat_input_field").val()
      $("#chat_input_field").val("")
      window.socket.emit('c2n', {type: "message", message: message, client_info: window.client_info})
    })

    $("#chat_input_field").keypress(function(e) {
      if(e.which == 13) {
        var message = $("#chat_input_field").val()
        $("#chat_input_field").val("")
        window.socket.emit('c2n', {type: "message", message: message, client_info: window.client_info})
      }
    })

    $("#chatoptions").click(function() {
      $("#enter_usrname").hide()
      $("#chat_not_ready").hide()
      $("#chatoptions").hide()
      $("#chatfield").hide()
      $("#chatsubmit").hide()
      $("#chat_opts").css("z-index", '13')
      $("#chat_opts").show()
    })

    $("#close_chat_options").click(function() {
      if(window.client_info.username == "") {
          $("#enter_usrname").show()
          $("#chat_not_ready").show()
          $("#chatoptions").show()
          $("#chatfield").show()
          $("#chatsubmit").show()
          $("#chat_opts").css("z-index", '1')
          $("#chat_opts").hide()
      } else {
          $("#chat_opts").hide()
          $("#chat_opts").css("z-index", '1')
          $("#chatoptions").show()
          $("#chatfield").show()
          $("#chatsubmit").show()
      }
    })

    $(".pick_color").click(function() {
      var id_color = $(this).attr('id')
      if(id_color.includes("purple")) {
        window.client_info.chat_color = "d"
      } else if(id_color.includes("yellow")) {
        window.client_info.chat_color = "a"
      } else if(id_color.includes("blue")) {
        window.client_info.chat_color = "b"
      } else if(id_color.includes("coral")) {
        window.client_info.chat_color = "c"
      } else if(id_color.includes("red")) {
        window.client_info.chat_color = "e"
      } else if(id_color.includes("orange")) {
        window.client_info.chat_color = "f"
      } else if(id_color.includes("green")) {
        window.client_info.chat_color = "g"
      } else if(id_color.includes("aqua")) {
        window.client_info.chat_color = "h"
      } else if(id_color.includes("pink")) {
        window.client_info.chat_color = "i"
      }

      $(".pick_color").each(function(i) {
        $(this).css("outline", "")
      })
      $(this).css("outline", "3px solid black")
    })

    $("#hide_chat").click(function() {
      console.log("hiding chat")
      $("#chat_is_hidden").show()
      window.chat_manage.chat_hidden = 1
    })

    $("#unhide_chat").click(function() {
      $("#chat_is_hidden").hide()
      window.chat_manage.chat_hidden = 0
    })

    // $("#get_name").hover(function() {
    //     console.log("entering")
    //     $("#chat_not_ready").fadeTo(1,1)
    //     $("#get_name").fadeTo(1,1)
    // }, function() {
    //   $("#chat_not_ready").fadeTo(1,0)
    //   $("#get_name").fadeTo(1,0)
    // })

    $("#test").click(function() {
      var markup = "<div>" + "<p style='color: blue;'>Helooooo</p>" + "</div>"
      // window.modal_control.pop(markup,0,-1,-1,10,10)

      var delay = Math.random() * 10000
      console.log("delaying for", delay)
      var rand_width = Math.random() * 100
      window.modal_control.pop(markup, delay, 20,20, rand_width,50)
      //console.log($("#mainchat").scrollTop())
      //console.log("this position:", window.chat_manage.position)

      //use this for testing server client readyness
      //window.client_info.debug = 1


      // var port = $("#port").text()
      // var myip = $("#myip").text()
      // var servip = $("#serverip").text()
      // var rand = Math.random()
      // var time = Date.now()
      // console.log("i emitted ", rand, " at ", time)
      // var par = "<p>" + "I emitted " + rand + " at " + time + "</p>"
      // $("body").append(par)
      // window.socket.emit('c2n', {rand: rand, time : time, ip: myip, servip: servip, port: port})
    })


    // socket.on('boo', function(arg1) {
    //   console.log(arg1)
    // })

})
