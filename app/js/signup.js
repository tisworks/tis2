const BASE_URL = 'http://localhost:8080/debpay/';
const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;

function signup() {
    let name = document.getElementById("signup-name-field").value;
    let email = document.getElementById("signup-email-field").value;
    let password = document.getElementById("signup-password-field").value;
    let body = {'name':name, 'login':email, 'password':password};

    fetch(BASE_URL + "user/", {
        mode: 'cors', 
        method: 'POST', 
        body: JSON.stringify(body)
    }).then(function(response){
        if(response.status == HTTP_OK){
            alert("Cadastro realizado com sucesso!");
            window.location.href="login.html";
        }else{
            alert("Erro ao realizar casdastro");
        }
    }).catch(function (e) {
        console.log("Fetch error: " + e);
    });
};