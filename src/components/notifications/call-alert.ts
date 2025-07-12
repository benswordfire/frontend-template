import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { CallContext, callContext } from '../../features/messenger/context/call-context';
import { IncomingCallOffer } from '../../features/messenger/types/IncomingCallOffer';

@customElement('call-alert')
export class CallAlert extends LitElement {
  
  static styles = [resetStyles, css `
  .call-alert-container {
    height: 100vh;
    height: 100dvh;
    max-width: 20rem;
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 1rem;
  }
  .call-alert-container .caller-image {
    height: 5rem;
    width: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    background: #DDD;
    border-radius: 50%;
  }
  .call-alert-container .caller-image sl-icon {
    color: #191E23;
    height: 2rem;
    width: 2rem;
  }
  .call-alert-container .caller-name {
    font-size: 1.25rem;
    font-weight: 800;
    text-align: center;
    margin: 1.5rem 0 0.25rem 0;
    color: #191E23;
  }
  .call-alert-container .call-buttons {
    display: flex; 
    justify-content: space-around; 
    align-items: center;
  }
  .call-alert-container .call-buttons sl-icon {
    height: 24px; 
    width: 24px; 
    background: var(--color-error); 
    color: #FFF; 
    padding: 1rem; 
    border-radius: 50%;
    cursor: pointer;
  }
  .call-alert-container .call-buttons sl-icon.decline {
    background: var(--color-error); 
    color: #FFF; 
  }
  .call-alert-container .call-buttons sl-icon.accept {
    background: var(--color-success); 
    color: #FFF; 
  }
  `];

  @consume({ context: callContext, subscribe: true })
  @state() callContext?: CallContext;
  
  @property({ type: Object })  
  incomingCallOffer: IncomingCallOffer | null = null;
  
  @query('.call-alert-container', true) private container!: HTMLElement;
  @query('#localVideo') private localVideo!: HTMLVideoElement;
  


  private async acceptCall() {
    if (!this.callContext || !this.incomingCallOffer) return;
    
    try {
      await this.callContext.createCallAnswer(this.incomingCallOffer);

    } catch (error) {
      console.error('Failed to answer call:', error);
    }
  }

  private async setupLocalVideo() {
    if (!this.callContext?.localStream || !this.container) return;
    
    // Create video element if it doesn't exist
    if (!this.localVideo) {
      const video = document.createElement('video');
      video.id = 'localVideo';
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.borderRadius = '8px';
      video.style.marginBottom = '1rem';
      
      // Prepend to container
      this.container.insertBefore(video, this.container.firstChild);
    }

    // Attach stream
    this.localVideo.srcObject = this.callContext.localStream;
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('callContext') && this.callContext?.localStream) {
      this.setupLocalVideo();
    }
  }
    
  render() {
    return html `
    <div class="call-alert-container">
      <div>
        <div class="caller-image">
          <sl-icon name="person-fill"></sl-icon>
        </div>
        <p class="caller-name">${this.callContext?.incomingCallOffer?.callerName}</p>
        <p style="text-align: center; font-size: 12px; font-weight: 400;">Incoming call</p>
      </div>
      <div class="call-buttons">
        <sl-icon onclick class="decline" name="telephone-fill"></sl-icon>
        <sl-icon @click=${this.acceptCall} class="accept" name="telephone-fill"></sl-icon>
      </div>
    </div>
    `
  }
}

