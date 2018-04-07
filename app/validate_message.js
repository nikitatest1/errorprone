module.exports = function(message, client_info, callback) {
  console.log(client_info)
  callback({type: "message", username: client_info.username, color: client_info.chat_color, message: message})
}
