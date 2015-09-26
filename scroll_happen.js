(function ($) {

    'use strict';

    // Defining scrollHappen namespace and default settings
    $.scrollHappen = {
        defaults: {
            elementsToLoadInitially: 8,
            elementSet: 4,
            scrollCycle: 3,
            loadingHtml: '<small>loading...</small>',
            ajaxSettings: {
                async: false,
                global: false,
                type: 'GET',
                dataType: 'script'
            },
            loadingHtmlAttrs: {
                class: 'loading'
            },
            loadRestButtonAttrs: {
                class: 'load_rest',
                type: 'button'
            },
            loadRestButton: function () {
            }
        }
    };

    // Constructor for scrollHappen
    var scrollHappen = function (element, options) {

        // Extending the default settings and defining private variables and methods
        var settings = $.extend(true, {}, $.scrollHappen.defaults, options),
            initial_elements = settings.elementsToLoadInitially,
            offset_counter = settings.elementsToLoadInitially / settings.elementSet,
            scroll_cycle = settings.scrollCycle,
            current_object = element,
            total_elements = settings.total_elements,

        // Detecting scroll bar on the browser and load elements
            detectScrollBarAndLoadElements = function (offset_counter) {
                if (!detectScrollBarOnBrowser() && checkRemainingElements()) {
                    fillElementUntilScrollBarIsVisible(offset_counter);
                } else {
                    if (checkRemainingElements()) {
                        loadElementsOnScrollToBottom(scroll_cycle, offset_counter);
                    }
                }
            },

        // Content showing while ajax is loading
            waitingContent = function () {
                var src = $(settings.loadingHtml).filter('img').attr('src');
                if (src) {
                    var image = new Image();
                    image.src = src;
                }
                $('<div class="scroll_happen_loading">' + settings.loadingHtml + '</div>').attr(settings.loadingHtmlAttrs).appendTo(current_object);
            },

        // Counting total no. of child elements
            countChildElements = function () {
                return current_object.children().size();
            },

        // Checking if there is remaining elements
            checkRemainingElements = function () {
                return (total_elements > countChildElements());
            },

        // Detecting scroll bar on the browser
            detectScrollBarOnBrowser = function () {
                var hasScrollbar;
                if (typeof window.innerWidth === 'number') {
                    hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
                }
                hasScrollbar = hasScrollbar || document.documentElement.scrollHeight > document.documentElement.clientHeight;
                return hasScrollbar;
            },

        // Filling elements until scroll bar is visible
            fillElementUntilScrollBarIsVisible = function (offset_counter) {
                var multi = offset_counter * settings.elementSet;
                $.ajax({
                    global: settings.ajaxSettings.global,
                    dataType: settings.ajaxSettings.dataType,
                    url: settings.url,
                    data: {elementSet: settings.elementSet, offset: multi, initial_elements: initial_elements}
                }).done(function () {
                    offset_counter++;
                    detectScrollBarAndLoadElements(offset_counter);
                });
            },

        // Binding scroll event when it hits the bottom it loads the elements
            bindScrollHitToBottomEvent = function (scroll_cycle, offset_counter, scroll_cycle_counter, element_offset) {
                if (scroll_cycle_counter < scroll_cycle && checkRemainingElements()) {
                    $(window).scroll(function () {
                        if (detectScrollHitToBottom()) {
                            var element_offset = offset_counter * settings.elementSet;
                            $.ajax({
                                global: settings.ajaxSettings.global,
                                dataType: settings.ajaxSettings.dataType,
                                url: settings.url,
                                data: {elementSet: settings.elementSet, offset: element_offset},
                                beforeSend: function () {
                                    waitingContent();
                                    $(window).unbind("scroll")
                                },
                                complete: function () {
                                    scroll_cycle_counter++;
                                    offset_counter++;
                                    $(window).bind("scroll", bindScrollHitToBottomEvent(scroll_cycle, offset_counter, scroll_cycle_counter, element_offset));
                                    $('.' + settings.loadingHtmlAttrs.class + '').remove();
                                }
                            });
                        }
                    });
                } else {
                    unbindScrollAndAppendLoadRestButton((element_offset + settings.elementSet), (total_elements - element_offset));
                }
            },

        // Detecting if the scroll bar is hitting to the bottom
            detectScrollHitToBottom = function () {
                return ($(window).scrollTop() + $(window).height()) > ($(document).height() - 2);
            },

        // Unbinding the scroll bar and appending the load rest button which can be use for loading rest of the element on one click
            unbindScrollAndAppendLoadRestButton = function (offset, limit) {
                $(window).unbind('scroll');
                if (checkRemainingElements()) {
                    $("<button>Load Rest</button>").attr(settings.loadRestButtonAttrs).appendTo($(current_object));
                    $('.' + settings.loadRestButtonAttrs.class + '').click(function (e) {
                        if (settings.loadRestButton !== undefined) {
                            settings.loadRestButton(offset, limit);
                            $('.' + settings.loadRestButtonAttrs.class + '').remove();
                        }
                    });
                }
            },

        // Loading elements on scroll touching to bottom
            loadElementsOnScrollToBottom = function (scroll_cycle, offset_counter) {
                var scroll_cycle_counter = 0;
                bindScrollHitToBottomEvent(scroll_cycle, offset_counter, scroll_cycle_counter);
            };

        // Initiating the functionality through one function
        detectScrollBarAndLoadElements(offset_counter);
    };

    // Defining the scroll happen js
    $.fn.scrollHappen = function (options) {
        return this.each(function () {
            var _this = $(this),
            // Instantiate scrollHappen on this element if it hasn't been already
                scroll_happen = new scrollHappen(_this, options);
        });
    };
}(jQuery));
