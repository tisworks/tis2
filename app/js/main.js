const BASE_URL = 'http://localhost:8080/debpay';
const HTTP_OK = 200;
const HTTP_CREATE = 201;
const HTTP_UNAUTHORIZED = 401;
let searchObject = document.getElementById('search');
let id = sessionStorage.getItem('id');
let favouredId;

// Context Variables
let selectedTransactionId = "";
let selectedFavouredId = "";

// --- Helper Functions ---
function getLocalDate() {
    let date = new Date();
    date = date.toISOString();
    date = date.substring(0, date.search("T"));
    return date;
}

function formatDate(date){
    let formatedDate = date.split('-');
    return formatedDate[2] + '/' + formatedDate[1] + '/' + formatedDate[0];
}

function formatCurrency(value) {
    let formatedValue = value.toString().replace(".", ",");

    if (formatedValue.indexOf(",") == -1) {
        formatedValue += ",00";
    }

    return formatedValue;
}

// --- Table Functions ---
function clearTable() {
    $("#tableTitle").html(" - ");
    $("#tableHeader tr").remove();
    $("#tableBody tr").remove();
    $("#tableWarning").html("");
}

function updateOnClickRowFunctions() {
    $(".clickable-row-transaction").click(function() {
        populateTransactionDetailsModal($(this).context);
        $("#modalTransactionDetails").modal('open');
    });
    $(".clickable-row-favoured").click(function() {
        populateFavouredDetailsModal($(this).context);
        $("#modalFavouredDetails").modal('open');
    });
}

function fillTableDayOperations(date) {
    clearTable();
    searchSelectedDayOp(date).then((json) => {
        // Table Title
        $("#tableTitle").html("Operações do Dia " + formatDate(date));
        // Table Headers
        const tableHeaderData = ["Operação", "Valor", "Favorecido"];

        let rowHeader = "<tr>";
        tableHeaderData.forEach(h => {
            rowHeader += "<th>" + h + "</th>";
        });

        $("#tableHeader").html(rowHeader);

        // Table Body
        let data = '';

        if (json != null && json.length > 0) {
            json.forEach(r => {
                if (r.type === 'CREDIT') {
                    data += 
                        '<tr class="clickable-row-transaction" id="'+ r.id +'">' +
                            '<td>' + r.description + '</td>' +
                            '<td class="wT-credit">+ R$ ' + formatCurrency(r.value) + '</td>' +
                            '<td id="' + r.favouredId + '">' + r.favoured + '</td>' +
                        '</tr>';
                } else {
                    data += 
                        '<tr class="clickable-row-transaction" id="'+ r.id +'">' +
                            '<td>' + r.description + '</td>' +
                            '<td class="wT-debit">- R$ ' + formatCurrency(r.value) + '</td>' +
                            '<td id="' + r.favouredId + '">' + r.favoured + '</td>' +
                        '</tr>';
                }
            });
        } else {
            $("#tableWarning").html("Nenhuma operação cadastrada para este dia");
        }

        $("#tableBody").html(data);

        updateOnClickRowFunctions();
    });
}

function fillTableAllOperations() {
    clearTable();
    searchAllOp().then((json) => {
        // Table Title
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
    
        if (json != null) {
            json.forEach(r => {
                if (r.type === 'CREDIT') {
                    data += 
                        '<tr class="clickable-row-transaction" id="'+ r.id +'">' +
                            '<td>' + r.description + '</td>' +
                            '<td class="wT-credit">+ R$ ' + formatCurrency(r.value) + '</td>' +
                            '<td>' + r.dueDate + '</td>' +
                            '<td id="' + r.favouredId + '">' + r.favoured + '</td>' +
                        '</tr>';
                } else {
                    data += 
                        '<tr class="clickable-row-transaction" id="'+ r.id +'">' +
                            '<td>' + r.description + '</td>' +
                            '<td class="wT-debit">- R$ ' + formatCurrency(r.value) + '</td>' +
                            '<td>' + r.dueDate + '</td>' +
                            '<td id="' + r.favouredId + '">' + r.favoured + '</td>' +
                        '</tr>';
                }
            });
        } else {
            $("#tableWarning").html("Nenhuma operação cadastrada");
        }
    
        $("#tableBody").html(data);
    
        updateOnClickRowFunctions();
    });

}

