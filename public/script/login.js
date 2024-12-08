//---------------------------------GENERAL-----------------------------------------//

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                login: login,
                password: password
            }
        })
    })
        .then(response => {
            return new Promise((resolve, reject) => {
                response.json()
                    .then((answer) => {
                        resolve({
                            status: response.status,
                            message: answer.message
                        })
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        })
        .then(data => {
            console.log(data);
            if (data.status === 201) {
                window.location.href = 'http://localhost:3000/'
            } else {
                showMessage(data.status, data.message);
            }
        })
        .catch(error => {
            showMessage(data.status, data.message);
            console.error('Error:', error);
        });
});

function showMessage(status, message) {
    const notifier = document.getElementById('errorMessage');

    if (status === 201) {
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





//----------------------------main_page_script-------------------------------------//







//----------------------------END-main_page_script---------------------------------//









//------------------------------main_entrance----------------------------------------//


//------------------------------END-entrance-----------------------------------------//
