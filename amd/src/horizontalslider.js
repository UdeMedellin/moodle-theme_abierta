define(['jquery', './flexslider'], function($, flexslider) {
    'use strict';

    return {
        init: function($element, properties) {

            $element.flexslider(properties);
            /* $(".container.slidewrap").on('transitionend', function() {
                var slider1 = $('#main-slider').data('flexslider');
                slider1.resize();
            }) */
        }
    };

});
