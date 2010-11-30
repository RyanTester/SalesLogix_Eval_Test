using System.Collections.Generic;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.SalesLogix;

public class UserOptions
{
    public static string GetDefaultFollowUpActivityType()
    {
        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        string key = userOption.GetCommonOption("DefaultFollowupActivity", "ActivityAlarm");

        IDictionary<string, string> map = new Dictionary<string, string>();
        map.Add("None", "None");
        map.Add("Phone Call", "atPhoneCall");
        map.Add("Meeting", "atMeeting");
        map.Add("To-Do", "atToDo");

        return map.ContainsKey(key) ? map[key] : "None";
    }
}
