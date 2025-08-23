import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { resetStyles } from '../../../styles/reset-styles';

@customElement('global-header')
export class GlobalHeader extends LitElement {

  static styles = [
    css `
    .logo {
      text-transform: uppercase;
      font-size: 24px;
      font-weight: 600;
      font-family: "DynaPuff", "sans-serif";
      color: var(--color-primary);
    }
    a {
      background: rgba(99, 20, 255, 0.10);
      padding: 0.35rem 0.85rem;
      border-radius: 0.25rem;
      text-decoration: none;
      font-size: 14px;
    }
    a.active {
      background: var(--color-primary);
      color: #FFF;
    }
    `, resetStyles];

  render() {
    return html `
    <header style="
      max-width: 480px;
      width: 90%;
      margin: 0.5rem auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;"
    >

      <span class="logo">kollme</span>
      <nav>
        <ul style="display:flex; align-items: center; gap: 1rem;">
          <li>
            <a class="active" href="/friends">friends</a>
          </li>
          <li>
            <a href="/settings">settings</a>
          </li>
        <a href="http://localhost:3000/api/v1/auth/logout">Exit</a>
        <sl-icon name="person-fill" style="height: 24px; width: 24px; background: #DDDDDD; padding: 0.5rem; border-radius: 50%"></sl-icon>
        </ul>
      </nav>
    </header>
    `
  }
}