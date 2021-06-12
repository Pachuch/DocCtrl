const add_owner_popup = document.querySelector('#mAddOwnerPopup');

document.getElementsByClassName("popup_btn_close")[0].addEventListener("click", (evt) => add_owner_popup.style.display = "none");

document.querySelector('#createClauseBtn').addEventListener('click', (event) => {
    console.dir(event);
});

// when user attemts to add an owner
document.querySelector('#addOwnerBtn').onclick = () => {
    document.querySelector('#mAddOwnerPopup').style.display = 'block';

    fetch('http://localhost:3001/getUsersTable')
    .then(response => response.json())
    .then(data => loadPopupOwnersTable(data['data']));

}

window.onclick = (event) => {
    if(event.target == add_owner_popup)
    add_owner_popup.style.display = "none";
};

// load the table when the page was loaded

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/insertDraftRecord')
    .then(response => response.json())
    .then(data => loadOwnersTable(data['data']));
});

// set the elements in the table clickable
document.querySelector('#popupOwnersList tbody').addEventListener('click', (event) => {
    if(event.target.className === 'query_row') {
        // deleteRowById(event.target.dataset.id);

        fetch('http://localhost:3001/getUsersTable')
        .then(response => response.json())
        .then(data => getRowById(data['data'], event.target.dataset.id));

        add_owner_popup.style.display = "none";
    }
});

function getRowById(data, id) {
    const table = document.querySelector('#ownersList tbody');
    let tableRow = ``;

    data.forEach(({UserID, Username, Email, Password, Fullname, Position, Phone, Access, RegistrationDate, Deleted}) => {

        if (UserID == id)
        {
            tableRow += "<tr>";
            tableRow += `<td>${Fullname}</td>`;
            tableRow += `<td>${Position}</td>`;
            tableRow += `<td><button class="delete_row_btn" data-id=${UserID}>&times;</td>`;
            tableRow += "</tr>";
        }
    });

    table.innerHTML += tableRow;

}

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

function insertRowIntoOwnersTable(data) {
    const table = document.querySelector('#ownersList tbody');
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

function loadOwnersTable(data) {
    const table = document.querySelector('#ownersList tbody');
    
    if(!data) {
        table.innerHTML = "<tr><td class='no-data' colspan='11'><div style='margin: 0 auto; text-align: center;'>Error</div></td></tr>";
        return;
    }

    if(data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='11'><div style='margin: 0 auto; text-align: center;'>No Data</div></td></tr>";
        return;
    }
    
    let tableHTML = "";
    data.forEach(({UserID,  Fullname, Position}) => {
        tableHTML += "<tr>";
        tableHTML += `<td class="query_row" data-id=${UserID}>${Fullname}</td>`;
        tableHTML += `<td>${Position}</td>`;
        tableHTML += `<td><button class="delete_row_btn" data-id=${UserID}>&times;</td>`;
        tableHTML += "</tr>";
    });

    table.innerHTML = tableHTML;
}

function loadPopupOwnersTable(data) {
    const table = document.querySelector('#popupOwnersList tbody');
    
    if(!data) {
        table.innerHTML = "<tr><td class='no-data' colspan='11'><div style='margin: 0 auto; text-align: center;'>Error</div></td></tr>";
        return;
    }

    if(data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='11'><div style='margin: 0 auto; text-align: center;'>No Data</div></td></tr>";
        return;
    }
    
    let tableHTML = "";
    data.forEach(({UserID, Username, Fullname}) => {
        tableHTML += "<tr>";
        tableHTML += `<td class="query_row" data-id=${UserID}>${Fullname}</td>`;
        tableHTML += `<td>${Username}</td>`;
        tableHTML += "</tr>";
    });

    table.innerHTML = tableHTML;
}
