import $ from 'jquery';

$(document).ready(function(){

	$(document).on('click', '.nav__add-recipe', showAddRecipeForm);
	$(document).on('change', '.add-recipe__image-input', GetImageData);
	$(document).on('click', '.add-recipe__new-ingredient-btn', addIngredient);
	$(document).on('click', '.add-recipe__new-step-btn', addStep);
	$(document).on('focus', '.add-recipe__ingredient-input', clearInput);
	$(document).on('click', '.add-recipe__delete-item', deleteItem);
	$(document).on('submit', '.add-recipe', addRecipe);
	$(document).on('click', '.add-recipe__reset-btn', resetForm);

});

function showAddRecipeForm() {
	$('.all-recipes').hide();
	$('.add-recipe').show();
}

function GetImageData(evt) {
  var tgt = evt.target || window.event.srcElement;
	var files = tgt.files;
	var f = files[0];
	$('.add-recipe__image-label').html(f.name);

  if (FileReader && files && files.length) {
    var fr = new FileReader();
		fr.onload = function (evt) {
			$('.add-recipe__image-preview').show();
			$('.add-recipe__image-preview').attr('src', fr.result);
			return fr.result;
		};
    fr.readAsDataURL(f);
  }
  else {
    alert('Unable to load file')
  }
}

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
	if (step !== "") {
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
	$('.add-recipe__new-item').each(function(i) {
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
	$('.add-recipe__new-item').each(function(i) {
		if ($(this).parents('.add-recipe__steps').length) {
			newStep = $(this).contents().filter(function() {return this.nodeType === 3;}).text();
			steps.push(newStep);
		}
	});
	return steps;
}

function addRecipe(evt) {
	var group = $('.add-recipe__dish-group').val();
	var title = $('.add-recipe__title-input').val();
	var description = $('.add-recipe__description-input').val();
	var image = $('.add-recipe__image-preview').attr('src');
	var newRecipe = {"title": title, "description": description, "image": image, "components": getIngredients(), "steps": getSteps()};
	var newRecipeToJSON = JSON.stringify(newRecipe, null, '\t');
	$('.add-recipe__result-json').html(newRecipeToJSON);
  evt.preventDefault();
}

function resetForm() {
	$('.add-recipe__new-item').remove();
	$('.add-recipe__delete-item').remove();
	$('.add-recipe__image-preview').attr('src', '');
	$('.add-recipe__image-label').text('');
}
