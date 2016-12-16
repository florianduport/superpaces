/*
Course.js

Jquery code for the create/edit course page
*/
(function($, window, document) {

    var SpHideNav = $(".SPHideNav"),
        BackToTop = $('#back-to-top'),
        BodyHtml = $('body,html');


    $(function() {
        // The DOM is ready!



        $(window).scroll(function() {
            if ($(document).scrollTop() > 100) {
                SpHideNav.fadeOut(500);
                BackToTop.fadeIn();
            } else {
                SpHideNav.fadeIn();
                BackToTop.fadeOut();
            }
        });


        //Scroll to 0px when arrow clicked
        BackToTop.click(function() {
            BackToTop.tooltip('hide');
            BodyHtml.animate({
                scrollTop: 0
            }, 800);
        });

        BackToTop.tooltip('show');

    });
}(window.jQuery, window, document));
