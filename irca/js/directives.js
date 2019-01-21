/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

//Directiva nueva etiqueta 'inputFile'
App.directive('inputFile', function () {
    var directive = {
        restrict: 'E',
        template: '<input id="fileInput" type="file" class="ng-hide"> <md-input-container  md-no-float>    <input id="textInput" ng-model="fileName.name" type="text" placeholder="Seleccionar archivo" ng-readonly="true"></md-input-container><md-button id="uploadButton" ng-click="upload($event)" class="md-raised md-primary" aria-label="attach_file" ng-show="mostrar">Procesar</md-button>',
        link: function (scope) {
            var input = document.getElementById('fileInput');
            var textInput = document.getElementById('textInput');
            scope.mostrar = false;
            if (input && textInput) {
                textInput.onclick = function () {
                    input.click();
                };
            }

            input.onchange = function (e) {
                var files = e.target.files;
                if (files[0]) {
                    scope.fileName = files[0];
                    scope.mostrar = true;
                } else {
                    scope.fileName = null;
                    scope.mostrar = false;
                }
                scope.$apply();
            };
        }
    };
    return directive;
});
