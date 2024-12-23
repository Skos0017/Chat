//----------------------------main_page_script-------------------------------------//

document.getElementById('logoutButton').addEventListener('click', function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки

    fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Убедитесь, что куки отправляются с запросом
    })
    .then(response => {
        return response.json().then((answer) => {
            return {
                status: response.status,
                message: answer.message
            };
        });
    })
    .then(data => {
        console.log(data);
        if (data.status === 200) {
            window.location.href = 'http://localhost:3000/login'; // Перенаправление на страницу входа
        } else {
            showMessage(data.status, data.message);
        }
    })
    .catch(error => {
        showMessage(500, 'Произошла ошибка при выходе'); // Отображаем общую ошибку
        console.error('Error:', error);
    });
});

function showMessage(status, message) {
    const notifier = document.getElementById('errorMessage');

    if (status === 200) {
        notifier.style.backgroundColor = 'green';
    } else {
        notifier.style.backgroundColor = 'red';
    }

    notifier.textContent = message;
    notifier.style.display = 'block';
    setTimeout(() => {
        notifier.style.display = 'none';
    }, 3000);
}





//----------------------------END-main_page_script---------------------------------//