const BASE_URL = 'http://localhost:8080/debpay';
const HTTP_OK = 200;
const HTTP_CREATE = 201;
const HTTP_UNAUTHORIZED = 401;
let searchObject = document.getElementById('search');
let id = sessionStorage.getItem('id');
let favouredId;


// --- Table Functions ---
function clearTable() {
    // TODO: clear header and title as well
    $("#tableTitle").html(" - ");
    $("#tableHeader tr").remove();
    $("#tableBody tr").remove();
}

function fillTableTodayOperations() {
    clearTable();
    const json = searchTodayOp();

    // This is ONLY for frontend tests! DO NOT REMOVE!
    // const json = [
    //     { type: "CREDIT", description: "Presente Felipe", value: "R$ 200,00", contactID: "123" },
    //     { type: "CREDIT", description: "Barzinho", value: "R$ 50,00", contactID: "123" },
    //     { type: "DEBIT", description: "Encomenda", value: "R$ 310,00", contactID: "123" },
    //     { type: "CREDIT", description: "Sanduiche", value: "R$ 19,99", contactID: "123" },
    //     { type: "DEBIT", description: "Cinema", value: "R$ 10,00", contactID: "123" },
    // ];

    // Table title
    $("#tableTitle").html("Operações do Dia " + getLocalDate());
    // Table Headers
    const tableHeaderData = ["Operação", "Valor", "Favorecido"];

    let rowHeader = "<tr>";
    tableHeaderData.forEach(h => {
        rowHeader += "<th>" + h + "</th>";
    });

    $("#tableHeader").html(rowHeader);

    // Table Body
    let data = '';
    json.forEach(r => {
        if (r.type === 'CREDIT') {
            data += 
                '<tr class="clickable-row">' +
                    '<td>' + r.description + '</td>' +
                    '<td class="wT-credit">+ R$ ' + r.value + '</td>' +
                    '<td>ID do contato:' + r.contactID + '</td>' +
                '</tr>';
        } else {
            data += 
                '<tr class="clickable-row">' +
                    '<td>' + r.description + '</td>' +
                    '<td class="wT-debit">- R$ ' + r.value + '</td>' +
                    '<td>ID do contato:' + r.contactID + '</td>' +
                '</tr>';
        }
    });

    $("#tableBody").html(data);
}

function fillTableAllOperations() {
    clearTable();
    const json = searchAllOp();

    // This is ONLY for frontend tests! DO NOT REMOVE!
    // const json = [
    //     { type: "CREDIT", description: "Presente Felipe", value: "R$ 200,00", dueDate: "06/04/2019" , contactID: "123" },
    //     { type: "CREDIT", description: "Barzinho", value: "R$ 50,00", dueDate: "11/10/2019", contactID: "123" },
    //     { type: "DEBIT", description: "Encomenda", value: "R$ 310,00", dueDate: "20/09/2019", contactID: "123" },
    //     { type: "CREDIT", description: "Sanduiche", value: "R$ 19,99", dueDate: "12/01/2020", contactID: "123" },
    //     { type: "DEBIT", description: "Cinema", value: "R$ 10,00", dueDate: "01/03/2020", contactID: "123" },
    // ];

    // Table title
    $("#tableTitle").html("Minhas Operações");
    // Table Headers
    const tableHeaderData = ["Operação", "Valor", "Data", "Favorecido"];

    let rowHeader = "<tr>";
    tableHeaderData.forEach(h => {
        rowHeader += "<th>" + h + "</th>";
    });
    
    $("#tableHeader").html(rowHeader);

    // Table Body
    let data = '';
    json.forEach(r => {
        if (r.type === 'CREDIT') {
            data += 
                '<tr class="clickable-row">' +
                    '<td>' + r.description + '</td>' +
                    '<td class="wT-credit">+ R$ ' + r.value + '</td>' +
                    '<td>' + r.dueDate + '</td>' +
                    '<td>ID do contato:' + r.contactID + '</td>' +
                '</tr>';
        } else {
            data += 
                '<tr class="clickable-row">' +
                    '<td>' + r.description + '</td>' +
                    '<td class="wT-debit">- R$ ' + r.value + '</td>' +
                    '<td>' + r.dueDate + '</td>' +
                    '<td>ID do contato:' + r.contactID + '</td>' +
                '</tr>';
        }
    });

    $("#tableBody").html(data);
}

