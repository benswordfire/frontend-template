import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('avatar-onboarding-page')
export class AvatarOnboardingPage extends LitElement {

  render() {
    return html`
      <main style="
        height: 100dvh; 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center;
        ">
        <progress-ring stepValue="50"></progress-ring>
        <avatar-onboarding-form style="width: 100%;"></avatar-onboarding-form>
      </main>
    `;
  }
}