const templateText = document.getElementById(
  "group-manager-template"
).innerHTML;

customElements.define(
  "group-manager",
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: "open" }).innerHTML = templateText;

      // Groups
      this.groupSelectionElement =
        this.shadowRoot.getElementById("group-selection");

      this.groupSelectElement = this.shadowRoot.getElementById("group-select");

      this.groupNew = {
        nameInputElement: document.getElementById("group-name"),
        submitElement: document.getElementById("group-new"),
      };

      // Members
      this.memberSelectionElement =
        this.shadowRoot.getElementById("member-selection");

      this.memberSelectElement =
        this.shadowRoot.getElementById("member-select");

      this.selectedGroupNameElement = this.shadowRoot.getElementById(
        "selected-group-name"
      );
    }

    setGroup = (groupId) => {
      this.groupSelectionElement.style.display = "none";

      // Add group accessmap

      // Fetch group members

      // populate current members into search select
      this.memberSelectionElement.style.display = "block";

      this.selectedGroupNameElement.innerText = groupId;
    };

    updateGroupMembers = () => {
      // post current selected group members
    };

    connectedCallback() {
      this.groupSelectionElement.style.display = "block";

      this.groupSelectElement.addEventListener("change", (e) => {
        // If previous value, remove group access

        // Add new group
        this.setGroup(e.target.value);
      });

      this.memberSelectElement.addEventListener("change", (e) => {
        this.updateGroupMembers();
      });
    }
  }
);
