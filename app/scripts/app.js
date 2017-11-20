import $ from 'jquery';

$('.recipe-preview').on('click', openRecipe);
$('.dish-group').on('click', openDishGroup);
$('.all-dish-groups').on('click', backToAllGroups);

function backToAllGroups() {
	$('.dish-group_opened').hide();
	$('.dish-group').show();
}

function openDishGroup() {
	$('.dish-group').hide();
	$('.all-dish-groups').show().css('display', 'inline-block');
	$('.current-dish-groups').show().css('display', 'inline-block');
	$('.dish-group_opened').show().css('display', 'flex');
	$('.dish-group_opened').css('padding-top', '80px');

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {

			var recipes = JSON.parse(this.responseText);

			for (var i = 0; i < recipes.length; i++) {
				$('.dish-group_opened').append('<div class="recipe-preview"><div class="recipe-preview__image"></div><div class="recipe-preview__content"><div class="recipe-preview__title">'
				 + recipes[i].title + '</div><div class="recipe-preview__description">' + recipes[i].description + '</div></div></div>');
			}
		}
	};
	xmlhttp.open("GET", "assets/data/recipes.json");
	xmlhttp.send();
}

function openRecipe() {
	$('.recipe-preview').hide();
	$('<div class="recipe"></div>').insertAfter($('.recipe-preview')[0]);
	$('.recipe').append('<div class="recipe__image"></div>');
	$('.recipe').append('<div class="recipe__content"></div>');
	$('.recipe__content').append('<div class="recipe__title"></div>');
	$('.recipe__content').append('<ul class="recipe__components"></ul>');
	$('.recipe').append('<div class="recipe__details"></div>');
	getRecipeData();
}

function getRecipeData() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {

			var recipes = JSON.parse(this.responseText);

			$('.recipe__title').html(recipes[0].title);

			var components = [];
			for (var i = 0; i < recipes[0].components.length; i++) {
				components.push('<li class="recipe__item">' + recipes[0].components[i] + '</li>');
			}
			$('.recipe__components').append(components);

			var steps = [];
			for (var i = 0; i < recipes[0].steps.length; i++) {
				steps.push('<p class="recipe__step">' + recipes[0].steps[i] + '</p');
			}
			$('.recipe__details').append(steps);

		}
	};
	xmlhttp.open("GET", "assets/data/recipes.json");
	xmlhttp.send();
}
