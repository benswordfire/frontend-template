import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('registration-page')
export class RegistrationPage extends LitElement {

  render() {
    return html`
      <main style="height: 100dvh; display: flex; justify-content: center; align-items: center;">
        <registration-form style="width: 100%;"></registration-form>
      </main>
    `;
  }
}