import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('video-chat-page')
export class VideoChatPage extends LitElement {
  render() {
    return html`
      <div>
        <main>
          <video-chat></video-chat>
        </main>
      </div>
    `;
  }
}