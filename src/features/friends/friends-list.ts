import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { authContext } from '../authentication/contexts/authentication/auth-context';
import { csrfContext } from '../authentication/contexts/csrf/csrf-context';
import { User } from '../authentication/types/User';
import { CallOffer } from '../messenger/types/CallOffer';
import { IncomingCallOffer } from '../messenger/types/IncomingCallOffer';
import { callContext } from '../messenger/context/call-context';

@customElement('friends-list')
export class FriendsList extends LitElement {

  static styles = [resetStyles];

  @consume({ context: authContext, subscribe: true })
  @state() user: User | null = null;

  @consume({ context: csrfContext, subscribe: true })
  @state() private token: string | '' = '';

  @consume({ context: callContext, subscribe: true })
  @state() private callOffer: IncomingCallOffer | null = null;

  @state() private friends = []
  @state() public friendId = ''

  @state() private incomingCall = '';

  //@property() private callOffer = {} as IncomingCallOffer

  @query('ul') private list!: HTMLUListElement;
  @query('call-alert') private callAlert!: HTMLElement;


  connectedCallback(): void {
    super.connectedCallback();
    this.fetchAllFriends()
    if (this.callOffer) {
      console.log(this.callOffer)
    }
  }

  /*private async fetchIncomingCall() {
    const stream = new EventSource(`http://localhost:3000/api/v1/calls/incoming/${this.user!.id}`);
    
    stream.addEventListener('offer', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.callOffer = data;
      console.log(this.callOffer)
      console.log(this.callOffer.callerName)
      const alert = document.createElement('call-alert');
      alert.setAttribute('callerName', this.callOffer.callerName);
      this.list.prepend(alert);
    });

    stream.onmessage = (event: MessageEvent) => {
      console.log('SSE Message:', event.data); 
    }
  }
  */
  private async fetchAllFriends () {
    try {
      const response = await fetch('http://localhost:3000/api/v1/account/friends', {
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
        <friends-list-element name=${friend.username} email=${friend.email} calleeId=${friend.friendId}></friends-list-element>
        `
      )}
    </ul>
    `;
  }
}

