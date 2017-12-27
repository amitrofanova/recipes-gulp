import $ from 'jquery';


const jsonPath = 'https://amitrofanova.pythonanywhere.com/api/recipes';


function deleteRecipe() {
	const selectedGroup = '.delete-recipe__dish-group option:selected';
	const group = $(selectedGroup).text();
	const recipeToDelete = $('.delete-recipe__recipe-to-delete').val();
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
	$(document).on('click', '.delete-recipe__delete-recipe', deleteRecipe);
});
