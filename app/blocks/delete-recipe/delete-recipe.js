import $ from 'jquery';
import {
	DELETED_RECIPE_ALERT}from '../../resources/strings/ru.js';
import {showAlert, hideAlert}from '../modal-alert/modal-alert.js';

const jsonPath = 'https://amitrofanova.pythonanywhere.com/api/recipes';
const pathToNames = 'https://amitrofanova.pythonanywhere.com/api/recipes/names';

const CLASS_PREFIX = '.delete-recipe';
const groupCls = CLASS_PREFIX + '__dish-group', // eslint-disable-line one-var
	recipeCls = CLASS_PREFIX + '__recipe-to-delete',
	deleteBtnCls = CLASS_PREFIX + '__delete-recipe';


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
			$(groupCls).append(
				'<option value="' + data[i].group + '">' + data[i].group + '</option>'
			);
		}
		$(groupCls).val(data[0].group);
		console.log($(groupCls).val());
	};

	getList(callback);
}


function clearRecipesSelect() {
	$(recipeCls).text('');
}


function createRecipesSelect() {
	clearRecipesSelect();

	const group = $(groupCls).val();

	const callback = function (data) {
		for (let i = 0; i < data.recipes.length; i++) {
			$(recipeCls).append(
				'<option value="' + data.recipes[i] + '">' + data.recipes[i] + '</option>'
			);
		}
	};

	getList(callback, group);
}


function deleteRecipe() {
	const group = $(groupCls).val();
	const recipeToDelete = $(recipeCls).val();
	const url = jsonPath + '?group=' + group + '&recipe=' + recipeToDelete;
	const form = $(CLASS_PREFIX);

	$.ajax({
		type: 'DELETE',
		url,
		dataType: 'json',
		success(data){
			showAlert(form, DELETED_RECIPE_ALERT);
			createRecipesSelect();
			console.log(data);
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(form, err);
		}
	});
}


$(document).ready(function (){

	createGroupsSelect();

	$(document).on('change', groupCls, createRecipesSelect);
	$(document).on('click', deleteBtnCls, deleteRecipe);
	$(document).on('click', '.modal-alert__close-btn', hideAlert);

});
