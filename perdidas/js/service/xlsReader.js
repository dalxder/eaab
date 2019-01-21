/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
App.factory("xlsReader", ["$q", "$log", function ($q, $log) {
        var factory = {};
        factory.readXLSX = function (file, scope) {

            var d = $q.defer();
            var reader = getReader(d, scope);
            reader.readAsBinaryString(file);

            return d.promise;
        };
        var toJson = function (result) {
            var workbook = XLSX.read(result, {
                type: 'binary',
                cellDates: true,
                cellNF: false,
                cellText: false,
                cellStyles: true
            });
            return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        };

        var onLoad = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(toJson(reader.result));
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

        var getReader = function (deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader;
        };

        return factory;
    }]);


function filtroAvisos(arr, incluir, excluir = null) {
    return  _.filter(arr, function (o) {
        var ifilter = true;
        var xfilter = true;
        if (incluir) {
            _.keys(incluir).forEach(function (it) {
                ifilter = ifilter && _.includes(incluir[it], o[it]);
            });
        }
        if (excluir) {
            _.keys(excluir).forEach(function (it) {
                xfilter = xfilter && !_.includes(excluir[it], o[it]);
            });
        }
        return  ifilter && xfilter;
    });
}

function fugasNV(ps) {

    var itemsA = ps.A0.Acometida.rm3.concat(ps.A0.Acometida.ry3);
    var itemsR = ps.A0.Red.rm3.concat(ps.A0.Red.ry3);

    var result = [];
    var vt = null;
    for (var i = 0; i < 5; i++) {
        var volA = null;
        var volR = null;

        itemsA.forEach(function (itA, i_itA) {
            volA += volumen(ps.cd, itA * Math.pow(0.05, 2), ps.pm, 2592000) * ps.pesos.Acometida["ZN0" + (i + 1)].longitud[i_itA];
        });
        itemsR.forEach(function (itR, i_itR) {
            volR += volumen(ps.cd, itR * Math.pow(0.05, 2), ps.pm, 2592000) * ps.pesos.Red["ZN0" + (i + 1)].longitud[i_itR];
            //console.log("ZN0" + (i + 1), i_itR, "A0", itR * Math.pow(0.05, 2), "km", ps.pesos.Red["ZN0" + (i + 1)].longitud[i_itR], "v", volumen(ps.cd, itR * Math.pow(0.05, 2), ps.pm, 2592000) * 0.1, "vol", volR);
        });
        result.push({Ctro: "ZN0" + (i + 1),
            Acometida: volA * 0.5,
            Red: volR * 0.1});
        vt += volA * 0.5 + volR * 0.1;
    }
    return {v: result, vol: vt};
}
function promGrup(d, s, g, ps = null, tpr) {
    //d: Datos (object array)
    //s: clave con la que se organizara los datos retornados
    //g: Array con las claves de los objetos en los cules se va a agrupar los datos retornados
    //tp: retorna el tiempo promedio
    var rp = {};
    var c = _.chain(d).sortBy(s).groupBy(s).map(function (v, i) {
        var r = {};
        r.Ctro = i;
        g.forEach(function (it) {
            var d = _.filter(v, function (o) {
                return  o.GC === it;
            });
            var c = _.countBy(d, function (n) {
                return n.GC === it;
            });

            if (["ACACOMSC", "ACUCCMN3", "ACUSCMN3", "ACUCCMY3", "ACUSCMY3"].includes(it)) {

                r["tp_" + it] = _.reduce(d, function (result, value, key) {
                    var val = null;
                    if (value.TCV) {
                        val = value.TCV.split(":");
                    } else if (value.TT) {
                        val = value.TT.split(":");
                    } else {
                        //console.log(value.Aviso, " no hay datos");
                    }
                    if (val) {
                        result += +val[0] + val[1] / 60;
                    }
                    return result;
                }, 0) / c.true;


                r["q_a" + it] = _.reduce(d, function (result, value) {
                    var val = null;
                    if (value.TCV) {
                        val = value.TCV.split(":");
                    } else if (value.TT) {
                        val = value.TT.split(":");
                    } else {
                        console.log(value.Aviso, value.Ctro, " no hay datos");
                    }
                    if (val) {
                        var ts = (Number(val[0]) * 60 + Number(val[1])) * 60;//segundos
                        if (value.GC.includes("ACA")) {
                            ps.pesos.Acometida[value.Ctro][tpr].forEach(function (itps, ips) {
                                result += volumen(ps.cd, ps.A0.Acometida[tpr][ips], ps.pm, ts) * itps;
                            });
                        } else if (value.GC.includes("ACU")) {
                            ps.pesos.Red[value.Ctro][tpr].forEach(function (itps, ips) {
                                result += volumen(ps.cd, ps.A0.Red[tpr][ips], ps.pm, ts) * itps;
                                /*
                                 console.log("result", value.Ctro, value.GC, "result", result,
                                 "ts", ts, val,
                                 "diametro", ps.A0.Acometida[tpr][ips],
                                 "peso", itps,
                                 "id", ips,
                                 "val", Number(val[0]), Number(val[1]));
                                 */
                            });
                        } else {
                            console.log("error");
                        }
                    }
                    return result;
                }, 0);
                //= v_a;
            } else if (["APREPILA", "APREHIDR"].includes(it)) {
                r["q_a" + it] = _.reduce(d, function (result, value) {
                    //console.log("data", d);
                    if (value.GC.includes("PILA")) {
                        var diam = 0.000126677;
                        //console.log("PILA");
                        //ps.pesos.Acometida[value.Ctro][tpr].forEach(function (itps, ips) {
                        //result += volumen(ps.cd, 0.000126677, ps.pm, 15*60);
                        //});
                    } else {
                        var diam = 0.003166929;
                    }
                    result += volumen(ps.cd, diam, ps.pm, 15 * 60);
                    return result;

                    //console.log("g", it);
                }, 0);
            } else if (["ACUEANOM"].includes(it)) {
                r["q_a" + it] = _.reduce(d, function (result, value) {
                    result += volumen(ps.cd, 0.003166929, ps.pm, 25 * 60);
                    return result;
                }, 0);
            } else if (["AGUACRRT"].includes(it)) {
                r["q_a" + it] = _.reduce(d, function (result, value) {
                    //console.log(value.TB);
                    result += Number(value.TB);
                    return result;
                }, 0);
            }




            r[it] = c.true;
        });
        return r;
    }).value();

    if (ps) {
        rp.tp = [];
        rp.v = [];
        var vol = 0;
        c.forEach(function (it_c, i_c, a_c) {
            var t = {Ctro: it_c.Ctro};
            var q = {Ctro: it_c.Ctro};
            g.forEach(function (i) {
                t[i] = it_c["tp_" + i];
                q[i] = it_c["q_a" + i];
                vol += it_c["q_a" + i];
                //console.log(it_c.Ctro,"q_" + i,it_c["q_" + i],vol);
                delete a_c[i_c]["tp_" + i];
                delete a_c[i_c]["q_a" + i];
            });

            rp.tp.push(t);
            rp.v.push(q);
        });
        rp.vol = vol;

    }
    rp.c = c;
    return rp;
}


