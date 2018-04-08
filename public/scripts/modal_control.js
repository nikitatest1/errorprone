window.modal_control = {
  active: 0,
  pop: function(markup, posX, posY, duration, width, height) {
      $(".modal-content").append(markup)
      $("#dynamic_modal").show()
      //add stuff such as checking if its already active,
      //make the position, width and height, duration work properly
      //hide the modal, and remove the content when the duration ends
      //this will need other functions and variables, this is just
      //a placeholder
  }
}
