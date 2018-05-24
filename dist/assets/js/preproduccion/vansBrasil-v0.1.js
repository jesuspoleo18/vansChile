$(document).ready(function() {
  if( $(window).width() < 768) {

    $(".prodHover").append('<p class="mobBuy">Comprar</p>')

    $(".productImage").click(function(e){
      e.preventDefault();
      $(this).toggleClass("activeMob");
    });

    $(".mobBuy").click(function(e){
      e.stopPropagation();
      $(this).parent(".prodHover").parent(".productImage").addClass("activeMob");
      console.log("foi");
    });

  }

  jQuery('.scroll').on('click', function(){
   jQuery('html, body').animate({
          scrollTop: $("#rodape").offset().top
      }, 800);
  });

  function sendMyAjax(URL_address, Id_name,details = true){
      $.ajax({
        url: URL_address,
        type: 'GET',
        //dataType: 'jsonp',
        success: function ( data ) {
          console.log(data);
          for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
              if(prop <= 3){
                var link = "/post?id="+data[prop].id; ///post?id="+data[prop].id;
                var title = data[prop].title.rendered;
                if(details){
                  var excerpt  = data[prop].excerpt.rendered;
                  var readMore = '<a class="read-more-link" href="'+link+'" title="mais">Leia mais</a> ';
                  var postName = '<h5><a href="'+link+'" title="'+title+'">'+title+'</a></h5>'; 
                }else{
                  var excerpt  = '';
                  var readMore = '';  
                  var postName = '';
                }
                var foto = data[prop]._embedded["wp:featuredmedia"];
                if(foto == undefined){
                  foto = "//hovbr.hospedagemdesites.ws/blog_new/wp-content/uploads/2017/10/091020171150421-300x300.jpeg"; // imagem genÃ©rica
                } else {
                  foto = data[prop]._embedded["wp:featuredmedia"]["0"].media_details.sizes.full.source_url;
                }
                //console.log(foto);
                $(Id_name).append('<div class="item large-3 medium-6 small-6 columns">    <article class="teaser">        <a class="thumb" href="'+link+'" title="'+title+'">            <picture class="ratio-square">                <img src="'+foto+'" alt="'+title+'" title="'+title+'">            </picture>        </a>    '+postName+'    <div class="details">    <p class="short">'+excerpt+'</p>  '+readMore+'</div>  </article></div>');
                $("#postsLoading").hide();
              }
            }
          }          
        },
        cache: false
      });
  };

  //blog feed
  jQuery( function( $ ) {

    var linkBlog = "https://blog.vans.com.br/wp-json/wp/v2/posts?_embed&categories="


    if($("body").hasClass("home") || $("body").hasClass("shop")) {

      $(".feedAll").prepend("<p id='postsLoading'>Carregando...</p>");
      
      /* geral */
      sendMyAjax("https://blog.vans.com.br/wp-json/wp/v2/posts?_embed", ".feedAll");

      /* classics - 7 */
      sendMyAjax(linkBlog+"7", ".feedClassis");

      /* eventos - 12 */
      sendMyAjax(linkBlog+"12", ".feedEventos");

      /* feminino - 6 */
      sendMyAjax(linkBlog+"6", ".feedFeminino");

      /* house of vans - 11 */
      sendMyAjax(linkBlog+"11", ".feedHouse");

      /* kids - 10 */
      sendMyAjax(linkBlog+"10", ".feedKids");

      /* masculino - 2 */
      sendMyAjax(linkBlog+"2", ".feedMasculino");
    
      /* novidades - 13 */
      sendMyAjax(linkBlog+"13", ".feedNews");

      /* skate - 3 */
      sendMyAjax(linkBlog+"3", ".feedSkate");

      /* surf - 8 */
      sendMyAjax(linkBlog+"8", ".feedSurf");

    }

    // Ver Mais button Blog pages
    //$("#catBlog .container-center").append("<a class='linkBlog' href=''>Ver Mais</a>");
    if($("body").hasClass("surf")) {
      // Surf Page
      sendMyAjax(linkBlog+"8", ".feedSurf2");
      sendMyAjax(linkBlog+"27", ".feedSurf3",false);
      $("body.surf #catBlog .container-center").prepend("<div class='feedSurf2'><h3 class='title3'>Notícias Vans Surf</h3></div>");
      $("body.surf #catBlog2 .container-center").prepend("<div class='feedSurf3'><h3 class='title3'>Surf Team</h3></div>");
      //$("body.surf #catBlog .linkBlog").attr("href", "http://hovbr.hospedagemdesites.ws/blog_new/category/surf/");
    }

    if($("body").hasClass("skate")) {
     // Skate Page
      sendMyAjax(linkBlog+"3", ".feedSkate2");
      sendMyAjax(linkBlog+"21", ".feedSkate3",false);
      $("body.skate #catBlog .container-center").prepend("<div class='feedSkate2'><h3 class='title3'>Notícias Vans Skate</h3></div>");
      $("body.skate #catBlog2 .container-center").prepend("<div class='feedSkate3'><h3 class='title3'>Skate Team</h3></div>");
      //$("body.skate #catBlog .linkBlog").attr("href", "http://hovbr.hospedagemdesites.ws/blog_new/category/skate/");
    }

    if($("body").hasClass("feminino")) {
     // Skate Page
      sendMyAjax(linkBlog+"6", ".feedFeminino2");
      $("body.feminino #catBlog .container-center").prepend("<div class='feedFeminino2'></div>");
      //$("body.skate #catBlog .linkBlog").attr("href", "http://hovbr.hospedagemdesites.ws/blog_new/category/skate/");
    }

    if($("body").hasClass("masculino")) {
     // Skate Page
      sendMyAjax(linkBlog+"2", ".feedMasculino2");
      $("body.masculino #catBlog .container-center").prepend("<div class='feedMasculino2'></div>");
      //$("body.skate #catBlog .linkBlog").attr("href", "http://hovbr.hospedagemdesites.ws/blog_new/category/skate/");
    }

    if($("body").hasClass("houseofvans")) {
      // House of Vans Page
      sendMyAjax(linkBlog+"11", ".feedHouse");
      $("body.houseofvans .blogHouse .content").prepend("<div class='feedHouse'></div>");
      //$("body.skate #catBlog .linkBlog").attr("href", "http://hovbr.hospedagemdesites.ws/blog_new/category/skate/");      
    }

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    if($("body").hasClass("post")) {

      $("body.post .institucionalPage").html('<div class="container-center blog"></div>');
      if(window.location.href.indexOf("id") > -1){
        var postUrl = "https://blog.vans.com.br/wp-json/wp/v2/posts/";
        var tech = getUrlParameter('id');
        sendMyAjax2(postUrl+tech, tech);
      } else {
        sendMyAjax("https://blog.vans.com.br/wp-json/wp/v2/posts?_embed", ".container-center.blog");
        document.title = "Blog | Vans";
      }

    }

    function tagLinker(name){
      var links = {
        skate       : '/skate',
        surf        : '/surf',
        classics    : '/classics',
        feminino    : '/feminino',
        houseofvans : '/houseofvans',
        kids        : '/kids',
        masculino   : '/masculino',
        skateteam   : '/skate',
        surfteam    : '/surf'

      };
      name = name.toLowerCase().replace(/ /g,'');
      return links[name] ? links[name] : '/';
    }

    function sendMyAjax2(URL_address, Id_Post){
      $.ajax({
        type: 'GET',
        //dataType: 'jsonp',
        url: URL_address,
        success: function ( data ) {                      
          //var link = "/post?lid=b21e5c99-6232-4110-94c4-ac985c5ab2b8&id="+data[prop].id; ///post?id="+data[prop].id;
          var title = data.title.rendered;
          var content = data.content.rendered;
          //var foto = data[prop]._embedded["wp:featuredmedia"];
          //if(foto == undefined){
            //foto = "http://hovbr.hospedagemdesites.ws/blog_new/wp-content/uploads/2017/10/091020171150421-300x300.jpeg"; // imagem genÃ©rica
          //} else {
            //foto = data[prop]._embedded["wp:featuredmedia"]["0"].media_details.sizes.medium.source_url;
          //}
          
          document.title = title+" | Vans";
          $("body.post .institucionalPage .container-center").html('<aside id="postTagArea"><h3>Tags:</h3><div class="tagsContainer"></div></aside><article><h1>'+title+'</h1><div>'+content+'</div></article><aside id="postProductAndStatsArea"><div id="postProductArea"><h3>Produtos relacionados</h3></div><div id="postStatsArea"></div></aside>');

          //related prods and stats
          $.ajax({
            url: "https://blog.vans.com.br/wp-json/wp/v2/comments/?post="+Id_Post,
            type: 'GET',
            success: function ( commentData ) {}
          });

          //"tags" / categories
          for(var i=0; i < data.categories.length; i++){
            $.ajax({
                    url: "https://blog.vans.com.br/wp-json/wp/v2/categories/"+data.categories[i],
                    type: 'GET',
                    //dataType: 'jsonp',
                    success: function ( tagData ) {                        
                      var tagHTML = '<a href="'+tagLinker(tagData.name)+'">';
                      tagHTML    +=   tagData.name.toLowerCase();
                      tagHTML    += '</a><br />';
                      $("body.post .institucionalPage .container-center aside#postTagArea .tagsContainer").append(tagHTML);
                    }
            });
          }

        },
        cache: false
      });
    };
    

  });

  $(".customCenter .todos").addClass("active");
  $("#feedBlog .feedAll").fadeIn();

  // todos
  $(".customCenter .todos").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedAll").fadeIn();
  });

  // classic
  $(".customCenter .classics").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedClassis").fadeIn();
  });

  // eventos
  $(".customCenter .eventos").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedEventos").fadeIn();
  });

  // feminino
  $(".customCenter .feminino").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedFeminino").fadeIn();
  });

  // house-of-vans
  $(".customCenter .house-of-vans").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedHouse").fadeIn();
  });

  // kids
  $(".customCenter .kids").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedKids").fadeIn();
  });

  // masculino
  $(".customCenter .masculino").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedMasculino").fadeIn();
  });

  // novidades
  $(".customCenter .novidades").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedNews").fadeIn();
  });

  // skate
  $(".customCenter .skate").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedSkate").fadeIn();
  });

  // surf
  $(".customCenter .surf").click(function(){
    $(".customCenter > div").removeClass("active");
    $(this).addClass("active");
    $("#feedBlog > div").css("display","none");
    $(".feedSurf").fadeIn();
  });

  $(".skuList label").click(function(){
    setTimeout(function(){ 
      //show buy button
      if($(".sku-notifyme").attr("style") == "display: block;") {
          $(".linkAddAoCarrinho, .clonedBt").css("display","none");
          $(".alertProd").html("");
      } else {
          $(".linkAddAoCarrinho, .clonedBt").css("display","block");
          $(".alertProd").html("");
      }
    }, 200);
  });

  $(".sku-selector").change(function() {
    setTimeout(function(){ 
      //show buy button
      if($(".sku-notifyme").attr("style") == "display: block;") {
          $(".linkAddAoCarrinho, .clonedBt").css("display","none");
          $(".alertProd").html("");
      } else {
          $(".linkAddAoCarrinho, .clonedBt").css("display","block");
          $(".alertProd").html("");
      }
    }, 200);
  });

  setTimeout(function(){ 
    $('.bread-crumb ul li').append('<span class="divider2">  >  </span>'); 
  }, 100);

  $(".helperComplement").remove();
  $(".vitrineInicial01 .prateleira > ul, .boxQVVT .prateleira > ul, .vitrineBusca ul").owlCarousel({
      items : 4,
      lazyLoad : true,
      navigation : true,
      scrollPerPage: true,
      slideSpeed: 800
  });

  // frases header
  $(".top-b .container-center").owlCarousel({
    navigation : true, 
    slideSpeed : 300,
    paginationSpeed : 200,
    singleItem:true,
    rewindNav: true,
    loop:true,
    autoPlay:true,
  });

  $(".bannerInicial01, #catBanner .container-center").owlCarousel({
    navigation : true, 
    slideSpeed : 300,
    paginationSpeed : 400,
    singleItem:true,
    rewindNav: true,
    loop:true,
    autoPlay:true
  });

  // slider yellow boot
  $(".slide-wrap > .columns > .switch-slide.tbl-theme, .yellow-boot-collab-wrapper > .switch-slide, .quem-somos .sobreBox.slider").owlCarousel({
    navigation : true, 
    slideSpeed : 300,
    paginationSpeed : 400,
    singleItem:true,
    rewindNav: true,
    loop:true,
    autoPlay:false
  });

  // slider yellow boot
  $(".lookbook #content .institucionalPage #slider").owlCarousel({
    margin:10,
    navigation : true, 
    slideSpeed : 300,
    paginationSpeed : 400,
    loop:true,
    autoPlay:false,
    //autoWidth:true,
    items:3,
    autoHeight:true
  });

  // show mobile menu
  $("#bt-open-mb").click(function(event) {
    $(".navbar-form").css("margin-left", "0px");
  });

  // hide mobile menu
  $("#bt-close-mb").click(function(event) {
    $(".navbar-form").css("margin-left", "-100%");
  });

  if( $(window).width() < 768) {

    $("#link-search-mobile").click(function(event) {
      $("#searchBox").slideToggle();
      $(this).toggleClass("activeTag");
    });
   
    $("#link-menu-mobile").click(function(event) {
      $("#menuList").slideToggle();
      $(this).toggleClass("activeTag");
    });

    $("#link-store-mobile").click(function(event) {
      window.location = "/encontre-lojas";
    });
    

    $('#menuList > ul > li.hasDrop > a').click(function(e) {
      /*e.preventDefault();
      $(this).toggleClass("arrowMenu");
      $("+ ul", this).slideToggle();*/
      e.preventDefault();
      $(this).parent().toggleClass('arrowMenu');
      $('+ ul', this).slideToggle();
    });

    $('.mobile-btn').click(function(e) {
      $('+ ul', this).slideToggle();
    });      

    $("#menuList > ul > li").each(function(){
      if($("> ul", this).length > 0){
        $(this).addClass("addArrow");
      } 
    });

    $(".footer-01-box span").click(function() {
      $(this).toggleClass("arrowMenu");
      $("+ div", this).slideToggle();
    });

  } 

  // mini cart
  /*setTimeout(function(){
      $(".portal-minicart-ref").prepend("<div id='dropCart'></div>");
      var dropCart = $(".v2-vtexsc-cart").html();
      $("#dropCart").html(dropCart);
      $(".v2-vtexsc-cart").remove();
      var dropCart2 = $(".portal-minicart-ref");
      var qtd = $(".amount-items-em").html();
      $("#cart-number").append(dropCart2).html();
      $(".epl-store-cart > .portal-minicart-ref").remove();
      $(".cartCheckout").attr("href","/checkout/#/cart");
      $(".cartCheckout").html("Ir para o carrinho");
      $("#dropCart").prepend("<div id='msgDropCart'><span id='cartTitle'>Sua sacola de compras contem "+qtd+" itens</span></div>");
      if(!$(".vtexsc-productList tbody").html().length){
        $("#dropCart").html("<div id='msgDropCart'><span id='cartTitle'>Sua sacola de compras estÃ¡ vazia =/</span></div>");
      }
  }, 2000);*/


  //account page
  setTimeout(function(){
    $("#business-toggle").html("Incluir dados de pessoa jur&iacute;dica");
  },4000);

  // border bottom layout
  $('.vitrineInicial01 h2').each(function() {
     var html = $(this).html();
     var word = html.substr(0, html.indexOf(" "));
     var rest = html.substr(html.indexOf(" "));
     $(this).html(rest).prepend($("<span/>").html(word).addClass("firstWord"));
  });
  $(".produto .boxQVVT").prepend("<h2 class='tiltQVVT'><b>Quem viu,</b> viu tambÃ©m</h2>");
  
});

