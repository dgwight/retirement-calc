'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:CalcCtrl
 * @description
 * # CalcCtrl
 * Controller of the testApp
 */
angular.module('testApp')
  .controller('CalcCtrl', ["$scope", function ($scope) {
    var scope = $scope;
    scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    scope.progress = 0;
    scope.step = "step1";


    scope.showStep = function(step) {
        scope.step = step;
        scope.progress += 34;
    }

  }]);