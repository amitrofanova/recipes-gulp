import $ from 'jquery';
// import Croppie from 'croppie';
import Cropper from 'cropperjs';

import {
	UNABLE_LOAD_FILE_ALERT,
	EMPTY_INGREDIENT_ALERT,
	ADDED_RECIPE_ALERT,
	ERROR_ALERT}from '../../resources/strings/ru.js';

import {showAlert}from '../modal-alert/modal-alert.js';
import {getUsernameFromStorage, getPasswordFromStorage}from '../auth-form/auth-form.js';


const jsonPath = 'https://amitrofanova.pythonanywhere.com/api/recipes';
// const pathToNames = 'https://amitrofanova.pythonanywhere.com/api/recipes/names';

const CLASS_PREFIX = '.add-recipe';
const formCls = CLASS_PREFIX, // eslint-disable-line one-var
	dishGroupInputCls = CLASS_PREFIX + '__dish-group',
	titleInputCls = CLASS_PREFIX + '__title-input',
	descriptionInputCls = CLASS_PREFIX + '__description-input',
	imageInputCls = CLASS_PREFIX + '__image-input',
	imagePreviewCls = CLASS_PREFIX + '__image-preview',
	imageResizedCls = CLASS_PREFIX + '__image-resized',
	imageResultCls = CLASS_PREFIX + '__image-result',
	imageCropBtn = CLASS_PREFIX + '__crop-btn',
	imagePreviewWrap = CLASS_PREFIX + '__image-preview-wrap',
	imageResultWrap = CLASS_PREFIX + '__image-result-wrap',
	imageLabelCls = CLASS_PREFIX + '__image-label',
	ingredientsCls = CLASS_PREFIX + '__ingredients',
	ingredientInputCls = CLASS_PREFIX + '__ingredient-input',
	newIngredientBtnCls = CLASS_PREFIX + '__new-ingredient-btn',
	stepsCls = CLASS_PREFIX + '__steps',
	stepInputCls = CLASS_PREFIX + '__step-input',
	newStepBtnCls = CLASS_PREFIX + '__new-step-btn',
	newItemCls = CLASS_PREFIX + '__new-item',
	deleteItemCls = CLASS_PREFIX + '__delete-item',
	resetBtnCls = CLASS_PREFIX + '__reset-btn',
	formInputs = CLASS_PREFIX + ' :input';

// https://www.w3schools.com/jsref/prop_node_nodetype.asp
const TEXT_NODE_TYPE = 3;


function addIngredient() {
	const ingredient = $(ingredientInputCls).val();
	const newElCls = newItemCls.substr(1);
	const deleteElCls = deleteItemCls.substr(1);

	if ((ingredient !== '') && (ingredient !== EMPTY_INGREDIENT_ALERT)) {
		const newEl = '<div class="' + newElCls + '">' + ingredient + '<div class="' + deleteElCls + '"></div></div>';

		$(ingredientsCls).append(newEl);
		$(ingredientInputCls).val('');
	}

	else {
		$(ingredientInputCls).val(EMPTY_INGREDIENT_ALERT);
		$(ingredientInputCls).css('color', '#fff');
	}
}


function addStep() {
	const step = $(stepInputCls).val();
	const newElCls = newItemCls.substr(1);
	const deleteElCls = deleteItemCls.substr(1);

	if (step !== '') {
		const newEl = '<div class=' + newElCls + '>' + step +	'<div class="' + deleteElCls + '"></div></div>';
		$(stepsCls).append(newEl);
		$(stepInputCls).val('');
	}
}


function clearInput() {
	$(ingredientInputCls).val('');
	$(ingredientInputCls).css('color', '#000');
}


