// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

define(['jquery', 'core/modal_factory', 'core/str', 'core/log', 'core/templates'], function($, ModalFactory, str, Log, Templates) {
  'use strict';

    // Load strings.
    var strings = [];
    strings.push({key: 'badgelinkcopiedtoclipboard', component: 'block_ludifica'});

    var s = [];

    if (strings.length > 0) {

        strings.forEach(one => {
            s[one.key] = one.key;
        });

        str.get_strings(strings).then(function(results) {
            var pos = 0;
            strings.forEach(one => {
                s[one.key] = results[pos];
                pos++;
            });
            return true;
        }).fail(function(e) {
            Log.debug('Error loading strings');
            Log.debug(e);
        });
    }
    // End of Load strings.

    return {
        init: function() {

            $('.banner-top').parents('.no-overflow').removeClass('no-overflow');

            var fn_effect = function () {
                var $this = $(this);
                var $parents = $this.parents('.box_resources');

                if ($parents.length == 0) {
                    return;
                }

                var $parent = $($parents[0]);

                $parent.find('.selected').removeClass('selected');
                $parent.find('[data-rel]').hide();
                $parent.find('[data-rel="' + $this.attr('data-type') + '"]').show();
                $this.addClass('selected');

            };

            $('.menucontroler').on('mouseover touchstart', fn_effect);

            $('.menucontroler').on('touchend', function() {
                var $node = $('[data-rel="' + $(this).attr('data-type') + '"]');
                $("html, body").animate({ scrollTop: $node.offset().top }, 500);
            });

            $('.attachedimages, .sliderimages').each(function() {
                var $this = $(this);
                $this.find('br').remove();
                $this.find('img').first().addClass('active');

                var fnnextimage = function () {
                    var $active = $this.find('img.active');
                    var $next = $active.next('img');

                    $active.removeClass('active');

                    if ($next.length > 0) {
                        $next.addClass('active');
                    } else {
                        $this.find('img').first().addClass('active');
                    }
                };

                var fnprevimage = function () {
                    var $active = $this.find('img.active');
                    var $next = $active.prev('img');

                    $active.removeClass('active');

                    if ($next.length > 0) {
                        $next.addClass('active');
                    } else {
                        $this.find('img').last().addClass('active');
                    }
                };

                if ($this.find('img').length > 0) {
                    $this.find('img').on('click', fnnextimage);

                    var $controlbefore = $('<div class="slide-control" data-action="before">&#60;</div>');
                    $controlbefore.on('click', fnprevimage);
                    $this.append($controlbefore);

                    var $controlafter = $('<div class="slide-control" data-action="after">&#62;</div>');
                    $controlafter.on('click', fnnextimage);
                    $this.append($controlafter);

                } else {
                    $this.hide();
                }
           });

            $('completion.complete').parents('.completion-parent').addClass('complete');

            $('completion.incomplete').parents('.completion-parent').addClass('incomplete');

            $('[data-dhbg-toggle]').on('click', function() {
                var $this = $(this);
                var cssclass = $this.attr('data-dhbg-toggle');
                var target = $this.attr('data-target');

                $(target).toggleClass(cssclass);
            });


            $('.tepuy-accordion').each(function() {
                var $this = $(this);

                $this.find('> div').addClass('closed');

                $this.find('> div > h3').each(function() {
                    var $header = $(this);
                    var $parent = $header.parent();
                    var $body = $parent.find('> div');

                    $header.on('click', function() {

                        var opened = false;
                        if ($parent.hasClass('opened')) {
                            opened = true;
                        }

                        $this.find('> div.opened > div').hide(400);
                        $this.find('> div.opened').removeClass('opened').addClass('closed');

                        if (opened) {
                            $parent.removeClass('opened').addClass('closed');
                            $body.hide(400);
                        } else {
                            $parent.removeClass('closed').addClass('opened');
                            $body.show(400);
                        }
                    });

                });

            });


            $('.tepuy-transition').on('click', function(event) {
                event.preventDefault();

                var $this = $(this);
                var $show = $($this.attr('data-show'));
                var $hide = $($this.attr('data-hide'));
                var transition = $this.attr('data-transition');
                var duration = $this.attr('data-duration') ? parseInt($this.attr('data-duration')) : 400;

                if (transition) {
                    $hide.hide(duration, transition, function() {
                        $show.show(duration, transition);
                    });
                } else {
                    $hide.hide();
                    $show.show();
                }
            });

            // ==============================================================================================
            // Float Window
            // ==============================================================================================
            $('.tepuy-wf').each(function() {
                var $this = $(this);

                $this.wrapInner("<div class='tepuy-body'></div>");

                var style = '';
                if ($this.attr('data-property-width')) {
                    style += 'width:' + $this.attr('data-property-width') + ';';
                }

                if ($this.attr('data-property-height')) {
                    style += 'height:' + $this.attr('data-property-height') + ';';
                }

                var $close = $('<div class="tepuy-close">X</div>');
                $close.on('click', function() {
                    $this.hide({ effect: 'slide', direction: 'down' });
                });

                if (style != '') {
                    $this.attr('style', style);
                }

                $this.append($close);
                $this.hide();
            });

            $('.tepuy-wf-controller').on('click', function(){
                var $this = $(this);
                var w = $this.attr('data-property-width');
                var h = $this.attr('data-property-height');

                var $float_window = $($this.attr('data-property-content'));

                if (w) {
                    $float_window.css('width', w);
                }

                if (h) {
                    $float_window.css('height', h);
                }

                $float_window.show({ effect: 'slide', direction: 'down' });
            });

            // ==============================================================================================
            // Modal Window
            // ==============================================================================================
            $('.tepuy-w').each(function() {
                var $this = $(this);

                if ($this.parents('[data-fieldtype="editor"]') && $this.parents('[data-fieldtype="editor"]').length > 0) {
                    return;
                }

                $this.wrapInner("<div class='tepuy-body'></div>");

                if ($this.attr('data-tepuy-showentry') || $this.attr('data-tepuy-showconcept')) {

                    var searchparams = {};

                    if ($this.attr('data-tepuy-showentry')) {
                        searchparams.eid = $this.attr('data-tepuy-showentry');
                    } else if ($this.attr('data-tepuy-showconcept') && M.abierta && M.abierta.courseid) {
                        searchparams.concept = $this.attr('data-tepuy-showconcept');
                        searchparams.courseid = M.abierta.courseid;
                    }

                    $.get(M.cfg.wwwroot + '/mod/glossary/showentry_ajax.php',
                            searchparams,
                            function(data) {

                                if (data.entries && Object.keys(data.entries).length > 0) {
                                    var content = '';

                                    Object.keys(data.entries).forEach(function(item) {
                                        if (data.entries[item].definition) {
                                            content = data.entries[item].definition;
                                        }
                                    });
                                    $this.find('.tepuy-body').html(content);
                                }
                    }, 'json');

                } else if ($this.attr('data-tepuy-innerentry')) {

                    if ($this.find('a.glossary.autolink').length > 0) {
                        $.get($this.find('a.glossary.autolink').attr('href').replace('showentry.php', 'showentry_ajax.php'),
                                function(data) {
                                    if (data.entries && data.entries.length > 0) {
                                        $this.find('.tepuy-body').html(data.entries[0].definition);
                                    }
                        }, 'json');

                        $this.attr('title', $this.find('a.glossary.autolink').attr('title'));
                    }
                } else if ($this.attr('data-tepuy-innerautolink')) {

                    if ($this.find('a.autolink').length > 0) {
                        var url = $this.find('a.autolink').attr('href') + '&inpopup=true';
                        $this.find('a.autolink').hide();

                        var $iframe = $('<iframe></iframe>');
                        $iframe.attr('src', url);
                        $iframe.on('load', function() {
                            $iframe.contents().find('a:not([target])').attr('target', '_top');
                        });

                        $this.find('.tepuy-body').append($iframe);
                        $this.attr('title', $this.find('a.autolink').html());
                    }
                }

                $this.hide();
            });

            $('.tepuy-w-controller').on('click', function(e){
                e.preventDefault();

                var $this = $(this);

                if ($this.parents('[data-fieldtype="editor"]') && $this.parents('[data-fieldtype="editor"]').length > 0) {
                    return;
                }

                var dialogue = $this.data('dialogue');

                if (!dialogue) {

                    var w = $this.attr('data-property-width');
                    var h = $this.attr('data-property-height');

                    var $float_window = $($this.attr('data-tepuy-content') + ' .tepuy-body');

                    var properties = {
                        center: true,
                        modal: true,
                        visible: false,
                        draggable: false,
                        width: 'auto',
                        height: 'auto',
                        autofillheight: 'header',
                        bodyContent: $float_window
                    };

                    if (w) {
                        if (w.indexOf('%') >= 0) {
                            var window_w = $(window).width();
                            var tmp_w = Number(w.replace('%', ''));
                            if (!isNaN(tmp_w) && tmp_w > 0) {
                                w = tmp_w * window_w / 100;
                            }
                        }

                        properties.width = w;
                    }

                    if (h) {
                        if (h.indexOf('%') >= 0) {
                            var window_h = $(window).height();
                            var tmp_h = Number(h.replace('%', ''));
                            if (!isNaN(tmp_h) && tmp_h > 0) {
                                h = tmp_h * window_h / 100;
                            }
                        }

                        properties.height = h;
                    }

                    var dialogue = new M.core.dialogue(properties);
                    $this.data('dialogue', dialogue);
                }

                dialogue.show();
            });

            // ==============================================================================================
            // Open resources into modal
            // ==============================================================================================
            $('.tepuy-openinmodal').each(function() {
                var $this = $(this);

                if ($this.parents('[data-fieldtype="editor"]') && $this.parents('[data-fieldtype="editor"]').length > 0) {
                    return;
                }

                $this.find('a').each(function() {
                    this.removeAttribute('onclick');
                });

                $this.find('a').on('click', function(event) {
                    event.preventDefault();

                    var $link = $(this);

                    var dialogue = $link.data('dialogue');

                    if (!dialogue) {

                        var w = $this.attr('data-property-width');
                        var h = $this.attr('data-property-height');

                        var url = $link.attr('href') + '&inpopup=true';
                        var $iframe = $('<iframe class="tepuy-openinmodal-container"></iframe>');
                        $iframe.attr('src', url);
                        $iframe.on('load', function() {
                            $iframe.contents().find('a:not([target])').attr('target', '_top');
                        });


                        var el = $.fn['hide'];
                        $.fn['hide'] = function () {
                            this.trigger('hide');
                            return el.apply(this, arguments);
                        };

                        $iframe.on('hide', function() {
                        });

                        var $float_window = $('<div></div>');

                        $float_window.append($iframe);

                        var properties = {
                            center: true,
                            modal: true,
                            visible: false,
                            draggable: true,
                            width: 'auto',
                            height: 'auto',
                            autofillheight: 'header',
                            bodyContent: $float_window
                        };

                        if (w) {
                            if (w.indexOf('%') >= 0) {
                                var window_w = $(window).width();
                                var tmp_w = Number(w.replace('%', ''));
                                if (!isNaN(tmp_w) && tmp_w > 0) {
                                    w = tmp_w * window_w / 100;
                                }
                            }

                            properties.width = w;
                        }

                        if (h) {
                            if (h.indexOf('%') >= 0) {
                                var window_h = $(window).height();
                                var tmp_h = Number(h.replace('%', ''));
                                if (!isNaN(tmp_h) && tmp_h > 0) {
                                    h = tmp_h * window_h / 100;
                                }
                            }

                            properties.height = h;
                        }

                        var dialogue = new M.core.dialogue(properties);
                        $link.data('dialogue', dialogue);
                        dialogue.after('visibleChange', function(e) {
                            if (e.attrName === 'visible') {
                                if (e.prevVal && !e.newVal) {
                                    $iframe.contents().find('video, audio').each(function(){
                                        this.pause();
                                    });
                                }
                            }
                        }, dialogue);
                    }

                    dialogue.show();

                });

            });

            // ==============================================================================================
            // Mouseover
            // ==============================================================================================
            $('.tepuy-mouse-over').on('mouseover', function(){
                var $this = $(this);
                var $popup = $($this.data('ref'));
                $popup.show();
            });

            $('.tepuy-mouse-over').on('mouseout', function(){
                var $this = $(this);
                var $popup = $($this.data('ref'));
                $popup.hide();
            });

            // ==============================================================================================
            // Ranking and home button
            // ==============================================================================================

            $('.block_ludifica-tabs').each(function() {
                var $tabs = $(this);
                var tabslist = [];
                var $ranking_site = $('.ranking_site-button');
                var $ranking_course = $('.ranking_course-button');
                var $ranking_last = $('.ranking_last-button');
                var $home = $('.home-button');

                $tabs.find('[data-ref]').each(function() {
                    var $tab = $(this);
                    tabslist.push($tab);

                    $ranking_site.on('click', function() {
                        tabslist.forEach(one => {
                            $(one.data('ref')).removeClass('active');
                        });

                        $(".tab-topbysite").addClass('active');
                    });

                    $ranking_last.on('click', function() {
                        tabslist.forEach(one => {
                            $(one.data('ref')).removeClass('active');
                        });

                        $(".tab-lastmonth").addClass('active');
                    });

                    $ranking_course.on('click', function() {
                        tabslist.forEach(one => {
                            $(one.data('ref')).removeClass('active');
                        });

                        $(".tab-topbycourse").addClass('active');
                    });

                    $home.on('click', function() {
                        tabslist.forEach(one => {
                            $(one.data('ref')).removeClass('active');
                        });

                        $(".tab-profile").addClass('active');
                    });
                });
            });

            // ==============================================================================================
            // Show dynamic helps
            // ==============================================================================================
            $('.dynamichelp-button').on('click', function() {

                var $content = $('.modalhelps');

                ModalFactory.create({
                      body: $content.html()
                    }).then(function(modal) {
                    modal.show();
                });
            });

            // ==============================================================================================
            // Info badge modal
            // ==============================================================================================

            $('.openbadgeinfo').on('click', function() {

                var badge = {
                    "id": $(this).data('badgeid')
                };

                var $badge = $('#badge-' + badge.id);

                badge.description = $badge.data('description');
                badge.thumbnail = $badge.find('.picture-box img').attr('src');
                badge.expire = $badge.data('expire');
                badge.unavailable = $badge.data('unavailable');
                badge.name = $badge.data('name');

                var badgedata = {
                    "description": badge.description,
                    "thumbnailurl": badge.thumbnail,
                    "expire": badge.expire,
                    "unavailable": badge.unavailable,
                    "badge": badge
                };

                Templates.render('block_ludifica/badgeinfo', badgedata).then(function(content) {
                    ModalFactory.create({
                        title: badge.name,
                        body: content,
                    }).then(function(modal) {
                        return modal.show().then(function() {

                            $('.openshare_abierta').on('click', function() {

                                $badge.find('.openshare').trigger('click');

                            });
                        });
                    });
                });
            });
        }
    };
});
