import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../styles/public.css';

export default function PublicLayout() {
  return (
    <div className="public-page">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
