using System;
using System.Collections.Generic;
using System.Web.UI;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application.UI;

public partial class SmartParts_Activity_ActivityDialogController
    : EntityBoundSmartPartInfoProvider
{
    private ActivityParameters Params { get; set; }

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);
        var activityParameters = AppContext["ActivityParameters"] as Dictionary<string, string>;
        Params = new ActivityParameters(activityParameters ?? new Dictionary<string, string>());
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        btnCloseDialog.Command += DialogService.CloseEventHappened;
        btnCloseDialog.Command += RefreshAll;
    }

    private void RefreshAll(object sender, EventArgs e)
    {
        // NOTE: SmartParts ActivityCommandController, CompleteActivityCommandController 
        // and HistoryCommandController all have a CloseParentDialog(bool doRefreshAll) method 
        // which calls __doPostBack for btnCloseDialog passing doRefreshAll as the event argument.
        // True means a refresh should be performed (i.e., an activity crud action was performed.)

        bool doRefreshAll;
        bool.TryParse(Request["__EVENTARGUMENT"], out doRefreshAll);
        if (!doRefreshAll) return;

        PanelRefresh.RefreshAll();
        FormHelper.RefreshMainListPanel(Page, GetType());
    }

    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);

        string src;

        if (Params.ContainsKey("contenturl"))
        {
            src = Params["contenturl"];
        }
        else
        {
            if (Params.RecurDate.HasValue)
            {
                src = string.Format("Activity.aspx?modeid=Insert&activityid={0}&recurdate={1}",
                    Params["activityid"],
                    Params.RecurDate);
            }
            else
            {
                src = string.IsNullOrEmpty(Params.Id)
                    ? "Activity.aspx?modeid=Insert"
                    : string.Format("Activity.aspx?entityid={0}", Params.Id);
            }
        }

        Frame.Attributes["src"] = src;
        AddScript();
    }

    private void AddScript()
    {
        string script = string.Format(@"
function resizeFrame() {{
    var w = Sage.DialogWorkspace.__instances['ctl00_DialogWorkspace']._dialog.getInnerWidth() - 8;
    var h = Sage.DialogWorkspace.__instances['ctl00_DialogWorkspace']._dialog.getInnerHeight() - 10;
    $('#{0}').css('height', h + 'px').css('width', w + 'px');
}}
Sage.DialogWorkspace.__instances['ctl00_DialogWorkspace']._dialog.on('resize', function(win, w, h) {{ 
    resizeFrame();
}});
Sage.DialogWorkspace.__instances['ctl00_DialogWorkspace']._dialog.on('show', function(win, w, h) {{ 
    resizeFrame();
}});

function ensureScreenEnabled() {{
    if (window.Sage.DialogWorkspace) {{
        for (var id in window.Sage.DialogWorkspace.__instances) {{
            var instance = window.Sage.DialogWorkspace.__instances[id];
            instance.enable(); 
        }}
    }}            
}}  

", Frame.ClientID);
        ScriptManager.RegisterClientScriptBlock(
            this, GetType(), "dialogIFrameSizing", script, true);
    }

    public override Type EntityType
    {
        get { return typeof(IActivity); }
    }

    protected override void OnAddEntityBindings()
    {
    }

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        return new SmartPartInfo(string.Empty, string.Empty);
    }
}
