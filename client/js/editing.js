//import {record} from './data.js'

const doc_idx = localStorage.getItem("iCurrentDocumentIndex");
var clauseCounter = 0;
var endDate = "";
var temporary;

/////////////////////////////////////////////////////////////////////////////////
// text fields                                                                 //
/////////////////////////////////////////////////////////////////////////////////

const text_field = {
    number          : document.querySelector('#number'),
    head            : document.querySelector('#head'),
    basis           : document.querySelector('#basis'),
    date            : document.querySelector('#date'),
    access_stamp    : document.querySelector('#accessStamp')
};

const clause_text_fields = {
    body : document.querySelector('#clause_body'),
    performers : document.querySelector('#performers'),
    expirationdate : document.querySelector('#expirationdate')
};

/////////////////////////////////////////////////////////////////////////////////
// button handles                                                              //
/////////////////////////////////////////////////////////////////////////////////

const popup_button = {
    add_clause    : document.querySelector('#addClauseBtn'),
    add_file      : document.querySelector('#addFileBtn'),
    add_owner     : document.querySelector('#addOwnerBtn')
};

const popup_btn_close = document.getElementsByClassName("popup_btn_close");
const popup_btn_cancel = document.getElementsByClassName("popup_btn_cancel");
const submit_file_btn = document.querySelector('#submitFileBtn');
const input_files = document.getElementsByName("document_order")[0];
const finish_clause_btn = document.querySelector('#finishClauseBtn');

/////////////////////////////////////////////////////////////////////////////////
// popup window handles                                                        //
/////////////////////////////////////////////////////////////////////////////////

const popup_window = {
    add_clause  : document.querySelector('#mAddClausePopup'),
    add_file    : document.querySelector('#mAddFilePopup'),
    add_owner   : document.querySelector('#mAddOwnerPopup')
};

/////////////////////////////////////////////////////////////////////////////////
// tables                                                                      //
/////////////////////////////////////////////////////////////////////////////////

const table = {
    clauses         : document.querySelector('#clausesList tbody'),
    files           : document.querySelector('#filesList tbody'),
    owners          : document.querySelector('#ownersList tbody'),
    popup_owners    : document.querySelector('#popupOwnersList tbody')
};

/////////////////////////////////////////////////////////////////////////////////
// triggers                                                                    //
/////////////////////////////////////////////////////////////////////////////////

// load the table when the page was loaded
document.addEventListener('DOMContentLoaded', () => {

    text_field.date.value = new Date().toJSON().slice(0, 10);

    // TODO load page with data

    if (localStorage.getItem("bCreateNewRecord") === "false") {
        // 1. retrieve item
        // 2. update values
        // 3. update sql table

        // retrieve
        fetch(`http://localhost:3001/retrieve/?table=Record&rowId=${localStorage.getItem("iCurrentDocumentIndex")}`)
        .then(response => response.json())
        .then(data => {
            text_field.number.value = data.data[0].Number;
            text_field.date.value = data.data[0].DocumentDate?.slice(0, 10);
            if (data.data[0].EndDate)
                endDate = data.data[0].EndDate.slice(0, 10);
            text_field.access_stamp.value = data.data[0].AccessStamp;
            text_field.head.value = data.data[0].Header;
            text_field.basis.value = data.data[0].Basis;

            loadClauseTable();
            loadFileTable();
            loadOwnerTable();
        });
    }
    
});

/////////////////////////////////////////////////////////////////////////////////
// listeners                                                                   //
/////////////////////////////////////////////////////////////////////////////////

