module.exports = {
    distDir: 'static/_next',
    async redirects() {
        return [
            {
                source: '/search',
                destination: '/',
                permanent: true,
            },
        ];
    },
};