/*$( ".prateleira li" ).hover(
function() {
  $(".add a", this).css("visibility", "visible");
}, function() {
  $(".add a", this).css("visibility", "hidden");
}
);*/

$(window).load(function() {

// wishlist 
$("#therms-accept #giftlistaccept").trigger('click');
$(".modal .close, #TB_closeWindowButton").html("X");
$(".listaDesejos #therms-accept #giftlistaccept").trigger('click');

});

//wishlist terms
$(".product-insertsku ul li label").click(function(){
if(!$(this).hasClass("checked")) {
  $(".glis-thickbox.tb-added").trigger("click");
}
});

//modal go to cart
jQuery(document).on("click", "#btGoCart", function (event) {
window.location = "/checkout/#/cart";
});

//modal keep buying
jQuery(document).on("click", "#btKeepBuy", function (event) {
$("#addProd .close").trigger("click");
});

jQuery(document).on("click", ".cartSkuRemove a", function (event) {
var itemIndex = $(this).parent(".cartSkuRemove").attr("data-index");
var quant = $(this).parent(".cartSkuRemove").parent(".cartSkuActions").prev(".cartSkuQuantity").children(".cartSkuQtt").children(".cartSkuQttTxt").children(".vtexsc-skuQtt").html();
setTimeout(function(){ 

  vtexjs.checkout.getOrderForm().then(function(orderForm) {
    var item = orderForm.items[itemIndex];
    itemsToRemove = {
        index: itemIndex,
        quantity: quant
    };
    console.log(itemsToRemove);
      vtexjs.checkout.removeItems([itemsToRemove]).done(function(orderForm) {
        alert('Item removido!');
        $(window).load(function(){
          setTimeout(function(){
              $(".portal-minicart-ref").prepend("<div id='dropCart'></div>");
              var dropCart = $(".v2-vtexsc-cart").html();
              $("#dropCart").html(dropCart);
              $(".v2-vtexsc-cart").remove();
              var dropCart2 = $(".portal-minicart-ref");
              var qtd = $(".amount-items-em").html();
              $("#cart-number").append(dropCart2).html();
              $(".epl-store-cart > .portal-minicart-ref").remove();
              $(".cartCheckout").attr("href","/checkout/#/cart");
              $(".cartCheckout").html("Finalizar Compra");
              $("#dropCart").prepend("<div id='msgDropCart'><span id='cartTitle'>Sua sacola de compras contem "+qtd+" itens</span></div>");
              if(!$(".vtexsc-productList tbody").html().length){
                $("#dropCart").html("<div id='msgDropCart'><span id='cartTitle'>Sua sacola de compras estÃ¡ vazia =/</span></div>");
              }
          }, 1000);
        });
      });
  });

}, 1500);

});

