/*****************************************************
 ** MAIN JS FILE
 *****************************************************/
$(document).ready(function(){
    // plugin options
    var flowOpts = {
        "audio"                 : false,
        "autoplay"              : false,
        "caption"               : true,
        "easing"                : "smooth",
        "pagination"            : true,
        "transitionDuration"    : 350
    };

    // apply plugin
    $('.flow').flowj(flowOpts);
});