function fillTableAllFavoured() {
    clearTable();
    searchAllFav().then((json) => {
        // Table Title
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
    
        if (json != null) {
            json.forEach(r => {
                data += 
                    '<tr class="clickable-row-favoured" id="'+ r.id +'">' + 
                        '<td>' + r.name + '</td>' + 
                        '<td>' + r.cpf + '</td>' + 
                        '<td>' + r.bankCode + '</td>' + 
                        '<td>' + r.bankAgency + ' / ' + r.bankAccount + '</td>' + 
                    '</tr>';
            });
        } else {
            $("#tableWarning").html("Nenhum favorecido cadastrado");
        }
    
        $("#tableBody").html(data);
    
        updateOnClickRowFunctions();
    });

}


// --- Server Functions ---
async function searchSelectedDayOp(date) {
    let data = await searchDayOp(date);
    return data;
}

async function searchOp(operationId) {
    // TODO: the following 2 lines should be called in case fetch fails. They mock the data.
    // console.log("Loading mocked data...");
    // return mockTransaction(operationId);
    
    let operationsResponse = await fetch(BASE_URL + "/operation?userID="+id+"&id="+operationId, {
        mode: "cors",
        method: 'GET'
    });

    if(operationsResponse.status != HTTP_OK) {
        return null;
    }

    let operationsData = await operationsResponse.json();

    if(operationsData.length < 1) {
        return null;
    }
    
    // Retrieve favoured's name
    let contactsData = await searchAllFav();
    
    // Format final response
    let transactionList = new Array();
    operationsData.forEach(o => {
        var name = '';
        contactsData.forEach(c => {
            if(c.id === o.contactID){
                name = c.name;
            }
        })

        if(o.id == operationId){
            transactionList.push({
                "id": o.id,
                "type": o.type,
                "description": o.description,
                "value": o.value,
                "dueDate": o.dueDate,
                "favouredId": o.contactID,
                "favoured": name,
                "installmentsLeft": o.installmentsLeft,
                "userID": o.userID,
            });
        }
    });

    return transactionList[0];
}

async function searchDayOp(date) {
    // TODO: the following 2 lines should be called in case fetch fails. They mock the data.
    // console.log("Loading mocked data...");
    // return mockDayTransactions(date);

    let operationsResponse = await fetch(BASE_URL + "/operation?userID="+id+"&due_date="+date, {
        mode: "cors",
        method: 'GET'
    });

    if(operationsResponse.status != HTTP_OK) {
        return null;
    }

    let operationsData = await operationsResponse.json();

    if(operationsData.length < 1) {
        return null;
    }
    
    // Retrieve favoured's name
    let contactsData = await searchAllFav();
    
    // Format final response
    let transactionList = new Array();
    operationsData.forEach(o => {
        var name = '';
        contactsData.forEach(c => {
            if(c.id === o.contactID){
                name = c.name;
            }
        })

        transactionList.push({
            "id": o.id,
            "type": o.type,
            "description": o.description,
            "value": o.value,
            "dueDate": o.dueDate,
            "favouredId": o.contactID,
            "favoured": name,
            "installmentsLeft": o.installmentsLeft,
            "userID": o.userID,
        });
    });

    return transactionList;
}

async function searchAllOp() {
    // TODO: the following 2 lines should be called in case fetch fails. They mock the data.
    // console.log("Loading mocked data...");
    // return mockAllTransactions();

    let operationsResponse = await fetch(BASE_URL + "/operation?userID="+id, {
        mode: "cors",
        method: 'GET'
    });

    if(operationsResponse.status != HTTP_OK) {
        return null;
    }

    let operationsData = await operationsResponse.json();

    if(operationsData.length < 1) {
        return null;
    }
    
    // Retrieve favoured's name
    let contactsData = await searchAllFav();
    
    // Format final response
    let transactionList = new Array();
    operationsData.forEach(o => {
        var name = '';
        contactsData.forEach(c => {
            if(c.id === o.contactID){
                name = c.name;
            }
        })

        transactionList.push({
            "id": o.id,
            "type": o.type,
            "description": o.description,
            "value": o.value,
            "dueDate": o.dueDate,
            "favouredId": o.contactID,
            "favoured": name,
            "installmentsLeft": o.installmentsLeft,
            "userID": o.userID,
        });
    });

    return transactionList;
}

async function searchFav(favouredId) {
    // TODO: the following 2 lines should be called in case fetch fails. They mock the data.
    // console.log("Loading mocked data...");
    // return mockFavoured(favouredId);

    let contactResponse = await fetch(BASE_URL + "/contact?userID="+id+"&contactID="+favouredId, {
        mode: "cors",
        method: 'GET'
    });
    
    if (contactResponse.status != HTTP_OK) {
        return null;
    }
    
    let contactsData = await contactResponse.json();
    
    if (contactsData.length < 1) {
        return null;
    }

    // Format final response
    let favouredList = new Array();
    contactsData.forEach(c => {
        if(c.id == favouredId){
            favouredList.push({ 
                "id": c.id,
                "name": c.name,
                "cpf": c.cpf,
                "bankCode": c.bankCode,
                "bankAgency": c.bankAgency,
                "bankAccount": c.bankAgency,
                "userId": c.userID,
            });
        }
    });
    
    return favouredList[0];
}

