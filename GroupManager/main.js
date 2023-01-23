import * as api from "./testapi.js";

/*
TODO:
Initialize Group/Resource/Role Values
*GroupData Loader
Initialize State

*Group Select Updater
New Group Creation
Member Select Updater
*/
customElements.define(
  "group-members-manager",
  class extends HTMLElement {
    constructor() {
      super();

      const templateText = document.getElementById(
        "group-members-manager-template"
      ).innerHTML;

      this.attachShadow({ mode: "open" }).innerHTML = templateText;

      // Members
      this.memberSelectionElement =
        this.shadowRoot.getElementById("member-selection");

      this.memberSelectElement =
        this.shadowRoot.getElementById("member-select");

      this.selectedGroupNameElement = this.shadowRoot.getElementById(
        "selected-group-name"
      );
      this.memberSubmitButton = this.shadowRoot.getElementById("member-submit");

      // State
      this.selectedGroupId = () =>
        this.hasAttribute("groupid") ? this.getAttribute("groupid") : null;

      this.selectedGroup = null;
      this.applicationUsers = null;
    }

    // Methods
    setGroup = async (groupId) => {
      this.selectedGroupNameElement.innerText = "Fetching group...";
      var group = await api.fetchGroup(groupId);
      if (!group) {
        return;
      }
      this.selectedGroup = group;
      this.setAttribute("groupid", group.id);

      if (!this.applicationUsers) {
        this.applicationUsers = await api.fetchAllUsers();
      }

      // populate current members into search select
      this.memberSelectElement.innerHTML = "";

      var groupUserIds = group.applicationUsers.map((user) => user.id);
      this.applicationUsers.forEach((user) => {
        var opt = document.createElement("option");
        opt.setAttribute("value", user.id);
        opt.innerText = user.displayName;
        if (groupUserIds.includes(user.id)) {
          opt.setAttribute("selected", true);
        }
        this.memberSelectElement.appendChild(opt);
      });

      this.memberSubmitButton.setAttribute("disabled", true);
      this.memberSubmitButton.style.display = "none";

      this.selectedGroupNameElement.innerText = group.name;
      this.memberSelectionElement.style.display = "block";
    };

    removeGroup = async () => {
      this.removeAttribute("groupid");
      this.selectedGroup = null;
      this.memberSelectionElement.style.display = "none";
      this.selectedGroupNameElement.innerText = "";
    };

    updateGroupMembers = async () => {
      // post current selected group members
      var selectedMembers = [...this.memberSelectElement.selectedOptions].map(
        (opt) => opt.value
      );
      await api.updateGroupMembers(this.selectedGroupId(), selectedMembers);
      this.memberSubmitButton.setAttribute("disabled", true);
      this.memberSubmitButton.style.display = "none";
    };

    toggleMemberSubmit = (e) => {
      this.memberSubmitButton.removeAttribute("disabled");
      this.memberSubmitButton.style.display = "block";
    };

    // Connect/Disconnect
    connectedCallback() {
      this.memberSelectElement.addEventListener(
        "change",
        this.toggleMemberSubmit
      );

      this.memberSubmitButton.addEventListener("click", (e) => {
        this.updateGroupMembers();
      });

      // Initialize State
      if (this.selectedGroupId()) {
        this.setGroup(this.selectedGroupId());
      }
    }

    disconnectedCallback() {
      this.memberSelectElement.removeEventListener();
      this.memberSubmitButton.removeEventListener();
    }
  }
);

customElements.define(
  "group-manager",
  class extends HTMLElement {
    constructor() {
      super();

      const templateText = document.getElementById(
        "group-manager-template"
      ).innerHTML;

      this.attachShadow({ mode: "open" }).innerHTML = templateText;

      // Groups
      this.groupSelectionElement =
        this.shadowRoot.getElementById("group-selection");

      this.groupSelectElement = this.shadowRoot.getElementById("group-select");

      this.groupNew = {
        nameInputElement: this.shadowRoot.getElementById("group-new-name"),
        submitElement: this.shadowRoot.getElementById("group-new-submit"),
      };

      this.changeGroupButton = this.shadowRoot.getElementById("change-group");

      // Members
      this.membersComponent = this.shadowRoot.getElementById(
        "group-members-manager"
      );

      // State
      this.selectedGroupId = () =>
        this.hasAttribute("groupid") ? this.getAttribute("groupid") : null;

      this.claimType = () =>
        this.hasAttribute("claimtype") ? this.getAttribute("claimtype") : null;

      this.resourceType = () =>
        this.hasAttribute("resourcetype")
          ? this.getAttribute("resourcetype")
          : null;

      this.resourceId = () =>
        this.hasAttribute("resourceid")
          ? this.getAttribute("resourceid")
          : null;
    }

    showGroups = async () => {
      this.removeAttribute("groupid");
      this.membersComponent.removeGroup();

      var groups = await api.fetchAllGroups();
      if (!groups) {
      }

      this.groupSelectElement.innerHTML = "<option>Select...</option>";
      groups.forEach((group) => {
        var opt = document.createElement("option");
        opt.setAttribute("value", group.id);
        opt.innerText = group.name;
        this.groupSelectElement.appendChild(opt);
      });

      this.groupSelectionElement.style.display = "block";
      this.changeGroupButton.style.display = "none";
    };

    setGroup = async (groupId) => {
      var group = await api.fetchGroup(groupId);
      if (!group) {
        return;
      }
      this.selectedGroup = group;

      this.setAttribute("groupid", group.id);
      this.groupSelectionElement.style.display = "none";
      // TODO: add spinner

      // Add group accessmap
      var accessMap = this.createAccessMap();

      await api.addGroupAccessMap(accessMap);
      this.membersComponent.setGroup(group.id);
      this.changeGroupButton.style.display = "block";
    };

    createAccessMap = () => {
      return {
        GroupId: this.selectedGroupId(),
        AccessData: "",
        ClaimType: this.claimType(),
        ResourceType: this.resourceType(),
        ResourceId: this.resourceId(),
      };
    };

    removeAccessMap = async () => {
      if (!this.selectedGroup) {
        return;
      }

      var accessMap = this.selectedGroup.groupAccessMappings.find((map) => {
        return (
          map.claimType == this.claimType() &&
          map.claimValue == this.resourceId()
        );
      });

      if (!accessMap) return;

      await api.removeGroupAccessMap(accessMap);
    };

    addGroup = async (name) => {
      var newGroup = {
        name: name,
      };
      var group = await api.addGroup(newGroup);
      if (!group) {
        console.error("Unable to save group");
      }
      this.setGroup(group.id);
    };

    connectedCallback() {
      this.groupSelectElement.addEventListener("change", (e) => {
        this.setGroup(e.target.value);
      });

      this.groupNew.submitElement.addEventListener("click", () => {
        const groupName = this.groupNew.nameInputElement.value;
        if (!groupName) {
          this.groupNew.nameInputElement.classList.add("validation-error");
          return;
        }
        this.addGroup(groupName);
      });

      this.changeGroupButton.addEventListener("click", (e) => {
        // TODO: If previous value, remove group access
        if (this.selectedGroupId()) {
          this.removeAccessMap();
        }
        this.showGroups();
      });

      // Initialize State
      if (this.selectedGroupId()) {
        this.setGroup(this.selectedGroupId());
      } else {
        this.showGroups();
      }
    }

    disconnectedCallback() {
      this.groupSelectElement.removeEventListener();
      this.groupNew.submitElement.removeEventListener();
      this.memberSubmitButton.removeEventListener();
      this.memberSelectElement.removeEventListener();
      this.changeGroupButton.removeEventListener();
    }
  }
);
