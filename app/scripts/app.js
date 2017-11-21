import $ from 'jquery';

$(window).on('load', showDishGroups);
$(document).on('click', '.dish-group', openDishGroup);
$(document).on('click', '.recipe-preview', openRecipe);
$('.all-dish-groups').on('click', backToAllGroups);

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
	$('.dish-group_opened').hide();
	$('.dish-group').show();
}

function openDishGroup() {
	$('.dish-group').hide();
	$('.all-dish-groups').show().css('display', 'inline-block');
	$('.current-dish-groups').show().css('display', 'inline-block');
	$('.dish-group_opened').show().css('display', 'flex');
	$('.dish-group_opened').css('padding-top', '80px');

	var currentDishGroup = $(this).find('.dish-group__title').text();

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {

			var dishGroups = JSON.parse(this.responseText);

			for (var j = 0; j < dishGroups.length; j++) {

				if (dishGroups[j].group === currentDishGroup) {

					for (var i = 0; i < dishGroups[j].recipes.length; i++) {
						$('.dish-group_opened').append(
							'<div class="recipe-preview"><div class="recipe-preview__image"></div><div class="recipe-preview__content"><div class="recipe-preview__title">'
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
	console.log(recipeTitle);

	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {

			var allRrecipes = JSON.parse(this.responseText);

			for (var k = 0; k < allRrecipes.length; k++) {
				for (var j = 0; j < allRrecipes[k].recipes.length; j++) {
					if (allRrecipes[k].recipes[j].title === recipeTitle) {
						$('.recipe-preview').hide();
						$('<div class="recipe"></div>').insertAfter($('.recipe-preview')[0]).append('<div class="recipe__image"></div><div class="recipe__content"><div class="recipe__title">'
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












//
//
//
// function openDishGroup() {
// 	$('.dish-group').hide();
// 	$('.all-dish-groups').show().css('display', 'inline-block');
// 	$('.current-dish-groups').show().css('display', 'inline-block');
// 	$('.dish-group_opened').show().css('display', 'flex');
// 	$('.dish-group_opened').css('padding-top', '80px');
//
// 	var xmlhttp = new XMLHttpRequest();
// 	xmlhttp.onreadystatechange = function() {
// 	  if (this.readyState == 4 && this.status == 200) {
//
// 			var recipes = JSON.parse(this.responseText);
//
// 			for (var i = 0; i < recipes.length; i++) {
// 				$('.dish-group_opened').append(
// 					'<div class="recipe-preview"><div class="recipe-preview__image"></div><div class="recipe-preview__content"><div class="recipe-preview__title">'
// 					+ recipes[i].title + '</div><div class="recipe-preview__description">' + recipes[i].description + '</div></div></div>');
// 			}
// 		}
// 	};
// 	xmlhttp.open("GET", "assets/data/recipes.json");
// 	xmlhttp.send();
// }
//
// function openRecipe() {
// 	var xmlhttp = new XMLHttpRequest();
//
// 	var recipeTitle = $(this).find('.recipe-preview__title').text();
//
// 	xmlhttp.onreadystatechange = function() {
// 	  if (this.readyState == 4 && this.status == 200) {
//
// 			var recipes = JSON.parse(this.responseText);
// 			for (var j = 0; j < recipes.length; j++) {
// 				if (recipes[j].title === recipeTitle) {
// 					$('.recipe-preview').hide();
// 					$('<div class="recipe"></div>').insertAfter($('.recipe-preview')[0]).append('<div class="recipe__image"></div><div class="recipe__content"><div class="recipe__title">'
// 					+ recipes[j].title + '</div><ul class="recipe__components"></ul></div><div class="recipe__details"></div>');
//
// 					var components = [];
// 					for (var i = 0; i < recipes[j].components.length; i++) {
// 						components.push('<li class="recipe__item">' + recipes[j].components[i] + '</li>');
// 					}
// 					$('.recipe__components').append(components);
//
// 					var steps = [];
// 					for (var i = 0; i < recipes[j].steps.length; i++) {
// 						steps.push('<p class="recipe__step">' + recipes[j].steps[i] + '</p');
// 					}
// 					$('.recipe__details').append(steps);
// 				}
// 			}
// 		}
// 	};
// 	xmlhttp.open("GET", "assets/data/recipes.json");
// 	xmlhttp.send();
// }
