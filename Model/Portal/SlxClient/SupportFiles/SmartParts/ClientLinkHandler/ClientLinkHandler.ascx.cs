using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Common.Syndication.Json;
using Sage.Entity.Interfaces;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.WebPortal.Services;

public partial class SmartParts_ClientLinkHandler_ClientLinkHandler : UserControl
{
    private HiddenField _state;

    public IWebDialogService Dialog
    {
        get { return ((ApplicationPage)Page).PageWorkItem.Services.Get<IWebDialogService>(true); }
    }

    private LinkHandler _LinkHander;
    private LinkHandler Link
    {
        get
        {
            if (_LinkHander == null)
                _LinkHander = new LinkHandler(Page);
            return _LinkHander;
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected override void CreateChildControls()
    {
        _state = new HiddenField();
        _state.ID = ID + "_state";
        _state.ValueChanged += HandleLinkRequest;

        Controls.Add(_state);
    }

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);

        EnsureChildControls();
        ScriptManager.RegisterStartupScript(Page, GetType(), "ClientLinkHandler", GetClientScript(), true);
        ScriptManager sm = ScriptManager.GetCurrent(Page);
        if (sm != null)
        {
            sm.RegisterAsyncPostBackControl(_state);
        }
    }

    private void HandleLinkRequest(object sender, EventArgs e)
    {
        if (_state.Value == string.Empty) return;

        JavaScriptObject jso = (JavaScriptObject)JavaScriptConvert.DeserializeObject(_state.Value);

        string request = GetValue(jso, "request");
        string kind = GetValue(jso, "kind");
        string type = GetValue(jso, "type");
        string id = GetValue(jso, "id");
        Dictionary<string, string> args = GetArgs(jso);

        if (request == "EntityDetail")
        {
            if (kind == "ACTIVITY")
                Link.EditActivity(id);
            else if (kind == "HISTORY")
                Link.EditHistory(id);
            else
                Link.EntityDetail(id, kind);
        }
        
        if (request == "Schedule")
        {
            if (type == "PhoneCall")
                Link.SchedulePhoneCall();
            else if (type == "Meeting")
                Link.ScheduleMeeting();
            else if (type == "ToDo")
                Link.ScheduleToDo();
            else if (type == "PersonalActivity")
                Link.SchedulePersonalActivity();
            else if (type == "CompleteActivity")
                Link.ScheduleCompleteActivity();
        }
        else if (request == "New")
        {
            if (type == "Note")
                Link.NewNote();
        }
        else if (request == "EditActivity")
            Link.EditActivity(id);
        else if (request == "EditActivityOccurrence")
        {
            string recurDate = GetValue(jso, "recurDate");
            DateTime dateTime = Convert.ToDateTime(recurDate);

            Link.EditActivityOccurrencePrompt(id, dateTime);
        }
        else if (request == "EditHistory")
            Link.EditHistory(id);
        else if (request == "CompleteActivity")
            Link.CompleteActivity(id);
        else if (request == "CompleteActivityOccurrence")
        {
            string recurDate = GetValue(jso, "recurDate");
            DateTime dateTime = Convert.ToDateTime(recurDate);

            Link.CompleteActivityOccurrencePrompt(id, dateTime);
        }
        else if (request == "DeleteActivity")
            Link.DeleteActivity(id);
        else if (request == "DeleteActivityOccurrence")
        {
            string recurDate = GetValue(jso, "recurDate");
            DateTime dateTime = Convert.ToDateTime(recurDate);

            Link.DeleteActivityOccurrencePrompt(id, dateTime);
        }
        else if (request == "ScheduleActivity")
            Link.ScheduleActivity(args);
        else if (request == "ConfirmActivity")
        {
            string toUserId = GetValue(jso, "toUserId");
            Link.ConfirmActivity(id, toUserId);
        }
        else if (request == "DeleteConfirmation")
        {
            string notifyId = GetValue(jso, "notifyId");
            Link.DeleteConfirmation(id, notifyId);
        }
        else if (request == "RemoveDeletedConfirmation")
        {
            Link.RemoveDeletedConfirmation(id);
        }
    }

    private static string GetValue(IDictionary<string, object> jso, string key)
    {
        if (jso.ContainsKey(key))
            return jso[key].ToString();
        return null;
    }

    private static Dictionary<string, string> GetArgs(IDictionary<string, object> jso)
    {
        Dictionary<string, string> args = new Dictionary<string, string>();

        if (jso.ContainsKey("args"))
        {
            IDictionary<string, object> jsoArgs = jso["args"] as IDictionary<string, object>;
            if (jsoArgs != null)
            {
                foreach (KeyValuePair<string, object> arg in jsoArgs)
                {
                    args.Add(arg.Key, arg.Value.ToString());
                }
            }
        }
        return args;
    }

    private string GetClientScript()
    {
        return @"
if ($get('" + _state.ClientID + @"')) {
    $get('" + _state.ClientID + @"').value = '';
}

var ClientLinkHandler = {
    request: function(request) {
        var value = Sys.Serialization.JavaScriptSerializer.serialize(request);
        var hiddenField = $get('" + _state.ClientID + @"');
        if (hiddenField) {
            hiddenField.value = value;
            __doPostBack('" + _state.ClientID + @"', '');
        }
    }
};

";
    }
}
