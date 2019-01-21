/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//exports.balanceEAB = balanceEAB;
function balanceEAB(data) {
    var d = {};
    d.data = data;
    console.log("Data", data);
    delete data;
    // E. Agua Facturada  e ICUF
    d.AF = {v: function () {
            return d.data.FM.v + d.data.FNM.v;
        }, c: function () {
            return d.data.FM.c + d.data.FNM.c;
        }, ICUF: function () {
            return this.v() / this.c();
        }, p: function () {
            return this.v() / d.data.AS * 100;
        }, IPUF: function () {
            return (d.data.AS - this.v()) / this.c();
        }, IPUF_ICUF: function () {
            return this.IPUF() / this.ICUF() * 100;
        }, ISUF: function () {
            return this.IPUF() + this.ICUF();
        }
    };
    // F. No facturado autorizado.
    d.NFA = {v: function () {
            var nfa = d.data.NFA;
            return nfa.medido.v + nfa.NFNM.Bomberos.v + nfa.NFNM.Carrotanques.v + nfa.NFNM["Lavado tanques"].v;
        },
        c: function () {
            var nfa = d.data.NFA;
            return nfa.medido.c + nfa.NFNM.Bomberos.c + nfa.NFNM.Carrotanques.c + nfa.NFNM["Lavado tanques"].c;
        },
        NFNM: {p: function () {
                var nfa = d.data.NFA;
                return (nfa.NFNM.Bomberos.v + nfa.NFNM.Carrotanques.v + nfa.NFNM["Lavado tanques"].v) / d.data.AS * 100;
            }
        }
    };
    // B=E+F. Consumo Autorizado (CA)
    d.CA = {v: function () {
            return d.AF.v() + d.NFA.v();
        },
        p: function () {
            return this.v() / d.data.AS * 100;
        }
    };
    // H. Total perdidas reales físicas
    d.PRF = {v: function () {
            return reducir(d.data.PRF, ["v", "p"], "v");
        },
        p: function () {
            return this.v() / d.data.AS * 100;
        }};
    // I. Consumos no Autorizados
    d.CNA = {c: function () {
            return reducir(d.data.CNA, ["c", "v", "p"], "c");
        },
        v: function () {
            return reducir(d.data.CNA, ["c", "v", "p"], "v");
        },
        p: function () {
            return this.v() / d.data.AS * 100;
        }};
    //J. Inexactitud de la medición
    d.IM = {v: function () {
            return reducir(d.data.IM, ["c", "v", "p"], "v");
        }, c: function () {
            return reducir(d.data.IM, ["c", "v", "p"], "c");
        }, p: function () {
            return this.v() / d.data.AS * 100;
        }};
    //G. Perdidas aparentes comerciales
    d.PAC = {c: function () {
            return d.CNA.c() + d.IM.c();
        },
        v: function () {
            return d.CNA.v() + d.IM.v();
        }, p: function () {
            return this.v() / d.data.AS * 100;
        }};
    // C. Perdidas Agua aparentes y reales
    d.PAR = {v: function () {
            return d.PAC.v() + d.PRF.v();
        }
        , c: d.PAC.c
        , p: function () {
            return this.v() / d.data.AS * 100;
        }};
    // K. Agua no facturada comercial
    d.ANFC = {v: function () {
            return d.NFA.v() + d.PAC.v();
        },
        c: function () {
            return d.NFA.c() + d.PAC.c();
        }, p: function () {
            return d.ANFC.v() / d.data.AS * 100;
        }};
    //L. v de salida comercial
    d.VSC = {v: function () {
            return d.AF.v() + d.ANFC.v();
        },
        p: function () {
            return d.VSC.v() / d.data.AS * 100;
        }};
    //M. TOTAL AGUA NO FACTURADA (K + H)
    d.TANF = {
        v: function () {
            return d.ANFC.v() + d.PRF.v();
        },
        c: function () {
            return d.ANFC.c();
        },
        p: function () {
            return this.v() / d.data.AS * 100;
        }
    };

    //N. TOTAL VOLUMEN DE SALIDA
    d.TVS = {
        v: function () {
            return d.AF.v() + d.TANF.v();
        },
        c: function () {
            console.log("dasdassssss", d.AF.c(), d.data, d.data.FM.c);
            return d.AF.c();
        },
        p: function () {
            return this.v() / d.data.AS * 100;
        }
    };
    d.XE = {v: function () {
            return d.data.AS - (d.AF.v() + d.ANFC.v() + d.PRF.v());
        },
        p: function () {
            return this.v() / d.data.AS * 100;
        }
    };
    d.balance = {"Agua Facturada": d.AF.v(),
        "Agua No Facturada": d.ANFC.v(), "X Explicar": d.XE.v(),
        "Perdidas reales físicas": d.PRF.v()};
    d.distribucion = {"No facturado Autorizado": d.NFA.v(),
        "Consumos no Autorizados": d.CNA.v(),
        Inexactitud: d.IM.v(),
        perdidas: d.PRF.v()};
    return d;
}


