import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume, provide } from '@lit/context';
import { authContext, User } from './auth-context';
import { ErrorContext, errorContext } from '../../../../contexts/error/error-context';
import { fetchContext, FetchContext } from '../../../../contexts/fetch/fetch-context';
import { UserApiResponseSchema, UserSchema } from '../../types/User';

@customElement('auth-provider')
export class AuthProvider extends LitElement {
  
  @provide({ context: authContext })
  @state() public user: User | null = null;
  @state() public loading: boolean = true;

  @consume({ context: errorContext, subscribe: true })
  @state() private errorContext!: ErrorContext;

  @consume({ context: fetchContext, subscribe: true })
  @state() private fetchContext!: FetchContext;

  private readonly _checkUserAuthentication = async (): Promise<User | undefined> => {
    try {
      const response = await this.fetchContext.fetchWithAuth<User>({ 
        endpoint: 'current-user', 
        options: { method: 'GET' },
        schema: UserSchema
      });

      return this.user = response as User;
      
    } catch (error: any) {
      this.user = null;
      this.errorContext?.reportError({
        message: error?.message ?? 'Failed to authenticate user',
        source: 'auth-provider',
        severity: 'medium'
      });
    } finally {
      this.loading = false;
    }
  }

  private hasCheckedAuth = false;

  async updated() {
    console.log('fetchContext:', this.fetchContext);

    if (!this.hasCheckedAuth && this.fetchContext?.fetchWithAuth) {
      this.hasCheckedAuth = true;
      await this._checkUserAuthentication();
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener('auth-changed', this._checkUserAuthentication);
    
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('auth-changed', this._checkUserAuthentication);
  }

  render() {
    return this.loading
      ? html`<p>Loading...</p>`
      : html`<slot></slot>`;
  }
}