function fillTableAllFavoured() {
    clearTable();
    const json = searchAllFav();

    // This is ONLY for frontend tests! DO NOT REMOVE!
    // const json = [
    //     { name: "Andrea", cpf: "01234567890", bankCode: "001", bankAgency: "1234", bankAccount: "0001-9" },
    //     { name: "Barbara", cpf: "12345678900", bankCode: "002", bankAgency: "1549", bankAccount: "0002-3" },
    //     { name: "Carla", cpf: "98765432100", bankCode: "033", bankAgency: "1752", bankAccount: "0003-6" },
    //     { name: "Débora", cpf: "65498732111", bankCode: "001", bankAgency: "1403", bankAccount: "0004-1" },
    //     { name: "Emily", cpf: "98732165499", bankCode: "010", bankAgency: "1461", bankAccount: "0001-5" },
    //     { name: "Flávia", cpf: "32198765466", bankCode: "023", bankAgency: "0001", bankAccount: "0001-4" },
    // ];

    // Table title
    $("#tableTitle").html("Meus Favorecidos");
    // Table Headers
    const tableHeaderData = ["Nome", "CPF", "Banco", "Agência/Conta"];

    let rowHeader = "<tr>";
    tableHeaderData.forEach(h => {
        rowHeader += "<th>" + h + "</th>";
    });
    
    $("#tableHeader").html(rowHeader);

    // Table Body
    let data = '';
    json.forEach(r => {
        data += 
            '<tr class="clickable-row">' + 
                '<td>' + r.name + '</td>' + 
                '<td>' + r.cpf + '</td>' + 
                '<td>' + r.bankCode + '</td>' + 
                '<td>' + r.bankAgency + ' / ' + r.bankAccount + '</td>' + 
            '</tr>';
    });

    $("#tableBody").html(data);
}


// --- Server Functions ---
function searchTodayOp() {
    return searchDayOp(getLocalDate());
}

