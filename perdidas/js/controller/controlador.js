/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

App.controller('Controlador', ['$scope', function ($scope) {

        var self = this;
        

    
        $scope.show = true;
                //$('#accordion').css('visibility', 'hidden');

                $('#list').puicarousel({
                    numVisible: 1,
                    pageLinks: 5,
                    responsive: true});




                //Oculta elementos del DOM
                visible(['#accordion', "#globalFilter", "#btnLoad", "#cancel"], 'hidden');

                //Eventos

                $("#cancel").click(visible(["#btnLoad", "#cancel"], 'hidden'));
                $("#bt").on("click", datosTabla);
                $("#fileinput").change(function () {

                    var myfiles = _.values($('#fileinput')[0].files);
                    if (myfiles.length === 2) {
                        visible(["#btnLoad", "#cancel"], 'visible');
                        $("#inpShow").val(myfiles[0].name + " - " + myfiles[1].name);
                    } else {
                        visible(["#btnLoad", "#cancel"], 'hidden');
                    }
                });
                // Cargar los datos
                $('#btnLoad').click(function () {
                    self.esVisible=false;
                    dialog.dialog("open");
                    var myfiles = Object.values($('#fileinput')[0].files);
                    if (myfiles.length === 2) {
                        ExcelToJSON(myfiles);
                        
                    }
                });
                function ExcelToJSON(files) {
                    var datos = [];
                    var archivos = {};
                    files.forEach(function (file) {
                        archivos[file.name] = new Promise(
                                function (resolve, reject) {

                                    var reader = new FileReader();
                                    reader.readAsBinaryString(file);
                                    reader.onload = function (e) {
                                        var data = e.target.result;
                                        var workbook = XLSX.read(data, {
                                            type: 'binary',
                                            cellDates: true,
                                            cellNF: false,
                                            cellText: false,
                                            cellStyles: true
                                        });
                                        resolve(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
                                    };
                                    reader.onerror = function (ex) {
                                        reject(ex);
                                    };
                                }
                        );
                    });
                    // Promise
                    var k = _.keys(archivos);
                    archivos[k[0]].then(function (data0) {


                        archivos[k[1]].then(function (data1) {
                            if (data0[0].hasOwnProperty("Aviso")) {

                                data0.forEach(function (item, i, arr) {
                                    arr[i]["Número"] = "0".repeat(12 - arr[i]["Aviso"].length) + arr[i]["Aviso"];
                                    delete arr[i]["Aviso"];
                                });
                            } else {
                                data1.forEach(function (item, i, arr) {

                                    arr[i]["Número"] = "0".repeat(12 - arr[i]["Aviso"].length) + arr[i]["Aviso"];
                                    delete arr[i]["Aviso"];
                                });
                            }
                            // Combinar archivos


                            data0.forEach(function (it, i) {
                                var indx = _.findIndex(data1, function (o) {
                                    return o['Número'] === it['Número'];
                                });
                                //_.extend(data0[i],data1[indx]);
                                datos.push(_.extend({}, data1[indx], data0[i]));
                                //console.log(it['Número']);
                                //.substr(2)_.findIndex(arr, ['Número',+it['Número']])
                            });
                            //datos=data0;
                            //delete data0, data1;
                            //var datos = _.unionBy(data0, data1, 'Número');
                            //
                            datos.forEach(function (item, i, arr) {
                                arr[i].FechaCrea ? arr[i].FechaCrea = $.format.date(item.FechaCrea, "dd-MM-yyyy") : null;
                                arr[i].FechaConcl ? arr[i].FechaConcl = $.format.date(item.FechaConcl, "dd-MM-yyyy") : null;
                                arr[i].FechaVerif ? arr[i].FechaVerif = $.format.date(item.FechaVerif, "dd-MM-yyyy") : null;
                                arr[i].HoraCrea ? arr[i].HoraCrea = $.format.date(item.HoraCrea, "hh:mm") : null;
                                arr[i].HoraVeri ? arr[i].HoraVeri = $.format.date(item.HoraVeri, "hh:mm") : null;
                                arr[i].HCieVálv ? arr[i].HCieVálv = $.format.date(item.HCieVálv, "hh:mm") : null;
                                arr[i].HraConcl ? arr[i].HraConcl = $.format.date(item.HraConcl, "hh:mm") : null;
                            });
                            //var evens = _.remove(datos, function (o) {
                            //    return _.isEqual(o.T, "");
                            //});
                            var dom = document.getElementById("accordion");
                            while (dom.firstChild) {
                                dom.removeChild(dom.firstChild);
                            }
                            /*
                            dom.innerHTML += '<h3>Tabla de datos</h3>' +
                                    '<div class="ui-g">' +
                                    '<input id="globalFilter" placeholder="Filtro datos" size="30"/>' +
                                    //'<p>Filtro dinámico de datos</p><button  id="bt">Lista de datos filtrados</button>' +
                                    '<div id="tbl"></div>' +
                                    '</div>';
*/
                            var colTabla = [];
                            var k = _.keys(datos[datos.length - 1]);
                            k.push("TotCieVálv");
                            _.forEach(k, function (it) {
                                colTabla.push({field: it, headerText: it, sortable: true, filter: true, filterMatchMode: 'contains'});
                            });


                            //$(".container").css('visibility', 'visible');
                            //$('#carou').css('visibility', 'visible');
                            //var val = $('#pb1').puiprogressbar('option', 'value') + 100;
                            //$('#pb1').puiprogressbar('option', 'value', 100);
                            var grup = _.groupBy(datos, function (n) {
                                return n.Ctro;
                            });

                            /*
                             var xZonas = _.chain(_.filter(datos, function (o) {
                             return o.CT === "C2";
                             }))//_.pullAllBy(datos, [{ 'CT': "B2" }], 'CT')takeWhile
                             .sortBy("Ctro")
                             .groupBy("Ctro").map(function (v, i) {
                             return {
                             Ctro: i,
                             "Grupo Códigos": _.countBy(v, "Grupo Códigos"),
                             CT: _.countBy(v, "CT"), //_.uniq(_.map(v, 'Ctro')), //_.get(_.find(v, 'Ctro'), 'Ctro'),
                             FechaCrea: _.countBy(v, 'FechaCrea')
                             
                             };
                             }).value();*/


                            // Cálculo pilas e hidrantes
                            var pPH = promPilHidr(datos);

                            var d_PilasHidra = _.reduce(pPH, function (r, value, key) {
                                value.hidrante ? r["Hidrantes"] = r["Hidrantes"] + value.hidrante : null;
                                value.pila ? r["Pilas"] = r["Pilas"] + value.pila : null;
                                r[value.Ctro] = (value.hidrante ? value.hidrante : null) + (value.pila ? value.pila : null);
                                return r;
                            }, {Hidrantes: 0, Pilas: 0});
                            /*
                             var p = "chartsPH", e = "div", prop = {};
                             prop.id = "chPiH";
                             prop.cl = "chart ui-g-6";
                             //limpiarDom(p);
                             createDom(p, e, prop);
                             var z = ["ZN01", "ZN02", "ZN03", "ZN04", "ZN05"];
                             pieChart("#" + prop.id, d_PilasHidra, z);
                             var t = ["Hidrantes", "Pilas"];
                             prop.id = "chPiH1";
                             createDom(p, e, prop);
                             pieChart("#" + prop.id, d_PilasHidra, t);
                             prop.id = "chPiH2";
                             createDom(p, e, prop);
                             prop.id = "phTotales";
                             prop.cl = "ui-g-6";
                             createDom(p, 'p', prop);
                             
                             var dom2 = document.getElementById(prop.id);
                             dom2.innerHTML += "<p>Avisos hidrantes:" + d_PilasHidra.Hidrantes + "</p>";
                             
                             dom2.innerHTML += "<p>Avisos Pilas:" + d_PilasHidra.Pilas + "</p>";
                             dom2.innerHTML += "<p><b>Total de avisos:</b> " + (+d_PilasHidra.Hidrantes + d_PilasHidra.Pilas) + "</p>";
                             
                             var tiempo = 15, diametro = 10;
                             dom2.innerHTML += "<br/><br/>Volumen estimado de perdidas: " + ((d_PilasHidra.Hidrantes + d_PilasHidra.Pilas) * diametro * tiempo);
                             chartBarCA("chPiH2", pPH, ['pila', 'hidrante']);
                             */
                            // Carro tanques

                            //createDom("accordion", 'h3', {id: "h3new"});
                            //createDom("accordion", 'div');

                            /*
                            dom.innerHTML += "<h3>Avisos Carro-tanques</h3>" +
                                    "<div class='ui-g'>" +
                                    "<h1 class='title'>Pérdidas por distribución en carrotanques</h1>" +
                                    "<div class='chart'></div></div>";
*/
                            var countGrup = _.countBy(_.filter(datos, function (o) {
                                return o.CT === "C2";
                            }), "Grupo Códigos");
                            countGrup["Sin Código"] = countGrup[""];
                            delete countGrup[""];
                            /*  
                             var dCodigosGrupo = [];
                             _.keys(countGrup)
                             .forEach(function (k) {
                             dCodigosGrupo.push([k, countGrup[k]]);
                             });
                             console.log(countGrup);
                             
                             
                             var chart = c3.generate({
                             bindto: '#chart2',
                             data: {
                             // iris data from R
                             columns: dCodigosGrupo,
                             type: 'pie',
                             onclick: function (d, i) {
                             //console.log("onclick", d, i);
                             },
                             onmouseover: function (d, i) {
                             //console.log("onmouseover", d, i);
                             },
                             onmouseout: function (d, i) {
                             //console.log("onmouseout", d, i);
                             }
                             }
                             });*/
                            //filterAvMenores3('#chRmen3');
/*
                            dom.innerHTML += '<h3>Redes menores a 3"</h3>' +
                                    '<div class="ui-g">' +
                                    '<h1 class="title">Cantidad de Avisos C2 por zonas- Redes menores</h1>' +
                                    '<div class="ui-g-6 chart" id="chRmen3" ></div>' +
                                    '<div class="ui-g-6 chart" id="chRmay3"></div>' +
                                    '</div>';

                            dom.innerHTML += '<h3>Redes mayores a 3"</h3>' +
                                    '<div class="ui-g">' +
                                    '<div id="chTpMen3" class="ui-g-6 chart" ></div>' +
                                    '<div id="chCMen3" class="ui-g-6 chart" ></div>' +
                                    '</div>';
*/
                            // Incluir en la seleción
                            var incl = {};

                            // Redes menores
                            incl["chRmen3"] = {"Grupo Códigos": ["ACACOMSC", "ACUCCMN3", "ACUSCMN3"],
                                "CT": ["B1", "B2"]};
                            // redes mayores
                            incl["chRmay3"] = {"Grupo Códigos": ["ACUCCMY3", "ACUSCMY3"],
                                "CT": ["B1", "B2"]};
                            //Lavado de redes B1-B2, ACUEANEOM, CALIDAD DEL AGUA
                            incl["chLvRed"] = {"Grupo Códigos": ["ACUEANOM"],
                                "CT": ["B1", "B2"],
                                "Texto breve para código": ["Calidad del agua atendida"]};

                            // Excluir de la selección
                            var excl = {};
                            excl["chRmen3"], excl["chRmay3"] = {"Tiempo Tot": [""]};
                            excl["chLvRed"] = null;

                            //Gráficas tipo torta      
                            _.keys(incl).forEach(function (it) {
                                pieChart("#" + it, _.countBy(filtroAvisos(datos, incl[it], excl[it]), "Ctro"));
                            });

                            var pg = promGrup((filtroAvisos(datos, incl["chRmen3"], excl["chRmen3"])), "Ctro", ["ACACOMSC", "ACUCCMN3", "ACUSCMN3"]);
                            chartBarTp("chTpMen3", pg, ["Tp_ACACOMSC", "Tp_ACUCCMN3", "Tp_ACUSCMN3"]);
                            chartBarCA("chCMen3", pg, ["C_ACACOMSC", "C_ACUCCMN3", "C_ACUSCMN3"]);
                            console.log(pg);


                            visible(['#accordion', "#globalFilter"], 'visible');
                            $('#accordion').puiaccordion({multiple: true});

                            $('md-collapsible-header').on("click", function () {
                               
                                window.dispatchEvent(new Event('resize'));
                            });

                            $('#tbl').puidatatable({
                                paginator: {
                                    rows: 10
                                },
                                globalFilter: '#globalFilter',
                                caption: 'Tabla de datos',
                                resizableColumns: true,
                                columnResizeMode: 'expand',
                                responsive: true,
                                draggableColumns: false,
                                columns: colTabla,
                                datasource: datos
                            });

                            /*
                             $('#accordion').puiaccordion({
                             change: function (event, panel) {
                             }
                             });*/
                            dialog.dialog("close");
                            window.dispatchEvent(new Event('resize')); 
                        });
                    });
                }
               
            
    }]);


