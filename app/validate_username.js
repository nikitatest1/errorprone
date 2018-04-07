module.exports = function(username, callback) {
  if(username.toUpperCase().includes("NIGGER")) {
    callback({type: "username_response", response: 0})
  } else {
    console.log("this gets printed")
    callback({type: "username_response", response: 1, username: username})
  }
}
