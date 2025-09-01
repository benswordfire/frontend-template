import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { Friend } from './types/Friend';
import { ifDefined } from 'lit/directives/if-defined.js';
import { fetchContext, FetchContext } from '../../contexts/fetch/fetch-context';

@customElement('friends-list')
export class FriendsList extends LitElement {

  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @state() private friends: Friend[] = [];
  @state() public friendId = '';

  connectedCallback(): void {
    super.connectedCallback();
    this._fetchAllFriends()
  }

  private readonly _fetchAllFriends = async (): Promise<Friend [] | undefined> => {
    try {
      const result = await this.fetchContext.requestWithAuth('GET', '/friends',);
      
      return this.friends = result.data;
    } catch (error) {
      console.log(error)
    }
  };

  render() {

    return html`
    <ul style="display: flex; flex-direction: column; gap: 1rem;">
      ${this.friends.map((friend) => 
      html `
        <friends-list-element name=${ifDefined(friend.username)} calleeId=${friend.friendId}></friends-list-element>
        `
      )}
    </ul>
    `;
  }
}

