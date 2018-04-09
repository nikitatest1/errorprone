window.video_control = {
  videos: {},
  next_index: -1,
  stage: function(vid, mime, index, title) {
    this.videos[index] = {vid: vid, mime: mime, title: title}
    this.next_index = index
  },
  play: function() {
    console.log(this.videos)
    var index = this.next_index
    var title = this.videos[index].title
    $("#videoPlayer").remove()
    var source_str = '<source src='+this.videos[index].vid+' type="'+this.videos[index].mime+'"></source>'
    var vid_str = "<video id='videoPlayer' autoplay>" + source_str + "</video>"
    $("#video_box_outer").append(vid_str)
    $("#qp").text(index)
    $("#we_are_watching_s").text(title)
    // console.log("supposed to be empty", $("#videoPlayer"))
    // $("#videoPlayer").html('<source src='+this.videos[index].vid+' type="'+this.videos[index].mime+'"></source>');
    delete this.videos[index]
  }

}
