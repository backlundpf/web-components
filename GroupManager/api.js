const siteRoot = "https://localhost:7154";
const apiGroupEndpoint = siteRoot + "/api/Groups/";
const apiUserEndpoint = siteRoot + "/api/ApplicationUsers/";

export async function fetchAllUsers() {
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
}

export async function addGroupAccessMap(accessMap) {
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
}

export async function removeGroupAccessMap(accessMap) {
  var url = apiGroupEndpoint + accessMap.groupId + "/Access/" + accessMap.id;

  const payload = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await fetch(url, payload).then((result) => {
    if (result.ok) return true;
    console.error("Could not find group access");
    return null;
  });
}

export async function fetchGroup(groupId) {
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
}

export async function addGroup(group) {
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
}

export async function updateGroupMembers(groupId, users) {
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
}

export async function fetchAllGroups() {
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
}
