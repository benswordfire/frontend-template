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

  render() {
    return html`
      <ul>
        ${this.friends.map((friend) => {
          console.log(
            'profile.id:', this.profile?.id,
            'requesterId:', friend.requesterId,
            'username:', friend.username
          );
          return html`
            <friends-list-pending-element
              name=${ifDefined(friend.username)}
              requesterId=${ifDefined(friend.requesterId)}
              status=${this.profile?.id === friend.requesterId
                ? 'Request sent'
                : 'Wanna be friends'}
            >
            </friends-list-pending-element>
          `;
        })}
      </ul>
    `;
  }


}

