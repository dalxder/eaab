/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';



App.controller('inputController', ['$rootScope', '$scope','$mdDialog',"fileReader", function ($rootScope, $scope,$mdDialog,fileReader) {

        $scope.upload = function (ev) {
           

            if ($scope.fileName) {
                $mdDialog.show({
                  contentElement: '#myDialog',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: false
                });
            

        fileReader.readAsText($scope.fileName, $scope)
        .then(function(result) {
                                        //Actuaiza las variables
                        $scope.mostrar = false;
                        $scope.fileName = null;
                        $rootScope.mostrarTabla = true;
                        $rootScope.labels = result.labels;
                        $rootScope.json = result.json;

                        $mdDialog.hide();
        });
      
            }
        };

    }]);


