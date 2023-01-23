export async function fetchAllUsers() {
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
}

export async function addGroupAccessMap(accessMap) {
  console.log("adding access map:", accessMap);
}

export async function removeGroupAccessMap(id) {
  console.log("removing access map:", id);
}
export async function fetchGroup(groupId) {
  var groups = await fetchAllGroups();
  return groups.find((group) => group.id == groupId);
}
export async function addGroup(group) {
  console.log("Creating group:", group);
  return { id: 2 };
}
export async function updateGroupMembers(groupId, users) {
  console.log(`Update Group ${groupId} users`, users);
}
export async function fetchAllGroups() {
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
}
