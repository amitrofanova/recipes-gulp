import $ from "jquery";
import {CONFIRM_DELETE_ALERT, DELETED_RECIPE_ALERT, ERROR_ALERT}from "../../resources/strings/ru.js";
import {showAlert, hideAlert}from "../modal-alert/modal-alert.js";
import {authHeader}from "../auth-form/auth-form.js";
import {createRecipesSelect}from "../dashboard/dashboard.js";

const pathToJson = "https://amitrofanova.pythonanywhere.com/api/";

const CLASS_PREFIX = ".delete-recipe";
const groupsSelect = CLASS_PREFIX + "__dish-group", // eslint-disable-line one-var
	recipesSelect = CLASS_PREFIX + "__recipe-to-delete",
	deleteBtn = CLASS_PREFIX + "__delete-recipe",
	confirmBtn = ".modal-alert__confirm-btn";
const alertName = "confirmation-before-delete";


function deleteRecipe(group, recipeToDelete) {
	const url = pathToJson + "recipes/" + encodeURIComponent(recipeToDelete) + "?group=" + encodeURIComponent(group);

	$.ajax({
		type: "DELETE",
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		success(data){
			showAlert(DELETED_RECIPE_ALERT);
			console.log(data);
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(err);
		}
	});
}


$(document).ready(function (){

	$(document).on("change", groupsSelect, function () {
		const currentGroup = $(groupsSelect).val();
		$(this).find(".titleOption").remove();
		$(recipesSelect).prop("disabled", false);
		$(deleteBtn).prop("disabled", false);
		createRecipesSelect(currentGroup, recipesSelect);
	});

	$(document).on("click", deleteBtn, function () {
		showAlert(CONFIRM_DELETE_ALERT, true, alertName);
	});

	$(document).on("click", confirmBtn, function () {
		const alertClsName = "." + alertName;
		if (!($(confirmBtn).parents(alertClsName).length)) {return;}
		const group = $(groupsSelect).val();
		const recipeToDelete = $(recipesSelect).val();
		deleteRecipe(group, recipeToDelete);
		hideAlert();
	});

});
