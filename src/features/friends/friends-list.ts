import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { csrfContext } from '../authentication/contexts/csrf/csrf-context';
import { Friend } from './types/Friend';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('friends-list')
export class FriendsList extends LitElement {

  static styles = [resetStyles];

  @consume({ context: csrfContext, subscribe: true })
  @state() private token: string | '' = '';

  @state() private friends: Friend[] = []
  @state() public friendId = ''

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchAllFriends()
  }

  private async fetchAllFriends () {
    try {
      const response = await fetch('http://localhost:3000/api/v1/friends', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.token,
        },
      })
      const result = await response.json();
      this.friends = result.data;
    } catch (error) {
      console.error(error);
    }
  }

  render() {

    return html`
    <ul style="display: flex; flex-direction: column; gap: 1rem;">
      ${this.friends.map((friend) => 
      html `
        <friends-list-element name=${ifDefined(friend.username)} calleeId=${friend.id}></friends-list-element>
        `
      )}
    </ul>
    `;
  }
}

