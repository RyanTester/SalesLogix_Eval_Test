<%@ Import Namespace="Sage.Platform.Application.Services"%>
<%@ Control Language="C#" ClassName="AccountDetails" Inherits="Sage.Platform.WebPortal.SmartParts.EntityBoundSmartPartInfoProvider" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.Application" Namespace="Sage.Platform.Application" TagPrefix="Platform" %>

<div style="display:none">
<asp:Panel ID="WebAccess_LTools" runat="server" meta:resourcekey="WebAccess_LToolsResource1">
</asp:Panel>
<asp:Panel ID="WebAccess_CTools" runat="server" meta:resourcekey="WebAccess_CToolsResource1">
</asp:Panel>
<asp:Panel ID="WebAccess_RTools" runat="server" meta:resourcekey="WebAccess_RToolsResource1">
 <asp:ImageButton runat="server" ID="Save" Text="Save" ToolTip="Save" ImageUrl="~/images/icons/Save_16x16.gif" meta:resourcekey="SaveResource1" />

<SalesLogix:PageLink ID="WebAccessHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="csrconwebaccesstab.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16"></SalesLogix:PageLink></asp:Panel>
</div>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
  <col width="50%" /><col width="50%" /><tr>
<td >  
           <span class="lbl"><asp:Label ID="lblWebAccess" AssociatedControlID="chkWebAccess" runat="server" Text="Web Access" meta:resourcekey="lblWebAccessResource1"></asp:Label></span> 
<span >
<asp:CheckBox runat="server" ID="chkWebAccess" meta:resourcekey="chkWebAccessResource1" />
</span> 
</td>
  <td >  
           <span class="lbl"><asp:Label ID="lblNewPassword" AssociatedControlID="txtNewPassword" runat="server" Text="New Password:" meta:resourcekey="lblNewPasswordResource1"></asp:Label></span> 
<span   class="textcontrol">
<asp:TextBox runat="server" ID="txtNewPassword" TextMode="Password" meta:resourcekey="txtNewPasswordResource1" />

</span> 
</td>
  </tr>
<tr><td >  
           <span class="lbl"><asp:Label ID="lblUserName" AssociatedControlID="txtWebUserName" runat="server" Text="User Name:" meta:resourcekey="lblUserNameResource1"></asp:Label></span> 
<span   class="textcontrol">
<asp:TextBox runat="server" ID="txtWebUserName" MaxLength="30" meta:resourcekey="txtWebUserNameResource1" />

</span> 
</td>
  <td >  
           <span class="lbl"><asp:Label ID="lblRepeatNewPassword" AssociatedControlID="txtRepeatNewPassword" runat="server" Text="Repeat New Password:" meta:resourcekey="lblRepeatNewPasswordResource1"></asp:Label></span> 
<span   class="textcontrol">
<asp:TextBox runat="server" ID="txtRepeatNewPassword" TextMode="Password" meta:resourcekey="txtRepeatNewPasswordResource1" />

</span> 
</td>
  </tr>
<tr><td colspan="2" style="padding:5px 0px;">  
        
<span >
<hr />


</span> 
</td>
  </tr>
<tr><td colspan="2" >  
           <span class="twocollbl"><asp:Label ID="lblPasswordHint" AssociatedControlID="txtWebPasswordHint" runat="server" Text="Password Hint:" meta:resourcekey="lblPasswordHintResource1"></asp:Label></span> 
<span  class="twocoltextcontrol" >
<asp:TextBox runat="server" ID="txtWebPasswordHint" MaxLength="64" meta:resourcekey="txtWebPasswordHintResource1" />

</span> 
</td>
  </tr>
<tr><td >  
        
 
</td>
  </tr>
</table>
 
