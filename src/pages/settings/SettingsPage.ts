import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('settings-page')
export class SettingsPage extends LitElement {
  render() {
    return html`
      <global-header></global-header>
      <main style="
      min-height: 100vh; 
      min-height: 100dvh; 
      display: flex; 
      justify-content: center; 
      align-items: center;">
        <settings-form style="width: 100%;"></settings-form>
      </main>
    `;
  }
}