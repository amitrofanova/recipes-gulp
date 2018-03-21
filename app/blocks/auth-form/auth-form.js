import $ from "jquery";
import {
	SHORT_PWD_ERR,
	NOT_EQUAL_PWD_ERR,
	INVALID_LOGIN_ERR,
	USER_REGISTERED_ALERT,
	ERROR_ALERT}from "../../resources/strings/ru.js";
import {showAlert}from "../modal-alert/modal-alert.js";
import {jsonPath}from "../../resources/paths/paths.js";


const CLASS_PREFIX = ".auth-form";
const activeTab = CLASS_PREFIX + "__tab_active", // eslint-disable-line one-var
	activeForm = CLASS_PREFIX + "__form_active",
	hiddenForm = CLASS_PREFIX + "__form_hidden",
	tabs = CLASS_PREFIX + "__tabs",
	tab = CLASS_PREFIX + "__tab",

	loginUsername = CLASS_PREFIX + "__login-username",
	loginPwd = CLASS_PREFIX + "__login-password",

	// registerEmail = CLASS_PREFIX + '__register-email',
	registerUsername = CLASS_PREFIX + "__register-username",
	registerPwd = CLASS_PREFIX + "__register-password",
	registerConfirmPwd = CLASS_PREFIX + "__register-password-confirm",

	loginForm = CLASS_PREFIX + "__login-form",
	registerForm = CLASS_PREFIX + "__register-form";


function toggleForm(evt) {
	evt.preventDefault();

	const clickedTab = $(this);
	const href = clickedTab.attr("href");
	const activeTabCls = activeTab.substr(1);
	const activeFormCls = activeForm.substr(1);
	const hiddenFormCls = hiddenForm.substr(1);

	$(activeTab).removeClass(activeTabCls);
	clickedTab.addClass(activeTabCls);

	$(activeForm).removeClass(activeFormCls).addClass(hiddenFormCls).hide();

	$(href).removeClass(hiddenFormCls).addClass(activeFormCls).hide().fadeIn(500);
}


function showFormError(errorText) {
	if ($(".auth-form__error").length) {
		$(".auth-form__error").text(errorText);
	}
	else {
		$(activeForm).append("<div class=\"auth-form__error\">" + errorText + "</div>");
	}
}


function validateForm() {
	// const email = $(registerEmail).val();
	const pwd = $(registerPwd).val();
	const confirmPwd = $(registerConfirmPwd).val();
	const MIN_PWD_LENGTH = 6;
	// const emailPattern = /^[A-Za-z0-9._]+@[A-Za-z]*\.[A-Za-z]{2,5}$/;

	// if (!emailPattern.test(email)) {
	// 	showFormError(INVALID_EMAIL_ERR);
	// 	return false;
	// }

	if (pwd.length < MIN_PWD_LENGTH) {
		showFormError(SHORT_PWD_ERR);
		return false;
	}

	if (pwd !== confirmPwd) {
		showFormError(NOT_EQUAL_PWD_ERR);
		return false;
	}
	return true;
}


export function authHeader() {
	return "Basic " + btoa( localStorage.getItem("username") + ":" + localStorage.getItem("password"));
}


function getRegisterData() {
	// const email = $(registerEmail).val();
	const user_name = $(registerUsername).val();
	const password = $(registerConfirmPwd).val();
	const registerData = {user_name, password};
	return JSON.stringify(registerData, null, "\t");
}


function sendRegisterData() {
	const dataToSave = JSON.parse(getRegisterData());
	$.ajax({
		type: "POST",
		url: jsonPath + "/api/users/",
		dataType: "json",
		data: getRegisterData(),
		success() {
			showAlert(USER_REGISTERED_ALERT);
			localStorage.setItem("username", dataToSave.user_name);
			localStorage.setItem("password", dataToSave.password);
			window.location.pathname = "/home.html";
		},
		error(xhr) {
			const err = ERROR_ALERT + xhr.responseText;
			showAlert(err);
		}
	});
}


function submitRegisterForm(evt) {
	const isValidForm = validateForm();
	if (isValidForm) {
		sendRegisterData();
	}
	evt.preventDefault();
}


function getLoginData() {
	const user_name = $(loginUsername).val();
	const password = $(loginPwd).val();
	const loginData = {user_name, password};
	return loginData;
}


function validateLoginData() {
	const data = getLoginData();
	const username = data.user_name;
	const password = data.password;

	$.ajax({
		url: jsonPath + "/api/users/",
		headers: {
			Authorization: "Basic " + btoa( username + ":" + password)
		},
		success() {
			localStorage.setItem("username", username);
			localStorage.setItem("password", password);
			window.location.pathname = "/home.html";
		},
		error() {
			showFormError(INVALID_LOGIN_ERR);
		}
	});
}


function submitLoginForm(evt) {
	validateLoginData();
	evt.preventDefault();
}


(function () {
	function checkUserInStorage() {
		if ((localStorage.getItem("username")) && (localStorage.getItem("password"))) {
			return true;
		}
	}

	function checkUserOnPageLoad() {
		const isUserInStorage = checkUserInStorage();
		const currentPage = window.location.pathname;

		if ((isUserInStorage === true) && ((currentPage === "/index.html") || (currentPage === "/"))) {
			window.location.pathname = "/home.html";
		}
		else if ((isUserInStorage !== true) && (currentPage !== "/index.html")) {
			window.location.pathname = "/index.html";
		}
	}

	checkUserOnPageLoad();
})();


// TODO: function to add textContent to form elements


$(document).ready(function () {

	$(tabs).on("click", tab, toggleForm);
	$(document).on("submit", registerForm, submitRegisterForm);
	$(document).on("submit", loginForm, submitLoginForm);

});
