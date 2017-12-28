import $ from 'jquery';
import {
	UNABLE_LOAD_FILE_ALERT,
	EMPTY_INGREDIENT_ALERT,
	INITIAL_RESULT_TITLE,
	ADDED_RECIPE_ALERT
}from '../../resources/strings/ru.js';


// const jsonPath = 'http://192.168.1.46:5000/api/recipes';
const jsonPath = 'https://amitrofanova.pythonanywhere.com/api/recipes';

const CLASS_PREFIX = '.add-recipe';
const formCls = CLASS_PREFIX, // eslint-disable-line one-var
	dishGroupInputCls = CLASS_PREFIX + '__dish-group',
	titleInputCls = CLASS_PREFIX + '__title-input',
	descriptionInputCls = CLASS_PREFIX + '__description-input',
	imageInputCls = CLASS_PREFIX + '__image-input',
	imagePreviewCls = CLASS_PREFIX + '__image-preview',
	imageResizedCls = CLASS_PREFIX + '__image-resized',
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
	resultTitleCls = CLASS_PREFIX + '__result-title',
	resultJsonCls = CLASS_PREFIX + '__result-json';

// https://www.w3schools.com/jsref/prop_node_nodetype.asp
const TEXT_NODE_TYPE = 3;


function getImageData(evt) {
	const tgt = evt.target || window.event.srcElement;
	const files = tgt.files;
	const f = files[0];
	$(imageLabelCls).html(f.name);

	if (FileReader && files && files.length) {
		const fr = new FileReader();

		fr.onload = function () {
			const res = fr.result;

			$(imagePreviewCls).show();
			$(imagePreviewCls).attr('src', res);

			return res;
		};
		fr.readAsDataURL(f);
	}

	else {
		$(imageLabelCls).html(UNABLE_LOAD_FILE_ALERT);
	}
}


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


// function addRecipe(evt) {
// 	const title = $(titleInputCls).val();
// 	const description = $(descriptionInputCls).val();
// 	const image = $(imagePreviewCls).attr('src');
// 	const newRecipe = {
// 		title,
// 		description,
// 		image,
// 		components: getIngredients(),
// 		steps: getSteps()
// 	};
// 	const newRecipeToJSON = JSON.stringify(newRecipe, null, '\t');
// 	$(resultJsonCls).html(newRecipeToJSON);
// 	$(window).off('beforeunload');
// 	evt.preventDefault();
// }


function showSuccessAlert() {
	$('.add-recipe')
		.append(
			'<div class="add-recipe__modal">' +
				'<div class="add-recipe__modal-content">' +
					'<div class="add-recipe__modal-text">' + ADDED_RECIPE_ALERT + '</div>' +
					'<div class="add-recipe__close-modal"></div>' +
				'</div>' +
			'</div>'
		);
}


function createRecipe() {
	// const selectedGroup = dishGroupInputCls + ' option:selected';
	// const group = $(selectedGroup).text();
	const title = $(titleInputCls).val();
	const description = $(descriptionInputCls).val();
	// var image = $(imageResizedCls).attr('src');
	const image = $(imagePreviewCls).attr('src');
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

function hideSuccessAlert() {
	$('.add-recipe__modal').remove();
}


function saveRecipe(evt){
	const selectedGroup = dishGroupInputCls + ' option:selected';
	const group = $(selectedGroup).text();
	$.ajax({
		type: 'POST',
		url: jsonPath + '?group=' + group,
		dataType: 'json',
		data: createRecipe(),
		success(){
			showSuccessAlert();
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
	$(resultTitleCls).text(INITIAL_RESULT_TITLE);
	$(resultJsonCls).text('');
}


$(document).ready(function (){

	$(document).on('change', imageInputCls, getImageData);
	$(document).on('click', newIngredientBtnCls, addIngredient);
	$(document).on('click', newStepBtnCls, addStep);
	$(document).on('focus', ingredientInputCls, clearInput);
	$(document).on('click', deleteItemCls, deleteItem);
	$(document).on('submit', formCls, saveRecipe);
	$(document).on('click', resetBtnCls, resetForm);

	$('.add-recipe :input').change(function () {
		$('.add-recipe').data('changed', true);
		console.log($('.add-recipe').data('changed'));
	});

	$(document).on('click', '.add-recipe__close-modal', hideSuccessAlert);

	window.onbeforeunload = function () {
		if ((window.location.pathname === '/dashboard.html') && ($('.add-recipe').data('changed') === true)) {
			return 'sure?';
		}
	};

	// $(imagePreviewCls).on('load', resizeImage);

});
