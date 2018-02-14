import $ from 'jquery';
import Cropper from 'cropperjs';


function cropImage() {
	const image = $('.photo-editor__image-crop')[0];
	const cropper = new Cropper(image, {
		aspectRatio: 16 / 9,
		rotatable: false,
		zoomable: false,
		minContainerWidth: 320,
		minContainerHeight: 180
	});

	$('.photo-editor__crop-btn').on('click', function () {
		const res = cropper.getCroppedCanvas({maxWidth: 1600, maxHeight: 900}).toDataURL();
		cropper.destroy();
		$('.photo-editor__image-crop').attr('src', res);
	});
}


function cropImageMin() {
	const image = $('.photo-editor__image-crop-min')[0];
	const cropper = new Cropper(image, {
		aspectRatio: 1 / 1,
		rotatable: false,
		zoomable: false,
		minContainerWidth: 320,
		minContainerHeight: 180
	});

	$('.photo-editor__crop-min-btn').on('click', function () {
		const res = cropper.getCroppedCanvas({maxWidth: 1600, maxHeight: 900}).toDataURL();
		cropper.destroy();
		$('.photo-editor__image-crop-min').attr('src', res);
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

			$('.photo-editor__image-load').attr('src', res);
			$('.photo-editor__image-crop').attr('src', res);
			$('.photo-editor__image-crop-min').attr('src', res);

			cropImage();
			cropImageMin();

			return res;
		};
		fr.readAsDataURL(f);
	}
}


// function resizeImage() { // eslint-disable-line no-unused-vars
// 	const MAX_WIDTH = 400;
// 	const MAX_HEIGHT = 400;
// 	const imageToResize = $(imagePreviewCls)[0];
// 	let width = imageToResize.width;
// 	let height = imageToResize.height;
//
// 	if (width > height) {
// 		if (width > MAX_WIDTH) {
// 			height *= MAX_WIDTH / width;
// 			width = MAX_WIDTH;
// 		}
// 	}else if (height > MAX_HEIGHT) {
// 		width *= MAX_HEIGHT / height;
// 		height = MAX_HEIGHT;
// 	}
//
// 	const canvas = document.createElement('canvas');
// 	canvas.width = width;
// 	canvas.height = height;
//
// 	const context = canvas.getContext('2d');
// 	context.drawImage(imageToResize, 0, 0, width, height);
// 	$(imageResizedCls).attr('src', canvas.toDataURL());
// 	console.log('result: ' + $(imageResizedCls).attr('src').length);
// }


$(document).ready(function () {

	$(document).on('change', '.photo-editor__file-input', uploadImage);

	$('.photo-editor__to-crop-btn').on('click', function () {
		$('.photo-editor__section').removeClass('photo-editor__section-active');
		$('.photo-editor__crop-section').addClass('photo-editor__section-active');
		$('.photo-editor__tab').removeClass('photo-editor__tab-active');
		$('.photo-editor__crop-tab').addClass('photo-editor__tab-active');
	});

	$('.photo-editor__to-choose-file-btn').on('click', function () {
		$('.photo-editor__section').removeClass('photo-editor__section-active');
		$('.photo-editor__choose-file-section').addClass('photo-editor__section-active');
		$('.photo-editor__tab').removeClass('photo-editor__tab-active');
		$('.photo-editor__choose-file-tab').addClass('photo-editor__tab-active');
	});

	$('.photo-editor__to-crop-min-btn').on('click', function () {
		$('.photo-editor__section').removeClass('photo-editor__section-active');
		$('.photo-editor__crop-min-section').addClass('photo-editor__section-active');
		$('.photo-editor__tab').removeClass('photo-editor__tab-active');
		$('.photo-editor__crop-min-tab').addClass('photo-editor__tab-active');
	});

	$(document).on('click', '.photo-editor__submit-btn', function () {
		$('.photo-editor').hide();
	});

});
