import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { callContext, CallContext } from './context/call-context';
import { chatContext, ChatContext } from './context/chat-context';

@customElement('call-button')
export class CallButton extends LitElement {

  static styles = [resetStyles];

  @consume({ context: chatContext, subscribe: true })
  @state() chatContext?: ChatContext;

  @consume({ context: callContext, subscribe: true })
  @state() callContext?: CallContext;

  @property({ type: String })
  calleeId: string = '';

  connectedCallback(): void {
    super.connectedCallback();
    console.log('CallButton connected, context:', this.chatContext);
  }
  
  private async makeCall() {
    if (!this.chatContext) {
      console.error('Chat context not available');
      return;
    }

    if (!this.calleeId) {
      console.error('No calleeId provided');
      return;
    }

    console.log('Initiating call to:', this.calleeId);
    
    try {
      await this.chatContext.createCallOffer(this.calleeId);
      console.log('Call initiated successfully');
    } catch (error) {
      console.error('Call failed:', error);
    }
  }


  render() {
    return html `
      <sl-icon @click=${this.makeCall} name="camera-video-fill" style="height: 20px; width: 20px; background: var(--color-primary); color: #FFF; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer;"></sl-icon>
    `;
  }
}

