import $ from 'jquery';

$(window).on('load', showDishGroups);
$(document).on('click', '.dish-group', openDishGroup);
$(document).on('click', '.recipe-preview', openRecipe);
$(document).on('click', '.all-dish-groups', backToAllGroups);
$(document).on('click', '.current-dish-group', backToCurrentGroup);

function showDishGroups() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {

			var dishGroups = JSON.parse(this.responseText);

			for (var i = 0; i < dishGroups.length; i++) {
				$('.main').append(
					'<div class="main__dish-group dish-group"><img class="dish-group__img" src=' + dishGroups[i].recipes[0].image
					+ '><div class="dish-group__title">' + dishGroups[i].group + '</div></div>');
			}
		}
	};
	xmlhttp.open("GET", "assets/data/recipes2.json");
	xmlhttp.send();
}

function backToAllGroups() {
	$('.dish-group_opened').remove();
	$('.dish-group').show();
}

function backToCurrentGroup() {
	$('.recipe').remove();
	$('.current-recipe').remove();
	$('.recipe-preview').show();
}

function openDishGroup() {
	var currentDishGroup = $(this).find('.dish-group__title').text();

	$('.dish-group').hide();
	$('.main').append('<section class="dish-group_opened"><div class="dish-group__nav"><div class="all-dish-groups">Все рецепты</div>&rarr; <div class="current-dish-group">'
	+ currentDishGroup + '</div></div></section>')

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {

			var dishGroups = JSON.parse(this.responseText);

			for (var j = 0; j < dishGroups.length; j++) {

				if (dishGroups[j].group === currentDishGroup) {

					for (var i = 0; i < dishGroups[j].recipes.length; i++) {
						$('.dish-group_opened').append(
							'<div class="recipe-preview"><div class="recipe-preview__image"><img src="'
							+ dishGroups[j].recipes[i].image + '"></div><div class="recipe-preview__content"><div class="recipe-preview__title">'
							+ dishGroups[j].recipes[i].title + '</div><div class="recipe-preview__description">' + dishGroups[j].recipes[i].description + '</div></div></div>');
					}
				}
			}

		}
	};
	xmlhttp.open("GET", "assets/data/recipes2.json");
	xmlhttp.send();
}

function openRecipe() {
	var xmlhttp = new XMLHttpRequest();

	var recipeTitle = $(this).find('.recipe-preview__title').text();
	$('.dish-group__nav').append('<div class="current-recipe">&rarr;' + recipeTitle + '</div>');

	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {

			var allRrecipes = JSON.parse(this.responseText);

			for (var k = 0; k < allRrecipes.length; k++) {
				for (var j = 0; j < allRrecipes[k].recipes.length; j++) {
					if (allRrecipes[k].recipes[j].title === recipeTitle) {
						$('.recipe-preview').hide();
						$('<div class="recipe"></div>').insertAfter($('.recipe-preview')[0]).append('<div class="recipe__image" style="background: url(' + allRrecipes[k].recipes[j].image + ') no-repeat 0 0; background-size: cover"></div><div class="recipe__content"><div class="recipe__title">'
						+ allRrecipes[k].recipes[j].title + '</div><ul class="recipe__components"></ul></div><div class="recipe__details"></div>');

						var components = [];
						for (var i = 0; i < allRrecipes[k].recipes[j].components.length; i++) {
							components.push('<li class="recipe__item">' + allRrecipes[k].recipes[j].components[i] + '</li>');
						}
						$('.recipe__components').append(components);

						var steps = [];
						for (var i = 0; i < allRrecipes[k].recipes[j].steps.length; i++) {
							steps.push('<p class="recipe__step">' + allRrecipes[k].recipes[j].steps[i] + '</p');
						}
						$('.recipe__details').append(steps);
					}
				}
			}

		}
	};
	xmlhttp.open("GET", "assets/data/recipes2.json");
	xmlhttp.send();
}
