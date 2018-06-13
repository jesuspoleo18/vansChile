let map = null;
let infoWindow = null;
let markers = [];
let loaded = false;

function mapInit() {
    getGoogle();
    return true;
}
mapInit();

function getGoogle() {
    if (!loaded) {
        let files = ['https://maps.googleapis.com/maps/api/js?key=AIzaSyDzzSgYRacD6Rzn9EmHMPGD3gdZljh0tpk&sensor=false&callback=initialize'];
        $.when.apply($, $.map(files, function (file) {
            return $.getScript(files);
        })).then(function () {
            loaded = true;
            loadScript();
        }, function err(jqxhr, textStatus, errorThrown) {});
    } else {
        loadScript();
    }
}

function loadScript() {

    /* colorear cuadro */
    var color = $(".produto .dimension-Color").text(),
        script = document.createElement('script'),
        $results = $(".store__results"),
        pais = '';

    $(".produto .dimension-Color").css("color", "#" + color);
    $(".produto .dimension-Color").css("background", "#" + color);

    deleteGoogleMapMessage();
    getStores();

    $(".stores_ul ul li").on('click', function () {

        var store_name = $(this).attr('id');
        var attributes = $(this).attr('rel');
        setStoreMap(store_name, attributes);
        $(".stores_ul ul li").removeClass('selected');
        $(this).addClass('selected');

    });

    $('#pais').on('change', function () {
        pais = $(this).val();
        // getMarkersByCountry(pais);
        getCities(pais);
    });

    $('#ciudad').on('change', function () {

        var ciud = $(this).val(),
            $storeWarning = $(".store__warning");
        addMarkersOfCity(ciud, pais, map);
        $('.ciudad').hide();
        $storeWarning.fadeOut();

        // Se muestran los options de las tiendas a partir de la ciudad actual se utiliza la clase
        if (ciud.indexOf('Escoja una ciudad') > -1) {
            $storeWarning.fadeIn();
            $results.fadeOut();
        } else {
            $results.fadeIn().css("display", "flex");
        }
        $('.' + ciud.replace(" ", "")).show();

    });

    $('#pais').change();
    mapMobile();
}

function mapMobile() {
    var $responsive = $(window).width(),
        textTemplate,
        $target = $("#ciudad"),
        $listView = $(".store__warning"),
        $mapView = $(".store__map-container"),
        $template = '<a href="#" class="store__typeView">Ver Mapa</div>';

    if ($responsive <= 425) {
        $target.after($template);
        var $btnView = $(".store__typeView");
        $btnView.on("click", function (e) {
            var $this = $(this);
            e.preventDefault();
            if ($this.text() == 'Ver Mapa') {
                textTemplate = 'Ocultar Mapa';
                $btnView.text(textTemplate);
                $listView.fadeOut();
                $mapView.fadeIn();
            } else if ($this.text() == 'Ocultar Mapa') {
                textTemplate = 'Ver Mapa';
                $btnView.text(textTemplate);
                $mapView.fadeOut();
                if ($(".store__results:visible").length == 0) {
                    $listView.fadeIn();
                }
            }
        });
    }
}

function initialize() {

    map = initializeMap();
    deleteGoogleMapMessage();
    deleteMarkers();

    ciudad = getParametroUrl("ciudad");
    pais = getParametroUrl("pais");
    markerFound = false;

    if (ciudad != "" && (pais == null || pais == "")) {

        // Solo para Chile se envia como parametro la ciudad
        markerFound = addMarkersOfCity(ciudad, "Chile", map);

    } else if (ciudad != null && ciudad != "" && pais != null && pais != "") {

        // Solo para Chile se envia como parametro la ciudad
        markerFound = addMarkersOfCity(ciudad, pais, map);

    } else if (pais != "" && (ciudad == null || ciudad == "")) {

        // Se ubican las tiendas del pais
        markerFound = getMarkersByCountry(pais);

    }

    if (!markerFound) {

        // Por defecto se ubican las tiendas de Chile
        getMarkersByCountry("Chile");

    }

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        deleteGoogleMapMessage();
    });

    google.maps.event.addListenerOnce(map, 'idle', function () {
        deleteGoogleMapMessage();
    });

}

