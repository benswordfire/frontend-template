import { consume } from '@lit/context';
import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { resetStyles } from '../../../../styles/reset-styles';
import { authContext } from '../../../authentication/contexts/authentication/auth-context';
import { csrfContext } from '../../../authentication/contexts/csrf/csrf-context';
import { User } from '../../../authentication/types/User';

@customElement('avatar-onboarding-form')
export class AvatarOnboardingForm extends LitElement {
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
        <h1 style="font-family: DynaPuff; font-size: 2rem; font-weight: 600; color: var(--color-primary); text-align: center;">Show yourself!</h1>
        <p style="text-align: center; color: #848484; margin-bottom: 2rem; max-width: 300px; margin: 0 auto;">Make it iconic. Or weird. Or both. You can change it later if it gets too cringe.</p>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username"/>
          <input-error-message message="Username is neccessary"></input-error-message>
        </div>
        <div style="display:flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 4rem;">
          <button type="submit" class="secondary">Skip for now</button>
          <button type="submit" class="primary"><a href="/onboarding/avatar" class="router-link">Next</a></button>
        </div>
      </form>
    `;
  }
}
