/*****************************************************
 ** FLOWj
 **
 ** author      : Yung Tran
 ** version     : 0.1.1 (beta)
 ** copyright   : 2013
 ** company     : NA
 *****************************************************/
jQuery.fn.flowj = function(opts){
    var $this               = $(this);
    var image               = $("img", $this);
    var combinedImageWidth  = 0;
    var left = 0;
    var pagination = [];
    var playsound;
    var $nav;
    var paginationAmount    = 0;
    var curSlide            = 1;

    // optional params
    var audio               = opts["audio"];
    var easing              = opts["easing"];
    var transDur            = opts["transitionDuration"];
    var pagination          = opts["pagination"];

    // append container
    $this.contents().wrapAll("<div class=\"container\"></div>");
    // append next/prev
    $this.after("<div class=\"flowNav next\"><a href=\"#\">NEXT ></a></div>");
    $this.after("<div class=\"flowNav prev\"><a href=\"#\">< PREV</a></div>");
    $(".container", $this).after("<div class=\"pagination\"></div>");
    $nav = $(".flowNav");
    $("img:eq(0)", $this).addClass("active");
    $(".prev").hide();


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

    console.log(paginationAmount);





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
        console.log(-(combinedImageWidth - image.width()));
        console.log(left);

        if(next){
            if(curSlide < paginationAmount){
                curSlide += 1;
            }

            if(left > -(combinedImageWidth - image.width())){
                left -= image.width();
                // $(".next").show();
            }
            if(left < 0){
                $(".prev").show();
            }

            $(".container", $this).stop(true).animate({ "marginLeft": left }, transDur, easing, function(){
                $("img", this).removeClass("active").next().addClass("active");
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
            $(".container", $this).stop(true).animate({ "marginLeft": left }, transDur, easing, function(){
                $("img", this).removeClass("active").next().addClass("active");
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








    // resize images and conatiner
    var responsive = function(){
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
        console.log(newLeft);

        $(".container", $this).css({"width": combinedImageWidth, "marginLeft": combinedImageWidth > oldContainerWidth ? $(".container").css("marginLeft") - newLeft : $(".container").css("marginLeft") + newLeft });
    };
    responsive();

    window.onresize = function(){
        combinedImageWidth = 0;
        responsive();
    };
};