function deleteGoogleMapMessage() {

    firstGmnoPrint = $(".gmnoprint").first();
    nextfirstGmnoPrint = firstGmnoPrint.next();
    nextfirstGmnoPrint.remove();

}

function getParametroUrl(paramName) {

    paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + paramName + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var href = window.location.href;
    href = href.replace(/&amp;/g, '&');
    var results = regex.exec(href);

    if (results == null) {

        return "";
    } else {

        return decodeURIComponent(results[1]);

    }

}

function initializeMap() {

    let mapOptions = {
        // center: new google.maps.LatLng(-35.4421309, -106.2492172),
        center: new google.maps.LatLng(-33.4724727, -70.9100258),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    };
    let map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    return map;

}

function getAutoCompleteValues() {

    data = getAllData();
    values = [];

    $.each(data, function (countryName, countryVal) {

        countryObj = {};
        countryObj.id = countryName;
        countryObjValue = {};
        countryObjValue.type = "Country";
        countryObjValue.country = countryName;
        countryObj.value = countryObjValue;
        countryObj.label = countryName;
        values.push(countryObj);

        $.each(countryVal.cities, function (cityName, cityVal) {

            cityObj = {};
            cityObj.id = cityName + ", " + countryName;
            cityObjValue = {};
            cityObjValue.type = "City";
            cityObjValue.country = countryName;
            cityObjValue.city = cityName;
            cityObj.value = cityObjValue;
            cityObj.label = cityName + ", " + countryName;

            values.push(cityObj);

            $.each(cityVal.stores, function (storeName, storeVal) {
                storeObj = {};
                storeObj.id = storeName;
                storeObjValue = {};
                storeObjValue.type = "Store";
                storeObjValue.country = countryName;
                storeObjValue.city = cityName;
                storeObj.value = storeObjValue;
                storeObj.label = storeName;

                values.push(storeObj);

            });

        });

    });

    return values;

}

/* test */

function getStores() {

    data = getAllData();
    values = [];
    var UL = $('<ul/>');
    // var opt = $('<option>').val('Seleccione su país').text('Seleccione su país');
    // $('#pais').append(opt);

    $.each(data, function (countryName, countryVal) {

        var opt2 = $('<option>').val(countryName).text(countryName);
        $('#pais').append(opt2);

        $.each(countryVal.cities, function (cityName, cityVal) {

            $.each(cityVal.stores, function (storeName, storeVal) {

                storeObj = {};
                storeObj.id = storeName;
                storeObjValue = {};
                storeObjValue.type = "Store";
                storeObjValue.country = countryName;
                storeObjValue.city = cityName;
                storeObj.value = storeObjValue;
                storeObj.label = storeName;

                values.push(storeObj);
                var LI = $('<li/>').text(storeName).attr('id', storeName).attr('rel', cityName + ',' + countryName).addClass(cityName).addClass('ciudad');
                UL.append(LI);

            });

        });

    });

    $(".stores_ul").append(UL);
    //console.log(values);
}

function getCities(pais) {

    data = getAllData();
    values = [];
    var UL = $('<ul/>');

    $.each(data, function (countryName, countryVal) {

        $.each(countryVal.cities, function (cityName, cityVal) {

            if (countryName == pais) {
                values.push(cityName);
            }

        });

    });

    $('#ciudad').html('');

    var opt = $('<option>').val('Escoja una ciudad').text('Escoja una ciudad');

    $('#ciudad').append(opt);

    $.each(values, function (index, value) {

        var opt2 = $('<option>').val(value).text(value);
        $('#ciudad').append(opt2);

    });

}

function setStoreMap(store, atrtibutes) {

    data = atrtibutes.split(',');
    city = data[0];
    country = data[1];
    addMarkersOfStore(store, city, country, map);

}

