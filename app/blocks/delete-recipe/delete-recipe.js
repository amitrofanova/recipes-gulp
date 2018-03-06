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


function createRecipesSelect(group, recipesList) {
	$(recipesList).text("");

	const callback = function (data) {
		for (let i = 0; i < data.recipes.length; i++) {
			$(recipesList).append(
				"<option value=\"" + data.recipes[i] + "\">" + data.recipes[i] + "</option>"
			);
		}
	};

	getList(callback, group);
}


function createGroupsSelect(groupsList) {
	$(groupsList).append(
		"<option value=\"title\">title</option>"
	);

	const callback = function (data) {
		if (!data.length){return;}
		for (let i = 0; i < data.length; i++) {
			$(groupsList).append(
				"<option value=\"" + data[i].group + "\">" + data[i].group + "</option>"
			);
		}
	};

	getList(callback);
}


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
			createRecipesSelect(group, recipesSelect);
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
		window.onload = createGroupsSelect(groupsSelect);
	}

	$(document).on("change", groupsSelect, function () {
		const titleOption = groupsSelect + " option[value=\"title\"]";
		$(titleOption).remove();
		const currentGroup = $(groupsSelect).val();
		createRecipesSelect(currentGroup, recipesSelect);
	});

	$(document).on("click", refreshBtn, function () {
		const currentGroup = $(groupsSelect).val();
		createRecipesSelect(currentGroup, recipesSelect);
	});

	$(document).on("click", deleteBtn, function () {
		showAlert(CONFIRM_DELETE_ALERT, true);

		$(document).on("click", confirmBtn, function () {
			const group = $(groupsSelect).val();
			const recipeToDelete = $(recipesSelect).val();
			deleteRecipe(group, recipeToDelete);
			hideAlert();
		});

		$(document).on("click", declineBtn, hideAlert);
	});

});
