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