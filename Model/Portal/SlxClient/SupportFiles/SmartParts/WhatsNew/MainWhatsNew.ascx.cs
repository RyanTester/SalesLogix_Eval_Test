using System;
using System.Web.UI;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Application.UI;

public partial class SmartParts_NonWhatsNew_NonWhatsNew : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    private IPageWorkItemLocator _locator;

    /// <summary>
    /// Gets or sets the locator.
    /// </summary>
    /// <value>The locator.</value>
    [ServiceDependency]
    public IPageWorkItemLocator Locator
    {
        get { return _locator; }
        set { _locator = value; }
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        if (IsPostBack) return;

        DateTime dt = DateTime.UtcNow;

        IUserOptionsService userOpts = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        if (userOpts != null)
        {
            try
            {
                dt = DateTime.Parse(userOpts.GetCommonOption("LastWebUpdate", "Web", false, dt.ToString(), "LastWebUpdate"));
            }
            catch
            {}
        }
        ChangeDate.DateTimeValue = dt;
    }

    protected void OnSearch(object sender, EventArgs e)
    {
        IUserOptionsService userOpts = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        if (userOpts != null)
        {
            userOpts.SetCommonOption("LastWebUpdate", "Web", ChangeDate.DateTimeValue.Value.ToString(), false);
        }

        Sage.Platform.WebPortal.Services.IPanelRefreshService refresher = Locator.GetPageWorkItem().Services.Get<IPanelRefreshService>();
        if (refresher != null)
        {
            refresher.RefreshAll();
        }
    }

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in wnTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
