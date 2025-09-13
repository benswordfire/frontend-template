import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { Friend } from './types/Friend';
import { ifDefined } from 'lit/directives/if-defined.js';
import { fetchContext, FetchContext } from '../../contexts/fetch/fetch-context';
import { profileContext, User } from '../profile/context/profile-context';

@customElement('friends-list-pending')
export class FriendsListPending extends LitElement {

  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @consume({ context: profileContext, subscribe: true })
  @state() private profile: User | null = null;

  @state() private friends: Friend[] = [];
  @state() public friendId = '';

  connectedCallback(): void {
    super.connectedCallback();
    this._fetchAllFriends()
  }

  private readonly _fetchAllFriends = async (): Promise<Friend [] | undefined> => {
    try {
      const result = await this.fetchContext.requestWithAuth('GET', '/friends/pending',);
      console.log('MY ID:', this.profile?.id, 'FRIEND ID:', result.data )
      return this.friends = result.data;
    } catch (error) {
      console.log(error)
    }
  };

  private readonly isOwnRequest = (requesterId: string, profileId: string) => {
    return requesterId.trim().toLowerCase() === profileId.trim().toLowerCase();
  };


  render() {
    return html`
    <ul style="display: flex; flex-direction: column; gap: 1rem;">
      ${this.friends.map((friend) => 
      html `
        <friends-list-element name=${ifDefined(friend.username)} calleeId=${ifDefined(friend.friendId)} status=${ this.isOwnRequest(this.profile!.id, friend.requesterId) ? 'Request sent' : 'Wanna be friends'}>
        </friends-list-element>
        `
      )}
    </ul>
    `;
  }
}

