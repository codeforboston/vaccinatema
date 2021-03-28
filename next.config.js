require('dotenv').config();

module.exports = {
    distDir: 'static/_next',
    async redirects() {
        return [
            // The original website had a separate search page; now search
            // functionality lives on the home page.
            {
                source: '/search',
                destination: '/',
                permanent: true,
            },
        ];
    },
    env: {
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
};
