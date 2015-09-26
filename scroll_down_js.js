 //-----------------------Perfect Script Working for all browsers-------------------------------//

//        // Initializers
//        var i = 2;
//        var global_url;
//        var next_page;
//        var split_url_array;
//        var scroll_counter = 0;
//        var total_sheets = <%#= project.sheets.count %>;
//        var total_page_counter = parseInt($('.pagination .last a').attr('href').split('=')[1]) + 1;
//        var load_all_sheets_url = '<%#= load_balance_sheets_project_path format: :js %>';
//
//        // Detect scroll bar on browser and place ajax request for next page of sheets till the scrollbar appears on the browser
//        function detect_scroll_bar_on_browser() {
//            if (i < total_page_counter) {
//                split_url_array = $('.pagination .next a').attr('href').split('=');
//                split_url_array.splice(1,1,i);
//                var url = split_url_array.join('=');
//                console.log('the url which is to be placed', url, total_page_counter);
//                i++;
//                if (window.innerWidth <= document.documentElement.clientWidth) {
//                    $.ajax({
//                        type: "GET",
//                        url: url,
//                        dataType: 'script'
//                    });
//                }
//                else {
//                    i = total_page_counter;
//                }
//                setTimeout(detect_scroll_bar_on_browser, 300);
//                global_url = url;
//                next_page = parseInt(global_url.split('=')[1]);
//            }
//        }
//
//        if (window.innerWidth <= document.documentElement.clientWidth) {
//            detect_scroll_bar_on_browser();
//        }
//
//        //checking if total sheets in db is greater than the sheets in DOM
//        if (total_sheets > $('.sheet-block').size()) {
//            //checks if scrolling is happening
//            $(window).scroll(function (e) {
//                if (scroll_counter < 3) {
//                    if (($(window).scrollTop() + $(window).height()) > ($(document).height() - 2)) {
//                        if (typeof(next_page) == "number" && total_sheets > $('.sheet-block').size()){
//                            var url_array = $('.pagination .next a').attr('href').split('=');
//                            url_array.splice(1,1,next_page);
//                            var url = url_array.join('=');
//                            next_page++;scroll_counter++;
//                        }else {
//                            if (total_sheets > $('.sheet-block').size()) {
//                                var url = $($('.pagination .page a')[scroll_counter]).attr('href');
//                                scroll_counter++;
//                            }
//                        }
//                        if (typeof(url) != 'undefined' && total_sheets > $('.sheet-block').size()) {
//                            setTimeout(function () {
//                                $.ajax({
//                                    url: url,
//                                    type: 'GET',
//                                    async: false
//                                });
//                            }, 400);
//                        }
//                    }
//                } else {
//                    $(window).unbind('scroll');
//                    setTimeout(function(){
//                        if (total_sheets > $('.sheet-block').size()) {
//                            $('.load_all').append('<a class="btn btn-default btn-lg load_all_content" href="javascript:void(0)">Load all sheets</a>').click(function () {
//                                $.get(load_all_sheets_url, {
//                                    sheet_token: $('.sheets_container img:last').attr('sheet_token'),
//                                    success: function () {
//                                        $('.load_all_content').remove();
//                                    }
//                                });
//                            });
//                        }
//                    },500);
//                }
//            });
//        }


//----------------------------------------Script Closed------------------------------------//



    //    $('.pagination').hide();
    //    if (check_scroll_bar_on_browser()) {
    //        load_sheets_on_scroll_to_bottom(<%#= project.sheets.count %>, '<%#= load_balance_sheets_project_path format: :js %>');
    //    } else {
    //        call_detection_for_scroll_bar_on_browser(parseInt($('.pagination .last a').attr('href').split('=')[1]), <%#= project.sheets.count %>, '<%#= load_balance_sheets_project_path format: :js %>');
    //    }
