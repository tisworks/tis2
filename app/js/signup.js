const BASE_URL = 'http://localhost:8080/debpay/';
const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;

function signup() {
    let name = document.getElementById("signup-name-field").value;
    let email = document.getElementById("signup-email-field").value;
    let password = document.getElementById("signup-password-field").value;
    let body = {'name':name, 'login':email, 'password':password};

    if(validateCredentials(body)){
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
    }
};

function validateCredentials(body){
    if(!body.name || !body.login || !body.password){    
        return false;
    }
    if(body.password.length < 5){
        alert('Informe uma senha com pelo menos 5 dígitos!');
        return false;
    }

    return true;
}

function redirectToLogin(){
    window.location.href = "login.html";
}