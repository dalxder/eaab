/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('myApp').factory('RegService', ['$http', '$q', function($http, $q){

    var REST_SERVICE_URI = 'http://172.18.58.64:8080/sigca/balance/regvigencia/';

    var factory = {
        fetchAllReg: fetchAllReg,
        createReg: createReg/*,
        updateUser:updateUser,
        deleteUser:deleteUser*/
    };

    return factory;

    function fetchAllReg() {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Users');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function createReg(d) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI, d)
            .then(
            function (response) {
                console.log("se ha enviado: "+ d+" respo:" + response.data);
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error al ingresar datos');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

/*
    function updateUser(user, id) {
        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI+id, user)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function deleteUser(id) {
        var deferred = $q.defer();
        $http.delete(REST_SERVICE_URI+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }*/

}]);


