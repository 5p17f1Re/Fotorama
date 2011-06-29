/**
 * Галерея изображений. Использует jQuery для работы с DOM и анимаций.
 * @author, @copyright  Artem Polikarpov  (artpolikarpov@gmail.com)
 */

(function($){
	$.fn.fotorama = function(options) {
		var options = $.extend({
			transitionDuration: 500,
			thumbsVertical: false,
			thumbsPosition: "left top",
			thumbsMargin: 2,
			hideThumbs: false,
			caption: false
		}, options);

		var TOUCH = ('ontouchstart' in document);

		this.each(function(){
			var fotorama = $(this);

			fotorama.wrapInner("<div class='fotorama__wrap'></div>");
			var wrap = $(".fotorama__wrap", fotorama);

			if (TOUCH) {
				wrap.addClass("fotorama__wrap_no-hover");
			}

			var img = $("img", fotorama);
			var thumb = $();
			
			var size = img.size();

			// Контейнер для тумбсов-переключалок
			var thumbs = $("<div class='fotorama__thumbs'></div>");

			thumbs.appendTo(wrap);

			var thumbsXY = options.thumbsPosition.split(" ");

			var thumbsX = thumbsXY[0];
			var thumbsY = thumbsXY[1];

			// Загружаем картинки, расставляем тумбсы-переключалки и активируем их
			img.each(function(i) {
				// Одна точка-переключалка
				var _thumb = $("<i class='fotorama__thumb'></i>");
				_thumb
						.addClass("fotorama__thumb_disabled")
						.css({margin: options.thumbsMargin})
						.appendTo(thumbs);
				thumb = thumb.add(_thumb);

				if (i != 0) {
					// Скрываем все картинки, кроме первой
					$(this).hide();
				}


				$(this).load(function(){
					$(this).data({"loaded": true});
					$(this).addClass("fotorama__img");
					_thumb.removeClass("fotorama__thumb_disabled");
					if (options.thumbsVertical) {
						// Если тумбсы надо поставить вертикально в линию
						_thumb.css({display: "block"});
						switch (thumbsX) {
							case "left":
								_thumb.css({"marginLeft": options.thumbsMargin, "marginRight": "auto"});
							break;
							case "center":
								_thumb.css({"marginLeft": "auto", "marginRight": "auto"});
							break;
							case "right":
								_thumb.css({"marginLeft": "auto", "marginRight": options.thumbsMargin});
							break;
						}
					}
					if (i == 0) {
						// Показываем первую картинку, когда она загружена
						showImg(img.eq(0), thumb.eq(0), 0);
					}
				});
			});

			// Позиционирование переключалок
			thumbs.css("text-align", thumbsX);
			switch (thumbsY) {
				case "top":
					thumbs.css({"top": "0", "bottom": "auto"});
				break;
				case "bottom":
					thumbs.css({"top": "auto", "bottom": "0"});
				break;
			}

			function thumbsCenterY(height) {
				// Если переключалки нужно выравнять по центру вертикально
				if (thumbsY == "center") {
					thumbs.css({"top": (height/2) - (thumbs.height()/2), "bottom": "auto"});
				}
			}

			// Показываем картинки, выделяем тумбсы
			function showImg(newImg, newDot, time) {
				var width = newImg.width();
				var height = newImg.height();
				fotorama.add(wrap)
						.animate({width: width, height: height}, time)
						.data({"activeImg": newImg});
				newImg.fadeIn(time).data({"active": true});
				img.not(newImg).fadeOut(time).data({"active": false});
				newDot.addClass("fotorama__thumb_selected");
				thumb.not(newDot).removeClass("fotorama__thumb_selected");

				// Если разрешён вывод подписей
				if (options.caption) {
					var text = newImg.attr("alt");
					if (text != "") {
						options.caption.show();
						options.caption.text(text);
					} else {
						options.caption.hide();
					}
				}

				setTimeout(function(){
					thumbsCenterY(height);
				},100);

			}

			// Показывание, скрывание тумбсов по ховеру
			if (options.hideThumbs && !TOUCH) {
				thumbs.hide();
				fotorama.hover(
						function(){
							thumbs.fadeIn(options.transitionDuration);
						},
						function(){
							thumbs.fadeOut(options.transitionDuration);
						}
				);
			}

			// Биндим хендлеры
			// Клик по тумбсам
			thumb.click(function(e){
				e.stopPropagation();
				var i = thumb.index($(this));
				showImg(img.eq(i), thumb.eq(i), options.transitionDuration);
			});

			// Клик по картинке
			fotorama.click(function(e){
				if (!e.shiftKey) {
					prevNextImg("next");
				} else {
					// Если кликнули с шифтом, мотаем назад
					prevNextImg("prev");
				}
			});

			function prevNextImg(direction) {
				var i = img.index(img.filter(":visible"));
				if (direction == "next") {
					i++;
				} else {
					i--;
				}
				if (i < 0) i = size - 1;
				if (i >= size) i = 0;
				showImg(img.eq(i), thumb.eq(i), options.transitionDuration);
			}
		});
	}
})(jQuery);