function getIngredients() {
	const ingredients = [];
	let newIngredient;

	$(newItemCls).each(function () {
		if ($(this).parents(ingredientsCls).length) {

			newIngredient = $(this).contents().filter(function () {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();

			ingredients.push(newIngredient);
		}
	});

	return ingredients;
}


function getSteps() {
	const steps = [];
	let newStep;

	$(newItemCls).each(function () {
		if ($(this).parents(stepsCls).length) {

			newStep = $(this).contents().filter(function () {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();

			steps.push(newStep);
		}
	});

	return steps;
}


function deleteItem() {
	const ingredients = getIngredients();
	const steps = getSteps();
	let itemToDelete;

	// Define if current section related to ingredients or steps
	if ($(this).parents(ingredientsCls).length) {

		itemToDelete = ingredients
			.indexOf($(this)
				.parent()
				.contents().not($(newItemCls).children())
				.text()
			);

		ingredients.splice(itemToDelete, 1);
	}

	else if ($(this).parents(stepsCls).length) {

		itemToDelete = steps
			.indexOf($(this)
				.parent()
				.contents().not($(newItemCls).children())
				.text()
			);

		steps.splice(itemToDelete, 1);
	}

	// Delete element from DOM
	$(this).parent().remove();
}


function createRecipe() {
	const title = $(titleInputCls).val();
	const description = $(descriptionInputCls).val();
	const image = $(imageResultCls).attr('src');
	// const image = $(imagePreviewCls).attr('src');
	const newRecipe = {
		title,
		description,
		image,
		components: getIngredients(),
		steps: getSteps()
	};
	const newRecipeToJSON = JSON.stringify(newRecipe, null, '\t');
	return newRecipeToJSON;
}


function saveRecipe(evt){
	const selectedGroup = dishGroupInputCls + ' option:selected';
	const group = $(selectedGroup).text();
	const form = $(CLASS_PREFIX);
	$.ajax({
		type: 'POST',
		url: jsonPath + '?group=' + encodeURIComponent(group),
		username: getUsernameFromStorage(),
		password: getPasswordFromStorage(),
		dataType: 'json',
		data: createRecipe(),
		success(){
			showAlert(ADDED_RECIPE_ALERT);
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(form, err);
		}
	});

	window.onbeforeunload = null;
	evt.preventDefault();
}


export function resetForm() {
	$(formCls)[0].reset();
	$(newItemCls).remove();
	$(deleteItemCls).remove();
	$(imagePreviewCls).attr('src', '');
	$(imageLabelCls).text('');
}


function cropImage() {
	$(imageCropBtn).show();
	const image = $('.add-recipe__image-preview')[0];
	const cropper = new Cropper(image, {
		aspectRatio: 16 / 9,
		rotatable: false,
		zoomable: false,
		minContainerWidth: 320,
		minContainerHeight: 180
	});

	$(imageCropBtn).on('click', function () {
		$(imageResultWrap).show();
		$(imageResultCls).attr('src', cropper.getCroppedCanvas({maxWidth: 1600, maxHeight: 900}).toDataURL());
		$(imagePreviewWrap).hide();
		$(imageCropBtn).hide();
	});
}


function uploadImage(evt) {
	const tgt = evt.target || window.event.srcElement;
	const files = tgt.files;
	const f = files[0];
	$(imageLabelCls).html(f.name);

	if (FileReader && files && files.length) {
		const fr = new FileReader();

		fr.onload = function () {
			const res = fr.result;

			$(imagePreviewWrap).show();
			$(imagePreviewCls).attr('src', res);

			cropImage();

			return res;
		};
		fr.readAsDataURL(f);
	}

	else {
		$(imageLabelCls).html(UNABLE_LOAD_FILE_ALERT);
	}
}


// function bind(func, context) {
// 	return function() {
// 		return func.apply(context, arguments);
// 	};
// }
//
//
// function showUploadedImage() {
// 	console.log('start');
// 	const evtSrc = $(imageInputCls);
// 	const res = bind(uploadImage, evtSrc);
// 	$(imagePreviewCls).show();
// 	$(imagePreviewCls).attr('src', res);
// }


function resizeImage() { // eslint-disable-line no-unused-vars
	const MAX_WIDTH = 400;
	const MAX_HEIGHT = 400;
	const imageToResize = $(imagePreviewCls)[0];
	let width = imageToResize.width;
	let height = imageToResize.height;

	if (width > height) {
		if (width > MAX_WIDTH) {
			height *= MAX_WIDTH / width;
			width = MAX_WIDTH;
		}
	}else if (height > MAX_HEIGHT) {
		width *= MAX_HEIGHT / height;
		height = MAX_HEIGHT;
	}

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const context = canvas.getContext('2d');
	context.drawImage(imageToResize, 0, 0, width, height);
	$(imageResizedCls).attr('src', canvas.toDataURL());
	console.log('result: ' + $(imageResizedCls).attr('src').length);
}


$(document).ready(function () {

	$(document).on('change', imageInputCls, uploadImage);

	// $(imagePreviewCls)[0].onload = function () {
	// 	cropImage();
	// };

	$(document).on('click', newIngredientBtnCls, addIngredient);
	$(document).on('click', newStepBtnCls, addStep);
	$(document).on('focus', ingredientInputCls, clearInput);
	$(document).on('click', deleteItemCls, deleteItem);
	$(document).on('submit', formCls, saveRecipe);
	$(document).on('click', resetBtnCls, resetForm);

	$(formInputs).change(function () {
		$(formCls).data('changed', true);
	});

	window.onbeforeunload = function () {
		if ((window.location.pathname === '/dashboard.html') && ($(formCls).data('changed') === true)) {
			return 'Are you sure you want to leave this page? You can lose changes you have made.';
		}
	};



});
