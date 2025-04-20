import { createCard } from './card.js';
import { openDeleteConfirmationPopup } from './modal.js';
import { openImagePopup } from './index.js'; 



export const config = {
    baseUrl: 'https://nomoreparties.co/v1/wff-cohort-27',
    headers: {
        authorization: '6f22b822-dfb9-40ad-b637-de0e6b51535e',
        'Content-Type': 'application/json'
    }
};

fetch("https://nomoreparties.co/v1/wff-cohort-27/users/me", {
    headers: {
    authorization: '3461580abf9f7b907f743f4e'
    }
    })
    .then(res => res.json())
    .then((result) => {
    console.log(result);
    });



    async function initializeApp() {
        const cards = await fetchCards();
        cards.forEach(card => {
            createCard(card); 
        });
    }
    
    document.addEventListener('DOMContentLoaded', initializeApp);
    
    const handleResponse = async (res) => {
        if (res.ok) {
            return res.json();
        }
        const errorMessage = await res.text();
        return Promise.reject(`Ошибка: ${res.status} ${errorMessage}`);
    };
    
    const saveToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };
    
    const loadFromLocalStorage = (key) => {
        return JSON.parse(localStorage.getItem(key));
    };
    
    const fetchWithHandling = async (url, options) => {
        const res = await fetch(url, options);
        return handleResponse(res);
    };
    
    export const getUserInfo = async () => {
        const cachedUserInfo = loadFromLocalStorage('userInfo');
        
        if (cachedUserInfo) {
            return cachedUserInfo;
        }
        
        const userInfo = await fetchWithHandling(`${config.baseUrl}/users/me`, {
            headers: config.headers
        });
        saveToLocalStorage('userInfo', userInfo);
        
        return userInfo;
    };
    
    export const editProfile = async (name, about) => {
        const cachedUserInfo = loadFromLocalStorage('userInfo');
        const userId = cachedUserInfo ? cachedUserInfo._id : null;
    
        if (!userId) {
            throw new Error('Не удалось получить ID пользователя');
        }
    
        const userInfo = await fetchWithHandling(`${config.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: config.headers,
            body: JSON.stringify({ name, about, _id: userId })
        });
        saveToLocalStorage('userInfo', userInfo);
        
        return userInfo;
    };
    
    export const getInitialCards = async () => {
        return await fetchWithHandling(`${config.baseUrl}/cards`, {
            headers: config.headers
        });
    };
    
    export const addCard = async (name, link) => {
        const newCard = await fetchWithHandling(`${config.baseUrl}/cards`, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({ name, link })
        });
        saveToLocalStorage('cards', newCard);
        return newCard;
    };
    
    export const fetchUserDataAndCards = async () => {
        try {
            const userInfo = await getUserInfo();
            const cards = await getInitialCards();
            return { userInfo, cards };
        } catch (error) {
            console.error('Ошибка при получении данных пользователя и карточек:', error);
            alert('Не удалось загрузить данные пользователя и карточек. Пожалуйста, попробуйте позже.');
            throw error;
        }
    };
    
    export const updateAvatar = async (avatarUrl) => {
        const userInfo = await fetchWithHandling(`${config.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: config.headers,
            body: JSON.stringify({ avatar: avatarUrl })
        });
        saveToLocalStorage('userInfo', userInfo);
        
        return userInfo;
    };
    
    export const deleteCard = async (cardId) => {
        const res = await fetchWithHandling(`${config.baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: config.headers
        });
        return res;
    };
    
    export async function handleLike(cardId, isLiked) {
        if (!cardId) {
            throw new Error('cardId не может быть пустым или undefined');
        }
    
        const method = isLiked ? 'DELETE' : 'PUT';
        const response = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
            method: method,
            headers: config.headers
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Ошибка ${response.status}: ${errorData.message || 'Неизвестная ошибка при обновлении лайка для карточки с id: ' + cardId}`);
        }
    
        return response.json();
    }


























