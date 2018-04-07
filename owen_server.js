const express        = require('express')
const app            = express()
const helmet         = require('helmet')
const path           = require('path')
const server         = require('http').createServer(app);
const port           = 8081
const io             = require('socket.io')(server);

app.use(express.json())
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))
app.use("/static", express.static(path.join(__dirname, "public")))
app.use("/", express.static(path.join(__dirname, '/node_modules')));
app.use(helmet())

server.listen(port, () => {
  console.log('We are live on ' + port)
})
var dbase = 1
require('./app/owen_main_routes.js')(port, app, dbase)
require('./app/owen_socket_client.js')(port, io, dbase)
