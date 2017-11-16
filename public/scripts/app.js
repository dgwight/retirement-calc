'use strict';

/**
 * @ngdoc overview
 * @name testApp
 * @description
 * # testApp
 *
 * Main module of the application.
 */
angular
  .module('testApp', [
        'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'views/calc.html',
          controller: 'CalcCtrl',
          controllerAs: 'calc'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
