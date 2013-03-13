/*****************************************************
 ** FLOWj
 **
 ** author      : Yung Tran
 ** version     : 0.1.1 (beta)
 ** copyright   : 2013
 ** company     : NA
 *****************************************************/

jQuery.fn.flowj = function(opts){
    var $this       = $(this);
    var opacity     = opts["opacity"];
    var dis         = opts["distance"];
    var dur         = opts["duration"];

    $this.animate({'marginTop': dis, 'opacity': opacity}, dur);
}