var blog = {
    init: function () {
        blog.getPostHome(blog.getPostCallback);
    },
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
        setTimeout(function(){
            callback();
        }, 5000);
    },
    getPostCallback: function(){
        console.log('all post loaded');
        blog.checkForEmptyPost();
    },
    checkForEmptyPost: function(){
        var $tabContent = $(".tab_content");
        if($tabContent.length){
            $tabContent.each(function(){
                _thisTabContent = $(this);
                _thisClass = _thisTabContent.attr('class');
                _thisSplit = $.trim(_thisClass.split('tab_content')[1]);
                // _thisPostItem = $('.' + _thisSplit + ' ' + '.post-item');
                _thisPostItem = _thisTabContent.find('.post-item');

                if (_thisPostItem.length == 0) {
                    $('.tab__btn'+'.' +_thisSplit).remove();
                    console.log('.' +_thisSplit + ' ' +'does not have posts');
                }
            });
        }
    },
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
    //get posts
    getPosts: function (url, container, details = true) {
        $.ajax({
            url: url,
            type: 'GET',
            crossDomain: true,
            cache: false,
            success: function (data) {
                $.each(data, function(i, val){
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
                        '<div class="post-item">'+
                            '<article class="teaser">'+
                                '<a class="thumb" href="' + link + '" title="' + title + '">'+
                                    '<picture class="ratio-square">'+
                                        '<img src="' + foto + '" alt="' + title + '" title="' + title + '">'+
                                    '</picture>'+
                                '</a>'+ postName + 
                                '<div class="details">'+
                                    '<p class="short">' + excerpt + '</p>' + readMore + 
                                '</div>'+
                            '</article>'+
                        '</div>'
                    );
                });
            }
        });
    },
    //get related based on wordpress comments
    getRelatedandStats: function (postId, relatedContainer, statsContainer) {
        $.ajax({
            url: "https://blog.vans.com.br/wp-json/wp/v2/comments/?post=" + postId,
            type: 'GET',
            success: function (commentData) {
                var stats, prodIds;

                if (commentData.length == 2) { //two coments
                    if (commentData[0].content.rendered.indexOf('h3') >= 0 && commentData[0].content.rendered.indexOf('h4') >= 0) { //finding out where are product ids and where's stats 
                        stats = commentData[0].content.rendered;
                        prodIds = commentData[1].content.rendered;
                    } else if (commentData[1].content.rendered.indexOf('h3') >= 0 && commentData[1].content.rendered.indexOf('h4') >= 0) { //finding out where are product ids and where's stats
                        stats = commentData[1].content.rendered;
                        prodIds = commentData[0].content.rendered;
                    }
                } else if (commentData.length == 1) { //one comment
                    if (commentData[0].content.rendered.indexOf('h3') >= 0 && commentData[0].content.rendered.indexOf('h4') >= 0) { //finding out wether it's product or stats
                        stats = commentData[0].content.rendered;
                        prodIds = false;
                    } else {
                        stats = false;
                        prodIds = commentData[0].content.rendered;
                    }
                } else if (commentData.length == 0 || commentData.length > 2) { //no comments or too much comments
                    stats = prodIds = false;
                }
                if (prodIds) {
                    prodIds = prodIds.replace(/<[^>]*>/g, "").trim().split(',');
                    for (var i = 0; i < prodIds.length; i++) {
                        $.ajax({
                            url: "https://lojavans.vtexcommercestable.com.br/api/catalog_system/pub/products/search/?fq=alternateIds_RefId:" + prodIds[i],
                            type: 'GET',
                            success: function (prodData) {
                                var imgArray;
                                var productName;
                                var productLink;
                                var imgUrl;
                                var imgId;
                                var productPrice;
                                for (var j = 0; j < prodData[0].items.length; j++) {
                                    if (prodData[0].items[j].sellers[0].commertialOffer.Price != 0) {
                                        productName = prodData[0].productName;
                                        productLink = '/' + prodData[0].linkText + '/p';
                                        imgUrl = prodData[0].items[j].images[0].imageUrl;
                                        imgId = prodData[0].items[j].images[0].imageId;
                                        productPrice = 'R$' + prodData[0].items[j].sellers[0].commertialOffer.Price;
                                    }

                                }

                                imgArray = imgUrl.split(imgId);
                                imgId = imgId + '-222-222';
                                imgUrl = imgArray[0] + imgId + imgArray[1];

                                var prodHTML = '<div class="postRelatedProduct">';
                                prodHTML += ' <a href="' + productLink + '"><img src="' + imgUrl + '" /></a>';
                                prodHTML += ' <a href="' + productLink + '">';
                                prodHTML += '   <h3>' + productName + '</h3>';
                                prodHTML += '   <span class="bestPrice">' + productPrice + '</h3>';
                                prodHTML += ' </a>';
                                prodHTML += '</div>';

                                $(relatedContainer).append(prodHTML);
                            }
                        });
                    }
                }
                if (stats) {
                    $(statsContainer).append(stats);
                }
            }
        });
    }
};