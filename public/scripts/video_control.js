window.video_control = {
  videos: {},
  next_index: -1,
  stage: function(vid, mime, index) {
    this.videos[index] = {vid: vid, mime: mime}
    this.next_index = index
  },
  play: function() {
    console.log(this.videos)
    var index = this.next_index
    $("#videoPlayer").remove()
    var source_str = '<source src='+this.videos[index].vid+' type="'+this.videos[index].mime+'"></source>'
    var vid_str = "<video id='videoPlayer' autoplay>" + source_str + "</video>"
    $("#video_box_outer").append(vid_str)
    // console.log("supposed to be empty", $("#videoPlayer"))
    // $("#videoPlayer").html('<source src='+this.videos[index].vid+' type="'+this.videos[index].mime+'"></source>');
    delete this.videos[index]
  }

}