function reducir(O, excl, propiedad) {
    var t = 0;
    Object.keys(O).forEach(function (it) {
        if (!excl.includes(it)) {
            t += O[it][propiedad];
        }
    }
    );
    return t;
}
function pieChart(idDom, data, k) {
    if (!k) {
        k = Object.keys(data).sort();
    }
    return c3.generate({
        bindto: idDom,
        data: {
            json: [data],
            keys: {
                value: k
            },
            type: 'pie'
        }
    });
}
//chartSerie("#chPromFact", d.data.Historico)
function chartSerieHist(idDom, data) {

    var mx = Math.max(...(data[0].slice(1)));
    var mi = Math.min(...(data[0].slice(1)));
    console.log("data", data[0].slice(1));
    c3.generate({
        bindto: idDom,
        data: {
            columns: data,
            axes: {
                "Promedio Cuenta": 'y2'
            },
            type: 'bar',
            types: {
                "Promedio Cuenta": 'spline'

            }
        },
        axis: {
            x: {
                label: {text: "Periodos ultimas vigencias",
                    position: 'outer-center'
                },
                type: 'category'
            },
            y: {max: mx,
                min: mi,
                label: {text: 'Volumen (m^3)',
                    position: 'outer-center'
                }
            },
            y2: {
                show: true,
                label: {text: 'Promedio (m^3/usuario)',
                    position: 'outer-center'
                }
            }
        }
    });
}
function getData() {

    var data = {};
    ///////////////////////////////////////////////////////////////////7//////
    // Datos iniciales (Restful)
    //var data = {};
    // A. Total de agua suministrada.
    data.AS = 13523976 * Math.random();
    data.FM = {c: 372049 * Math.random(), v: 8939180 * Math.random()};
    data.FNM = {c: 1695 * Math.random(), v: 45593 * Math.random()};
    data.NFA = {medido: {c: 30721 * Math.random(), v: 180559 * Math.random()},
        NFNM: {
            Bomberos: {c: 45 * Math.random(), v: 6600 * Math.random()},
            Carrotanques: {c: 1 * Math.random(), v: 48 * Math.random()},
            "Lavado tanques": {c: 2 * Math.random(), v: 1274 * Math.random()}
        }
    };
    // Consumos no autorizados
    data.CNA = {
        "Potenciales totalizadoras": {c: 2890 * Math.random(), v: 128756 * Math.random()},
        "Diferencias SAPvs Spool": {c: 140 * Math.random(), v: 3264 * Math.random()},
        "Procesos defraudacion": {c: 112 * Math.random(), v: 3727 * Math.random()},
        "Cortadas presentan lectura": {c: 151 * Math.random(), v: 3602 * Math.random()}
    };
    data.IM = {"Errores de lectura": {c: 245 * Math.random(), v: 3157 * Math.random()},
        "Anomalizas criticas": {c: 111 * Math.random(), v: 1806 * Math.random()},
        "Sin consumo": {c: 14795 * Math.random(), v: 432657 * Math.random()},
        "Predios facturados x promedio": {c: 8132 * Math.random(), v: 122875 * Math.random()},
        "Consumo sistémico": {c: 21602 * Math.random(), v: 351141 * Math.random()},
        "predios obsolecencia": {c: 4609 * Math.random(), v: 189415 * Math.random()}};
    data.PRF = {
        "Reparación Acometidas": {v: 57851 * Math.random()},
        'Reparación redes <3"': {v: 15348 * Math.random()},
        'Reparación redes >=3"': {v: 225534 * Math.random()},
        "Suministro x carrotanque": {v: 2 * Math.random()},
        "Operación de pilas": {v: 52 * Math.random()},
        "Operación de hidrantes": {v: 4244 * Math.random()},
        "Lavado de redes": {v: 669 * Math.random()},
        "Mantenimiento alcantarillado": {v: 1000 * Math.random()},
        "Fugas no visibles": {v: 13303 * Math.random()}
    };
    data.Historico = [["Facturación cuentas constantes", 12051000 * Math.random(), 12356532 * Math.random(), 11882011 * Math.random(), 12196517 * Math.random()],
        ["Promedio Cuenta", 21.5 * Math.random(), 21.5 * Math.random(), 20.7 * Math.random(), 21.2 * Math.random()]];

    var data2 = {};
    ///////////////////////////////////////////////////////////////////7//////
    // Datos iniciales (Restful)
    //var data = {};
    // A. Total de agua suministrada.
    data2.AS = 13523976;
    data2.FM = {c: 372049, v: 8939180};
    data2.FNM = {c: 1695, v: 45593};
    data2.NFA = {medido: {c: 30721, v: 180559},
        NFNM: {
            Bomberos: {c: 45, v: 6600},
            Carrotanques: {c: 1, v: 48},
            "Lavado tanques": {c: 2, v: 1274}
        }
    };
    // Consumos no autorizados
    data2.CNA = {
        "Potenciales totalizadoras": {c: 2890, v: 128756},
        "Diferencias SAPvs Spool": {c: 140, v: 3264},
        "Procesos defraudacion": {c: 112, v: 3727},
        "Cortadas presentan lectura": {c: 151, v: 3602}
    };
    data2.IM = {"Errores de lectura": {c: 245, v: 3157},
        "Anomalizas criticas": {c: 111, v: 1806},
        "Sin consumo": {c: 14795, v: 432657},
        "Predios facturados x promedio": {c: 8132, v: 122875},
        "Consumo sistémico": {c: 21602, v: 351141},
        "predios obsolecencia": {c: 4609, v: 189415}};
    data2.PRF = {
        "Reparación Acometidas": {v: 57851},
        'Reparación redes <3"': {v: 15348},
        'Reparación redes >=3"': {v: 225534},
        "Suministro x carrotanque": {v: 2},
        "Operación de pilas": {v: 52},
        "Operación de hidrantes": {v: 4244},
        "Lavado de redes": {v: 669},
        "Mantenimiento alcantarillado": {v: 1000},
        "Fugas no visibles": {v: 13303}
    };
    data2.Historico = [["Facturación cuentas constantes", 12051000, 12356532, 11882011, 12196517],
        ["Promedio Cuenta", 21.5, 21.5, 20.7, 21.2]];


    var z = document.getElementById("selZona").value,
            v = document.getElementById("selVigencia").value,
            y = document.getElementById("selYear").value;
    fetch('/sigca/balance/' + v + '/' + y)
            .then(function (response) {
                if (response.ok) {

                    response.json().then(function (json) {
                        console.log("JSON", json);
                        dt = [data, data2, data, data, data, data];
                        delete data;
                        changeZone();
                    });
                } else {
                    console.log('Respuesta de red OK.');
                }
            })
            .catch(function (error) {
                console.log('Hubo un problema con la petición Fetch:' + error.message);
            });
    /*
     chart.load({
     unload: true,
     json: [data.balance]
     });*/
}
function changeZone() {
    if (dt.length >= 0) {
        renderDOM(dt[document.getElementById("selZona").value]);
    }
}

