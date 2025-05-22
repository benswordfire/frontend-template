import { LitElement, html } from 'lit';
import { consume } from '@lit/context';
import { customElement, property, query, state } from 'lit/decorators.js';
import { resetStyles } from '../../../styles/reset-styles';
import { csrfContext } from '../contexts/csrf/csrf-context';

@customElement('registration-form')
export class RegistrationForm extends LitElement {
  static styles = [resetStyles];

  @consume({ context: csrfContext, subscribe: true })
  @state() private token: string | '' = '';

  @property() username: string = '';
  @state() private email: string = '';
  @state() private password: string = '';

  @query('form') private form!: HTMLFormElement;
  @query('form-alert') private formAlert!: HTMLElement;

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.name === 'username') this.username = target.value;
    if (target.name === 'email') this.email = target.value;
    if (target.name === 'password') this.password = target.value;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:3000/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.token,
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();
      const existingFormAlert = this.formAlert;

      if (existingFormAlert) {
        existingFormAlert.remove();
      } else {
        this.form.prepend(
          Object.assign(document.createElement('form-alert'), {
            alertType: result.success ? 'success' : 'error',
            alertMessage: result.message,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <h1 class="logo">jatti</h1>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" name="email" .value=${this.email} autocomplete="off" />
        </div>
        <div class="form-group">
          <label for="email">Jelszó</label>
          <input type="password" id="password" name="password" .value=${this.password} @input=${this.handleInput} autocomplete="off" />
        </div>
        <password-validation password="${this.password}"></password-validation>
        <button type="submit" class="primary" >Új fiók létrehozása</button>
        <p style="font-size: 0.9rem; text-align: center;">Van már fiókod? <a href="/auth/login" class="router-link">Itt tudsz belépni.</a></p>
      </form>
    `;
  }
}
