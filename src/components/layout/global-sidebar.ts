import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { classMap } from 'lit/directives/class-map.js';


@customElement('global-sidebar')
export class GlobalSidebar extends LitElement {
  static styles = [resetStyles, 
    css `
    @import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@400..700&display=swap');
    #sidebar {
    height: 100vh;
    width: 240px;
    padding: 12px;
    border-right: 1px solid black;
    position: sticky;
    top: 0;
    align-self: start;
    transition: 300ms ease-in-out;
    overflow: hidden;
    text-wrap: nowrap;
    }

    #sidebar.close {
    padding: 12px;
    width: 64px;
    }

    #sidebar > ul > li:first-child {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    gap: 11px;
        .logo {
            text-transform: uppercase;
            font-size: 20px;
            font-weight: 600;
            font-family: "DynaPuff", "sans-serif"
        }
    }

    #sidebar ul li.active a {
    border-radius: 4px;
    }

    #sidebar a,
    #sidebar .dropdown-btn,
    #sidebar .logo {
    text-decoration: none;
    color: #161A1D;
    display: flex;
    align-items: center;
    gap: 10px;
    box-sizing: border-box;
    border-radius: 4px;
    }


    .dropdown-btn {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    }

    #sidebar #toggle-btn sl-icon {
    color: var(--text-color);
    flex-shrink: 0;
    padding: 8px;
    }

    #sidebar sl-icon {
    flex-shrink: 0;
    padding: 8px;
    }

    #sidebar a span,
    #sidebar .dropdown-btn span {
    flex-grow: 1;
    font-weight: 500;
    }

    #sidebar a:hover,
    #sidebar .dropdown-btn:hover {
    background-color: var(--secondary-color)
    }

    #sidebar .sub-menu {
    display: grid;
    grid-template-rows: 0fr;
    transition: 300ms ease-in-out;

    > div {
        overflow: hidden;
    }
    }

    #sidebar .sub-menu.show {
    grid-template-rows: 1fr;
    }

    .dropdown-btn sl-icon {
    transition: 200ms ease;
    }

    .rotate sl-icon:last-child {
    rotate: 180deg;
    }

    #sidebar .sub-menu {
    padding-left: 8px;
    }

    #toggle-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    border: none;
    border-radius: 4px;
    background-color: var(--primary-color);
    color: white;
    cursor: pointer;
    }

    .profile-card {
    width: calc(100% - 24px);
    position: absolute;
    bottom: 0;
    align-self: flex-end;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    flex-grow: 1;
    cursor: pointer;
    }

    .profile-avatar {
    height: 40px;
    width: 40px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 24px;
    }
  `];

  @property({type: Boolean})
  show = true;

  @property({type: Boolean})
  rotate = true;

  @property({type: Boolean})
  close = false;

  render() {
    const display = {
      show: this.show,
    };
    const rotation = {
      rotate: this.rotate
    };
    const closure = {
      close: this.close
    }
    return html`
    <nav id="sidebar" class="${classMap(closure)}">
    <ul>
        <li>
        <span class="logo">kollme</span>
        <button @click="${this.toggleSidebar}" id="toggle-btn">
            <sl-icon name="list" style="height: 24px; width: 24px;"></sl-icon>
        </button>
        </li>
        <li class="active">
        <a href="/messenger">
            <sl-icon name="chat-square-text-fill" style="height: 24px; width: 24px;"></sl-icon>
            <span>Messenger</span>
        </a>
        </li>
        <li class="active">
        <a href="/settings">
            <sl-icon name="gear-fill" style="height: 24px; width: 24px;"></sl-icon>
            <span>Settings</span>
        </a>
        </li>
    </ul>
    <li class="profile-card">
        <div class="profile-avatar">
        <sl-icon name="person-fill" style="height: 24px; width: 24px;"></sl-icon>
        </div>
        <div class="profile-info">
        <p style="font-weight: 600;">Ben Swordfire</p>  
        <p style="font-weight: 300; font-size: 14px;">Pied Piper Inc.</p>
        </div>
        <a href="/logout" class="nav-link">
        <sl-icon name="box-arrow-right" style="height: 24px; width: 24px;"></sl-icon>
        </a>
    </li>
    </nav>
    `;
  }

  private toggleSubMenu() {
    this.show = !this.show;
    this.rotate = !this.rotate;
  }

  private toggleSidebar() {
    this.close = !this.close
  }
}
