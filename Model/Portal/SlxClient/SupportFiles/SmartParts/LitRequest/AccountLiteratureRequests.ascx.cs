using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using Sage.Platform;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Security;
using Sage.SalesLogix.Security;
using Sage.Platform.Application.UI;
using Sage.Platform.Configuration;
using Sage.Platform.Data;
using System.Data.OleDb;
using System.Xml;
using System.Web.UI;
using Sage.Platform.WebPortal.SmartParts;

/// <summary>
/// Summary description for SmartParts_LitRequest_AccountLiteratureRequests
/// </summary>
public partial class SmartParts_LitRequest_AccountLiteratureRequests : EntityBoundSmartPartInfoProvider //System.Web.UI.UserControl, ISmartPartInfoProvider
{

    private IEntityContextService _EntityService;
    [ServiceDependency(Type = typeof(IEntityContextService), Required = true)]
    public IEntityContextService EntityService
    {
        get
        {
            return _EntityService;
        }
        set
        {
            _EntityService = value;
        }
    }


    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        btnAddLitRequest.Click += new ImageClickEventHandler(btnAddLitRequest_ClickAction);
        if (this.Visible)
        {
            PopulateGrid();
        }
    }

    protected void btnAddLitRequest_ClickAction(object sender, EventArgs e)
    {
        Page.Response.Redirect("Literature.aspx?modeid=Insert");
    }


    private void PopulateGrid()
    {
        string SQL = "SELECT REQDATE, CONTACTNAME, REQUSER, DESCRIPTION, SENDVIA, PRIORITY, LITREQID AS ID FROM LITREQUEST L WHERE CONTACTID IN (SELECT CONTACTID FROM CONTACT WHERE ACCOUNTID = ?)";
        IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IDataService>();
        using (var conn = service.GetOpenConnection())
        using (var cmd = new OleDbCommand(SQL, conn as OleDbConnection))
        {
            cmd.Parameters.AddWithValue("@AccountId", _EntityService.EntityID.ToString());
            DataTable table = new DataTable();
            using (var reader = cmd.ExecuteReader())
                table.Load(reader);
            LiteratureRequests.DataSource = table;
            LiteratureRequests.DataBind();
        }

    }


    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in this.LitRequests_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.LitRequests_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.LitRequests_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.ILitRequest); }
    }

    protected override void OnAddEntityBindings()
    {
        //nothing to do
    }

}
