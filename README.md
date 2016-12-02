# minimal-react-redux-notify
A minimalistic notifications component built with [react-redux-notify](https://github.com/deep-c/react-redux-notify) and intended for use with [redux-observable](https://github.com/redux-observable/redux-observable).

![A quick look.](http://i.giphy.com/l0HlQkInwts6lR1zq.gif)


## Overview and Install
Minimal react redux notify is a simple component for displaying notifications in your redux-observable apps. You can simply include the component within your app. Easiest way to get up and running is to install it via npm.

```javascript
npm install minimal-react-redux-notify --save
```

After which you simply add the built in epic to your store:

root-epic
```javascript
import {combineEpics} from 'redux-observable';

import HeaderEpics from '../containers/header/epics';
import HomeEpics from '../containers/home/epics';
import LoginEpics from '../containers/login/epics';
import {notificationEpic} from 'minimal-react-redux-notify';

export default combineEpics(
    HeaderEpics,
    HomeEpics,
    LoginEpics,
    notificationEpic
);
```

root-reducer
```javascript
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {notifyReducer} from 'minimal-react-redux-notify';

import HomeReducers from '../containers/home/reducers';
import * as loginReducers from '../containers/login/reducers';


export default combineReducers(
    {
        ...HomeReducers,
        ...loginReducers,
        notifications: notifyReducer,
        routing: routerReducer
    }
);

```

store
```javascript

import {createStore, applyMiddleware} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import {browserHistory} from 'react-router';
import {routerMiddleware} from 'react-router-redux';
import {autoRehydrate} from 'redux-persist';

import rootReducer from '../reducers';
import rootEpic from '../epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

export default function configureStore() {
    const store = createStore(
        rootReducer,
        composeWithDevTools(
            autoRehydrate(),
            applyMiddleware(
                epicMiddleware,
                routerMiddleware(browserHistory)
            )
        )
    );

    /* istanbul ignore next */
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default;
            store.replaceReducer(nextReducer);
        });
        // Enable Webpack hot module replacement for epics
        module.hot.accept('../epics', () => {
            const nextEpic = require('../epics').default;
            epicMiddleware.replaceEpic(nextEpic);
        });
    }

    return store;
}

```

Then use in your components like so:

```javascript
import {newNotification, NOTIFICATION_TYPE_SUCCESS, REMOVE_ALL_NOTIFICATIONS} from 'minimal-react-redux-notify';
import ActionTypes from '../actions/action-types';

const loggedInEpic = action$ =>
    action$.ofType(ActionTypes.LOGIN)
        .mergeMap(() => Observable.merge(
            Observable.of(push('/home')),
            Observable.of({type: REMOVE_ALL_NOTIFICATIONS}),
            Observable.of(newNotification(NOTIFICATION_TYPE_SUCCESS, 'Login successful!'))
        ));

```


