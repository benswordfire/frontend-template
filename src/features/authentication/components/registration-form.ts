import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { resetStyles } from '../../../styles/reset-styles';
import { RegistrationFormData, RegistrationFormSchema } from '../types/RegistrationFormData';
import { FetchContext, fetchContext } from '../../../contexts/fetch/fetch-context';
import { validateFormData } from '../../../utils/validation/validateFormData';
import { showFormAlert } from '../../../utils/form/showFormAlert';
import { extractFormData } from '../../../utils/validation/extractFormData';
import { ErrorContext, errorContext } from '../../../contexts/error/error-context';

@customElement('registration-form')
export class RegistrationForm extends LitElement {

  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @consume({ context: errorContext, subscribe: true })
  @state() errorContext!: ErrorContext;

  @state() private password: string = '';
  @state() private errors: Partial<Record<keyof RegistrationFormData, string>> = {};

  @query('form') private form!: HTMLFormElement;
  @query('form-alert') private formAlert!: HTMLElement;

  private _handleSubmit = async (event: Event) => {
    event.preventDefault();
    try {
      const formData = extractFormData<RegistrationFormData>(this.form);
  
      const validation = validateFormData(formData, RegistrationFormSchema);
  
      if (validation.errors) {
        this.errors = validation.errors;
        return;
      }
  
      const result = await this.fetchContext.requestWithAuth('POST', '/auth/register', validation.parsed?.data);
  
      if (this.formAlert) {
        this.formAlert.remove();
      }

      const alert = showFormAlert(result.success, result.message);
      this.form.prepend(alert);

    } catch (error) {
      this.errorContext.reportError({
        message: 'Registration form error',
        detail: error instanceof Error ? error.stack?.toString() : String(error),
        source: 'registration-form',
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
        <h1 class="logo">kollme.</h1>
        <p style="text-align: center; color: var(--secondary-color);">Sign up and start calling your bros.</p>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" autocomplete="off" />
          ${this.errors.email ? html`<input-error-message message="${this.errors.email}">` : null}
        </div>
        <div class="form-group">
          <label for="email">Password</label>
          <input type="password" id="password" name="password" autocomplete="off" 
            @input=${(e: Event) => { 
              const target = e.target as HTMLInputElement;
              this.password = target.value; // update the state
            }}
          />
        </div>
        <password-validation password="${this.password}"></password-validation>
        <button type="submit" class="primary" >Create a new account!</button>
        <p style="font-size: 0.9rem; text-align: center;">Already a member? <a href="/auth/login" class="router-link">Sign in.</a></p>
      </form>
    `;
  }
}
