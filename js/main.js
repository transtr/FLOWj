/*****************************************************
 ** MAIN JS FILE
 *****************************************************/
$(document).ready(function(){
    // plugin options
    var flowOpts = {
        "audio"                 : false,
        "caption"               : true,
        "easing"                : "bounce",
        "pagination"            : true,
        "transitionDuration"    : 600
    };

    // apply plugin
    $('.flow').flowj(flowOpts);
});