<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="System.Data.Common"%>
<%@ Import namespace="Sage.Platform.WebPortal"%>
<%@ Control Language="C#" ClassName="AccountDetails" Inherits="Sage.Platform.WebPortal.SmartParts.EntityBoundSmartPartInfoProvider" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Data" Namespace="System.Data.OleDb" TagPrefix="OleDb" %>

<div style="display:none">
<asp:Panel ID="LitRequestForm_RTools" runat="server" meta:resourcekey="LitRequestForm_RToolsResource1">
    <asp:ImageButton runat="server" ID="btnDelLitRequest" ToolTip="Delete Literature Request" 
        ImageUrl="~\images\icons\delete_16X16.gif" meta:resourcekey="btnDelLitRequest_rsc" />
    <SalesLogix:PageLink ID="lnkLiteratureRequestHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="litreqinfo.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</asp:Panel>
</div>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
  <col width="50%" /><col width="50%" />
<tr>
    <td>  
        <div class="lbl alignleft"><asp:Label ID="RequestUser_lz" meta:resourcekey="RequestUser_lz" AssociatedControlID="RequestUser" runat="server" Text="Requesed By:"></asp:Label></div>
        <div class="textcontrol user">
            <SalesLogix:SlxUserControl runat="server" ID="RequestUser" DisplayMode="AsText" />
        </div> 
    </td>
	<td>  
        <div class="lbl"><asp:Label ID="RequestDate_lz" meta:resourcekey="RequestDate_lz" AssociatedControlID="RequestDate" runat="server" Text="To Be Filled By:"></asp:Label></div>
        <div class="textcontrol datepicker">
			<SalesLogix:DateTimePicker runat="server" ID="RequestDate" DisplayTime="False" AutoPostBack="False" DateTimeValue="01/01/0001 07:00:00" DisplayDate="True" DisplayMode="AsControl" Enable24HourTime="False" meta:resourcekey="RequestDateResource1" Text="3/16/2007" />
		</div> 
	</td>
</tr>
<tr>
<td>  
        <div class="lbl"><asp:Label ID="Description_lz" meta:resourcekey="Description_lz" AssociatedControlID="Description" runat="server" Text="Description:"></asp:Label></div>
        <div class="textcontrol">
<asp:TextBox runat="server" ID="Description" meta:resourcekey="DescriptionResource1"  />

</div> 
</td>
<td>  
        <div class="lbl"><asp:Label ID="Priority_lz" meta:resourcekey="Priority_lz" AssociatedControlID="Priority" runat="server" Text="Priority:"></asp:Label></div>
        <div class="textcontrol">
<asp:TextBox runat="server" ID="Priority" meta:resourcekey="PriorityResource1"  />

</div> 
</td>
</tr>
<tr>
<td>
        <div class="lbl"><asp:Label ID="ContactName_lz" meta:resourcekey="ContactName_lz" AssociatedControlID="ContactName" runat="server" Text="Contact:"></asp:Label></div>
        
<table class="slxlinkcontrol "><tr><td> <SalesLogix:PageLink runat="server" ID="ContactName" NavigateUrl="Contact" LinkType="EntityAlias" />
</td></tr></table>
 
</td>
<td>  
        <div class="lbl"><asp:Label ID="SendDate_lz" meta:resourcekey="SendDate_lz" AssociatedControlID="SendDate" runat="server" Text="Send by:"></asp:Label></div>
        <div class="textcontrol datepicker">
<SalesLogix:DateTimePicker runat="server" ID="SendDate" DisplayTime="False" AutoPostBack="False" DateTimeValue="01/01/0001 07:00:00" DisplayDate="True" DisplayMode="AsControl" Enable24HourTime="False" meta:resourcekey="SendDateResource1" Text="3/16/2007" />

</div> 
</td>
</tr>
<tr>
<td>  
        <div class="lbl"><asp:Label ID="AccountName_lz" meta:resourcekey="AccountName_lz" AssociatedControlID="AccountName" runat="server" Text="Account:"></asp:Label></div>
<table class="slxlinkcontrol "><tr><td> <SalesLogix:PageLink runat="server" ID="AccountName" NavigateUrl="Account" LinkType="EntityAlias" />
</td></tr></table>
</td>
<td>  
        <div class="lbl"><asp:Label ID="FillStatus_lz" meta:resourcekey="FillStatus_lz" AssociatedControlID="FillStatus" runat="server" Text="Status:"></asp:Label></div>
        <div class="textcontrol">
