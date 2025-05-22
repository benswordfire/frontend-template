import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('two-factor-auth-page')
export class TwoFactorAuthPage extends LitElement {

  render() {
    return html`
      <main style="height: 100dvh; display: flex; justify-content: center; align-items: center;">
        <two-factor-auth-form></two-factor-auth-form>
      </main>
    `;
  }
}