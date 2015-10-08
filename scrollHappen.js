(function ($) {

    'use strict';

    // Defining scrollHappen namespace and default settings
    $.scrollHappen = {
        defaults: {
            infiniteScroll: false,
            initialLimit: 4,
            limit: 3,
            cycle: 3,
            ajaxSettings: {
                async: false,
                global: false,
                type: 'GET',
                dataType: 'script'
            },
            loadingHtmlAttrs: {
                content: '<small>loading...</small>',
                class: 'loading'
            },
            loadRestCallbackAttrs: {
                content: '<button>Load Rest</button>',
                class: 'load_rest'
            },
            loadRestCallback: function () {
            }
        }
    };

    // Constructor for scrollHappen
    var scrollHappen = function (element, options) {

        // Extending the default settings and defining private variables and methods
        var settings = $.extend(true, {}, $.scrollHappen.defaults, options),
            offset_counter = 0,
            cycle = settings.cycle,
            current_object = element,
            total_elements = settings.total_elements,

        // Detecting scroll bar on the browser and load elements
            detectScrollBarAndLoadElements = function (offset_counter) {
                if (!isScrollBarOnBrowser() && checkRemainingElements(offset_counter)) {
                    fillElementUntilScrollBarIsVisible(offset_counter);
                } else {
                    if (checkRemainingElements(offset_counter)) {
                        loadElementsOnScrollToBottom(cycle, offset_counter);
                    }
                }
            },

        // Content showing while ajax is loading
            waitingContent = function () {
                $('<div class="scroll_happen_loading">' + settings.loadingHtmlAttrs.content + '</div>').addClass(settings.loadingHtmlAttrs.class).appendTo(current_object);
            },

        // Checking if there is remaining elements
            checkRemainingElements = function (offset_counter) {
                return (total_elements > settings.initialLimit + settings.limit * offset_counter);
            },

        // Detecting scroll bar on the browser
            isScrollBarOnBrowser = function () {
                return typeof window.innerWidth === "number" ? window.innerWidth > document.documentElement.clientWidth : document.documentElement.scrollHeight > document.documentElement.clientHeight;
            },

        // Detecting if the scroll bar is hitting to the bottom
            detectScrollHitToBottom = function () {
                return ($(window).scrollTop() + $(window).height()) > ($(document).height() - 2);
            },

        // Filling elements until scroll bar is visible
            fillElementUntilScrollBarIsVisible = function (offset_counter) {
                if (!isScrollBarOnBrowser() && checkRemainingElements(offset_counter)) {
                    $.ajax({
                        global: settings.ajaxSettings.global,
                        dataType: settings.ajaxSettings.dataType,
                        url: settings.url,
                        data: {limit: settings.limit, offset: (settings.initialLimit + settings.limit * offset_counter)}
                    }).done(function () {
                        fillElementUntilScrollBarIsVisible(++offset_counter);
                    });
                } else {
                    if (settings.infiniteScroll) {
                        bindScrollHitToBottomEvent(offset_counter);
                    } else {
                        bindScrollHitToBottomEvent(offset_counter, 0);
                    }
                }
            },

        // Binding scroll event when it hits the bottom it loads the elements
            bindScrollHitToBottomEvent = function (offset_counter, scroll_bar_counter) {
                if (typeof scroll_bar_counter === "number") {
                    if (scroll_bar_counter < cycle && checkRemainingElements(offset_counter)) {
                        scrollAndLoad(offset_counter, scroll_bar_counter);
                    } else {
                        unbindScrollAndAppendLoadRestButton(offset_counter, (settings.initialLimit + settings.limit * offset_counter), (total_elements - settings.initialLimit + settings.limit * offset_counter));
                    }
                } else {
                    if (checkRemainingElements(offset_counter)) {
                        scrollAndLoad(offset_counter);
                    }
                }
            },

        // Scroll to bottom and load elements
            scrollAndLoad = function (offset_counter, scroll_bar_counter) {
                $(window).scroll(function () {
                    if (detectScrollHitToBottom()) {
                        $.ajax({
                            global: settings.ajaxSettings.global,
                            dataType: settings.ajaxSettings.dataType,
                            url: settings.url,
                            data: {
                                limit: settings.limit,
                                offset: settings.initialLimit + settings.limit * offset_counter
                            },
                            beforeSend: function () {
                                waitingContent();
                                $(window).unbind("scroll")
                            },
                            complete: function () {
                                if (settings.infiniteScroll) {
                                    $(window).bind("scroll", bindScrollHitToBottomEvent(++offset_counter));
                                } else {
                                    $(window).bind("scroll", bindScrollHitToBottomEvent(++offset_counter, ++scroll_bar_counter));
                                }
                                $('.' + settings.loadingHtmlAttrs.class).remove();
                            }
                        });
                    }
                });
            },

        // Unbinding the scroll bar and appending the load rest button which can be use for loading rest of the element on one click
            unbindScrollAndAppendLoadRestButton = function (offset_counter, offset, limit) {
                $(window).unbind('scroll');
                if (checkRemainingElements(offset_counter)) {
                    var load_rest_button = $(settings.loadRestCallbackAttrs.content).attr(settings.loadRestCallbackAttrs).appendTo($(current_object)).click(function (e) {
                        if (settings.loadRestCallback !== undefined) {
                            settings.loadRestCallback(offset, limit);
                            load_rest_button.remove();
                        }
                    });
                }
            },

        // Loading elements on scroll touching to bottom
            loadElementsOnScrollToBottom = function (offset_counter) {
                bindScrollHitToBottomEvent(offset_counter, 0);
            };

        // Initiating the functionality through one function
        detectScrollBarAndLoadElements(offset_counter);
    };

    // Defining the scroll happen js
    $.fn.scrollHappen = function (options) {
        return this.each(function () {
            // Instantiate scrollHappen on this element if it hasn't been already
            var scroll_happen = new scrollHappen($(this), options);
        });
    };
}(jQuery));
