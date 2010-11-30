using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Sage.Platform;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Security;
using Sage.Platform.WebPortal;
using Sage.SalesLogix.Security;
using Sage.Platform.Application.UI;
using Sage.Platform.Configuration;
using System.Xml;
using System.Web.UI;
using Sage.Platform.Data;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Web.Controls;
using Sage.SalesLogix.HighLevelTypes;
using Sage.SalesLogix.PickLists;
using Sage.SalesLogix.Activity;

/// <summary>
/// Summary description for SmartParts_LitRequest_LiteratureRequest
/// </summary>
public partial class SmartParts_LitRequest_LiteratureRequest : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    protected string UserId = "NOTASSIGNED!";
    protected string UserName = "";

    private IEntityHistoryService _EntityHistoryService;
    [ServiceDependency(Type = typeof(IEntityHistoryService), Required = false)]
    public IEntityHistoryService EntityHistoryService
    {
        get
        {
            return _EntityHistoryService;
        }
        set
        {
            _EntityHistoryService = value;
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {

        //if (!IsPostBack)
        {
            RequestedFor.Required = true;
            try
            {
                SLXUserService slxUserService = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as SLXUserService;
                if (slxUserService != null)
                {
                    UserId = slxUserService.GetUser().Id.ToString().Trim();
                    UserName = slxUserService.GetUser().UserInfo.LastName + ", " + slxUserService.GetUser().UserInfo.FirstName;   //UserName;
                }
            }
            catch
            {
                UserId = "ERROR";
                UserName = "Error";
            }
            PopulateTree();
            if (!Page.ClientScript.IsClientScriptIncludeRegistered("LitRequest"))
                Page.ClientScript.RegisterClientScriptInclude("LitRequest", "jscript/LitRequest.js");
            if (!Page.ClientScript.IsClientScriptIncludeRegistered("XMLSupport"))
                Page.ClientScript.RegisterClientScriptInclude("XMLSupport", "jscript/XMLSupport.js");
            Page.ClientScript.RegisterClientScriptBlock(this.GetType(), "LitRequestWarnings", BuildLitRequestWarnings(), true);
            PopulateRequestedFor();
            btnSave.Attributes.Add("onclick", "return getValues(this);");
            lblRequestedBy.Text = String.Format(GetLocalResourceObject("RequestedByOn.Text").ToString(), UserName, DateTime.Now.ToShortDateString());
            btnSave.Click += new ImageClickEventHandler(submit);
            TemplateFindIcon.Attributes["onclick"] = "ShowPanel()";
            PopulateLitItems();
        }
        if (!IsPostBack)
        {
            SendBy.DateTimeValue = DateTime.Now;
            SetPickListDefault(SendVia);
            SetPickListDefault(Priority);
            //Set focus on the top element in the form
            RequestedFor.Focus();
        }
    }

    private string BuildLitRequestWarnings()
    {
        StringBuilder script = new StringBuilder();
        script.AppendFormat("LitWarning_SelectTemplate = '{0}';",
                            PortalUtil.JavaScriptEncode(GetLocalResourceObject("LitWarning_SelectTemplate").ToString()));
        script.AppendFormat("LitWarning_UnableToParseQuantity = '{0}';",
                            PortalUtil.JavaScriptEncode(GetLocalResourceObject("LitWarning_UnableToParseQuantity").ToString()));
        script.AppendFormat("LitWarning_QtyGreaterThanZero = '{0}';",
                            PortalUtil.JavaScriptEncode(GetLocalResourceObject("LitWarning_QtyGreaterThanZero").ToString()));
        script.AppendFormat("LitWarning_MaxOneBillion = '{0}';",
                            PortalUtil.JavaScriptEncode(GetLocalResourceObject("LitWarning_MaxOneBillion").ToString()));
        script.AppendFormat("LitWarning_MustSelectTemplate = '{0}';",
                            PortalUtil.JavaScriptEncode(GetLocalResourceObject("LitWarning_MustSelectTemplate").ToString()));
        script.AppendFormat("LitWarning_SendByDate = '{0}';",
                            PortalUtil.JavaScriptEncode(GetLocalResourceObject("LitWarning_SendByDate").ToString()));
        script.AppendFormat("LitWarning_SelectContact = '{0}';",
                            PortalUtil.JavaScriptEncode(GetLocalResourceObject("LitWarning_SelectContact").ToString()));
        script.AppendFormat("LitWarning_DescriptionLessThan64 = '{0}';",
                            PortalUtil.JavaScriptEncode(GetLocalResourceObject("LitWarning_DescriptionLessThan64").ToString()));
        return script.ToString();
    }

    private void SetPickListDefault(Sage.SalesLogix.Web.Controls.PickList.PickListControl plc)
    {
        if (plc.PickListValue == "")
        {
            PickList sv = PickList.GetPickListById(PickList.PickListIdFromName(plc.PickListName));
            if (sv.Defaultindex.Value >= 0)
            {
                IList<PickList> vals = PickList.GetPickListItemsByName(plc.PickListName);
                plc.PickListValue = vals[sv.Defaultindex.Value].Text;
            }
        }
    }

    private void PopulateRequestedFor()
    {
        if (this.EntityHistoryService != null)
        {
            string conid = ""; //this.EntityHistoryService.GetLastIdForType<IContact>().ToString();
            foreach (EntityHistory eh in this.EntityHistoryService)
            {
                if (eh.EntityType.Name.ToUpper() == "ICONTACT")
                {
                    conid = eh.EntityId.ToString();
                    break;
                }
                if (eh.EntityType.Name.ToUpper() == "ITICKET")
                {
                    conid = EntityFactory.GetById<ITicket>(eh.EntityId).Contact.Id.ToString();
                    break;
                }
                if (eh.EntityType.Name.ToUpper() == "IOPPORTUNITY")
                {
                    IEnumerator<IOpportunityContact> cons = EntityFactory.GetById<IOpportunity>(eh.EntityId).Contacts.GetEnumerator();
                    while (cons.MoveNext())
                    {
                        if (cons.Current.IsPrimary == true)
                            conid = cons.Current.Contact.Id.ToString();
                    }
                    break;
                }
                if (eh.EntityType.Name.ToUpper() == "IACCOUNT")
                {
                    IEnumerator<IContact> cons = EntityFactory.GetById<IAccount>(eh.EntityId).Contacts.GetEnumerator();
                    while (cons.MoveNext())
                    {
                        if (cons.Current.IsPrimary == true)
                            conid = cons.Current.Id.ToString();
                    }
                    break;
                }
            }
            if ((conid != ""))
            {
                RequestedFor.LookupResultValue = EntityFactory.GetById<IContact>(conid);
            }
        }
    }

    private void PopulateLitItems()
    {
        string SQL = "SELECT ITEMNAME, ITEMFAMILY, COST, LITERATUREID, LITERATUREID AS ID FROM LITERATURE";
        IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IDataService>();
        using (var conn = service.GetOpenConnection())
        using (var cmd = conn.CreateCommand(SQL))
        using (var reader = cmd.ExecuteReader())
        {
            LiteratureItems.DataSource = reader;
            LiteratureItems.DataBind();
        }
    }

    private void PopulateTree()
    {
        XmlDocument xmlTemplates = new XmlDocument();
        xmlTemplates.LoadXml("<Templates><personal></personal><public></public></Templates>");
        string SQL = "SELECT PLUGINID, NAME, TEMPLATE, USERID FROM PLUGIN WHERE TYPE = 25  AND (DATACODE = 'CONTACT' OR DATACODE IS NULL OR DATACODE = '') ORDER BY USERID, FAMILY";
        IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IDataService>();
        XmlNode cur = xmlTemplates.SelectSingleNode("/Templates");

        using (var conn = service.GetOpenConnection())
        using (var cmd = conn.CreateCommand(SQL))
        using (var reader = cmd.ExecuteReader())
        {
            string sUid = "";
            string sFam = "";
            string selectString = "";
            while (reader.Read())
            {
                if (sUid != reader.GetString(3).Trim())
                {
                    sUid = reader.GetString(3).Trim();
                    if (sUid == UserId)
                    {
                        selectString = "/Templates/personal";
                    }
                    else
                    {
                        selectString = "/Templates/public";
                    }
                    sFam = ""; // since we are starting a new branch, we need to make sure we get a new family branch
                }
                if (sFam != reader.GetString(2))
                {
                    sFam = reader.GetString(2);
                    XmlElement xFam = xmlTemplates.CreateElement(sFam);
                    cur = xmlTemplates.SelectSingleNode(selectString);
                    cur.AppendChild(xFam);
                    cur = xFam;
                }
                XmlNode xItem = xmlTemplates.CreateElement("item");
                XmlAttribute itemAttr = xmlTemplates.CreateAttribute("litid");
                itemAttr.Value = reader.GetString(0);
                xItem.Attributes.Append(itemAttr);
                itemAttr = xmlTemplates.CreateAttribute("name");
                itemAttr.Value = reader.GetString(1);
                xItem.Attributes.Append(itemAttr);
                cur.AppendChild(xItem);
            }
        }
        templateXmlDoc.DocumentContent = xmlTemplates.OuterXml;
    }

    private void PopFormValues()
    {
        string[] frmSendBy = Request.Form[SendBy.ClientID + "_Hidden"].Split(',');
        if (frmSendBy.Length == 5)
            SendBy.DateTimeValue = new DateTime(Int32.Parse(frmSendBy[0]), Int32.Parse(frmSendBy[1]), Int32.Parse(frmSendBy[2]),
                                                Int32.Parse(frmSendBy[3]), Int32.Parse(frmSendBy[4]), 0);
        //SendVia.PickListValue = Request.Form[SendVia.ClientID.Replace('_', '$') + "$code"];
        //Priority.PickListValue = Request.Form[Priority.ClientID.Replace('_', '$') + "$code"];
    }
    protected void submit(object sender, EventArgs e)
    {
        //PopFormValues(); // in case sendby isn't populated
        if (SendBy.DateTimeValue < DateTime.Now.AddDays(-1))
            return;
        if (RequestedFor.LookupResultValue != null)
        {
            Sage.Platform.Application.IContextService conserv = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Application.IContextService>(true);
            Sage.Platform.TimeZone tz = (Sage.Platform.TimeZone)conserv.GetContext("TimeZone");

            ILitRequest lr = EntityFactory.Create<ILitRequest>();
            SLXUserService slxUserService = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as SLXUserService;
            if (slxUserService != null)
            {
                lr.RequestUser = slxUserService.GetUser();
            }
            String[] arClientData = clientdata.Value.ToString().Split('|');
            lr.RequestDate = DateTime.Now.AddMinutes(tz.BiasForGivenDate(DateTime.Now));
            lr.CoverId = arClientData[0];
            lr.Contact = (IContact)RequestedFor.LookupResultValue;
            lr.ContactName = lr.Contact.LastName + ", " + lr.Contact.FirstName;
            lr.Description = Description.Text;
            lr.SendDate = SendBy.DateTimeValue;
            lr.SendVia = SendVia.PickListValue;
            lr.Priority = Priority.PickListValue;
            lr.Options = PrintLiteratureList.SelectedIndex;
            lr.Save();

            Activity act = new Activity();
            act.Type = ActivityType.atLiterature;
            act.AccountId = lr.Contact.Account.Id.ToString();
            act.AccountName = lr.Contact.Account.AccountName;
            act.ContactId = lr.Contact.Id.ToString();
            act.ContactName = lr.ContactName;
            act.PhoneNumber = lr.Contact.WorkPhone;
            act.StartDate = (DateTime)lr.RequestDate;
            act.Duration = 0;
            act.Description = lr.Description;
            act.Alarm = false;
            act.Timeless = true;
            act.Rollover = false;
            act.UserId = lr.RequestUser.Id.ToString();
            act.OriginalDate = (DateTime)lr.RequestDate;
            act.Save();

            //no lit items entitiy, so.... 
            double totalCost = 0.0;
            string SQL = "INSERT INTO LITREQUESTITEM (LITREQID, LITERATUREID, QTY) VALUES (?,?,?)"; //@Litreqid, @Literatureid, @Qty)";
            IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IDataService>();
            var conn = service.GetOpenConnection();
            try
            {
                var cmd = conn.CreateCommand();
                var factory = service.GetDbProviderFactory();
                for (int i = 1; i < arClientData.Length; i++)
                {
                    cmd.CommandText = SQL;
                    int qty = Int32.Parse(arClientData[i].ToString().Split('=')[1]);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(factory.CreateParameter("@Litreqid", act.Id));
                    cmd.Parameters.Add(factory.CreateParameter("@Literatureid", arClientData[i].ToString().Split('=')[0]));
                    cmd.Parameters.Add(factory.CreateParameter("@Qty", qty));
                    cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    cmd.CommandText = "SELECT COST FROM LITERATURE WHERE LITERATUREID = ?";
                    cmd.Parameters.Add(factory.CreateParameter("@Litid", arClientData[i].ToString().Split('=')[0]));
                    string costText = cmd.ExecuteScalar().ToString();
                    if (string.IsNullOrEmpty(costText))
                        costText = "0.00";
                    totalCost += qty * Double.Parse(costText);
                }
                cmd.CommandText = "SELECT NAME FROM PLUGIN WHERE PLUGINID = ?";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(factory.CreateParameter("@Litid", lr.CoverId));
                object coverName = cmd.ExecuteScalar();
                if (coverName == null)
                {
                    lr.CoverName = "";
                }
                else
                {
                    lr.CoverName = coverName.ToString();
                }
                lr.TotalCost = totalCost;
                lr.Save();  //must make ids match, and id prop is read only, so....
                cmd.CommandText = String.Format("UPDATE LITREQUEST SET LITREQID = '{0}' WHERE LITREQID = '{1}'", act.Id.ToString(), lr.Id.ToString());
                cmd.Parameters.Clear();
                cmd.ExecuteNonQuery();
            }
            finally
            {
                conn.Close();
            }
            Response.Redirect("Contact.aspx?entityId=" + lr.Contact.Id.ToString());
        }
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in this.LitRequest_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

}
