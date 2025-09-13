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
        <friend-search style="width: 100%;"></friend-search>
        <sl-tab-group style="width: 100%;">
          <sl-tab slot="nav" panel="accepted">Friends</sl-tab>
          <sl-tab slot="nav" panel="pending">Friend request</sl-tab>
          <sl-tab-panel name="accepted">
            <friends-list style="width: 100%;"></friends-list>
          </sl-tab-panel>
          <sl-tab-panel name="pending">
            <friends-list-pending></friends-list-pending>
          </sl-tab-panel>
        </sl-tab-group>

      </main>
    `;
  }
}