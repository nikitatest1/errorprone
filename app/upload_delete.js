const AWS            = require('aws-sdk')
const s3             = new AWS.S3()
const fs             = require('fs')
const cv             = require('./current_vids')

module.exports = function(path, mime, meta, ip, cd, db, ua, t, callback) {


  starter(path,mime, meta, ip, cd, db, ua, t) // this is because this is asynchronous, so I want to
                                      // make sure variables dont get mixed up from various requests
  function starter(a,b,c,d,e,f, g, title) {
    var file = __dirname.slice(0,-3) + a
    var rand_end = makeid()
    var name = a.slice(8) + rand_end
    var dot_ind = title.indexOf(".", -6)
    var new_title = title.substr(0,dot_ind)
    sendToS3(file, name, b, c, d, e, g, new_title)
  }

  function sendToS3(dir, name, mime, metad, rip, curr_date, ua, title) {
    fs.readFile(dir, function (err, data) {
    if (err) { console.log(err); }
      s3.putObject({
        Bucket: 'skobovbucket1',
        Key: name,
        Body: data,
        ACL: 'public-read',
        ContentType: mime
      },function (resp) {
        console.log('Successfully uploaded package.');
        insert_db(name, metad, mime, rip, curr_date, ua,title)
        delete_file(dir)
      });
    });
  }

  function delete_file(path) {
    fs.unlink(path,function(err){
      if(err) {console.log(err)} else {
          console.log('file deleted successfully');
      }
    })
  }

  function insert_db(name, metad, mime, rip, curr_date, ua, title) {
    var url = "https://s3.us-east-2.amazonaws.com/skobovbucket1/" + name
    var cdnurl = "http://d1ahv7jqi833s4.cloudfront.net/" + name
    db.collection("queued_vids").find().count(function(e, col) {
      if(e) {
        console.log(e)
      } else {
        db.collection("queued_vids").insertOne({title: title, index: col+1, device: ua, duration: metad.duration, date: curr_date, url: url, ip: rip, cdnurl : cdnurl, mime: mime, name: name, meta: metad})
        cv.set(col+1)
        callback(col+1)
      }
    })

  }


  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}
