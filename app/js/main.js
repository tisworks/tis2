const BASE_URL = 'http://localhost:8080/debpay/';
const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
let searchObject = document.getElementById('search');
let id = sessionStorage.getItem('id');
let favoured;

function clearTable() {
    $("#tableBody tr").remove(); 
}

function filltableOp(json) {
    clearTable();

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
    let body = {"date": };
    
    fetch(BASE_URL + "/oparation?id="+id, {
            mode: "cors",
            method: 'GET',
            body: JSON.stringify(body)
    }).then((response) => {
        if (response.status == HTTP_OK) {
            response.json().then((json) => {
                filltableOp(json);
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function searchAllOp() {
    ('#allOps')
    
    fetch(BASE_URL + "/operation?id="+id, {
        mode: "cors",
        method: 'GET',
    }).then((response) => {
        if (response.status == HTTP_OK) {
            response.json().then((json) => {
                filltableOp(json);
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function enableInstalments() {
    $('#instalments-field').removeAttr("disabled");
}

function disableInstalments() {
    $('#instalments-field').attr("disabled", "disabled");
}

function addTransaction() {
    let transactionTypeElements = document.getElementsByName("transactionType");
    let transactionType;
    let transactionInstallmentElements = document.getElementsByName("transactionInstalment");
    let transactionInstallment;
    let installmentsNumber = document.getElementById("instalments-field").value;
    let dueDate = document.getElementById("dueDate").value;
    let body;

    transactionTypeElements.forEach((element) => {
        if (element.checked == true) {
            if(element.nextElementSibling.childNodes[0].data == "Crédito"){
                transactionType = "credit";
            }else {
                transactionType = "debit";
            }
        }
    });

    transactionInstallmentElements.forEach((element) => {
        if (element.checked == true) {
            if (element.nextElementSibling.childNodes[0].data == "À Vista") {
                transactionInstallment = "inCash";
            } else {
                transactionInstallment = "installment";
            }
        }
    });

    body = {
        "favoured": favoured,
        "transactionType": transactionType,
        "transactionInstallment": transactionInstallment,
        "installmentsNumber": installmentsNumber,
        "dueDate": dueDate
    }

    fetch(BASE_URL + "/operation?id="+id, {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(body)
    }).then(function (response) {
        if (response.status == HTTP_OK) {
            alert("Cadastro de operação realizado com sucesso!");
            window.location.href = "login.html";
        } else {
            alert("Erro ao realizar casdastro");
        }
    }).catch(function (e) {
        console.log("Fetch error: " + e);
    });
}

function setFavoured(element) {
    let favElement = document.getElementById('favoured-collection').getElementsByTagName("a");
    favoured = element.innerHTML;
    
    for (let index = 0; index < favElement.length; index++) {
        if (favElement[index].className == "collection-item active") {
            favElement[index].className = "collection-item";
        }   
    }
    
    element.className += " active";
}

function closeAddTransactionModal() {
    $("#modalAddTransaction").modal('close');
}

function addFavoured() {
    // get field values
    // clean fields
    // check all fields
    // add favoured
}
