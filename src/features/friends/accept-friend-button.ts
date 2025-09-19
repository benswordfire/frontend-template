import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { fetchContext, FetchContext } from '../../contexts/fetch/fetch-context';
import { consume } from '@lit/context';
import { User } from '../authentication/types/User';
import { profileContext } from '../profile/context/profile-context';

@customElement('accept-friend-button')
export class AcceptFriendButton extends LitElement {

  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @property({ type: String })
  requesterId: string = '';

  connectedCallback(): void {
    super.connectedCallback();
  }
  
  private async _acceptFriend() {
    try {
      const result = await this.fetchContext.requestWithAuth('POST', `/friends/accept`, { friendId: this.requesterId });
      console.log('ACCEPT RESULT:', result)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return html `
      <sl-icon @click=${this._acceptFriend} name="check" style="height: 24px; width: 24px; background: #DDDDDD; padding: 0.5rem; border-radius: 50%; color: var(--color-success);  cursor: pointer;"></sl-icon>
    `;
  }
}

