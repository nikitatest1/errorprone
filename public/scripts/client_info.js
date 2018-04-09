window.client_info = {
  username : "",
  chat_color: "",
  debug: 0,
  set_username : function(username) {
    this.username = username
    this.chat_color = pick_color()
    var color = ""
    if(this.chat_color == 'd') {
      color = "purple"
    } else if(this.chat_color == 'a') {
      color = 'yellow'
    } else if(this.chat_color == 'b') {
      color = 'blue'
    } else if(this.chat_color == 'c') {
      color = 'coral'
    } else if(this.chat_color == 'e') {
      color = 'red'
    } else if(this.chat_color == 'f') {
      color = 'orange'
    } else if(this.chat_color == 'g') {
      color = 'green'
    } else if(this.chat_color == 'h') {
      color = 'aqua'
    } else if(this.chat_color == 'i') {
      color = 'pink'
    }
    $(".pick_color").each(function(i) {
      console.log(i)
      if($(this).attr('id').includes(color)) {
        $(this).css("outline", "3px solid black")
        console.log("found it:", $(this).attr('id'))
      } else {
          $(this).css("outline", "")
      }
    })
    // $().css("outline", "3px solid black")
  }
}

function pick_color() {
  var text = "";
  var possible = "abcdefghi";
  text = possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

window.chat_manage = {
  position: 0,
  chat_hidden: 0,
  scroll_in_use: 0,
  add: function(message) {
    if(this.chat_hidden == 0) {
        $("#mainchat").append(message)
        this.scroll()
        this.only100()
    }
  },
  scroll: function() {
    var scroll_positon = $("#mainchat").scrollTop()
    if(scroll_positon >= this.position) {
      $("#mainchat").animate({ scrollTop: 20000000 }, "fast");
      this.position = $("#mainchat").scrollTop()
    }
  },
  only100: function() {
    var number_of_messages = $("#mainchat #msg0").length
    if(number_of_messages > 100) {
      var num_to_delete = number_of_messages - 100
      $("#mainchat").find("#msg0:lt("+num_to_delete+")").remove()
    }

  }
}
