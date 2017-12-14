import $ from 'jquery';


$(document).ready(function(){

	$(document).on('change', '.add-recipe__image-input', GetImageData);
	// $('.add-recipe__image-preview').on('click', function() {
	// 	resizeImage(100,100);
	// });
	// $(document).on('change', '.add-recipe__image-input', addImage);
	$(document).on('click', '.add-recipe__new-ingredient-btn', addIngredient);
	$(document).on('click', '.add-recipe__new-step-btn', addStep);
	$(document).on('focus', '.add-recipe__ingredient-input', clearInput);
	$(document).on('click', '.add-recipe__delete-item', deleteItem);
	$(document).on('submit', '.add-recipe', addRecipe);
	$(document).on('click', '.add-recipe__reset-btn', resetForm);

	// $(".add-recipe__image-input").change(resizeImage);
});

function GetImageData(evt) {
	var tgt = evt.target || window.event.srcElement;
	var files = tgt.files;
	var f = files[0];
	$('.add-recipe__image-label').html(f.name);

	if (FileReader && files && files.length) {
		var fr = new FileReader();
		fr.onload = function () {
			$('.add-recipe__image-preview').show();
			$('.add-recipe__image-preview').attr('src', fr.result);
			console.log('source: ' + fr.result.length);
			return fr.result;
		};
		fr.readAsDataURL(f);
		resizeImage(100,100);
	}
	else {
		alert('Unable to load file');
	}
}

function resizeImage(width, height) {
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext('2d');
	var imageToResize = document.getElementsByClassName('add-recipe__image-preview')[0];

	$('.add-recipe__image-preview').on('load', function() {
		context.scale(width / imageToResize.width, height / imageToResize.height);
		context.drawImage(imageToResize, 0, 0);
		$('.add-recipe__image-resized').attr('src', canvas.toDataURL());
		console.log('result: ' + canvas.toDataURL().length);
	});
}

// function addImage(evt) {
// 	var tgt = evt.target || window.event.srcElement;
// 	var files = tgt.files;
// 	var f = files[0];
// 	$('.add-recipe__image-label').html(f.name);
//
// 	if (FileReader && files && files.length) {
//
// 		var fileReader = new FileReader();
// 		fileReader.onload = function (evt) {
// 			var img = new Image();
// 			img.onload = function () {
// 				const MAX_WIDTH = 150;
// 				const MAX_HEIGHT = 150;
// 				var width = img.width;
// 				var height = img.height;
//
// 				if (width > height) {
// 					if (width > MAX_WIDTH) {
// 						height *= MAX_WIDTH / width;
// 						width = MAX_WIDTH;
// 					}
// 				} else {
// 					if (height > MAX_HEIGHT) {
// 						width *= MAX_HEIGHT / height;
// 						height = MAX_HEIGHT;
// 					}
// 				}
//
// 				var canvas = document.createElement('canvas');
// 				canvas.width = width;
// 				canvas.height = height;
// 				canvas.getContext('2d').drawImage(this, 0, 0, width, height);
// 				this.src = canvas.toDataURL();
// 				$('.add-recipe__image-preview').show();
// 				$('.add-recipe__image-preview-wrapper').append(this);
// 				$(this).addClass('.add-recipe__image-preview');
// 			};
// 			img.src = evt.target.result;
// 		}
// 		fileReader.readAsDataURL(f);
// 	}
// 	else {
// 		alert('Unable to load file');
// 	}
// }


// function GetImageData(evt) {
// 	var tgt = evt.target || window.event.srcElement;
// 	var files = tgt.files;
// 	var f = files[0];
// 	$('.add-recipe__image-label').html(f.name);
//
// 	if (FileReader && files && files.length) {
// 		var fr = new FileReader();
// 		fr.onload = function () {
// 			$('.add-recipe__image-preview').show();
// 			$('.add-recipe__image-preview').attr('src', fr.result);
// 			return fr.result;
// 		};
// 		fr.readAsDataURL(f);
// 	}
// 	else {
// 		alert('Unable to load file');
// 	}
// }


function addIngredient() {
	var ingredient = $('.add-recipe__ingredient-input').val();
	if ((ingredient !== '') && (ingredient !== 'Укажите ингредиент')) {
		$('.add-recipe__ingredients').append('<div class="add-recipe__new-item">' + ingredient + '<div class="add-recipe__delete-item">x</div></div>');
		$('.add-recipe__ingredient-input').val('');
	}
	else {
		$('.add-recipe__ingredient-input').val('Укажите ингредиент');
		$('.add-recipe__ingredient-input').css('color', '#fff');
	}
}


function addStep() {
	var step = $('.add-recipe__step-input').val();
	// Check if text input is not empty
	if (step !== '') {
		$('.add-recipe__steps').append('<div class="add-recipe__new-item">' + step + '<div class="add-recipe__delete-item">x</div></div>');
		$('.add-recipe__step-input').val('');
	}
}


// Reset input before typing
function clearInput() {
	$('.add-recipe__ingredient-input').val('');
	$('.add-recipe__ingredient-input').css('color', '#000');
}


function deleteItem() {
	var ingredients = getIngredients();
	var steps = getSteps();
	// Define if current section related to ingredients or steps
	if ($(this).parents('.add-recipe__ingredients').length) {
		// Find content of the element that have to be deleted
		var elemToDeleteFromIngredients = ingredients.indexOf($(this).parent().contents().not($('.add-recipe__new-item').children()).text());
		// Delete element from array
		ingredients.splice(elemToDeleteFromIngredients, 1);
	}
	else if ($(this).parents('.add-recipe__steps').length) {
		var elemToDeleteFromSteps = steps.indexOf($(this).parent().contents().not($('.add-recipe__new-item').children()).text());
		steps.splice(elemToDeleteFromSteps, 1);
	}
	// Delete element from DOM
	$(this).parent().remove();
}


function getIngredients() {
	var ingredients = [];
	var newIngredient;
	$('.add-recipe__new-item').each(function() {
		if ($(this).parents('.add-recipe__ingredients').length) {
			newIngredient = $(this).contents().filter(function() {return this.nodeType === 3;}).text();
			ingredients.push(newIngredient);
		}
	});
	return ingredients;
}


function getSteps() {
	var steps = [];
	var newStep;
	$('.add-recipe__new-item').each(function() {
		if ($(this).parents('.add-recipe__steps').length) {
			newStep = $(this).contents().filter(function() {return this.nodeType === 3;}).text();
			steps.push(newStep);
		}
	});
	return steps;
}


function addRecipe(evt) {
	var group = $('.add-recipe__dish-group option:selected').text();
	var title = $('.add-recipe__title-input').val();
	var description = $('.add-recipe__description-input').val();
	var image = $('.add-recipe__image-preview').attr('src');
	var newRecipe = {'title': title, 'description': description, 'image': image, 'components': getIngredients(), 'steps': getSteps()};
	var newRecipeToJSON = JSON.stringify(newRecipe, null, '\t');
	$('.add-recipe__result-title').text('Скопируйте результат в группу "' + group + '"');
	$('.add-recipe__result-json').html(newRecipeToJSON);
	evt.preventDefault();
}


function resetForm() {
	$('.add-recipe__new-item').remove();
	$('.add-recipe__delete-item').remove();
	$('.add-recipe__image-preview').attr('src', '');
	$('.add-recipe__image-label').text('');
}
