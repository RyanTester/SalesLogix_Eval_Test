
Email = function (emailID, email, autoPostBack)
{
    this.emailID = emailID;
    this.email = new emailProp(email, this);
    this.AutoPostBack = autoPostBack;
}

function Email_FormatEmail(val)
{
    var elem = document.getElementById(this.emailID);
    elem.value = val;
}

function Email_FormatEmailChange(ID)
{
    var elem = document.getElementById(this.emailID);
    if (this.email.get != elem.value)
    {
        this.email.set(elem.value);
        this.email.onChange.fire();
        if (this.AutoPostBack)
        {
            if (Sys)
            {
                Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.emailID, null);
            }
            else
            {
                document.forms(0).submit();
            }
        }
    }
}

emailProp = function(val, parentElem)
{
    this.parentElement = parentElem;
    this.value = val;
    this.onChange = new YAHOO.util.CustomEvent("change", this);
}

emailProp.prototype.set = function(val)
{
    this.value = val;
    this.parentElement.FormatEmail(val);
}

emailProp.prototype.get = function()
{
    return this.value;
}

function SendEmail(ID)
{
    var email = document.getElementById(ID);
    var sEmail = email.value;
    sEmail = "mailto:" + sEmail;
    document.location.href = sEmail;
}

function SendEmailFromLabel(ID)
{
    var email = document.getElementById(ID);
    var sEmail = email.innerHTML;
    sEmail = "mailto:" + sEmail;
    document.location.href = sEmail;
}

Email.prototype.FormatEmail = Email_FormatEmail;
Email.prototype.FormatEmailChange = Email_FormatEmailChange;