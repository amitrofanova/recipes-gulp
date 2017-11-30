import $ from 'jquery';

var ingredients = [];
var steps = [];

$(document).ready(function(){


	$(document).on('click', '.nav__add-recipe', showAddRecipeForm);

	// Reset input before typing
	$(document).on('focus', '.add-recipe__ingredient-input', function() {
		$('.add-recipe__ingredient-input').val('');
		$('.add-recipe__ingredient-input').css('color', '#000');
	})

	$(document).on('click', '.add-recipe__new-ingredient-btn', function() {
		var ingredient = $('.add-recipe__ingredient-input').val();
		if (ingredient !== "") {
			ingredients.push(ingredient);
			$('.add-recipe__ingredients').append('<div class="add-recipe__new-item">' + ingredient + '<div class="add-recipe__delete-item">x</div></div>');
			$('.add-recipe__ingredient-input').val('');
		}
		else {
			$('.add-recipe__ingredient-input').val('Укажите ингредиент');
			$('.add-recipe__ingredient-input').css('color', '#fff');
		}
	});

	$(document).on('click', '.add-recipe__new-step-btn', function() {
		var step = $('.add-recipe__step-input').val();
    // Check if text input is not empty
		if (step !== "") {
			steps.push(step);
			$('.add-recipe__steps').append('<div class="add-recipe__new-item">' + step + '<div class="add-recipe__delete-item">x</div></div>');
			$('.add-recipe__step-input').val('');
		}
	});

	$(document).on('click', '.add-recipe__delete-item', function() {
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
	});

	$(document).on('submit', '.add-recipe', addRecipe);

});

function addRecipe() {
	var group = $('.add-recipe__dish-group').val();
	var title = $('.add-recipe__title').val();
	var description = $('.add-recipe__description').val();
	var image = $('.image-data').text();
	var newRecipe = {"title": title, "description": description, "image": image, "components": ingredients, "steps": steps};
	var newRecipeToJSON = JSON.stringify(newRecipe, null, '\t');
	console.log(newRecipeToJSON);
	$('.add-recipe__result-json').html(newRecipeToJSON);
  event.preventDefault();
}

function showAddRecipeForm() {
	$('.main').hide();
	$('.add-recipe').show();
}

$(document).on('change', '.add-recipe__image-input', GetImageData);

function GetImageData(evt) {
  var tgt = evt.target || window.event.srcElement;
	var files = tgt.files;
	var f = files[0];
	$('.add-recipe__image-label').html(f.name);

  if (FileReader && files && files.length) {
    var fr = new FileReader();
		fr.onload = function (evt) {
			$('.add-recipe__image-preview').attr('src', fr.result);
			$('.image-data').html(fr.result);
			return fr.result;
		};
    fr.readAsDataURL(f);
  }
  else {
    alert('Unable to load file')
  }
}
