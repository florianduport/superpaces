/*
Homepage.js

Jquery code for the homepage
*/
(function($, window, document) {
    var typed = $("#typed"),
        SpTransparentNav = $(".SPTransparentNav");

    $(function() {

        // The DOM is ready!
        $(window).scroll(function() {
            if ($(document).scrollTop() > 100) {
                SpTransparentNav.css("background-color", "#2d2e30");

            } else {
                SpTransparentNav.css("background-color", "transparent");
            }
        });

        typed.typed({
            strings: ["compétences.", "astuces.", "connaissances."],
            typeSpeed: 100
        });
    });
}(window.jQuery, window, document));
