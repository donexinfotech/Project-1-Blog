import './App.css';
import Pages from './components/pages/Pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Pages/>
    <ToastContainer 
      position="top-right"
      autoClose={3002}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      bodyClassName="toastBody"
    />
    </>
  );
}

export default App;
