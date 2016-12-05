# minimal-react-redux-notify
A minimalistic notifications component built with [react-redux-notify](https://github.com/deep-c/react-redux-notify) and intended for use with [redux-observable](https://github.com/redux-observable/redux-observable).

![A quick look at react-redux-notify.](http://i.giphy.com/l0HlQkInwts6lR1zq.gif)

note: To get the full set of features above you will need to use the full version of react-redux-notify.

## Overview and Install
Minimal react redux notify is a simple component for displaying notifications in your redux-observable apps. You can simply include the component within your app. Easiest way to get up and running is to install it via npm.

```javascript
npm install minimal-react-redux-notify --save
```

After which you simply add the built in epic to your store:

(1) Define your root-epic
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

(2) Define your root-reducer
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

(3) Inject them into your store
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

(4) Pass to your app level provider
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {persistStore} from 'redux-persist';

import configureStore from './store';

// Containers
import Home from './containers/home';
import Login from './containers/login';

// Components
import {Root} from './root';

const store = configureStore();
persistStore(store, {blacklist: ['error', 'routing', 'loggingIn', 'notifications']}, () => {
    //re-hydration complete
    // Perform pre-login initialization here
});

const history = syncHistoryWithStore(
    browserHistory,
    store
);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Root}>
                <IndexRoute component={Home}/>
                <Route path="home" component={Home}/>
                <Route path="login" component={Login}/>
            </Route>
        </Router>
    </Provider>,
    document.querySelector('.app')
)
;



```

(5) Then use as side-effects in your epics like so:

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

## Development
New versions can be published to npm via: 
```javascript
npm run shipit
```


