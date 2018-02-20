import $ from 'jquery';
// import Cropper from 'cropperjs';

import {
	// UNABLE_LOAD_FILE_ALERT,
	EMPTY_INGREDIENT_ALERT,
	ADDED_RECIPE_ALERT,
	ERROR_ALERT}from '../../resources/strings/ru.js';

import {showAlert}from '../modal-alert/modal-alert.js';
import {authHeader}from '../auth-form/auth-form.js';
import {createEditor, destroyEditor, resizeImage}from '../photo-editor/photo-editor.js';

const jsonPath = 'https://amitrofanova.pythonanywhere.com/api/recipes/';
// const pathToNames = 'https://amitrofanova.pythonanywhere.com/api/groups/?short';

const CLASS_PREFIX = '.add-recipe';
const formCls = CLASS_PREFIX, // eslint-disable-line one-var
	dishGroupInputCls = CLASS_PREFIX + '__dish-group',
	titleInputCls = CLASS_PREFIX + '__title-input',
	descriptionInputCls = CLASS_PREFIX + '__description-input',
	imagePreviewCls = CLASS_PREFIX + '__image-preview',
	imagePreviewMin = CLASS_PREFIX + '__image-preview-min',
	imageResultCls = CLASS_PREFIX + '__image-result',
	imagePreviewWrap = CLASS_PREFIX + '__image-preview-wrap',
	imageResultWrap = CLASS_PREFIX + '__image-result-wrap',
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


// function createLoader() {
// 	const modal = '<div class="add-recipe__modal ajax-loader">' +
// 		'<div class="add-recipe__modal-content">' +
// 			'<div class="add-recipe__modal-text">Пожалуйста подождите, ваш запрос обрабатывается</div>' +
// 		'</div>' +
// 	'</div>';
// 	$('body').append(modal);
// }
//
//
// function deleteLoader() {
// 	$('.ajax-loader').remove();
// }


function createRecipe() {
	const title = $(titleInputCls).val();
	const description = $(descriptionInputCls).val();
	const image_min = $(imagePreviewMin).attr('src');
	const image = $(imagePreviewCls).attr('src');
	const newRecipe = {
		title,
		description,
		image_min,
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
	$.ajax({
		type: 'POST',
		url: jsonPath + '?group=' + encodeURIComponent(group),
		headers: {
			Authorization: authHeader()
		},
		dataType: 'json',
		data: createRecipe(),
		success(){
			showAlert(ADDED_RECIPE_ALERT);
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(err);
			// showAlert(form, err);
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
	$(imageResultCls).attr('src', '');
	$(imagePreviewWrap).show();
	$(imageResultWrap).hide();
	// $(imagePreviewCls).text('');
	$('.cropper-container').remove();
}


function getCroppedImg() {
	const img = $('.photo-editor__image-crop').attr('src');
	const imgMin = $('.photo-editor__image-crop-min').attr('src');

	const imageToResize = $('.photo-editor__image-crop-min')[0];
	console.log('initial: ' + imgMin.length);
	const resizedImgMin = resizeImage(imageToResize);
	console.log('resized: ' + resizedImgMin.length);
	
	$('.add-recipe__image-preview-wrap').css('display', 'flex');
	$('.add-recipe__image-preview').attr('src', img);
	$('.add-recipe__image-preview-min').attr('src', resizedImgMin);
	destroyEditor();
}


$(document).ready(function () {

	$(document).on('click', '.add-recipe__open-editor-btn', createEditor);
	$(document).on('click', '.photo-editor__submit-btn', function () {
		if ($(this).parents('.add-recipe').length) {
			getCroppedImg();
		}
	});
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

	// $( document ).ajaxStart(function () {
	// 	createLoader();
	// });
	//
	// $( document ).ajaxStop(function () {
	// 	deleteLoader();
	// });

});
