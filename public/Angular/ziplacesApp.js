angular.module('ziplacesApp', []);

var locationListCtrl = function ($scope) {
    $scope.data = {
        locations: [{
            name: 'Burger Queen',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '0.296456',
            _id: '537'
        }]
    };
};

angular
.module('ziplacesApp')
.controller('locationListCtrl', locationListCtrl)
.filter('formatDistance', formatDistance)
.directive('ratingStars', ratingStars);

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
