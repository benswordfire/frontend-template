import { LitElement, PropertyValues, html } from 'lit';
import { consume } from '@lit/context';
import { customElement, query, state } from 'lit/decorators.js';
import { resetStyles } from '../../../styles/reset-styles';
import { Router } from '@vaadin/router';
import { csrfContext } from '../contexts/csrf/csrf-context';
import { LoginFormData } from '../types/LoginFormData';

@customElement('login-form')
export class LoginForm extends LitElement {
  static styles = [resetStyles];

  @consume({ context: csrfContext, subscribe: true })
  @state() private token?: string;

  @state() private email: string = '';
  @state() private password: string = '';

  @query('form') private form!: HTMLFormElement;

  connectedCallback() {
    super.connectedCallback();
  }


  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.name === 'email') this.email = target.value;
    if (target.name === 'password') this.password = target.value;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const data: LoginFormData = { email: this.email, password: this.password, _csrf: this.token! };

    try {
      console.log(data);
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.token || ''
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      console.log('LOGIN RES', response.headers)
      const result = await response.json();
      console.log('LOGIN REZ', result)

      if (!result.success) {
        const message = document.createElement('form-alert');
        message.setAttribute('alertType', 'error');
        message.setAttribute('alertMessage', result.message);
        this.form.prepend(message);
      }

      if (result.twoFactorRequired) {
        Router.go(`/auth/two-factor-auth?type=${result.twoFactorAuthType}`);
      }

      if (result.success && result.authorized) {
        window.dispatchEvent(new CustomEvent('auth-changed'));
        Router.go('/settings');
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <h1 class="logo">jatti</h1>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" .value=${this.email} @input=${this.handleInput} />
        </div>
        <div class="form-group">
          <label for="password">Jelszó</label>
          <input type="password" id="password" name="password" .value=${this.password} @input=${this.handleInput} />
        </div>
        <button type="submit" class="primary">Bejelentkezés</button>
        <p style="font-size: 0.9rem; text-align: center;">Még nincs fiókod? <a href="/auth/registration" class="router-link">Regisztrálok most!</a></p>
      </form>
    `;
  }
}