<script runat="server" type="text/C#">
    public override Type EntityType
    {
	    get { return typeof(Sage.Entity.Interfaces.IContact); }
    }

    protected override void OnAddEntityBindings()
    {                      
        this.BindingSource.AddBindingProvider(txtWebUserName as Sage.Platform.EntityBinding.IEntityBindingProvider);
        this.BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("WebUserName", txtWebUserName, "Text"));
        this.BindingSource.AddBindingProvider(txtWebPasswordHint as Sage.Platform.EntityBinding.IEntityBindingProvider);
        this.BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("WebPasswordHint", txtWebPasswordHint, "Text"));
    }

    protected void Save_ClickAction(object sender, EventArgs e)   
    {
        object[] objarray = new object[]
        { 
            this.BindingSource.Current, 
            (Boolean)chkWebAccess.Checked, 
            txtNewPassword.Text, 
            txtRepeatNewPassword.Text
        };
        object passthru = Sage.Platform.EntityFactory.Execute<Sage.SalesLogix.Entities.Contact>("Contact.SaveWebAccess", objarray);
        if (passthru != null)
        {
             Sage.Platform.WebPortal.SmartParts.WebActionEventArgs args = new Sage.Platform.WebPortal.SmartParts.WebActionEventArgs(passthru);
             Save_ClickActionBRC(sender, args);
        }
        else
        {
            Save_ClickActionBRC(sender, e);
        }
    }

    protected void Save_ClickActionBRC(object sender, EventArgs e)    
    {
        Sage.Platform.WebPortal.SmartParts.WebActionEventArgs args = e as Sage.Platform.WebPortal.SmartParts.WebActionEventArgs;
        if (args != null && !string.IsNullOrEmpty(args.PassThroughObject.ToString()))
        {
            if (DialogService != null)
            {
                DialogService.ShowMessage(args.PassThroughObject.ToString());
            }
        }
    }

    protected void quickformload0(object sender, EventArgs e)    
    {
        Boolean bIsAdmin;
        Boolean bIsWebAdmin;
        Boolean bEnableControl;
        string strOption;
        Sage.SalesLogix.Security.SLXUserService userService = ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as Sage.SalesLogix.Security.SLXUserService;
        Sage.SalesLogix.Web.WebUserOptionsService userWebOptions = ApplicationContext.Current.Services.Get<IUserOptionsService>() as Sage.SalesLogix.Web.WebUserOptionsService;
        strOption = userWebOptions.GetPlatformOption("CONTEXT:webticketcust", "", false, "n", "", this.EntityContext.EntityID.ToString());
        if (!string.IsNullOrEmpty(strOption))
        {
            this.chkWebAccess.Checked = (strOption.Trim().ToUpper() == "Y");
        }
        else
        {
            this.chkWebAccess.Checked = false;
        }

        this.txtNewPassword.Text = "";
        this.txtRepeatNewPassword.Text = "";

        bIsAdmin = (userService.UserId.Trim().ToUpper() == "ADMIN");
        bIsWebAdmin = false;
        bEnableControl = false;
        if (!bIsAdmin)
        {
            Sage.SalesLogix.Security.User userContext = userService.GetUser();
            if (userContext != null)
            {
                bIsWebAdmin = userContext.IsWebAdmin.HasValue ? userContext.IsWebAdmin.Value : false;
            }
        }
        /* Users can make changes only if they are the Admin or if they are a Web Admin. */
        bEnableControl = (bIsAdmin || bIsWebAdmin);
        this.chkWebAccess.Enabled = bEnableControl;
        this.txtNewPassword.Enabled = bEnableControl;
        this.txtRepeatNewPassword.Enabled = bEnableControl;
        this.txtWebPasswordHint.Enabled = bEnableControl;
        this.txtWebUserName.Enabled = bEnableControl;        
    }
        

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        Save.Click += new ImageClickEventHandler(Save_ClickAction);
    }

    protected override void OnFormBound()
    {
        object sender = this;
        EventArgs e = EventArgs.Empty;
        quickformload0(sender, e);
        base.OnFormBound();
    }

    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
	    Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in this.WebAccess_LTools.Controls)
	    {
		    tinfo.LeftTools.Add(c);
	    }
	    foreach (Control c in this.WebAccess_CTools.Controls)
	    {
		    tinfo.CenterTools.Add(c);
	    }
	    foreach (Control c in this.WebAccess_RTools.Controls)
	    {
		    tinfo.RightTools.Add(c);
	    }
	    return tinfo;
    }
</script>

<script type="text/javascript">
</script>
