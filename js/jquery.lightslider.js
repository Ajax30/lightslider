/*
 *** LightSlider v 1.1
 *** Author: Razvan Zamfir
 *** Free to use under MIT License
 */

(function($) {

  $.fn.lightSlider = function(options) {

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend({
      'auto': true,
      'arrowsNavigation': true,
      'bullets': true,
      'loop': true,
      'slideDuration': 500,
      'pause': 4000,
    }, options);

    return this.each(function() {

      var $elm = $(this);
      var $slides = $elm.find('li');
      if (settings.loop === true) {
        var slidesLen = $slides.length + 2;
      } else {
        var slidesLen = $slides.length;
      }
      var slidesWidth = slidesLen + '00%';
      var slideWidth = $slides.eq(0).outerWidth();

      function responsiveSlides() {
        var percentageSlidesWidth = (1 / slidesLen) * 100 + '%';
        $slides.width(percentageSlidesWidth);
      }

      $(window).load(responsiveSlides());
      $(window).resize(responsiveSlides());

      // Set slide list width
      $elm.css('width', slidesWidth);

      // Wrap the slide list
      $elm.wrap('<div class="sliderWrapper"></div>');

      // Append controls
      $elm.after('<div class="controls"><a href="#" id="prev">Prev</a><a href="#" id="next">Next</a></div>');

      // Ajust controls verical position
      var controlsHeight = $('.controls').outerHeight();
      var controlsmTop = (controlsHeight / 2) * (-1);
      $('.controls').css('margin-top', controlsmTop);

      // Fade controls in/out
      $('.sliderWrapper').hover(
        function() {
          $('.controls').fadeIn(150);
        },
        function() {
          $('.controls').fadeOut(150);
        });

      // Animate slider
      if (settings.loop === true) {
        var clicks = -1;
      } else {
        var clicks = 0;
      }

      // Bullets
      if (settings.bullets === true) {

        // Append bullets container
        $elm.after('<ul class="bullets"></ul>');

        // Append bullets
        for (var i = 0; i < slidesLen; i++) {
          var list_elms = '<li>' + i + '</li>';
          if (i == 0) {
            var list_elms = '<li class="active">' + i + '</li>';
          }
          $('.bullets').append(list_elms);
        }

        // Bullets transition 
        $('.bullets li').on('click', function() {
          clicks = $(this).text() * (-1);
          slideLeftRight();
        });

        // Set active class on the bullet corresponding
        // to the slide in view
        function activeBlt() {
          var allBullets = $('.bullets').find('li');
          $(allBullets).removeClass('active');
          var activeBltIndex = Math.abs(clicks);
          // if last bulet is active (you are on the last slide),
          // on clicking "Next", make the first bullet active (the first slide is in view)
          if (settings.loop === true && Math.abs(clicks) === slidesLen - 1) {
            $(allBullets[1]).addClass('active');
          }
          // if first bulet is active (you are on the last slide),
          // on clicking "Prev", make the last bullet active (the last slide is in view)
          else if (settings.loop === true && Math.abs(clicks) === 0) {
            $(allBullets[slidesLen - 2]).addClass('active');
          } else {
            $(allBullets[activeBltIndex]).addClass('active');
          }
        }
      }

      if (settings.loop === true) {
        $elm.css('margin-left', '-100%');
        $slides.eq(0).clone().appendTo($elm);
        $slides.eq(slidesLen - 3).clone().prependTo($elm);
        $('.bullets li').first().hide();
        $('.bullets li').last().hide();
      }

      // Slide Left / Right function
      function slideLeftRight() {
        var mLeft = 100 * clicks + '%';
        $elm.animate({
          'marginLeft': mLeft
        }, {
          duration: settings.slideDuration,
          complete: function() {
            if (settings.bullets === true) {
              activeBlt();
            }
            if (settings.loop === true && Math.abs(clicks) === slidesLen - 1) {
              $elm.css('margin-left', '-100%');
            } else if (settings.loop === true && clicks === 0) {
              var mgLeft = (2 - slidesLen) * 100 + "%";
              $elm.css('margin-left', mgLeft);
            }
          }
        });
      }

      // controls transition
      if (settings.loop === true) {
        $('.controls a').on('click', function() {
          if ($(this).attr('id') == 'next') {
            if (Math.abs(clicks) < slidesLen - 1) {
              if (clicks === 0)
                clicks = -(slidesLen - 1);
              else
                clicks--;
            } else {
              clicks = -2;
            }
          } else {
            if (clicks < 0) {
              if (clicks === -(slidesLen - 1))
                clicks = 0;
              else
                clicks++;
            } else {
              clicks = 3 - slidesLen;
            }
          }
          slideLeftRight();
        });
      } else {
        $('.controls a').on('click', function() {
          if ($(this).attr('id') == 'next') {
            if (Math.abs(clicks) < slidesLen - 1) {
              clicks--;
            } else {
              clicks = 0;
            }
          } else {
            if (clicks < 0) {
              clicks++;
            } else {
              clicks = 1 - slidesLen;
            }
          }
          slideLeftRight();
        });
      }

      slideLeftRight();
      $(window).resize(slideLeftRight());

      // Auto advance
      if (settings.auto === true) {

        var autoAdvanceInterval = null;

        $(window).load(function() {
          autoAdvanceInterval = setInterval(function() {
            $('#next').trigger('click');
          }, settings.pause);
          // When a control or dot is clicked by user
          // stop autoadvance by clearInterval method 
          $('.controls a,.bullets li').click(function(event) {
            if (event.originalEvent !== undefined) {
              clearInterval(autoAdvanceInterval);
            }
          });
        });
      }

      // Arrows Navigation
      if (settings.arrowsNavigation === true) {
        $("body").keydown(function(event) {
          if (event.originalEvent !== undefined) {
            clearInterval(autoAdvanceInterval);
          }
          // Left/Right
          if (event.keyCode == 39) {
            $('#next').trigger('click');
          } else if (event.keyCode == 37) {
            $('#prev').trigger('click');
          }
        });
      }

    });
  };
})(jQuery);
