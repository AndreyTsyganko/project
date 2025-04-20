
function showInputError(formElement, inputElement, errorMessage, settings) {
    const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
    inputElement.classList.add(settings.inputErrorClass);
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add(settings.errorClass);
    }
}

function hideInputError(formElement, inputElement, settings) {
    const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
    if (errorElement) {
        inputElement.classList.remove(settings.inputErrorClass);
        errorElement.classList.remove(settings.errorClass);
        errorElement.textContent = '';
    }
}

function isValidLink(link) {
    const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
    return urlRegex.test(link);
}

function checkInputValidity(formElement, inputElement, settings) {
    const isValid = inputElement.validity.valid;

    if (inputElement.name === 'title') {
        if (!isValid || inputElement.value.trim() === '') {
            showInputError(formElement, inputElement, 'Вы пропустили это поле.', settings);
            return;
        }
    }

    if (inputElement.name === 'link') {
        if (!isValidLink(inputElement.value)) {
            showInputError(formElement, inputElement, 'Введите адрес сайта.', settings);
            return;
        }
    }

    if (!isValid) {
        const errorMessage = inputElement.dataset.errorMessage || 'Некорректный ввод';
        showInputError(formElement, inputElement, errorMessage, settings);
    } else {
        hideInputError(formElement, inputElement, settings);
    }
}

function setEventListeners(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, settings);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, settings);
            toggleButtonState(inputList, buttonElement, settings);
        });
    });
}

function toggleButtonState(inputList, buttonElement, settings) {
    const hasInvalidInput = inputList.some((inputElement) => {
        return !inputElement.validity.valid || inputElement.value.trim() === '';
    });
    
    if (hasInvalidInput) {
        buttonElement.classList.add(settings.inactiveButtonClass);
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove(settings.inactiveButtonClass);
        buttonElement.disabled = false;
    }
}

function clearValidation(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, settings);
    });

    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
}

function enableValidation(settings) {
    const formList = Array.from(document.querySelectorAll(settings.formSelector));
    formList.forEach((formElement) => {
        setEventListeners(formElement, settings);
    });
}

export { enableValidation, clearValidation };




