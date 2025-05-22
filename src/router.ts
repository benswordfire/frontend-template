import { Router } from '@vaadin/router';
import './pages/auth/LoginPage';
import './pages/auth/RegistrationPage';

const isAuthenticated = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/current-user', {
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
  { path: '/auth/login', component: 'login-page', },
  { path: '/auth/registration', component: 'registration-page' },
  { path: '/auth/two-factor-auth', component: 'two-factor-auth-page'},
  { path: '/messenger', component: 'messenger-page'},
  { path: '/receiver', component: 'receiver-page'},
  { path: '/email-verification', component: 'email-verification-page'},
  { 
    path: '/dashboard', 
    component: 'dashboard-page',
    action: async () => {
      if (await isAuthenticated() === false) {
        Router.go('/auth/login');
      }
    }
  },
  { 
    path: '/settings', 
    component: 'settings-page',
    action: async () => {
      if (await isAuthenticated() === false) {
        Router.go('/auth/login');
      }
    }
  },
];

const router = new Router(document.querySelector('#app'));
router.setRoutes(routes);
