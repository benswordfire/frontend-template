import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('index-page')
export class IndexPage extends LitElement {

  render() {
    return html`
      <main style="height: 100dvh; display: flex; justify-content: center; align-items: center; flex-direction: column;">
        <h1 style="font-size: 36px; font-weight: 600; font-family: 'DynaPuff', 'sans-serif'; text-align: center; color: var(--color-primary);">The video chat we deserve.</h1>
        <p>FaceTime without the fruit company.</p>
        <a 
        href="/auth/login" 
        style="
          color: #F2ECFF;
          background-color: var(--color-primary);
          padding: 1rem;
          border: 2px solid var(--color-primary);
          border-radius: 0.25rem;
          font-family: 'DynaPuff', 'Inter';
          font-size: 1rem;
          font-weight: 400;
          text-align: center;
          text-decoration: none;
          cursor: pointer;"
        >
          Click to koll!
        </a>
      </main>
    `;
  }
}