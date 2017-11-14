import $ from 'jquery';

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

		var recipe = JSON.parse(this.responseText);

		$('.recipe__title').html(recipe.title);

		var components = [];
		for (var i = 0; i < recipe.components.length; i++) {
			components.push('<li class="recipe__item">' + recipe.components[i] + '</li>');
		}
		$('.recipe__components').append(components);

		var steps = [];
		for (var i = 0; i < recipe.steps.length; i++) {
			steps.push('<p class="recipe__step">' + recipe.steps[i] + '</p');
		}
		$('.recipe__details').append(steps);

	}
};
xmlhttp.open("GET", "assets/data/recipe.json");
xmlhttp.send();