if($("body").hasClass("departamento") || $("body").hasClass("resultado-busca") || $("body").hasClass("categoria")) {

$("#boxFiltros").before("<span id='btFiltros'>Filtros</span>");

$("#catColLeft .search-single-navigator h4 + ul").addClass("withSub");
$(".withSub").prev("h4").addClass("withSub");

$("#boxFiltros > div.Cor > ul > li").each(function(){
  var nome = $("a", this).html();
  $("a", this).addClass("thumbCor-"+nome);
});

$("#catColLeft #boxFiltros h3, #catColLeft .search-single-navigator h4, #boxFiltros .menu-departamento h5, #menuOpcoes span, #catColLeft #boxFiltros h3").addClass("toggleOpc");

$(".prateleira[id*=ResultItems]").QD_infinityScroll({
  callback: function () {
    //Selo % no produto - Prateleiras 
    $(".helperComplement").remove();
      $(".flagPreco").each(function() {
        if ($(this).text() == '0') {
          $(this).css('display','none');
        }
      });
    $('.prateleira li').before(function(){
      var precoDe = $('.priceLabel', this).text(); 
          var precoDe2 = parseInt(precoDe).toFixed(0);
          $('.priceLabel', this).after('<div class="etiquetaValorDesconto">'+precoDe2+'%<br />OFF</div>');
        $('.priceLabel', this).remove();
  });
  }
});
$(window).bind("QuatroDigital.is_noMoreResults", function() {
    $(".loadProd").after("<div class='noResults'><p>NÃ£o existem mais resultados</p></div>");
    $(".loadProd").hide();
});
if($("#catDescript").html().length == 0){
  $("#catDescript").css("display","none");
}
}

