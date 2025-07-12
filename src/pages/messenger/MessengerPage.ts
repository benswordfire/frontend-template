import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('messenger-page')
export class MessengerPage extends LitElement {
  render() {
    return html`
      <div style="min-height: 100vh; min-height: 100dvh; display: grid; grid-template-columns: auto 1fr;">
        <main style="display: flex; justify-content: center; padding: 1rem;">
          <messenger-element></messenger-element>
        </main>
      </div>
    `;
  }
}