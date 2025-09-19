import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { fetchContext, FetchContext } from '../../contexts/fetch/fetch-context';
import { consume } from '@lit/context';

@customElement('add-friend-button')
export class AddFriendButton extends LitElement {

  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @property({ type: String })
  friendId: string = '';

  connectedCallback(): void {
    super.connectedCallback();
  }
  
  private async _addFriend() {
    try {
      const result = await this.fetchContext.requestWithAuth('POST', `/friends/request`, { friendId: this.friendId });
      console.log('RESULT::', result)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return html `
      <sl-icon @click=${this._addFriend} name="person-add" style="height: 20px; width: 20px; background: var(--color-primary); color: #FFF; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer;"></sl-icon>
    `;
  }
}