// correcao do zoom
$(window).load(function() {
if($("body").hasClass("produto")) {

  vtexjs.catalog.getCurrentProductWithVariations().done(function(product){ 
    var disp = product.available; 
    if(disp == false) {
        $(".linkAddAoCarrinho, .clonedBt").css("display","none");
    } else {
      $(".buy-button").before("<p class='alertProd'></p><a class='clonedBt'>Comprar</a>");
    }
  });

  /*window.LoadZoom = function (pi) 
     {
       var optionsZoom = {
         zoomWidth: 470,
         zoomHeight: 470,
         preloadText: 'Carregando Super Zoom'
       };
       
       $(".image-zoom").jqzoom(optionsZoom);
     }
     LoadZoom(0);
 
     ImageControl($("ul.thumbs a:first"), 0);*/

  }
});

// toggle filtros
$(".toggleOpc").click(function(event) {
$(this).toggleClass("changeIcon");
$("+", this).slideToggle();
});

// botÃ£o Vault mob
$(".shop-subnav__title").click(function(event) {
$(".shop-subnav__links").slideToggle();
});

// toggle paises
$(".selected-region").click(function(event) {
$("+ #monetate_dropLocalize", this).slideToggle();
});

// click filtros
$("#btFiltros").click(function(event) {
$("#boxFiltros").slideToggle();
});

