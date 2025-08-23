import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { LoginFormDto, LoginFormSchemaDto } from '../types/LoginFormDto';
import { Router } from '@vaadin/router';
import { resetStyles } from '../../../styles/reset-styles';
import { errorContext, ErrorContext } from '../../../contexts/error/error-context';
import { fetchContext, FetchContext } from '../../../contexts/fetch/fetch-context';
import { extractFormData } from '../../../utils/validation/extractFormData';
import { validateFormData } from '../../../utils/validation/validateFormData';
import { showFormAlert } from '../../../utils/form/showFormAlert';

@customElement('login-form')
export class LoginForm extends LitElement {

  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @consume({ context: errorContext, subscribe: true })
  @state() errorContext!: ErrorContext;

  @state() private errors: Partial<Record<keyof LoginFormDto, string>> = {};

  @query('form') private form!: HTMLFormElement;
  @query('form-alert') private formAlert!: HTMLElement;

  private async _handleSubmit (event: Event) {
    event.preventDefault();
    try {
      const formData = extractFormData<LoginFormDto>(this.form);

      const validation = validateFormData(formData, LoginFormSchemaDto)
    
      if (validation.errors) {
        this.errors = validation.errors;
        return;
      }

      const result = await this.fetchContext.requestWithAuth('POST', '/auth/login', validation.parsed.data);

      if (this.formAlert) {
        this.formAlert.remove();
      }

      if (!result.success) {
        const alert = showFormAlert(false, result.message);
        this.form.prepend(alert);
      }

      if (result.twoFactorRequired) {
        Router.go(`/auth/two-factor-auth?type=${result.typeOfTwoFactorAuth}`);
      } else if (result.success && result.authorized) {
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { token: result.data }}));
        Router.go('/settings');
      }
    } catch (error) {
      this.errorContext.reportError({
        message: 'Login form error',
        detail: error instanceof Error ? error.stack?.toString() : String(error),
        source: 'login-form',
        severity: 'high'
      });

      if (this.formAlert) {
        this.formAlert.remove();
      }

      const alert = showFormAlert(false, 'Something went wrong. Please try again.');
      this.form.prepend(alert);
    }
  } 

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
      <a href="http://localhost:3000/api/v1/auth/google">Sign in with Google</a>
    `;
  }
}