function renderDOM(data) {

    var d = balanceEAB(data);
    // A. Agua suminsitrada
    document.getElementById("id_AS").innerText = d.data.AS + " m^3";
    console.log(d.AF.IPUF(), d.AF.IPUF_ICUF(), d.AF.ICUF(), d.AF.ISUF());

    document.getElementById("vXE").innerText = d.XE.v() + " m^3";
    document.getElementById("pXE").innerText = d.XE.p().toFixed(1) + " % AS";

    document.getElementById("id_CA").innerText = d.CA.v().toFixed(1) + " m^3";
    document.getElementById("id_CA_p").innerText = d.CA.p().toFixed(1) + " % AS";
    document.getElementById("id_PARc").innerText = d.PAR.c();
    document.getElementById("id_PARv").innerText = d.PAR.v() + " m^3";
    document.getElementById("id_PARp").innerText = d.PAR.p().toFixed(1) + " % AS";
    document.getElementById("id_INAF").innerText = ((d.data.AS - d.AF.v()) / d.data.AS * 100).toFixed(2) + " %";
    document.getElementById("id_TPRF").innerText = d.PRF.v() + " m^3";
    document.getElementById("id_TPRF_AS").innerText = d.PRF.p().toFixed(1) + " % AS";
    var t = ["repAcom", "repL3p", "repM3p", "sumiCar", "oPilas", "oHid", "lavR", "manAlc", "fugNV"];
    Object.keys(d.data.PRF).forEach(function (it, i) {
        document.getElementById(t[i]).innerText = d.data.PRF[it].v.toFixed(0) + " m^3";
    });
    document.getElementById("cFM").innerText = d.data.FM.c;
    document.getElementById("vFM").innerText = d.data.FM.v.toFixed(1) + " m^3";
    document.getElementById("cNFM").innerText = d.data.FNM.c;
    document.getElementById("vNFM").innerText = d.data.FNM.v + " m^3";
    document.getElementById("vVSC").innerText = d.VSC.v().toFixed(1) + " m^3";
    document.getElementById("pVSC").innerText = d.VSC.p().toFixed(1) + " % AS";
    document.getElementById("cNFC").innerText = "Cuentas: " + d.ANFC.c();
    document.getElementById("vNFC").innerText = d.ANFC.v().toFixed(1) + " m^3";
    document.getElementById("pNFC").innerText = d.ANFC.p().toFixed(1) + " % AS";
    document.getElementById("pAF").innerText = d.AF.p().toFixed(1) + " % AS";
    document.getElementById("cANF").innerText = "Cuentas: " + d.NFA.c();
    document.getElementById("vANF").innerText = d.NFA.v().toFixed(1) + " m^3";
    document.getElementById("pANF").innerText = (d.NFA.v() / d.CA.v() * 100).toFixed(1) + " % CA";


    document.getElementById("cTANF").innerText = d.TANF.c();
    document.getElementById("vTANF").innerText = d.TANF.v() + " m^3";
    document.getElementById("pTANF").innerText = d.TANF.p().toFixed(1) + " % AS";

    document.getElementById("cTVS").innerText = d.TVS.c();
    document.getElementById("vTVS").innerText = d.TVS.v() + " m^3";
    document.getElementById("pTVS").innerText = d.TVS.p().toFixed(1) + " % AS";

    document.getElementById("vBalAF").innerText = d.AF.v() + " m^3";
    document.getElementById("pBalAF").innerText = d.AF.p().toFixed(1) + " % AS";

    document.getElementById("vBalANFC").innerText = d.ANFC.v() + " m^3";
    document.getElementById("pBalANFC").innerText = d.ANFC.p().toFixed(1) + " % AS";

    document.getElementById("vBalPRF").innerText = d.PRF.v() + " m^3";
    document.getElementById("pBalPRF").innerText = d.PRF.p().toFixed(1) + " % AS";

    document.getElementById("vBalXE").innerText = d.XE.v() + " m^3";
    document.getElementById("pBalXE").innerText = d.XE.p().toFixed(1) + " % AS";

    document.getElementById("vBalAS").innerText = d.data.AS + " m^3";
    document.getElementById("pBalAS").innerText = "100% AS";

    pieChart("#chBH", d.balance);
    pieChart("#chDANF", d.distribucion);
    console.log("histr", d.data.Historico);
    chartSerieHist("#chPromFact", d.data.Historico);
}