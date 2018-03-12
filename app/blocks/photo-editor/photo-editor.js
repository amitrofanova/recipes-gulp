import $ from "jquery";
import Cropper from "cropperjs";


export function createEditor() {
	$(this).after(
		"<div class=\"photo-editor\">" +
			"<div class=\"photo-editor__inner\">" +

				"<div class=\"photo-editor__tabs\">" +
					"<div class=\"photo-editor__tab photo-editor__choose-file-tab photo-editor__tab-active\">1. Загрузить фото</div>" +
					"<div class=\"photo-editor__tab photo-editor__crop-tab\">2. Обрезать фото</div>" +
					"<div class=\"photo-editor__tab photo-editor__crop-min-tab\">3. Выбрать миниатюру</div>" +
				"</div>" +

				"<section class=\"photo-editor__section photo-editor__section-active photo-editor__choose-file-section\">" +
					"<div class=\"photo-editor__title\"></div>" +
					"<div class=\"photo-editor__description\">Загрузите фото с вашим блюдом</div>" +
					"<div class=\"photo-editor__section-content\">" +
						"<div class=\"photo-editor__image-load-wrap\">" +
							"<img class=\"photo-editor__image-load\">" +
						"</div>" +
						"<div class=\"photo-editor__choose-file-btn form__btn\">Выбрать изображение" +
							"<input type=\"file\" name=\"newfile\" class=\"photo-editor__file-input\">" +
						"</div>" +
					"</div>" +
					"<div class=\"photo-editor__controls\">" +
						"<input type=\"button\" value=\"Продолжить\" class=\"photo-editor__to-crop-btn photo-editor__btn_right form__btn\">" +
					"</div>" +
				"</section>" +

				"<section class=\"photo-editor__section photo-editor__crop-section\">" +
					"<div class=\"photo-editor__title\"></div>" +
					"<div class=\"photo-editor__description\">" +
						"Пожалуйста обрежьте фото. Фото будет сохранено в пропорции 16:9. " +
						"Такая пропорция нужна, чтобы ваше фото лучше смотрелось на странице :)" +
					"</div>" +
					"<div class=\"photo-editor__section-content\">" +
						"<div class=\"photo-editor__image-crop-wrap\">" +
							"<img class=\"photo-editor__image-crop\">" +
						"</div>" +
						"<input type=\"button\" value=\"Обрезать\" class=\"photo-editor__crop-btn form__btn\">" +
					"</div>" +
					"<div class=\"photo-editor__controls\">" +
						"<input type=\"button\" value=\"Вернуться\" class=\"photo-editor__to-choose-file-btn form__btn\">" +
						"<input type=\"button\" value=\"Продолжить\" class=\"photo-editor__to-crop-min-btn photo-editor__btn_right form__btn\">" +
					"</div>" +
				"</section>" +

				"<section class=\"photo-editor__section photo-editor__crop-min-section\">" +
					"<div class=\"photo-editor__title\"></div>" +
					"<div class=\"photo-editor__description\">" +
						"Пожалуйста выберите область изображения, которая будет использоваться для предпросмотра вашего рецепта." +
					"</div>" +
					"<div class=\"photo-editor__section-content\">" +
						"<div class=\"photo-editor__crop-min-wrap\">" +
							"<img class=\"photo-editor__image-crop-min\">" +
						"</div>" +
						"<input type=\"button\" value=\"Обрезать\" class=\"photo-editor__crop-min-btn form__btn\">" +
					"</div>" +
					"<div class=\"photo-editor__controls\">" +
						"<input type=\"button\" value=\"Вернуться\" class=\"photo-editor__to-crop-btn form__btn\">" +
						"<input type=\"button\" value=\"Готово\" class=\"photo-editor__submit-btn photo-editor__btn_right form__btn\">" +
					"</div>" +
				"</section>" +

				"<div class=\"photo-editor__close-btn\"></div>" +
			"</div>" +
		"</div>"
	);
}


export function destroyEditor() {
	$(".photo-editor").remove();
}


