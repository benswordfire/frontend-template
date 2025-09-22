import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { chatContext, ChatContext } from './context/chat-context';

@customElement('disable-microphone-button')
export class DisableMicrophoneButton extends LitElement {
  static styles = [resetStyles];

  @consume({ context: chatContext, subscribe: true })
  @state() chatContext?: ChatContext;

  @state() disabled: boolean = false;

  private async toggleMicrophone() {
    if (!this.chatContext) {
      console.error('Chat context not available');
      return;
    }

    try {
      this.disabled = !this.disabled;

      await this.chatContext.disableLocalMicrophone(this.disabled);

      console.log(this.disabled ? 'Microphone disabled' : 'Microphone enabled');
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
    }
  }

  render() {
    return html`
      <sl-icon
        @click=${this.toggleMicrophone}
        name=${this.disabled ? 'mic-mute-fill' : 'mic-fill'}
        style="
          height: 20px;
          width: 20px;
          background: ${this.disabled ? 'var(--color-error)' : 'var(--color-success)'};
          color: #FFF;
          padding: 0.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
        "
      ></sl-icon>
    `;
  }
}
