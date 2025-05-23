import { consume } from '@lit/context';
import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { resetStyles } from '../../../styles/reset-styles';
import { authContext } from '../../authentication/contexts/authentication/auth-context';
import { csrfContext } from '../../authentication/contexts/csrf/csrf-context';
import { User } from '../../authentication/types/User';

@customElement('settings-form')
export class SettingsForm extends LitElement {
  static styles = [resetStyles];

  @consume({ context: authContext, subscribe: true })
  @state() user: User | null = null;

  @consume({ context: csrfContext, subscribe: true })
  @state() private token: string | '' = '';

  @query('form') private form!: HTMLFormElement;
  @query('form-alert') private formAlert!: HTMLElement;


  private async handleSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    console.log(data)
    try {
      console.log(this.token);
      const response = await fetch(
        'http://localhost:3000/api/v1/update-settings',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.token,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log(result)
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
        <h1>Settings</h1>
        ${JSON.stringify(this.token)}
        <p style="color: #40505b">Change your personal information.</p>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" placeholder=${ifDefined(this.user?.username)} />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder=${ifDefined(this.user?.email)} />
        </div>
        <div class="form-group">
          <label for="phone">Email</label>
          <input type="text" id="phone" name="phone" placeholder=${ifDefined(this.user?.phoneNumber)} />
        </div>
        <button type="submit" class="primary">Update</button>
        <a href="http://localhost:3000/logout">Logout</a>
      </form>
    `;
  }
}
