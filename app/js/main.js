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
    let body = {"date": ''};
    
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
    $('#instalments-options').removeClass("hidden");
}

function disableInstalments() {
    $('#instalments-options').addClass("hidden");
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

function closeAddContactModal(){
    $('#modalAddFavoured').modal('close');
}

function addFavoured() {
    var nameField = $('#favoured-name-field');
    var cpfField = $('#favoured-cpf-field');
    var bankCodeField = $('#favoured-bank-code-field');
    var agencyCodeField = $('#favoured-bank-agency-field');
    var bankAccountField = $('#favoured-bank-account-field');

    let body = {
        'id': id,
        'name': nameField.val(),
        'cpf': cpfField.val(),
        'bankCode': bankCodeField.val(),
        'agencyCode': agencyCodeField.val(),
        'bankAccount': bankAccountField.val()
    };

    var validation = validateNewFavouredFields(body.name, body.cpf, body.bankCode, body.agencyCode, body.bankAccount);
    if(!validation.success){
        alert(validation.message);
        return;
    }

    fetch(BASE_URL + "contact", {
        mode: "cors",
        method: 'POST',
        body: JSON.stringify(body)
    }).then((response) => {
        if (response.status == HTTP_OK) {
            nameField.val('');
            cpfField.val('');
            bankCodeField.val('');
            agencyCodeField.val('');
            bankAccountField.val('');            
            alert('Contato salvo com sucesso!');
            closeAddContactModal();
        }
    }).catch((e) =>{
        alert('Erro ao salvar contato.')
        console.log("Error: "+ e);
    });
}

function validateNewFavouredFields(name, cpf, bankCode, agencyCode, bankAccount){
    
    if(name == null || name === '')
        return {'success': false, 'message': 'O campo "Nome" não foi preenchido corretamente'};

    if(cpf == null || cpf === '' || isNaN(cpf) || cpf.length != 11)
        return {'success': false, 'message': 'O campo "CPF" não foi preenchido corretamente'};

    if(bankCode == null || bankCode === '' || bankCode.length > 3)
        return {'success': false, 'message': 'O campo "Código Banco" não foi preenchido corretamente'};

    if(agencyCode == null || agencyCode === '' || agencyCode.length > 4)
        return {'success': false, 'message': 'O campo "Código Agência" não foi preenchido corretamente'};

    if(bankAccount == null || bankAccount === '')
        return {'success': false, 'message': 'O campo "Número Conta" não foi preenchido corretamente'};

    return {'success': true, 'message': 'Sucesso!'};
}
