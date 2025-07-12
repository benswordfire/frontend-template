import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { resetStyles } from '../../../../styles/reset-styles';
import { classMap } from 'lit/directives/class-map.js';

@customElement('password-validation')
export class PasswordValidation extends LitElement {

  static styles = [
    resetStyles,
    css `
    #validation-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 16px;
    }
    p {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
    }
  `
  ]

  @property() password?: string;

  render() {
    const rules = [
      {
        label: 'At least 8 characters',
        test: (password: string) => password.length >= 8,
      },
      {
        label: 'At least 1 uppercase letter',
        test: (password: string) => /[A-Z]/.test(password),
      },
      {
        label: 'At least 1 number',
        test: (password: string) => /[0-9]/.test(password),
      },
      {
        label: 'At least 1 special character',
        test: (password: string) => /[!@#$%^&*()_+|~-]/.test(password),
      },
    ];
  
    return html`
      <div id="validation-container">
        ${rules.map(rule => {
          const passed = rule.test(this.password || '');
          const icon = passed ? 'check-circle-fill' : 'x-circle-fill';
          const classes = {
            valid: passed,
            invalid: !passed,
          };
          return html`
            <p>
              <sl-icon name="${icon}" class="${classMap(classes)}"></sl-icon>
              ${rule.label}
            </p>
          `;
        })}
      </div>
    `;
  }
  
}

