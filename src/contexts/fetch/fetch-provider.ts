import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume, provide } from '@lit/context';
import { fetchContext } from './fetch-context';
import { csrfContext } from '../../features/authentication/contexts/csrf/csrf-context';
import { errorContext, ErrorContext } from '../error/error-context';

@customElement('fetch-provider')
export class FetchProvider extends LitElement {
  private readonly API_URL = import.meta.env.VITE_BASE_URL;
  @provide({ context: fetchContext })
  
  @consume({ context: csrfContext, subscribe: true })
  @state() private _csrfToken: string = '';

  @consume({ context: errorContext, subscribe: true })
  @state() private errorContext!: ErrorContext;

  public requestWithAuth = async (
    method: string, 
    endpoint: string, 
    formData?: object
  ) => {
    try {
      const response = await fetch(`${this.API_URL}${endpoint}`, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this._csrfToken,
        },
        body: method !== 'GET' ? JSON.stringify(formData) : undefined,
      });
      const result = await response.json();
      return result;
    } catch (error) {
      this.errorContext.reportError({
        message: 'Request with auth error',
        detail: error instanceof Error ? error.stack?.toString() : String(error),
        source: 'fetch-provider',
        severity: 'high'
      });
      return { success: false, message: 'Network error' };
    }
  };

  public requestWithoutAuth = async (
    method: string, 
    endpoint: string
  ) => {
    try {
      const response = await fetch(`${this.API_URL}${endpoint}`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      return result;
    } catch (error) {
      this.errorContext.reportError({
        message: 'Request without auth error',
        detail: error instanceof Error ? error.stack?.toString() : String(error),
        source: 'fetch-provider',
        severity: 'high'
      });
      return { success: false, message: 'Network error' };
    }
  };
  
  @provide({ context: fetchContext })
  private fetchContextValue = {
    requestWithAuth: this.requestWithAuth.bind(this),
    requestWithoutAuth: this.requestWithoutAuth.bind(this),
  };

  render() {
    return html `<slot></slot>`
  };
}