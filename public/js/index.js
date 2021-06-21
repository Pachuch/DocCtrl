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

// load the table when the page was loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/getTable/Record')
    .then(response => response.json())
    .then(data => loadRecordTable(data['data']));

    login();
    const user = JSON.parse(document.cookie);
    console.log(user);
});

const funEditRecord = (event) => {
    if(event.target.className === 'edit_row_btn') {
        localStorage.setItem("iCurrentDocumentIndex", event.target.dataset.id);
        localStorage.setItem("sCurrentDocumentStatus", "draft");
        localStorage.setItem("bCreateNewRecord", "false");
        window.location.href = "editing";
    }
    if(event.target.className === 'delete_row_btn') {
        deleteRowById("Record", event.target.dataset.id);
    }
};

// set the elements in the table clickable
document.querySelector('#table_records tbody').addEventListener('click', funEditRecord);
document.querySelector('#table_draft_records tbody').addEventListener('click', funEditRecord);
document.querySelector('#table_filtered_records tbody').addEventListener('click', funEditRecord);

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

// filtering
document.querySelector('#filter_btn').onclick = () => {
    const start_date    = document.querySelector('#filter_start_date').value;
    const end_date      = document.querySelector('#filter_end_date').value;
    const is_validated  = document.querySelector('#filter_is_validated').checked;

    const table         = document.querySelector('#table_filtered_records tbody');
    const section       = document.getElementsByClassName("filtered_docs")[0];

    fetch(`http://localhost:3001/getFiltered/?table=Record&start=${start_date}&end=${end_date}&validated=${is_validated}`)
    .then(response => response.json())
    .then(data => loadFilteredRecordTable(table, data['data']));

    section.hidden = false;
}

document.querySelector('#generate_report_btn').onclick = () => {
    window.location.href = "report_view";
}

/////////////////////////////////////////////////////////////////////////////////
// functions                                                                   //
/////////////////////////////////////////////////////////////////////////////////

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

function loadStatistics(data) {
    const count_label = document.querySelector('#count_label');

    let inr = "";

    inr = '▼ Результат&nbsp;&nbsp;';
    inr += '<div style="color: #666666;">';
    inr += '(';
    inr += `Действующие: ${data.actualCount}.&nbsp;`;
    inr += `Просроченные: ${data.outdatedCount}.&nbsp;`;
    inr += `Завершенные: ${data.finishedCount}`;
    inr += ')';
    inr += '</div>';

    count_label.innerHTML = inr;
}

function loadRecordTable(data) {
    const table = document.querySelector('#table_records tbody');
    const table_draft = document.querySelector('#table_draft_records tbody');

    let actualCount = 0;
    let outdatedCount = 0;
    let finishedCount = 0;
    let validatedCount = 0;
    
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
    data.forEach(({RecordID, UserFullName, Header, EndDate, ChangeDate, Status}) => {

        if (Status == "release") {
            tableHTML += "<tr>";
            tableHTML += `<td>${UserFullName}</td>`;
            tableHTML += `<td>${Header}</td>`;
            tableHTML += `<td>${getExpiration(EndDate?.slice(0, 10))}</td>`;
            tableHTML += `<td>${ChangeDate?.slice(0, 10)}</td>`;
            tableHTML += `<td><button class="edit_row_btn" data-id=${RecordID}>Ред.</td>`;
            tableHTML += `<td><button class="delete_row_btn" data-id=${RecordID}>&times;</td>`;
            tableHTML += "</tr>";
        }
        if (Status == "draft") {
            tableHTMLDraft += "<tr>";
            tableHTMLDraft += `<td>${Header}</td>`;
            tableHTMLDraft += `<td>${ChangeDate?.slice(0, 10).replace('T', ' ')}</td>`;
            tableHTMLDraft += `<td><button class="edit_row_btn" data-id=${RecordID}>Ред.</td>`;
            tableHTMLDraft += `<td><button class="delete_row_btn" data-id=${RecordID}>&times;</td>`;
            tableHTMLDraft += "</tr>";
        }

    });

    table.innerHTML = tableHTML;
    table_draft.innerHTML = tableHTMLDraft;

    loadStatistics({ actualCount, outdatedCount, finishedCount, validatedCount });
}

function loadFilteredRecordTable(table, body) {
    table.innerHTML = "";
    let tableRow = ``;

    body.forEach(({RecordID, UserFullName, Header, EndDate, ChangeDate, Status}) => {
        if (Status == "release") {
            tableRow += "<tr>";
            tableRow += `<td>${UserFullName}</td>`;
            tableRow += `<td>${Header}</td>`;
            tableRow += `<td>${getExpiration(EndDate?.slice(0, 10))}</td>`;
            tableRow += `<td>${ChangeDate?.slice(0, 10)}</td>`;
            tableRow += `<td><button class="edit_row_btn" data-id=${RecordID}>Ред.</td>`;
            tableRow += `<td><button class="delete_row_btn" data-id=${RecordID}>&times;</td>`;
            tableRow += "</tr>";
        }
    });

    table.innerHTML += tableRow; 
}

function getExpiration(date) {

    if (!date)
        return "Нет данных";
    
    const date1 = new Date();
    const date2 = new Date(date);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

function login() {
    fetch('http://localhost:3001/getUser/?username=admin')
    .then(response => response.json())
    .then(body => {
        localStorage.setItem("iCurrentUserID", body['data'][0].UserID);  // TODO: hook to current user id
        localStorage.setItem("sCurrentUserFullName", body['data'][0].Fullname);
    });
}