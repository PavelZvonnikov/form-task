import './App.scss';
import Form from './components/form';
import {store} from './store';
import {connect, Provider} from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <div className='app'>
        <Form />
      </div>
      </Provider>
  );
}

export default App;
