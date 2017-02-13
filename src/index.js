import React from 'react';
import {
    NOTIFICATION_TYPE_ERROR, NOTIFICATION_TYPE_INFO, NOTIFICATION_TYPE_SUCCESS,
    NOTIFICATION_TYPE_WARNING, REMOVE_ALL_NOTIFICATIONS, createNotification,
} from 'react-redux-notify';

import notifyReducer from 'react-redux-notify';

// Icons are imported via link tag in the entry index.html
// <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
const ICONS = {
    [NOTIFICATION_TYPE_ERROR]: <i className="material-icons">error</i>,
    [NOTIFICATION_TYPE_INFO]: <i className="material-icons">info</i>,
    [NOTIFICATION_TYPE_SUCCESS]: <i className="material-icons">check_circle</i>,
    [NOTIFICATION_TYPE_WARNING]: <i className="material-icons">warning</i>
};

const styles = {
    [NOTIFICATION_TYPE_ERROR]: {
        'notification--error': 'tools-notification tools-notification--error'
    },
    [NOTIFICATION_TYPE_INFO]: {
        'notification--info': 'tools-notification tools-notification--info'
    },
    [NOTIFICATION_TYPE_SUCCESS]: {
        'notification--success': 'tools-notification tools-notification--success'
    },
    [NOTIFICATION_TYPE_WARNING]: {
        'notification--warning': 'tools-notification tools-notification--warning'
    }
};

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

const newNotification = (notifyType, message) => ({
    type: NEW_NOTIFICATION,
    payload: {
        customStyles: styles[notifyType],
        message: message,
        type: notifyType
    }
});

const notificationEpic = action$ =>
    action$.ofType(NEW_NOTIFICATION)
        .map(action => createNotification({
            canDismiss: true,
            customStyles: action.payload.customStyles,
            duration: action.payload.type === NOTIFICATION_TYPE_ERROR ? 0 : 5000,
            icon: ICONS[action.payload.type],
            message: action.payload.message,
            type: action.payload.type
        }));

export {
    newNotification, notificationEpic, notifyReducer,
    NOTIFICATION_TYPE_ERROR, NOTIFICATION_TYPE_INFO, NOTIFICATION_TYPE_SUCCESS,
    NOTIFICATION_TYPE_WARNING, REMOVE_ALL_NOTIFICATIONS
};
