import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('receiver-page')
export class ReceiverPage extends LitElement {
  render() {
    return html`
      <div style="min-height: 100vh; display: grid; grid-template-columns: auto 1fr;">
        <main style="height: 100dvh; display: flex; padding: 0.5rem;">
          <receiver-element></receiver-element>
        </main>
      </div>
    `;
  }
}