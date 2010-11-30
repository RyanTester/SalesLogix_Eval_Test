using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Security;

public partial class SmartParts_Activity_AddMembers : EntityBoundSmartPartInfoProvider
{
    private Activity Activity
    {
        get { return (Activity)BindingSource.Current; }
    }

    private ActivityFormHelper _ActivityFormHelper;
    private ActivityFormHelper Form
    {
        get { return _ActivityFormHelper; }
    }

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);
        BindingSource.OnCurrentEntitySet += delegate
        {
            _ActivityFormHelper = new ActivityFormHelper((Activity)BindingSource.Current);
        };
    }

    protected override void OnFormBound()
    {
        base.OnFormBound();

        if (IsActivating)
        {
            Form.Reset(Controls);
        }
        PopulateMemberListBoxes();
        Form.Secure(Controls);
    }

    private void PopulateMemberListBoxes()
    {
        if (Activity.Attendees == null) return;

        AvailableMembers.Items.Clear();
        foreach (UserCalendar uc in UserCalendar.GetCurrentUserCalendarList())
        {
            if (uc.AllowAdd != true) continue;

            User user = User.GetById(uc.CalUserId);
            if (user == null) continue;

            string formattedName = user.UserInfo.LastName;
            if (user.UserInfo.FirstName != "")
                formattedName += ", " + user.UserInfo.FirstName;
            ListItem li = new ListItem(formattedName, user.Id.Trim());
            AvailableMembers.Items.Add(li);
        }

        SelectedMembers.Items.Clear();
        foreach (UserActivity ua in Activity.Attendees)
        {
            string formattedName = "Unknown User";
            User user = User.GetById(ua.UserId);
            if (user != null)
            {
                formattedName = user.UserInfo.LastName;

                if (user.UserInfo.FirstName != "")
                    formattedName += ", " + user.UserInfo.FirstName;
            }

            ListItem li = new ListItem(formattedName, ua.UserId.Trim());

            switch (ua.Status)
            {
                case UserActivityStatus.asAccepted:
                    li.Attributes.Add("status", "accepted");
                    break;
                case UserActivityStatus.asDeclned:
                    li.Attributes.Add("style", "color:red");
                    li.Attributes.Add("status", "declined");
                    break;
                case UserActivityStatus.asUnconfirmed:
                    li.Attributes.Add("style", "color:grey");
                    li.Attributes.Add("status", "unconfirmed");
                    break;
            }

            if (li.Value.Trim() == Activity.UserId.Trim())
            {
                li.Attributes.Add("style", "color:Navy; background-color:lightgrey");
                li.Attributes.Add("status", "leader");
            }

            SelectedMembers.Items.Add(li);
            AvailableMembers.Items.Remove(li);
        }
    }

    protected void Add_Click(object sender, EventArgs e)
    {
        ListItemCollection removeList = new ListItemCollection();
        // deselect all items
        foreach (ListItem item in SelectedMembers.Items)
        {
            item.Selected = false;
        }

        for (int i = 0; i < AvailableMembers.Items.Count; i++)
        {
            ListItem li = AvailableMembers.Items[i];
            if (!li.Selected) continue;

            // check to see if user is already selected
            UserActivity attendee = Activity.Attendees.FindAttendee(li.Value);
            if (attendee != null) continue;

            li.Attributes.Add("style", "color:lightgrey");
            li.Attributes.Add("status", "unconfirmed");
            SelectedMembers.Items.Add(li);
            Activity.Attendees.Add(li.Value);
            removeList.Add(li);
        }

        foreach (ListItem li in removeList)
        {
            AvailableMembers.Items.Remove(li);
        }
    }

    protected void Remove_Click(object sender, EventArgs e)
    {
        ListItemCollection removeList = new ListItemCollection();

        // deselect all items
        foreach (ListItem item in AvailableMembers.Items)
        {
            item.Selected = false;
        }

        for (int i = 0; i < SelectedMembers.Items.Count; i++)
        {
            ListItem li = SelectedMembers.Items[i];
            if (!li.Selected) continue;

            UserActivity attendee = Activity.Attendees.FindAttendee(li.Value);
            if (attendee == null) continue;

            foreach (UserActivity ua in Activity.Attendees)
            {
                if (ua.UserId != attendee.UserId) continue;

                Activity.Attendees.Remove(ua.UserId);
                break;
            }
            removeList.Add(li);
            li.Attributes.Clear();
            AvailableMembers.Items.Add(li);
        }

        foreach (ListItem li in removeList)
        {
            SelectedMembers.Items.Remove(li);
        }
    }

    #region EntityBoundSmartPart

    protected override void OnAddEntityBindings()
    {

    }

    public override Type EntityType
    {
        get { return typeof(IActivity); }
    }

    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        // TODO: refactor
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in LeftTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in CenterTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in RightTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion

    protected override void OnRegisterClientScripts()
    {
        base.OnRegisterClientScripts();
        Page.ClientScript.RegisterClientScriptBlock(GetType(),
            "CheckRemoveLeader", BuildCheckRemoveLeaderScript(), true);
    }

    private string BuildCheckRemoveLeaderScript()
    {
        return @" 
function CheckRemoveLeader() {
    var status = '';
    var MemberOptions = document.getElementById('" + SelectedMembers.ClientID + @"').options;
    for (var i=0; i < MemberOptions.length; i++) {
        if (MemberOptions[i].selected) {
            status = MemberOptions[i].getAttribute('status');
            if (status == 'leader')
                break;
        }
    }
    
    if (status == 'leader') {
        alert('" + GetLocalResourceObject("AddMembers_WarningMessage_js") + @"');
        return false;
    }
    return true;
}";
    }
}
