import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { resetStyles } from '../../styles/reset-styles';

@customElement('toast-message')
export class ToastMessage extends LitElement {

  static styles = [
    resetStyles,
    css `
    #alert-container {
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 1rem;
      font-size: 14px;
      border: 2px solid var(--secondary-color);
      border-radius: 0.25rem;
      margin-bottom: 2rem;
    }
    #alert-icon {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
    #alert-message {
      color: #191E23;
      font-size: 1rem;
    }
    #close-icon {
      width: 16px;
      height: 16px;
      position: absolute;
      right: 1rem;
      color: #131517;
      cursor: pointer;
    }
    #alert-container.error {
      background-color: #ffc2c9;
      border: none;
    }
    #alert-container.success {
      background-color: #ccffe5;
      border: none;
    }
    .success {
      color: var(--success-color);
    }
    .error {
      color: var(--error-color);
    }
  `]

  @property({ type: String}) alertType: 'success' | 'error' | 'warning' = 'success';
  @property({ type: String}) alertMessage: string = 'Something went wrong.'

  private iconNames: Record<string, string> = {
    success: 'check-circle-fill',
    error: 'x-circle-fill',
  };

  render() {
    const iconName = this.iconNames[this.alertType] ?? 'info-circle';
    const classes = {
      success: this.alertType === 'success',
      error: this.alertType === 'error',
      warning: this.alertType === 'warning'
    };

    return html`
      <div id="alert-container" class="${classMap(classes)}">
        <sl-icon id="alert-icon" class="${classMap(classes)}" name="${iconName}"></sl-icon>
        <p id="alert-message">${this.alertMessage}</p>
      </div>
    `;
  }
}

