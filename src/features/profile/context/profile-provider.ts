import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { profileContext, User } from './profile-context';

@customElement('profile-provider')
export class ProfileProvider extends LitElement {
  
  @provide({ context: profileContext })
  @state() public profile: User | null = null;

  private readonly _getUserProfile = async (): Promise<User | undefined> => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/user/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      return this.profile = result.data;
    } catch (error) {
      console.log(error)
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this._getUserProfile();
  }

  render() {
    return html`<slot></slot>`;
  }
}