import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('email-verification-page')
export class EmailVerificationPage extends LitElement {

  render() {
    return html`
      <main style="height: 100dvh; display: flex; justify-content: center; align-items: center;">
        <email-verification-form></email-verification-form>
      </main>
    `;
  }
}