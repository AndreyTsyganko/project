// Ваш токен доступа (если требуется)
const accessToken = '509901a2-0efe-40c3-a9de-cb93689924a1';

// Конечный пункт API для получения информации о пользователе
const apiEndpoint = 'https://nomoreparties.co/v1/wff-cohort-27/user/me'; // Замените на нужный URL

// Функция для получения ID пользователя
async function getUserId() {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Если требуется токен
                'Content-Type': 'application/json'
            }
        });

        // Проверка, успешен ли запрос
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        
        // Предполагаем, что ID пользователя находится в поле 'id'
        const userId = data.id; // Замените 'id' на актуальное поле из ответа
        console.log(`Ваш ID: ${userId}`);
    } catch (error) {
        console.error('Ошибка при получении ID пользователя:', error);
    }
}

// Вызов функции
getUserId();