function getMarkersByCountry(country) {

    data = getAllData();
    objCountry = data[country];
    if (objCountry != null) {

        $.each(objCountry.cities, function (cityName, city) {

            $.each(city.stores, function (storeName, store) {

                var latLng = new google.maps.LatLng(store.lat, store.lng),
                    title = storeName,
                    marker = addMarker(latLng, title, map);

                google.maps.event.addListener(marker, 'click', function () {

                    map.setCenter(latLng);

                    if (infoWindow) {

                        infoWindow.close();
                        infoWindow = null;
                    }

                    infoWindow = new google.maps.InfoWindow({

                        content: getContentString(store, storeName, cityName, country)
                    });

                    infoWindow.open(map, marker);
                    setSelectedStore(store, storeName, cityName, country);

                });

            });

        });

        countryLatLng = new google.maps.LatLng(objCountry.lat, objCountry.lng);
        map.setCenter(countryLatLng);
        map.setZoom(5);
        return true;
    } else {

        return false;

    }

}

function addMarkersOfCity(cityName, country, map) {

    clearSelectedStore();
    data = getAllData();
    city = data[country].cities[cityName];
    if (city != null) {

        // Se recorren todas las tiendas de la ciudad
        $.each(city.stores, function (storeName, store) {

            var latLng = new google.maps.LatLng(store.lat, store.lng),
                title = storeName,
                marker = addMarker(latLng, title, map);

            google.maps.event.addListener(marker, 'click', function () {

                map.setCenter(latLng);

                if (infoWindow) {

                    infoWindow.close();
                    infoWindow = null;
                }

                infoWindow = new google.maps.InfoWindow({

                    content: getContentString(store, storeName, cityName, country)

                });

                infoWindow.open(map, marker);
                setSelectedStore(store, storeName, cityName, country);

            });

        });

        // Se fija el centro en la ciudad y se hace un zoom menos profundo
        //cityLatLng = getCityLocation( cityName, country, cityLocationCallBack );
        cityLatLng = new google.maps.LatLng(city.lat, city.lng);
        map.setCenter(cityLatLng);
        map.setZoom(12);

        return true;
    } else {

        return false;

    }

}

function cityLocationCallBack(location) {
    return location;
}

function addMarkersOfStore(store, city, country, map) {

    var data = getAllData(),
        stores = data[country].cities[city].stores,
        storeObj = stores[store],
        latLng = new google.maps.LatLng(storeObj.lat, storeObj.lng),
        title = store;

    marker = addMarker(latLng, title, map);
    map.setCenter(latLng);
    map.setZoom(16);
    setSelectedStore(storeObj, title, city, country);

    google.maps.event.addListener(marker, 'click', function () {

        map.setCenter(latLng);

        if (infoWindow) {

            infoWindow.close();
            infoWindow = null;

        }

        infoWindow = new google.maps.InfoWindow({

            content: getContentString(storeObj, title, city, country)

        });

        infoWindow.open(map, marker);
        setSelectedStore(storeObj, title, city, country);

    });

}

function getContentString(store, storeName, city, country) {

    var contentString = '<div id="content"><div id="siteNotice"></div><h2 id="firstHeading" class="firstHeading">' + storeName + '</h2><div id="bodyContent"><div class="bodyContent__text"><strong>Ciudad: </strong><p> ' + city + '</p></div><div class="bodyContent__text"><strong>Pais: </strong> <p>' + country + '</p></div>' + (store.address != null && $.trim(store.address) != "" ? '<div class="bodyContent__text"><strong>Dirección: </strong><p>' + store.address + '</p></div>' : '') + (store.phone != null && $.trim(store.phone) != "" ? '<div class="bodyContent__text"><strong>Teléfono: </strong><p>' + store.phone + '</p></div>' : '') + (store.schedules != null && $.trim(store.schedules) != "" ? '<div class="bodyContent__text"><strong>Horários: </strong><p>' + store.schedules + '</p></div>' : '') + '</div>' + '</div>';

    return contentString;

}

function clearSelectedStore() {
    $("#storeContent").empty();
}

