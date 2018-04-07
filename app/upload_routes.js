const upload_delete = require('./upload_delete')
const cv            = require('./current_vids')
const probe         = require('node-ffprobe')
const fs            = require('fs')

module.exports = function(port, app, db, io, up) {
  var upload = up.single('upload')
  db.collection("queued_vids").find().count(function(e, col) {
    if(e) {
      //do nothing because by default it is -99999
    } else {
      cv.set(col)
    }
  })

  app.get("/", (req, res) => {
    var real_ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    var ua_device = req.headers['x-ua-device']
    var curr_date = new Date()
    db.collection("requests").insertOne({page: "upload", device: ua_device, ip: real_ip, date: curr_date})
    res.render("upload_home", {status: "", current_vids: cv.get()})
  })

  app.post("/", (req, res) => {
      var real_ip = req.headers['x-real-ip'] || req.connection.remoteAddress
      var ua_device = req.headers['x-ua-device']
      var curr_date = new Date()
      upload(req, res, function(err) {
        if(err) {
          if(err.length) {
              res.render("upload_home", {status: "Upload failed, must be mp4 or webm", current_vids: cv.get()})
          } else {
              res.render("upload_home", {status: "Upload failed, size must be less than 12.5MB", current_vids: cv.get()})
          }
        } else {
          var fullpath = __dirname.slice(0,-3) + req.file.path
          var title = req.file.originalname
          probe(fullpath, function(err, data) {
            if(err) {
              console.log(err)
            } else {
              if(data.format.duration <= 31) {
                var metad = {width: data.streams[0].width, height: data.streams[0].height,
                duration: data.format.duration, bytes: data.format.size, brate: data.format.bit_rate, format: data.format.format_name}
                upload_delete(req.file.path,req.file.mimetype, metad, real_ip, curr_date, db, ua_device, title, function(ind) {
                    res.render("upload_home", {status: "Success! Your video is in position " + ind + " of the queue.", current_vids: cv.get()})
                })
              } else {
                fs.unlink(fullpath, function(){}) //I have to use a callback for a simple deletion this is stupid
                res.render("upload_home", {status: "Upload failed, duration must be less than 30 seconds", current_vids: cv.get()})
              }
            }
          })
        }
        db.collection("upload_requests").insertOne({device: ua_device, ip: real_ip, file_data: req.file, date: curr_date})
      })
  })

  //Uploading doesnt need socket connections

}
