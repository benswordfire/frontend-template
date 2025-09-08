import { Router } from '@vaadin/router';
import './pages/auth/LoginPage';
import './pages/auth/RegistrationPage';
import './pages/settings/SettingsPage';
import './pages/auth/EmailVerificationPage'



const isAuthenticated = async () => {
  try {
    const response = await fetch('https://kollme.com/api/v1/auth/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const result = await response.json();
    return result.success
  } catch (error) {
    console.error('Error fetching auth state')
  }
};

const routes = [
  { path: '/', component: 'index-page' },
  { path: '/auth/login', component: 'login-page', },
  { path: '/auth/registration', component: 'registration-page' },
  { path: '/auth/email-verification', component: 'email-verification-page'},
  { path: '/auth/forgot-password', component: 'forgot-password' },
  { path: '/auth/two-factor-auth', component: 'two-factor-auth-page' },
  { path: '/friends', component: 'friends-page' },
  { path: '/settings', component: 'settings-page', 
    action: async () => { 
      if (await isAuthenticated() === false) { 
        Router.go('/auth/login');
      }
    }
  },
  { path: '/chat', component: 'video-chat-page' }
];

const router = new Router(document.querySelector('#app'));
router.setRoutes(routes);
