import { deleteCard as apiDeleteCard } from './api.js';


export function createCard(cardData, userId, openDeleteConfirmationPopup, handleLike, openImagePopup, token) {
    const cardTemplate = document.querySelector('#card-template').content.cloneNode(true);
    const cardElement = cardTemplate.querySelector('.card');
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likesCountElement = cardElement.querySelector('.card__likes-count');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    setupDeleteButton(deleteButton, cardData, userId, openDeleteConfirmationPopup, cardElement);
    updateLikesCount(likesCountElement, cardData.likes);

    const userHasLiked = cardData.likes.some(like => like._id === userId);
    likeButton.classList.toggle('card__like-button_is-active', userHasLiked);

    cardImage.addEventListener('click', () => {
        openImagePopup(cardData.link, cardData.name);
    });

    likeButton.addEventListener('click', async () => {
        const liked = likeButton.classList.contains('card__like-button_is-active');
        try {
            const updatedCardData = await handleLike(cardData._id, liked);
            updateLikesCount(likesCountElement, updatedCardData.likes);
            likeButton.classList.toggle('card__like-button_is-active', !liked);
        } catch (error) {
            console.error('Ошибка при обновлении лайка:', error);
            alert('Не удалось обновить лайк. Попробуйте еще раз.');
        }
    });

    return cardElement;
}

function updateLikesCount(element, likes) {
    element.textContent = `${Array.isArray(likes) ? likes.length : 0}`;
}

document.getElementById('cardForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!userData || !userData.id) {
        alert('Ошибка: пользователь не определен.');
        return;
    }

    const userId = userData.id; 
    const cardName = document.getElementById('cardName').value; 
    const cardLink = document.getElementById('cardLink').value;

    try {
        const newCardData = await addCard(cardName, cardLink, token);
        console.log('Карточка добавлена:', newCardData);

        const cardData = {
            _id: newCardData._id,
            name: newCardData.name,
            link: newCardData.link,
            ownerId: newCardData.owner._id, 
            likes: newCardData.likes || []
        };

        const cardElement = createCard(cardData, userId, openDeleteConfirmationPopup, handleLike, openImagePopup, token);
        document.querySelector('.places__list').prepend(cardElement);
    } catch (error) {
        console.error('Ошибка при добавлении карточки:', error);
        alert('Не удалось добавить карточку. Попробуйте еще раз.');
    }
});



function setupDeleteButton(cardDeleteButton, cardData, userId, openDeleteConfirmationPopup, cardElement) {
    console.log('Настройка кнопки удаления для:', cardData);
    
    
    const isOwner = cardData.owner._id === userId; 
    console.log('isOwner:', isOwner);

    if (isOwner) {
        cardDeleteButton.style.display = 'block'; 
        cardDeleteButton.addEventListener('click', () => {
            openDeleteConfirmationPopup(cardData._id, cardElement); 
        });
    } else {
        cardDeleteButton.style.display = 'none'; 
    }   
}



export async function deleteCard(cardId, cardElement) {
    try {
        await apiDeleteCard(cardId); // Вызов API для удаления карточки
        cardElement.remove(); // Удаляем карточку из DOM
    } catch (error) {
        console.error('Ошибка при удалении карточки:', error);
        alert('Не удалось удалить карточку. Попробуйте еще раз.');
    }
}





























































