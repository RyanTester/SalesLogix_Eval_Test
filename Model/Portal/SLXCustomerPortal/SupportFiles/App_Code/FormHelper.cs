using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.SalesLogix.Web.Controls;
using Sage.SalesLogix.Web.Controls.Lookup;
using Sage.SalesLogix.Web.Controls.PickList;
using Sage.Platform.WebPortal;

public class FormHelper
{
    public static void Disable(ControlCollection controls)
    {
        foreach (Control c in controls)
        {
            if (c is TextBox
                || c is DropDownList
                || c is RadioButton
                || c is CheckBox
                || c is DateTimePicker
                || c is LookupControl
                || c is DurationPicker
                || c is PickListControl
                || c is SlxUserControl
                || c is ListBox
                || c is Button)
            {
                ((WebControl)c).Enabled = false;
            }
        }
    }

    public static void RefreshMainListPanel(Page page, Type type)
    {
        const string script = @"
            if (Sage && Sage.SalesLogix && Sage.SalesLogix.Controls && Sage.SalesLogix.Controls.ListPanel) {
                var panel = Sage.SalesLogix.Controls.ListPanel.find('MainList');
                if (panel)
                    panel.refresh();
            }";
        ScriptManager.RegisterStartupScript(page, type, "RefreshMainListPanelScript", script, true);
    }

    public static string GetConfirmDeleteScript()
    {
        return string.Format("return confirm('{0}');", PortalUtil.JavaScriptEncode(Resources.SalesLogix.ConfirmDelete));
    }
}
