//---------------------------------Initial Setup of scroll_pagination-----------------------------------//
var next_page = 2;

function check_scroll_bar_on_browser() {
    var hasScrollbar;
    if (typeof window.innerWidth === 'number') {
        hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
    }
    hasScrollbar = hasScrollbar || document.documentElement.scrollHeight > document.documentElement.clientHeight;
    return hasScrollbar;
}

function create_next_page_url(page_no) {
    var split_url_array = $('.pagination .next a').attr('href').split('=');
    split_url_array.splice(1, 1, page_no);
    return split_url_array.join('=');
}

function detect_scroll_bar_on_browser(total_page_counter, current_page_counter, total_sheets, load_balance_sheets_url) {
    if (current_page_counter <= total_page_counter) {
        var url = create_next_page_url(current_page_counter);
        current_page_counter++;
        if (!check_scroll_bar_on_browser()) {
            $.ajax({
                url: url,
                async: false
            }).done(function () {
                setTimeout(function () {
                    detect_scroll_bar_on_browser(total_page_counter, current_page_counter, total_sheets, load_balance_sheets_url);
                }, 300);
            });
        } else {
            next_page = parseInt(url.split('=')[1]);
            load_sheets_on_scroll_to_bottom(total_sheets, load_balance_sheets_url);
        }
    }
}

function call_detection_for_scroll_bar_on_browser(total_page_counter, total_sheets, load_balance_sheets_url) {
    detect_scroll_bar_on_browser(total_page_counter, 2, total_sheets, load_balance_sheets_url);
}

function get_next_page(url) {
    $.ajax({
        url: url,
        async: false
    });
}

function check_remaining_sheets(total_sheets) {
    return total_sheets > $('.sheet-block').size();
}

function load_balance_sheets(load_balance_sheets_url) {
    $('.load_all').append('<a class="btn btn-default btn-lg load_all_content" href="javascript:void(0)">Load all sheets</a>').click(function () {
        $.ajax({
            url: load_balance_sheets_url,
            async: false,
            data: {sheet_token: $('.sheets_container img:last').attr('sheet_token')},
            success: function () {
                $('.load_all_content').remove();
            }
        });
    });
}

function load_sheets_on_scroll_to_bottom(total_sheets, load_balance_sheets_url) {
    var scroll_counter = 0;
    if (check_remaining_sheets(total_sheets)) { //checks if total sheets in db is greater than the sheets in DOM
        $(window).scroll(function (e) {
            if (scroll_counter < 3) {
                if (($(window).scrollTop() + $(window).height()) > ($(document).height() - 2)) {
                    if (typeof(next_page) == "number" && check_remaining_sheets(total_sheets)) {
                        var url = create_next_page_url(next_page);
                        next_page++;
                        scroll_counter++;
                        if (typeof(url) != 'undefined') {
                            setTimeout(function () {
                                get_next_page(url);
                            }, 400);
                        }
                    }
                }
            } else {
                $(window).unbind('scroll');
                setTimeout(function () {
                    if (check_remaining_sheets(total_sheets)) {
                        load_balance_sheets(load_balance_sheets_url);
                    }
                }, 500);
            }
        });
    }
}