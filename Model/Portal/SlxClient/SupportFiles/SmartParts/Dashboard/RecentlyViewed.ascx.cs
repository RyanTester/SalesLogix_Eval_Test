using System;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Web.Controls;
using SmartPartInfoProvider=Sage.Platform.WebPortal.SmartParts.SmartPartInfoProvider;

public partial class SmartParts_Dashboard_RecentlyViewed : SmartPartInfoProvider
{
    private IEntityHistoryService _EntityHistoryService;
    /// <summary>
    /// Gets or sets the entity history service.
    /// </summary>
    /// <value>The entity history service.</value>
    [ServiceDependency(Type = typeof(IEntityHistoryService), Required = false)]
    public IEntityHistoryService EntityHistoryService
    {
        get { return _EntityHistoryService; }
        set { _EntityHistoryService = value; }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (RecentlyViewed == null) return;
        const string RecentlyViewedUrlFormat = "{0}.aspx?entityid={1}";
        List<string> ids = new List<string>(); //EntityHistory may contain duplicates
        foreach (EntityHistory eh in _EntityHistoryService)
        {
            if (ids.Contains(eh.EntityId.ToString())) continue;
            if (eh.EntityType == typeof(IUserNotification)) continue;

            string description = (eh.Description == eh.EntityId.ToString())
                                     ? GetLocalResourceObject("NoDescription").ToString()
                                     : eh.Description;
            description = (eh.EntityType == typeof(IEvent))
                              ? String.Format("{0} - {1}", GetLocalResourceObject("Event.Text"), description)
                              : description;
            description = (eh.EntityType == typeof(IContract)) // but contracts do get to use their ids
                              ? eh.Description
                              : description;
            if (shouldDisplay(eh))
            {
                string url = String.Format(RecentlyViewedUrlFormat, eh.EntityType.Name.Substring(1), eh.EntityId);
                if (eh.EntityType.Name.Substring(1) == "History")
                    url = string.Format("javascript:Link.editHistory('{0}');", eh.EntityId);
                if (eh.EntityType.Name.Substring(1) == "Activity")
                    url = string.Format("javascript:Link.editActivity('{0}');", eh.EntityId);

                AddALink(RecentlyViewed, description, url, enumPageLinkType.RelativePath);
                if (RecentlyViewed.ListOfLinks.Count > RecentlyViewed.ItemsToDisplay)
                    break;
            }
            ids.Add(eh.EntityId.ToString());
        }
    }

    private bool shouldDisplay(EntityHistory eh)
    {
        RecentlyVisitedTypeList list = PageWorkItem.RootWorkItem.State[EntityBreadCrumb.CONST_RECENTTYPESLIST]
                       as RecentlyVisitedTypeList ?? new RecentlyVisitedTypeList();

        return list.VisitedTypes.Contains(eh.EntityType);
    }

    private void AddALink(ListOfLinksControl ll, string text, string url, enumPageLinkType plt)
    {
        PageLink pl = new PageLink();
        pl.LinkType = plt;
        pl.NavigateUrl = url;
        pl.Text = text;
        ll.AddLink(pl);
    }

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        return new SmartPartInfo(GetLocalResourceObject("Title").ToString(), GetLocalResourceObject("Description").ToString());
    }

}