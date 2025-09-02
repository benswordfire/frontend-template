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
      <div style="position: relative; width: 100%; height: 100vh; background: black; display: flex; justify-content: center; align-items: center;">
        <video
          id="remoteVideo"
          autoplay
          playsinline
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "
        ></video>

        <video
          id="localVideo"
          autoplay
          playsinline
          muted
          style="
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            width: 20%;
            max-width: 200px;
            border-radius: 8px;
            object-fit: cover;
            background: black;
          "
        ></video>
      </div>
    `;
  }

}
