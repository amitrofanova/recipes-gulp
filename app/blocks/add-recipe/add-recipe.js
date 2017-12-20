import $ from 'jquery';
import { UNABLE_LOAD_FILE_ALERT, EMPTY_INGREDIENT_ALERT , INITIAL_RESULT_TITLE, RESULT_ALERT } from '../../resources/strings/ru.js';


// https://www.w3schools.com/jsref/prop_node_nodetype.asp
const TEXT_NODE_TYPE = 3;

const CLASS_PREFIX = '.add-recipe';
var formCls             = CLASS_PREFIX,
	dishGroupInputCls     = CLASS_PREFIX + '__dish-group',
	titleInputCls         = CLASS_PREFIX + '__title-input',
	descriptionInputCls   = CLASS_PREFIX + '__description-input',
	imageInputCls         = CLASS_PREFIX + '__image-input',
	imagePreviewCls       = CLASS_PREFIX + '__image-preview',
	imageResizedCls       = CLASS_PREFIX + '__image-resized',
	imageLabelCls         = CLASS_PREFIX + '__image-label',
	ingredientsCls        = CLASS_PREFIX + '__ingredients',
	ingredientInputCls    = CLASS_PREFIX + '__ingredient-input',
	newIngredientBtnCls   = CLASS_PREFIX + '__new-ingredient-btn',
	stepsCls              = CLASS_PREFIX + '__steps',
	stepInputCls          = CLASS_PREFIX + '__step-input',
	newStepBtnCls         = CLASS_PREFIX + '__new-step-btn',
	newItemCls            = CLASS_PREFIX + '__new-item',
	deleteItemCls         = CLASS_PREFIX + '__delete-item',
	resetBtnCls           = CLASS_PREFIX + '__reset-btn',
	resultTitleCls        = CLASS_PREFIX + '__result-title',
	resultJsonCls         = CLASS_PREFIX + '__result-json';


$(document).ready(function(){

	$(document).on('change', imageInputCls, getImageData);
	$(document).on('click', newIngredientBtnCls, addIngredient);
	$(document).on('click', newStepBtnCls, addStep);
	$(document).on('focus', ingredientInputCls, clearInput);
	$(document).on('click', deleteItemCls, deleteItem);
	$(document).on('submit', formCls, addRecipe);
	$(document).on('click', resetBtnCls, resetForm);
	// $(imagePreviewCls).on('load', resizeImage);

});


function getImageData(evt) {
	var tgt = evt.target || window.event.srcElement;
	var files = tgt.files;
	var f = files[0];
	$(imageLabelCls).html(f.name);

	if (FileReader && files && files.length) {
		var fr = new FileReader();

		fr.onload = function () {
			var res = fr.result;

			$(imagePreviewCls).show();
			$(imagePreviewCls).attr('src', res);

			return res;
		};
		fr.readAsDataURL(f);
	}

	else {
		alert(UNABLE_LOAD_FILE_ALERT);
	}
}


function resizeImage() {  // eslint-disable-line no-unused-vars
	const MAX_WIDTH = 400;
	const MAX_HEIGHT = 400;
	var imageToResize = $(imagePreviewCls)[0];
	var width = imageToResize.width;
	var height = imageToResize.height;

	if (width > height) {
		if (width > MAX_WIDTH) {
			height *= MAX_WIDTH / width;
			width = MAX_WIDTH;
		}
	}	else {
		if (height > MAX_HEIGHT) {
			width *= MAX_HEIGHT / height;
			height = MAX_HEIGHT;
		}
	}

	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	var context = canvas.getContext('2d');
	context.drawImage(imageToResize, 0, 0, width, height);
	$(imageResizedCls).attr('src', canvas.toDataURL());
	console.log('result: ' + $(imageResizedCls).attr('src').length);
}


function addIngredient() {
	var ingredient = $(ingredientInputCls).val();
	var newElCls = newItemCls.substr(1);
	var deleteElCls = deleteItemCls.substr(1);

	if ((ingredient !== '') && (ingredient !== EMPTY_INGREDIENT_ALERT)) {
		var newEl = '<div class="' + newElCls + '">' + ingredient + '<div class="' + deleteElCls + '">x</div></div>';

		$(ingredientsCls).append(newEl);
		$(ingredientInputCls).val('');
	}

	else {
		$(ingredientInputCls).val(EMPTY_INGREDIENT_ALERT);
		$(ingredientInputCls).css('color', '#fff');
	}
}


function addStep() {
	var step = $(stepInputCls).val();
	var newElCls = newItemCls.substr(1);
	var deleteElCls = deleteItemCls.substr(1);

	if (step !== '') {
		var newEl = '<div class=' + newElCls + '>' + step +	'<div class="' + deleteElCls + '">x</div></div>';
		$(stepsCls).append(newEl);
		$(stepInputCls).val('');
	}
}


function clearInput() {
	$(ingredientInputCls).val('');
	$(ingredientInputCls).css('color', '#000');
}


function deleteItem() {
	var ingredients = getIngredients();
	var steps = getSteps();
	var itemToDelete;

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


function getIngredients() {
	var ingredients = [];
	var newIngredient;

	$(newItemCls).each(function() {
		if ($(this).parents(ingredientsCls).length) {

			newIngredient = $(this).contents().filter(function() {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();

			ingredients.push(newIngredient);
		}
	});

	return ingredients;
}


function getSteps() {
	var steps = [];
	var newStep;

	$(newItemCls).each(function() {
		if ($(this).parents(stepsCls).length) {

			newStep = $(this).contents().filter(function() {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();

			steps.push(newStep);
		}
	});

	return steps;
}


function addRecipe(evt) {
	var selectedGroup = dishGroupInputCls + ' option:selected';
	var group = $(selectedGroup).text();
	var title = $(titleInputCls).val();
	var description = $(descriptionInputCls).val();
	// var image = $(imageResizedCls).attr('src');
	var image = $(imagePreviewCls).attr('src');
	var newRecipe = {
		'title': title,
		'description': description,
		'image': image,
		'components': getIngredients(),
		'steps': getSteps()
	};
	var newRecipeToJSON = JSON.stringify(newRecipe, null, '\t');
	$(resultTitleCls).text(RESULT_ALERT + '"' + group + '"');
	$(resultJsonCls).html(newRecipeToJSON);
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
