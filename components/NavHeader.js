import Link from 'next/link'
import { useRouter } from 'next/router'

const NavHeader = () => {
  const router = useRouter()
  const renderNavClass = () => {
    // if desktop
    return "nav nav-pills pull-right";

    // if mobile
    // return "nav nav-pills pull-right";

  };

  const renderLinkClass = (nav) => {
    const path = nav === "home" ? "/" : nav;
    if (router.pathname.match(`${path}$`)) {
      return "active";
    } else {
      return "";
    }
  };

  return(
    <div className="header">
      <div className="logo-container" onClick={() => history.push("/dev")}>
        <h3 className="text-muted"><img src={"ma_logo.png"} alt="MA logo"/>Vaccinate MA</h3>
      </div>
      <div className={renderNavClass()} id="navbarNav">
        <ul className="nav nav-pills pull-right">
          <li><Link className={renderLinkClass("home")} href="/dev">Home</Link></li>
          <li><Link className={renderLinkClass("eligibility")} href="/dev/eligibility">Eligibility</Link></li>
          <li><Link className={renderLinkClass("sites")} href="/dev/sites">Vaccination Sites</Link></li>
          <li><Link className={renderLinkClass("faq")} href="/dev/FAQ" >FAQ</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default NavHeader;