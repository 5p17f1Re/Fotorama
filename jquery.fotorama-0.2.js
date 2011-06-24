/**
 * Галерея изображений. Использует jQuery для работы с DOM и анимаций.
 * @author, @copyright  Artem Polikarpov  (artpolikarpov@gmail.com)
 */

(function($){
	$.fn.fotorama = function(options) {
		var options = $.extend({
			transitionDuration: 250,
			thumbsHorizontal: false,
			caption: false
		}, options);

		var TOUCH = ('ontouchstart' in document);

		this.each(function(){
			var fotorama = $(this);

			fotorama.wrapInner("<div class='fotorama__wrap'></div>");
			var wrap = $(".fotorama__wrap", fotorama);

			if (TOUCH || options.slideShow) {
				wrap.addClass("fotorama__wrap_no-hover");
			}

			var img = $("img", fotorama);
			var thumb = $();
			
			var size = img.size();

			// Контейнер для тумбсов-переключалок
			var thumbs = $("<div class='fotorama__thumbs'></div>");
			thumbs.appendTo(wrap);

			// Загружаем картинки, расставляем тумбсы-переключалки и активируем их
			img.each(function(i) {
				// Одна точка-переключалка
				var _thumb = $("<i class='fotorama__thumb'></i>");
				thumb = thumb.add(_thumb);
				_thumb.addClass("fotorama__thumb_disabled").appendTo(thumbs);

				if (i != 0) {
					// Скрываем все картинки, кроме первой
					$(this).hide();
				}

				$(this).load(function(){
					$(this).data({"loaded": true});
					$(this).addClass("fotorama__img");
					_thumb.removeClass("fotorama__thumb_disabled");
					if (options.thumbsHorizontal) {
						// Если тумбсы надо поставить горизонтально в линию
						_thumb.css({float: "left", display: "inline"});
					}
					if (i == 0) {
						// Показываем первую картинку, когда она загружена
						showImg(img.eq(0), thumb.eq(0), 0);
					}
				});
			});


			// Показываем картинки, выделяем тумбсы
			function showImg(newImg, newDot, time) {
				var width = newImg.width();
				var height = newImg.height();
				fotorama.add(wrap).animate({width: width, height: height}, time);
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
			}

			// Биндим хендлеры
			// Клик по тумбсам
			thumb.click(function(){
				var i = thumb.index($(this));
				showImg(img.eq(i), thumb.eq(i), options.transitionDuration);
			});

			// Клик по картинке
			img.click(function(e){
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