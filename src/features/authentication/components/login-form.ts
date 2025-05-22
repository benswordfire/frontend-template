import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { csrfContext } from '../contexts/csrf/csrf-context';
import { LoginFormData, LoginFormSchema } from '../types/LoginFormData';
import { Router } from '@vaadin/router';
import { resetStyles } from '../../../styles/reset-styles';

@customElement('login-form')
export class LoginForm extends LitElement {

  static styles = [resetStyles];

  @consume({ context: csrfContext, subscribe: true })
  @state() private token?: string;

  @state() private email: string = '';
  @state() private password: string = '';
  @state() private errors: Partial<Record<keyof LoginFormData, string>> = {};


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


  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.name === 'email') this.email = target.value;
    if (target.name === 'password') this.password = target.value;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const formData = this.extractFormData<LoginFormData>(this.form);

    const parsed = LoginFormSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const error of parsed.error.errors) {
        fieldErrors[error.path[0] as keyof LoginFormData] = error.message;
      }

      this.errors = fieldErrors;
      return;
    }

    this.errors = {};

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.token || ''
        },
        body: JSON.stringify(parsed.data),
      });

      const result = await response.json();
      
      if (this.formAlert) {
        this.formAlert.remove();
      }

      if (!result.success) {
        const alert = document.createElement('form-alert');
        alert.setAttribute('alertType', result.success ? 'success' : 'error');
        alert.setAttribute('alertMessage', result.message);
        this.form.prepend(alert);
      }

      if (result.twoFactorRequired) {
        Router.go(`/auth/two-factor-auth?type=${result.twoFactorAuthType}`);
      } else if (result.success && result.authorized) {
        window.dispatchEvent(new CustomEvent('auth-changed'));
        Router.go('/settings');
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
      <form @submit=${this.handleSubmit} novalidate>
        <h1 class="logo">justcallmebro.</h1>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" .value=${this.email} @input=${this.handleInput} autocomplete="off" />
          ${this.errors.email ? html`<input-error-message message="${this.errors.email}">` : null}
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" .value=${this.password} @input=${this.handleInput} autocomplete="off" />
          ${this.errors.password ? html`<input-error-message message="${this.errors.password}">` : null}
        </div>
        <button type="submit" class="primary">C'mon! Let me call my bros!</button>
        <p style="font-size: 0.9rem; text-align: center;">New here? <a href="/auth/registration" class="router-link">Create an account.</a></p>
      </form>
    `;
  }
}
