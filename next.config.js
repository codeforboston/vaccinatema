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
};
