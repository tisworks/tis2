const BASE_URL = 'http://localhost:8080/debpay/';
const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;

function onLogin() {
    let email = document.getElementById('login-email-field').value;
    let password = document.getElementById('login-password-field').value;
    let body = { "login": email, "password": password};
    
    fetch(BASE_URL + "user/login",{
        mode:"cors",
        method: 'POST',
        body: JSON.stringify(body)
    }).then((response) => {
        if (response.status == HTTP_OK) {
            response.json().then((data) => {
                sessionStorage.setItem('id', data)
            });

            window.location.href = "main.html";
        }else if(response.status == HTTP_UNAUTHORIZED){
            // TODO create a better solution. Maybe modals ?
            alert('E-mail ou senha inválido(s)');
        } // TODO treat server errors
    }).catch((e) => {
        console.log("Fetch error: " + e);
    });
}

