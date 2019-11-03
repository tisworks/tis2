let searchObject = document.getElementById('search');
let id = sessionStorage.getItem('id');
let url='http://localhost:8080/debpay/'

function clearTable() {
    $("#tableBody tr").remove(); 
}
function filltable(json) {
    json.forEach(r => {
        const rowTable = tableBody.insertRow(-1);
        r.forEach(d => {
            var data = d;
            if (d === 'add') {
                data = '<i class="material-icons">add</i>';
            } else if (d === 'remove') {
                data = '<i class="material-icons">remove</i>';
            }
            rowTable.insertCell().innerHTML = data;
        });
    });
}

// esse aqui ta funfando só q tem q deixar o de baixo pra demonstração
/*function searchTodayOp() {
    ('#allOps')
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
}*/

function searchTodayOp() {
        clearTable();
        let json =  [
            ['Zé da feira','add','R$ 200,00','Zé'],
            ['Bolo no pote','add','R$ 50,00','Fernando'],
            ['Encomenda','remove','R$ 310,00','Carla'],
            ['Sanduiche','add','R$ 19,99','Douglas'],
            ['Cinema','remove','R$ 10,00','Elinton'],
            ['Roupas','add','R$ 203,05','Fernanda'],
            ['Venda Celular','add','R$ 1056,00','Gabriela'],
            ['Churrasco','remove','R$ 60,00','Henrique'],
            ['Livros','remove','R$ 134,80','Iara'],
            ['Estacionamento','add','R$ 150,80','João']
        ];
        filltable(json);
}

function searchAllOp() {
    ('#allOps')
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