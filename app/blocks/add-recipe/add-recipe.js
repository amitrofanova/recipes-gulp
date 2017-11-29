import $ from 'jquery';

var ingredients = [];
var steps = [];
var imageData;

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

	GetImageData();

	$(document).on('submit', '.add-recipe', addRecipe);

});

function addRecipe() {
	var group = $('.add-recipe__dish-group').val();
	var title = $('.add-recipe__title').val();
	var description = $('.add-recipe__description').val();
	var newRecipe = '{\n"title": "' + title + '",\n "description": "' + description + '",\n "image": "' + imageData + '",\n "components": '+ JSON.stringify(ingredients) + ',\n "steps": ' + JSON.stringify(steps) + '\n}'
	var newRecipeForHTML = '{<br>&emsp;"title": "' + title + '",<br>&emsp;"description": "' + description + '",<br>&emsp; "image": "' + imageData + '",<br>&emsp;"components": '+ JSON.stringify(ingredients) + ',<br>&emsp;"steps": ' + JSON.stringify(steps) + '<br>}'
	console.log(newRecipe);
	$('.add-recipe__result-json').html(newRecipeForHTML);
  event.preventDefault();
}

function showAddRecipeForm() {
	$('.main').hide();
	$('.add-recipe').show();
}

function GetImageData() {
	// https://stackoverflow.com/a/9458996
	function _arrayBufferToBase64( buffer ) {
	    var binary = '';
	    var bytes = new Uint8Array( buffer );
	    var len = bytes.byteLength;
	    for (var i = 0; i < len; i++) {
	        binary += String.fromCharCode( bytes[ i ] );
	    }
	    return window.btoa( binary );
	}

	$(document).on('change', '.add-recipe__image-input', function (evt) {
	  var tgt = evt.target || window.event.srcElement;
		var files = tgt.files;
		var f = files[0];
		$('.add-recipe__image-label').html(f.name);

	  if (FileReader && files && files.length) {
	    var fr = new FileReader();
			fr.onloadend = function () {
				imageData = _arrayBufferToBase64(fr.result);
			};
	    fr.readAsArrayBuffer(f);
	  }

	  else {
	    alert('Unable to load file')
	  }
	})
}
