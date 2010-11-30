using System;
using System.Collections.Generic;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.SalesLogix.Activity;

namespace SlxClient
{
    public partial class ContactDetailsEx : System.Web.UI.Page
    {
        string _currentSortExpression = "CompleteDate";

        protected void grdHistory_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            grdHistory.PageIndex = e.NewPageIndex;
        }

        protected void grdHistory_Sorting(object sender, GridViewSortEventArgs e)
        {
            _currentSortExpression = e.SortExpression;
        }

        protected static string GetHistoryTypeText(object activityType)
        {
            if (activityType != null)
            {
                if (activityType is ActivityType)
                {
                    return ActivityHelper.ActivityTypeToDisplayName((ActivityType)activityType);
                }
            }
            return string.Empty;
        }

        protected override void OnPreRender(EventArgs e)
        {
            //ViewState.Add("UseSLXPagerTemplate", "true");
            string Id = Request.QueryString["contactid"];
            if (!string.IsNullOrEmpty(Id))
            {
                LoadHistory(Id);
            }
            base.OnPreRender(e);
        }

        protected override void  OnLoad(EventArgs e)
        {
 	        base.OnLoad(e);

            //grdHistory.PageIndexChanging += new GridViewPageEventHandler(grdHistory_PageIndexChanging);
            //grdHistory.Sorting += new GridViewSortEventHandler(grdHistory_Sorting);

            string Id = Request.QueryString["contactid"];
            if (!string.IsNullOrEmpty(Id))
            {
                IContact contact = EntityFactory.GetById<IContact>(Id);
                if (contact != null)
                {
                    nmePersonName.NamePrefix = contact.Prefix;
                    nmePersonName.NameFirst = contact.FirstName;
                    nmePersonName.NameMiddle = contact.MiddleName;
                    nmePersonName.NameLast = contact.LastName;
                    nmePersonName.NameSuffix = contact.Suffix;
                    txtAccountName.Text = contact.AccountName;
                    txtTitle.Text = contact.Title;
                    txtAssistant.Text = contact.Assistant;
                    txtSalutation.Text = contact.Salutation;
                    adrPrimaryAddress.AddressDisplay = contact.Address.FullAddress;
                    adrPrimaryAddress.AddressCity = contact.Address.City;
                    adrPrimaryAddress.AddressCountry = contact.Address.Country;
                    adrPrimaryAddress.AddressCounty = contact.Address.County;
                    adrPrimaryAddress.AddressDesc1 = contact.Address.Address1;
                    adrPrimaryAddress.AddressDesc2 = contact.Address.Address2;
                    adrPrimaryAddress.AddressDesc3 = contact.Address.Address3;
                    adrPrimaryAddress.AddressDescription = contact.Address.Description;
                    adrPrimaryAddress.AddressIsMailing = contact.Address.IsMailing.HasValue
                                                             ? contact.Address.IsMailing.Value
                                                             : false;
                    adrPrimaryAddress.AddressIsPrimary = contact.Address.IsPrimary.HasValue
                                                             ? contact.Address.IsPrimary.Value
                                                             : false;
                    adrPrimaryAddress.AddressPostalCode = contact.Address.PostalCode;
                    adrPrimaryAddress.AddressSalutation = contact.Address.Salutation;
                    adrPrimaryAddress.AddressState = contact.Address.State;
                    phnWork.Text = contact.WorkPhone;
                    phnFax.Text = contact.Fax;
                    phnMobile.Text = contact.Mobile;
                    phnHome.Text = contact.HomePhone;
                    phnOther.Text = contact.OtherPhone;
                    txtPreferredContact.Text = contact.PreferredContact;
                    emlEmail.Text = contact.Email;
                    urlWeb.Text = contact.WebAddress;
                    chkPrimaryContact.Checked = contact.IsPrimary.HasValue ? contact.IsPrimary.Value : false;
                    chkAuthorizedServiceContact.Checked = contact.IsServiceAuthorized.HasValue
                                                              ? contact.IsServiceAuthorized.Value
                                                              : false;
                    chkDoNotSolicit.Checked = contact.DoNotSolicit.HasValue ? contact.DoNotSolicit.Value : false;
                    ownOwner.LookupResultValue = contact.Owner;
                    usrAccountManager.LookupResultValue = contact.AccountManager;
                    txtContactType.Text = contact.Type;
                    txtContactStatus.Text = contact.Status;
                    txtAccountType.Text = contact.Account.Type;
                    txtAccountStatus.Text = contact.Account.Status;
                    txtContactID.Text = contact.Id.ToString();
                    usrCreateUser.LookupResultValue = !string.IsNullOrEmpty(contact.CreateUser)
                                                          ? contact.CreateUser
                                                          : null;
                    dtpCreateDate.DateTimeValue = contact.CreateDate;
                    usrModifyUser.LookupResultValue = !string.IsNullOrEmpty(contact.ModifyUser)
                                                          ? contact.ModifyUser
                                                          : null;
                    dtpModifyDate.DateTimeValue = contact.ModifyDate;

                }
            }
        }

        private void LoadHistory(string Id)
        {
            IList<History> historyList = EntityFactory.GetRepository<History>().FindByProperty("ContactId", Id);
            List<History> filteredList = new List<History>();

            foreach (History his in historyList)
            {
                if ((his.Type != HistoryType.atInternal) && (his.Type != HistoryType.atDatabaseChange))
                {
                    filteredList.Add(his);
                }
            }

            filteredList.Sort(new HistoryComparer(_currentSortExpression));
            if (grdHistory.CurrentSortDirection == "Descending")
            {
                filteredList.Reverse();
            }

            grdHistory.DataSource = filteredList;
            grdHistory.DataBind();
        }
    }

    public class HistoryComparer : IComparer<History>
    {
        private string _SortColumn;
        public int Compare(History x, History y)
        {
            switch (_SortColumn)
            {
                case "ContactName":
                    return string.Compare(x.ContactName, y.ContactName);
                case "Category":
                    return string.Compare(x.Category, y.Category);
                case "Type": 
                    return string.Compare(ActivityHelper.ActivityTypeToDisplayName(x.Type),
                        ActivityHelper.ActivityTypeToDisplayName(y.Type));
                case "CompleteDate": 
                    return DateTime.Compare(x.CompletedDate, y.CompletedDate);
                case "Duration":
                    return (x.Duration == y.Duration) ? (0) : ((x.Duration < y.Duration) ? (-1) : (1));
                case "Description": 
                    return string.Compare(x.Description, y.Description);
                case "Leader":
                    IUser xuser = EntityFactory.GetById<IUser>(x.UserId);
                    IUser yuser = EntityFactory.GetById<IUser>(y.UserId);
                    if ((xuser != null) && (yuser != null))
                    {
                        string xUserName = xuser.UserInfo.LastName + ", " + yuser.UserInfo.FirstName;
                        string yUserName = yuser.UserInfo.LastName + ", " + yuser.UserInfo.FirstName;

                        return string.Compare(xUserName, yUserName);
                    }
                    return string.Compare("", "");
                case "Result" :
                    return string.Compare(x.Result, y.Result);
               
                default: return 0;
            }
        }

        public HistoryComparer(string property)
        {
            _SortColumn = property;
        }
    }
}