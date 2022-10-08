//引入redux
import { createStore, combineReducers } from "redux"
import { CollapsedReducer } from "./reducers/CollapsedReducer";
//引入redux持久
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'Baichuan',
    storage,
    blacklist: ['LoadingReducer']
}
const reducer = combineReducers({
    CollapsedReducer,
})
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export {
    store,
    persistor
}