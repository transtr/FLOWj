/*****************************************************
 ** FLOWj
 **
 ** author      : Yung Tran
 ** version     : 0.1.1 (beta)
 ** copyright   : 2013
 ** company     : NA
 *****************************************************/
(function($){
jQuery.fn.flowj = function(opts){
    // optional params
    var audio               = opts["audio"];
    var easing              = opts["easing"];
    var transDur            = opts["transitionDuration"];
    var pagination          = opts["pagination"];

    // plugin variables
    var $this               = $(this);
    var image               = $("img", $this);
    var imagesArray         = [];
    var imagesArrayLength   = imagesArray.length;

    var $nav;
    // var combinedImageWidth  = 0;
    var globalTimer         = null;
    var newHeight;

    var previousDimensions = {
        width: $this.width(),
        height: $this.height()
    };

    var init = function(){
        // push all images for gallery into imagesArray
        $.each(image, function(){
            imagesArray.push( $(this) );
        });

        createStructure();

        // window resize event
        window.onresize = function(){

            clearTimeout(globalTimer);
            globalTimer = setTimeout(doneResize, 20);

            function doneResize(){
                var scale;
                var newDimensions = {
                    width: $this.width(),
                    height: $this.height()
                };

                //console.log( "prev d ===> " + previousDimensions.width + " new d ===> " + newDimensions.width );

                if(newDimensions.width > previousDimensions.width){
                    scale = "up";
                } else {
                    scale = "down";
                }
                // console.log(scale);

                combinedImageWidth = 0;
                responsive(scale);

                previousDimensions = newDimensions;
            }
        };
    }

    var createStructure = function(){
        // append container
        $this.contents().wrapAll("<div class=\"container\"></div>");
        // append next/prev
        $this.after("<div class=\"flowNav next\"><a href=\"#\">NEXT ></a></div>");
        $this.after("<div class=\"flowNav prev\"><a href=\"#\">< PREV</a></div>");
        $(".container", $this).after("<div class=\"pagination\"></div>");
        $nav = $(".flowNav");
        $("img:eq(0)", $this).addClass("current");
        $(".prev").hide();
    }

    // make images responsive to window size
    var responsive = function(scale){

        var oldContainerWidth = combinedImageWidth;
        var newLeft = 0;

        $.each(image, function(){
            $(this).css({"width": $this.width() });
            // adjust container size
            combinedImageWidth += $(this).width();
        });

        if( combinedImageWidth > oldContainerWidth){
            newLeft = combinedImageWidth - oldContainerWidth;
        } else {
            newLeft = oldContainerWidth - combinedImageWidth;
        }

        var prevWidth           = previousDimensions.width;
        var w                   = parseInt($this.css("width"));
        var h                   = Math.round((w / parseInt($this.css("height"))) * w);

        $this.css({"height": Math.round((w / parseInt($this.css("height"))) * w)});

        // console.log($this.css("maxWidth"));
//        if((parseInt($this.css("maxWidth")) > 0) && ($this.css("width") < $this.css("maxWidth"))){
//            if( scale === "up"){
//                $this.css({"height": parseInt((h/(previousDimensions.width + 1)) * w)});
//            } else {
//                $this.css({"height": parseInt((h/(previousDimensions.width - 1)) * w)});
//            }
//        }

        $(".width").html(w);
        $(".height").html(h);
        $(".val").html(h);
        // *************************************************************
        $(".prevWidth").html(prevWidth);
        $(".newHeight").html(parseInt((h/(previousDimensions.width + 1)) * w));




//        if( scale === "up" ){
//            newHeight = h += Math.round((parseInt($this.css("height"))/w));
//        } else {
//            newHeight = h -= Math.round((parseInt($this.css("height"))/w));
//        }
        // console.log("main width ===> " + previousDimensions.width + " main height ===> " + previousDimensions.height + ' new height ===> ' + newHeight);




        $(".container", $this).css({"width": combinedImageWidth, "marginLeft": combinedImageWidth > oldContainerWidth ? $(".container").css("marginLeft") - newLeft : $(".container").css("marginLeft") + newLeft });
    }

    // run plugin
    init();




    /*
    var left = 0;

    var playsound;
    var $nav;
    var paginationAmount    = 0;
    var curSlide            = 1;

    switch(easing){
        case "bounce"   : easing = "easeOutBack"; break;
        default         : easing = "easeOutSine"; break;
    }


    // pagination
    $.each(image, function(i){
        paginationAmount += 1;
    });

    for(i=1;i<=paginationAmount;i+=1){
        $(".pagination").append("<span><span class=\"num\">" + i + "</span></span>");
    }
    $('.pagination > span').eq(curSlide - 1).addClass("active");

    if(pagination === false){
        $(".pagination").hide();
    }







    $('img').on({
        "mouseenter": function(){

            var counter = 0;

            playsound = setInterval(function(){
                counter += 1;

                if(counter === 2){
                    $('embed').remove();
                    $('body').append('<embed src="http://www.villagegeek.com/downloads/webwavs/BITCH.WAV" autostart="true" hidden="true" loop="false">');

                    setTimeout(function(){

                        $('.next').trigger("click");
                        counter = 0;

                    }, 2000);
                } else {
                    $('embed').remove();
                    $('body').append('<embed src="http://www.villagegeek.com/downloads/webwavs/alrighty.wav" autostart="true" hidden="true" loop="false">');
                }
            }, 10000);

            if( audio === true ){
                $('embed').remove();
                $('body').append('<embed src="http://www.villagegeek.com/downloads/webwavs/AHHH3.WAV" autostart="true" hidden="true" loop="false">');
            }
        },

        "mouseout" : function(){
            clearInterval(playsound);
        }
    });








    // nav event
    $nav.on("click", function(e){
        e.preventDefault();
        var next = $(this).hasClass("next");
        //console.log(-(combinedImageWidth - image.width()));
        //console.log(left);

        if(next){
            if(curSlide < paginationAmount){
                curSlide += 1;
            }

            if(left > -(combinedImageWidth - image.width())){
                left -= image.width();
            }
            if(left < 0){
                $(".prev").show();
            }




            $("img.current").stop(true).animate({ "marginLeft": left }, transDur, easing, function(){
                // $("img", this).removeClass("current").next().addClass("current");
                $("img", $this).removeClass("current").removeClass("prevImg").removeClass("nextImg");
                $("img", $this).eq(curSlide - 1).addClass("current").prev().addClass("prevImg").end().next().addClass("nextImg");
            });

            $("img.nextImg", $this).stop(true).animate({ "marginLeft": left }, transDur, easing, function(){
                // $("img", this).removeClass("current").next().addClass("current");
                $("img", $this).removeClass("current").removeClass("prevImg").removeClass("nextImg");
                $("img", $this).eq(curSlide - 1).addClass("current").prev().addClass("prevImg").end().next().addClass("nextImg");
            });



            if(left === -(combinedImageWidth - image.width())){
                $(".next").hide();
            }

            if( audio === true ){
                $('embed').remove();
                $('body').append('<embed src="http://www.villagegeek.com/downloads/webwavs/AHHH3.WAV" autostart="true" hidden="true" loop="false">');
            }
        } else {
            if(curSlide > 0){
                curSlide -= 1;
            }

            if(left < 0){
                left += image.width();
            }
            if(left === 0){
                $(".prev").hide();
            }

            if(left > -(combinedImageWidth - image.width())){
                $(".next").show();
            }
//            $(".container", $this).stop(true).animate({ "marginLeft": left }, transDur, easing, function(){
//                $("img", this).removeClass("active").next().addClass("active");
//            });

            $("img.prevImg").stop(true).animate({ "marginLeft": 0 }, transDur, easing, function(){
                // $("img", this).removeClass("current").next().addClass("current");
                $("img", $this).removeClass("current").removeClass("prevImg").removeClass("nextImg");
                $("img", $this).eq(curSlide - 1).addClass("current").prev().addClass("prevImg").end().next().addClass("nextImg");
            });

            if( audio === true ){
                $('embed').remove();
                $('body').append('<embed src="http://www.villagegeek.com/downloads/webwavs/AHHH3.WAV" autostart="true" hidden="true" loop="false">');
            }
         }
        //console.log(curSlide);
        $('.pagination > span').removeClass("active");
        $('.pagination > span').eq(curSlide - 1).addClass("active");
    });

    */
};
})(jQuery);