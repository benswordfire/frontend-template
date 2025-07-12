import { consume } from '@lit/context';
import { html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { callContext, CallContext } from '../context/call-context';

@customElement('video-chat')
export class VideoChat extends LitElement {
  @consume({ context: callContext, subscribe: true })
  @state() private callContext!: CallContext;

  @query('#localVideo') private localVideo!: HTMLVideoElement;
  @query('#remoteVideo') private remoteVideo!: HTMLVideoElement;

  protected updated() {
    if (this.callContext?.localStream && this.localVideo) {
      this.localVideo.srcObject = this.callContext.localStream;
    }

    if (this.callContext?.remoteStream && this.remoteVideo) {
      this.remoteVideo.srcObject = this.callContext.remoteStream;
    }
  }

  render() {
    return html`
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; height: 100vh; width: 100%; max-width: 1140px; margin: 0 auto; overflow: hidden;">
        <video id="localVideo" autoplay playsinline muted style="margin: 1rem; max-width: 32rem;  object-fit: cover; background: black;"></video>
        <video id="remoteVideo" autoplay playsinline style="margin: 1rem; max-width: 32rem; object-fit: cover; background: black;"></video>
      </div>
    `;
  }
}
