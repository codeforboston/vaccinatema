import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import {config, dom} from '@fortawesome/fontawesome-svg-core';

// Work around for ReactFontAwesome loading large images before resizing.
// See https://github.com/FortAwesome/react-fontawesome/issues/134
config.autoAddCss = false;

export default function PageHead({pageTitle}) {
    return (
        <html lang="en">
            <Head>
                {/* Tags for SEO */}
                <title>{`${pageTitle} | Vaccinate MA`}</title>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta
                    name="description"
                    content="A site to help Massachusetts residents find a vaccine"
                />
                <meta name="author" content="MA Volunteers" />
                <link
                    rel="shortcut icon"
                    type="image/x-icon"
                    href="ma_logo.png"
                />
                <meta
                    property="og:title"
                    content="Helping Massachusetts residents get vaccinated"
                />
                <meta property="og:image" content="ma_logo.png" />

                {/* Global site tag (gtag.js) - Google Analytics https://stackoverflow.com/a/62552263 */}
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-TPH643QYMP"
                />

                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', 'G-TPH643QYMP');
                            `,
                    }}
                />
                {/* Work around for ReactFontAwesome not respecting font size.
                See https://github.com/FortAwesome/react-fontawesome/issues/284 */}
                <style>{dom.css()}</style>
            </Head>
        </html>
    );
}

PageHead.propTypes = {
    pageTitle: PropTypes.string,
};
