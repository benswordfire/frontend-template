import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { authContext, User } from './auth-context';

@customElement('auth-provider')
export class AuthProvider extends LitElement {
  
  @provide({ context: authContext })
  @state() public user: User | null = null;
  @state() public loading: boolean = true;

  private boundGetCurrentUser = this.getCurrentUser.bind(this);

  connectedCallback() {
    super.connectedCallback();
    this.boundGetCurrentUser();
    window.addEventListener('auth-changed', this.boundGetCurrentUser);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('auth-changed', this.getCurrentUser);
  }

  public async getCurrentUser () {
    try {
      const response = await fetch('http://localhost:3000/api/v1/current-user', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      this.user = result.data
    } catch (error) {
      this.user = null;
      console.error('Error fetching auth state')
    } finally {
      this.loading = false;
    }
  }

  render() {
    return this.loading
      ? html`<p>Loading...</p>`
      : html`<slot></slot>`;
  }
}
