var weekendApp = angular.module("weekendApp", ['ngStorage']);
    weekendApp.controller('weekendController', function weekendController($scope, $interval, $localStorage) {

        $scope.$storage = $localStorage;
        $scope.$storage.cities =
        [
          {"id": "1", "city": "Tirana", "temperature": "", "weather": ""},
          {"id": "2", "city": "Andorra la Vella", "temperature": "", "weather": ""},
          {"id": "3", "city": "Yerevan", "temperature": "", "weather": ""},
          {"id": "4", "city": "Vienna", "temperature": "", "weather": ""},
          {"id": "5", "city": "Baku", "temperature": "", "weather": ""},
          {"id": "6", "city": "Minsk", "temperature": "", "weather": ""},
          {"id": "7", "city": "Brussels", "temperature": "", "weather": ""},
          {"id": "8", "city": "Sarajevo", "temperature": "", "weather": ""},
          {"id": "9", "city": "Sofia", "temperature": "", "weather": ""},
          {"id": "10", "city": "Zagreb", "temperature": "", "weather": ""},
          {"id": "11", "city": "Nicosia", "temperature": "", "weather": ""},
          {"id": "12", "city": "Prague", "temperature": "", "weather": ""},
          {"id": "13", "city": "Copenhagen", "temperature": "", "weather": ""},
          {"id": "14", "city": "Tallinn", "temperature": "", "weather": ""},
          {"id": "15", "city": "Helsinki", "temperature": "", "weather": ""},
          {"id": "16", "city": "Paris", "temperature": "", "weather": ""},
          {"id": "17", "city": "Tbilisi", "temperature": "", "weather": ""},
          {"id": "18", "city": "Berlin", "temperature": "", "weather": ""},
          {"id": "19", "city": "Athens", "temperature": "", "weather": ""},
          {"id": "20", "city": "Budapest", "temperature": "", "weather": ""},
          {"id": "21", "city": "Reykjavik", "temperature": "", "weather": ""},
          {"id": "22", "city": "Dublin", "temperature": "", "weather": ""},
          {"id": "23", "city": "Rome", "temperature": "", "weather": ""},
          {"id": "24", "city": "Astana", "temperature": "", "weather": ""},
          {"id": "25", "city": "Pristina", "temperature": "", "weather": ""},
          {"id": "26", "city": "Riga", "temperature": "", "weather": ""},
          {"id": "27", "city": "Vaduz", "temperature": "", "weather": ""},
          {"id": "28", "city": "Vilnius", "temperature": "", "weather": ""},
          {"id": "29", "city": "Skopje", "temperature": "", "weather": ""},
          {"id": "30", "city": "Valletta", "temperature": "", "weather": ""},
          {"id": "31", "city": "Chisinau", "temperature": "", "weather": ""},
          {"id": "32", "city": "Podgorica", "temperature": "", "weather": ""},
          {"id": "33", "city": "Amsterdam", "temperature": "", "weather": ""},
          {"id": "34", "city": "Oslo", "temperature": "", "weather": ""},
          {"id": "35", "city": "Warsaw", "temperature": "", "weather": ""},
          {"id": "36", "city": "Lisbon", "temperature": "", "weather": ""},
          {"id": "37", "city": "Bucharest", "temperature": "", "weather": ""},
          {"id": "38", "city": "Moscow", "temperature": "", "weather": ""},
          {"id": "39", "city": "Belgrade", "temperature": "", "weather": ""},
          {"id": "40", "city": "Bratislava", "temperature": "", "weather": ""},
          {"id": "41", "city": "Ljubljana", "temperature": "", "weather": ""},
          {"id": "42", "city": "Madrid", "temperature": "", "weather": ""},
          {"id": "43", "city": "Stockholm", "temperature": "", "weather": ""},
          {"id": "44", "city": "Bern", "temperature": "", "weather": ""},
          {"id": "45", "city": "Ankara", "temperature": "", "weather": ""},
          {"id": "46", "city": "Kyiv", "temperature": "", "weather": ""},
          {"id": "47", "city": "London", "temperature": "", "weather": ""}
        ];

        $scope.$storage = $localStorage.$default($scope.$storage.cities);

      /*$.getJSON('cities.json', function ( data ) {
        data = data.list;
        console.log(data[6]); undefined
        $.each( data, function ( index ) {
          $scope.cities.push(data[index]);
        });
      });*/
      console.log($localStorage);
      $scope.addCity = function () {
        $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + $scope.city + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function ( data ) {
          $scope.$storage.cities.push({
          city: $scope.city,
          id: $scope.$storage.cities.length + 1,
          temperature: Math.round((data.query.results.channel.item.condition.temp - 32) * 5/9),
          weather: data.query.results.channel.item.condition.text
          });
          $scope.$apply();
          $scope.$storage.$apply();
          $localStorage.$apply();

        });
        $("#modal").css("visibility", "hidden");
        console.log("pushed " + $scope.city + " into result" + ":::" + $localStorage);
      }

      var maxTemp, minTemp;
      var i = 0;
      $.each($scope.$storage.cities, function (index) {
        $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + $scope.$storage.cities[index].city + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function ( data ) {
          $scope.$storage.cities[index].weather = data.query.results.channel.item.condition.text;
          $scope.$storage.cities[index].temperature = Math.round((data.query.results.channel.item.condition.temp - 32) * 5/9);
          i++;
          if(i == $scope.$storage.cities.length) {
            arrayMaxMinTemp($scope.$storage.cities);
            console.log(maxTemp + "::" + minTemp);
            for(var j = 0; j < $scope.$storage.cities.length; j++) {
              if($scope.$storage.cities[j].temperature == maxTemp) {
                console.log(j+1);
                $("#" + (j + 1) + "c").addClass("hot");
              } else if($scope.$storage.cities[j].temperature == minTemp) {
                $("#" + (j + 1) + "c").addClass("cold");
              }
            }
          }
          $scope.$apply();
          $scope.$storage.$apply();
          $localStorage.$apply();
        });

      });

      $scope.visited = function(event) {
        var cl = event.target.attributes.class.nodeValue.substr(0, event.target.attributes.class.nodeValue.length-1);
        $("#" + cl + "c").toggleClass("visited");
        if(!$scope.$storage.cities[cl-1].visited || $scope.$storage.cities[cl-1].visited == undefined) {
          $scope.$storage.cities[cl].visited = true;
        } else if ($scope.$storage.cities[cl-1].visited) {
          $scope.$storage.cities[cl-1].visited = false;
        }
        console.log($scope.$storage.cities[cl-1].visited + "::" + $scope.$storage.cities[cl-1]);
        $scope.$storage.$apply();
        $localStorage.$apply();
      }

      $scope.gtv = function(event) {
        var cl = event.target.attributes.class.nodeValue.substr(0, event.target.attributes.class.nodeValue.length-1);
        $("#" + cl + "c").toggleClass("gtv");
        if(!$scope.$storage.cities[cl-1].gtv || $scope.$storage.cities[cl-1].gtv == undefined) {
          $scope.$storage.cities[cl-1].gtv = true;
        } else if ($scope.$storage.cities[cl-1].gtv) {
          $scope.$storage.cities[cl-1].gtv = false;
        }
        $scope.$storage.$apply();
        $localStorage.$apply();
      }

      function arrayMaxMinTemp(array) {
        for(var i = 0; i < array.length; i++) {
          if(maxTemp === undefined || maxTemp <= array[i].temperature && array[i].temperature != undefined) {
            maxTemp = array[i].temperature;
          }
          if(minTemp === undefined || minTemp >= array[i].temperature && array[i].temperature != undefined) {
            minTemp = array[i].temperature;
          }
        }
      }

      $scope.save = function () {
        var text = "";
        for(var i = 0; i < $scope.$storage.cities.length; i++){
          var visited, gtv;
          if($('.' + $scope.$storage.cities[i].id + 'v').attr('checked')) {
            visited = true;
          } else {
            visited = false;
          }
          if($('.' + $scope.$storage.cities[i].id + 'g').attr('checked')) {
            gtv = true;
          } else {
            gtv = false;
          }
          text += '\n{' + '"city": ' + '"' + $scope.$storage.cities[i].city + '"'
           + ', "weather": ' + '"' + $scope.$storage.cities[i].weather + '"'
           + ', "temp": ' + '"' + $scope.$storage.cities[i].temperature + '"'
           + ', "visited": ' + '"' + $scope.$storage.cities[i].visited + '"' + ', "gtv": '+ '"' + gtv + '"' + '},';
        }
        text = text.substring(0, text.length-1);
        text = '{"list" : [' + text + "]}";
        var filename = 'cities';
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename+".json");
      }

      $scope.modal = function () {
	      $("#modal").css("visibility", "visible");
      }
      $scope.sortParam = 'temperature';

      $scope.closeModal = function () {
        $("#modal").css("visibility", "hidden");
      }


      $('body').addClass('background1');

      function changeBg() {
        if ($('body').hasClass('background1')) {
          $('body').removeClass('background1');
          $('body').addClass('background2');
        } else if ($('body').hasClass('background2')) {
          $('body').removeClass('background2');
          $('body').addClass('background3');
        } else if ($('body').hasClass('background3')) {
          $('body').removeClass('background3');
          $('body').addClass('background4');
        } else if ($('body').hasClass('background4')) {
          $('body').removeClass('background4');
          $('body').addClass('background1');
        }
      }
      /*$('body').css('background-image', src[0]);
      setTimeout(function () {
        $('body').css('background-image', src[1]);
      }, 5000);*/
      $interval(changeBg, 10000);


      $scope.remove = function (event) {
        var cl = event.target.attributes.class.nodeValue.substr(0, event.target.attributes.class.nodeValue.length-1);
        $scope.$storage.cities.slice(cl-1, 1);
        $localStorage.cities.slice(cl-1, 1);
        $scope.$storage.$apply();
        $localStorage.$apply();
        $("#" + cl + "c").remove();
      }

      $scope.reload = function () {
        $scope.$storage.cities = $scope.$storage.cities.slice(0, 47);
        $scope.$storage.$apply();
        $localStorage.$apply();
        console.log("reloaded");
      }
    });
