import $ from 'jquery';


const jsonPath = 'https://amitrofanova.pythonanywhere.com/api/recipes';
const pathToNames = 'https://amitrofanova.pythonanywhere.com/api/recipes/names';


function getList(callback, group) {
	const result = [];
	let url = pathToNames;

	if (group) {
		url += '?group=' + group;
	}

	$.ajax({
		url,
		dataType: 'json',
		success(data){
			callback(data);
		}
	});

	return result;
}


function createGroupsSelect() {
	const callback = function (data) {
		for (let i = 0; i < data.length; i++) {
			$('.delete-recipe__dish-group').append(
				'<option value="' + data[i].group + '">' + data[i].group + '</option>'
			);
		}
	};
	getList(callback);
}


function clearRecipesSelect() {
	$('.delete-recipe__recipe-to-delete').text('');
}


function createRecipesSelect() {
	clearRecipesSelect();

	const selectedGroup = '.delete-recipe__dish-group option:selected';
	const group = $(selectedGroup).text();

	const callback = function (data) {
		for (let i = 0; i < data.recipes.length; i++) {
			$('.delete-recipe__recipe-to-delete').append(
				'<option value="' + data.recipes[i] + '">' + data.recipes[i] + '</option>'
			);
		}
	};
	getList(callback, group);
}


function deleteRecipe() {
	const selectedGroup = '.delete-recipe__dish-group option:selected';
	const group = $(selectedGroup).text();
	const selectedRecipe = '.delete-recipe__recipe-to-delete option:selected';
	const recipeToDelete = $(selectedRecipe).text();
	const url = jsonPath + '?group=' + group + '&recipe=' + recipeToDelete;

	$.ajax({
		type: 'DELETE',
		url,
		dataType: 'json',
		success(data){
			console.log(data);
		},
		error(data, status){
			console.log(data);
			console.log(status);
		}
	});
}


$(document).ready(function (){

	createGroupsSelect();
	$(document).on('change', '.delete-recipe__dish-group', createRecipesSelect);
	$(document).on('click', '.delete-recipe__delete-recipe', deleteRecipe);

});
