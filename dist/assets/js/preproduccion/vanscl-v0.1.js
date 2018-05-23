/*----------------------------inicio--------------------------------

[Script - maestro ]

Projecto: eCommerce Vans Chile  - 2018
Version:  1.0
Ultimo cambio: 2018-05-23
Asignado a:  Ecomsur - LLZ
Primary use:  Ecommerce. 

----------------------

[Tabla de contenido]

1.Others General
2.Decimal
3.Slide Home
4.Carousel Product Featured
5.Carousel Product Featured Sheet Product 
6.Carousel Brand
7.Icon Lens Search
8.Form Contact connected masterdata
9.Form Newsletter connected masterdata
10.Add to cart from Product Sheet
11.Resize Offcanvas
12.Account
13.Back to top
14.Remove First SKU List Sheet Product
15.Exit Login
16.facebook pixels
17.footer acordeon
Execute Functions

-------------------------fin---------------------------------*/



/*  [1.Others General ]
=========================================*/

$('.helperComplement').remove();
$(".sku-notifyme-client-name.notifyme-client-name").attr("placeholder", "Ingresa tu nombre...");
$(".sku-notifyme-client-email.notifyme-client-email").attr("placeholder", "Ingresa tu email...");

//CHANGE TEXT BACK TO OFFCANVAS
Foundation.Drilldown.defaults.backButton = '<li class="js-drilldown-back"><a>Volver</a></li>'

var confiGenerales = {

    init: function () {
        $(window).load(function () {
            $('#vtexIdContainer .modal-header .close').attr('onclick', 'javascript:history.go(-1)');
            $('#ajaxBusy').remove();
        });

        confiGenerales.search_icon();
        confiGenerales.searchMobile();
        confiGenerales.loaderBusy();
        confiGenerales.backToTop();
        confiGenerales.formMasterData();
        confiGenerales.modal_shipping();
    },

    modal_shipping: function () {
        $('.msjPromo__btn--one').on('click', function () {
            swal({
                title: 'Condiciones DESPACHO GRATIS',
                html: '<ul>' +
                    '<li>Despacho Gratis por todas las compras en <strong>www.vans.cl</strong> para entregas en todo Chile continental.</li>' +
                    '<li>La oferta es válida solo en mercaderías de la marca Vans con stock disponible.</li>' +
                    '<li>Los tiempos de entrega reales pueden variar.</li>' +
                    '<li>No válido en ninguna tienda Vans.</li>' +
                    '<li>No se permiten ajustes de precios en compras anteriores.</li>' +
                    '<li>No canjeable por dinero en efectivo.</li>' +
                    '<li>Oferta sujeta a cambios en cualquier momento sin previo aviso.</li>' +
                    '</ul>',
            })
        })
    },

    search_icon: function () {
        $('.fas.fa-search').on('click', function () {
            $('.btn-buscar').trigger('click');
        })
    },

    searchMobile: function () {
        var $triggerSearchMobile = $(".title-bar__links .fa-search");
        var $closeSearch = $(".navigator__closeBar--mobile");
        var $c = $(".navigator__searchBar--mobile");

        $triggerSearchMobile.on("click", function (e) {
            e.preventDefault();
            $c.toggleClass("active");
        });
        $closeSearch.on("click", function () {
            $c.removeClass("active");
        });
    },


    //REMOVE LOADER NATIVE
    loaderBusy: function () {
        $('#ajaxBusy').remove();
    },

    //BACK TO TOP
    backToTop: function () {
        var offset = 220;
        var duration = 500;
        $(window).scroll(function () {
            if ($(this).scrollTop() > offset) {
                $('.back-to-top').fadeIn(duration);
            } else {
                $('.back-to-top').fadeOut(duration);
            }
        });

        $('.back-to-top').click(function (event) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, duration);
            return false;
        });
    },

    //FORMS MASTER DATA
    formMasterData: function () {
        // Form newsletter connected masterdata 
        $('#newsLetter_form').submit(function (e) {
            e.preventDefault();
            Newsletter();
        });

        function Newsletter() {
            var datos = {};
            datos.Email_nw = $('#Email_nw').val();
            //datos.Nombre_nw = $('#Nombre_nw').val();
            $.ajax({
                accept: 'application/vnd.vtex.ds.v10+json',
                contentType: 'application/json; charset=utf-8',
                crossDomain: true,
                data: JSON.stringify(datos),
                type: 'POST',
                url: '//api.vtexcrm.com.br/vanscl/dataentities/NW/documents',

                success: function (data) {
                    document.getElementById('newsLetter_form').reset();
                    //$('#newsAprob').foundation('open');
                    swal({
                        html: "¡Gracias por suscríbirte a nuestro Newsletter!",
                        type: 'success',
                        confirmButtonColor: '#000000',
                        timer: 3000
                    });
                },
                error: function (data) {
                    //$('#newsError').foundation('open');
                    swal({
                        html: "Hemos detectado un problema en el envío de tus datos.",
                        type: 'warning',
                        confirmButtonColor: '#000000',
                        timer: 3000
                    });
                }
            });
        }

        // Form contact connected masterdata
        $('#form-contact').submit(function (e) {
            e.preventDefault();
            ContactForm();
        });

        function ContactForm() {
            var datos = {};
            datos.nombres = $('#nombres').val();
            datos.email = $('#email').val();
            datos.fono = $('#fono').val();
            datos.comentarios = $('#comentario').val();
            $.ajax({
                accept: 'application/vnd.vtex.ds.v10+json',
                contentType: 'application/json; charset=utf-8',
                crossDomain: true,
                data: JSON.stringify(datos),
                type: 'POST',
                url: '//api.vtexcrm.com.br/guesscl/dataentities/FC/documents',
                success: function (data) {
                    document.getElementById('form-contact').reset();
                    //$('#contactAprob').foundation('open');
                    swal({
                        title: "¡Gracias por contactarse con nosotros!",
                        html: "Te responderemos a la brevedad dependiendo de la consulta.",
                        type: 'success',
                        confirmButtonColor: '#000000'
                    });
                },
                error: function (data) {
                    //$('#contactError').foundation('open');
                    swal({
                        title: "Hemos detectado un problema en el envío de tus datos",
                        html: "Prueba completando nuevamente todos los campos correspondientes de forma correcta.",
                        type: 'warning',
                        confirmButtonColor: '#000000'
                    });
                }
            });
        }
    },
}

