export default new class Auth {
    /* Local storage helpers */
    getSession = () => {
        try {
            return JSON.parse(localStorage.getItem('volunteerSession' || 'null'));
        } catch (e) {
            return null;
        }
    };
    setSession = (session) => localStorage.setItem('volunteerSession', JSON.stringify(session));
    clearSession = () => localStorage.removeItem('volunteerSession');
};