import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';

@customElement('call-control-panel')
export class CallControlPanel extends LitElement {

  static styles = [resetStyles];

  connectedCallback(): void {
    super.connectedCallback();
  }
  
  render() {
    return html `
      <div>
          <disable-microphone-button></disable-microphone-button>
          <end-call-button></end-call-button>
          <disable-camera-button></disable-camera-button>
      </div>
    `;
  }
}

