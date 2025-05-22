import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('settings-page')
export class SettingsPage extends LitElement {
  render() {
    return html`
      <div style="min-height: 100vh; min-height: 100dvh; display: grid; grid-template-columns: auto 1fr;">
        <global-sidebar></global-sidebar>
        <main style="display: flex;">
          <settings-form></settings-form>
        </main>
      </div>
    `;
  }
}