import $ from "jquery";
import {authHeader}from "../auth-form/auth-form.js";
// import {createLoader, destroyLoader}from "../loader/loader.js";
import {jsonPath}from "../../resources/paths/paths.js";


function toggleAddForm() {
	$(".add-recipe").toggle();
}


function toggleModifyForm() {
	$(".modify-recipe").toggle();
}


function toggleDeleteForm() {
	$(".delete-recipe").toggle();
}


function rotateToggler() {
	$(this).find(".dashboard__toggler").toggleClass("dashboard__toggler_active");
}


function deleteRoundCorners() {
	$(this).toggleClass("dashboard__section_active");
}


function getList(callback, group) {
	let url = jsonPath + "/api/groups/?short";

	if (group) {
		url = jsonPath + "/api/groups/" + encodeURIComponent(group) + "?short";
	}

	$.ajax({
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		success(data){
			callback(data);
		// },
		// beforeSend() {
		// 	if (!group) {createLoader();}
		// },
		// complete() {
		// 	destroyLoader();
		}
	});
}


export function createRecipesSelect(group, recipesList) {
	$(recipesList).text("");

	const callback = function (data) {
		for (let i = 0; i < data.recipes.length; i++) {
			$(recipesList).append(
				"<option value=\"" + data.recipes[i].id + "\">" + data.recipes[i].title + "</option>"
			);
		}
	};

	getList(callback, group);
}


// TODO: create custom method
function createGroupsSelect(groupsList1, groupsList2) {
	const callback = function (data) {
		if (!data.length){return;}

		let optionsString = "";
		for (let i = 0; i < data.length; i++) {
			optionsString += "<option value=\"" + data[i].group + "\">" + data[i].group + "</option>";
		}


		$(groupsList1).append(optionsString);
		$(groupsList2).append(optionsString);
	};

	getList(callback);
}


$(document).ready(function () {
	if (window.location.pathname === "/dashboard.html") {
		window.onload = createGroupsSelect(".delete-recipe__dish-group", ".modify-recipe__dish-group");
	}
	$(document).on("click", ".dashboard__add-recipe", toggleAddForm);
	$(document).on("click", ".dashboard__delete-recipe", toggleDeleteForm);
	$(document).on("click", ".dashboard__modify-recipe", toggleModifyForm);
	$(document).on("click", ".dashboard__section", rotateToggler);
	$(document).on("click", ".dashboard__section", deleteRoundCorners);
});