<asp:TextBox runat="server" ID="FillStatus" meta:resourcekey="FillStatusResource1"  />

</div> 
</td>
</tr>
<tr>
<td>  
        <div class="lbl"><asp:Label ID="CoverName_lz" meta:resourcekey="CoverName_lz" AssociatedControlID="CoverName" runat="server" Text="Cover Letter:"></asp:Label></div>
        <div class="textcontrol">
<asp:TextBox runat="server" ID="CoverName" meta:resourcekey="CoverNameResource1"  />

</div> 
</td>
<td>  
        <div class="lbl"><asp:Label ID="FillDate_lz" meta:resourcekey="FillDate_lz" AssociatedControlID="FillDate" runat="server" Text="Fill Date:"></asp:Label></div>
        <div class="textcontrol datepicker">
<SalesLogix:DateTimePicker runat="server" ID="FillDate" DisplayTime="False" AutoPostBack="False" DateTimeValue="01/01/0001 07:00:00" DisplayDate="True" DisplayMode="AsControl" Enable24HourTime="False" meta:resourcekey="FillDateResource1" Text="3/16/2007" />

</div> 
</td>
</tr>
<tr>
<td>  
        <div class="lbl"><asp:Label ID="TotalCost_lz" meta:resourcekey="TotalCost_lz" AssociatedControlID="TotalCost" runat="server" Text="Total Cost:"></asp:Label></div>
        <div class="textcontrol currency">
<SalesLogix:Currency runat="server" ID="TotalCost" Enabled="false" ExchangeRateType="BaseRate" DisplayCurrencyCode="false"  />
</div> 
</td>
<td>  
    <div class="lbl"><asp:Label ID="FillUser_lz" meta:resourcekey="FillUser_lz" AssociatedControlID="FillUser" runat="server" Text="Fulfilled by:"></asp:Label></div>
    <div class="textcontrol user">
            <SalesLogix:SlxUserControl runat="server" ID="FillUser" DisplayMode="AsText" />
    </div> 
</td>
  </tr>
<tr>
  
  
  </tr>
<tr>
<td colspan="2" style="padding-top:20px;">  
       
<SalesLogix:SlxGridView runat="server" ID="LitRequestGrid" GridLines="None"
AutoGenerateColumns="False" CellPadding="4" CssClass="datagrid"
AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="True"
EmptyTableRowText="No Literature Items found." 
meta:resourcekey="LitRequestForm_7_rsc" 
 >
<Columns>
            <asp:BoundField DataField="QUANTITY" HeaderText="Quantity" ReadOnly="True" meta:resourcekey="BoundFieldResource1"/>
           <asp:BoundField DataField="NAME" meta:resourcekey="ItemName_lz" HeaderText="Item Name" ReadOnly="True" >
                <headerstyle width="150px" />
            </asp:BoundField>
            <asp:BoundField DataField="FAMILY" HeaderText="Family" SortExpression="FAMILY" meta:resourcekey="Family_lz" />
            <asp:BoundField DataField="COST" HeaderText="Cost" ReadOnly="True" DataFormatString="{0:C}" HtmlEncode="false" meta:resourcekey="BoundFieldResource2"/>
</Columns>
    <RowStyle CssClass="rowlt" />
    <AlternatingRowStyle CssClass="rowdk" />
</SalesLogix:SlxGridView>

 
</td>
  </tr>
</table>

