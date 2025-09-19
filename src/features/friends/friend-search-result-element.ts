import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';

@customElement('friends-search-result-element')
export class FriendsSearchResultElement extends LitElement {

  static styles = [resetStyles];

  @property() private username = '';
  @property() private friendId = '';

  render() {
    return html `
      <li style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <sl-icon name="person-fill" style="height: 24px; width: 24px; background: #DDDDDD; padding: 0.5rem; border-radius: 50%"></sl-icon>
          <div>
            <p style="font-size: 16px;">${this.username}</p>
          </div>
        </div>
        <add-friend-button friendId=${this.friendId}></add-friend-button>
      </li>
    `
  }
}