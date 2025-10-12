import React, { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  const [reload, setReload] = useState(false);

  const refreshUsers = () => {
    setReload(!reload);
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>🌐 Group 10 - User Management</h1>
      <AddUser onUserAdded={refreshUsers} />
      <UserList key={reload} />
    </div>
  );
}

export default App;
