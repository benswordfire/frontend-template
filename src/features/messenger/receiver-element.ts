import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('receiver-element')
export class ReceiverElement extends LitElement {
  @state() private offer: string = '';
  @state() private generatedAnswer: string = '';

  private rc: RTCPeerConnection;
  private dc: RTCDataChannel | null = null;

  private config: object = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]}

  @state() private message: string = ''
    @state() private textMessages: string[] = []

  handleMessageInput(e: Event) {
    this.message = (e.target as HTMLInputElement).value;
  }

  async handleOfferInput(e: Event) {
    this.offer = (e.target as HTMLInputElement).value;

    if (!this.rc) {
      await this.setupConnection();
    }
  }

  async setupConnection() {
    this.rc = new RTCPeerConnection(this.config);

    this.rc.ondatachannel = (event) => {
      this.dc = event.channel;
      this.dc.onopen = () => console.log('Receiver: Connection open!');
      this.dc.onmessage = (event) => {
        const newMessage = String(event.data);
        this.textMessages = [...this.textMessages, newMessage];
      };
    };

    this.rc.onicecandidate = () => {
      if (this.rc.localDescription) {
        this.generatedAnswer = JSON.stringify(this.rc.localDescription);
        console.log('Answer SDP:', this.generatedAnswer);
      }
    };

    const offerDesc = JSON.parse(this.offer);
    await this.rc.setRemoteDescription(offerDesc);
    const answer = await this.rc.createAnswer();
    await this.rc.setLocalDescription(answer);
  }

  private sendMessage() {
    this.dc!.send(this.message)
  }

  render() {
    return html`
      <form @submit="${(e: Event) => e.preventDefault()}">
        <h2>Receiver</h2>
        <label>Paste offer here:</label>
        <textarea @input="${this.handleOfferInput}" .value=${this.offer}></textarea>

        <label>Generated Answer (copy and paste back):</label>
        <textarea readonly .value=${this.generatedAnswer}></textarea>
        <div>
          <input type="text" .value="${this.message}" @input=${this.handleMessageInput}/>
          <button @click=${this.sendMessage}>Send message</button>
        </div>
        ${JSON.stringify(this.textMessages)}
      </form>
    `;
  }
}
