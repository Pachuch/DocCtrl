/////////////////////////////////////////////////////////////////////////////////
// button handles                                                              //
/////////////////////////////////////////////////////////////////////////////////

const popup_button = {
    add_clause    : document.querySelector('#addClauseBtn'),
    add_file      : document.querySelector('#addFileBtn'),
    add_owner     : document.querySelector('#addOwnerBtn')
};

const popup_btn_close = document.getElementsByClassName("popup_btn_close");
const input_files = document.querySelector('#file-input');

/////////////////////////////////////////////////////////////////////////////////
// popup window handles                                                        //
/////////////////////////////////////////////////////////////////////////////////

const popup_window = {
    add_clause  : document.querySelector('#mAddClausePopup'),
    add_file    : document.querySelector('#mAddFilePopup'),
    add_owner   : document.querySelector('#mAddOwnerPopup')
};

/////////////////////////////////////////////////////////////////////////////////
// triggers                                                                    //
/////////////////////////////////////////////////////////////////////////////////

// load the table when the page was loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/insertDraftRecord') // TODO new record insertion
    .then(response => response.json())
    .then(data => loadOwnersTable(data['data']));
});

/////////////////////////////////////////////////////////////////////////////////
// listeners                                                                   //
/////////////////////////////////////////////////////////////////////////////////

// window listener
window.onclick = (event) => {
    for (const [key, obj] of Object.entries(popup_window)) {
        if (event.target == obj) {
            obj.style.display = "none";
        }
    }
};

// popup close button listener
for (btn of popup_btn_close) {
    btn.addEventListener("click", (evt) => {
        evt.path[2].style.display = "none";
    });
}

// !insertion buttons!

// add a file button click
popup_button.add_file.onclick = () => {
    popup_window.add_file.style.display = 'block';

    // TODO then upload it to the server (ohh fuck)

    // fetch('http://localhost:3001/getUsersTable')
    // .then(response => response.json())
    // .then(data => loadPopupOwnersTable(data['data']));
}

input_files.oninput = () => {
    for (const [key, file] of Object.entries(input_files.files)) {
        console.log(file);
    }
}

// add an owner button click
popup_button.add_owner.onclick = () => {
    popup_window.add_owner.style.display = 'block';

    fetch('http://localhost:3001/getUsersTable')
    .then(response => response.json())
    .then(data => loadPopupOwnersTable(data['data']));
}

// set the elements in the table clickable
document.querySelector('#popupOwnersList tbody').addEventListener('click', (event) => {
    if(event.target.className === 'query_row') {
        // deleteRowById(event.target.dataset.id);

        fetch('http://localhost:3001/getUsersTable')
        .then(response => response.json())
        .then(data => getRowById(data['data'], event.target.dataset.id));

        popup_window.add_owner.style.display = "none";
    }
});

/////////////////////////////////////////////////////////////////////////////////
// functions                                                                   //
/////////////////////////////////////////////////////////////////////////////////

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

//TODO debug info
document.querySelector('#createClauseBtn').addEventListener('click', (event) => {
    console.dir(event);
});