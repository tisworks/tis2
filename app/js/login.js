let url;

function authenticateUser(email, password) {
    let token = email + ":" + password;

    return btoa(token);
}

function onLogin() {
    let email = document.getElementById('login-email-field');
    let password = document.getElementById('login-password-field');
    let header = new Headers();
    let request; 
    let init; 
    
    header.append('Authorization', authenticateUser(email, password));
    init = { 
        method: 'GET',
        headers: header,
        mode: 'cors',
        cache: 'default' 
    };

    request = new Request(url, init);   
    
    fetch(request).then((response) => {
        if (response.status !== 200) {
            //erro ao logar
        }else{
            sessionStorage.setItem('id', this.getResponseHeader('id'));
            window.location.href = "";
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

