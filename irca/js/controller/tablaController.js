/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

App.controller('tablaController', ['$scope', '$timeout', function ($scope, $timeout) {
        'use strict';
        $scope.selected = [];
        $scope.table = undefined;
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
            order: 'Cod_Muestra',
            limit: 5,
            page: 1
        };
        //$scope.json=[];

        $scope.limiteRes = [
            {v: 15, u: "UPC", n: "Color_Aparente"},
            {v: 2, u: "UNT", n: "Turbiedad"},
            {v: [6.5, 9.0], u: "UPH", n: "pH"},
            {v: [0.3, 2.0], u: "MGL", n: "Cloro_Residual_Libre"},
            {v: 300, u: "MGL", n: "Dureza_Total"},
            {v: 0.3, u: "MGL", n: "Hierro_Total"},
            {v: 250, u: "MGL", n: "Cloruros"},
            {v: 200, u: "MGL", n: "Alcalinidad_Total"},
            {v: 250, u: "MGL", n: "Sulfatos"},
            {v: 10, u: "MGL", n: "Nitratos"},
            {v: 1, u: " ", n: "Coliformes_Totales"},
            {v: 1, u: "", n: "Escherichia_Coli"},
            {v: 0.2, u: "MGL", n: "Aluminio_Residual"},
            {v: 5.0, u: "MGL", n: "COT"},
            {v: 0.1, u: "MGL", n: "Nitritos"},
            {v: 1.0, u: "MGL", n: "Fluoruros"},
            {v: 0, u: "QUISTES", n: "Giardia"},
            {v: 0, u: "OOQUISTES", n: "Criptosporidum"},
            {v: 0.1, u: "MGL", n: "Manganeso_Total"},
            {v: 1000, u: "microsiemens/cm", n: "Conductividad"}];

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 20, 50];
        };
        $scope.mousedown = function (e) {
            console.log("mouse", e);
            // Stop default so text does not get selected
            //e.preventDefault();
            //e.originalEvent.preventDefault();

            // init variable for new width
            var new_width;

            // store initial mouse position
            //console.log("evento",e.pageX);
            var initial_x = e.pageX;

            // create marquee element
            var $m = $('<div class="resize-marquee"></div>');

            // append to th
            var $th = $(this).parent('th');
            //console.log("parent",angular.element(this).parent('th'));

            $th.append($m);
            console.log($(e.target).parent().outerWidth());
            //console.log("this",$(this).parent('th'),"$(this)",$(this)[0]);

            // set initial marquee dimensions
            var initial_width = $th.width();
            $m.css({
                width: initial_width + 'px',
                height: $th.height() + 'px'
            });

            // set mousemove listener
            $(window).on('mousemove', mousemove);

            // set mouseup/mouseout listeners
            $(window).one('mouseup', function () {
                // remove marquee, remove window mousemove listener
                $m.remove();
                $(window).off('mousemove', mousemove);

                // set new width on th
                $th.css('width', new_width + 'px');
            });

            function mousemove(e) {
                // calculate changed width
                var current_x = e.pageX;
                var diff = current_x - initial_x;
                new_width = initial_width + diff;

                // update marquee dimensions
                $scope.$apply(function () {
                    $m.css('width', new_width + 'px');
                    console.log('moving:', diff);
                });
            }

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
            console.log("save");
            $scope.promise = $timeout(function () {
                var data_all = angular.copy($scope.$eval("json | filter: searchKeyword | orderBy: query.order"));

                /* add to workbook */
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data_all), "sheet1");
                /* write workbook and force a download */
                XLSX.writeFile(wb, "DatosIRCA.xlsx");

            }, 2000);
        };
    }]);


