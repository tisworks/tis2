const BASE_URL = 'http://localhost:8080/debpay';
const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
let searchObject = document.getElementById('search');
let id = sessionStorage.getItem('id');
let favouredId;

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
    let body = {"date": getLocalDate()};
    
    fetch(BASE_URL + "/oparation?userID="+id, {
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
    
    fetch(BASE_URL + "/operation?userID="+id, {
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
    $('#instalments-options').removeClass("hidden");
}

function disableInstalments() {
    $('#instalments-options').addClass("hidden");
}

function addTransaction() {
    let transactionTypeElements = document.getElementsByName("transactionType");
    let transactionType;
    let installmentsNumber = document.getElementById("instalments-field").value;
    let dueDate = document.getElementById("transaction-due-date-field").value;
    let description = document.getElementById("transaction-description-field").value;
    let value = document.getElementById("transaction-value-field").value;
    let body;

    transactionTypeElements.forEach((element) => {
        if (element.checked == true) {
            if(element.nextElementSibling.childNodes[0].data == "Crédito"){
                transactionType = 1;
            }else {
                transactionType = 2;
            }
        }
    });

    if(dueDate.substring(0, 3) == "Fev"){
        dueDate.replace("Fev", "Feb");
    } else if (dueDate.substring(0, 3) == "Abr") {
        dueDate.replace("Abr", "Apr");
    } else if (dueDate.substring(0, 3) == "Mai") {
        dueDate.replace("Mai", "May");
    } else if (dueDate.substring(0, 3) == "Set") {
        dueDate.replace("Set", "Sep");
    } else if (dueDate.substring(0, 3) == "Out") {
        dueDate.replace("Out", "Oct");
    } else if (dueDate.substring(0, 3) == "Dez") {
        dueDate.replace("Dez", "Dec");
    }

    dueDate = dueDate.replace(",", "");

    dueDate = new Date(dueDate);
    dueDate = dueDate.toISOString();
    dueDate = dueDate.substring(0, dueDate.search("T"));

    body = {
        "description": description,
        "dueDate": dueDate,
        "operationType": transactionType,
        "contactID": favouredId,
        "userID": id,
        "installmentsLeft": installmentsNumber,
        "value": value
    }

    fetch(BASE_URL + "/operation", {
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
    favouredId = element.id;
    
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

function closeAddContactModal(){
    $('#modalAddFavoured').modal('close');
}

function addFavoured() {
    var nameField = $('#favoured-name-field');
    var cpfField = $('#favoured-cpf-field');
    var bankCodeField = $('#favoured-bank-code-field');
    var bankAgencyField = $('#favoured-bank-agency-field');
    var bankAccountField = $('#favoured-bank-account-field');

    let body = {
        'userID': id,
        'name': nameField.val(),
        'cpf': cpfField.val(),
        'bankCode': bankCodeField.val(),
        'bankAgency': bankAgencyField.val(),
        'bankAccount': bankAccountField.val()
    };

    var validation = validateNewFavouredFields(body.name, body.cpf, body.bankCode, body.bankAgency, body.bankAccount);
    if(!validation.success){
        alert(validation.message);
        return;
    }

    fetch(BASE_URL + "/contact", {
        mode: "cors",
        method: 'POST',
        body: JSON.stringify(body)
    }).then((response) => {
        if (response.status == HTTP_OK) {
            nameField.val('');
            cpfField.val('');
            bankCodeField.val('');
            bankAgencyField.val('');
            bankAccountField.val('');            
            alert('Contato salvo com sucesso!');
            closeAddContactModal();
        }
    }).catch((e) =>{
        alert('Erro ao salvar contato.')
        console.log("Error: "+ e);
    });
}

function validateNewFavouredFields(name, cpf, bankCode, bankAgency, bankAccount){
    
    if(name == null || name === '')
        return {'success': false, 'message': 'O campo "Nome" não foi preenchido corretamente'};

    if(cpf == null || cpf === '' || isNaN(cpf) || cpf.length != 11)
        return {'success': false, 'message': 'O campo "CPF" não foi preenchido corretamente'};

    if(bankCode == null || bankCode === '' || bankCode.length > 3)
        return {'success': false, 'message': 'O campo "Código Banco" não foi preenchido corretamente'};

    if(bankAgency == null || bankAgency === '' || bankAgency.length > 4)
        return {'success': false, 'message': 'O campo "Código Agência" não foi preenchido corretamente'};

    if(bankAccount == null || bankAccount === '')
        return {'success': false, 'message': 'O campo "Número Conta" não foi preenchido corretamente'};

    return {'success': true, 'message': 'Sucesso!'};
}

function listFavoured(){
    let favElement = document.getElementById('favoured-collection').innerHTML;
    let aux = "";

    fetch(BASE_URL + "/contact?userID="+id, {
        mode: "cors",
        method: 'GET',
    }).then((response) => {
        if (response.status == HTTP_OK) {
            deleteFavoured();
            response.json().then((json) => {
                json.forEach(d => {
                  aux += "<a href='#!' id='"+d.id+"' onclick= 'setFavoured(this)' class='collection-item'>"+d.name+"</a>";  
                });
                favElement = aux;
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function deleteFavoured() {
    document.getElementById('favoured-collection').innerHTML = '';
}
function getLocalDate() {
    let date = new Date();
    date = date.toISOString();
    date = date.substring(0, date.search("T"));
    return date;
}

