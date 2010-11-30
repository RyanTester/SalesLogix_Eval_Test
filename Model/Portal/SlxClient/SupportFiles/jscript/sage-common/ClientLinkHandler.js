var Link = {
    entityDetail: function(kind, id) {
        ClientLinkHandler.request({ request: 'EntityDetail', kind: kind, id: id });
    },
    
    schedule: function(type) {
        ClientLinkHandler.request({ request: 'Schedule', type: type });
    },

    newNote: function() {
        ClientLinkHandler.request({ request: 'New', type: 'Note' });
    },

    scheduleActivity: function(args) {
        ClientLinkHandler.request({ request: 'ScheduleActivity', args: args });
    },

    schedulePhoneCall: function() {
        this.schedule('PhoneCall');
    },

    scheduleMeeting: function() {
        this.schedule('Meeting');
    },

    scheduleToDo: function() {
        this.schedule('ToDo');
    },

    schedulePersonalActivity: function() {
        this.schedule('PersonalActivity');
    },

    scheduleCompleteActivity: function() {
        this.schedule('CompleteActivity');
    },
    
    editActivity: function(id) {
        ClientLinkHandler.request({ request: 'EditActivity', id: id });
    },
    
    editActivityOccurrence: function(id, recurDate) {    
    ClientLinkHandler.request({ request: 'EditActivityOccurrence', id: id, recurDate: recurDate });
    },

    editHistory: function(id) {
        ClientLinkHandler.request({ request: 'EditHistory', id: id });
    },

    completeActivity: function(id) {
        ClientLinkHandler.request({ request: 'CompleteActivity', id: id });
    },
    
    completeActivityOccurrence: function(id, recurDate) {
        ClientLinkHandler.request({ request: 'CompleteActivityOccurrence', id: id, recurDate: recurDate });
    },
    
    deleteActivity: function(id) {
        Ext.Msg.confirm(MasterPageLinks.ActivitiesDialog_DeleteActivityTitle, MasterPageLinks.ActivitiesDialog_DeleteActivity, function(btn)
           {
                if (btn == 'yes')
                {
                    ClientLinkHandler.request({ request: 'DeleteActivity', id: id });
                }        
           });                
        
    },
    
    deleteActivityOccurrence: function(id, recurDate) {
        ClientLinkHandler.request({ request: 'DeleteActivityOccurrence', id: id, recurDate: recurDate });
    },

    confirmActivity: function(id, toUserId) {
        ClientLinkHandler.request({ request: 'ConfirmActivity', id: id, toUserId: toUserId });
    },

    deleteConfirmation: function(id, notifyId) {
        ClientLinkHandler.request({ request: 'DeleteConfirmation', id: id, notifyId: notifyId });
    },

    removeDeletedConfirmation: function(id) {
        ClientLinkHandler.request({ request: 'RemoveDeletedConfirmation', id: id });
    }
};