function cropImage() {
	const image = $(".photo-editor__image-crop")[0];
	const cropper = new Cropper(image, {
		aspectRatio: 3 / 2,
		rotatable: false,
		zoomable: false,
		minContainerWidth: 150,
		minContainerHeight: 100
	});

	$(document).on("click", ".photo-editor__crop-btn", function () {
		const res = cropper.getCroppedCanvas({maxWidth: 4500, maxHeight: 3000}).toDataURL();
		cropper.destroy();
		$(".photo-editor__image-crop").attr("src", res);
	});
}


function cropImageMin() {
	const image = $(".photo-editor__image-crop-min")[0];
	const cropper = new Cropper(image, {
		aspectRatio: 1 / 1,
		rotatable: false,
		zoomable: false,
		minContainerWidth: 150,
		minContainerHeight: 100
	});

	$(document).on("click", ".photo-editor__crop-min-btn", function () {
		const res = cropper.getCroppedCanvas({maxWidth: 4000, maxHeight: 4000}).toDataURL();
		cropper.destroy();
		$(".photo-editor__image-crop-min").attr("src", res);
	});
}


function uploadImage(evt) {
	const tgt = evt.target || window.event.srcElement;
	const files = tgt.files;
	const f = files[0];

	if (FileReader && files && files.length) {
		const fr = new FileReader();

		fr.onload = function () {
			const res = fr.result;

			$(".photo-editor__image-load").attr("src", res);
			$(".photo-editor__image-crop").attr("src", res);
			$(".photo-editor__image-crop-min").attr("src", res);

			cropImage();
			cropImageMin();

			return res;
		};
		fr.readAsDataURL(f);
	}
}


export function resizeImage(imageToResize) { // eslint-disable-line no-unused-vars
	const MAX_WIDTH = 200;
	const MAX_HEIGHT = 200;
	let width = imageToResize.width;
	let height = imageToResize.height;

	if (width > MAX_WIDTH) {
		height *= MAX_WIDTH / width;
		width = MAX_WIDTH;
	}
	else if (height > MAX_HEIGHT) {
		width *= MAX_HEIGHT / height;
		height = MAX_HEIGHT;
	}

	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	const context = canvas.getContext("2d");
	context.drawImage(imageToResize, 0, 0, width, height);
	const res = canvas.toDataURL();
	// $(imageResizedCls).attr('src', canvas.toDataURL());
	return res;
}


function checkImgStatus() {
	let stat;
	if ($(".photo-editor__file-input").attr("src") !== "") {
		stat = "imageLoaded";
	}
	return stat;
}


$(document).ready(function () {

	$(document).on("change", ".photo-editor__file-input", uploadImage);

	$(document).on("change", ".photo-editor__file-input", function () {
		if (checkImgStatus() === "imageLoaded") {
			$(".photo-editor__to-crop-btn").prop("disabled", false);
			// $(".photo-editor__to-crop-btn").removeClass("form__btn_disabled");
		}
	});

	$(document).on("click", ".photo-editor__to-crop-btn", function () {
		$(".photo-editor__section").removeClass("photo-editor__section-active");
		$(".photo-editor__crop-section").addClass("photo-editor__section-active");
		$(".photo-editor__tab").removeClass("photo-editor__tab-active");
		$(".photo-editor__crop-tab").addClass("photo-editor__tab-active");
	});

	$(document).on("click", ".photo-editor__to-choose-file-btn", function () {
		$(".photo-editor__section").removeClass("photo-editor__section-active");
		$(".photo-editor__choose-file-section").addClass("photo-editor__section-active");
		$(".photo-editor__tab").removeClass("photo-editor__tab-active");
		$(".photo-editor__choose-file-tab").addClass("photo-editor__tab-active");
	});

	$(document).on("click", ".photo-editor__to-crop-min-btn", function () {
		$(".photo-editor__section").removeClass("photo-editor__section-active");
		$(".photo-editor__crop-min-section").addClass("photo-editor__section-active");
		$(".photo-editor__tab").removeClass("photo-editor__tab-active");
		$(".photo-editor__crop-min-tab").addClass("photo-editor__tab-active");
	});

	$(document).on("click", ".photo-editor__submit-btn", function () {
		$(".photo-editor").hide();
	});

	$(document).on("click", ".photo-editor__close-btn", function () {
		destroyEditor();
	});

});
