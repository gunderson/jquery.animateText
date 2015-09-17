/*
 * jquery.animateText
 * 
 *
 * Copyright (c) 2013 Patrick Gunderson
 * Licensed under the MIT license.
 */

(function ($) {

  // Static method.
  $.animateText = function (el, options) {
    // Override default options with passed-in options.
    var $el = $(el);
    var $holder;
    var _this = this;
    this.options = $.extend({}, $.animateText.options, options);

    this.init = function(){
      _this.options.originalString = $el.text();
      $holder = $("<div class='at-holder'>")
        .css({
          position: "relative"
        })
        .append(_this.options.originalString);
      $el.empty().append($holder);
      wrapWords($holder);
      wrapCharacters($holder);
      prepCSS($holder);
    };

    function wrapWords($holder){
      var words = _this.options.originalString.split(' ');
      $.each(words, function(i, word){
        words[i] = "<span class='at-word'>"+ word +"</span>";
      });
      $holder.html(words.join("<span class='at-character'>&nbsp;</span>"));
      return $holder;
    }

    function wrapCharacters($holder){
      var $words = $holder.find('.at-word');
      $.each($words, function(i, word){
        var $word = $(word);
        var characters = $word.text().split("");
        $.each(characters, function(j, character){
          characters[j] = "<span class='at-character'>"+ character +"</span>";
        });
        $word.html(characters.join(""));
      });
      return $holder;
    }

    function prepCSS($holder){
      $holder.find("span").each(function(){
        var $this = $(this);
        $this.css({
          display: "inline-block",
          position: "relative"
        });
      });
    }

    function checkComplete(iterator){
      if (iterator === _this.options.length - 1){
        $el.trigger("animateText:complete");
      }
    }

    function getSearch(options){
      return options.grouping && options.grouping === "word" ? ".at-word" : "at-character";
    }

    this.from = function(options){
      var search = getSearch(options);

      var $els = $holder.find(search);
      _this.options.length = $els.length;
      $els.each(function(i, character){
        var $character = $(character);
        var originalCSS = {};
        $.each(options.css, function(i){
          originalCSS[i] = $character.css(i);
        });
        $character.css(options.css);
        setTimeout(function(){
          $character.animate(originalCSS, options.duration, 'easeOutQuad', function(){
            checkComplete(i);
          });
        }, i * options.delay);
      });
      return _this;
    };

    this.to = function(options){
      var search = getSearch(options);

      var $els = $holder.find(search);
      _this.options.length = $els.length;
      $els.each(function(i, character){
        var $character = $(character);
        setTimeout(function(){
          $character.animate(options.css, options.duration, 'easeOutQuad', function(){
            checkComplete(i);
          });
        }, i * options.delay);
      });
      return _this;
    };

    this.hide = function(options){
      var search = getSearch(options);

      var $els = $holder.find(search);
      $els.hide();
    };

    this.init();

    // Return something awesome.
    return this;
  };

  // Static method default options.
  $.animateText.options = {
    // delay between characters
    delay: 20, 
    // animation duration, per character
    duration: 500, 
    // defaults to animating in order from first to last
    // options: "forward", "reverse", "random"
    order: "forward",
    // options: "character", "word" 
    grouping: "character",
    originalString: '',
  };

  // Collection method.
  $.fn.animateText = function (options) {
    return this.each(function () {
      var $this = $(this);
      var anim;
      if (!(anim = this.animateText)){
        //create a new animateText instance
        this.animateText = anim = new $.animateText(this, options);
      }

      //handle parametric commands and updated options
      if(typeof options === 'object'){
        $.extend(anim.options, options);
        options = $.extend({}, anim.options);

        if (options.from){
          delete anim.options.from;
          options = $.extend({css: options.from}, anim.options);
          anim.from(options);
        }

        if (options.to){
          delete anim.options.to;
          options = $.extend({css: options.to}, anim.options);
          anim.to(options);
        }
        
        if (options.command){
          // allow making setting changes and a command in one call
          options = options.command;
        }
      }

      //execute standalone commands
      if (typeof options === "string"){
        
        return $this;
      }
    });
  };

}(jQuery));
