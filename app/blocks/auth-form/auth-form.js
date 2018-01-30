import $ from 'jquery';

import {
	INVALID_EMAIL_ERR,
	SHORT_PWD_ERR,
	NOT_EQUAL_PWD_ERR,
	// INVALID_LOGIN_ERR,
	USER_REGISTERED_ALERT}from '../../resources/strings/ru.js';

import {showAlert}from '../modal-alert/modal-alert.js';

// const pathToUsersTable = '';
const CLASS_PREFIX = '.auth-form';
const activeTab = CLASS_PREFIX + '__tab_active', // eslint-disable-line one-var
	activeForm = CLASS_PREFIX + '__form_active',
	hiddenForm = CLASS_PREFIX + '__form_hidden',
	tabs = CLASS_PREFIX + '__tabs',
	tab = CLASS_PREFIX + '__tab',

	// loginUsername = CLASS_PREFIX + '__login-username',
	// loginPwd = CLASS_PREFIX + '__login-password',

	registerEmail = CLASS_PREFIX + '__register-email',
	registerUsername = CLASS_PREFIX + '__register-username',
	registerPwd = CLASS_PREFIX + '__register-password',
	registerConfirmPwd = CLASS_PREFIX + '__register-password-confirm',

	// loginForm = CLASS_PREFIX + '__login-form',
	registerForm = CLASS_PREFIX + '__register-form';


function toggleForm(evt) {
	evt.preventDefault();

	const clickedTab = $(this);
	const href = clickedTab.attr('href');
	const activeTabCls = activeTab.substr(1);
	const activeFormCls = activeForm.substr(1);
	const hiddenFormCls = hiddenForm.substr(1);

	$(activeTab).removeClass(activeTabCls);
	clickedTab.addClass(activeTabCls);

	$(activeForm).removeClass(activeFormCls).addClass(hiddenFormCls).hide();

	$(href).removeClass(hiddenFormCls).addClass(activeFormCls).hide().fadeIn(500);
}


function showError(errorText) {
	if ($('.auth-form__error').length) {
		$('.auth-form__error').text(errorText);
	}
	else {
		$(activeForm).append('<div class="auth-form__error">' + errorText + '</div>');
	}
}


function validateForm() {
	const email = $(registerEmail).val();
	const pwd = $(registerPwd).val();
	const confirmPwd = $(registerConfirmPwd).val();
	const MIN_PWD_LENGTH = 6;
	const emailPattern = /^[A-Za-z0-9._]+@[A-Za-z]*\.[A-Za-z]{2,5}$/;

	if (!emailPattern.test(email)) {
		showError(INVALID_EMAIL_ERR);
		return false;
	}

	if (pwd.length < MIN_PWD_LENGTH) {
		showError(SHORT_PWD_ERR);
		return false;
	}

	if (pwd !== confirmPwd) {
		showError(NOT_EQUAL_PWD_ERR);
		return false;
	}
	return true;
}


export function getUsernameFromStorage() {
	return username = localStorage.getItem('username');
}


export function getPasswordFromStorage() {
	return password = localStorage.getItem('password');
}


function getRegisterData() {
	const email = $(registerEmail).val();
	const username = $(registerUsername).val();
	const pwd = $(registerConfirmPwd).val();
	const registerData = {email, username, pwd};
	return registerData;
}


function sendRegisterData() {
	// $.ajax({
	// 	type: 'POST',
	// 	url: pathToUsersTable,
	// 	data: getRegisterData(),
	// 	success() {
	// 		console.log('success');
	// 	},
	// 	error() {
	// 		console.log('error');
	// 	}
	// });
}


function saveRegisterDataToStorage() {
	const data = getRegisterData();
	const username = data.username;
	const pwd = data.pwd;

	localStorage.setItem('username', username);
	localStorage.setItem('password', pwd);
}


function submitRegisterForm(evt) {
	const isValidForm = validateForm();
	if (isValidForm) {
		sendRegisterData();
		saveRegisterDataToStorage();
		window.location.pathname = '/home.html';
		showAlert(USER_REGISTERED_ALERT);
	}
	evt.preventDefault();
}


// function getLoginData() {
// 	const enteredUsername = $(loginUsername).val();
// 	const enteredPwd = $(loginPwd).val();
// 	const loginData = {enteredUsername, enteredPwd};
// 	return loginData;
// }
//
//
// function validateLoginData() {
// 	const data = getLoginData();
// 	const username = data.username;
// 	const pwd = data.pwd;
//
// 	$.ajax({
//
// 	})
//
// 	if ((dbUsername === username) && (dbPwd === pwd)) {
// 		window.location.pathname = '/home.html';
// 	}
// 	else {
// 		showError(INVALID_LOGIN_ERR);
// 	}
// }
//
//
// function submitLoginForm(evt) {
// 	validateLoginData();
// 	evt.preventDefault();
// }


(function () {
	function checkUserInStorage() {
		if ((localStorage.getItem('username')) && (localStorage.getItem('password'))) {
			return true;
		}
	}

	function checkUserOnPageLoad() {
		const isUserInStorage = checkUserInStorage();
		const currentPage = window.location.pathname;

		if ((isUserInStorage === true) && ((currentPage === '/index.html') || (currentPage === '/'))) {
			window.location.pathname = '/home.html';
		}
		else if ((isUserInStorage !== true) && (currentPage !== '/index.html')) {
			window.location.pathname = '/index.html';
		}
	}

	checkUserOnPageLoad();
})();


// TODO: function to add textContent to form elements


$(document).ready(function () {

	$(tabs).on('click', tab, toggleForm);
	// $(document).on('submit', loginForm, submitLoginForm);
	$(document).on('submit', registerForm, submitRegisterForm);

});