<script runat="server" type="text/C#">
    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        btnDelLitRequest.Click += btnDelLitRequest_ClickAction;
        if (Visible)
        {
            string SQL = "SELECT LRI.QTY as QUANTITY, L.ITEMNAME as NAME, L.ITEMFAMILY as FAMILY, L.COST as COST FROM LITREQUESTITEM LRI, LITERATURE L WHERE (LRI.LITERATUREID = L.LITERATUREID) AND (LRI.LITREQID = ?)";
            Sage.Platform.Data.IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Data.IDataService>();

            using (var conn = service.GetConnection())
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
                using (var cmd = new OleDbCommand(SQL, conn as OleDbConnection))
                {
                    cmd.Parameters.AddWithValue("@LitReqId", Page.Request.Params["entityId"]);
                    using (var reader = cmd.ExecuteReader())
                    {
                        LitRequestGrid.DataSource = reader;
                        LitRequestGrid.DataBind();
                    }
                }
            }

            foreach (Object c in Controls)
                if (c.GetType() == typeof(TextBox))
                    ((TextBox)c).ReadOnly = true;
            if (!IsPostBack)
            {
                btnDelLitRequest.Attributes.Add("onclick", "return confirm('" + PortalUtil.JavaScriptEncode(GetLocalResourceObject("ConfirmDeleteLiteratureRequest").ToString()) + "');");
            }
            RequestDate.Enabled = false;
            SendDate.Enabled = false;
            RequestUser.Enabled = false;
            FillDate.Enabled = false;
            FillUser.Enabled = false;
        }
    }

    protected void btnDelLitRequest_ClickAction(object sender, EventArgs e)
    {
        //TODO:using the delete method is choking, so manually deleting records for now.
        Sage.Entity.Interfaces.ILitRequest lr = Sage.Platform.EntityFactory.GetById<Sage.Entity.Interfaces.ILitRequest>(Page.Request.Params["entityId"].ToString());
        string conid = lr.Contact.Id.ToString();
        //lr.Delete();
        string SQL = "DELETE FROM LITREQUESTITEM WHERE LITREQID = ?";
        Sage.Platform.Data.IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Data.IDataService>();
        string constr = service.GetConnectionString();
        using (var conn = new OleDbConnection(constr))
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();
            using (var cmd = new OleDbCommand(SQL, conn))
            {
                cmd.Parameters.AddWithValue("@LitReqId", Page.Request.Params["entityId"]);
                cmd.ExecuteNonQuery();
                cmd.CommandText = "DELETE FROM LITREQUEST WHERE LITREQID = ?";
                cmd.ExecuteNonQuery();
            }
        }
        Response.Redirect("~/Contact.aspx?entityId=" + conid);
    }
    
public override Type EntityType
{
	get { return typeof(Sage.Entity.Interfaces.ILitRequest); }
}


protected override void OnAddEntityBindings() {
    BindingSource.AddBindingProvider(ContactName as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("ContactName", ContactName, "Text", "", ""));
    BindingSource.AddBindingProvider(ContactName as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Contact.Id", ContactName, "EntityId" ));
    BindingSource.AddBindingProvider(RequestDate as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("RequestDate", RequestDate, "DateTimeValue", "", ""));
    
    BindingSource.AddBindingProvider(AccountName as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Contact.AccountName", AccountName, "Text", "", ""));
    BindingSource.AddBindingProvider(AccountName as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Contact.Account.Id", AccountName, "EntityId"));
       
    BindingSource.AddBindingProvider(FillStatus as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("FillStatus", FillStatus, "Text", "", ""));
    BindingSource.AddBindingProvider(RequestUser as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("RequestUser", RequestUser, "LookupResultValue"));
    BindingSource.AddBindingProvider(CoverName as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("CoverName", CoverName, "Text", "", ""));
    BindingSource.AddBindingProvider(FillUser as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("FillUser", FillUser, "LookupResultValue"));
    BindingSource.AddBindingProvider(FillDate as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("FillDate", FillDate, "DateTimeValue", "", ""));
    BindingSource.AddBindingProvider(SendDate as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("SendDate", SendDate, "DateTimeValue", "", ""));
    BindingSource.AddBindingProvider(Description as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Description", Description, "Text", "", ""));
    BindingSource.AddBindingProvider(Priority as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Priority", Priority, "Text", "", ""));
    BindingSource.AddBindingProvider(TotalCost as Sage.Platform.EntityBinding.IEntityBindingProvider);
    BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("TotalCost", TotalCost, "Text", "", ""));
}


public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
{
    Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
    if (BindingSource != null)
    {
        if (BindingSource.Current != null)
        {
            tinfo.Description = GetLocalResourceObject("LiteratureRequest_lz").ToString();
            tinfo.Title = GetLocalResourceObject("LiteratureRequest_lz").ToString();
        }
    }
    foreach (Control c in LitRequestForm_RTools.Controls)
    {
        tinfo.RightTools.Add(c);
    }
    return tinfo;
}
</script>


