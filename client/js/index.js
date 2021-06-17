//import {record} from './data.js'

// set the color of the active sidebar element
const sidebar_items = document.getElementsByClassName("sidebar_caption");

sidebar_items[0].style.backgroundColor = 'rgb(143, 201, 255)';
sidebar_items[0].style.color = 'rgb(0, 0, 0)';

const sections = {
    main_section : document.querySelector('#main_section'),
    control_section : document.querySelector('#control_section'),
    report_section : document.querySelector('#report_section'),
    settings_section : document.querySelector('#settings_section') 
}

for(elem of sidebar_items) {

    elem.addEventListener("click", (evt) => {

        for(let i = 0; i < evt.currentTarget.myCollection.length; ++i)
        {
            Object.values(sections)[i].hidden = false;

            if(evt.currentTarget.myCollection[i] != evt.currentTarget)
            {
                evt.currentTarget.myCollection[i].style.color = "rgb(0, 0, 0)";
                evt.currentTarget.myCollection[i].style.backgroundColor = 'rgb(255, 255, 255)';
                Object.values(sections)[i].hidden = true;
            }
        }
            evt.currentTarget.style.color = 'rgb(0, 0, 0)';
            evt.currentTarget.style.backgroundColor = 'rgb(143, 201, 255)';

    }, false);

    elem.myCollection = sidebar_items;
}

// set the sign in and the sign up links clickable
const login_popup = document.getElementById("mLoginPopup");
document.getElementsByClassName("header_login")[0].addEventListener("click", (evt) => login_popup.style.display = "block");

document.getElementsByClassName("popup_btn_close")[0].addEventListener("click", (evt) => login_popup.style.display = "none");
document.getElementsByClassName("popup_btn_cancel")[0].addEventListener("click", (evt) => login_popup.style.display = "none");

const signup_popup = document.getElementById("mSignUpPopup");
document.getElementsByClassName("header_signup")[0].addEventListener("click", (evt) => signup_popup.style.display = "block");

document.getElementsByClassName("popup_btn_close")[1].addEventListener("click", (evt) => signup_popup.style.display = "none");
document.getElementsByClassName("popup_btn_cancel")[1].addEventListener("click", (evt) => signup_popup.style.display = "none");

window.onclick = (event) => {
    if(event.target == signup_popup)
        signup_popup.style.display = "none";
    if(event.target == login_popup)
        login_popup.style.display = "none";
};

// load the table when the page was loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/getTable/Record')
    .then(response => response.json())
    .then(data => loadRecordTable(data['data']));
});

const funEditRecord = (event) => {
    if(event.target.className === 'edit_row_btn') {
        localStorage.setItem("iCurrentDocumentIndex", event.target.dataset.id);
        localStorage.setItem("sCurrentDocumentStatus", "draft");
        localStorage.setItem("bCreateNewRecord", "false");
        window.location.href = "editing.html";
    }
    if(event.target.className === 'delete_row_btn') {
        deleteRowById("Record", event.target.dataset.id);
    }
};

// set the elements in the table clickable
document.querySelector('#doclist_documents tbody').addEventListener('click', funEditRecord);
document.querySelector('#doclist_draft_documents tbody').addEventListener('click', funEditRecord);

document.querySelector('#loginBtn').onclick = () => {
    fetch('http://localhost:3001/login')
    .then(response => response.json())
    .then(data => {
        if(data) {
            document.getElementsByClassName("header_auth")[0].style.display = 'none';
            document.getElementsByClassName("header_user")[0].style.display = 'block';
        }
    });
}

// push data when signing up
document.querySelector('#registerBtn').onclick = () => {
    const usernameValue = document.querySelector('#signupUsername').value;
    const emailValue = document.querySelector('#signupEmail').value;
    const passwordValue = document.querySelector('#signupPassword').value;
    const fullnameValue = document.querySelector('#signupFullname').value;
    const positionValue = document.querySelector('#signupPosition').value;
    const phoneValue = document.querySelector('#signupPhone').value;

    fetch('http://localhost:3001/insertUser', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            Username : usernameValue,
            Email : emailValue,
            Password : passwordValue,
            Fullname : fullnameValue,
            Position : positionValue,
            Phone : phoneValue
        }, null, '\t')
    })
    .then(response => response.json())
    .then(data => insertRowIntoUsersTable(data['data']));
}

document.querySelector('#toolbarCreateRecordBtn').addEventListener('click', (event) => {

    // TODO new record insertion

    fetch('http://localhost:3001/insertDocumentDraft')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("iCurrentDocumentIndex", data.data.insertId);
        localStorage.setItem("sCurrentDocumentStatus", data.data.Status);
        localStorage.setItem("bCreateNewRecord", "true");
    });
});

function deleteRowById(table, id) {
    fetch('http://localhost:3001/delete/' + id, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({
            table : table
        }, null, '\t')
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            location.reload();
        }
    });
}

function loadRecordTable(data) {
    const table = document.querySelector('#doclist_documents tbody');
    const table_draft = document.querySelector('#doclist_draft_documents tbody');
    
    if(!data) {
        table.innerHTML = "<tr><td class='no-data' colspan='6'><div style='margin: 0 auto; text-align: center;'>Error</div></td></tr>";
        return;
    }

    if(data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='6'><div style='margin: 0 auto; text-align: center;'>No Data</div></td></tr>";
        return;
    }
    
    let tableHTML = "";
    let tableHTMLDraft = "";
    data.forEach(({RecordID, UserID, Header, DocumentDate, ChangeDate, Status}) => {

        if (Status == "release") {
            tableHTML += "<tr>";
            tableHTML += `<td>${UserID}</td>`;
            tableHTML += `<td>${Header}</td>`;
            tableHTML += `<td>${DocumentDate?.slice(0, 19).replace('T', ' ')}</td>`;
            tableHTML += `<td>${ChangeDate?.slice(0, 19).replace('T', ' ')}</td>`;
            tableHTML += `<td><button class="edit_row_btn" data-id=${RecordID}>Ред.</td>`;
            tableHTML += `<td><button class="delete_row_btn" data-id=${RecordID}>&times;</td>`;
            tableHTML += "</tr>";
        }
        if (Status == "draft") {
            tableHTMLDraft += "<tr>";
            tableHTMLDraft += `<td>${Header}</td>`;
            tableHTMLDraft += `<td>${ChangeDate?.slice(0, 19).replace('T', ' ')}</td>`;
            tableHTMLDraft += `<td><button class="edit_row_btn" data-id=${RecordID}>Ред.</td>`;
            tableHTMLDraft += `<td><button class="delete_row_btn" data-id=${RecordID}>&times;</td>`;
            tableHTMLDraft += "</tr>";
        }

    });

    table.innerHTML = tableHTML;
    table_draft.innerHTML = tableHTMLDraft;
}
