import $ from 'jquery';
import {INVALID_EMAIL_ERR, SHORT_PWD_ERR, NOT_EQUAL_PWD_ERR}from '../../resources/strings/ru.js';

// const pathToUsersTable = '';
const CLASS_PREFIX = '.auth-form';
const activeTab = CLASS_PREFIX + '__tab_active', // eslint-disable-line one-var
	activeForm = CLASS_PREFIX + '__form_active',
	hiddenForm = CLASS_PREFIX + '__form_hidden',
	tabs = CLASS_PREFIX + '__tabs',
	tab = CLASS_PREFIX + '__tab',

	loginUsername = CLASS_PREFIX + '__login-username',
	loginPwd = CLASS_PREFIX + '__login-password',
	// loginSubmit = CLASS_PREFIX + '__login-submit',

	registerEmail = CLASS_PREFIX + '__register-email',
	registerUsername = CLASS_PREFIX + '__register-username',
	registerPwd = CLASS_PREFIX + '__register-password',
	registerConfirmPwd = CLASS_PREFIX + '__register-password-confirm',
	// registerSubmit = CLASS_PREFIX + '__register-submit',

	loginForm = CLASS_PREFIX + '__login-form',
	registerForm = CLASS_PREFIX + '__register-form';


function toggleForm(evt) {
	evt.preventDefault();

	const tab = $(this);
	const href = tab.attr('href');
	const activeTabCls = activeTab.substr(1);
	const activeFormCls = activeForm.substr(1);
	const hiddenFormCls = hiddenForm.substr(1);

	$(activeTab).removeClass(activeTabCls);
	tab.addClass(activeTabCls);

	$(activeForm).removeClass(activeFormCls).addClass(hiddenFormCls).hide();

	$(href).removeClass(hiddenFormCls).addClass(activeFormCls).hide().fadeIn(500);
}


function showError(errorText) {
	$('.auth-form__error').remove();
	$(activeForm).append('<div class="auth-form__error">' + errorText + '</div>');
}


function validateForm() {
	const email = $(registerEmail).val();
	const pwd = $(registerPwd).val();
	const confirmPwd = $(registerConfirmPwd).val();
	const MIN_PWD_LENGTH = 6;
	const emailPattern = /^[A-Za-z0-9._]*@[A-Za-z]*\.[A-Za-z]{2,5}$/;

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


function getLoginData() {
	const username = $(loginUsername).val();
	const pwd = $(loginPwd).val();
	const loginData = {username, pwd};
	return loginData;
}


function getRegisterData() {
	const email = $(registerEmail).val();
	const username = $(registerUsername).val();
	const pwd = $(registerConfirmPwd).val();
	const registerData = {email, username, pwd};
	return registerData;
}


function login() {
	checkAgainstStorage();
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


function saveToLocalStorage() {
	const data = getRegisterData();
	const username = data.username;
	const pwd = data.pwd;

	localStorage.setItem('username', username);
	localStorage.setItem('password', pwd);
}


function checkAgainstStorage() {
	const storedUsername = localStorage.getItem('username');
	const storedPwd = localStorage.getItem('password');

	const enteredUsername = $(loginUsername).val();
	const enteredPwd = $(loginPwd).val();

	if ((storedUsername === enteredUsername) && (storedPwd === enteredPwd)) {
		window.location.pathname = '/home.html';
		//here we need to start session
	}
}


// TODO: function to add textContent to form elements


$(document).ready(function () {

	$(tabs).on('click', tab, toggleForm);

	$(document).on('submit', loginForm, function(evt) {
		login();
		evt.preventDefault();
	});

	$(document).on('submit', registerForm, function (evt) {
		const isValidForm = validateForm();
		if (isValidForm) {
			sendRegisterData();
			saveToLocalStorage();
		}
		evt.preventDefault();
	});

});
