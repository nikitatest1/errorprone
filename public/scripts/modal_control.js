window.modal_control = {
  active: 0,
  stages: [],
  stage_pointer: 0,
  pop: function(markup, duration, posX, posY, width, height) { //pos and dimensions in %
    if(this.active == 0) {
      this.active = 1
      if(posX == -1 && posY == -1) {
        var mleft = (100 - width) / 2
        var mtop = (100 - height) / 2
        $(".modal-content").css({'top': "50%", 'transform': 'translate(0,-50%)', 'margin-left': mleft +"%", 'width': width+"%", "height": height+"%"})
      } else {
          $(".modal-content").css({"margin-left": posX+"%", "margin-top":posY+"%", "width": width+"%", "height": height+"%"})
      }
      $(".modal-content").append(markup)
      $("#dynamic_modal").show()
      if(duration != 0) {
        setTimeout(function() {
          $(".modal-content").empty()
          $("#dynamic_modal").hide()
          console.log(window.modal_control.stages)
          if(window.modal_control.stages.length > 0) {
              var c_obj = this.stages[0]
              this.pop(c_obj.markup,c_obj.duration,c_obj.posX,c_obj.posY,c_obj.width,c_obj.height)
              this.stages.splice(0,1)
          }
          this.active = 0
        }, duration)
      }
    } else {
      console.log("pushing")
      this.stages.push({markup:markup,duration:duration,posX:posX,posY:posY,width:width,height:height})
    }


      //add stuff such as checking if its already active,
      //make the position, width and height, duration work properly
      //hide the modal, and remove the content when the duration ends
      //this will need other functions and variables, this is just
      //a placeholder
  }
}
