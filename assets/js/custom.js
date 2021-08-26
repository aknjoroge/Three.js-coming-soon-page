////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var resizeId;
var marqueeInitialized = 0;

$(document).ready(function ($) {
  "use strict";

  $("body").imagesLoaded(function () {
    $("body").addClass("loading-done");
    var $animatedWaves = $(".ts-animated-waves");
    $animatedWaves.css(
      "transform",
      "translateX( calc( -100% + " + ($(window).width() + 5) + "px )"
    );
    $animatedWaves.on(
      "transitionend webkitTransitionEnd oTransitionEnd",
      function () {
        $(this).toggleClass("repeat");
      }
    );
  });

  $(".navbar-nav .nav-link").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });

  $(".ts-open-side-panel").on("click", function () {
    $("body").toggleClass("ts-side-panel-active");
  });

  $(".ts-close-side-panel").on("click", function () {
    $("body").removeClass("ts-side-panel-active");
  });

  $(".ts-img-into-bg").each(function () {
    $(this).css(
      "background-image",
      "url(" + $(this).find("img").attr("src") + ")"
    );
  });

  //  Background

  $("[data-bg-color], [data-bg-image], [data-bg-particles]").each(function () {
    var $this = $(this);

    if ($this.hasClass("ts-separate-bg-element")) {
      $this.append('<div class="ts-background">');

      // Background Color

      if ($("[data-bg-color]")) {
        $this
          .find(".ts-background")
          .css("background-color", $this.attr("data-bg-color"));
      }

      // Particles

      // Background Image

      if ($this.attr("data-bg-image") !== undefined) {
        $this
          .find(".ts-background")
          .append('<div class="ts-background-image">');
        $this
          .find(".ts-background-image")
          .css("background-image", "url(" + $this.attr("data-bg-image") + ")");
        $this
          .find(".ts-background-image")
          .css("background-size", $this.attr("data-bg-size"));
        $this
          .find(".ts-background-image")
          .css("background-position", $this.attr("data-bg-position"));
        $this
          .find(".ts-background-image")
          .css("opacity", $this.attr("data-bg-image-opacity"));

        $this
          .find(".ts-background-image")
          .css("background-size", $this.attr("data-bg-size"));
        $this
          .find(".ts-background-image")
          .css("background-repeat", $this.attr("data-bg-repeat"));
        $this
          .find(".ts-background-image")
          .css("background-position", $this.attr("data-bg-position"));
        $this
          .find(".ts-background-image")
          .css("background-blend-mode", $this.attr("data-bg-blend-mode"));
      }

      // Parallax effect

      if ($this.attr("data-bg-parallax") !== undefined) {
        $this.find(".ts-background-image").addClass("ts-parallax-element");
      }
    } else {
      if ($this.attr("data-bg-color") !== undefined) {
        $this.css("background-color", $this.attr("data-bg-color"));
        if ($this.hasClass("btn")) {
          $this.css("border-color", $this.attr("data-bg-color"));
        }
      }

      if ($this.attr("data-bg-image") !== undefined) {
        $this.css(
          "background-image",
          "url(" + $this.attr("data-bg-image") + ")"
        );

        $this.css("background-size", $this.attr("data-bg-size"));
        $this.css("background-repeat", $this.attr("data-bg-repeat"));
        $this.css("background-position", $this.attr("data-bg-position"));
        $this.css("background-blend-mode", $this.attr("data-bg-blend-mode"));
      }
    }
  });

  $(".ts-labels-inside-input input, .ts-labels-inside-input textarea")
    .focusin(function () {
      $(this).parent().find("label").addClass("focused");
    })
    .focusout(function () {
      if ($(this).val().length === 0) {
        $(this).parent().find("label").removeClass("focused");
      }
    });

  $("select").each(function () {
    $(this).wrap('<div class="select-wrapper"></div>');
  });

  // Owl Carousel

  $(".ts-count-down").each(function () {
    var date = $(this).attr("data-date");
    $(this).countdown({
      date: date,
      render: function (data) {
        var el = $(this.el);
        el.empty()
          .append(
            "<div><span class='ts-cc-number'>" +
              this.leadingZeros(data.days, 2) +
              " </span><span class='ts-cc-description'>Days</span></div>"
          )
          .append(
            "<div><span class='ts-cc-number'>" +
              this.leadingZeros(data.hours, 2) +
              " </span><span class='ts-cc-description'>Hour</span></div>"
          )
          .append(
            "<div><span class='ts-cc-number'>" +
              this.leadingZeros(data.min, 2) +
              " </span><span class='ts-cc-description'>Mintes</span></div>"
          )
          .append(
            "<div><span class='ts-cc-number'>" +
              this.leadingZeros(data.sec, 2) +
              " </span><span class='ts-cc-description'>Seconds</span></div>"
          );
      },
    });
  });

  // Magnific Popup

  var $popupImage = $(".popup-popup");

  if ($popupImage.length > 0) {
    $popupImage.magnificPopup({
      type: "image",
      fixedContentPos: false,
      gallery: { enabled: true },
      removalDelay: 300,
      mainClass: "mfp-fade",
      callbacks: {
        // This prevents pushing the entire page to the right after opening Magnific popup image
        open: function () {
          $(".page-wrapper, .navbar-nav").css(
            "margin-right",
            getScrollBarWidth()
          );
        },
        close: function () {
          $(".page-wrapper, .navbar-nav").css("margin-right", 0);
        },
      },
    });
  }

  var $videoPopup = $(".video-popup");

  $(".ts-form-email [type='submit']").each(function () {
    var text = $(this).text();
    $(this)
      .html("")
      .append("<span>" + text + "</span>")
      .prepend(
        "<div class='status'><i class='fas fa-circle-notch fa-spin spinner'></i></div>"
      );
  });

  $(".ts-form-email .btn[type='submit']").on("click", function (e) {
    var $button = $(this);
    var $form = $(this).closest("form");
    var pathToPhp = $(this).closest("form").attr("data-php-path");
    $form.validate({
      submitHandler: function () {
        $button.addClass("processing");
        $.post(pathToPhp, $form.serialize(), function (response) {
          $button
            .addClass("done")
            .find(".status")
            .append(response)
            .prop("disabled", true);
        });
        return false;
      },
    });
  });

  $("form:not(.ts-form-email)").each(function () {
    $(this).validate();
  });

  // On RESIZE actions

  // $(window).on("resize", function () {
  //   clearTimeout(resizeId);
  //   resizeId = setTimeout(doneResizing, 250);
  // });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Do after resize
