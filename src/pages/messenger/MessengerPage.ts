import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('messenger-page')
export class MessengerPage extends LitElement {
  render() {
    return html`
      <div style="min-height: 100vh; min-height: 100dvh; display: grid; grid-template-columns: auto 1fr;">
        <global-sidebar></global-sidebar>
        <main style="display: flex; justify-content: center;">
          <messenger-element></messenger-element>
        </main>
      </div>
    `;
  }
}