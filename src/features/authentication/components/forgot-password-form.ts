import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { resetStyles } from '../../../styles/reset-styles';
import { errorContext, ErrorContext } from '../../../contexts/error/error-context';
import { fetchContext, FetchContext } from '../../../contexts/fetch/fetch-context';

@customElement('forgot-password')
export class ForgotPasswordForm extends LitElement {

  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @consume({ context: errorContext, subscribe: true })
  @state() errorContext!: ErrorContext;

  @state() private errors: Partial<Record<keyof LoginFormDto, string>> = {};

  @query('form') private form!: HTMLFormElement;
  @query('form-alert') private formAlert!: HTMLElement;

  render() {
    return html`
      <form @submit=${this._handleSubmit} novalidate>
        <h1 class="logo">kollme</h1>        
        <p style="text-align: center; color: var(--secondary-color);">Login with your credentials.</p>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" autocomplete="off" />
          ${this.errors.email ? html`<input-error-message message="${this.errors.email}">` : null}
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" autocomplete="off" />
          ${this.errors.password ? html`<input-error-message message="${this.errors.password}">` : null}
        </div>
        <button type="submit" class="primary">Let's go!</button>
        <p style="font-size: 0.9rem; text-align: center;">New here? <a href="/auth/registration" class="router-link">Create an account.</a></p>
      </form>
    `;
  }
}