// footer newsletter 
$(".enviarPU").click(function(){

  function validateEmail(puEmail) {     
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(puEmail);
    }
  
    var varE = $(this).prev(".formsArea").children(".boxCampoPu").children(".puEmail").val();
    var varP = $(this).prev(".formsArea").children(".boxCampoPu").children("select").val();
    var campoE = $(this).prev(".formsArea").children(".boxCampoPu").children(".puEmail");
    var acessoE = $(this).parent(".formPU").parent(".newsCapBox");
   
    console.log(varE);
    console.log(campoE);
    console.log(varP);
    //var varN = $('#puNome').val();
  
    function validate(){
  
    //var puEmail = $("#puEmail").val();
  
    if (validateEmail(varE)) {
  
          getFromMasterData('PU', 'email='+varE, 'email');
  
    } else {
      //$(campoE).css('border','1px solid #d00d0d');
      $(campoE).before('<div class="box-form-msg">Preencha um e-mail válido</div>');
    }
      return false;
      }
  
    //$(campoE).css('border','1px solid #cccccc'); 
    $('.box-form-msg').css('display','none');
  
    if(varE == ''){
      //$(campoE).css('border','1px solid #d00d0d');
      $(campoE).before('<div class="box-form-msg">Preencha o campo E-mail</div>');
    } else if(varE != ''){
      validate();
  }
  
  //Pergunta e valida se o cliente jÃ¡ nos informou a data de nascimento.Se nÃ£o, mostra o modal, caso contrario nÃ£o mostra
  function getFromMasterData(name, where, fields) {  
      var store = 'lojavans';
      var urlProtocol = window.location.protocol;
      var apiUrl = urlProtocol + '//' + store + '.vtexcommercestable.com.br/api/dataentities/' + name + '/search?_where=' + where + '&_fields='+ fields;
      var response;
  
     $.ajax({
          "headers": {
              "Accept": "application/vnd.vtex.masterdata.v10.profileSchema+json"
          },
          "url": apiUrl,
          "async" : false,
          "crossDomain": true,
          "type": "GET"
      }).success(function(data) {
          //response = data;
          response = data[0];
          if(response == undefined){
              //console.log("NÃ£o existe este e-mail ... chamar POST");
              //$(campoE).css('border','1px solid #cccccc'); 
              $('.box-form-msg').css('display','none');
              enviaDados();
          } else {
            //console.log("E-mail jÃ¡ cadastrado =P");
            //$(campoE).css('border','1px solid #d00d0d');
            $(campoE).before('<div class="box-form-msg">E-mail não cadastrado</div>');
          }
          console.log(response);
      }).fail(function(data) {
          response = data;
      });
  
     return response;
  }
  
  function enviaDados(){
    var datos = {};
    datos.email = varE;
    datos.preferencia = varP;
    //datos.nome = varN;
    ////("Nome: "+datos.nome+"  E-mail: "+datos.email+"  Mensagem: "+datos.mensagem);
    $.ajax({
      accept: 'application/vnd.vtex.ds.v10+json',
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      data: JSON.stringify(datos),
      type: 'POST',
      url: '//api.vtexcrm.com.br/lojavans/dataentities/PU/documents',
      success: function(data) {
      console.log(data);
      $(acessoE).html("<span id='successTxt'>E-mail cadastrado com sucesso!</span><br/><span id='successTxt2'>Aproveite agora o seu desconto: </span><br/><span id='successTxt3'>WELCOME10OFF</span><br/><span id='successTxt4'>*válido apenas para e-mails não cadastrados e para a primeira compra por CPF</span>");
      },
      error: function(error){
      console.log(error);
      }
    });
    }
  
  });
