var request = require('request');
var apiOptions = {
    server: "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://heroku.com";
}

var renderHomepage = function(req, res, responseBody) {
    res.render('locations-list', {
        title: "find a place to work with wifi",
        pageHeader: {
            title: 'zi-places',
            strapline: 'Find places to work with wifi near you'
        },
        sidebar: "Looking for wifi and a seat?",
        locations: responseBody
    });
};

module.exports.homeList = function(req, res) {
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
        qs: {
            lng: -0.792,
            lat: 51.37,
            maxDistance: 20
        }
    };
    request(requestOptions,
        function(err, response, body) {
            renderHomepage(req, res, body);
        }
    );
};

module.exports.locationInfo = function(req, res) {
    res.render('location-info', {title: 'Location Info'});
};

module.exports.addReview = function(req, res) {
    res.render('location-review-form', {title: 'Add Review'});
};
