/*****************************************************
 ** MAIN JS FILE
 *****************************************************/
$(document).ready(function(){
    console.log('Hello World');

    // plugin options
    var flowOpts = {
        "opacity"       : 0,
        "distance"      : 300,
        "duration"      : 2000
    };

    // apply plugin
    $('.text').flowj(flowOpts);
});