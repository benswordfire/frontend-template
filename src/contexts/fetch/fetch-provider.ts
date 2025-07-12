import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { consume, provide } from '@lit/context';
import { fetchContext, FetchContext } from './fetch-context';
import { csrfContext } from '../../features/authentication/contexts/csrf/csrf-context';
import { errorContext, ErrorContext } from '../error/error-context';
import { FetchParams } from './types/FetchParams';
import { ApiResult, ApiResultSchema } from './types/ApiResult';

@customElement('fetch-provider')
export class FetchProvider extends LitElement {
  private readonly API_URL = import.meta.env.VITE_BASE_URL;

  @consume({ context: csrfContext, subscribe: true })
  @state() private _csrfToken: string = '';

  @consume({ context: errorContext, subscribe: true })
  @state() private errorContext!: ErrorContext;

  public fetchWithAuth = async <T>({
    endpoint,
    data = {},
    options = {},
    schema
  }: FetchParams<T>): Promise<T | undefined> => {
    try {
      console.log(this._csrfToken)
      const response = await fetch(`${this.API_URL}/${endpoint}`, {
        method: options?.method || 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this._csrfToken || ''
        },
        ...options,
        body: options?.method !== 'GET' ? JSON.stringify(data) : undefined
      });
      const json = await response.json();

      if (schema) {
        const result = schema.safeParse(json.data);

        if (!result.success) {
console.error('Full Zod error:', result.error);
console.error('Expected shape:', schema ?? ApiResultSchema);
console.error('Raw API data:', json.data);
          this.errorContext?.reportError({
            message: 'Invalid API response format',
            detail: result.error.toString(),
            source: 'fetch-provider',
            severity: 'high'
          });
          return undefined;
        }
        return result.data;
      }

      const result = ApiResultSchema.safeParse(json);
      
      if (!result.success) {
console.error('Full Zod error:', result.error);
console.error('Expected shape:', schema ?? ApiResultSchema);
console.error('Raw API data:', json.data);
        this.errorContext?.reportError({
          message: 'Invalid API response format',
          detail: result.error.toString(),
          source: 'fetch-provider',
          severity: 'high'
        });
        return undefined;
      }
      
      return result.data as T;

    } catch (error: any) {
      this.errorContext?.reportError({
        message: error?.message ?? 'Failed to fetch',
        source: 'fetch-provider',
        severity: 'high'
      });
      return undefined;
    }

  };

  @provide({ context: fetchContext })
  @state()
  fetchContext: FetchContext = {
    fetchWithAuth: this.fetchWithAuth
  };

  render() {
    return html `<slot></slot>`
  };
}