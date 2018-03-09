import $ from "jquery";
import {CONFIRM_MODIFY_ALERT, MODIFIED_RECIPE_ALERT, ERROR_ALERT, EMPTY_INGREDIENT_ALERT}from "../../resources/strings/ru.js";
import {showAlert, hideAlert}from "../modal-alert/modal-alert.js";
import {authHeader}from "../auth-form/auth-form.js";
import {createEditor}from "../photo-editor/photo-editor.js";
import {createLoader, destroyLoader}from "../loader/loader.js";
import {createRecipesSelect}from "../delete-recipe/delete-recipe.js";
import {appendItem, getCroppedImg}from "../add-recipe/add-recipe.js";

const pathToJson = "https://amitrofanova.pythonanywhere.com/api/";

const NAMESPACE = "modify-recipe";
const CLASS_PREFIX = ".modify-recipe";
const groupsSelect = CLASS_PREFIX + "__dish-group", // eslint-disable-line one-var
	recipesSelect = CLASS_PREFIX + "__recipe-to-modify",
	modifyBtn = CLASS_PREFIX + "__modify-btn",
	submitBtn = CLASS_PREFIX + "__submit-btn",
	confirmBtn = ".modal-alert__confirm-btn",
	newItem = CLASS_PREFIX + "__new-item";

// https://www.w3schools.com/jsref/prop_node_nodetype.asp
const TEXT_NODE_TYPE = 3;


function getCurrentData(recipeToModify) {
	const result = null;
	const url = pathToJson + "recipes/" + encodeURIComponent(recipeToModify);
	const imgSrc = pathToJson + "image/";
	const imgMinSrc = pathToJson + "image/";

	const showCurrentData = function (recipe) {

		$(".modify-recipe__title-input").val(recipe.title);
		$(".modify-recipe__description-input").val(recipe.description);
		$(".modify-recipe__image-preview").attr("src", imgSrc + recipe.image_hash);
		$(".modify-recipe__image-preview-min").attr("src", imgMinSrc + recipe.image_min_hash);

		for (let i = 0; i < recipe.components.length; i++) {
			const ingredient = recipe.components[i];
			appendItem(ingredient, ".modify-recipe__ingredients", NAMESPACE);
		}

		for (let i = 0; i < recipe.steps.length; i++) {
			const step = recipe.steps[i];
			appendItem(step, ".modify-recipe__steps", NAMESPACE);
		}

	};

	$.ajax({
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		success(data){
			showCurrentData(data);
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(err);
		}
	});
	return result;
}


function getIngredientsFromPage() {
	const ingredients = [];
	let newIngredient;

	$(newItem).each(function () {
		if ($(this).parents(".modify-recipe__ingredients").length) {

			newIngredient = $(this).contents().filter(function () {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();
			ingredients.push(newIngredient);
		}
	});
	return ingredients;
}


function getStepsFromPage() {
	const steps = [];
	let newStep;

	$(newItem).each(function () {
		if ($(this).parents(".modify-recipe__steps").length) {

			newStep = $(this).contents().filter(function () {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();

			steps.push(newStep);
		}
	});

	return steps;
}


function addIngredient() {
	const ingredient = $(".modify-recipe__ingredient-input").val();

	if ((ingredient !== "") && (ingredient !== EMPTY_INGREDIENT_ALERT)) {
		appendItem(ingredient, ".modify-recipe__ingredients", NAMESPACE);
		$(".modify-recipe__ingredient-input").val("");
	}

	else {
		$(".modify-recipe__ingredient-input").val(EMPTY_INGREDIENT_ALERT);
		$(".modify-recipe__ingredient-input").css("color", "#fff");
	}
}


function addStep() {
	const step = $(".modify-recipe__step-input").val();

	if (step !== "") {
		appendItem(step, ".modify-recipe__steps", NAMESPACE);
		$(".modify-recipe__step-input").val("");
	}
}


function deleteItem() {
	const ingredients = getIngredientsFromPage();
	const steps = getStepsFromPage();
	let itemToDelete;

	// Define if current section related to ingredients or steps
	if ($(this).parents(".modify-recipe__ingredients").length) {

		itemToDelete = ingredients
			.indexOf($(this)
				.parent()
				.contents().not($(newItem).children())
				.text()
			);

		ingredients.splice(itemToDelete, 1);
	}

	else if ($(this).parents(".modify-recipe__steps").length) {

		itemToDelete = steps
			.indexOf($(this)
				.parent()
				.contents().not($(newItem).children())
				.text()
			);

		steps.splice(itemToDelete, 1);
	}

	$(this).parent().remove();
}


function getNewData() {
	const title = $(".modify-recipe__title-input").val();
	const description = $(".modify-recipe__description-input").val();
	const image_min = $(".modify-recipe__image-preview-min").attr("src");
	const image = $(".modify-recipe__image-preview").attr("src");
	const newRecipe = {
		title,
		description,
		image_min,
		image,
		components: getIngredientsFromPage(),
		steps: getStepsFromPage()
	};
	const newRecipeToJSON = JSON.stringify(newRecipe, null, "\t");
	return newRecipeToJSON;
}


function resetForm() {
	$(".modify-recipe")[0].reset();
	$(".modify-recipe__new-item").remove();
	$(".modify-recipe__delete-item").remove();
	$(".modify-recipe__image-preview").attr("src", "");
	$(".modify-recipe__image-preview-min").attr("src", "");
}


function saveRecipe() {
	const group = $(".modify-recipe__dish-group").val();
	const url = pathToJson + "recipes/" + "?group=" + encodeURIComponent(group);

	$.ajax({
		type: "POST",
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		data: getNewData(),
		success(){
			showAlert(MODIFIED_RECIPE_ALERT);
			resetForm();
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			console.log(err);
		},
		beforeSend() {
			createLoader();
		},
		complete() {
			destroyLoader();
		}
	});
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
			console.log(data);
			createRecipesSelect(group, recipesSelect);
			saveRecipe();
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			console.log(err);
		}
	});
}


$(document).ready(function (){

	$(document).on("change", groupsSelect, function () {
		const titleOption = groupsSelect + " option[value=\"title\"]";
		$(titleOption).remove();
		const currentGroup = $(groupsSelect).val();
		createRecipesSelect(currentGroup, recipesSelect);
	});

	$(document).on("click", modifyBtn, function () {
		const recipeToModify = $(recipesSelect).val();
		getCurrentData(recipeToModify);
	});

	$(document).on("click", ".modify-recipe__open-editor-btn", createEditor);
	$(document).on("click", ".photo-editor__submit-btn", function () {
		const preview = ".modify-recipe__image-preview";
		const previewMin = ".modify-recipe__image-preview-min";
		if ($(this).parents(".modify-recipe").length) {
			getCroppedImg(null, preview, previewMin);
		}
	});

	$(document).on("click", ".modify-recipe__new-ingredient-btn", addIngredient);
	$(document).on("click", ".modify-recipe__new-step-btn", addStep);
	$(document).on("click", ".modify-recipe__delete-item", deleteItem);

	$(document).on("click", submitBtn, function () {
		showAlert(CONFIRM_MODIFY_ALERT, true);

		$(document).on("click", confirmBtn, function () {
			const group = $(".modify-recipe__dish-group").val();
			const recipeToModify = $(".modify-recipe__recipe-to-modify").val();
			deleteRecipe(group, recipeToModify);
			hideAlert();
		});
	});

});
