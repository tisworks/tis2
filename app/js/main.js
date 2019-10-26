let searchObject = document.getElementById('search');
let id = sessionStorage.getItem('id');
let url; //olhar qual a url para passar para o backend

function clearTable(params) {//(já coloquei ela lá nas duas funções)
    //apaga as APENAS as linhas (NÃO as colunos) da tabela, usar somente nas funções searchTodatOp e searchAllOp
}
function filltable(json) {
    json.forEach(element => {//(já coloquei ela lá nas duas funções)
         //cria a linha referente ao element do json de acordo com a tabela da main op|tipo|valor|fav
    });
}

function searchTodayOp() {
    let json = {"id": id, "date": ""};
    let request = new Request(url);   
    
    request.method = 'GET';
    request.body = json;
    request.mode = 'cors';
    
    fetch(request).then((response) => {
        if (response.status == 200) {
            clearTable();
            return response.json();
        }
    }).then((json) => {
        filltable(json);
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function searchAllOp() {
    let json = {"id": id};
    let request = new Request(url);   
    
    request.method = 'GET';
    request.body = json;
    request.mode = 'cors';
    
    fetch(request).then((response) => {
        if (response.status == 200) {
            clearTable();
            return response.json();
        }
    }).then((json) => {
        filltable(json);
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}