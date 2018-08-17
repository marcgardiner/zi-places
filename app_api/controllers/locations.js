var mongoose = require('mongoose');
var loc = mongoose.model('Location');

var theEarch = (function () {
    var earchRadius = 6371;
    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads: getDistanceFromRads,
        getDistanceFromRads: getRadsFromDistance
    };
});

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationsCreate = function (req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsListByDistance = function (req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        loc
        .findById(req.params.locationid)
        .exec(function (err, location) {
            if (!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, location);
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};

module.exports.locationsListByDistance = function (req, res) {
    var lng = parseInt(req.query.lng);
    var lat = parseInt(req.query.lat);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: theEarch.getRadsFromDistance(20),
        num: 10
    };
    if (!lng || !lat) {
        sendJsonResponse(res, 404, {
            "message": "lng and lat query parameters are required"
        });
        return;
    }
    loc.geoNear(point, geoOptions, function (err, results, stats){
        var locations = [];
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            results.forEach(function (doc) {
                locations.push({
                    distance: theEarch.getDistanceFromRads(doc.dis),
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });
            sendJsonResponse(res, 200, locations);
        }
    });
};
