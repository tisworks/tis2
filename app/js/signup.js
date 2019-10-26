let url;
    function signup() {
        let name = document.getElementById("signup-name-field");
        let email = document.getElementById("signup-email-field");
        let password = document.getElementById("signup-password-field");
        let header = new Headers();
        let request = new request(url);
        let json = {'name':name,'email':email,'password':password};
        header.append('Content-Type', 'text', json); 
        
        request.method = 'POST';
        request.headers = header;
        request.mode = 'cors';
        request.cache = 'default';

        fetch(request).then(function(response){
            if(response.status == 200){
                alert("Cadastro realizado com sucesso!");
                window.location.href="login.html";
            }else{
                alert("Erro ao realizar casdastro");
            }
        }).catch(function (e) {
            console.log("Fetch error: " + e);
        });
    };