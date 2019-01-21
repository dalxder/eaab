/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
App.factory("fileReader", ["$q", "$log", function($q, $log){
  var factory = {};
  factory.readAsText = function (file, scope) {
    console.log("file",file);
      var deferred = $q.defer();
      var reader = getReader(deferred, scope);
      reader.readAsText(file, 'ISO-8859-1');
    
      return deferred.promise;
  };
  var pross=function(result){
    var csvRow = result.split("\n");
                    var labels = {Cod_Muestra: "Aviso",
                        zona: "Zona",
                        fecha: "Fecha",
                        hora: "Hora",
                        punto: "Punto",
                        lugar: "Lugar"};
                    var ip = 0; // indice del parámetro
                    var m = []; // registro de muestras
                    var lugar = {};
                    var json = [];
                    var f = null;

                    var l = null;
                    csvRow.forEach(function (r) {
                        if (r.includes("AGU-")) {

                            var d = r.split("|");
                            var muestra = +d[16];
                            var indice = m.indexOf(muestra);

                            if (indice === -1) {
                                m.push(muestra);
                                f = d[19].split(".");
                                l = d[21];
                                if (!lugar.hasOwnProperty(l)) {
                                    console.log(l, d[22]);
                                    lugar[l] = limpiar(d[22]);
                                }
                                json.push({
                                    Cod_Muestra: muestra,
                                    zona: d[1].replace(/ /g, ""),
                                    fecha: f[2] + "/" + f[1] + "/" + f[0], //new Date(f[2],f[1]-1,f[0]),d[19].replace(/\./g, "/")
                                    hora: d[20],
                                    punto: l,
                                    lugar: lugar[l]});
                                indice = m.length - 1;
                            }


                            // d[7] contiene el nombre del parámetro evaluado
                            var carac = limpiar(d[7]);
                            //Registra los parámetros encontrados en el archivo de datos
                            if (!Object.values(labels).includes(carac)) {
                                var kp = carac.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_");//"p" + ip;
                                labels[kp] = carac;
                                ip++;
                            } else {
                                // Busca en la lista de parametros 
                                var kp = Object.keys(labels)[Object.values(labels).indexOf(carac)];
                            }
                            // valor del parámetro evaluado
                            var valor = null;
                            if (d[15].includes(",")) {
                                valor = +d[15].replace(",", ".");
                            } else if (d[15].includes("NO DETECTABLE")) {
                                valor = "NO DETECTABLE";
                            } else {
                                valor = d[15].replace(/ /g, "");
                                if (valor === "") {
                                    valor = null;
                                }
                            }
                            // Creación de Json
                            json[indice][kp] = valor;

                        }
                        
                    });
                //Organiza datos del json para mestrar en la vista de tabla
                    var temp = {};
                    Object.keys(labels).forEach(function (item) {
                        temp[item] = null;
                    });

                    json.forEach(function (item, i, arr) {
                        arr[i] = Object.assign({}, temp, item);
                    });
                    return {json:json,labels:labels};
  }
  
  var onLoad = function(reader, deferred, scope) {
    console.log("reader",reader)
                        
      return function () {
          scope.$apply(function () {
              deferred.resolve(pross(reader.result));
          });
      };
  };

  var onError = function (reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.reject(reader.result);
          });
      };
  };

  var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      return reader;
  };

  return factory;                   
}]);

function limpiar(d) {
    var c = [];
    d.split(" ").forEach(function (it) {
        if (it !== "") {
            c.push(it);
        }
    });
    return c.join(" ");
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
