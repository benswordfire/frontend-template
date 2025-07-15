import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../../styles/reset-styles';
import { consume } from '@lit/context';
import { authContext } from '../../../features/authentication/contexts/authentication/auth-context';
import { User } from '../../../features/authentication/types/User';

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

  @consume({ context: authContext, subscribe: true })
  @state() user: User | null = null;
  
  private async _logout() {
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/logout', {
        method: 'GET'
      });
    } catch (error) {
      console.log(error)
    }
  }

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