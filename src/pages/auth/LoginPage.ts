import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('login-page')
export class LoginPage extends LitElement {

  render() {
    return html`
      <main style="height: 100dvh; display: flex; justify-content: center; align-items: center;">
        <login-form></login-form>
      </main>
    `;
  }
}