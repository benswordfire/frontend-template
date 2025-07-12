import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';

@customElement('input-error-message')
export class InputErrorMessage extends LitElement {

  static styles = [resetStyles, 
    css `
    p {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.25rem;
      color: var(--color-error);
      font-size: 0.9rem;
    }  
  `]

  @property({ type: String }) message: string = '';

  render() {
    return html`
      <p>
        <sl-icon name="exclamation-circle-fill"></sl-icon>
        ${this.message}
      </p>
    `;
  }
}

