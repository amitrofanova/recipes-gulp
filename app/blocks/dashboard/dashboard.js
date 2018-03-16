import $ from "jquery";
import {authHeader}from "../auth-form/auth-form.js";
// import {createLoader, destroyLoader}from "../loader/loader.js";


const pathToJson = "https://amitrofanova.pythonanywhere.com/api/";


function showAddForm() {
	$(".add-recipe").toggle();
}


function showModifyForm() {
	$(".modify-recipe").toggle();
}


function showDeleteForm() {
	$(".delete-recipe").toggle();
}


function rotateToggler() {
	$(this).find(".dashboard__toggler").toggleClass("dashboard__toggler_active");
}


function deleteRoundCorners() {
	$(this).toggleClass("dashboard__section_active");
}


function getList(callback, group) {
	let url = pathToJson + "groups/?short";

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
	$(document).on("click", ".dashboard__add-recipe", showAddForm);
	$(document).on("click", ".dashboard__delete-recipe", showDeleteForm);
	$(document).on("click", ".dashboard__modify-recipe", showModifyForm);
	$(document).on("click", ".dashboard__section", rotateToggler);
	$(document).on("click", ".dashboard__section", deleteRoundCorners);
});
