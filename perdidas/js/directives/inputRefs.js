/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

App.directive('inputRefs', function () {
    var directive = {
        restrict: 'E',
        templateUrl: 'js/directives/inputRefs.htm',
        link: function (scope) {
            var file = null;
            var inputRef = document.getElementById('fileRef');
            scope.mostrar = false;

            scope.inputR_click = function () {
                inputRef.click();
            };

            inputRef.onchange = function (e) {
                file = e.target.files;
                if (file.length === 1) {
                    scope.fileRef = file[0];
                    scope.mostrar = true;
                }//else if(files.length===0){
                // console.log("Cancela");
                //}
                else if (file.length !== 0) {
                    alert("Debe seleccionar solo un archivo con la informacion de referencia de díametros");
                    scope.fileRef = null;
                    scope.mostrar = false;
                    file =null;
                }
                scope.$apply();
            };
        }
    };
    return directive;
});