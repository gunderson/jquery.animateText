/*! animateText - v0.0.1 - 2013-08-20
* https://github.com/gunderson/animateText
* Copyright (c) 2013 Patrick Gunderson; Licensed MIT */
(function ($) {

  // Static method.
  $.animateText = function (el, options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.animateText.options, options);
    var $el = $(el);
    var _this = this;

    this.init = function(){
      wrapWords($el);
      wrapCharacters($el);
    };

    function wrapWords($el){
      var words = $el.text().split(' ');
      $.each(words, function(i, word){
        words[i] = "<span class='at-word'>"+ word +"</span>";
      });
      $el.html(words.join("<span class='at-character'> </span>"));
      return $el;
    }

    function wrapCharacters($el){
      var $words = $el.find('.at-word');
      $.each($words, function(i, word){
        var $word = $(word);
        var characters = $word.text().split("");
        $.each(characters, function(j, character){
          characters[j] = "<span class='at-character'>"+ character +"</span>";
        });
        $words[i].html(characters.join(""));
      });
      return $el;
    }


    // Return something awesome.
    return 'animateText' + options.punctuation;
  };

  // Static method default options.
  $.animateText.options = {
    delay: 20,
    originalString: '',
    fromX: 0,
    fromY: 0,
    breakCharacter: ''// useful for breaking on words instead of chars
  };

  // Collection method.
  $.fn.animateText = function (options) {
    return this.each(function () {
      var $this = $(this);
      if (!anim = $this.animateText){
        //create a new animateText instance
        $this.animateText = new $.animateText($this, options);
        $this.animateText.init();
      }
    });
  };

}(jQuery));
