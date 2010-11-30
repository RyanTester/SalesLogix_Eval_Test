using System;
using System.Text;
using System.Web.UI;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Attachment;

namespace Sage.SalesLogix.Client.MailMerge
{
    /// <summary>
    /// Summary description for EmailPromptForHistory
    /// </summary>
    public partial class EmailPromptForHistory : Page
    {
        // ReSharper disable InconsistentNaming
        private string _historyId = "";
        private string _mainTable = "";
        // ReSharper restore InconsistentNaming

        public Boolean IsLead { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            var clientGroupContext = new GroupBuilder.ClientGroupContextService();
            Page.Form.Controls.Add(clientGroupContext);
            if (!ApplicationContext.Current.Services.Contains(clientGroupContext.GetType()))
                ApplicationContext.Current.Services.Add(clientGroupContext);

            Timeless.CheckedChanged += Timeless_ChangeAction;
            btnOk.Click += BtnOk_ClickAction;
            btnCancel.Click += BtnCancelClick;

            _mainTable = Request.Params["maintable"];
            if (!string.IsNullOrEmpty(_mainTable))
            {
                if (_mainTable.ToUpper() == "LEAD")
                {
                    IsLead = true;
                }
            }

            if (!IsPostBack)
            {
                History hist = GetHistoryRecord();
                Completed.DateTimeValue = hist.CompletedDate;
                Scheduled.DateTimeValue = hist.StartDate;
                Duration.Value = ((hist.Duration == 0) ? 1 : hist.Duration);
                Timeless.Checked = hist.Timeless;
                if (!IsLead)
                {
                    luContact.LookupResultValue = hist.ContactId;
                    luContact.SeedValue = hist.AccountId;
                    luOpportunity.LookupResultValue = hist.OpportunityId;
                    luOpportunity.SeedValue = hist.AccountId;
                    luTicket.LookupResultValue = hist.TicketId;
                    luTicket.SeedValue = hist.AccountId;
                    luAccount.LookupResultValue = hist.AccountName;
                }
                else
                {
                    ContactIdDiv.Style.Value = "display:none";
                    OpportunityIdDiv.Style.Value = "display:none";
                    TicketIdDiv.Style.Value = "display:none";
                    AccountIdDiv.Style.Value = "display:none";
                    LeadIdDiv.Style.Value = "";
                    luLead.LookupResultValue = hist.LeadId;
                    FollowUp.Enabled = false;
                    CarryOverNotes.Enabled = false;
                }
                Description.PickListValue = hist.Description;
                Notes.Text = hist.LongNotes;
                Priority.PickListValue = hist.Priority;
                Category.PickListValue = hist.Category;
                CreateUser.LookupResultValue = hist.CreateUser;
                Result.PickListValue = string.IsNullOrEmpty(hist.Result) ? "Complete" : hist.Result;
            }
        }

        protected void Page_PreRender(object sender, EventArgs e)
        {
            luContact.InitializeLookup = (luContact.SeedValue.Length == 12);
            luAccount.InitializeLookup = (luAccount.SeedValue.Length == 12);
            luOpportunity.InitializeLookup = (luOpportunity.SeedValue.Length == 12);
            luTicket.InitializeLookup = (luTicket.SeedValue.Length == 12);
        }

        void BtnCancelClick(object sender, EventArgs e)
        {
            History hist = GetHistoryRecord();
            hist.Delete();
        }

        private History GetHistoryRecord()
        {
            if (_historyId == "")
            {
                _historyId = Request.Params.Get("historyid");
            }
            string entityid = Request.Params.Get("entityid");
            if ((_historyId == null) && (entityid != null && entityid[0].ToString().ToUpper() == "H"))
                _historyId = entityid;
            History hist = null;
            if (_historyId != null)
            {
                hist = (History)EntityFactory.GetById<IHistory>(_historyId);
            }
            if (hist == null)
            {
                hist = new History();
                DateTime dtNow = DateTime.UtcNow;
                hist.StartDate = dtNow;
                hist.CompletedDate = dtNow;
                hist.OriginalDate = dtNow;
                hist.LongNotes = string.Empty;
                string ticketid = Request.Params.Get("ticketid");
                string oppid = Request.Params.Get("oppid");
                if (entityid != null)
                {
                    if (entityid[0] == 'A') hist.AccountId = entityid;
                    if (entityid[0] == 'C')
                    {
                        hist.ContactId = entityid;
                        hist.AccountId = EntityFactory.GetById<IContact>(entityid).Account.Id.ToString();
                    }
                    if (IsLead)
                    {
                        hist.LeadId = entityid;
                    }
                }
                if ((ticketid != null) && (ticketid.Length == 12)) hist.TicketId = ticketid;
                if ((oppid != null) && (oppid.Length == 12)) hist.OpportunityId = oppid;
                var slxUserService = ApplicationContext.Current.Services.Get<Platform.Security.IUserService>(true);
                if (slxUserService != null)
                {
                    hist.CreateUser = slxUserService.UserId;
                    hist.UserId = hist.CreateUser;
                    hist.Timeless = false;
                    hist.Duration = 1;
                    hist.Type = HistoryType.atEMail;
                }
            }
            return hist;
        }


