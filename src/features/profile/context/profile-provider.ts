import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume, provide } from '@lit/context';
import { profileContext, User } from './profile-context';
import { FetchContext, fetchContext } from '../../../contexts/fetch/fetch-context';

@customElement('profile-provider')
export class ProfileProvider extends LitElement {
  
  @provide({ context: profileContext })
  @state() public profile: User | null = null;

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;
  
  private readonly _getUserProfile = async (): Promise<User | undefined> => {
    try {
      const result = await this.fetchContext.requestWithAuth('GET', '/user/profile',);
      
      return this.profile = result.data;
    } catch (error) {
      console.log(error)
    }
  };
  
  connectedCallback(): void {
    super.connectedCallback();
    this._getUserProfile();
    window.addEventListener('auth-changed', this._getUserProfile);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('auth-changed', this._getUserProfile)
  }


  render() {
    return html`<slot></slot>`;
  }
}