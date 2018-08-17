var mongoose = require('mongoose');
var loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationsCreate = function(req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsListByDistance = function(req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};