$(function () {
    confiGenerales.init();
});


/*  [2.Decimal]
 =========================================*/
$(document).ready(function () {

    function formataPreco(seletor) {
        $(seletor).each(function () {
            var novoConteudoPreco = $(this).text();
            if (novoConteudoPreco.indexOf(',') > -1) {
                var padrao = /(\$[\s0-9.]*)([,0-9]+)/gm;
                novoConteudoPreco = novoConteudoPreco.replace(padrao, '$1');
                $(this).html(novoConteudoPreco);
            }
        });
    }

    if ($('.price')) {
        formataPreco('.newPrice em, .oldPrice em, .installment em');
    }

    if ($('.descricao-preco')) {
        formataPreco('.skuListPrice, .valor-por, .valor-de, .skuBestInstallmentValue');
    }

    if ($('span.oldPrice')) {
        formataPreco('span.oldPrice');
    }

    if ($('span.bestPrice')) {
        formataPreco('span.bestPrice');
    }

    function formataCarrinho() {
        $('th.cartSkuName').text('Producto');
        $('th.cartSkuPrice').text('Precio');
    }

    $(document).ajaxStop(function () {
        formataPreco('.skuListPrice, .skuBestPrice, span.bestPrice, span.oldPrice, .price-best-price, .skuBestInstallmentValue');
        formataPreco('em.total-cart-em');
        formataPreco('span.vtexsc-text');
        formataPreco('td.monetary');
        formataPreco('span.best-price.new-product-price');
        formataPreco('td.quantity-price.hidden-phone.hidden-tablet');
        formataPreco('span.payment-value-monetary');
        formataPreco('span.payment-value-monetary');
        formataPreco('span.payment-installmetns');
        formataCarrinho();
    });

    // 'fn' que se implementa en las prateleiras con porcentaje de descuento.
    $('.porcentaje').each(function () {
        var valor = $(this).text();
        if (valor == 0) {
            $(this).remove();
        } else {
            $(this).text(valor.split(',')[0] + '%');
        }
    });
});

function formataPreco(seletor) {
    $(seletor).each(function () {
        var novoConteudoPreco = $(this).text();
        if (novoConteudoPreco.indexOf(',') > -1) {
            var padrao = /(\$[\s0-9.]*)([,0-9]+)/gm;
            novoConteudoPreco = novoConteudoPreco.replace(padrao, '$1');
            $(this).html(novoConteudoPreco);
        }
    });
};


//FORMAT SKU PRICE RELOAD
function FormatSkuPrice() {
    var a = $(".item-dimension-Talla input.input-dimension-Talla");
    a.on("click", function () {
        vtexjs.catalog.getCurrentProductWithVariations().done(function (product) {
            setTimeout(function () {
                formataPreco('.skuListPrice, .skuBestPrice, span.bestPrice, span.oldPrice, .price-best-price, .skuBestInstallmentValue');
            }, 500);
            //console.log(product);
        });
    });
}



/* [3.Slide Home]
=========================================*/
function slideHome() {
    $('.home-slide').slick({
        dots: false,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: '<button type="button" class="slick-arrow slick-prev trsn"><i class="fas fa-angle-left"></i></button>',
        nextArrow: '<button type="button" class="slick-arrow slick-next trsn"><i class="fas fa-angle-right"></i></button>',
        infinite: true,
        fade: false,
        speed: 1000
    });
};

/* [3.1.Slide Depto]
=========================================*/
function slideDepto() {
    $('.depto-slide').slick({
        dots: false,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: '<button type="button" class="slick-arrow slick-prev trsn"><i class="fas fa-angle-left"></i></button>',
        nextArrow: '<button type="button" class="slick-arrow slick-next trsn"><i class="fas fa-angle-right"></i></button>',
        infinite: true,
        fade: false,
        speed: 1000
    });
};

/* [3.2.Slide Depto]
=========================================*/
function slidePromo() {
    $('.msjPromo__slide').slick({
        arrows: false,
        dots: false,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        fade: false,
        speed: 500
    });
};


/* [11.Resize Offcanvas]
=========================================*/
function resizeoffcanvas() {
    var windowWidth = $(window).width();
    if (windowWidth <= 1024) {
        $('.filters-nav, .menuHelp-nav').addClass('off-canvas position-left');
        $('#category button.filtro-category, #form button.menuHelp, #static button.menuHelp').removeClass('hide');
        $('#category .filters-nav .close-button, #form .menuHelp-nav .close-button, #static .menuHelp-nav .close-button').removeClass('hide');
        // $('.wrap-listingProduct .listing-product, .formContent, .staticContent').removeClass('large-9').addClass('large-12');
    } else {

        $('.filters-nav, .menuHelp-nav').removeClass('off-canvas position-left');
        $('#category button.filtro-category, #form button.menuHelp, #static button.menuHelp').addClass('hide');
        $('#category .filters-nav .close-button, #form .menuHelp-nav .close-button, #static .menuHelp-nav .close-button').addClass('hide');
        // $('.wrap-listingProduct .listing-product, .formContent, .staticContent').removeClass('large-12').addClass('large-9');
    }
}