//Graficas
function pieChart(idDom, data, k) {
    if (!k) {
        k = _.keys(data).sort();
    }
    c3.generate({
        bindto: idDom,
        data: {
            json: [data],
            keys: {
                value: k
            },
            type: 'pie'
        },
        pie: {
            label: {
                format: function (value, ratio, id) {
                    return value;
                }
            }
        }
    });
}
function chartBarTp(idDom, data, values, u) {
    // Gráfica de barras del tiempo promedio
    c3.generate({
        bindto: "#" + idDom,
        data: {
            type: 'bar',
            labels: {format: function (v) {
                    return d3.format(".1f")(v) + "h";
                }
            },
            json: data, //
            keys: {
                x: 'Ctro',
                value: values
            }
        },
        axis: {
            x: {
                label: {text: "Zonas de operación EAAB",
                    position: 'outer-center'
                },
                type: 'category'
            },
            y: {
                label: {text: 'Tiempo promedio de respuesta (h)',
                    position: 'outer-center'
                }
            }
        },
        bar: {
            width: {
                ratio: 0.9
            }
        },
        grid: {
            y: {
                lines: [{value: u, text: 'Umbral de respuesta ' + u + ' horas', position: 'middle'}]
            }
        },
        legend: {
            position: 'bottom'
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return d3.format('.1f')(value) + " h";
                }

            }
        }
    });
}
function chartBarCA(idDom, data, values, u) {
    // Gráfica de barras de la cantidad de avisos
    $("#" + idDom).empty();
    c3.generate({
        bindto: "#" + idDom,
        data: {
            type: 'bar',
            labels: {format: function (v) {
                    return d3.format(".0f")(v) + u.u;
                }
            },
            json: data, //
            keys: {
                x: 'Ctro',
                value: values
            }
        },
        axis: {
            x: {
                label: {text: "Zonas de operación EAAB",
                    position: 'outer-center'
                },
                type: 'category'
            },
            y: {
                show: true,
                label: {text: u.label,
                    position: 'outer-center'
                }
            }
        },
        bar: {
            width: {
                ratio: 0.9
            }
        },
        legend: {
            position: 'bottom'
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return d3.format('.0f')(value) +u.u;
                }

            }
        }
    });
}
function volumen(cd, A0, h, t) {
    return cd * A0 * Math.sqrt(2 * 9.81 * h) * t;
}
function pesosArea(data) {
    var pesos = {Acometida: {},
        Red: {}};
    var tot = {Acometida: {},
        Red: {}};
    for (var i = 0; i < 5; i++) {
        if (pesos.Acometida["ZN0" + (i + 1)] !== null) {
            pesos.Acometida["ZN0" + (i + 1)] = {rm3: [], ry3: [], longitud: []};
        }
        if (pesos.Red["ZN0" + (i + 1)] !== null) {
            pesos.Red["ZN0" + (i + 1)] = {rm3: [], ry3: [], longitud: []};
        }
        if (tot.Acometida["ZN0" + (i + 1)] !== null) {
            tot.Acometida["ZN0" + (i + 1)] = {rm3: null, ry3: null};
        }
        if (tot.Red["ZN0" + (i + 1)] !== null) {
            tot.Red["ZN0" + (i + 1)] = {rm3: null, ry3: null};
        }
    }
    var Area = {Acometida: {rm3: [], ry3: []},
        Red: {rm3: [], ry3: []}
    };
    data.forEach(function (itRef, ir) {
        if (ir > 0) {
            var d = itRef.DIAMETRO;
            var dim = null;
            if (d === '1"1/2') {
                dim = d.replace('"', "+");
            } else {
                dim = d.replace('"', "");
            }
            var A0 = Math.pow(eval(dim) * 0.0254, 2) / 4 * Math.PI;
            var tpR = null;
            if (A0 < Math.pow(3 * 0.0254, 2) / 4 * Math.PI) {
                tpR = "rm3";
            } else {
                tpR = "ry3";
            }
            if (itRef.DETALLE === "Acometida") {
                Area.Acometida[tpR].push(A0);
                for (var i = 0; i < 5; i++) {
                    pesos.Acometida["ZN0" + (i + 1)][tpR].push(itRef["ZONA " + (i + 1)]);
                    tot.Acometida["ZN0" + (i + 1)][tpR] += itRef["ZONA " + (i + 1)];
                    var l = null;
                    if (i === 0) {
                        l = "__EMPTY";
                    } else {
                        l = "__EMPTY_" + i;
                    }
                    pesos.Acometida["ZN0" + (i + 1)].longitud.push(itRef[l]);
                }

            } else {
                Area.Red[tpR].push(A0);
                for (var i = 0; i < 5; i++) {
                    pesos.Red["ZN0" + (i + 1)][tpR].push(itRef["ZONA " + (i + 1)]);
                    tot.Red["ZN0" + (i + 1)][tpR] += itRef["ZONA " + (i + 1)];
                    var l = null;
                    if (i === 0) {
                        l = "__EMPTY";
                    } else {
                        l = "__EMPTY_" + i;
                    }
                    pesos.Red["ZN0" + (i + 1)].longitud.push(itRef[l]);
                }
            }
        }
    });

    for (var i = 0; i < 5; i++) {
        (pesos.Acometida["ZN0" + (i + 1)].rm3).forEach(function (it2, i2) {
            pesos.Acometida["ZN0" + (i + 1)].rm3[i2] = it2 / tot.Acometida["ZN0" + (i + 1)].rm3;
        });
        (pesos.Red["ZN0" + (i + 1)].rm3).forEach(function (it2, i2) {
            pesos.Red["ZN0" + (i + 1)].rm3[i2] = it2 / tot.Red["ZN0" + (i + 1)].rm3;
        });
        (pesos.Acometida["ZN0" + (i + 1)].ry3).forEach(function (it2, i2) {
            pesos.Acometida["ZN0" + (i + 1)].ry3[i2] = it2 / tot.Acometida["ZN0" + (i + 1)].ry3;
        });
        (pesos.Red["ZN0" + (i + 1)].ry3).forEach(function (it2, i2) {
            pesos.Red["ZN0" + (i + 1)].ry3[i2] = it2 / tot.Red["ZN0" + (i + 1)].ry3;
        });
    }

    //console.log("calculo de pesos",{A0: Area, pesos: pesos});
    return {A0: Area, pesos: pesos};
}

