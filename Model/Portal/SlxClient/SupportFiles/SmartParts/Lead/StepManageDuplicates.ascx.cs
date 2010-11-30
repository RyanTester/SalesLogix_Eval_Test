using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections.Generic;
using Sage.Platform.Application;
using Sage.Platform.WebPortal.Services;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Services.Import;
using Sage.SalesLogix.Services.PotentialMatch;

public partial class StepManageDuplicates : UserControl
{
    private IWebDialogService _dialogService;

    #region Public Properties

    /// <summary>
    /// Gets or sets an instance of the Dialog Service.
    /// </summary>
    /// <value>The dialog service.</value>
    [ServiceDependency]
    public IWebDialogService DialogService
    {
        get { return _dialogService; }
        set { _dialogService = value; }
    }

    #endregion

    #region Public Methods

    /// <summary>
    /// Assigns the match filters.
    /// </summary>
    public void AssignMatchFilters()
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            if (Mode.Value == "")
            {
                Mode.Value = "Intialized";
                chkFindDupsInFile.Checked = importManager.Configuration.AdvancedOptions.IndexAfterInsert;
            }
            else 
            {
                importManager.Configuration.AdvancedOptions.IndexAfterInsert = chkFindDupsInFile.Checked;            
            }
            
            if (importManager.DuplicateProvider == null)
                importManager.DuplicateProvider = new LeadDuplicateProvider();
            LeadDuplicateProvider duplicateProvider = (LeadDuplicateProvider) importManager.DuplicateProvider;

            foreach (ListItem item in chklstFilters.Items)
            {
                if ((item.Selected) && (item.Enabled))
                {
                    duplicateProvider.SetActiveFilter(item.Value, true);
                }
                else
                {
                    duplicateProvider.SetActiveFilter(item.Value, false);
                }
            }
            duplicateProvider.AdvancedOptions.AutoMerge = chkAutoMergeDups.Checked;
            duplicateProvider.SearchAccount = false;
            duplicateProvider.SearchContact = (chkContacts.Checked);
            duplicateProvider.SearchLead = (chkLeads.Checked);

            if (lbxConflicts.SelectedIndex == 0)
            {
                importManager.MergeProvider.RecordOverwrite = MergeOverwrite.targetWins;
            }
            else
            {
                importManager.MergeProvider.RecordOverwrite = MergeOverwrite.sourceWins;
            }
            importManager.DuplicateProvider = duplicateProvider;
            importManager.Options.CheckForDuplicates = chkCheckForDups.Checked;
           
            Page.Session["importManager"] = importManager;
        }
    }

    #endregion

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"></see> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"></see> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            importManager.Options.CheckForDuplicates = chkCheckForDups.Checked;
            if (Mode.Value == "")
            {
                Mode.Value = "Intialized";
                chkFindDupsInFile.Checked = importManager.Configuration.AdvancedOptions.IndexAfterInsert;
            }
            else
            {
                importManager.Configuration.AdvancedOptions.IndexAfterInsert = chkFindDupsInFile.Checked;
            }
            
            if (chklstFilters.Items.Count <= 0)
            {
                if (importManager.DuplicateProvider == null)
                    importManager.DuplicateProvider = new LeadDuplicateProvider();
                LeadDuplicateProvider duplicateProvider = (LeadDuplicateProvider)importManager.DuplicateProvider;
                foreach (MatchPropertyFilterMap propertyFilter in duplicateProvider.GetFilters())
                {
                    ListItem item = new ListItem();
                    //If resource does not exist then use the xml value. Item is prefixed with "Filter" to better identify resourse items
                    if (GetLocalResourceObject("Filter." + propertyFilter.PropertyName) != null && GetLocalResourceObject("Filter." + propertyFilter.PropertyName).ToString() != "")
                    {
                        item.Text = GetLocalResourceObject("Filter." + propertyFilter.PropertyName).ToString();
                    }
                    else
                    {
                        item.Text = propertyFilter.DisplayName;
                    }

                    item.Value = propertyFilter.PropertyName;
                    item.Selected = propertyFilter.Enabled;
                    item.Enabled = IsFilterMapped(importManager, propertyFilter.PropertyName);
                    chklstFilters.Items.Add(item);
                }
            }
            else
            {
                LeadDuplicateProvider duplicateProvider = (LeadDuplicateProvider)importManager.DuplicateProvider;
                if (duplicateProvider != null)
                {
                    foreach (ListItem item in chklstFilters.Items)
                    {
                        item.Enabled = IsFilterMapped(importManager, item.Value);
                        MatchPropertyFilterMap propertyFilter = duplicateProvider.GetPropertyFilter(item.Value);
                        if (propertyFilter != null)
                        {
                            if ((!item.Enabled) || (!propertyFilter.Enabled))
                            {
                                item.Selected = false;
                            }
                        }
                    }
                }
                else
                {
                    foreach (ListItem item in chklstFilters.Items)
                    {
                        item.Enabled = false;
                    }
                }
            }
        }
    }

    /// <summary>
    /// Determines whether a match filter is mapped.
    /// </summary>
    /// <param name="importManager">The import manager.</param>
    /// <param name="matchFilter">The match filter.</param>
    /// <returns>
    /// 	<c>true</c> if [is filter mapped] [the specified import manager]; otherwise, <c>false</c>.
    /// </returns>
    private Boolean IsFilterMapped(ImportManager importManager, string matchFilter)
    {
        IList<ImportMap> importMaps = importManager.ImportMaps;
        foreach (ImportMap map in importMaps)
        {
            if (matchFilter.Equals(map.TargetProperty.PropertyId))
                return true;
        }
        return false;
    }

    /// <summary>
    /// Handles the Click event of the cmdMatchOptions control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdMatchOptions_Click(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            AssignMatchFilters();
            ImportManager importManager = Page.Session["importManager"] as ImportManager;
            DialogService.SetSpecs(200, 200, 375, 500, "MatchOptions", "", true);
            DialogService.DialogParameters.Add("IsImportWizard", true);
            DialogService.EntityType = typeof(ILead);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Handles the Click event of the cmdRunTest control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdRunTest_Click(object sender, EventArgs e)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            AssignMatchFilters();
            if (DialogService != null)
            {
                DialogService.SetSpecs(200, 200, 300, 500, "ImportRunTest", "", true);
                DialogService.DialogParameters.Add("startTest", "true");
                DialogService.EntityType = typeof(ILead);
                DialogService.ShowDialog();
            }
        }
    }
}
