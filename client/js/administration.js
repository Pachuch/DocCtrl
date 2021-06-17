// load the table when the page was loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/getTable/User')
    .then(response => response.json())
    .then(data => loadUsersTable(data['data']));
});

// set the elements in the table clickable
document.querySelector('#control_users tbody').addEventListener('click', (event) => {
    if(event.target.className === 'edit_row_btn') {
        //edit user
    }
    if(event.target.className === 'delete_row_btn') {
        deleteRowById("User", event.target.dataset.id);
    }
});

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

function loadUsersTable(data) {
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