import { Outlet } from 'react-router-dom';
import Footer from '@/components/feature/Footer';

/** Shared chrome for public site pages (Home, About, Career, Contact, 404). */
export default function PublicLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}
