using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using Sage.Platform.Application.Services;
using Sage.SalesLogix.Web.Modules;

public partial class SmartParts_WorkSurvey_WorkSurveyOffer : System.Web.UI.UserControl
{
    private Survey currentSurvey = null;

    public Survey CurrentSurvey
    {
        get
        {
            if (currentSurvey == null)
            {
                var page = Parent.Page as Sage.Platform.WebPortal.WebPortalPage;
                if (page != null)
                    currentSurvey = page.PageWorkItem.Modules.Get<WorkSurveyModule>(true).CurrentWorkSurveyConfig;
            }

           return currentSurvey;
        }
        set
        {
            currentSurvey = value;
        }
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        if (CurrentSurvey == null)
            return;

        SetPageValues();

        if (!Page.IsPostBack)
        {
            FillDelayOptions();

            // hide the no thanks button if the survey is required
            if (currentSurvey.IsRequired)
                rbNo.Visible = false;

            // if the title image doesn't exist, hide it so alternate text doesn't show up
            if (!File.Exists(Server.MapPath(currentSurvey.SurveyOfferPage.OfferPageImagePath)))
                imgTitle.Visible = false;


            ddlDelayDays.Attributes.Add("onchange",
                                        "document.getElementById('" + rbLater.ClientID + "').checked='checked';");
        }

    }
    private void SetPageValues()
    {
        imgTitle.ImageUrl = currentSurvey.SurveyOfferPage.OfferPageImagePath;
        imgTitle.AlternateText = currentSurvey.SurveyOfferPage.OfferPageImageAltText;
        lblTitle.Text = currentSurvey.SurveyOfferPage.OfferPageTitle;
        lblSurveyInfo.Text = currentSurvey.SurveyOfferPage.OfferPageDescription;
        rbLater.Text = currentSurvey.SurveyOfferPage.OfferPageLaterOptionText;
        rbYes.Text = currentSurvey.SurveyOfferPage.OfferPageYesOptionText;
        rbNo.Text = currentSurvey.SurveyOfferPage.OfferPageNoOptionText;
        btnOk.Value = currentSurvey.SurveyOfferPage.OfferPageOkButtonText;
        lnkPrivacy.Text = currentSurvey.SurveyOfferPage.OfferPagePrivacyLinkText;
        lnkPrivacy.NavigateUrl = currentSurvey.SurveyOfferPage.PrivacyUrl;

    }
    
    private void FillDelayOptions()
    {
        if (currentSurvey != null && !string.IsNullOrEmpty(currentSurvey.SurveyOfferPage.PostponeDaysOptions))
        {
            string optionsRaw = currentSurvey.SurveyOfferPage.PostponeDaysOptions.Replace(", ", ",");
            string[] options = optionsRaw.Split(',');

            for (int i = 0; i < options.Length; i++)
            {
                ddlDelayDays.Items.Add(options[i]);
            }

            if (ddlDelayDays.Items.Count > 0)
                ddlDelayDays.SelectedIndex = 0;
        }
    }


}
