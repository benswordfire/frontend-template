import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('friends-list-pending-element')
export class FriendsListPendingElement extends LitElement {

  static styles = [resetStyles];

  @property() private name = '';
  @property() private requesterId = '';
  @property() private status = ''

  render() {
    return html `
      <li style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <sl-icon name="person-fill" style="height: 24px; width: 24px; background: #DDDDDD; padding: 0.5rem; border-radius: 50%"></sl-icon>
          <div>
            <p style="font-size: 16px;">${this.name}</p>
            <p style="font-size: 16px;">${this.status}</p>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <accept-friend-button requesterId=${ifDefined(this.requesterId)}></accept-friend-button>
          <sl-icon name="x" style="height: 24px; width: 24px; background: #DDDDDD; padding: 0.5rem; border-radius: 50%; color: var(--color-error);"></sl-icon>
        </div>      
      </li>
    `
  }
}