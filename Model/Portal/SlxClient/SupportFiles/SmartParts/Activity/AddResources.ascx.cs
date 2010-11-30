using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;

public partial class SmartParts_Activity_AddResources : EntityBoundSmartPartInfoProvider
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
        BindAvailableResources();
        BindSelectedResources();
        Form.Secure(Controls);
    }

    private void BindAvailableResources()
    {
        AvailableResources.Items.Clear();
        IList<IResourceList> resourceList = EntityFactory.GetRepository<IResourceList>().FindAll();
        foreach (IResourceList rl in resourceList)
        {
            ListItem li = new ListItem(rl.Name, rl.Id.ToString());
            AvailableResources.Items.Add(li);
        }
    }

    private void BindSelectedResources()
    {
        SelectedResources.Items.Clear();
        foreach (ResourceSchedule resourceSchedule in Activity.Resources)
        {
            ResourceList rl = EntityFactory.GetById<ResourceList>(resourceSchedule.ResourceId);
            string description = rl != null ? rl.Name : string.Empty;

            ListItem li = new ListItem(description, resourceSchedule.ResourceId);

            SelectedResources.Items.Add(li);
            AvailableResources.Items.Remove(li);
        }
    }

    protected void Add_Click(object sender, EventArgs e)
    {
        List<ListItem> addedList = new List<ListItem>();
        foreach (ListItem li in AvailableResources.Items)
        {
            if (li.Selected)
            {
                addedList.Add(li);
            }
        }

        // deselect all items
        foreach (ListItem item in SelectedResources.Items)
        {
            item.Selected = false;
        }

        foreach (ListItem li in addedList)
        {
            ResourceSchedule resourceSchedule = Activity.Resources.FindResource(li.Value);
            if (resourceSchedule != null) continue;

            SelectedResources.Items.Add(li);
            Activity.Resources.Add(li.Value);
            AvailableResources.Items.Remove(li);
        }
    }

    protected void Remove_Click(object sender, EventArgs e)
    {
        List<ListItem> removedList = new List<ListItem>();
        foreach (ListItem li in SelectedResources.Items)
        {
            if (li.Selected)
                removedList.Add(li);
        }

        // deselect all items
        foreach (ListItem item in AvailableResources.Items)
        {
            item.Selected = false;
        }

        foreach (ListItem li in removedList)
        {
            ResourceSchedule resourceSchedule = Activity.Resources.FindResource(li.Value);
            if (resourceSchedule == null) continue;

            foreach (ResourceSchedule rs in Activity.Resources)
            {
                if (rs.ResourceId != resourceSchedule.ResourceId) continue;

                Activity.Resources.Remove(rs.ResourceId);
                break;
            }

            SelectedResources.Items.Remove(li);
            AvailableResources.Items.Add(li);
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
}
