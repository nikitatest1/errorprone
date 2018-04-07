const ip            = require("ip");
const request       = require('request')

module.exports = function(port, app, db) {
  var strm_time_remain = 0
  var curr_user_count = 0
  var q_pos = 0
  var vids_remain = 0

  app.get("/", (req, res) => {
    var real_ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    var ua_device = req.headers['x-ua-device']
    var curr_date = new Date()
    //db.collection("test1").insertOne({test: curr_date})
    //db.collection("requests").insertOne({page: "home", device: ua_device, ip: real_ip, date: curr_date})
    res.render("dank_home", {port: port, yourip : real_ip, device: ua_device, server : ip.address(),
    vids_remain: vids_remain, strm_time_remain: strm_time_remain, curr_user_count: curr_user_count,
    people_title: "Nerds", q_pos: q_pos})
  })

// setInterval(function() {
//     console.log("interval")
//     var options = {
//       url: "http://18.218.241.80:8089/meta_data",
//       method: "POST"
//     }
//     request(options, function(err, response, body) {
//         if(err) {
//           console.log(err)
//         }
//         var parsed_body = JSON.parse(body)
//         console.log(parsed_body)
//         curr_user_count = parsed_body['count']
//         vids_remain = parsed_body['vids_remain']
//         q_pos = parsed_body['q_pos']
//         strm_time_remain = parsed_body['time_remain']
//     })
// },20000)

}
