import $ from 'jquery';

$('.recipe-preview').on('click', showRecipe);
$('.dish-group').on('click', openDishGroup);
$('.all-dish-groups').on('click', backToAllGroups);

function backToAllGroups() {
	$('.dish-group_opened').hide();
	$('.dish-group').show();
}

function openDishGroup() {
	$('.dish-group').hide();
	$('.dish-group_opened').css('padding-top', '80px');
	$('.all-dish-groups').show().css('display', 'inline-block');
	$('.current-dish-groups').show().css('display', 'inline-block');
	$('.dish-group_opened').show().css('display', 'flex');
}

function getRecipesPreviewData() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {

			var recipes = JSON.parse(this.responseText);

			for (var i = 0; i < recipes.length; i++) {
				console.log($('.recipe-preview__title'));
				$('.recipe-preview__title').html(recipes[0].title);
			}

		}
	};
	xmlhttp.open("GET", "assets/data/recipes.json");
	xmlhttp.send();
}

function showRecipe() {
	$('.recipe-preview').hide();
	$('<div class="recipe"></div>').insertAfter($('.recipe-preview')[0]);
	$('.recipe').append('<div class="recipe__image"></div>');
	$('.recipe').append('<div class="recipe__content"></div>');
	$('.recipe__content').append('<div class="recipe__title"></div>');
	$('.recipe__content').append('<ul class="recipe__components"></ul>');
	$('.recipe').append('<div class="recipe__details"></div>');
	getRecipe();
}

function getRecipe() {
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
