import { consume } from '@lit/context';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ErrorContext, errorContext } from '../error/error-context';

@customElement('error-boundary')
export class ErrorBoundary extends LitElement {
  @state() hasError = false;
  @state() error?: Error;

  @consume({ context: errorContext, subscribe: true })
  @state() errorContext?: ErrorContext;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('error', this._handleGlobalError);
    window.addEventListener('unhandledrejection', this._handlePromiseRejection);
  }

  disconnectedCallback (): void {
    super.disconnectedCallback();
    window.removeEventListener('error', this._handleGlobalError);
    window.removeEventListener('unhandledrejection', this._handlePromiseRejection);
  }

  private _handleGlobalError = (event: ErrorEvent) => {
    this.hasError = false;
    this.error = event.error;
    event.preventDefault();
  };

  private _handlePromiseRejection = (event: PromiseRejectionEvent) => {
    this.hasError = true;
    this.error = event.reason;
    event.preventDefault();
  };

  private retry() {
    this.hasError = false;
    this.error = undefined;

    this.errorContext?.clearErrors();

    this.dispatchEvent(new CustomEvent('retry'));
  };


  render() {
    if (this.hasError) {
      return html`
        <div class="error-fallback">
          <h2>Something went wrong</h2>
          ${this.error?.message && html`<p>${this.error.message}</p>`}
          
          ${this.errorContext?.errors.map(error => html`
            <div class="context-error">${error.message}</div>
          `)}
          
          <button @click=${this.retry}>Try again</button>
          <button @click=${() => location.reload()}>Reload page</button>
        </div>
      `;
    }

    return html`<slot></slot>`;
  }
}