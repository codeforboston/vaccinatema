import Seo from './seo'
import NavHeader from './navheader'
import Footer from './footer'

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