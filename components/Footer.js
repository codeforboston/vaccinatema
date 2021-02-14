import Logo from './subcomponents/Logo';

const Footer = () => {
  return(
    <div className="footer">
      <div className="footer-box">
        <Logo/>
        <div className="logo-sub-text">
          Made by volunteers
          <br/>
          with <span>❤</span> in Boston
        </div>
      </div>
      <div className="footer-box">
        <h4>Get involved</h4>
        <p>
          Email us at{" "}
          <a href="mailto:vaccinatema@gmail.com" target="_blank">vaccinatema@gmail.com</a>
          {" "}if you'd like to help out.
        </p>
        <h4>Feedback</h4>
        <p>
          Like the site? Found a bug? Have a feature idea?
          Get a vaccine from info you found here?{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSel9cjb4X0Zv5zuygWx9UnXpXrP2INJTrOW7j9MNXNdv7lKnw/viewform"
            target="_blank"
          >
            Let us know on this feedback form
          </a>
        </p>
      </div>
      <div className="footer-box">
        <h4>Disclaimer</h4>
        <p>
          This site was put together by volunteers using our best efforts to assemble readily available data from
          public sources. This site does not provide medical advice, nor does it provide any type of technical advice.
          vaccinatema.com is not responsible for any errors or omissions.
        </p>
      </div>

    </div>
  );
}

export default Footer;