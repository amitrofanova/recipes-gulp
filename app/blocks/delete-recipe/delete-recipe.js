import $ from "jquery";
import {CONFIRM_DELETE_ALERT, DELETED_RECIPE_ALERT, ERROR_ALERT}from "../../resources/strings/ru.js";
import {showAlert, hideAlert}from "../modal-alert/modal-alert.js";
import {authHeader}from "../auth-form/auth-form.js";

const pathToJson = "https://amitrofanova.pythonanywhere.com/api/";

const CLASS_PREFIX = ".delete-recipe";
const groupsSelect = CLASS_PREFIX + "__dish-group", // eslint-disable-line one-var
	recipesSelect = CLASS_PREFIX + "__recipe-to-delete",
	deleteBtn = CLASS_PREFIX + "__delete-recipe",
	confirmBtn = ".modal-alert__confirm-btn",
	declineBtn = ".modal-alert__decline-btn",
	refreshBtn = CLASS_PREFIX + "__refresh-btn";


function getList(callback, group) {
	let url = pathToJson + "groups/" + "?short";

	if (group) {
		url = pathToJson + "groups/" + encodeURIComponent(group) + "?short";
	}

	$.ajax({
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		success(data){
			callback(data);
		}
	});
}


function clearRecipesSelect() {
	$(recipesSelect).text("");
}


function createRecipesSelect() {
	clearRecipesSelect();

	const group = $(groupsSelect).val();

	const callback = function (data) {
		for (let i = 0; i < data.recipes.length; i++) {
			$(recipesSelect).append(
				"<option value=\"" + data.recipes[i] + "\">" + data.recipes[i] + "</option>"
			);
		}
	};

	getList(callback, group);
}


function createGroupsSelect() {
	const callback = function (data) {

		if (!data.length){return;}

		for (let i = 0; i < data.length; i++) {
			$(groupsSelect).append(
				"<option value=\"" + data[i].group + "\">" + data[i].group + "</option>"
			);
		}
		$(groupsSelect).val(data[0].group);
		createRecipesSelect();
	};

	getList(callback);
}


function deleteRecipe() {
	const group = $(groupsSelect).val();
	const recipeToDelete = $(recipesSelect).val();
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
			createRecipesSelect();
			console.log(data);
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(err);
		}
	});
}


$(document).ready(function (){

	if (window.location.pathname === "/dashboard.html") {
		window.onload = createGroupsSelect();
	}

	$(document).on("change", groupsSelect, createRecipesSelect);

	$(document).on("click", refreshBtn, createRecipesSelect);

	$(document).on("click", deleteBtn, function () {
		showAlert(CONFIRM_DELETE_ALERT, true);

		$(document).on("click", confirmBtn, function () {
			hideAlert();
			deleteRecipe();
		});

		$(document).on("click", declineBtn, hideAlert);
	});

});
