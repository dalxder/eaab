/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('myApp').controller('RegController', ['$scope', 'RegService', '$mdDialog', function ($scope, RegService, $mdDialog) {

        var self = this;



        self.zonas = {
            model: null,
            availableOptions: [
                {id: 1, name: 'Zona 1'},
                {id: 2, name: 'Zona 2'},
                {id: 3, name: 'Zona 3'},
                {id: 4, name: 'Zona 4'},
                {id: 5, name: 'Zona 5'}
            ],
            selectedOption: null //{id: '1', name: 'Zona 1'} This sets the default value of the select in the ui
        };
        self.vigencias = {
            model: null,
            availableOptions: [
                {id: '1', name: 10},
                {id: '2', name: 20},
                {id: '3', name: 30},
                {id: '4', name: 40},
                {id: '5', name: 50},
                {id: '6', name: 60},
                {id: '7', name: 70},
                {id: '8', name: 80},
                {id: '9', name: 90},
                {id: '10', name: 100},
                {id: '11', name: 110},
                {id: '12', name: 120}
            ],
            selectedOption: null //{id: '1', name: 'Zona 1'} This sets the default value of the select in the ui
        };
        self.data = {};
        var currentYear = new Date();
        self.maxDate = new Date(
                currentYear.getFullYear(),
                currentYear.getMonth(),
                currentYear.getDate() - 1);
        /*
         self.data.aa = null;
         ///////////////////////////////////////////////////////////////////7//////
         // Datos iniciales (Restful)
         //var data = {};
         // A. Total de agua suministrada.
         self.data.zona = null;
         self.data.VIG = {inicio: null,
         final: null};
         
         self.data.AS = null;
         self.data.FM = {c: null, v: null};
         self.data.FNM = {c: null, v: null};
         self.data.NFA = {medido: {c: null, v: null},
         NFNM: {
         Bomberos: {c: null, v: null},
         Carrotanques: {c: null, v: null},
         "Lavado tanques": {c: null, v: null}
         }
         };
         // Consumos no autorizados
         self.data.CNA = {
         "Potenciales totalizadoras": {c: 2890, v: 128756},
         "Diferencias SAPvs Spool": {c: 140, v: 3264},
         "Procesos defraudacion": {c: 112, v: 3727},
         "Cortadas presentan lectura": {c: 151, v: 3602}
         };
         self.data["Inexactitud de la medición"] = {"Errores de lectura": {c: 245, v: 3157},
         "Anomalías Crítica": {c: 111, v: 1806},
         "Sin consumo": {c: 14795, v: 432657},
         "Predios facturados x promedio": {c: 8132, v: 122875},
         "Consumo Sistemático": {c: 21602, v: 351141},
         "Predios Obsolecencia": {c: 4609, v: 189415}};
         
         self.data.PRF = {
         "Reparación Acometidas": {v: 57851},
         'Reparación redes <3pul': {v: 15348},
         'Reparación redes >=3pul': {v: 225534},
         "Suministro x carrotanque": {v: 2},
         "Operación de pilas": {v: 52},
         "Operación de hidrantes": {v: 4244},
         "Lavado de redes": {v: 669},
         "Mantenimiento alcantarillado": {v: 1000},
         "Fugas no visibles": {v: 13303}
         };*/




        ///self.data = {zona: self.zonas.model, vigencia: '', year: '', desde: '', hasta: ''};



        self.datos = [];

        self.submit = submit;
        //self.edit = edit;
        //self.remove = remove;
        self.reset = reset;

        /*
         fetchAllReg();
         
         function fetchAllReg() {
         RegService.fetchAllReg()
         .then(
         function (d) {
         self.datos = d;
         },
         function (errResponse) {
         console.error('Error while fetching Users');
         }
         );
         }
         
         */
        /*
         function updateUser(user, id){
         RegService.updateUser(user, id)
         .then(
         fetchAllReg,
         function(errResponse){
         console.error('Error while updating User');
         }
         );
         }
         
         function deleteUser(id){
         RegService.deleteUser(id)
         .then(
         fetchAllReg,
         function(errResponse){
         console.error('Error while deleting User');
         }
         );
         }*/
        /*
         $scope.submitted = false;
         
         // function to submit the form after all validation has occurred			
         $scope.submitForm = function () {
         
         $scope.submitted = true;
         
         // check to make sure the form is completely valid
         if ($scope.userForm.$valid) {
         alert('our form is amazing');
         } else {
         alert('ERROR');
         }
         
         };*/

        function createReg(d) {
            RegService.createReg(d)
                    .then(
                            console.log('Registro Exitoso', d),
                            function (errResponse) {
                                console.error('Error', d);
                            }
                    );
        }

        function submit() {
            self.data.zona = self.zonas.model;
            self.data.vigencias = self.vigencias.model;
            /*
            if (self.data.zona === null) {
                //console.log('Guardando datos', self.data);
                createReg(self.data);
                //createReg(self.data);
            } else {
                //updateUser(self.user, self.user.id);
                //createReg(self.data);
                //console.log('Crear datos zona ', self.data);

            }*/
            createReg(self.data);
            clean();
        }
        /*
         function edit(id){
         console.log('id to be edited', id);
         for(var i = 0; i < self.users.length; i++){
         if(self.users[i].id === id) {
         self.user = angular.copy(self.users[i]);
         break;
         }
         }
         }
         
         function remove(id){
         console.log('id to be deleted', id);
         if(self.user.id === id) {//clean form if the user to be deleted is shown there.
         reset();
         }
         deleteUser(id);
         }*/

        function clean() {
            $scope.myForm.$setPristine(); //reset Form
            $scope.myForm.$setUntouched();
            self.zonas.model = null;
            self.vigencias.model = null;
            //console.log(self.zonas.selectedOption.id);
            self.data = {};
        }
        function reset() {

            //self.zonas.selectedOption={id: '1', name: 'Zona 1'};

            /*
             self.data.aa = null;
             ///////////////////////////////////////////////////////////////////7//////
             // Datos iniciales (Restful)
             //var data = {};
             // A. Total de agua suministrada.
             self.data.zona = null;
             self.data.VIG = {inicio: null,
             final: null};
             self.data.AS = null;
             self.data.FM = {c: null, v: null};
             self.data.FNM = {c: null, v: null};
             self.data.NFA = {medido: {c: null, v: null},
             NFNM: {
             Bomberos: {c: null, v: null},
             Carrotanques: {c: null, v: null},
             "Lavado tanques": {c: null, v: null}
             }
             };*/

            var confirm =
                    $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .disableParentScroll(true)
                    .title('Borrar datos formulario')
                    .textContent('La siguiente operación borrará toda la información\n\
ingresada en el formulario')
                    .ok('ok')
                    .cancel('Cancelar')
                    // Or you can specify the rect to do the transition from

                    .openFrom({
                        top: -50,
                        width: 30,
                        height: 80
                    })
                    .closeTo({
                        left: 1500
                    });

            $mdDialog.show(confirm).then(function () {
                clean();
                //$scope.status = 'You decided to get rid of your debt.';
            }, function () {
                console.log("cancel");
                //$scope.status = 'You decided to keep your debt.';
            });
        }

    }]);


