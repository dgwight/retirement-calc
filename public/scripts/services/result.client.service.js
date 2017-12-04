'use strict';

(function () {
    angular
        .module("testApp")
        .factory("ResultService", function ($http) {
            return {
                "createResult": createResult,
                "getResult": getResult
            };

            /**
             * Create a new result in the database
             * 
             * @param result       The result object
             */
            function createResult(result) {
                var url = "/result";
                return $http.post(url, result);
            }

            /**
             * Get a result from the database
             * 
             * @param resultId      String, The unique result id
             */
            function getResult(resultId) {
                var url = `result/${resultId}`;
                
                return $http.get(url)
                    .then(function (response) {
                        return response.data;
                    });
            }
        });
})();
