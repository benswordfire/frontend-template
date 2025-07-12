import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { csrfContext } from './csrf-context';

@customElement('csrf-provider')
export class CsrfProvider extends LitElement {
  @provide({ context: csrfContext })
  @state() public token: string | null = null;
  @state() public loading = true;

  connectedCallback() {
    super.connectedCallback();
    this.getCsrfToken();
  }

  async getCsrfToken () {
    try {
      const response = await fetch('http://localhost:3000/api/v1/csrf-token', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const result = await response.json();
      console.log(result.csrfToken)
      this.token = result.csrfToken;
      this.loading = false;
    } catch (error) {
      console.log(error);
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

