import $ from "jquery";
import {EMPTY_FIELD_ALERT, ADDED_RECIPE_ALERT,	ERROR_ALERT}from "../../resources/strings/ru.js";
import {showAlert}from "../modal-alert/modal-alert.js";
import {authHeader}from "../auth-form/auth-form.js";
import {createEditor, destroyEditor, resizeImage}from "../photo-editor/photo-editor.js";
import {createLoader, destroyLoader}from "../loader/loader.js";

const jsonPath = "https://amitrofanova.pythonanywhere.com/api/recipes/";

const NAMESPACE = "add-recipe";
const CLASS_PREFIX = ".add-recipe";
const formCls = CLASS_PREFIX, // eslint-disable-line one-var
	dishGroupInputCls = CLASS_PREFIX + "__dish-group",
	titleInputCls = CLASS_PREFIX + "__title-input",
	descriptionInputCls = CLASS_PREFIX + "__description-input",
	imagePreviewCls = CLASS_PREFIX + "__image-preview",
	imagePreviewMin = CLASS_PREFIX + "__image-preview-min",
	imagePreviewWrap = CLASS_PREFIX + "__image-preview-wrap",
	ingredientsCls = CLASS_PREFIX + "__ingredients",
	ingredientInputCls = CLASS_PREFIX + "__ingredient-input",
	newIngredientBtnCls = CLASS_PREFIX + "__new-ingredient-btn",
	stepsCls = CLASS_PREFIX + "__steps",
	stepInputCls = CLASS_PREFIX + "__step-input",
	newStepBtnCls = CLASS_PREFIX + "__new-step-btn",
	newItemCls = CLASS_PREFIX + "__new-item",
	deleteItemCls = CLASS_PREFIX + "__delete-item",
	resetBtnCls = CLASS_PREFIX + "__reset-btn",
	formInputs = CLASS_PREFIX + " :input";

// https://www.w3schools.com/jsref/prop_node_nodetype.asp
const TEXT_NODE_TYPE = 3;


export function resetInput(input) {
	$(input).val("");
	$(input).css("color", "#000");
}


export function appendItem(item, wrapper, nameSpace) {
	const newItemClass = nameSpace + "__new-item";
	const deleteItemClass = nameSpace + "__delete-item";
	const newEl =
		"<div class=\"" + newItemClass + "\">" + item +
			"<div class=\"" + deleteItemClass + "\"></div>" +
		"</div>";
	$(wrapper).append(newEl);
}


export function addItem(inputName, wrapper, nameSpace) {
	const newItem = $(inputName).val();

	if ((newItem !== "") && (newItem !== EMPTY_FIELD_ALERT)) {
		appendItem(newItem, wrapper, nameSpace);
		$(inputName).val("");
	}

	else {
		$(inputName).css("color", "#eee");
		$(inputName).val(EMPTY_FIELD_ALERT);
		setTimeout(resetInput, 1000, inputName);
	}
}


