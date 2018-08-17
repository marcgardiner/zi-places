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

module.exports.locationsCreate = function (req, res) {
    loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        },{
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
        }]
    }, function (err, location){
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, location);
        }
    });
};

var doAddReview = function (req, res, location) {
    if (!location) {
        sendJsonResponse(res, 404, {
            "message": "location not found"
        });
    } else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save(function (err, location){
            var thisReview;
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, thisReview);
            }
        })
    }
};

var doSetAverageRating = function (location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for (i=0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Average rating updatd to", ratingAverage);
            }
        });
    }
};

var updateAverageRating = function (locationid) {
    loc
    .findById(locationid)
    .select('rating reviews')
    .exec(
        function (err, location) {
            if (!err) {
                doSetAverageRating(location);
            }
        }
    );
};

module.exports.reviewsCreate = function (req, res) {
    var locationid = req.params.locationid;
    if (locationid) {
        loc
        .findById(locationid)
        .select('reviews')
        .exec(function (err, location){
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                doAddReview(req, res, location);
            }
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found locationid required"
        });
    }
};
