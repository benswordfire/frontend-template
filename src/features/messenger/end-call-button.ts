import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { chatContext, ChatContext } from './context/chat-context';

@customElement('end-call-button')
export class EndCallButton extends LitElement {

  static styles = [resetStyles];

  @consume({ context: chatContext, subscribe: true })
  @state() chatContext?: ChatContext;

  connectedCallback(): void {
    super.connectedCallback();
  }
  
  private async endCall() {
    if (!this.chatContext) {
      console.error('Chat context not available');
      return;
    }

    try {
      await this.chatContext.hangupCall();
      console.log('Call initiated successfully');
    } catch (error) {
      console.error('Call failed:', error);
    }
  }


  render() {
    return html `
      <sl-icon @click=${this.endCall} name="camera-video-fill" style="height: 20px; width: 20px; background: var(--color-error); color: #FFF; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer;"></sl-icon>
    `;
  }
}

