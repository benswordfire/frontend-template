import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';

@customElement('friends-list-element')
export class FriendsListElement extends LitElement {

  static styles = [resetStyles];

  @property() private name = '';
  @property() private email = '';
  @property() private calleeId = '';
  @property() private status = ''

  render() {
    return html `
      <li style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <sl-icon name="person-fill" style="height: 24px; width: 24px; background: #DDDDDD; padding: 0.5rem; border-radius: 50%"></sl-icon>
          <div>
            <p style="font-size: 16px;">${this.name}</p>
            <p style="font-size: 16px;">${this.email}</p>
            <p style="font-size: 16px;">${this.calleeId}</p>
            <p style="font-size: 16px;">${this.status}</p>
          </div>
        </div>
        <call-button calleeId=${this.calleeId}></call-button>
      </li>
    `
  }
}