async function searchAllFav() {
    // TODO: the following 2 lines should be called in case fetch fails. They mock the data.
    // console.log("Loading mocked data...");
    // return mockAllFavoured();

    let contactResponse = await fetch(BASE_URL + "/contact?userID="+id, {
        mode: "cors",
        method: 'GET'
    });
    
    if (contactResponse.status != HTTP_OK) {
        return null;
    }
    
    let contactsData = await contactResponse.json();
    
    if (contactsData.length < 1) {
        return null;
    }

    // Format final response
    let favouredList = new Array();
    contactsData.forEach(c => {
        favouredList.push({ 
            "id": c.id,
            "name": c.name,
            "cpf": c.cpf,
            "bankCode": c.bankCode,
            "bankAgency": c.bankAgency,
            "bankAccount": c.bankAgency,
            "userId": c.userID,
        });
    });
    
    return favouredList;
}

async function deleteTransaction() {
    // TODO: delete transaction with id:

    let contactOperationListResponse = await fetch(BASE_URL + "/operation?userID="+id+"&&contactID="+favouredId, {
        mode: "cors",
        method: 'GET'
    });

    if(contactOperationListResponse.status != HTTP_OK){
        alert('Ocorreu um erro')
        return;
    }
    
    let contactOperationList = await contactOperationListResponse.json();
    if(contactOperationList.length > 0){
        alert('Não é possível excluir uma operação que tenha um contato alterado a ela');
        return;
    }
    
    let deleteTransactionResponse = await fetch(BASE_URL + "/operation?id="+this.selectedTransactionId, {
        mode: "cors",
        method: 'DELETE'
    });

    if(deleteTransactionResponse != HTTP_OK){
        alert('Ocorreu um erro');
        return;
    }

    alert('Operação excluida com sucesso');
    closeModal("modalTransactionDetails");
}

