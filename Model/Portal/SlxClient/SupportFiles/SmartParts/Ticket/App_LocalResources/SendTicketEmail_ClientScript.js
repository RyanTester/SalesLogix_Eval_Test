
var EmailTicket = function (contactEmail, assignedToEmail, acctMgrEmail, myMgrEmail, emailSubject, emailBody)
{
    this.contactEmail = contactEmail
    this.assignedToEmail = assignedToEmail;
    this.acctMgrEmail = acctMgrEmail;
    this.myMgrEmail = myMgrEmail;
    this.emailSubject = emailSubject;
    this.emailBody = emailBody;
}

function SendTicketEmail(emailType, emailContact, emailAssignedTo, emailAccountMgr, emailMyManager)
{
    var addressTo = "";
    var addressCC = "";
    var emailBody = " ";
    if (document.getElementById(emailContact).checked)
    {
        addressTo += ((this.contactEmail == "") ? "" : this.contactEmail + ";");
        if (document.getElementById(emailAssignedTo).checked)
            addressCC += ((this.assignedToEmail == "") ? "" : this.assignedToEmail + ";");
        if (document.getElementById(emailAccountMgr).checked)
            addressCC += ((this.acctMgrEmail == "") ? "" : this.acctMgrEmail + ";");
        if (document.getElementById(emailMyManager).checked)
            addressCC += ((this.myMgrEmail == "") ? "" : this.myMgrEmail + ";");
    }
    else
    {
        if (document.getElementById(emailAssignedTo).checked)
            addressTo += ((this.assignedToEmail == "") ? "" : this.assignedToEmail + ";");
        if (document.getElementById(emailAccountMgr).checked)
            addressTo += ((this.acctMgrEmail == "") ? "" : this.acctMgrEmail + ";");
        if (document.getElementById(emailMyManager).checked)
            addressTo += ((this.myMgrEmail == "") ? "" : this.myMgrEmail + ";");
    }
    
    var radioList = document.getElementById(emailType);
    var options = radioList.getElementsByTagName('input');
    if (options[0].checked) //Ticket info
    {
        emailBody = this.emailBody;
    }
    var sEmail = String.format("mailto:{0}?subject={1}&body={2}&cc={3}", addressTo, this.emailSubject, emailBody, addressCC);
    location.href = sEmail;
}

EmailTicket.prototype.SendTicketEmail = SendTicketEmail;   

function sendEmail(emailType, emailContact, emailAssignedTo, emailAccountMgr, emailMyManager)
{
    @emailTicketId.SendTicketEmail(emailType, emailContact, emailAssignedTo, emailAccountMgr, emailMyManager);
}
  