const BASE_URL = 'http://localhost:8080/debpay/';
const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
let searchObject = document.getElementById('search');
let id = sessionStorage.getItem('id');

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

function searchTodayOp() {
    ('#allOps')
    let body = {"id": id, "date": ''};
    
    fetch(BASE_URL + "", {
            mode: "cors",
            method: 'POST',
            body: JSON.stringify(body)
    }).then((response) => {
        if (response.status == HTTP_OK) {
            clearTable();
            response.json().then((json) => {
                filltable(json);
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function searchAllOp() {
    ('#allOps')
    let body = {"id": id};
    
    fetch(BASE_URL + "", {
        mode: "cors",
        method: 'POST',
        body: JSON.stringify(body)
    }).then((response) => {
        if (response.status == HTTP_OK) {
            clearTable();
            response.json().then((json) => {
                filltable(json);
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}