export function getIngredientsFromPage(nameSpace) {
	const ingredients = [];
	const ingredientsWrapper = "." + nameSpace + "__ingredients";
	const newItem = "." + nameSpace + "__new-item";
	let newIngredient;

	$(newItem).each(function () {
		if ($(this).parents(ingredientsWrapper).length) {

			newIngredient = $(this).contents().filter(function () {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();

			ingredients.push(newIngredient);
		}
	});

	return ingredients;
}


export function getStepsFromPage(nameSpace) {
	const steps = [];
	const stepsWrapper = "." + nameSpace + "__steps";
	const newItem = "." + nameSpace + "__new-item";
	let newStep;

	$(newItem).each(function () {
		if ($(this).parents(stepsWrapper).length) {

			newStep = $(this).contents().filter(function () {
				return this.nodeType === TEXT_NODE_TYPE;
			}).text();

			steps.push(newStep);
		}
	});

	return steps;
}


export function deleteItem() {
	let nameSpace = $(this).attr("class");
	if (nameSpace.indexOf("modify-recipe") > -1) {
		nameSpace = "modify-recipe";
	}
	else if (nameSpace.indexOf("add-recipe") > -1) {
		nameSpace = "add-recipe";
	}

	const wrapper = $(this).parents().eq(1).attr("class");
	const newItem = "." + nameSpace + "__new-item";
	let items;

	if (wrapper.indexOf("ingredients")) {
		items = getIngredientsFromPage(nameSpace);
	}
	else if (wrapper.indexOf("steps")) {
		items = getStepsFromPage(nameSpace);
	}

	const itemToDelete = items
		.indexOf($(this)
			.parent()
			.contents().not($(newItem).children())
			.text()
		);

	items.splice(itemToDelete, 1);

	$(this).parent().remove();
}


function createRecipe() {
	const nameSpace = NAMESPACE;
	const title = $(titleInputCls).val();
	const description = $(descriptionInputCls).val();
	const image_min = $(imagePreviewMin).attr("src");
	const image = $(imagePreviewCls).attr("src");
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


function saveRecipe(evt){
	const selectedGroup = dishGroupInputCls + " option:selected";
	const group = $(selectedGroup).text();
	$.ajax({
		type: "POST",
		url: jsonPath + "?group=" + encodeURIComponent(group),
		headers: {
			Authorization: authHeader()
		},
		dataType: "json",
		data: createRecipe(),
		success(){
			showAlert(ADDED_RECIPE_ALERT);
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(err);
			// showAlert(form, err);
		},
		beforeSend() {
			createLoader();
		},
		complete() {
			destroyLoader();
		}
	});

	window.onbeforeunload = null;
	evt.preventDefault();
}


export function resetForm() {
	$(formCls)[0].reset();
	$(dishGroupInputCls).css("color", "#757575");
	$(newItemCls).remove();
	$(deleteItemCls).remove();
	$(imagePreviewCls).attr("src", "");
	$(imagePreviewMin).attr("src", "");
	$(imagePreviewWrap).hide();
	$(".cropper-container").remove();
}


export function getCroppedImg(wrapper, preview, previewMin) {
	const img = $(".photo-editor__image-crop").attr("src");
	const imgMin = $(".photo-editor__image-crop-min")[0];
	const resizedImgMin = resizeImage(imgMin);

	if (wrapper !== null) {
		$(wrapper).css("display", "flex");
	}
	$(preview).attr("src", img);
	$(previewMin).attr("src", resizedImgMin);
	destroyEditor();
}


$(document).ready(function () {

	$(document).on("change", dishGroupInputCls, function () {
		// const titleOption = dishGroupInputCls + " option[value=\"title\"]";
		// $(titleOption).remove();
		$(dishGroupInputCls).css("color", "#000");
	});

	$(document).on("click", ".add-recipe__open-editor-btn", createEditor);
	$(document).on("click", ".photo-editor__submit-btn", function () {
		const wrapper = ".add-recipe__image-preview-wrap";
		const preview = ".add-recipe__image-preview";
		const previewMin = ".add-recipe__image-preview-min";
		if ($(this).parents(".add-recipe").length) {
			getCroppedImg(wrapper, preview, previewMin);
		}
	});

	$(document).on("click", newIngredientBtnCls, function () {
		addItem(ingredientInputCls, ingredientsCls, NAMESPACE);
	});

	$(document).on("click", newStepBtnCls, function () {
		addItem(stepInputCls, stepsCls, NAMESPACE);
	});

	$(document).on("click", deleteItemCls, deleteItem);
	$(document).on("submit", formCls, saveRecipe);
	$(document).on("click", resetBtnCls, resetForm);

	$(formInputs).change(function () {
		$(formCls).data("changed", true);
	});

	window.onbeforeunload = function () {
		if ((window.location.pathname === "/dashboard.html") && ($(formCls).data("changed") === true)) {
			return "Are you sure you want to leave this page? You can lose changes you have made.";
		}
	};

});
