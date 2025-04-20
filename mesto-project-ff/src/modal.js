
export function openModal(popup) {
    if (popup) {
        popup.classList.add('popup_is-opened');
        document.addEventListener('keydown', handleEscape);
        popup.addEventListener('mousedown', handlePopupClick);
    } else {
        console.error('Popup element not found');
    }
}

export function closeModal(popup) {
    if (popup) {
        popup.classList.remove('popup_is-opened');
        document.removeEventListener('keydown', handleEscape);
        popup.removeEventListener('mousedown', handlePopupClick);
    } else {
        console.error('Popup element not found');
    }
}

export function openDeleteConfirmationPopup(cardId, cardElement) {
    const popup = document.querySelector('#confirmationPopup');
    const confirmButton = popup.querySelector('.card__delete-button');

    confirmButton.onclick = () => {
        deleteCard(cardId)
            .then(() => {
                cardElement.remove();
                closeDeleteConfirmationPopup();
            })
            .catch(error => {
                console.error('Ошибка при удалении карточки:', error);
            });
    };

    openModal(popup);
}


export function closeDeleteConfirmationPopup() {
    const popup = document.querySelector('#confirmationPopup');
    closeModal(popup);
}



function handleEscape(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        const openModal = document.querySelector('.popup_is-opened');
        if (openModal) {
            closeModal(openModal);
        }
    }
}

function handlePopupClick(event) {
    if (event.target.classList.contains('popup')) {
        closeModal(event.currentTarget);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.card__delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const cardElement = event.target.closest('.card-template');
            const cardId = cardElement.dataset.cardId; 
            openDeleteConfirmationPopup(cardId, cardElement);
        });
    });
});



















