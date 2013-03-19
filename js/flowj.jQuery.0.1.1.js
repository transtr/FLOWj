/************************************************************************
*************************************************************************
 ** FLOWj
 **
 ** author      : Yung Tran
 ** version     : 0.2.0 (beta)
 ** copyright   : 2013
 ** company     : NA
 *************************************************************************
 ************************************************************************/
(function($){
    jQuery.fn.flowj = function(opts){
        /************************************************************************
        *************************************************************************
        ** Variables - variables available throughout the scope of this object
        *************************************************************************
        ************************************************************************/

        // options params
        // -------------------------------------------------------------------
        var audio               = opts["audio"];
        var autoplay            = opts["autoplay"];
        var caption             = opts["caption"];
        var easing              = opts["easing"];
        var transDur            = opts["transitionDuration"];
        var paginationOpt       = opts["pagination"];

        switch(easing){
            case "back"     : easing = "easeOutBack"; break;
            case "bounce"   : easing = "easeOutBounce"; break;
            case "elastic"  : easing = "easeOutElastic"; break;
            case "smooth"   : easing = "easeInOutQuint"; break;
            default         : easing = "easeOutSine"; break;
        }


        // global plugin variables
        // -------------------------------------------------------------------
        var $this               = $(this);
        var image               = $("img", $this);
        var imagesArray         = [];
        var imagesArrayLength;
        var $nav;
        var globalTimer         = null;
        var paginationMarkCounter = 0;
        var autoplayslider;


        // container dimensions
        // -------------------------------------------------------------------
        var w                   = $this.width();
        var h                   = $this.height();
        var maxWidth            = parseInt($this.css("maxWidth"));
        var newHeight           = (h*w) / maxWidth;
        var previousDimensions  = { width: w, height: h };



        /************************************************************************
        *************************************************************************
        ** INITIALIZATION
        *************************************************************************
        ************************************************************************/
        var init = function(){
            // debug
            $(".width").html(w);
            $(".height").html(newHeight);
            $(".val").html(newHeight);
            // *************************************************************
            $(".optsAudio").html(audio.toString());
            $(".optsAutoplay").html(autoplay.toString());
            $(".optsCaption").html(caption.toString());
            $(".optsEasing").html(easing.toString());
            $(".optsPagination").html(paginationOpt.toString());
            $(".optsDuration").html(transDur.toString());

            $this.css({"height": newHeight});

            createSlider();
            startSlider();
            pagination();
            console.log(imagesArray);


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
                    newDimensions.width > previousDimensions.width ? scale = "up" : scale = "down";

                    combinedImageWidth = 0;
                    responsive(scale);
                    previousDimensions = newDimensions;
                }
            };


            // nav event
            $nav.on("click", function(e){
                e.preventDefault();
                var next    = $(this).hasClass("next");
                transDur    = opts["transitionDuration"];

                next ? slideTransition("next") : slideTransition("prev");

                if (paginationMarkCounter === 0){
                    $(".prev").hide();
                }
                if (paginationMarkCounter > 0){
                    $(".prev").show();
                }
                if (paginationMarkCounter === imagesArrayLength){
                    $(".next").hide();
                }
                if (paginationMarkCounter < imagesArrayLength){
                    $(".next").show();
                }
            });

        };


        /************************************************************************
        *************************************************************************
        ** PRIVATE FN
        *************************************************************************
        ************************************************************************/
        var createSlider = function(){
            // push all images for gallery into imagesArray
            $.each(image, function(){
                imagesArray.push( $(this) );
                $(this).remove();
            });
            imagesArrayLength = imagesArray.length;
            // append container
            $this.contents()
                 .wrapAll("<div class=\"container\"></div>")
                 .end()
                 .find(".container")
                 .wrap("<div class=\"viewarea\"></div>");

            for(i=0;i<5;i+=1){
                var node = "<div class=\"slide slide" + i + "\"></div>";
                var slide = ".slide" + i;

                $(".container", $this).append(node);
                $(slide).html(imagesArray[i]);
            }





            var combinedWidth = function(){
                var w = 0;
                $.each($(".slide"), function(){
                    w += $(this).width();
                });
                return w;
            };
            $(".container", $this).css({"width": combinedWidth });
            $(".slide").css({"width": w, "height": $this.height(), "left": $this.width() });

            if(caption === true){
                $.each($(".slide"), function(){
                    var caption = $("img", this).attr("data-caption");
                    $(this).append("<div class=\"caption\"><p>" + caption + "</p></div>");
                });
            }


            if(autoplay === true){
                transDur = 800;
                autoplayslider = setInterval( function(){ slideTransition("next"); }, 5000 );

                $this.on({
                    "mouseenter" : function(){
                        clearInterval(autoplayslider);
                    },
                    "mouseleave" : function(){
                        autoplayslider = setInterval( function(){ slideTransition("next"); }, 5000 );
                    }
                });
            }



            // append next/prev
            $(".container", $this).after("<div class=\"pagination\"></div>");
            $(".pagination", $this).after("<div class=\"flowNav next\"><a href=\"#\">NEXT ></a></div>");
            $(".pagination", $this).after("<div class=\"flowNav prev\"><a href=\"#\">< PREV</a></div>");

            $nav = $(".flowNav");
            $("img:eq(0)", $this).addClass("current");
            $(".prev").hide();

            $(".container", $this).css({"height": $this.height() });
        };



        var startSlider = function(){
            $(".slide0").addClass("current").css({"left" : 0});
        };

        var slideTransition = function(direction){
            var $currentSlide = $(".slide.current");

            if($currentSlide.hasClass("current")){
                if(direction === "next"){
                    if(paginationMarkCounter < imagesArrayLength){
                        paginationMarkCounter += 1;
                    }

                    $currentSlide.removeClass("current").stop(true).animate({ "left": -($this.width()) }, transDur, easing);
                    $currentSlide.next().stop(true).animate({ "left": 0 }, transDur, easing, function(){ $(this).addClass("current"); });
                } else if(direction === "prev"){
                    if(paginationMarkCounter > 0){
                        paginationMarkCounter -= 1;
                    }

                    $currentSlide.removeClass("current").stop(true).animate({ "left": $this.width() }, transDur, easing);
                    $currentSlide.prev().stop(true).animate({ "left": 0 }, transDur, easing, function(){ $(this).addClass("current"); });
                }
            }

            $('.pagination > span').removeClass("active");
            $('.pagination > span').eq(paginationMarkCounter).addClass("active");
        };



        var pagination = function(){
            for(i=0;i<imagesArrayLength;i+=1){
                $(".pagination").append("<span><span class=\"num\">" + i + "</span></span>");
            }

            $(".pagination span").eq(0).addClass("active");

            $(".pagination").css({"marginLeft": -($(".pagination").width() / 2)});
            // $('.pagination > span').eq(curSlide - 1).addClass("active");
            if(paginationOpt == false){
                $(".pagination").hide();
            }
        };



        // make images responsive to window size
        var responsive = function(scale){
            w                   = $this.width();
            h                   = parseInt($this.height());
            newHeight           = (h*w) / previousDimensions.width; // scale height proportional to width

            $this.css({"height": newHeight});
            $(".container", $this).css({"height": newHeight });
            $(".slide").css({"width": w, "height": h });

            $(".slide").not(".slide.current").css({"left": $this.width() });

            // debug
            $(".width").html(w);
            $(".height").html(h);
            $(".val").html(newHeight);
            // *************************************************************
            //$(".prevWidth").html(prevWidth);
            //$(".newHeight").html(parseInt((h/(previousDimensions.width + 1)) * w));

            //$(".container", $this).css({"width": combinedImageWidth, "marginLeft": combinedImageWidth > oldContainerWidth ? $(".container").css("marginLeft") - newLeft : $(".container").css("marginLeft") + newLeft });
        };



        /************************************************************************
        *************************************************************************
        ** RUN PLUGIN
        *************************************************************************
        ************************************************************************/
        init();


        /*
        var left = 0;

        var playsound;
        var $nav;
        var paginationAmount    = 0;
        var curSlide            = 1;





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
        });

        */
    };
})(jQuery);