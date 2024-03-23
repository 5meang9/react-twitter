
import { useState } from 'react';
import Router from './Router';
import { Layout } from './components/Layout';
import { app } from './firebaseApp';
import { getAuth } from 'firebase/auth';

function App() {
  const auth = getAuth(app);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  return (
    <Layout>
      <Router/>
    </Layout>
  );
}

export default App;


