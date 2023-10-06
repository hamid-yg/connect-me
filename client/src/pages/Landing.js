import React from 'react';
import { useHistory } from 'react-router-dom';

const Landing = () => {
    const history = useHistory();

    const handleJoinMeeting = () => {
        history.push('/video');
    };

    return (
        <div>
            <header style={{ backgroundColor: '#007bff', color: '#fff', padding: '20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0' }}>Connect-Me</h1>
            </header>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>Welcome to Connect-Me</h1>
                <p style={{ fontSize: '24px', margin: '20px 0' }}>Connect-Me is a social networking platform that allows you to connect with people from all over the world.</p>
                <p style={{ fontSize: '24px', margin: '20px 0' }}>Our platform is designed to help you build meaningful relationships with people who share your interests and passions.</p>
                <p style={{ fontSize: '24px', margin: '20px 0' }}>Whether you're looking to make new friends, find a mentor, or network with other professionals, Connect-Me has everything you need to get started.</p>
                <button onClick={handleJoinMeeting} style={{ fontSize: '24px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', border: 'none' }}>Join Meeting</button>
            </div>
            <footer style={{ backgroundColor: '#007bff', color: '#fff', padding: '20px', textAlign: 'center', marginTop: '50px' }}>
                <p style={{ margin: '0' }}>© 2021 Connect-Me</p>
            </footer>
        </div>
    );
};

export default Landing;