// window listener
window.onmousedown = (event) => {
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

for (btn of popup_btn_cancel) {
    btn.addEventListener("click", (evt) => {
        // console.log(evt.path);
        evt.path[5].style.display = "none";
    });
}

// edit control listeners

for (editCtrl of Object.values(text_field)) {
    editCtrl.onchange = () => {
        updateDocument("draft");
    }
}

document.querySelector('#doneBtn').onclick = () => {
    //TODO: checks if the document was not filled completely
    updateDocument("release");
    window.location.href = "index.html";
}

// !insertion buttons!

popup_button.add_clause.onclick = () => {
    finish_clause_btn.dataset.mode = "new";
    finish_clause_btn.innerHTML = "Создать";
    clause_text_fields.body.value = "";
    clause_text_fields.performers.value = "";
    clause_text_fields.expirationdate.value = new Date().toJSON().slice(0, 10);
    popup_window.add_clause.style.display = 'block';    
}

// submit clause to the server
finish_clause_btn.onclick = () => {

    clauseCounter++;

    const newRow = {
        Number: clauseCounter,
        Body: clause_text_fields.body.value,
        Performers: clause_text_fields.performers.value,
        ExpirationDate : clause_text_fields.expirationdate.value
    };
    
    if (finish_clause_btn.dataset.mode === "new") {

        // new clause on the server
        fetch(`http://localhost:3001/insert/?table=Clause&Number=${newRow.Number}&Body=${newRow.Body}&Performers=${newRow.Performers}&ExpirationDate=${newRow.ExpirationDate}`, {
            headers: {
                'Content-type': 'message/http'
            },
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            
            // hooking with record on the server
            fetch(`http://localhost:3001/insert/?table=RecordClause&RecordId=${doc_idx}&ClauseId=${data.data.insertId}`, {
                headers: {
                    'Content-type': 'message/http'
                },
                method: 'POST'
            }).then(response => response.json())
            .then(() => clausesInsertRow({ ClauseID: data.data.insertId, ...newRow }));
        });


    } else {

        fetch(`http://localhost:3001/updateDocument/?table=Clause&rowId=${temporary}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                Body          : newRow.Body,
                Performers    : newRow.Performers,
                ExpirationDate: newRow.ExpirationDate
            }, null, '\t')
        })
        .then(response => response.json())
        .then(() => location.reload());
    }

    if (endDate.length === 0 || (Date.parse(newRow.ExpirationDate) > Date.parse(endDate))) {
        console.log(newRow.ExpirationDate, " > ", endDate);
        endDate = newRow.ExpirationDate;
    }

    updateDocument("draft");
    popup_window.add_clause.style.display = 'none';
}

// set the elements in the clauses table deleteable
table.clauses.addEventListener('click', (event) => {
    if (event.target.className === 'edit_row_btn') {

        fetch(`http://localhost:3001/retrieve/?table=Clause&rowId=${event.target.dataset.id}`)
        .then(response => response.json())
        .then(data => 
        {
            clause_text_fields.body.value = data.data[0].Body;
            clause_text_fields.performers.value = data.data[0].Performers;
            clause_text_fields.expirationdate.value = data.data[0].ExpirationDate.slice(0, 10).replace('T', ' ');
            finish_clause_btn.dataset.mode = "update";
            finish_clause_btn.innerHTML = "Обновить";
            popup_window.add_clause.style.display = 'block';
            temporary = event.target.dataset.id;
        });

    }

    if(event.target.className === 'delete_row_btn') {

        const cls_idx = event.target.dataset.id;

        fetch(`http://localhost:3001/deleteMiddle/?table=RecordClause&parent=RecordID&parentValue=${doc_idx}&child=ClauseID&childValue=${cls_idx}`, {
        headers: {
            'Content-type': 'message/http'
        },
        method: 'DELETE'
        })
        .then(response => response.json());

        fetch('http://localhost:3001/delete/' + cls_idx, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                table : "Clause"
            }, null, '\t')
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                location.reload();
            }
        });
    }
});

// add a file button click
popup_button.add_file.onclick = () => {
    popup_window.add_file.style.display = 'block';

}

// file choose button
// input_files.oninput = () => {
//     for (const [key, file] of Object.entries(input_files.files)) {
//         console.log(file);
//     }
// }

// file submit button
submit_file_btn.onclick = () => {
    if (input_files.files.length > 0) {

        const form = document.querySelector('#uploadForm');
        const formData = new FormData(form);

        fetch(`http://localhost:3001/upload`, {
        method: 'POST',
        body: formData
        })
        .then(response => response.json())
        .then(data => {
            fetch(`http://localhost:3001/insert/?table=File&Name=${input_files.files[0].name}&Path=${data.file.path}&Type=${input_files.files[0].type}`, {
                headers: {
                    'Content-type': 'message/http'
                },
                method: 'POST'
            }).then(response => response.json()) // clausesInsertRow({ ClauseID: data.data.insertId, ...newRow })
            .then(subdata => {

                // hooking with record on the server
                fetch(`http://localhost:3001/insert/?table=RecordFile&RecordId=${doc_idx}&FileId=${subdata.data.insertId}`, {
                    headers: {
                        'Content-type': 'message/http'
                    },
                    method: 'POST'
                }).then(() => filesInsertRow({ FileID: subdata.data.insertId, Name: input_files.files[0].name, Path: data.file.path }));

            });

        });
    } 

    popup_window.add_file.style.display = 'none';
}

// set the elements in the onwers table deleteable
table.files.addEventListener('click', (event) => {
    if(event.target.className === 'delete_row_btn') {

        const file_idx = event.target.dataset.id;

        fetch(`http://localhost:3001/deleteMiddle/?table=RecordFile&parent=RecordID&parentValue=${doc_idx}&child=FileID&childValue=${file_idx}`, {
            headers: { 'Content-type': 'message/http' },
            method: 'DELETE'
        });

        fetch(`http://localhost:3001/deleteRecordFile/?fileName=${event.target.dataset.path}`, {
            headers: { 'Content-type': 'message/http' },
            method: 'DELETE'
        })
        .then(() => {
            fetch('http://localhost:3001/delete/' + file_idx, {
                headers: { 'Content-type': 'application/json' },
                method: 'DELETE',
                body: JSON.stringify({
                    table : "File"
                }, null, '\t')
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    location.reload();
                }
            });
        });
    }
});

// add an owner button click
popup_button.add_owner.onclick = () => {
    popup_window.add_owner.style.display = 'block';

    fetch('http://localhost:3001/getTable/User') // TODO: (sql query) show users except existing
    .then(response => response.json())
    .then(data => loadPopupOwnersTable(data['data']));
}

