/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';



App.controller('inputCtrl',
        ['$rootScope', '$scope', '$mdDialog', "xlsReader", '$filter',
            function ($rootScope, $scope, $mdDialog, xlsReader, $filter) {
                $rootScope.itemsExp = ["Cantidad","Tiempo Promedio", "Volumen"];
                $rootScope.selected = [];
                
                $rootScope.toggle = function (item, list) {
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                        list.splice(idx, 1);
                    } else {
                        list.push(item);
                    }
                };

                $rootScope.exists = function (item, list) {
                    return list.indexOf(item) > -1;
                };


                $scope.p = {cd: 0.6, pm: 15};

                $scope.d = {};
                $scope.cargaRef = function (e) {
                    //console.log(e);
                };
                $scope.procesarAvisos = function (f1, f2, d_ajust) {
                    $rootScope.json = [];
                    f1.forEach(function (it, i) {
                        var indx = _.findIndex(f2, function (o) {
                            return o['Número'] === "0".repeat(12 - it["Aviso"].length) + it["Aviso"];
                        });
                        //datos.push(_.extend({}, r1[i], r2[indx]));

                        $rootScope.json.push({
                            Aviso: f2[indx]['Número'],
                            Ctro: f2[indx].Ctro,
                            CT: f1[i]["Clase de aviso"],
                            GC: f1[i]["Grupo Códigos"],
                            Gpo: f2[indx].Gpo,
                            D: f1[i]["Descripción"],
                            FC: $filter('date')(f2[indx].FechaCrea, 'yyyy-MM-dd'),
                            HC: $filter('date')(f2[indx].HoraCrea - d_ajust, 'h:mm:ss a'),
                            FV: $filter('date')(f2[indx].FechaVerif, 'yyyy-MM-dd'),
                            HV: $filter('date')(f2[indx].HoraVeri - d_ajust, 'h:mm:ss a'),
                            TV: f2[indx].TotalVerif,
                            FCV: $filter('date')(f2[indx].FCierrVálv, 'yyyy-MM-dd'),
                            HCV: $filter('date')(f2[indx].HCieVálv - d_ajust, 'h:mm:ss a'),
                            FConcl: $filter('date')(f2[indx].FechaConcl, 'yyyy-MM-dd'),
                            HConcl: $filter('date')(f2[indx].HraConcl - d_ajust, 'h:mm:ss a'),
                            TCV: f2[indx].TotCieVálv,
                            TT: f2[indx]["Tiempo Tot"],
                            TB: f1[i]["Texto breve para código"]
                        });
                    });

                    return $rootScope.json;
                };

                $scope.procesar = function (e) {
                    $mdDialog.show({
                        contentElement: '#myDialog',
                        parent: angular.element(document.body),
                        targetEvent: e,
                        clickOutsideToClose: false
                    });
                    var d_ajust = new Date(4 * 60 * 1000);
                    xlsReader.readXLSX($scope.files[0], $scope).then(function (r1) {
                        xlsReader.readXLSX($scope.files[1], $scope).then(function (r2) {
                            xlsReader.readXLSX($scope.files[2], $scope).then(function (r3) {

                                $mdDialog.hide();
                                // Combinar archivos
                                var f1 = null;
                                var f2 = null;
                                var f3 = null;
                                for (var i = 1; i <= 3; i++) {
                                    var a = eval("r" + i);
                                    if (a[0].hasOwnProperty("Aviso") && a[0].hasOwnProperty("Tiempo Tot")) {
                                        f1 = a;
                                    }
                                    if (a[0].hasOwnProperty("Número")) {
                                        f2 = a;
                                    }
                                    if (a[0].hasOwnProperty("Aviso") && a[0].hasOwnProperty("Pto.tbjo.responsable")) {
                                        f3 = a;
                                    }
                                }
                                $scope.procesarAvisos(f1, f2, d_ajust);
                                $rootScope.mostrar = true;
                                xlsReader.readXLSX($scope.fileRef, $scope).then(function (data) {
                                    var ps = pesosArea(data);
                                    ps.cd = $scope.p.cd;
                                    ps.pm = $scope.p.pm;
                                    $scope.readerProcs(ps);
                                });

                                var countGrup = _.countBy(_.filter($rootScope.json, function (o) {
                                    return o.CT === "C2";
                                }), "GC");
                                countGrup["Sin Código"] = countGrup[""];

                            });
                        });
                    });
                };
                $scope.readerProcs = function (ps) {
                    // Incluir en la seleción
                    var incl = {};

                    //Acometidas
                    incl["chAcac"] = {GC: ["ACACOMSC"],
                        "CT": ["B1", "B2"]};
                    // Redes menores
                    incl["chRmen3"] = {GC: ["ACUCCMN3", "ACUSCMN3"],
                        "CT": ["B1", "B2"]};
                    // redes mayores
                    incl["chRmay3"] = {GC: ["ACUCCMY3", "ACUSCMY3"],
                        "CT": ["B1", "B2"]};
                    // Pilas 
                    incl["chPila"] = {GC: ["APREPILA"],
                        CT: ["C2"]};
                    // Hidrantes
                    incl["chHidra"] = {GC: ["APREHIDR"],
                        CT: ["C2"]};
                    //Lavado de redes B1-B2, ACUEANEOM, CALIDAD DEL AGUA
                    incl["chLvR"] = {GC: ["ACUEANOM"],
                        CT: ["B1", "B2"],
                        TB: ["Calidad del agua atendida"]};
                    //Carrotanques
                    incl["chCrrT"] = {GC: ["AGUACRRT"],
                        CT: ["B6"]};
                    incl["chFnV"] = {GC: ["Acometida", "Red"]};

                    // Excluir de la selección
                    var excl = {};
                    excl["chRmen3"], excl["chRmay3"] = {"TT": [""]};

                    // Acometidas            
                    $scope.d.acac = promGrup(filtroAvisos($rootScope.json, incl["chAcac"]), "Ctro", incl["chAcac"].GC, ps, "rm3");
                    chartBarCA("chCAcac", $scope.d.acac.c, incl["chAcac"].GC, {u: "", label: "Cantidad de avisos"});
                    chartBarCA("chVAcac", $scope.d.acac.v, incl["chAcac"].GC, {u: " m^3", label: "Volumen (m^3)"});
                    $rootScope.acac = {v: $scope.d.acac.vol};

                    // Redes menores            
                    $scope.d.mn3 = promGrup(filtroAvisos($rootScope.json, incl["chRmen3"], excl["chRmen3"]), "Ctro", incl["chRmen3"].GC, ps, "rm3");
                    chartBarTp("chTpMen3", $scope.d.mn3.tp, incl["chRmen3"].GC, 6);
                    chartBarCA("chCMen3", $scope.d.mn3.c, incl["chRmen3"].GC, {u: "", label: "Cantidad de avisos"});
                    chartBarCA("chVMen3", $scope.d.mn3.v, incl["chRmen3"].GC, {u: " m^3", label: "Volumen (m^3)"});
                    $rootScope.mn3 = {v: $scope.d.mn3.vol};

                    // Redes mayores
                    $scope.d.my3 = promGrup(filtroAvisos($rootScope.json, incl["chRmay3"], excl["chRmay3"]), "Ctro", incl["chRmay3"].GC, ps, "ry3");
                    chartBarTp("chTpMyr3", $scope.d.my3.tp, incl["chRmay3"].GC, 10);
                    chartBarCA("chCMyr3", $scope.d.my3.c, incl["chRmay3"].GC, {u: "", label: "Cantidad de avisos"});
                    chartBarCA("chVMyr3", $scope.d.my3.v, incl["chRmay3"].GC, {u: " m^3", label: "Volumen (m^3)"});
                    $rootScope.my3 = {v: $scope.d.my3.vol};
                    // Pilas 
                    $scope.d.pila = promGrup(filtroAvisos($rootScope.json, incl["chPila"]), "Ctro", incl["chPila"].GC, ps);
                    chartBarCA("chCPila", $scope.d.pila.c, incl["chPila"].GC, {u: "", label: "Cantidad de avisos"});
                    chartBarCA("chVPila", $scope.d.pila.v, incl["chPila"].GC, {u: " m^3", label: "Volumen (m^3)"});
                    $rootScope.pila = {v: $scope.d.pila.vol};
                    // Pilas e hidrantes
                    $scope.d.hidra = promGrup(filtroAvisos($rootScope.json, incl["chHidra"]), "Ctro", incl["chHidra"].GC, ps);
                    chartBarCA("chCHidra", $scope.d.hidra.c, incl["chHidra"].GC, {u: "", label: "Cantidad de avisos"});
                    chartBarCA("chVHidra", $scope.d.hidra.v, incl["chHidra"].GC, {u: " m^3", label: "Volumen (m^3)"});
                    $rootScope.hidra = {v: $scope.d.hidra.vol};
                    //Lavado de redes.
                    $scope.d.LvR = promGrup(filtroAvisos($rootScope.json, incl["chLvR"]), "Ctro", incl["chLvR"].GC, ps);
                    chartBarCA("chLvR", $scope.d.LvR.v, incl["chLvR"].GC, {u: " m^3", label: "Volumen (m^3)"});
                    $rootScope.LvR = {v: $scope.d.LvR.vol};
                    //console.log("pesos", $scope.d.mn3, $scope.d.my3, ps);
                    //console.log(promGrup(filtroAvisos($rootScope.json, incl["chLvR"]), "Ctro", incl["chLvR"].GC));
                    //Carro tanques
                    $scope.d.CrrT = promGrup(filtroAvisos($rootScope.json, incl["chCrrT"]), "Ctro", incl["chCrrT"].GC, ps);
                    chartBarCA("chCrrT", $scope.d.CrrT.v, incl["chCrrT"].GC, {u: " m^3", label: "Volumen (m^3)"});
                    $rootScope.CrrT = {v: $scope.d.CrrT.vol};
                    //Fugas no visibles
                    $scope.d.FnV = fugasNV(ps);
                    chartBarCA("chFnV", $scope.d.FnV.v, incl["chFnV"].GC, {u: " m^3", label: "Volumen (m^3)"});
                    $rootScope.FnV = {v: $scope.d.FnV.vol};
                    $rootScope.d = $scope.d;
                    setTimeout(function () {
                        window.dispatchEvent(new Event('resize'));
                    }, 2000);
                };
            }]);


                         