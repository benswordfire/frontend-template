import { LitElement, html } from 'lit';
import { consume } from '@lit/context';
import { customElement, property, query, state } from 'lit/decorators.js';
import { resetStyles } from '../../../styles/reset-styles';
import { csrfContext } from '../contexts/csrf/csrf-context';
import { EmailVerificationFormData } from '../types/EmailVerificationFormData';

@customElement('email-verification-form')
export class EmailVerificationForm extends LitElement {
  static styles = [resetStyles];

  @consume({ context: csrfContext, subscribe: true })
  @state() private token?: string;

  @state() private email: string = '';
  @property() EmailVerificationToken: string

  @query('form') private form!: HTMLFormElement;

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);
    console.log(params)
    this.EmailVerificationToken = params.get('token'); 
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.name === 'email') this.email = target.value;
    if (target.name === 'emailVerificationToken') this.EmailVerificationToken = target.value  
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const data: EmailVerificationFormData = { email: this.email, _csrf: this.token! };

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.token || ''
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        const message = document.createElement('form-alert');
        message.setAttribute('alertType', 'error');
        message.setAttribute('alertMessage', result.message);
        this.form.prepend(message);
      }

    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <h1>Welcome back!</h1>
        <p style="color: #40505b">Login with your credentials.</p>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" .value=${this.email} @input=${this.handleInput} />
        </div>
        <div class="form-group">
          <label for="emailVerificationToken">Email</label>
          <input type="text" id="emailVerificationToken" name="emailVerificationToken" .value=${this.EmailVerificationToken} @input=${this.handleInput} />
        </div>
        <button type="submit" class="primary">Login</button>
        <p>New here? <a href="/auth/registration" class="router-link">Create a new account</a></p>
      </form>
    `;
  }
}
