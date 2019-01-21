/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

App.directive('inputFiles', function () {
    var directive = {
        restrict: 'E',
        templateUrl: 'js/directives/inputFiles.htm',
        link: function (scope) {
            var files = [];
            var input = document.getElementById('filesInput');
            scope.mostrar = false;

            scope.input_click = function () {
                input.click();
            };

            input.onchange = function (e) {
                files = e.target.files;
                if (files.length === 3) {
                    scope.files = [files[0], files[1],files[2]];
                    scope.mostrar = true;
                }//else if(files.length===0){
                // console.log("Cancela");
                //}
                else if (files.length !== 0) {
                    alert("Debe seleccionar los 3 archivos de trabajo y ha seleccionado " + files.length + " archivos");
                    scope.files = [];
                    scope.mostrar = false;
                    files = [];
                }
                scope.$apply();
            };
        }
    };
    return directive;
});