        protected void Timeless_ChangeAction(object sender, EventArgs e)
        {
            History hist = GetHistoryRecord();
            hist.Timeless = Timeless.Checked;
            hist.Save();
            Duration.Enabled = !hist.Timeless;
        }

        protected void BtnOk_ClickAction(object sender, EventArgs e)
        {
            History hist = GetHistoryRecord();
            hist.CompletedDate = (Completed.DateTimeValue != null)
                                     ? Completed.DateTimeValue.Value.ToUniversalTime()
                                     : DateTime.UtcNow;
            hist.StartDate = (Scheduled.DateTimeValue != null)
                                 ? Scheduled.DateTimeValue.Value.ToUniversalTime()
                                 : DateTime.UtcNow;
            AddFormValues(hist);
            hist.Save();
            Rules.UpdateAttachmentsRelatedToHistory(hist);
            ScheduleFollowUp(hist);
            CreateTicketActivity(hist);
        }

        // ReSharper disable SuggestBaseTypeForParameter
        private void ScheduleFollowUp(History hist)
        // ReSharper restore SuggestBaseTypeForParameter
        {
            var sb = new StringBuilder();
            if (FollowUp.SelectedValue != "None")
            {
                sb.Append("var args = new Object();");

                sb.Append("args['type'] = '" + FollowUp.SelectedValue + "';");

                if (CarryOverNotes.Checked)
                {
                    sb.Append("args['historyid'] = '" + hist.Id + "';");
                    sb.Append("args['carryovernotes'] = true;");
                }

                sb.Append("args['aid'] = '" + hist.AccountId + "';");
                sb.Append("args['cid'] = '" + hist.ContactId + "';");
                sb.Append("args['oid'] = '" + hist.OpportunityId + "';");
                sb.Append("args['tid'] = '" + hist.TicketId + "';");
                sb.Append("args['lid'] = '" + hist.LeadId + "';");
                sb.Append("var opener = window.dialogArguments;");
                sb.Append("opener.Link.scheduleActivity(args);");
            }

            sb.Append("window.close();");
            ScriptManager.RegisterStartupScript(this, GetType(), "activitydialogscript", sb.ToString(), true);
        }

        // ReSharper disable SuggestBaseTypeForParameter
        private void AddFormValues(History hist)
        // ReSharper restore SuggestBaseTypeForParameter
        {
            hist.StartDate = Scheduled.DateTimeValue.Value;
            hist.CompletedDate = Completed.DateTimeValue.Value;
            hist.Duration = Duration.Value;
            hist.Timeless = Timeless.Checked;
            if (luContact.LookupResultValue != null)
                hist.ContactId = GetIdVal(luContact.LookupResultValue);
            if (luOpportunity.LookupResultValue != null)
                hist.OpportunityId = GetIdVal(luOpportunity.LookupResultValue);
            if (luTicket.LookupResultValue != null)
                hist.TicketId = GetIdVal(luTicket.LookupResultValue);
            hist.Description = Description.PickListValue;
            hist.LongNotes = Notes.Text;
            hist.Priority = Priority.PickListValue;
            hist.Category = Category.PickListValue;
            if (CreateUser.LookupResultValue != null)
            {
                hist.CreateUser = GetIdVal(CreateUser.LookupResultValue);
                hist.UserId = hist.CreateUser;
            }
            if (Request.QueryString["mmtype"] == "fax")
                hist.Type = HistoryType.atFax;
            if (Request.QueryString["mmtype"] == "letter")
                hist.Type = HistoryType.atDoc;
            hist.Result = Result.PickListValue;
        }

        private static string GetIdVal(object val)
        {
            if (val != null)
            {
                if (val is Platform.ComponentModel.IComponentReference)
                {
                    return ((Platform.ComponentModel.IComponentReference)val).Id.ToString();
                }
                return val.ToString();
            }
            return null;
        }

        protected void CreateTicketActivity(IHistory history)
        {
            TicketActivity.Rules.AddTicketActivityFromCompletedActivity(null, history.UserId, history.Result, history.ResultCode, history.CompletedDate, ref history);
        }

        public Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
        {
            var tinfo = new Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
            foreach (Control c in CompleteActivity_LTools.Controls)
            {
                tinfo.LeftTools.Add(c);
            }
            foreach (Control c in CompleteActivity_CTools.Controls)
            {
                tinfo.CenterTools.Add(c);
            }
            foreach (Control c in CompleteActivity_RTools.Controls)
            {
                tinfo.RightTools.Add(c);
            }
            tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Task_List_3D_32x32.gif"); return tinfo;
        }

    }
}