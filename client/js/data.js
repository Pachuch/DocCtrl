export let user = {
    UserID : undefined,
    Username : undefined,
    Email : undefined,
    Password : undefined,
    Fullname : undefined,
    Position : undefined,
    Phone : undefined,
    Access : undefined,
    RegistrationDate : undefined,
    Deleted : undefined
}

export let fileinfo = {
    FileID : undefined,
    Name : undefined,
    Type : undefined
}

export let report = {
    ReportID : undefined,
    Owner : user,
    Header : undefined,
    ChangeDate : undefined,
    Files : []
}

export let clause = {
    ClauseID : undefined,
    Body : undefined,
    Performers : [],
    Reports : []
}

export let record = {
    RecordID : undefined,
    Owner : user,
    Number : undefined,
    Header : undefined,
    Basis : undefined,
    Clauses : [],
    AccessStamp : undefined,
    Validation : undefined,
    DocumentDate : undefined,
    ChangeDate : undefined,
    Status : undefined
}


