import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { Message, MessageSchema } from './types/Message';

@customElement('messenger-element')
export class MessengerElement extends LitElement {

  static styles = [resetStyles];


  @state() private answer: string = '';
  private lc: RTCPeerConnection;
  private dc: RTCDataChannel;


  private config: object = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]}

  @state() private message: string = ''
  @state() private messages: Message[] = []

  handleMessageInput(e: Event) {
    this.message = (e.target as HTMLInputElement).value;
  }

  firstUpdated() {
    this.setupConnection();
  }

  async setupConnection() {
    this.lc = new RTCPeerConnection(this.config);

    this.dc = this.lc.createDataChannel('channel');
    this.dc.onopen = () => console.log('Messenger: Connection open!');
    this.dc.onmessage = (event) => {
      const messageElement: Message = { type: "incoming", text: String(event.data), createdAt: new Date()};
      console.log('INCOMING:', messageElement)
      console.log('ALL MESSAGES:', this.messages)
      this.messages = [...this.messages, messageElement];
    };

    this.lc.onicecandidate = () => {
      console.log('Offer SDP:', JSON.stringify(this.lc.localDescription));
    };

    const offer = await this.lc.createOffer();
    await this.lc.setLocalDescription(offer);
  }

  async handleAnswerInput(e: Event) {
    this.answer = (e.target as HTMLInputElement).value;

    if (!this.lc.currentRemoteDescription && this.answer) {
      const answerDesc = JSON.parse(this.answer);
      await this.lc.setRemoteDescription(answerDesc);
      console.log('Messenger: Answer set!');
    }
  }

  private sendMessage() {
    const messageElement: Message = { type: "outgoing", text: String(this.message), createdAt: new Date()}
    console.log('OUTGOING:', messageElement);
    console.log('ALL MESSAGES:', this.messages);
    this.dc.send(this.message);
    this.messages = [...this.messages, messageElement];
    this.message = '';
  }

  render() {
    return html`
      <div>
        <h2 style="text-align: center;">Messenger</h2>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${this.messages.map((text) => {
          if (text.type === "incoming") {
            return html`<p style="background-color: #a4e2f1; color: #191E23; padding: 0.5rem; text-align: left;">${text.text}</p>`;
          } else {
            return html`<p style="background-color: #4cc9f0; color: #191E23; padding: 0.5rem; text-align: right;">${text.text}</p>`;
          }
        })}
        </div>
        <label>Paste answer here:</label>
        <textarea @input="${this.handleAnswerInput}" .value=${this.answer}></textarea>
        <div style="display: flex; gap: 4px; align-items: center;">
          <input type="text" .value="${this.message}" @input=${this.handleMessageInput}/>
          <button 
            type="button" 
            style="display: flex; justify-content: center; align-items: center; border: none; background-color:#7209B7; color: white; border-radius: 0.25rem; padding: 0.75rem;"
            @click="${this.sendMessage}">
            <sl-icon name="send-fill" style="height: 20px; width: 20px;"></sl-icon>
          </button>
        </div>
      </div>
    `;
  }
}
