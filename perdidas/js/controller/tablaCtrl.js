/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

App.controller('tablaCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
        $scope.selected = [];
        $scope.labels = {
            Aviso: "Aviso",
            Ctro: "Zona",
            CT: "Clase de Aviso",
            GC: "Grupo Códigos",
            Gpo: "Gpo",
            D: "Texto Breve",
            FC: "Fecha Creación",
            HC: "Hora Creación",
            FV: "Fecha Verificación",
            HV: "Hora Verificación",
            TV: "Total Verificación",
            FCV: "Fecha Cierre Válvula",
            HCV: "Hora Cierre Válvula",
            FConcl: "Fecha Conclución",
            HConcl: "Hora Conclución",
            TCV: "Total Cierre Válvula",
            TT: "Tiempo Total",
            TB: "Texto del código"
        };
        $scope.limitOptions = [5, 10, 15, 50];
        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        $scope.query = {
            order: "Aviso", //Actualizar item de orden
            limit: 5,
            page: 1
        };


        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 20, 50];
        };

        $scope.logItem = function (item) {
            console.log(item, 'was selected');
        };
        $scope.logOrder = function (order) {
            console.log('order: ', order);
        };
        $scope.logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        };
        $scope.saveData = function () {
            $scope.promise = $timeout(function () {
                var data_all = angular.copy($scope.$eval("json | filter: buscar | orderBy: query.order"));
                /* add to workbook */
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data_all), "sheet1");
                /* write workbook and force a download */
                XLSX.writeFile(wb, "Proc_Perdidas.xlsx");
            }, 2000);
        };
        $scope.saveReport = function () {
            if ($scope.selected.length > 0) {
                $scope.promise = $timeout(function () {

                    console.log($rootScope, $scope);
                    var jsonItems = {acac: "Acometidas",
                        mn3: 'Redes menores a 3"',
                        my3: 'Redes mayores a 3"',
                        pila: 'Pilas',
                        hidra: 'Hidrantes',
                        LvR: 'Lavado de redes',
                        CrrT: 'Carrotanques',
                        FnV: 'Fugas no Visibles'
                    };

                    //var wb = XLSX.utils.book_new();
                    //
                    $scope.selected.forEach(function (it) {

                        if (it === "Cantidad") {
                            var wb = XLSX.utils.book_new();
                            Object.keys(jsonItems).forEach(function (jIt) {
                                if ($rootScope.d[jIt].c) {
                                    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet($rootScope.d[jIt].c), jsonItems[jIt]);

                                }
                            });
                            XLSX.writeFile(wb, "Reporte_cantidad_Avisos.xlsx");
                        }
                        if (it === "Tiempo Promedio") {
                            var wb = XLSX.utils.book_new();
                            Object.keys(jsonItems).forEach(function (jIt) {
                                if ($rootScope.d[jIt].tp) {
                                    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet($rootScope.d[jIt].tp), jsonItems[jIt]);

                                }
                            });
                            XLSX.writeFile(wb, "Reporte_Tiempo_Promedio_horas.xlsx");
                        }
                        if (it === "Volumen") {
                            var jsonData = [
                                {Item: 'Acometidas', 'Volumen[m^3]': $rootScope.acac.v},
                                {Item: 'Redes menores a 3"', 'Volumen[m^3]': $rootScope.mn3.v},
                                {Item: 'Redes mayores a 3"', 'Volumen[m^3]': $rootScope.my3.v},
                                {Item: 'Pilas', 'Volumen[m^3]': $rootScope.pila.v},
                                {Item: 'Hidrantes', 'Volumen[m^3]': $rootScope.hidra.v},
                                {Item: 'Lavado de redes', 'Volumen[m^3]': $rootScope.LvR.v},
                                {Item: 'Carrotanques', 'Volumen[m^3]': $rootScope.CrrT.v},
                                {Item: 'Fugas no Visibles', 'Volumen[m^3]': $rootScope.FnV.v}
                            ];
                            var wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(jsonData), "EAAB");
                            Object.keys(jsonItems).forEach(function (jIt) {
                                if ($rootScope.d[jIt].v) {
                                    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet($rootScope.d[jIt].v), jsonItems[jIt]);

                                }
                            });
                            XLSX.writeFile(wb, "Reporte_Volumen_m3_Perdidas.xlsx");
                        }

                    });

                    /* write workbook and force a download */


                }, 2000);
            }
        };


    }]);