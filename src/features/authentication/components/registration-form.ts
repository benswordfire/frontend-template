import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { csrfContext } from '../contexts/csrf/csrf-context';
import { resetStyles } from '../../../styles/reset-styles';
import { RegistrationFormData, RegistrationFormSchema } from '../types/RegistrationFormData';
import { FetchContext, fetchContext } from '../../../contexts/fetch/fetch-context';
import { ApiResult } from '../../../contexts/fetch/types/ApiResult';

@customElement('registration-form')
export class RegistrationForm extends LitElement {

  static styles = [resetStyles];

  @consume({ context: csrfContext, subscribe: true })
  private _csrfToken!: string;

  @consume({ context: fetchContext, subscribe: true })
  @state() private fetchContext!: FetchContext;

  @state() private email: string = '';
  @state() private password: string = '';
  @state() private errors: Partial<Record<keyof RegistrationFormData, string>> = {};

  @query('form') private form!: HTMLFormElement;
  @query('form-alert') private formAlert!: HTMLElement;

  private extractFormData<T extends Record<string, any>>(form: HTMLFormElement): T {
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());

    const data = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, typeof value === 'string' ? value : String(value)])
    ) as T;

    return data;
  }

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.name === 'email') this.email = target.value;
    if (target.name === 'password') this.password = target.value;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const formData = this.extractFormData<RegistrationFormData>(this.form);

    const parsed = RegistrationFormSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof RegistrationFormData, string>> = {};
      for (const error of parsed.error.errors) {
        fieldErrors[error.path[0] as keyof RegistrationFormData] = error.message;
      }

      this.errors = fieldErrors;
      return;
    }

    this.errors = {};

    try {
      const response = await fetch('http://localhost:3000/api/v1/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this._csrfToken,
        },
        body: JSON.stringify(parsed.data),
      });

      const result = await response.json();

      if (this.formAlert) {
        this.formAlert.remove();
      }

      const alert = document.createElement('form-alert');
      alert.setAttribute('alertType', result.success ? 'success' : 'error');
      alert.setAttribute('alertMessage', result.message);
      this.form.prepend(alert);

    } catch (error) {
      console.error(error);
      const alert = document.createElement('form-alert');
      alert.setAttribute('alertType', 'error');
      alert.setAttribute('alertMessage', 'Something went wrong. Please try again.');
      this.form.prepend(alert);
    }
  }

  private readonly _handleSubmit = async (event: Event) => {
    event.preventDefault();

    const formData = this.extractFormData<RegistrationFormData>(this.form);

    const parsed = RegistrationFormSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof RegistrationFormData, string>> = {};
      for (const error of parsed.error.errors) {
        fieldErrors[error.path[0] as keyof RegistrationFormData] = error.message;
      }

      this.errors = fieldErrors;
      return;
    }

    this.errors = {};

    try {
      const result: ApiResult | undefined = await this.fetchContext.fetchWithAuth({
        endpoint: 'register',
        options: { method: 'POST' },
        data: parsed.data
      });

      if (result) {
        console.log('REG?RES:', result)
        if (this.formAlert) {
          this.formAlert.remove();
        }
  
        const alert = document.createElement('form-alert');
        alert.setAttribute('alertType', result.success ? 'success' : 'error');
        alert.setAttribute('alertMessage', result.message ? result.message : '');
        this.form.prepend(alert);
        
      }
    } catch (error) {
      console.error(error);
      const alert = document.createElement('form-alert');
      alert.setAttribute('alertType', 'error');
      alert.setAttribute('alertMessage', 'Something went wrong. Please try again.');
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
          <input type="email" id="email" name="email" .value=${this.email} @input=${this.handleInput} autocomplete="off" />
          ${this.errors.email ? html`<input-error-message message="${this.errors.email}">` : null}
        </div>
        <div class="form-group">
          <label for="email">Password</label>
          <input type="password" id="password" name="password" .value=${this.password} @input=${this.handleInput} autocomplete="off" />
        </div>
        <password-validation password="${this.password}"></password-validation>
        <button type="submit" class="primary" >Create a new account!</button>
        <p style="font-size: 0.9rem; text-align: center;">Already a member? <a href="/auth/login" class="router-link">Sign in.</a></p>
      </form>
    `;
  }
}
