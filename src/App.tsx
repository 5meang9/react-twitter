import { useState, useEffect } from 'react';
import Router from './Router';
import { Layout } from './components/Layout';
import { app } from './firebaseApp';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'components/loader/Loader';
import { RecoilRoot } from 'recoil';

function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth?.currentUser);

  useEffect(() => {
    // 현재 로그인 한 사용자 가져오기
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <RecoilRoot>
      <Layout>
        <ToastContainer theme="dark" autoClose={1000} hideProgressBar newestOnTop />
        {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
      </Layout>
    </RecoilRoot>
  );
}

export default App;
