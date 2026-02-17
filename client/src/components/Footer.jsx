import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-secondary text-white p-8 text-center mt-auto">
            <p>&copy; {new Date().getFullYear()} Boutique Shop. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
