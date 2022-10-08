//引入react
import React from 'react'
//引入css
import './App.css';
//引入redux
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
//引入redux持久
import { PersistGate } from 'redux-persist/integration/react'



export default function App() {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <IndexRouter></IndexRouter>
    </PersistGate>
  </Provider>
}
