using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using Sage.Platform.Application;
using Sage.Platform.Orm;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Plugins;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.Web.Controls;

public partial class SmartParts_Process_ScheduleProcess : EntityBoundSmartPartInfoProvider
{
    private Sage.Entity.Interfaces.IContact _Contact;
    private Sage.Entity.Interfaces.IContact Contact
    {
        set { _Contact = value; }
        get { return _Contact; }
    }

    private IList<Plugin> _PluginList = null;
    private IList<Plugin> PluginList
    {
        set { _PluginList = value; }
        get { return _PluginList; }
    }

    private IEntityHistoryService _EntityHistoryService;
    [ServiceDependency(Type = typeof(IEntityHistoryService), Required = true)]
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

    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IContact); }
    }

    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        if (this.Visible)
        {
            LoadContactProcessTypes();
            LoadOwner();
        }
    }

    protected override void OnAddEntityBindings()
    {
    }

    protected override void OnFormBound()
    {
        if (Contact == null)
        {
            Object parentEntity;
            try
            {
                parentEntity = GetParentEntity();
                if (parentEntity != null)
                {
                    if (parentEntity is Sage.Entity.Interfaces.IContact)
                    {
                        Sage.Entity.Interfaces.IContact contact = (parentEntity as Sage.Entity.Interfaces.IContact);
                        Contact = contact;
                    }
                }
            }
            catch
            {
                Sage.Entity.Interfaces.IContact contact = GetLastContact();
                if (contact != null)
                {
                    Contact = contact;
                }
            }
        }
        LoadContact();
        base.OnFormBound();
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
    }

    private void LoadContactProcessTypes()
    {
        if (PluginList == null)
        {
            PluginList = PluginManager.GetPluginList(PluginType.ContactProcess, true, false);
            this.cboProcessType.DataSource = PluginList;
            this.cboProcessType.DataTextField = "NAME";
            this.cboProcessType.DataValueField = "PLUGINID";
            this.cboProcessType.DataBind();
            if (PluginList.Count > 0)
            {
                this.cboProcessType.SelectedIndex = 0;
            }
        }
    }

    private void LoadContact()
    {
        if (Contact != null)
        {
            this.lueContactToScheduleFor.LookupResultValue = Contact;
        }
    }

    private void LoadOwner()
    {
        if (this.ownProcessOwner.LookupResultValue == null)
        {
            IUserService service = ApplicationContext.Current.Services.Get<IUserService>();
            SLXUserService user = (SLXUserService)service;
            if (user != null)
            {
                Sage.Entity.Interfaces.IUser owner = user.GetUser();
                if (owner != null)
                {
                    this.ownProcessOwner.LookupResultValue = owner;
                }
            }
        }
    }

    protected void cmdSchedule_Click(object sender, EventArgs e)
    {
        try
        {
            if (this.cboProcessType.DataSource != null)
            {
                Plugin selectedPlugin;
                selectedPlugin = ((IList<Plugin>) this.cboProcessType.DataSource)[this.cboProcessType.SelectedIndex];
                object[] objarray = new object[] {
            this.lueContactToScheduleFor.LookupResultValue,
            selectedPlugin.PluginId,
            selectedPlugin.Family,
            selectedPlugin.Name,
            this.ownProcessOwner.LookupResultValue
            };
                Sage.Platform.Orm.DynamicMethodLibraryHelper.Instance.Execute("Contact.ScheduleProcess", objarray);
                DialogService.CloseEventHappened(sender, e);
                Sage.Platform.WebPortal.Services.IPanelRefreshService refresher = PageWorkItem.Services.Get<Sage.Platform.WebPortal.Services.IPanelRefreshService>();
                refresher.RefreshTabWorkspace();
            }
            else
            {
                DialogService.ShowMessage(GetLocalResourceObject("Error_ProcessTypes").ToString(), "SalesLogix");
            }
        }
        catch (Exception error)
        {
            DialogService.ShowMessage(error.InnerException.Message, "SalesLogix");
        }
    }

    private Sage.Entity.Interfaces.IContact GetLastContact()
    {
        if (this.EntityHistoryService != null)
        {
            object contactId = this.EntityHistoryService.GetLastIdForType<Sage.Entity.Interfaces.IContact>();
            if (contactId != null)
            {
                Sage.Entity.Interfaces.IContact contact = Sage.Platform.EntityFactory.GetById<Sage.Entity.Interfaces.IContact>(contactId);
                if (contact != null)
                {
                    return contact;
                }
            }
        }
        return null;
    }

    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in this.ScheduleProcess_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.ScheduleProcess_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.ScheduleProcess_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
}
