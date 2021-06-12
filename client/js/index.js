// load the table when the page was loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/getUsersTable')
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
});

function deleteRowById(id) {
    fetch('http://localhost:3001/delete/' + id, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({
            table : 'Users',
            keyName : 'UserID',
        }, null, '\t')
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            location.reload();
        }
    });
}

// set the elements in the table clickable
document.querySelector('#control_users tbody').addEventListener('click', (event) => {
    if(event.target.className === 'edit_row_btn') {
        //edit user
    }
    if(event.target.className === 'delete_row_btn') {
        deleteRowById(event.target.dataset.id);
    }
});

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

function insertRowIntoUsersTable(data) {
    const table = document.querySelector('#control_users tbody');
    const idTableData = table.querySelector('.no-data');

    let tableHTML = "<tr>";

    for(let elem in data) {
        if(data.hasOwnProperty(key)) {

            if(key === 'RegistrationDate') {
                data[key] = new Date(data[key]).toLocaleString();
            }

            tableHTML += `<td>${data[key]}</td>`;
        }
    }

    tableHTML += `<td><button class="edit_row_btn" data-id=${data.UserID}>Ред.</td>`;
    tableHTML += `<td><button class="delete_row_btn" data-id=${data.UserID}>&times;</td>`;
    tableHTML += "</tr>";
    
    if(isTableData) {
        table.innerHTML = tableHTML;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }
}

function loadUsersTable(data){
    const table = document.querySelector('#control_users tbody');
    
    if(!data) {
        table.innerHTML = "<tr><td class='no-data' colspan='11'><div style='margin: 0 auto; text-align: center;'>Error</div></td></tr>";
        return;
    }

    if(data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='11'><div style='margin: 0 auto; text-align: center;'>No Data</div></td></tr>";
        return;
    }
    
    let tableHTML = "";
    data.forEach(({UserID, Username, Email, Password, Fullname, Position, Phone, Access, RegistrationDate, Deleted}) => {
        tableHTML += "<tr>";
        tableHTML += `<td>${UserID}</td>`;
        tableHTML += `<td>${Username}</td>`;
        tableHTML += `<td>${Email}</td>`;
        tableHTML += `<td>${Password}</td>`;
        tableHTML += `<td>${Fullname}</td>`;
        tableHTML += `<td>${Position}</td>`;
        tableHTML += `<td>${Phone}</td>`;
        tableHTML += `<td>${Access}</td>`;
        tableHTML += `<td>${RegistrationDate}</td>`;
        tableHTML += `<td><button class="edit_row_btn" data-id=${UserID}>Ред.</td>`;
        tableHTML += `<td><button class="delete_row_btn" data-id=${UserID}>&times;</td>`;
        tableHTML += "</tr>";
    });

    table.innerHTML = tableHTML;
}

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

// set white color for each second row in the table
const control_users_table = document.querySelector('#control_users tbody');

for(row of control_users_table.children)
{
    for(elem of row)
    {
        elem.style.backgroundColor = 'rgb(255, 255, 255)';
    }
}


// set the sign in and the sign up links clickable

const signup_popup = document.getElementById("mSignUpPopup");
document.getElementsByClassName("header_signup")[0].addEventListener("click", (evt) => signup_popup.style.display = "block");

document.getElementsByClassName("signup_btn_close")[0].addEventListener("click", (evt) => signup_popup.style.display = "none");
document.getElementsByClassName("signup_btn_cancel")[0].addEventListener("click", (evt) => signup_popup.style.display = "none");

const login_popup = document.getElementById("mLoginPopup");
document.getElementsByClassName("header_login")[0].addEventListener("click", (evt) => login_popup.style.display = "block");

document.getElementsByClassName("login_btn_close")[0].addEventListener("click", (evt) => login_popup.style.display = "none");
document.getElementsByClassName("login_btn_cancel")[0].addEventListener("click", (evt) => login_popup.style.display = "none");

window.onclick = (event) => {
    if(event.target == signup_popup)
        signup_popup.style.display = "none";
    if(event.target == login_popup)
        login_popup.style.display = "none";
};