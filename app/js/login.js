let url = 'http://localhost:8080/users/login';//olhar qual a url para passar para o backend, não sei se é esta mesmo

function onLogin() {
    let email = document.getElementById('login-email-field');
    let password = document.getElementById('login-password-field');
    let json = { "login": email, "password": password};
    let request = new Request(url);   
    
    request.method = 'POST';
    request.body = json;
    request.mode = 'cors';
    
    fetch(request).then((response) => {
        if (response.status == 200) {
            sessionStorage.setItem('id', this.getResponseHeader('id'));
            window.location.href = "main.html";
        }else if(response.status == 401){
            alert('E-mail ou senha inválido(s)');
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

