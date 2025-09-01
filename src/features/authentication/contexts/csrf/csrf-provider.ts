import { LitElement, PropertyValues, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume, provide } from '@lit/context';
import { csrfContext } from './csrf-context';
import { errorContext, ErrorContext } from '../../../../contexts/error/error-context';
import { fetchContext, FetchContext } from '../../../../contexts/fetch/fetch-context';

@customElement('csrf-provider')
export class CsrfProvider extends LitElement {
  private readonly API_URL = import.meta.env.VITE_BASE_URL;

  @provide({ context: csrfContext })
  @state() public token: string | null = null;
  @state() public loading = true;

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @consume({ context: errorContext, subscribe: true })
  @state() errorContext!: ErrorContext;

  connectedCallback() {
    super.connectedCallback();
    this._fetchCsrfToken();
    window.addEventListener('auth-changed', this._handleCsrfTokenUpdate);
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('auth-changed', this._handleCsrfTokenUpdate);
  };

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('token')) {
      console.log('Token updated in provider:', this.token)
    }
  }

  private _handleCsrfTokenUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<{ token: string }>;
    this.token = customEvent.detail.token;
    console.log('NEW TOKEN:', this.token)
    this.requestUpdate();
  };

  private async _fetchCsrfToken () {
    try {
      const response = await fetch(`${this.API_URL}/csrf-token`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const result = await response.json();
      this.token = result.csrfToken;
      console.log('OLD TOKEN:', this.token)
      this.loading = false;
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  };

  render() {
    return this.loading
      ? html`<p>Loading...</p>`
      : html`<slot></slot>`;
  }
}

