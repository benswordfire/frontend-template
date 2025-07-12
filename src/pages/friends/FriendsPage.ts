import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('friends-page')
export class FriendsPage extends LitElement {
  render() {
    return html`
      <global-header></global-header>
      <main style="
      max-width: 480px;
      width: 90%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 100vh; 
      min-height: 100dvh; 
      display: flex; 
      align-items: center;"
      >
        <friends-list style="width: 100%"></friends-list>
      </main>
    `;
  }
}