/* [4.Carousel Product Featured Home
=========================================*/
$(function () {
    $("#home .shelfProduct").find('ul').first().addClass("outstandingHomeCaruosel");
});

function carouselProductOutstanding() {
    $('.outstandingHomeCaruosel').slick({
        slide: 'li',
        dots: false,
        arrows: true,
        prevArrow: '<button type="button" class="slick-arrow slick-prev arrowCarousel trsn"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button type="button" class="slick-arrow slick-next arrowCarousel trsn"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        speed: 2000,
        autoplay: false,
        autoplaySpeed: 2000,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [{
            breakpoint: 1280,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4
            }
        }, {
            breakpoint: 980,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 650,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }]
    });
};

/* [5.Carousel Product Featured Sheet Product
=========================================*/
$(function () {
    $("#product .shelfProduct").find('ul').first().addClass("outstandingCaruosel");
});

function carouselProductOutstandingSheet() {
    $('.outstandingCaruosel').slick({
        slide: 'li',
        dots: false,
        arrows: true,
        prevArrow: '<button type="button" class="slick-arrow slick-prev arrowCarousel trsn"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button type="button" class="slick-arrow slick-next arrowCarousel trsn"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        speed: 2000,
        autoplay: true,
        autoplaySpeed: 2000,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [{
            breakpoint: 1280,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4
            }
        }, {
            breakpoint: 980,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 650,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }]
    });
};

/* [5.2.Carousel Product Featured Sheet Product
=========================================*/
$(function () {
    $("#depto .shelfProduct").find('ul').first().addClass("outstandingCaruosel");
});

function carouselDeptoOutstandingSheet() {
    $('.outstandingCaruosel').slick({
        slide: 'li',
        dots: false,
        arrows: true,
        prevArrow: '<button type="button" class="slick-arrow slick-prev arrowCarousel trsn"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button type="button" class="slick-arrow slick-next arrowCarousel trsn"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        speed: 2000,
        autoplay: true,
        autoplaySpeed: 2000,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [{
            breakpoint: 1280,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4
            }
        }, {
            breakpoint: 980,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 650,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }]
    });
};


/* [6.Add to Cart From Sheet Product
=========================================*/
function addToCartFProduct() {
    $(document).ready(function () {

        $(".buy-button.buy-button-ref").click(function () {
            if ($(this).attr('href') === "javascript:alert('Por favor, selecione o modelo desejado.');") {
                swal({
                    html: "Debes seleccionar una talla.",
                    type: 'info',
                    confirmButtonColor: '#000000',
                    timer: 3000
                });

                return false;
            } else {
                var url = $(this).attr('href').split("?")[1];
                var param = url.split("&");
                var item = {
                    id: param[0].split("=")[1],
                    quantity: param[1].split("=")[1],
                    seller: param[2].split("=")[1]
                };
                vtexjs.checkout.addToCart([item], null, 1).done(function (orderForm) {

                    $(".AmountItemsInCart .v2-vtexsc-cart").addClass("updateMinicart");

                    setTimeout(function () {
                        $(".AmountItemsInCart .v2-vtexsc-cart").removeClass("updateMinicart");
                    }, 4000);

                    swal({
                        html: "Producto agregado a tu carro.",
                        type: 'success',
                        confirmButtonColor: '#000000',
                        timer: 2500
                    });

                    $(".portal-minicart-ref .cartFooter a").attr("href", "/checkout/#/cart");

                });
            }
            return false;
        });
    });
}


