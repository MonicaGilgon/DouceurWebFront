import React, { useEffect } from 'react';
import api from './api/axios';

function App() {
  useEffect(() => {
    api.get('http://127.0.0.1:8000/admin/login/?next=/admin/') 
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Conexión React + Django</h1>
    </div>
  );
}

export default App;
