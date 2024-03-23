import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<h1>Home Page</h1>} />
      <Route path='/posts/list' element={<h1>Post List</h1>} />
      <Route path='/posts/:id' element={<h1>Post detail</h1>} />
      <Route path='/posts/new' element={<h1>new</h1>} />
      <Route path='/posts/edit/:id' element={<h1>edit</h1>} />
      <Route path='/profile' element={<h1>profile</h1>} />
      <Route path='/profile/edit' element={<h1>profile edit</h1>} />
      <Route path='/notifications' element={<h1>notifications</h1>} />
      <Route path='/search' element={<h1>search</h1>} />
      <Route path='/users/login' element={<h1>login pages</h1>} />
      <Route path='/users/signup' element={<h1>signup</h1>} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
