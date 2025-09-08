import { LitElement, html } from 'lit';
import { consume } from '@lit/context';
import { customElement, query, state } from 'lit/decorators.js';
import { resetStyles } from '../../../styles/reset-styles';
import { FetchContext, fetchContext } from '../../../contexts/fetch/fetch-context';
import { errorContext, ErrorContext } from '../../../contexts/error/error-context';
import { EmailVerificationFormDto, EmailVerificationFormSchemaDto } from '../types/EmailVerificationFormDto';
import { extractFormData } from '../../../utils/validation/extractFormData';
import { validateFormData } from '../../../utils/validation/validateFormData';
import { showFormAlert } from '../../../utils/form/showFormAlert';

@customElement('email-verification-form')
export class EmailVerificationForm extends LitElement {

  static styles = [resetStyles];

  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  @consume({ context: errorContext, subscribe: true })
  @state() errorContext!: ErrorContext;

  @state() private emailVerificationToken?: string = '';

  @state() private errors: Partial<Record<keyof EmailVerificationFormDto, string>> = {};

  @query('form') private form!: HTMLFormElement;
  @query('form-alert') private formAlert!: HTMLElement;

  connectedCallback(): void {
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);
    this.emailVerificationToken = params.get('token')!;
  }

  updated(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has('emailVerificationToken') && this.emailVerificationToken) {
      this._handleSubmit();
    }
  }

  private async _handleSubmit () {
    try {
      const formData = extractFormData<EmailVerificationFormDto>(this.form);

      const validation = validateFormData(formData, EmailVerificationFormSchemaDto);

      if (validation.errors) {
        this.errors = validation.errors;
        return;
      }

      const result = await this.fetchContext.requestWithAuth('POST', '/auth/verify-email', validation.parsed?.data);

      if (this.formAlert) {
        this.formAlert.remove();
      }

      const alert = showFormAlert(result.success, result.message);
      this.form.prepend(alert);
    } catch (error) {
      this.errorContext.reportError({
        message: 'Email verification form error',
        detail: error instanceof Error ? error.stack?.toString() : String(error),
        source: 'email-verification-form',
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
      <form>
        ${this.errors.token}
        <h1 class="logo">Success!</h1>
        <p style="text-align: center; color: var(--secondary-color);">Successful verification, you can login to your account now!</p>
        <a href="/auth/login" class="button-link">Proceed to login</a>
      </form>
    `;
  }
}
