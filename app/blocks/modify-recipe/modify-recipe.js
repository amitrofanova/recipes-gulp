import $ from "jquery";
import {CONFIRM_MODIFY_ALERT, MODIFIED_RECIPE_ALERT, ERROR_ALERT}from "../../resources/strings/ru.js";
import {showAlert, hideAlert}from "../modal-alert/modal-alert.js";
import {authHeader}from "../auth-form/auth-form.js";
import {createEditor}from "../photo-editor/photo-editor.js";
import {createLoader, destroyLoader}from "../loader/loader.js";
import {createRecipesSelect}from "../dashboard/dashboard.js";
import {appendItem, addItem, deleteItem, getIngredientsFromPage, getStepsFromPage, getCroppedImg}from "../add-recipe/add-recipe.js";

const pathToJson = "https://amitrofanova.pythonanywhere.com/api/";

const NAMESPACE = "modify-recipe";
const CLASS_PREFIX = ".modify-recipe";
const groupsSelect = CLASS_PREFIX + "__dish-group", // eslint-disable-line one-var
	recipesSelect = CLASS_PREFIX + "__recipe-to-modify",
	// ingredientsCls = CLASS_PREFIX + "__ingredients",
	// ingredientInputCls = CLASS_PREFIX + "__ingredient-input",
	// stepsCls = CLASS_PREFIX + "__steps",
	// stepInputCls = CLASS_PREFIX + "__step-input",
	newIngredientBtnCls = CLASS_PREFIX + "__new-ingredient-btn",
	newStepBtnCls = CLASS_PREFIX + "__new-step-btn",
	startModifyBtn = CLASS_PREFIX + "__modify-btn",
	submitBtn = CLASS_PREFIX + "__submit-btn",
	resetBtn = CLASS_PREFIX + "__reset-btn",
	confirmBtn = ".modal-alert__confirm-btn";

const alertName = "confirmation-before-modify";


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
			appendItem(ingredient, ".modify-recipe__ingredients", "modify-recipe");
		}

		for (let i = 0; i < recipe.steps.length; i++) {
			const step = recipe.steps[i];
			appendItem(step, ".modify-recipe__steps", "modify-recipe");
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


function getNewData() {
	const nameSpace = NAMESPACE;
	const title = $(".modify-recipe__title-input").val();
	const description = $(".modify-recipe__description-input").val();
	const image_min = $(".modify-recipe__image-preview-min").attr("src");
	const image = $(".modify-recipe__image-preview").attr("src");
	const newRecipe = {
		title,
		description,
		image_min,
		image,
		components: getIngredientsFromPage(nameSpace),
		steps: getStepsFromPage(nameSpace)
	};
	const newRecipeToJSON = JSON.stringify(newRecipe, null, "\t");
	return newRecipeToJSON;
}


function saveChanges() {
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
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			console.log(err);
		},
		beforeSend() {
			createLoader("Пожалуйста подождите, изменения сохраняются");
		},
		complete() {
			destroyLoader();
		}
	});
}


function deleteCurrentRecipe(group, recipeToModify) {
	const url = pathToJson + "recipes/" + encodeURIComponent(recipeToModify) + "?group=" + encodeURIComponent(group);

	$.ajax({
		type: "DELETE",
		url,
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		success(data){
			console.log(data);
			saveChanges();
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			console.log(err);
		}
	});
}


function resetForm() {
	$(".modify-recipe__new-item").remove();
	$(".modify-recipe__delete-item").remove();
	$(".modify-recipe__image-preview").attr("src", "");
	$(".modify-recipe__image-preview-min").attr("src", "");
	$(".cropper-container").remove();
}


$(document).ready(function (){

	$(document).on("change", groupsSelect, function () {
		const currentGroup = $(groupsSelect).val();
		$(this).find(".titleOption").remove();
		$(recipesSelect).prop("disabled", false);
		$(startModifyBtn).prop("disabled", false);
		createRecipesSelect(currentGroup, recipesSelect);
	});



	$(document).on("click", startModifyBtn, function () {
		$(".modify-recipe__modify-area").show();
		const recipeToModify = $(recipesSelect).val();
		resetForm();
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

	$(document).on("click", newIngredientBtnCls, function () {
		addItem(".modify-recipe__ingredient-input", ".modify-recipe__ingredients", "modify-recipe");
	});

	$(document).on("click", newStepBtnCls, function () {
		addItem(".modify-recipe__step-input", ".modify-recipe__steps", "modify-recipe");
	});

	$(document).on("click", ".modify-recipe__delete-item", deleteItem);

	$(document).on("click", resetBtn, function () {
		const recipeToModify = $(recipesSelect).val();
		resetForm();
		getCurrentData(recipeToModify);
	});

	$(document).on("click", submitBtn, function () {
		showAlert(CONFIRM_MODIFY_ALERT, true, alertName);
	});

	$(document).on("click", confirmBtn, function () {
		const alertClsName = "." + alertName;
		if (!($(confirmBtn).parents(alertClsName).length)) {return;}
		const group = $(".modify-recipe__dish-group").val();
		const recipeToModify = $(".modify-recipe__recipe-to-modify").val();
		deleteCurrentRecipe(group, recipeToModify);
		hideAlert();
	});

});