function secondImg() {

    var $responsive = $(window).width();

    if ($responsive > 768) {

        var catalogProductId,
            $prat = $(".product-block");

        $prat.each(function () {

            // $(this).on("mouseenter", function () {
            var _thisParent = $(this).find(".product-block-info"),
                _thisImg = $(this).find(".prateleira__img"),
                _thisSecondImg = $(this).find(".second-img");

            if (_thisSecondImg.length > 0) {
                // console.log("vitrina ejecutada");
            } else if (_thisSecondImg.length == 0) {
                // $($template).appendTo(_thisImg);
                _thisImg.find(".productImage").wrap('<div class="first-img"></div>');

                _thisParent.each(function () {
                    var _thisId = $(this).find(".wrapper-buy-button-asynchronous").attr("class").split("bba")[1];
                    catalogProductId = _thisId;
                    //console.log(_thisId);

                    $.ajax({
                        url: "https://vanscl.vtexcommercestable.com.br/api/catalog_system/pub/products/search/?fq=productId:" + catalogProductId + "",
                        dataType: 'json',
                        type: 'GET',
                        crossDomain: true,
                        success: function (data) {
                            //console.log(data[0].items[0].images.length);
                            if (data[0].items[0].images.length > 1) {

                                var $elements = [],
                                    a = data[0].items[0].images[1].imageTag,
                                    b = a.replace(/[#~]/g, "").replace(/-width-\b/g, "-450-").replace(/-height\b/g, "-643").replace(/\s*(width)="[^"]+"\s*/g, " width='450'").replace(/\s*(height)="[^"]+"\s*/g, " height='643'"),
                                    $el = '<div class="second-img hover">' + b + '</div>';
                                //console.log($el)

                                _thisImg.append($el);
                            } else {
                                var $elements = [],
                                    a = data[0].items[0].images[0].imageTag,
                                    b = a.replace(/[#~]/g, "").replace(/-width-\b/g, "-450-").replace(/-height\b/g, "-643").replace(/\s*(width)="[^"]+"\s*/g, " width='450'").replace(/\s*(height)="[^"]+"\s*/g, " height='643'"),
                                    $el = '<div class="second-img hover">' + b + '</div>';
                                //console.log($el)

                                _thisImg.append($el);
                            }
                        }
                    });
                });
            }
            // });
        });

    }
}

function miniatura() {

    miniaturaActiva();
    miniaturaCarrusel();
    setTimeout(miniaturaSelect, 800);
    //reinitSlick();

    function miniaturaActiva() {
        var $el = $(".product-page-image__imagen .thumbs li"),
            $element = $(".product-page-image__imagen .thumbs li:eq(0)"),
            $otherImgs = $(".product-page-image__imagen .thumbs li");

        if ($el.length > 0) {
            $element.addClass('active');
            $otherImgs.each(function () {
                $(this).on("click", function () {
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                });
            });

        }
    }

    function miniaturaSelect() {

        var $element = $(".product-page-image__imagen .thumbs .slick-current a");

        $element.click();

    }

    function miniaturaCarrusel() {

        var $el = $(".product-page-image__imagen .thumbs li"),
            $init = $(".product-page-image__imagen .thumbs");

        if ($el.length > 4) {

            $init.slick({
                arrows: true,
                prevArrow: "<i class='fa fa-angle-left' aria-hidden='true'></i>",
                nextArrow: "<i class='fa fa-angle-right' aria-hidden='true'></i>",
                autoplay: true,
                button: false,
                dots: false,
                fade: false,
                infinite: true,
                slidesToScroll: 1,
                slidesToShow: 4,
                speed: 2000,
                useTransform: true,
                vertical: false,
                responsive: [

                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            vertical: false
                        }
                    }
                ]
            });
        }
    }

    function reinitSlick() {
        var a = $(".item-dimension-Talla input.input-dimension-Talla");
        a.on("click", function () {
            setTimeout(function () {
                //$('.product-page-image__imagen ul.thumbs').slick('slickRemove');  
                $('.product-page-image__imagen ul').removeClass('slick-initialized');
                $('.product-page-image__imagen ul.thumbs').slick('init');
                console.log("Slick Reiniciado reinit");

            }, 1000);
            console.log(product);
        });
    }
}



/* [12.Account
=========================================*/
showContentAccount = function () {
    //PROFILE USER
    //ADAPTATION FOUNDATION MODAL PROFILE USER
    $(".edit-profile-link a").attr("data-open", "editar-perfil").removeAttr("id").removeAttr("data-toggle");
    $("#editar-perfil").attr("data-reveal", "").attr("class", "reveal").attr("data-reveal-ajax", "true").removeAttr("tabindex").removeAttr("style");
    $(".modal-header button").attr("class", "close-button").attr("data-close", "").attr("aria-label", "Close modal").removeAttr("data-dismiss");

    //Open Modal Profile 
    $(".edit-profile-link a").click(function () {
        var popup = new Foundation.Reveal($('#editar-perfil'));
        popup.open();
        return false;
    });

    //Close Modal Profile 
    $("#profile .save-cancel-buttons button").attr("data-close", "").attr("aria-label", "Close modal");
    $('input[type=submit]#profile-submit').val('Guardar');
    //END PROFILE USER

    //ADDRESS USER
    //ADAPTATION FOUNDATION MODAL NEW/UPDATE  ADDRESS USER
    //$(".new-address-link a,.edit-address-link a.address-update").attr("data-open","address-edit").removeAttr("id").removeAttr("data-toggle");

    $(".new-address-link a, .edit-address-link a.address-update").attr("data-open", "AddressNew").attr("aria-controls", "AddressNew").attr("aria-haspopup", "true").attr("tabindex", "0").removeAttr("id").removeAttr("data-toggle").removeAttr("href");



    //$("#address-edit").attr("data-reveal","").attr("class","reveal").attr("data-reveal-ajax","true").removeAttr("tabindex").removeAttr("style");

    //Open Modal Address
    //$(".edit-address-link a.address-update").click(function () {
    //    var popup = new Foundation.Reveal($('#AddressNew'));
    //    popup.open();
    //    return false;
    //});

    //Close Modal Address
    $("#form-address .save-cancel-buttons button").attr("data-close", "").attr("aria-label", "Close modal");

    $("#addressName").keyup(function () {
        var value = $(this).val();
        $("#receiverName").val(value);
        //$("#complement").val(value);
        //$("#reference").val(value);
        $("#city").val(value);
    });
    //END ADDRESS USER

    //DELETE ADDRESS
    //ADAPTATION FOUNDATION MODAL DELETE ADDRESS USER
    $(".edit-address-link a.delete").attr("href", "#").attr("data-open", "address-remove").removeAttr("id").removeAttr("data-toggle");
    $("#address-remove").attr("data-reveal", "").attr("class", "reveal").attr("data-reveal-ajax", "true").removeAttr("tabindex").removeAttr("style");

    //Open Modal Delete 
    $(".edit-address-link a.delete").click(function () {
        var popup = new Foundation.Reveal($('#address-remove'));
        popup.open();
        return false;
    });

    //Close Modal Address
    $("#exclude .save-cancel-buttons button").attr("data-close", "").attr("aria-label", "Close modal");
    //END DELETE ADDRESS

    //ADDCLASS TRNS
    $(".save-cancel-buttons input#profile-submit, .save-cancel-buttons button.btn-link").addClass("trsn");



    $('.address-label').text("Nueva Dirección");

    //address delete open pop
    $(".delete").click(function () {
        var addressName = $(this).attr('data-addressname');
        var replaced = "Realmente desea eliminar esta dirección " + addressName + "?";
        $("#exclude-message").html(replaced);
        $("#address-delete").attr('data-addressname', addressName);
    });

    //address delete exclude click
    $("#address-delete").click(function () {
        var addressName = $(this).attr('data-addressname');
        if (addressName == "") {
            $('#exclude').css('visibility', 'hidden');
            $('#address-remove').html("<h4>Ha ocurrido un error (addressName). Por favor, intenta nuevamente.</h4>");
            $('#address-remove').fadeOut(3500, function () {
                location.reload();
            });
        } else {
            $.ajax({
                type: "GET",
                url: "/no-cache/account/address/delete/" + addressName,
                success: function () {
                    $('#exclude').css('visibility', 'hidden');
                    $('#address-remove').html("<h4>Dirección eliminada con éxito!</h4>");
                    $('#address-remove').fadeOut(2200, function () {
                        location.reload();
                    });
                },
                error: function () {
                    $('#exclude').css('visibility', 'hidden');
                    $('#address-remove').html("<h4>Ha ocurrido un error inesperado. Por favor, intenta nuevamente.</h4>");
                    $('#address-remove').fadeOut(3500, function () {
                        location.reload();
                    });
                }
            });
        }
    });
};


var regiones = [],
    comunas = [],
    country = 'CHL';

$(function () {
    loadRegionComuna();
});

$('.addressUser').removeClass('hide');
$('.address-display-block .address-display').removeClass('row');


function loadRegionComuna() {
    $.ajax({
        type: "GET",
        dataType: 'html',
        url: 'https://io.vtex.com.br/front.shipping-data/2.20.10/script/rule/CountryCHL.js',
        success: function (response) {
            var data = response.split("this.map=");
            var json = data[1].split("}}")[0];
            json = json + "}}";
            json = json.split('"').join('');
            json = json.split('{').join('{"');
            json = json.split(':').join('":');
            json = json.split(',').join(',"');

            data = $.parseJSON(json);
            //console.log(data);

            for (region in data) {
                regiones.push({
                    id: region,
                    nombre: region
                });
                for (comuna in data[region]) {
                    comunas.push({
                        id: comuna,
                        id_region: region,
                        nombre: comuna,
                        codigo: (data[region])[comuna]
                    });
                }
            }

            $.each(regiones, function (index, value) {
                if (index == 0) {
                    $("#cmbRegion").append(new Option("-- Seleccione una Región --", ""));
                    $("#cmbComuna").append(new Option("-- Seleccione una Comuna --", ""));
                }
                $("#cmbRegion").append(new Option(value.nombre, value.id));
            });

            $("#cmbRegion").change(function () {
                var id = $(this).val();
                $('#cmbComuna').find('option').remove().end().append(new Option("-- Seleccione una Comuna --", ""));

                if (id != undefined && id != null && id != "") {
                    $.each(comunas, function (index, value) {
                        if (value.id_region == id)
                            $("#cmbComuna").append(new Option(value.nombre, value.codigo));

                    });

                    $("#cmbComuna").change(function () {
                        if ($(this).val() != "") {
                            var comuna = comunas.find(c => c.codigo == $(this).val());
                            $("#spnNombreComuna").text(comuna.nombre);

                        } else {

                        }

                    });
                }
            });
        }
    });
}

//Address Create
$(function () {
    $('#formAddressNew').submit(function (e) {
        e.preventDefault();
        createAddress();
    });
});

function createAddress() {
    var country = $("meta[name='country']").attr("content");
    var addressName = $('#aliasDireccion').val();
    var receiverName = $('#destinatario').val();
    var addressType = '1';
    var postalCode = $('#cmbComuna').val();
    var street = $('#direccion').val();
    var number = $('#numeroDireccion').val();
    var neighborhood = $('#spnNombreComuna').text();
    var city = '-';
    var country = $('#country').val();
    var complement = $('#pisoDireccion').val();
    var reference = '-';
    var state = $('#cmbRegion').val();
    var userId = $('#userId').val();
    var addressId = $('#addressId').val();

    var dataString =
        'addressName=' + addressName +
        '&receiverName=' + receiverName +
        '&addressType=' + addressType +
        '&postalCode=' + postalCode +
        '&street=' + street +
        '&number=' + number +
        '&complement=' + complement +
        '&reference=' + reference +
        '&neighborhood=' + neighborhood +
        '&city=' + city +
        '&state=' + state +
        '&country=' + country +
        '&userId=' + userId +
        '&addressId=' + addressId;
    //alert (dataString); return false;

    $.ajax({
        type: "POST",
        url: "/no-cache/account/address/save",
        data: dataString,
        success: function (data) {
            document.getElementById('newsLetter_form').reset();
            $('#addressAprob').foundation('open');
            $(document).click(function () {
                location.reload();
            });
        },
        error: function (data) {
            $('#addressError').foundation('open');
            $(document).click(function () {
                location.reload();
            });
        }
    });
}

//Address Update
$(".address-update").click(function () {
    var addressName = $(this).attr('data-addressname');
    if (addressName == "") {
        $('#aliasDireccion').val("");
        $('#destinatario').val("");
        $('1');
        $('#cmbComuna').val("");
        $('#direccion').val("");
        $('#numeroDireccion').val("");
        $('#pisoDireccion').val("");
        $('-');
        $('-');
        $('span#spnNombreComuna').text();
        $('#cmbRegion').val("");
        $('#addressId').val("");
    } else {
        $.ajax({
            dataType: "json",
            url: "/no-cache/account/address/detail/" + addressName,

            success: function (data) {
                $('#aliasDireccion').val(data['addressName']);
                $('#destinatario').val(data['receiverName']);
                $('1');
                $('#cmbComuna').val(data['city']);
                $('#direccion').val(data['street']);
                $('#numeroDireccion').val(data['number']);
                $('#pisoDireccion').val(data['complement']);
                $('-');
                $('-');
                $('span#spnNombreComuna').text(data['spnNombreComuna']);
                $('#cmbRegion').val(data['state']);
                $('#addressId').val(encodeURIComponent(data['addressName']));
            },
            error: function () {
                $('#addressError').foundation('open');
                $(document).click(function () {
                    location.reload();
                });
            }
        });
    }
});



//address delete open pop
$(".delete").click(function () {
    var addressName = $(this).attr('data-addressname');
    var replaced = "Desea eliminar esta direccion: " + addressName + "?";
    $("#exclude-message").html(replaced);
    $("#address-delete").attr('data-addressname', addressName);
});


//address delete exclude click
$("#address-delete").click(function () {
    var addressName = $(this).attr('data-addressname');
    if (addressName == "") {
        $('#addressError').foundation('open');
        $(document).click(function () {
            location.reload();
        });
    } else {
        $.ajax({
            type: "GET",
            url: "/no-cache/account/address/delete/" + addressName,
            success: function () {
                $('#addressDelete').foundation('open');
                $(document).click(function () {
                    location.reload();
                });
            },
            error: function () {
                $('#addressError').foundation('open');
                $(document).click(function () {
                    location.reload();
                });
            }
        });
    }
});





//INFINITY SCROLL
if ("function" !== typeof (String.prototype.trim)) String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};
(function ($) {
    "use strict";

    if (typeof $.fn.QD_infinityScroll === "function") return;

    // Iniciando las variables públicas del infinito scroll
    window._QuatroDigital_InfinityScroll = window._QuatroDigital_InfinityScroll || {};

    $.fn.QD_infinityScroll = function (opts) {
        "use strict";

        // Reducir el nombre de la variable pública
        var $public = window._QuatroDigital_InfinityScroll;

        // Función de registro
        var extTitle = "Infinity Scroll";
        var log = function (c, b) {
            if ("object" === typeof console && "undefined" !== typeof console.error && "undefined" !== typeof console.info && "undefined" !== typeof console.warn) {
                var a;
                "object" === typeof c ? (c.unshift("[" + extTitle + "]\n"), a = c) : a = ["[" + extTitle + "]\n" + c];
                if ("undefined" === typeof b || "alerta" !== b.toLowerCase() && "aviso" !== b.toLowerCase())
                    if ("undefined" !== typeof b && "info" === b.toLowerCase()) try {
                        console.info.apply(console, a)
                    } catch (d) {
                        try {
                            console.info(a.join("\n"))
                        } catch (e) {}
                    } else try {
                        console.error.apply(console, a)
                    } catch (f) {
                        try {
                            console.error(a.join("\n"))
                        } catch (g) {}
                    } else try {
                        console.warn.apply(console, a)
                    } catch (h) {
                        try {
                            console.warn(a.join("\n"))
                        } catch (k) {}
                    }
            }
        };

        var defaults = {
            // Última vitrina (Prateleira) en la página
            lastShelf: ">div:last",
            // Elemento con mensaje de carga al iniciar la solicitud de página siguiente
            elemLoading: '<!-- Infinity Scroll - Loading message --><div id="scrollLoading" class="qd-is-loading">cargando... </div>',
            // Opción para fijar la URL manualmente, quedando automáticamente la paginación. La url debe terminar con "...&PageNumber="
            searchUrl: null,
            // Objeto jQuery con el botón de volver arriba
            returnToTop: $('<div id="returnToTop" class="qd-is-return-top"><a href="#"><span class="text">voltar ao</span><span class="text2">TOPO</span><span class="arrowToTop"></span></a></div>'),
            // Define en qué selector la acción de observar el desplazamiento será aplicado (ej .: $ (window) .scroll (...))
            scrollBy: document,
            // Callback Cuando se completa una solicitud ajax de la vitrina (prateleira)
            callback: function () {},
            // Cálculo del tamaño del footer para que una nueva página sea llamada antes de que el usuario llegue al "final" del sitio
            getShelfHeight: function ($this) {
                return ($this.scrollTop() + $this.height());
            },
            // Opción para hacer la paginación manualmente, una nueva página sólo se llama cuando se ejecuta el comando dentro de esta función. Útil para tener un botón "Mostrar más productos"
            // Se recibe como parámetro: 1 función que llama a la siguiente página (si existe)
            paginate: null,
            // Esta función es la que controla dónde se inserta el contenido. Se recibe como parámetro: El último bloque insertado y los datos de la nueva solicitud AJAX
            insertContent: function (currentItems, ajaxData) {
                currentItems.after(ajaxData);
            },
            // Función para permitir o no que el desplazamiento infinito ejecute en la página esta debe devolver "true" o "false"
            authorizeScroll: function () {
                return true;
            }
        };
        var options = jQuery.extend({}, defaults, opts);
        var $this = jQuery(this);
        var $empty = jQuery("");

        if ($this.length < 1)
            return $this;

        // Comprobar si hay más de una virina (prateleira) seleccionado
        if ($this.length > 1) {
            log("Identifiquei que a seletor informado (" + $this.selector + ") retornou " + $this.length + " elementos.\n Para solucionar o problema estou selecionando automáticamente o primeiro com o id: #" + ($this.filter("[id^=ResultItems]:first").attr("id") || "!Not Found"), "Aviso");
            $this = $this.filter("[id^=ResultItems]:first");
        }

        // Tratando de adivinar si esta tomando el elemento correcto del estante
        if (!$this.filter("[id^=ResultItems]").length)
            log(["Asegúrese de que está seleccionando el elemento correcto.\n El plugin espera que el elemento sea el que contiene el contenido id: #" + ($("div[id^=ResultItems]").attr("id") || "!Not Found"), $("div[id^=ResultItems]")], "Info");
        if ($this.parent().filter("[id^=ResultItems]").length) {
            $this = $this.parent();
            log(["He identificado que el selector primario del elemento que usted ha informado es #" + (jQuery("div[id^=ResultItems]").attr("id") || "!Not Found") + ".\n Como forma de corregir este problema de selección de elemento, asumiré el estante correcto.", $this], "Aviso");
        }

        // Adicionando botão de voltar ao topo
        //$("body").append(options.returnToTop);

        var $window = $(window);
        var $document = $(document);
        var $htmlWrapper = $(options.scrollBy);
        var elemLoading = $(options.elemLoading);
        $public.moreResults = true;
        $public.currentPage = 2;

        var getSearchUrl = function () {
            "use strict";
            var url;
            var preg = /\/buscapagina\?.+&PageNumber=/i;
            var pregCollection = /\/paginaprateleira\?.+PageNumber=/i;

            $("script:not([src])").each(function () {
                var content = this.innerHTML;
                if (content.indexOf("buscapagina") > -1) {
                    url = preg.exec(content);
                    return false;
                } else if (content.indexOf("paginaprateleira") > -1) {
                    url = pregCollection.exec(content);
                    return false;
                }
            });

            if (typeof url === "object" && typeof url[0] !== "undefined")
                return url[0].replace("paginaprateleira", 'buscapagina');
            else {
                log("No se pudo encontrar la url de búsqueda de página.\n Intente agregar el .js al final de la página. \n[Método: getSearchUrl]");
                return "";
            }
        };

        var infinityScroll = function () {
            "use strict";
            $public.searchUrl = (null !== options.searchUrl) ? options.searchUrl : getSearchUrl();
            $public.currentStatus = true;

            // Cantidad de páginas obtenidas en la búsqueda
            // Obteniendo el elemento en el HTML que indica el número que completa el nombre de la variable
            var elementPages = $(".pager[id*=PagerTop]:first").attr("id") || "";
            if (elementPages !== "") {
                // Obteniendo la cantidad de páginas
                $public.pages = window["pagecount_" + elementPages.split("_").pop()];
                if (typeof $public.pages === "undefined") {
                    // Buscando la cantidad de página dentro de "window" si no ha encontrado la variable con el ID obtenido en el elemento de paginación
                    for (var i in window)
                        if (/pagecount_[0-9]+/.test(i)) {
                            $public.pages = window[i];
                            break;
                        }
                }
            }
            // Si no se puede obtener una página, se establece un valor gigantesco para que la parada se haga automáticamente
            if (typeof $public.pages === "undefined")
                $public.pages = 9999999999999;

            var getShelf = function () {
                if (!$public.currentStatus) return;

                var currentItems = $this.find(options.lastShelf);
                if (currentItems.length < 1) {
                    log("Última vitrina (Prateleira) no encontrada \n (" + currentItems.selector + ")");
                    return false;
                }

                currentItems.after(elemLoading);
                $public.currentStatus = false;
                var requestedPage = $public.currentPage;
                $.ajax({
                    url: $public.searchUrl.replace(/pagenumber\=[0-9]*/i, "PageNumber=" + $public.currentPage),
                    dataType: "html",
                    success: function (data) {
                        if (data.trim().length < 1) {
                            $public.moreResults = false;
                            log("No hay más resultados de la página: " + requestedPage, "Aviso");
                            $(window).trigger("QuatroDigital.is_noMoreResults");
                        } else
                            options.insertContent(currentItems, data);
                        $public.currentStatus = true;
                        elemLoading.remove();
                    },
                    error: function () {
                        log("Hubo un error en la solicitud Ajax de una nueva página");
                    },
                    complete: function (jqXHR, textStatus) {
                        options.callback();

                        $(window).trigger("QuatroDigital.is_Callback");
                    }
                });
                $public.currentPage++;
            };

            if (typeof options.paginate === "function")
                options.paginate(
                    function () {
                        if ($public.currentPage <= $public.pages && $public.moreResults) {
                            getShelf();
                            return true;
                        }
                        return false;
                    }
                );
            else {
                var scrollTimeout = 0;
                $htmlWrapper.bind("scroll.QD_infinityScroll_paginate", function () {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(function () {
                        if ($public.currentPage <= $public.pages && $public.moreResults && options.authorizeScroll() && ($window.scrollTop() + $window.height()) >= options.getShelfHeight($this))
                            getShelf();
                    }, 70);
                });
            }
        }

        //scrollToTop();
        infinityScroll();

        return $this;
    };

    // Anulando la función de paginación de VTEX
    $(document).ajaxSend(function (e, request, settings) {
        if (settings.url.indexOf("PageNumber") > -1 && settings.url.search(/PageNumber\=[^0-9]+/) > 0)
            request.abort();
    });

    // Anula función de VTEX que hace desplazarse en la página después de paginar
    window.goToTopPage = function () {};
    $(function () {
        window.goToTopPage = function () {};
    });
})(jQuery);

// blog control
var blog = {
    init: function () {
        var $bodyHome = $("body.home");
        if ($bodyHome.length) {
            blog.getPostHome(blog.getPostCallback);
        }
        blog.getPostsToPagePost();
    },
    // append posts to home
    getPostHome: function (callback) {

        var host = "https://blog.vans.com.br";
        var allPosts = host + "/wp-json/wp/v2/posts?_embed&per_page=4";
        var posts = host + "/wp-json/wp/v2/posts?_embed&per_page=4&categories=";
        var $feedBlog = "#feedBlog";

        blog.getPosts(allPosts, $feedBlog + " " + ".feedAll");
        // console.log($feedBlog + " " + ".feedAll");
        blog.getPosts(posts + "7", $feedBlog + " " + ".feedClassis");
        blog.getPosts(posts + "12", $feedBlog + " " + ".feedEventos");
        blog.getPosts(posts + "6", $feedBlog + " " + ".feedFeminino");
        blog.getPosts(posts + "11", $feedBlog + " " + ".feedHouse");
        blog.getPosts(posts + "10", $feedBlog + " " + ".feedKids");
        blog.getPosts(posts + "2", $feedBlog + " " + ".feedMasculino");
        blog.getPosts(posts + "13", $feedBlog + " " + ".feedNews");
        blog.getPosts(posts + "3", $feedBlog + " " + ".feedSkate");
        blog.getPosts(posts + "8", $feedBlog + " " + ".feedSurf");
        blog.tabs();
        setTimeout(function () {
            callback();
        }, 5000);
    },
    // find post class in body
    getPostsToPagePost: function () {
        var $body = $("body.post");
        var $blogContent = $(".post__page-content");
        var postUrl = "https://blog.vans.com.br/wp-json/wp/v2/posts/";
        var tech = blog.getUrlParameter('id');
        var urlAllPost = "https://blog.vans.com.br/wp-json/wp/v2/posts?_embed";

        if ($body.length) {
            // $blogContent.html('<div class="container-center blog"></div>');
            if (window.location.href.indexOf("id") > -1) {
                blog.getPostPage(postUrl + tech, tech);
            } else {
                blog.getPosts(urlAllPost, ".post__page-content");
                document.title = "Blog | Vans";
            }
        }
    },
    // call back for append post in home
    getPostCallback: function () {
        console.log('all post loaded');
        blog.checkForEmptyPost();
    },
    // load tabs after post append home
    tabs: function () {
        var $a = '.tab__btn';
        var $b = '.tab_content';

        $($a + ':not(:first)').addClass('inactive');
        $($b).hide();
        $($b + ':first').show();

        $($a).click(function () {
            var t = $(this).attr('id');
            if ($(this).hasClass('inactive')) { //this is the start of our condition 
                $($a).addClass('inactive');
                $(this).removeClass('inactive');

                $($b).hide();
                $('#' + t + 'C').fadeIn('slow');
            }
        });
        return false;
    },
    // check for empy post after tabs
    checkForEmptyPost: function () {
        var $tabContent = $(".tab_content");
        if ($tabContent.length) {
            $tabContent.each(function () {
                _thisTabContent = $(this);
                _thisClass = _thisTabContent.attr('class');
                _thisSplit = $.trim(_thisClass.split('tab_content')[1]);
                // _thisPostItem = $('.' + _thisSplit + ' ' + '.post-item');
                _thisPostItem = _thisTabContent.find('.post-item');

                if (_thisPostItem.length == 0) {
                    $('.tab__btn' + '.' + _thisSplit).remove();
                    console.log('.' + _thisSplit + ' ' + 'does not have posts');
                }
            });
        }
    },
    //get posts to home
    getPosts: function (url, container) {
        $.ajax({
            url: url,
            type: 'GET',
            crossDomain: true,
            cache: false,
            success: function (data) {
                $.each(data, function (i, val) {
                    var link = "/post?id=" + this.id;
                    var title = this.title.rendered;
                    var excerpt = this.excerpt.rendered;
                    var readMore = '<a class="post__see-more" href="' + link + '" title="ver más">Ver más</a> ';
                    var postName = '<h5><a href="' + link + '" title="' + title + '">' + title + '</a></h5>';
                    var foto = this._embedded["wp:featuredmedia"];
                    if (foto == undefined && foto == null) {
                        foto = "//hovbr.hospedagemdesites.ws/blog_new/wp-content/uploads/2017/10/091020171150421-300x300.jpeg"; // generic image
                    } else {
                        foto = this._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url;
                    }
                    $(container).append(
                        '<div class="post-item">' +
                        '<article class="teaser">' +
                        '<a class="thumb" href="' + link + '" title="' + title + '">' +
                        '<picture class="ratio-square">' +
                        '<img src="' + foto + '" alt="' + title + '" title="' + title + '">' +
                        '</picture>' +
                        '</a>' + postName +
                        '<div class="details">' +
                        '<p class="short">' + excerpt + '</p>' + readMore +
                        '</div>' +
                        '</article>' +
                        '</div>'
                    );
                });
            }
        });
    },
    //get post page
    getPostPage: function (url_address, id_Post) {
        var $blogContent = $(".post__page-content");
        $.ajax({
            type: 'GET',
            //dataType: 'jsonp',
            url: url_address,
            crossDomain: true,
            cache: false,
            success: function (data) {
                var title = data.title.rendered;
                var content = data.content.rendered;

                document.title = title + " | Vans";

                $blogContent.html(
                    '<aside id="postTagArea" class="post__tags">' +
                    '<h3>Tags:</h3>' +
                    '<div class="tagsContainer">' + '</div>' +
                    '</aside>' +
                    '<article class="post__article">' +
                    '<h1>' + title + '</h1>' +
                    '<div>' + content + '</div>' +
                    '</article>' +
                    '<aside id="postProductAndStatsArea" class="post__product-related">' +
                    '<div id="postProductArea">' +
                    '<h3>Produtos relacionados</h3>' +
                    '</div>' +
                    '<div id="postStatsArea">' + '</div>' +
                    '</aside>'
                );
            }
        });
    },
    // get url id
    getUrlParameter: function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1));
        var sURLVariables = sPageURL.split('&');
        var sParameterName;
        var i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }
};

/* [Execute Functions]
=========================================*/
$(document).ready(function ($) {
    //loaderBusy();
    resizeoffcanvas();
    //changeTextSelectSize();
    slideHome();
    slideDepto();
    slidePromo();
    //carouselBrand();
    carouselProductOutstanding();
    carouselDeptoOutstandingSheet();
    //carouselProductOutstandingSheet();
    showContentAccount();
    addToCartFProduct();
    FormatSkuPrice();
    secondImg();
    miniatura();
    blog.init();
    //miniatura_dos();

    $(window).bind("resize", function () {
        resizeoffcanvas();
    });

});