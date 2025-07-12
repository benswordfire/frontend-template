import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resetStyles } from '../../../../styles/reset-styles';


@customElement('progress-ring')
export class ProgressRing extends LitElement {

  static styles = [resetStyles]

  @property() stepValue: string = ""

  render() {
    return html`
      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 4rem;">
        <sl-progress-ring value=${this.stepValue} 
          style="
          --size: 64px;
          --track-color: #DDD; 
          --indicator-color: var(--color-primary); 
          --track-width: 0.5rem;">
        </sl-progress-ring>
      </div>
    `;
  }
}

