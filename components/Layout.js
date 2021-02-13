import Seo from './Seo';
import NavHeader from './NavHeader';
import Footer from './Footer';
export default function Layout({
  children,
  pageTitle = '',
}) {
  return (
    <div className="container">
        <Seo pageTitle={pageTitle} />
        <NavHeader />
        <div className="main-content">
            {children}
        </div>
        <Footer />
    </div>
  )
}