function setSelectedStore(store, storeName, city, country) {

    contentString = getContentString(store, storeName, city, country);
    $("#storeContent").empty();
    $("#storeContent").append(contentString);

}

function markerImage() {
    return "/arquivos/pin-in-the-map.png";
}

// Add a marker to the map and push to the array.
function addMarker(latLng, title, map) {

    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title
        // icon :  markerImage()
    });
    markers.push(marker);
    return marker;
}

// Sets the map on all markers in the array.
function setAllMap(map) {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }

}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {

    setAllMap(null);

}

// Shows any markers currently in the array.
function showMarkers() {

    setAllMap(map);

}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {

    clearMarkers();
    markers = [];

}

function getAllData() {
    var data = {
        RM: {
            lat: -31.8335421,
            lng: -69.5784968,
            cities: {
                Buin: {
                    lat: -33.7296357,
                    lng: -70.7636599,
                    stores: {
                        'Deculto': {
                            lat: -33.4055569,
                            lng: -70.7406726,
                            address: 'Jose Manuel Balmaceda 198, Buin'

                        },
                        'Solo deporte': {
                            lat: -33.7331416,
                            lng: -70.7389454,
                            address: 'Jose Manuel Balmaceda 77, Buin'

                        }
                    }
                },
                Cerrillos: {
                    lat: -33.5023203,
                    lng: -70.7476913,
                    stores: {
                        'Bold': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        'Belsport': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        'Paris': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        '7Veinte': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        'Falabella': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        'Maui': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        'RipCurl': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        'Block': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        'Real Kicks': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        },
                        'Patuelli': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Av. Américo Vespucio 1501, Cerrillos'

                        }
                    }
                },
                'El Bosque': {
                    lat: -33.5031097,
                    lng: -70.7246507,
                    stores: {
                        'La Polar': {
                            lat: -33.5535969,
                            lng: -70.6792301,
                            address: 'Avenida Jose Miguel Carrera 10375, El Bosque'
                        }
                    }
                },
                'Estacion Central': {
                    lat: -33.4625988,
                    lng: -70.7207434,
                    stores: {
                        'La Polar': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'
                        },
                        'Belsport Alameda': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'

                        },
                        'RipCurl': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'

                        },
                        'Paris': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'

                        },
                        'Maui': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'

                        },
                        'Block': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'

                        },
                        'Real Kicks': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'

                        },
                        'Falabella': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'

                        },
                        'Patuelli': {
                            lat: -33.4526736,
                            lng: -70.6844652,
                            address: 'Avenida Libertador Bernardo Ohiggins 3470, Estacion Central'

                        },
                        'Belsport': {
                            lat: -33.4525415,
                            lng: -70.6819175,
                            address: 'San Francisco de Borja  84, Estacion Central'

                        },
                        'Paris Estación Central': {
                            lat: -33.4525415,
                            lng: -70.6819175,
                            address: 'San Francisco de Borja  84, Estacion Central'

                        },
                        'Hites': {
                            lat: -33.4525415,
                            lng: -70.6819175,
                            address: 'San Francisco de Borja  84, Estacion Central'

                        },
                        'Hites Estación Central': {
                            lat: -33.4521532,
                            lng: -70.6789721,
                            address: 'Salvador Sanfuentes 2968, Estacion Central'

                        },
                        'Block Borja': {
                            lat: -33.4521076,
                            lng: -70.6824548,
                            address: 'San Francisco de Borja 66, Estacion Central'

                        }
                    }
                }
            }
        },
        CENTRO: {
            lat: -31.8335421,
            lng: -69.5784968,
            cities: {
                Valparaiso: {
                    lat: '-33.5031097',
                    lng: '-70.7246507',
                    stores: {
                        'Mall Plaza Oeste - Maui': {
                            lat: -33.5170528,
                            lng: -70.7200761,
                            address: 'Avenida Americo Vespucio 1501, Cerrillos'

                        }
                    }
                }
            }
        }
    };
    
    return data;
}