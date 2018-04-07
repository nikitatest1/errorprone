module.exports = {
  current_vids : -99999,
  get: function() {
    return current_vids
  },
  set: function(val) {
    current_vids = val
  },
  inc: function() {
    current_vids = current_vids + 1
  }
}
