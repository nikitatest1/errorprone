module.exports = {
  neuron: "q",
  init: function(neuron) {
    this.neuron = neuron
  },
  emit: function(key, message) {
    this.neuron.emit(key, message)
  },
  on: function(key, callback) {
    this.neuron.on(key, function(arg) {
      callback(arg)
    })
  }

}