function searchOp(description) {
    fetch(BASE_URL + "/operation?userID="+id+"&description="+description, {
            mode: "cors",
            method: 'GET'
    }).then((response) => {
        if (response.status == HTTP_OK) {
            response.json().then((json) => {
                return json;
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function searchDayOp(date) {
    fetch(BASE_URL + "/operation?userID="+id+"&due_date="+date, {
            mode: "cors",
            method: 'GET'
    }).then((response) => {
        if (response.status == HTTP_OK) {
            response.json().then((json) => {
                return json;
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function getLocalDate() {
    let date = new Date();
    date = date.toISOString();
    date = date.substring(0, date.search("T"));
    return date;
}

function searchAllOp() {
    ('#allOps')
    fetch(BASE_URL + "/operation?userID="+id, {
        mode: "cors",
        method: 'GET',
    }).then((response) => {
        if (response.status == HTTP_OK) {
            response.json().then((json) => {
                return json;
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function searchFav(contactId) {
    // TODO: fetch favoured with given contactID
    return null;
}

function searchAllFav() {
    // TODO: fetch all favoured of current user
    return null;
}


// --- Modal Functions ---
function closeModal(modalId) {
    $("#"+modalId).modal('close');
}

// -- Modal: Add Operation --
function listFavouredAddOperationModal(){
    let aux = "";

    fetch(BASE_URL + "/contact?userID="+id, {
        mode: "cors",
        method: 'GET',
    }).then((response) => {
        if (response.status == HTTP_OK) {
            deleteFavouredAddOperationModal();
            response.json().then((json) => {
                json.forEach(d => {
                  aux += "<a href='#!' id='"+d.id+"' onclick= 'setFavouredAddOperation(this)' class='collection-item'>"+d.name+"</a>";  
                });
                document.getElementById('favoured-collection').innerHTML = aux;
            });
        }
    }).catch((e) =>{
        console.log("Fetch error: "+ e);
    });
}

function deleteFavouredAddOperationModal() {
    document.getElementById('favoured-collection').innerHTML = '';
}

function setFavouredAddOperationModal(element) {
    let favElement = document.getElementById('favoured-collection').getElementsByTagName("a");
    favouredId = element.id;
    
    for (let index = 0; index < favElement.length; index++) {
        if (favElement[index].className == "collection-item active") {
            favElement[index].className = "collection-item";
        }   
    }
    
    element.className += " active";
}

function validateNewOperationFields(operation) {
    // TODO: validate fields!

    return {'success': true, 'message': 'Sucesso!'};
}

function addTransaction() {
    let description = $("#transaction-description-field");
    let dueDate = $("#transaction-due-date-field");
    let transactionTypeElements = $("transactionType");
    let installmentsNumber = 0; // = $("#instalments-field");
    let value = $("#transaction-value-field");
    
    let transactionType;
    transactionTypeElements.forEach((element) => {
        if (element.checked == true) {
            if (element.nextElementSibling.childNodes[0].data == "Crédito"){
                transactionType = 1;
            } else {
                transactionType = 2;
            }
        }
    });

    const body = {
        "description": description.val(),
        "dueDate": dueDate.val(),
        "operationType": transactionType,
        "contactID": favouredId, // Where are we retrieving this from??
        "userID": id,
        "installmentsLeft": installmentsNumber,
        "value": value.val()
    }

    validation = validateNewOperationFields(body);
    if(!validation.success){
        alert(validation.message);
        return;
    }

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

    fetch(BASE_URL + "/operation", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(body)
    }).then(function (response) {
        if (response.status == HTTP_CREATE) {
            $("#instalments-field").val("");
            $("#transaction-due-date-field").val("");
            $("#transaction-description-field").val("");
            $("#transaction-value-field").val("");            
            alert("Cadastro de operação realizado com sucesso!");
            $('#modalAddTransaction').modal('close');
            window.location.href = "login.html";
        } else {
            alert("Erro ao realizar casdastro");
        }
    }).catch(function (e) {
        console.log("Fetch error: " + e);
    });
}

// -- Modal: Add Favoured
function validateNewFavouredFields(favoured){
    if(favoured.name == null || favoured.name === '')
        return {'success': false, 'message': 'O campo "Nome" não foi preenchido corretamente'};

    if(favoured.cpf == null || favoured.cpf === '' || isNaN(favoured.cpf) || favoured.cpf.length != 11)
        return {'success': false, 'message': 'O campo "CPF" não foi preenchido corretamente'};

    if(favoured.bankCode == null || favoured.bankCode === '' || favoured.bankCode.length > 3)
        return {'success': false, 'message': 'O campo "Código Banco" não foi preenchido corretamente'};

    if(favoured.bankAgency == null || favoured.bankAgency === '' || favoured.bankAgency.length > 4)
        return {'success': false, 'message': 'O campo "Código Agência" não foi preenchido corretamente'};

    if(favoured.bankAccount == null || favoured.bankAccount === '')
        return {'success': false, 'message': 'O campo "Número Conta" não foi preenchido corretamente'};

    return {'success': true, 'message': 'Sucesso!'};
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

    var validation = validateNewFavouredFields({ body });
    if(!validation.success){
        alert(validation.message);
        return;
    }

    fetch(BASE_URL + "/contact", {
        mode: "cors",
        method: 'POST',
        body: JSON.stringify(body)
    }).then((response) => {
        if (response.status == HTTP_CREATE) {
            nameField.val('');
            cpfField.val('');
            bankCodeField.val('');
            bankAgencyField.val('');
            bankAccountField.val('');            
            alert('Contato salvo com sucesso!');
            closeModal("modalAddFavoured");
        }
    }).catch((e) =>{
        alert('Erro ao salvar contato.')
        console.log("Error: "+ e);
    });
}

// -- Modal: Operation Details
function populateOperationDetailsModal(opDescription) {
    const operation = searchOp(opDescription);
    const favoured = searchFav(operation.contactID).name;

    // This is ONLY for frontend tests! DO NOT REMOVE!
    // const operation = { type: "CREDIT", description: "Testing", dueDate: "11/11/2000", value: 25.46, contactID: "000" };
    // const favoured = "sljdsldj";
    
    let value = "";
    if (operation.type == "CREDIT") {
        value = "+ R$ " + operation.value;
        $("#opValue").removeClass("wT-debit");
        $("#opValue").addClass("wT-credit");
    } else {
        value = "- R$ " + operation.value;
        $("#opValue").removeClass("wT-credit");
        $("#opValue").addClass("wT-debit");
    }

    $("#opDescription").html(operation.description);
    $("#opFavoured").html(favoured);
    $("#opValue").html(value.replace(".", ","));
    $("#opDueDate").html(operation.dueDate);
}


// Instalments Functions (disabled)

// function enableInstalments() {
//     $('#instalments-options').removeClass("hidden");
// }

// function disableInstalments() {
//     $('#instalments-options').addClass("hidden");
// }
