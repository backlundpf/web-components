const siteRoot = "https://localhost:7154";
const apiGroupEndpoint = siteRoot + "/api/Groups/";
const apiUserEndpoint = siteRoot + "/api/ApplicationUsers/";

const templateText = document.getElementById(
  "group-manager-template"
).innerHTML;

const api = {
  fetchAllUsers: async function () {
    return [
      {
        id: "9304bf67-d900-4f88-a0fa-6661467cd7d6",
        displayName: "Analyst 1, Budget",
        email: null,
        firstName: "Budget",
        lastName: "Analyst 1",
        middleName: null,
      },
      {
        id: "9a969382-685f-4c69-a042-077db190a20a",
        displayName: "Analyst 2, Budget",
        email: null,
        firstName: "Budget",
        lastName: "Analyst 2",
        middleName: null,
      },
      {
        id: "ac52ea8b-0c65-4e12-93b0-96e847caeff4",
        displayName: "C 1, COR",
        email: null,
        firstName: "COR",
        lastName: "C 1",
        middleName: null,
      },
      {
        id: "30657c6a-216c-4e99-ae57-eb64d13acc2c",
        displayName: "C 2, COR",
        email: null,
        firstName: "COR",
        lastName: "C 2",
        middleName: null,
      },
      {
        id: "9257b4e6-8c46-480b-90c2-c63a0075e9b0",
        displayName: "C 3, COR",
        email: null,
        firstName: "COR",
        lastName: "C 3",
        middleName: null,
      },
      {
        id: "b029813e-7bd6-4c78-9bd5-3f16a0f4d374",
        displayName: "G 1, GTM",
        email: null,
        firstName: "GTM",
        lastName: "G 1",
        middleName: null,
      },
      {
        id: "b96a40ef-890f-4a65-a926-6ffda72ab5e6",
        displayName: "G 2, GTM",
        email: null,
        firstName: "GTM",
        lastName: "G 2",
        middleName: null,
      },
      {
        id: "15d80194-8b32-4ab2-8aad-e17c6da926bb",
        displayName: "G 3, GTM",
        email: null,
        firstName: "GTM",
        lastName: "G 3",
        middleName: null,
      },
      {
        id: "2f6403c6-c70e-4360-a019-0b09638ea721",
        displayName: "M 1, Manager",
        email: null,
        firstName: "Manager",
        lastName: "M 1",
        middleName: null,
      },
      {
        id: "3e26d300-9767-4535-9ad1-f3368e28ec60",
        displayName: "M 2, Manager",
        email: null,
        firstName: "Manager",
        lastName: "M 2",
        middleName: null,
      },
      {
        id: "e0195d97-fdce-465f-a683-2e0784bc9cc7",
        displayName: "Specialist 1, Contract",
        email: null,
        firstName: "Contract",
        lastName: "Specialist 1",
        middleName: null,
      },
      {
        id: "e91426c8-06e4-4c45-9f3d-cf6dd91de293",
        displayName: "Specialist 2, Contract",
        email: null,
        firstName: "Contract",
        lastName: "Specialist 2",
        middleName: null,
      },
    ];
  },
  addGroupAccessMap: async function (accessMap) {
    console.log("adding access map:", accessMap);
  },
  removeGroupAccessMap: async function (id) {
    console.log("removing access map:", id);
  },
  fetchGroup: async function (groupId) {
    var groups = await api.fetchAllGroups();
    return groups.find((group) => group.id == groupId);
  },
  addGroup: async function (group) {
    console.log("Creating group:", group);
    return { id: 2 };
  },
  updateGroupMembers: async function (groupId, users) {
    console.log(`Update Group ${groupId} users`, users);
  },
  fetchAllGroups: async function () {
    return [
      {
        id: 1,
        name: "TaskOrder1PMs",
        applicationUsers: [
          {
            id: "2f6403c6-c70e-4360-a019-0b09638ea721",
            displayName: "M 1, Manager",
            email: null,
            firstName: "Manager",
            lastName: "M 1",
            middleName: null,
          },
          {
            id: "3e26d300-9767-4535-9ad1-f3368e28ec60",
            displayName: "M 2, Manager",
            email: null,
            firstName: "Manager",
            lastName: "M 2",
            middleName: null,
          },
        ],
        groupAccessMappings: [
          {
            id: 1,
            groupId: 1,
            accessData: "",
            claimType: "COR",
            claimValue: "13",
            resourceType: null,
            resourceId: null,
          },
        ],
      },
      {
        id: 2,
        name: "TaskOrder1GTMs",
        applicationUsers: [],
        groupAccessMappings: [],
      },
      {
        id: 3,
        name: "TaskOrder2GTMs",
        applicationUsers: [],
        groupAccessMappings: [],
      },
      {
        id: 4,
        name: "TaskOrder1COR",
        applicationUsers: [],
        groupAccessMappings: [],
      },
    ];
  },
};

const api2 = {
  fetchAllUsers: async function () {
    var url = apiUserEndpoint;

    const payload = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return await fetch(url, payload).then((result) => {
      if (result.ok) return result.json();
      console.error("Could not find group");
      return null;
    });
  },
  addGroupAccessMap: async function (accessMap) {
    var url = apiGroupEndpoint + accessMap.GroupId + "/Access";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accessMap),
    };

    return await fetch(url, payload).then((result) => {
      if (result.ok) return result.json();
      console.error("Could not find group");
      return null;
    });
  },
  removeGroupAccessMap: async function (id) {
    var url = apiGroupEndpoint + accessMap.GroupId + "/Access/" + id;

    const payload = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return await fetch(url, payload).then((result) => {
      if (result.ok) return result.json();
      console.error("Could not find group access");
      return null;
    });
  },
  fetchGroup: async function (groupId) {
    var url = apiGroupEndpoint + groupId;

    const payload = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return await fetch(url, payload).then((result) => {
      if (result.ok) return result.json();
      console.error("Could not find group");
      return null;
    });
  },
  addGroup: async function (group) {
    var url = apiGroupEndpoint;

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(group),
    };

    return await fetch(url, payload).then((result) => {
      if (result.ok) return result.json();
      console.error("Could not find group");
      return null;
    });
  },
  updateGroupMembers: async function (groupId, users) {
    var url = apiGroupEndpoint + groupId + "/Members";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    };

    return await fetch(url, payload).then((result) => {
      if (result.ok) return result.json();
      console.error("Could not find group");
      return null;
    });
  },
  fetchAllGroups: async function () {
    var url = apiGroupEndpoint;

    const payload = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return await fetch(url, payload).then((result) => {
      if (result.ok) return result.json();
      console.error("Could not find groups");
      return null;
    });
  },
};
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
        nameInputElement: this.shadowRoot.getElementById("group-new-name"),
        submitElement: this.shadowRoot.getElementById("group-new-submit"),
      };

      // Members
      this.changeGroupButton = this.shadowRoot.getElementById("change-group");

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

      this.memberSelectionElement.style.display = "none";
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

      // Fetch all users
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

      this.memberSelectElement.addEventListener(
        "change",
        this.toggleMemberSubmit
      );

      this.memberSubmitButton.addEventListener("click", (e) => {
        this.updateGroupMembers();
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
