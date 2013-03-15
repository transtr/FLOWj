/*****************************************************
 ** MAIN JS FILE
 *****************************************************/
$(document).ready(function(){
    // plugin options
    var flowOpts = {
        "pagination"            : true,
        "transitionDuration"    : 300,
        "easing"                : "bounce",
        "audio"                 : false
    };

    // apply plugin
    $('.flow').flowj(flowOpts);
});