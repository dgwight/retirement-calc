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
      .when('/:resultId', {
          templateUrl: 'views/result.client.view.html',
          controller: 'ResultCtrl',
          controllerAs: 'result'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
