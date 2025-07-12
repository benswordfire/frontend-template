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
  @state() private emailVerificationToken?: string = '';

  @query('form') private form!: HTMLFormElement;

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);
    this.emailVerificationToken = params.get('token')!;
  }

  updated(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has('token') && this.token && this.emailVerificationToken) {
      this.handleSubmit();
    }
  }


  private async handleSubmit() {
    console.log('TÜKEN', this.token)
    const data: EmailVerificationFormData = { token: this.emailVerificationToken!, _csrf: this.token! };

    try {
      console.log(data)
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
      console.log(result)

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
      <form>
        <h1 class="logo">Success!</h1>
        <p style="text-align: center; color: var(--secondary-color);">Successful verification, you can login to your account now!</p>
        <a href="/auth/login" class="button-link">Proceed to login</a>
      </form>
    `;
  }
}