// set the elements in the popup owners table clickable
table.popup_owners.addEventListener('click', (event) => {
    if(event.target.className === 'query_row') {

        fetch(`http://localhost:3001/retrieve/?table=User&rowId=${event.target.dataset.id}`)
        .then(response => response.json())
        .then(data => ownersInsertRow(data.data[0]));

        fetch(`http://localhost:3001/insert/?table=RecordOwner&RecordId=${localStorage.getItem("iCurrentDocumentIndex")}&UserId=${event.target.dataset.id}`, {
        headers: {
            'Content-type': 'message/http'
        },
        method: 'POST'
        })
        .then(response => response.json());

        popup_window.add_owner.style.display = "none";
    }
});

// set the elements in the onwers table deleteable
table.owners.addEventListener('click', (event) => {
    if(event.target.className === 'delete_row_btn') {

        const usr_idx = event.target.dataset.id;

        fetch(`http://localhost:3001/deleteMiddle/?table=RecordOwner&parent=RecordID&parentValue=${doc_idx}&child=UserID&childValue=${usr_idx}`, {
        headers: {
            'Content-type': 'message/http'
        },
        method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => location.reload());
    }
});

/////////////////////////////////////////////////////////////////////////////////
// functions                                                                   //
/////////////////////////////////////////////////////////////////////////////////

function updateDocument(status) {

    // TODO new record insertion
    fetch(`http://localhost:3001/updateDocument/?table=Record&rowId=${localStorage.getItem("iCurrentDocumentIndex")}`, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            UserID          : localStorage.getItem("iCurrentUserID"),
            UserFullName    : localStorage.getItem("sCurrentUserFullName"),
            Number          : document.querySelector('#number')?.value,
            Header          : document.querySelector('#head')?.value,
            Basis           : document.querySelector('#basis')?.value,
            AccessStamp     : document.querySelector('#accessStamp')?.value,
            Validation      : 0,
            DocumentDate    : document.querySelector('#date').value?.slice(0, 10),
            EndDate         : endDate.length > 0 ? endDate : null,
            ChangeDate      : new Date().toISOString().slice(0, 19).replace('T', ' '),
            Status          : status
        }, null, '\t')
    })
    .then(response => response.json());
    // .then(data => console.log(data));
}

function clausesInsertRow(body) {
    let tableRow = ``;

    let incomeDate = Date.parse(body.ExpirationDate);
    let dateHighlight = `#008800`;
    if (incomeDate < new Date()) {
        dateHighlight = `#ff0000`;
    }

    tableRow += "<tr>";
    tableRow += `<td>${body.Number}</td>`;
    tableRow += `<td>${body.Body}</td>`;
    tableRow += `<td><div style="color: ${dateHighlight}">${body.ExpirationDate?.slice(0, 10)}</div></td>`;
    tableRow += `<td><button class="edit_row_btn" data-id=${body.ClauseID}>Ред.</td>`;
    tableRow += `<td><button class="delete_row_btn" data-id=${body.ClauseID}>&times;</td>`;
    tableRow += "</tr>";

    table.clauses.innerHTML += tableRow;    
}

function filesInsertRow(body) {
    let tableRow = ``;

    tableRow += "<tr>";
    tableRow += `<td>${body.Name}</td>`;
    tableRow += `<td><button class="delete_row_btn" data-id=${body.FileID} data-path=${body.Path}>&times;</td>`;
    tableRow += "</tr>";

    table.files.innerHTML += tableRow;  
}

function ownersInsertRow(body) {
    let tableRow = ``;

    tableRow += "<tr>";
    tableRow += `<td>${body.Fullname}</td>`;
    tableRow += `<td>${body.Email}</td>`;
    tableRow += `<td>${body.Position}</td>`;
    tableRow += `<td><button class="delete_row_btn" data-id=${body.UserID}>&times;</td>`;
    tableRow += "</tr>";

    table.owners.innerHTML += tableRow;    
}

function loadPopupOwnersTable(data) {
    
    let tableHTML = "";
    data.forEach(({UserID, Username, Fullname}) => {
        tableHTML += "<tr>";
        tableHTML += `<td class="query_row" data-id=${UserID}>${Fullname}</td>`;
        tableHTML += `<td>${Username}</td>`;
        tableHTML += "</tr>";
    });

    table.popup_owners.innerHTML = tableHTML;
}

function loadClauseTable() {
    fetch(`http://localhost:3001/getRecordClauses/?RecordId=${doc_idx}`)
    .then(response => response.json())
    .then(data => {
        if (data.data[0]) {
            clauseCounter = data.data.length;
            for (row of data.data)
                clausesInsertRow(row);
        }
    });
}

function loadFileTable() {
    fetch(`http://localhost:3001/getRecordFiles/?RecordId=${doc_idx}`)
    .then(response => response.json())
    .then(data => {
        if (data.data[0]) {
            for (row of data.data)
                filesInsertRow(row);
        }
    });
}

function loadOwnerTable() {
    fetch(`http://localhost:3001/getRecordOwners/?RecordId=${doc_idx}`)
    .then(response => response.json())
    .then(data => {
        if (data.data[0]) {
            for (row of data.data)
                ownersInsertRow(row);
        }
    });
}
