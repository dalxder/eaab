/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var data = [
    ["Agua Suministrada", "CONSUMO AUTORIZADO (CA)", d.CA.porcentaje()],
    ["CONSUMO AUTORIZADO (CA)", "FACTURADO MEDIDO (Normal-Especial)", d.data["Facturado medido"].volumen / d.data.AS * 100],
    ["CONSUMO AUTORIZADO (CA)", "FACTURADO NO MEDIDO (Ciclo i)", d.data["Facturado no medido"].volumen / d.data.AS * 100],

    ["FACTURADO MEDIDO (Normal-Especial)", "AGUA FACTURADA(AF)", d.data["Facturado medido"].volumen / d.data.AS * 100],
    ["FACTURADO NO MEDIDO (Ciclo i)", "AGUA FACTURADA(AF)", d.data["Facturado no medido"].volumen / d.data.AS * 100],
    //["CONSUMO AUTORIZADO (CA)","NO FACTURADO AUTORIZADO",30],
    ["CONSUMO AUTORIZADO (CA)", "NO FACTURADO MEDIDO", d.data.NFA.medido.volumen / d.data.AS * 100],
    ["CONSUMO AUTORIZADO (CA)", "NO FACTURADO NO MEDIDO", d.NFA["NO FACTURADO NO MEDIDO"].porcentaje()],

    //["NO FACTURADO AUTORIZADO","Bajos consumos comparativos",10],


    //["Bajos consumos comparativos","NO FACTURADO MEDIDO",10],
    //["NO FACTURADO AUTORIZADO","NO FACTURADO NO MEDIDO",10],

    ["NO FACTURADO MEDIDO", "NO FACTURADO AUTORIZADO", 1],
    ["NO FACTURADO NO MEDIDO", "NO FACTURADO AUTORIZADO", 1],
    //["Bomberos e Hidrantes","NO FACTURADO NO MEDIDO",5],
    //["Carrotanques","NO FACTURADO NO MEDIDO",5],
    //["Lavado Tanques","NO FACTURADO NO MEDIDO",5],



    ["Potenciales totalizadoras", "Consumos no Autorizados", 1],
    ["Diferencias entre SAP vs Spool", "Consumos no Autorizados", 1],
    ["Procesos defraudación", "Consumos no Autorizados", 1],
    ["Cortadas presentan Lectura", "Consumos no Autorizados", 1],

    ["Errores de Lectura", "Inexactitud de la Medición", d.data["Inexactitud de la medición"]["Errores de lectura"].volumen / d.data.AS * 100],
    ["Anomalías Crítica", "Inexactitud de la Medición", d.data["Inexactitud de la medición"]["Anomalías Crítica"].volumen / d.data.AS * 100], //Anomalizas criticas
    ["Sin consumo o Cero", "Inexactitud de la Medición", d.data["Inexactitud de la medición"]["Sin consumo"].volumen / d.data.AS * 100],
    ["Predios facturados por Promedio", "Inexactitud de la Medición", d.data["Inexactitud de la medición"]["Predios facturados x promedio"].volumen / d.data.AS * 100],
    ["Consumo Sistemático", "Inexactitud de la Medición", d.data["Inexactitud de la medición"]["Consumo Sistemático"].volumen / d.data.AS * 100],
    ["Predios Obsolecencia", "Inexactitud de la Medición", d.data["Inexactitud de la medición"]["Predios Obsolecencia"].volumen / d.data.AS * 100],

    ["Consumos no Autorizados", "PERDIDAS APARENTES COMERCIALES (PAC)", d.CNA.volumen() / d.data.AS * 100],
    ["Inexactitud de la Medición", "PERDIDAS APARENTES COMERCIALES (PAC)", d.IM.volumen() / d.data.AS * 100],

    ["NO FACTURADO AUTORIZADO", "AGUA NO FACTURADA COMERCIAL", d.NFA.volumen() / d.data.AS * 100], //.porcentaje()
    ["PERDIDAS APARENTES COMERCIALES (PAC)", "AGUA NO FACTURADA COMERCIAL", d.PAC.porcentaje()],

    ["Agua Suministrada", "PERDIDAS DE AGUA APARENTES + REALES", d.PAR.porcentaje()],

    ["PERDIDAS DE AGUA APARENTES + REALES", "Reparación Acometidas", d.data["Perdidas reales físicas"]["Reparación Acometidas"].volumen / d.data.AS * 100],
    ["PERDIDAS DE AGUA APARENTES + REALES", 'Reparación redes <3"', d.data["Perdidas reales físicas"]['Reparación redes <3pul'].volumen / d.data.AS * 100],
    ["PERDIDAS DE AGUA APARENTES + REALES", 'Reparación redes >=3"', d.data["Perdidas reales físicas"]['Reparación redes >=3pul'].volumen / d.data.AS * 100],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Suministro x carrotanque", d.data["Perdidas reales físicas"]["Suministro x carrotanque"].volumen / d.data.AS * 100],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Operación de pilas", d.data["Perdidas reales físicas"]["Operación de pilas"].volumen / d.data.AS * 100],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Operación de hidrantes", d.data["Perdidas reales físicas"]["Operación de hidrantes"].volumen / d.data.AS * 100],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Lavado de redes", d.data["Perdidas reales físicas"]["Lavado de redes"].volumen / d.data.AS * 100],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Mantenimiento alcantarillado", d.data["Perdidas reales físicas"]["Mantenimiento alcantarillado"].volumen / d.data.AS * 100],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Fugas no visibles", d.data["Perdidas reales físicas"]["Fugas no visibles"].volumen / d.data.AS * 100],

    ["Reparación Acometidas", "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]["Reparación Acometidas"].volumen / d.data.AS * 100],
    ['Reparación redes <3"', "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]['Reparación redes <3pul'].volumen / d.data.AS * 100],
    ['Reparación redes >=3"', "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]['Reparación redes >=3pul'].volumen / d.data.AS * 100],
    ["Suministro x carrotanque", "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]["Suministro x carrotanque"].volumen / d.data.AS * 100],
    ["Operación de pilas", "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]["Operación de pilas"].volumen / d.data.AS * 100],
    ["Operación de hidrantes", "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]["Operación de hidrantes"].volumen / d.data.AS * 100],
    ["Lavado de redes", "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]["Lavado de redes"].volumen / d.data.AS * 100],
    ["Mantenimiento alcantarillado", "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]["Mantenimiento alcantarillado"].volumen / d.data.AS * 100],
    ["Fugas no visibles", "TOTAL PERDIDAS REALES FÍSICAS", d.data["Perdidas reales físicas"]["Fugas no visibles"].volumen / d.data.AS * 100],

    ["PERDIDAS DE AGUA APARENTES + REALES", "Potenciales totalizadoras", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Diferencias entre SAP vs Spool", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Procesos defraudación", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Cortadas presentan Lectura", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Errores de Lectura", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Anomalías Crítica", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Sin consumo o Cero", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Predios facturados por Promedio", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Consumo Sistemático", 1],
    ["PERDIDAS DE AGUA APARENTES + REALES", "Predios Obsolecencia", 1],

    ["Agua Suministrada", "No", d["X Explicar"].porcentaje()],
    ["No", "No info", d["X Explicar"].porcentaje()],
    ["No info", "m3 POR EXPLICAR", d["X Explicar"].porcentaje()]
];