//call modal
jQuery(document).on("click", ".clonedBt", function (event) {
  var hrefCart = $(".buy-button").attr("href");
  var message = "javascript:alert('Por favor, selecione o modelo desejado.');";
  if(hrefCart == message){
    $(".alertProd").html("<span>Selecione uma opÃ§Ã£o</span>");
  } else {
    $(".alertProd").remove();
    console.log(hrefCart);
    var resUTL = hrefCart.split("sku=").pop().split("&qty=").shift();
    var qtd = $(".showValue").val();
    setTimeout(function(){ 
      vtexjs.checkout.getOrderForm().then(function(){
        var item = {
            id: resUTL,
            quantity: qtd,
            seller: 1
        };
        console.log("ITEM: "+item.id+"  "+item.quantity+"  "+item.seller);
        vtexjs.checkout.addToCart([item]).done(function(orderForm){
          console.log('Item adicionado!');
          // mini cart
          setTimeout(function(){
              $(".portal-minicart-ref").prepend("<div id='dropCart'></div>");
              var dropCart = $(".v2-vtexsc-cart").html();
              $("#dropCart").html(dropCart);
              $(".v2-vtexsc-cart").remove();
              var dropCart2 = $(".portal-minicart-ref");
              var qtd = $(".amount-items-em").html();
              $("#cart-number").append(dropCart2).html();
              $(".epl-store-cart > .portal-minicart-ref").remove();
              $(".cartCheckout").attr("href","/checkout/#/cart");
              $(".cartCheckout").html("Finalizar Compra");
              $("#dropCart").prepend("<div id='msgDropCart'><span id='cartTitle'>Sua sacola de compras contem "+qtd+" itens</span></div>");
              var aux = $(".vtexsc-productList tbody").html().length;
              if(aux == undefined){
                console.log("mini cart error");
                $("#itensCarrinho .portal-minicart-ref").hide();
              } else if(!$(".vtexsc-productList tbody").html().length){
                $("#dropCart").html("<div id='msgDropCart'><span id='cartTitle'>Sua sacola de compras estÃ¡ vazia =/</span></div>");
              }
          }, 2000);
          $(".linkModalBuy").trigger("click");
        });
      });
    }, 1000);
  }
});

//block letters
$(".showValue").keydown(function (e) {
  // Allow: backspace, delete, tab, escape, enter and .
  if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
       // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
       // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)) {
           // let it happen, don't do anything
           return;
  }
  // Ensure that it is a number and stop the keypress
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
  }
});

/*jQuery(document).on("click", ".clonedBt", function (event) {
  var hrefCart = $(".buy-button").attr("href");
  var message = "javascript:alert('Por favor, selecione o modelo desejado.');";
  if(hrefCart == message){
    $(".alertProd").html("<span>Selecione uma opÃ§Ã£o</span>");
  } else {
    $(".alertProd").remove();
    ////console(hrefCart);
    var resUTL = hrefCart.split("sku=").pop().split("&qty=").shift();
    var qtd = $(".showValue").val();
    setTimeout(function(){ 
      vtexjs.checkout.getOrderForm().then(function(){
          window.location = "/checkout/cart/add?sku="+resUTL+"&qty="+qtd+"&seller=1&redirect=true&sc=1";
      });
    }, 1000);
  }
});*/


