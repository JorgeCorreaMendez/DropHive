import './modals/confirmation.js';

const styles = `
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .logo-section {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .logo-img {
    height: 80px;
    width: auto;
  }
  .user-section {
    display: flex;
    align-items: center;
  }
  .user-section .flex {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-right: 10px;
  }
  .user-section button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    font-size: 18px;
    color: #000;
  }
  .user-section button#mi-perfil {
    font-weight: bold;
  }
  .user-section button#log-out {
    font-size: 16px;
    color: #666;
  }
  .user-section .border-t {
    border-top: 1px solid #000;
    margin: 2px 0;
  }
  .user-icon img {
    height: 60px;
    width: auto;
    fill: black;
    border-radius: 50%;
  }
`;

class DropHiveHeader extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    const header = document.createElement('div');
    header.className = 'header';

    const logoSection = document.createElement("div");
    logoSection.className = "logo-section";
    logoSection.id = "retorno-login";
    logoSection.onclick = () => window.location.href = "http://127.0.0.1:4000/home";

    const logoImg = document.createElement("img");
    logoImg.src = "/Images/Logo_Drop_Hive.svg";
    logoImg.alt = "DropHive Logo";
    logoImg.className = "logo-img";
    logoImg.id = "logo";
    logoSection.appendChild(logoImg);

    const userSection = document.createElement("div");
    userSection.className = "user-section";

    const flexDiv = document.createElement("div");
    flexDiv.className = "flex flex-col justify-end";
    flexDiv.style.marginRight = "10px";

    const profileButton = document.createElement("button");
    profileButton.type = "submit";
    profileButton.className = "mb-0";
    profileButton.id = "profile";
    profileButton.textContent = "Your Store";
    profileButton.onclick = () => window.location.href = "http://127.0.0.1:4000/profile";

    const borderDiv = document.createElement("div");
    borderDiv.className = "border-t border-black my-0.5";

    const logoutButton = document.createElement("button");
    logoutButton.type = "submit";
    logoutButton.className = "mb-0 text-sm";
    logoutButton.id = "log-out";
    logoutButton.textContent = "Log out";

    flexDiv.appendChild(profileButton);
    flexDiv.appendChild(borderDiv);
    flexDiv.appendChild(logoutButton);

    const userIcon = document.createElement("div");
    userIcon.className = "user-icon";

    const avatarImg = document.createElement("img");
    avatarImg.className = "h-[30px] fill-black";
    avatarImg.src = "/Images/avatar.svg";
    avatarImg.alt = "Profile avatar";
    userIcon.appendChild(avatarImg);

    userSection.appendChild(flexDiv);
    userSection.appendChild(userIcon);

    header.appendChild(logoSection);
    header.appendChild(userSection);
    shadow.appendChild(header);

    logoutButton.addEventListener("click", () => {
      DropHiveHeader.logout();
    });
  }

  static logout() {
    const modal = document.createElement("confirmation-modal");
    modal.show("Are you sure you want to log out?")
      .then(() => {
        fetch("/logout", {method: "GET"})
          .then(response => {
            if (response.ok) {
              window.location.href = "/login";
            } else {
              console.error("There was a problem logging out.", 3000);
            }
          })
          .catch(error => {
            console.error(error, 3000);
          });
      })
  }
}

customElements.define('drop-hive-header', DropHiveHeader);
