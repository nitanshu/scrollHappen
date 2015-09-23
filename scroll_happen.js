(function ($) {
console.log(this);
    $.fn.scrollhappen = function (options) {
        var opts = $.extend({}, $.fn.scrollhappen.defaults, options);
        var initial_elements = opts.initial_elements_to_load;
        var counter = opts.initial_elements_to_load / opts.elements_to_fetch;
        var scroll_counter = opts.scroll_counter;
        var load_more = false;
        detectScrollBarAndLoadElements(opts, counter, initial_elements, this, scroll_counter, load_more);
    };

    function detectScrollBarAndLoadElements(opts, counter, initial_elements, current_object, scroll_counter, load_more, current_counter) {
        if (!checkScrollBarOnBrowser() && check_remaining_sheets(opts.total_no_of_elements, countChildElements(current_object))) {
            fillElementUntilScrollBarIsVisible(opts, counter, initial_elements, current_object, scroll_counter, load_more);
        } else {
            if (check_remaining_sheets(opts.total_no_of_elements, countChildElements(current_object))) {
                load_sheets_on_scroll_to_bottom(opts.total_no_of_elements, current_object, scroll_counter, opts, current_counter, load_more, counter);
            }
        }
    }

    function countChildElements(obj) {
        return obj.children().size();
    }

    function check_remaining_sheets(total_sheets, elements_in_dom) {
        return total_sheets > elements_in_dom;
    }

    function checkScrollBarOnBrowser() {
        var hasScrollbar;
        if (typeof window.innerWidth === 'number') {
            hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
        }
        hasScrollbar = hasScrollbar || document.documentElement.scrollHeight > document.documentElement.clientHeight;
        return hasScrollbar;
    }

    function fillElementUntilScrollBarIsVisible(opts, counter, initial_elements, current_object, scroll_counter, load_more) {
        load_more = true;
        var multi = counter * opts.elements_to_fetch;
        $.ajax({
            type: 'GET',
            dataType: 'script',
            url: opts.url,
            data: {elements_to_fetch: opts.elements_to_fetch, offset: multi, initial_elements: initial_elements}
        }).done(function () {
            counter++;
            detectScrollBarAndLoadElements(opts, counter, initial_elements, current_object, scroll_counter, load_more, counter);
        });
    }

    function load_sheets_on_scroll_to_bottom(total_sheets, current_object, scroll_counter, opts, current_counter,load_more, counter) {
        var scroll_bar_counter = 0;
        if (check_remaining_sheets(total_sheets, countChildElements(current_object))) { //checks if total sheets in db is greater than the sheets in DOM
            $(window).scroll(function (e) {
                if (scroll_bar_counter < scroll_counter) {
                    if (($(window).scrollTop() + $(window).height()) > ($(document).height() - 2)) {
                        console.log('++++++++++++++++++++++++++',scroll_counter, load_more)
                        if (load_more){
                            scroll_bar_counter++;
                            var element_offset = current_counter*opts.elements_to_fetch
                            $.ajax({
                                type: 'GET',
                                dataType: 'script',
                                url: opts.url,
                                data: {elements_to_fetch: opts.elements_to_fetch, offset: element_offset}
                            }).done(function(){
                                current_counter++;
                            });
                        }
                        else {
                            var offset_counter = counter*opts.elements_to_fetch;
                            counter++;
                            $.ajax({
                                type: 'GET',
                                dataType: 'script',
                                url: opts.url,
                                data: {elements_to_fetch: opts.elements_to_fetch, offset: offset_counter},
                                success: (function(){
                                    scroll_bar_counter++;
                                })
                            });
                        }
                        console.log(' i touched the bottom');
                    }
                } else {
                    $(window).unbind('scroll');
                    setTimeout(function () {
                        if (check_remaining_sheets(total_sheets, countChildElements(current_object))) {
                            console.log(' i append the bottom', $(current_object), current_object);
                            $(current_object).append('<a class="btn btn-default btn-lg pull-right load_all_content" href="javascript:void(0)">Load all sheets</a>')
                        }
                    }, 500);
                }
            });
        }
    }

}(jQuery));