var wdw = $(window);
var body = $('body');

var eplCode = {

reconheceMobile: function() {
  //Insere umas classes para reconhecer se Ã© mobile ou desktop
  //de acordo com a largura da pÃ¡gina. 
  if ( wdw.width() > 1050 ) {
    body.addClass('dktPage');
  } else {
    body.addClass('mobilePage');
  }
},

calcAltura: function() {
  var alt = $(".bannerDestaqueTxt").height();
  //console.log(alt);
  $(".bannerDestaqueTxt").css('height', alt);
},

clickFaq: function() {
  $(".faq #catColLeft span").click(function(event) {
    $("+ ul", this).slideToggle();
    $(this).toggleClass("changeArrow");
  });
},

fixedCart: function() {
  $("#cartFixed").click(function(event) {
    window.location = "/checkout/#/cart";
  });
},

playVideo: function() {
  $(".play-button").click(function(event) {
   var id = $(this).parent("div").parent(".youtube-player").attr("data-id");
   $(this).parent("div").parent(".youtube-player").html('<iframe src="http://www.youtube.com/embed/'+id+'?autoplay=1&amp;autohide=2&amp;border=0&amp;wmode=opaque&amp;enablejsapi=1&amp;controls=1&amp;showinfo=0&amp;rel=0" frameborder="0" id="youtube-iframe"></iframe>')
  });
},

miniCartHover: function() {
  $('.portal-minicart-ref').minicart({ showMinicart: true, showTotalizers: true , showShippingOptions: false });
  $('#link-cart').hover( function() {
    $('.portal-minicart-ref').css('display','block');
    //$('.vtexsc-cart').trigger('mouseover');
  }, function() {
    $('.portal-minicart-ref').css('display','none');
  });
  setTimeout(function(){
      $(".portal-minicart-ref").prepend("<div id='dropCart'></div>");
      var dropCart = $(".v2-vtexsc-cart").html();
      $("#dropCart").html(dropCart);
      $(".v2-vtexsc-cart").remove();
      var dropCart2 = $(".portal-minicart-ref");
      var qtd = $(".amount-items-em").html();
      $("#cart-number").append(dropCart2).html();
      $(".epl-store-cart > .portal-minicart-ref").remove();
      $(".cartCheckout").attr("href","/checkout/#/cart");
      $(".cartCheckout").html("Finalizar Compra");
      $("#dropCart").prepend("<div id='msgDropCart'><span id='cartTitle'>Produtos do carrinho</span></div>");
      /*if(!$(".vtexsc-productList tbody").html().length){
        $("#dropCart").html("<div id='msgDropCart'><span id='cartTitle'>Sua sacola de compras estÃ¡ vazia =/</span></div>");
      }*/
      var aux = $(".vtexsc-productList tbody").html().length;
      if(aux == undefined){
        console.log("mini cart error");
        $("#itensCarrinho .portal-minicart-ref").hide();
      } else if(!$(".vtexsc-productList tbody").html().length){
        $("#dropCart").html("<div id='msgDropCart'><span id='cartTitle'>Sua sacola de compras estÃ¡ vazia =/</span></div>");
      }
  }, 2000);
},

clickParcelamento: function() {
  $("#guiaPgto a").click(function(event) {
    $("#guiaPgtoBox").slideToggle();
    //$(this).toggleClass("changeArrow");
  });

  if($('#guiaPgtoBox').children().length>0 && $.trim($("#guiaPgtoBox").text())!=='') {
  } else {
    $("#guiaPgto").css("display","none");
  }
},

carrosselReviews: function(){
  setTimeout(function(){
    // avaliacoes produto
    $(".avaliacao > .resenhas > .quem").owlCarousel({
      navigation : true, 
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem:true,
      rewindNav: true,
      loop:true,
      autoPlay:true
    });
    
    if($('.avaliacao > .resenhas > .quem').children().length>0 && $.trim($(".avaliacao > .resenhas > .quem").text())!=='') {
    } else {
      $(".produto #opiniao_de_usuario ul.rating").css("display","none");
    }
  }, 3000);
},

imagensDoProduto: function() {

  var allProdSkus = [];
  var allObjImg = [];
  var imgSizes = [];
  var imgName, imgPath, theModel;
  var lclSldrPrd = $('.lin01Col01 .imagePlace');
  //var testeImg = "http://lojatimberland.vteximg.com.br/arquivos/ids/283411-1000-1000/Pedal-Boss-Acoustic-Simulator-AC-3-.01.jpg";

  vtexjs.catalog.getCurrentProductWithVariations().done(function(product){

    allProdSkus = product.skus;
    
    allObjImg = getSkuData(allProdSkus[0].sku).images;
    console.log(allObjImg);
    $(allObjImg).each(function(ii) {
      imgName = allObjImg[ii][3].Name;
      imgPath = allObjImg[ii][3].Path;
      if ( body.hasClass('dktPage')) {
        /*lclSldrPrd.append(
          '<li class="liImage liImage'+ii+'"><span class="zoom-place"><img src="'+imgPath+'" class="zoomImage" style="width:1000px;height:1000px;"></span>'+
          '<img src="'+imgPath+'" alt="'+imgName+'" class="imgProd imgProd'+ii+'"></li>'
        );*/

        lclSldrPrd.append(
          '<li class="liImage liImage'+ii+'"><span class="zoom-place"><span class="zoomImage" style="z-index: 9999; width:1000px;height:1000px;background:url('+imgPath+')!important;"></span></span>'+
          '<img src="'+imgPath+'" alt="'+imgName+'" class="imgProd imgProd'+ii+'"></li>'
        );

        setTimeout(function() {//forÃ§ando a ser carregado por ultimo

          $('.liImage').each(function(i) {
            imgSizes[i,0] = ($(this).find('.imgProd').width());//Largura
            imgSizes[i,1] = ($(this).find('.imgProd').height());//Altura
            imgSizes[i,2] = imgSizes[i,0]/2;//Metade da Largura
            imgSizes[i,3] = imgSizes[i,1]/2;//Metade da Altura
            //console.log('liImage'+i+' width = '+imgSizes[i,2]);
            //console.log('liImage'+i+' height = '+imgSizes[i,3]);
            //console.log('---------------------------------------')
            imgSizes[i,4] = $('header .container').height();//Altura do header mais a bordinha preta    
            imgSizes[i,7] = (((imgSizes[i,0]/1000)*100) - 100)+'%';//Definindo a porcentagem de recuo
            $('.liImage .zoom-place .zoomImage').css('margin-bottom', imgSizes[i,7]).css('margin-right', imgSizes[i,7] );
            $(this).mousemove(function(e) {
                  imgSizes[i,5] = e.pageX - imgSizes[i,2];//posiÃ§Ã£o na horizontal -263
                  imgSizes[i,6] = e.pageY - imgSizes[i,3];//posiÃ§Ã£o na vertical
                  imgSizes[i,5] = (imgSizes[i,5]/imgSizes[i,0])*100; //-263/526*100
                  imgSizes[i,6] = (imgSizes[i,6]/imgSizes[i,1])*150;                    
                  imgSizes[i,5] = (imgSizes[i,5])+'%';
                  imgSizes[i,6] = (imgSizes[i,6])+'%';
                  $('.active .zoomImage').css('bottom', imgSizes[i,6] ).css('right', imgSizes[i,5] );
            });
          });
        },1000);

      } else {
        lclSldrPrd.append(
          '<li class="liImage liImage'+ii+'"><img src="'+imgPath+'" alt="'+imgName+'" class="imgProd imgProd'+ii+'"></li>'
        );
      }
      
    });

    setTimeout(function(){
      lclSldrPrd.owlCarousel({
        items : 1, 
        itemsDesktopSmall: [1200,1],
        itemsTablet: [1050,1],
        itemsMobile : [767,1],
        navigation : true,
        pagination : true, 
        addClassActive : true 
        });
    },1);

    setTimeout(function(){
      $(".imagePlace .owl-item").each(function(i){
        var img = $("img", this).attr("src");
        $(".imagePlace .owl-pagination .owl-page:eq("+i+") span").html("<img src='"+img+"' />")
      });
      $(".lin01Col01").animate({opacity:1});
      $(".boxProdLeft").addClass("hideLoad");
      //$(".boxProdLeft .owl-pagination .owl-page").fadeIn();
    }, 1500);

  });
  
},

init: function(){

  //Geral
  eplCode.reconheceMobile();
  eplCode.clickFaq();
  eplCode.fixedCart();
  eplCode.playVideo();
  eplCode.miniCartHover();

    if (body.hasClass('produto')) {
      eplCode.clickParcelamento();
      wdw.load(function() {
        eplCode.imagensDoProduto();
        eplCode.carrosselReviews();
      });
    }
}

}

$(document).ready(function() {

$(window).scroll(function(){
  if ($(this).scrollTop()>=500){
    $("#returnToTop").fadeIn();
  }
  else {
    $("#returnToTop").fadeOut();
  }
});

$(window).scroll(function(){
  if($(this).scrollTop()>=400){
    $("#boxFiltros").addClass("filtroFlutuante");
  }else{
    $("#boxFiltros").removeClass("filtroFlutuante");
  }
});

$("#returnToTop a").click( function(){
  jQuery('html, body').animate({
          scrollTop: $("body").offset().top
      }, 800);
});

eplCode.init();

});