import { consume } from '@lit/context';
import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { resetStyles } from '../../../styles/reset-styles';
import { User } from '../../authentication/types/User';
import { profileContext } from '../../profile/context/profile-context';
import { errorContext, ErrorContext } from '../../../contexts/error/error-context';
import { fetchContext, FetchContext } from '../../../contexts/fetch/fetch-context';
import { extractFormData } from '../../../utils/validation/extractFormData';
import { UpdateProfileFormDto, UpdateProfileFormSchemaDto } from '../types/UpdateProfileFormDto';
import { validateFormData } from '../../../utils/validation/validateFormData';
import { showFormAlert } from '../../../utils/form/showFormAlert';

@customElement('settings-form')
export class SettingsForm extends LitElement {
  
  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @consume({ context: errorContext, subscribe: true })
  @state() errorContext!: ErrorContext;

  @consume({ context: profileContext, subscribe: true })
  @state() private profile: User | null = null;

  @state() private errors: Partial<Record<keyof UpdateProfileFormDto, string>> = {};

  @query('form') private form!: HTMLFormElement;
  @query('form-alert') private formAlert!: HTMLElement;

  private async _handleSubmit(event: Event) {
    event.preventDefault();
    try {
      const formData = extractFormData<UpdateProfileFormDto>(this.form);
      
      const validation = validateFormData(formData, UpdateProfileFormSchemaDto);
  
      if (validation.errors) {
        this.errors = validation.errors;
        return;
      }

      const result = await this.fetchContext.requestWithAuth('PATCH', '/user/update', validation.parsed?.data);
  
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
      <form @submit=${this._handleSubmit}>
        <h1>Settings</h1>
        <p style="color: #40505b">Change your personal information.</p>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" placeholder=${ifDefined(this.profile?.username)} />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder=${ifDefined(this.profile?.email)} />
          ${this.errors.email ? html`<input-error-message message="${this.errors.email}">` : null}
        </div>
        <div class="form-group">
          <label for="phone">Email</label>
          <input type="text" id="phone" name="phone" placeholder=${ifDefined(this.profile?.email)} />
        </div>
        <button type="submit" class="primary">Update</button>
      </form>
    `;
  }
}
