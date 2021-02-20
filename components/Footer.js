import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeSquare } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebookSquare, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton, } from 'react-share';

import Logo from './subcomponents/Logo';
import EmailLink from './subcomponents/EmailLink';

/*
   NOTE on social sharing: the react-share library includes support for the following fields:
   Facebook: quote and one hashtag
   Twitter: title, via, list of hashtags, list of related accounts
   LinkedIn: title and summary
   Email: subject and body
   Automatic sharing is not available for instagram, linking to our page instead
 */


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
                <h4 className="social-header">Share</h4>
                <div className="social-container">
                    <TwitterShareButton url="http://vaccinatema.com/"
                        hashtags={['covid19vaccine', 'GetTheShot', 'vaccinateMA']} via="ma_covid">
                        <FontAwesomeIcon icon={faTwitter} />
                    </TwitterShareButton>
                    <FacebookShareButton url="http://vaccinatema.com/"
                        hashtag="#GetTheShot">
                        <FontAwesomeIcon icon={faFacebookSquare} />
                    </FacebookShareButton>
                    <a href="https://www.instagram.com/vaccinate_ma/" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <EmailShareButton url="http://vaccinatema.com/"
                        subject="Helping Massachusetts Residents Get Vaccinated"
                        body="Check COVID-19 vaccine availability from 100+ local and retail sites across the
                            commonwealth.">
                        <FontAwesomeIcon icon={faEnvelopeSquare} />
                    </EmailShareButton>
                    <LinkedinShareButton url="http://vaccinatema.com/">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </LinkedinShareButton>
                </div>
            </div>
            <div className="footer-box">
                <h4 className="footer-header">Get involved</h4>
                <p>Email us at{' '}<EmailLink/>{' '}if you&apos;d like to help out.</p>
                <h4>Feedback</h4>
                <p>
          Like the site? Found a bug? Have a feature idea?
          Get a vaccine from info you found here?{' '}
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSel9cjb4X0Zv5zuygWx9UnXpXrP2INJTrOW7j9MNXNdv7lKnw/viewform"
                        target="_blank"
                        rel="noreferrer"
                    >
            Let us know on this feedback form.
                    </a>
                </p>
            </div>
            <div className="footer-box">
                <h4 className="footer-header">Disclaimer</h4>
                <p>
          This site was put together by volunteers using our best efforts to assemble readily available data from
          public sources. This site does not provide medical advice, nor does it provide any type of technical advice.
          vaccinatema.com is not responsible for any errors or omissions.
                </p>
            </div>

        </div>
    );
};

export default Footer;