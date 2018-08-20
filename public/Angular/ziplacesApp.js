angular.module('ziplacesApp', []);

var locationListCtrl = function ($scope, ziplacesData) {
    $scope.message = "Searching for nearby places";
    ziplacesData
    .success(function (data) {
        $scope.message = data.length > 0 ? "" : "No locations found";
        $scope.data = {locations: data};
    })
    .error(function (e) {
        $scope.message = "sorry, something's gone wrong";
    });
};

angular
.module('ziplacesApp')
.controller('locationListCtrl', locationListCtrl)
.filter('formatDistance', formatDistance)
.directive('ratingStars', ratingStars)
.service('ziplacesData', ziplacesData);

var _isNumeric = function (n) {
    return !isNan(parseFloat(n)) && isFinite(n);
};

var formatDistance = function () {
    return function (distance) {
        var numDistance, unit;
        if (distance && _isNumeric(distance)) {
            if (distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            } else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }
            return numDistance + unit;
        } else {
            return "?";
        }
    };
};

var ratingStars = function () {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: '/angular/rating-stars.html'
    };
};

var ziplacesData = function ($http) {
    return $http.get('/api/locations?lng=-0.79&lat=51.3&maxDistance=20');
};
