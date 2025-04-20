import '../src/pages/index.css';
import { createCard, deleteCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getInitialCards, addCard, editProfile, updateAvatar, handleLike } from './api.js';

const userId = '3461580abf9f7b907f743f4e';
const token = '6f22b822-dfb9-40ad-b637-de0e6b51535e';

const placesList = document.querySelector(".places__list");
const editPopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const newPlaceForm = document.querySelector('.popup__form[name="new-place"]');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const nameInput = document.querySelector('.popup__input_type_name');
const aboutInput = document.querySelector('.popup__input_type_description');

const placeNameInput = document.querySelector('.popup__input_type_card-name');
const placeLinkInput = document.querySelector('.popup__input_type_url');

const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const imagePopup = document.querySelector('.popup_type_image');

const changeAvatarPopup = document.getElementById('changeAvatarPopup');
const closeChangeAvatarPopupButton = document.getElementById('closeChangeAvatarPopup');
const changeAvatarForm = document.getElementById('changeAvatarForm');
const userAvatar = document.getElementById('userAvatar');

const editIcon = document.querySelector('.profile__edit-icon');

editIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    openModal(changeAvatarPopup);
});

closeChangeAvatarPopupButton.addEventListener('click', () => closeModal(changeAvatarPopup));

userAvatar.addEventListener('click', () => openModal(changeAvatarPopup));

function toggleButtonState(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Сохранение...' : 'Сохранить';
}

changeAvatarForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const avatarLink = document.getElementById('avatarLink').value;
    const submitButton = changeAvatarForm.querySelector('.popup__button');

    toggleButtonState(submitButton, true);

    try {
        const updatedAvatar = await updateAvatar(avatarLink);
        userAvatar.src = updatedAvatar.avatar; 
        closeModal(changeAvatarPopup);
    } catch (error) {
        console.error('Ошибка при обновлении аватара:', error);
    } finally {
        toggleButtonState(submitButton, false);
    }
});

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

const nameRegex = /^[а-яА-ЯёЁa-zA-Z0-9\- ]{2,40}$/;
const aboutRegex = /^[а-яА-ЯёЁa-zA-Z0-9\- ]{2,200}$/;
const placeNameRegex = /^[а-яА-ЯёЁa-zA-Z0-9\- ]{2,30}$/;
const urlRegex = /^(https?:\/\/[^\s]+)/;

function validateField(input) {
    const value = input.value.trim();
    let errorMessage = '';

    if (!value) {
        errorMessage = 'Это поле обязательно для заполнения.';
    } else if (input === nameInput && !nameRegex.test(value)) {
        errorMessage = 'Имя должно содержать от 2 до 40 символов и может включать только буквы, пробелы и дефисы.';
    } else if (input === aboutInput && !aboutRegex.test(value)) {
        errorMessage = 'О себе должно содержать от 2 до 200 символов и может включать только буквы, пробелы и дефисы.';
    } else if (input === placeNameInput && !placeNameRegex.test(value)) {
        errorMessage = 'Название должно содержать от 2 до 30 символов и может включать только буквы, пробелы и дефисы.';
    } else if (input === placeLinkInput && !urlRegex.test(value)) {
        errorMessage = 'Введите корректный URL.';
    }

    if (errorMessage) {
        showError(input, errorMessage);
        return false;
    } else {
        hideError(input);
        return true;
    }
}

function showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    errorElement.classList.add(validationConfig.errorClass);
}

function hideError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    errorElement.classList.remove(validationConfig.errorClass);
}

function toggleSubmitButton(form) {
    const inputs = Array.from(form.querySelectorAll(validationConfig.inputSelector));
    const isValid = inputs.every(input => validateField(input));
    
    const submitButton = form.querySelector(validationConfig.submitButtonSelector);
    submitButton.disabled = !isValid;
}

nameInput.addEventListener('input', () => toggleSubmitButton(profileForm));
aboutInput.addEventListener('input', () => toggleSubmitButton(profileForm));
placeNameInput.addEventListener('input', () => toggleSubmitButton(newPlaceForm));
placeLinkInput.addEventListener('input', () => toggleSubmitButton(newPlaceForm));

function renderCard(cardData) {
    const cardElement = createCard(cardData, userId, deleteCard, handleLike, openImagePopup, token);
    placesList.prepend(cardElement);
}

getInitialCards()
    .then((cards) => {
        cards.forEach(renderCard);
    })
    .catch((err) => {
        console.error('Ошибка при получении карточек:', err);
    });

editButton.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    aboutInput.value = profileDescription.textContent;

    clearValidation(profileForm, validationConfig);
    hideError(nameInput);
    hideError(aboutInput);
    toggleSubmitButton(profileForm);
    openModal(editPopup);
});

addButton.addEventListener('click', () => {
    newPlaceForm.reset();
    clearValidation(newPlaceForm, validationConfig);
    toggleSubmitButton(newPlaceForm);
    openModal(newCardPopup);
});

profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = profileForm.querySelector('.popup__button');
    toggleButtonState(submitButton, true);

    try {
        const updatedProfile = await editProfile(nameInput.value, aboutInput.value);
        profileTitle.textContent = updatedProfile.name;
        profileDescription.textContent = updatedProfile.about;
        closeModal(editPopup);
    } catch (error) {
        console.error('Ошибка при редактировании профиля:', error);
    } finally {
        toggleButtonState(submitButton, false);
    }
});

newPlaceForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const placeName = placeNameInput.value;
    const placeLink = placeLinkInput.value;
    const submitButton = newPlaceForm.querySelector('.popup__button');

    toggleButtonState(submitButton, true);

    try {
        const newCardData = await addCard(placeName, placeLink, token);
        renderCard(newCardData);
        closeModal(newCardPopup);
        newPlaceForm.reset();
        toggleSubmitButton(newPlaceForm);
    } catch (error) {
        console.error('Ошибка при добавлении карточки:', error);
    } finally {
        toggleButtonState(submitButton, false);
    }
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup'); 
        closeModal(popup);
    });
});

export function openImagePopup(imageUrl) {
    const popup = document.getElementById('imagePopup');
    const imageElement = popup.querySelector('img');
    imageElement.src = imageUrl;
    openModal(popup);
}

enableValidation(validationConfig);

