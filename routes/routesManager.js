module.exports = function(app) {
  var dataManager = require('../js/dataManager');

  // todoList Routes
  app.route('/cadata')
    .get(dataManager.getData)
    .post(dataManager.handlePayloads);
};