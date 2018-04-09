window.video_control = {
  videos: {},
  next_index: -1,
  im_ready: 1,
  downloading: 0,
  insta_play: 0,
  stage: function(vid, mime, index, title, width, height) {
    if(this.im_ready == 0) {
      console.log("got next video, so now im ready")
      this.im_ready = 1
    }
    this.videos[index] = {vid: vid, mime: mime, title: title, width: width, height: height}
    this.next_index = index
    if(this.insta_play == 1) {
      this.play()
      this.insta_play = 0
    }
  },
  play: function() {
    if(this.im_ready == 1) {
      if(this.downloading == 0) {
        var index = this.next_index
        var title = this.videos[index].title
        $("#videoPlayer").remove()
        var style_str = "max-width: 100%; max-height: 100%; display: inline-block; vertical-align: middle;"
        var source_str = '<source src='+this.videos[index].vid+' type="'+this.videos[index].mime+'"></source>'
        var vid_str = "<video style='"+style_str+"' id='videoPlayer' autoplay>" + source_str + "</video>"
        $("#video_box_outer").append(vid_str)
        $("#qp").text(index)
        var vr = parseInt($("#vr").text())
        $("#vr").text(vr-1)
        $("#we_are_watching_s").text(title)
        // console.log("supposed to be empty", $("#videoPlayer"))
        // $("#videoPlayer").html('<source src='+this.videos[index].vid+' type="'+this.videos[index].mime+'"></source>');
        delete this.videos[index]
      } else {
          console.log("You are supposed to be playing a video right now but it hasnt downloaded yet")
          console.log("the video will start playing as soon as you download it, but you will be")
          console.log("slightly out of sync from everyone else")
          this.insta_play = 1
      }
    }
  }

}
