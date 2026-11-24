import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MovieProvider } from './context/MovieContext';
import { ListPage } from './pages/ListPage';
import { DetailPage } from './pages/DetailPage';
import { ToastContainer } from './components/ToastContainer';

export const App: React.FC = () => {
  return (
    <MovieProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/item/:id" element={<DetailPage />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </MovieProvider>
  );
};

export default App;
