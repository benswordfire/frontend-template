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
      font-size: 0.9rem;
    }
  `
  ]

  @property() password?: string;

  render() {
    const rules = [
      {
        label: 'Legalább 8 karakter',
        test: (password: string) => password.length >= 8,
      },
      {
        label: 'Legalább 1 db nagy betű',
        test: (password: string) => /[A-Z]/.test(password),
      },
      {
        label: 'Legalább 1 db szám',
        test: (password: string) => /[0-9]/.test(password),
      },
      {
        label: 'Legalább 1 db speciális karakter',
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

