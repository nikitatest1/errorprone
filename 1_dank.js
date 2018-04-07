const express        = require('express')
// const multer         = require('multer')
const MongoClient    = require('mongodb').MongoClient
const db             = require('./config/db.js')
const app            = express()
const helmet         = require('helmet')
const path           = require('path')
const server         = require('http').createServer(app);
const io             = require('socket.io')(server);
const port           = 8081
const sio            = require('socket.io-client');
const neuron         = sio.connect("http://18.218.241.80:3000/", {
    reconnection: true
});
neuron.on('connect', function() {
  console.log("connected to brain")
})

// const upload         = multer({
//   dest: 'uploads/',
//   limits: {fileSize: 1000 * 1000 * 13}, //13 MB?
//   fileFilter: function (req, file, cb) {
//     var filetypes = /mp4|webm/;
//     var mimetype = filetypes.test(file.mimetype);
//     var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb("Error: File upload only supports the following filetypes - " + filetypes);
//   }
// });

app.use(express.json())
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))
app.use("/static", express.static(path.join(__dirname, "public")))
app.use("/", express.static(path.join(__dirname, '/node_modules')));
app.use(helmet())

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  var dbase = database.db("dankstream")

  require('./app/main_routes.js')(port, app, dbase)
  require('./app/socket_client.js')(port, io, dbase)
  require('./app/socket_brain.js').init(neuron)
  server.listen(port, () => {
    console.log('We are live on ' + port)
  })

})



//

//
// neuron.on('connect', function () {
//
  // io.on('connection', function(socket){
  //   var ip = socket.handshake.headers["x-real-ip"]
  //   console.log("someone connected: " + ip)
  //
  //   socket.on('disconnect', function() {
  //     var ip2 = socket.handshake.headers["x-real-ip"]
  //     console.log("someone disconnected: " + ip2)
  //   })
  //
  //   socket.on('from_client', function(obj) {
  //     neuron.emit('to_brain', obj)
  //   })
  //   neuron.on('from_brain', function(obj) {
  //     socket.emit('to_client', obj)
  //   })
  // })
//
//     console.log('connected to localhost:3000')
// });
