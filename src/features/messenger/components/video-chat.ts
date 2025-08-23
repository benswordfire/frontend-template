import { consume } from '@lit/context';
import { html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { chatContext, ChatContext } from '../context/chat-context';

@customElement('video-chat')
export class VideoChat extends LitElement {
  @consume({ context: chatContext, subscribe: true })
  @state() private chatContext!: ChatContext;

  @query('#localVideo') private localVideo!: HTMLVideoElement;
  @query('#remoteVideo') private remoteVideo!: HTMLVideoElement;

  protected updated() {
    if (this.chatContext?.localStream && this.localVideo) {
      this.localVideo.srcObject = this.chatContext.localStream;
    }

    if (this.chatContext?.remoteStream && this.remoteVideo) {
      this.remoteVideo.srcObject = this.chatContext.remoteStream;
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