async function deleteFavoured() {
    // TODO: delete favoured with id

    let deleteContactResponse = await fetch(BASE_URL + "/contact?id="+this.selectedFavouredId, {
        mode: "cors",
        method: 'DELETE'
    });

    if(deleteContactResponse != HTTP_OK){
        alert('Ocorreu um erro');
        return;
    }

    alert('Favorecido excluido com sucesso');
    
    closeModal("modalFavouredDetails");
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
                  aux += "<a href='#!' id='"+d.id+"' onclick= 'setFavouredAddOperationModal(this)' class='collection-item'>"+d.name+"</a>";  
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
    let description = $("#transaction-description-field").val();
    let dueDate = $("#transaction-due-date-field").val();
    let installmentsNumber = 0; // = $("#instalments-field");
    let value = $("#transaction-value-field").val();
    
    let transactionType;
    if($('#transactionType-credit').is(':checked')){
        transactionType = 1;
    }
    else
        transactionType = 2;

    const body = {
        "description": description,
        "dueDate": dueDate,
        "operationType": transactionType,
        "contactID": favouredId, // Where are we retrieving this from??
        "userID": id,
        "installmentsLeft": installmentsNumber,
        "value": value
    }

    validation = validateNewOperationFields(body);
    if(!validation.success){
        alert(validation.message);
        return;
    }

    if(dueDate.substring(0, 3) == "Fev"){
        dueDate.toString().replace("Fev", "Feb");
    } else if (dueDate.substring(0, 3) == "Abr") {
        dueDate.toString().replace("Abr", "Apr");
    } else if (dueDate.substring(0, 3) == "Mai") {
        dueDate.toString().replace("Mai", "May");
    } else if (dueDate.substring(0, 3) == "Set") {
        dueDate.toString().replace("Set", "Sep");
    } else if (dueDate.substring(0, 3) == "Out") {
        dueDate.toString().replace("Out", "Oct");
    } else if (dueDate.substring(0, 3) == "Dez") {
        dueDate.toString().replace("Dez", "Dec");
    }

    dueDate = dueDate.toString().replace(",", "");

    dueDate = new Date(dueDate);
    dueDate = dueDate.toISOString();
    dueDate = dueDate.substring(0, dueDate.search("T"));
    body.dueDate = dueDate;

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
            fillTableTodayOperations();
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

    var validation = validateNewFavouredFields(body);
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

// -- Modal: Transaction Details
function populateTransactionDetailsModal(transactionRow) {
    this.selectedTransactionId = transactionRow.id;

    searchOp(transactionRow.id).then((transaction) => {
        searchFav(transactionRow.lastChild.id).then((favoured) => {
            let value = "";
            if (transaction.type == "CREDIT") {
                value = "+ R$ " + transaction.value;
                $("#opValue").removeClass("wT-debit");
                $("#opValue").addClass("wT-credit");
            } else {
                value = "- R$ " + transaction.value;
                $("#opValue").removeClass("wT-credit");
                $("#opValue").addClass("wT-debit");
            }
        
            $("#opDescription").html(transaction.description);
            $("#opFavoured").html(favoured.name);
            $("#opValue").html(formatCurrency(value));
            $("#opDueDate").html(transaction.dueDate);
        });
    });
}

// -- Modal: Favoured Details
function populateFavouredDetailsModal(favouredRow) {
    this.selectedFavouredId = favouredRow.id;

    searchFav(favouredRow.id).then((favoured) => {
        $("#favName").html(favoured.name);
        $("#favCpf").html(favoured.cpf);
        $("#favBankCode").html(favoured.bankCode);
        $("#favBankAgency").html(favoured.bankAgency);
        $("#favBankAccount").html(favoured.bankAccount);
    });

}


// Instalments Functions (disabled)

// function enableInstalments() {
//     $('#instalments-options').removeClass("hidden");
// }

// function disableInstalments() {
//     $('#instalments-options').addClass("hidden");
// }


// --- Mockup Functions ---
function mockTransaction(id) {
    return { id: id, type: "CREDIT", description: "Sanduiche", dueDate: "12/01/2020", value: 19.99 };
}

function mockDayTransactions(date) {
    return [
        { id: "1", type: "CREDIT", description: "Presente Felipe", value: 200.00, dueDate: formatDate(date), favoured: "Andrea", favouredId: "1" },
        { id: "2", type: "CREDIT", description: "Barzinho", value: 50.00, dueDate: formatDate(date), favoured: "Barbara", favouredId: "2" },
        { id: "3", type: "DEBIT", description: "Encomenda", value: 310.00, dueDate: formatDate(date), favoured: "Carla", favouredId: "3" },
        { id: "4", type: "CREDIT", description: "Sanduiche", value: 19.99, dueDate: formatDate(date), favoured: "Débora", favouredId: "4" },
        { id: "5", type: "DEBIT", description: "Cinema", value: 10.00, dueDate: formatDate(date), favoured: "Emili", favouredId: "5" },
    ];
}

function mockAllTransactions() {
    return [
        { id: "1", type: "CREDIT", description: "Presente Felipe", value: 200.00, dueDate: "06/04/2019", favoured: "Andrea", favouredId: "1" },
        { id: "2", type: "CREDIT", description: "Barzinho", value: 50.00, dueDate: "11/10/2019", favoured: "Barbara", favouredId: "2" },
        { id: "3", type: "DEBIT", description: "Encomenda", value: 310.00, dueDate: "20/09/2019", favoured: "Carla", favouredId: "3" },
        { id: "4", type: "CREDIT", description: "Sanduiche", value: 19.99, dueDate: "12/01/2020", favoured: "Débora", favouredId: "4" },
        { id: "5", type: "DEBIT", description: "Cinema", value: 10.00, dueDate: "01/03/2020", favoured: "Emili", favouredId: "5" },
    ];
}

function mockFavoured(id) {
    return { id: id, name: "Carla", cpf: "98765432100", bankCode: "033", bankAgency: "1752", bankAccount: "0003-6" };
}

function mockAllFavoured() {
    return [
        { id: "1", name: "Andrea", cpf: "01234567890", bankCode: "001", bankAgency: "1234", bankAccount: "0001-9" },
        { id: "2", name: "Barbara", cpf: "12345678900", bankCode: "002", bankAgency: "1549", bankAccount: "0002-3" },
        { id: "3", name: "Carla", cpf: "98765432100", bankCode: "033", bankAgency: "1752", bankAccount: "0003-6" },
        { id: "4", name: "Débora", cpf: "65498732111", bankCode: "001", bankAgency: "1403", bankAccount: "0004-1" },
        { id: "5", name: "Emili", cpf: "98732165499", bankCode: "010", bankAgency: "1461", bankAccount: "0001-5" },
        { id: "6", name: "Flávia", cpf: "32198765466", bankCode: "023", bankAgency: "0001", bankAccount: "0001-4" },
    ];
}