import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const AdminAccount: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, fullName: 'Hà Quang Trung', username: 'hqtrung', email: 'Haqtrung.94@gmail.com', selected: false, password: '12312312313', createdAt: '13/03/2024' },
    { id: 2, fullName: 'Nguyễn Hữu Quang Vinh', username: 'nhqvinh', email: 'nguyenhuuquangvinh5@gmail.com', selected: false, password: 'abc123', createdAt: '14/03/2024' },
  ]);

  const [newUser, setNewUser] = useState<{ fullName: string; username: string; email: string }>({
    fullName: '',
    username: '',
    email: '',
  });

  const [isAccount, setIsAccount] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleSelectUser = (id: number) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, selected: !user.selected } : user)));
  };

  const handleAccountClick = (user: any) => {
    setIsAccount(true);
    setSelectedUser(user);
  };

  const handleAddUser = () => {
    if (newUser.fullName && newUser.username && newUser.email) {
      const newId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
      setUsers([...users, { id: newId, fullName: newUser.fullName, username: newUser.username, email: newUser.email, selected: false, password: 'defaultPassword', createdAt: new Date().toLocaleDateString() }]);
      setNewUser({ fullName: '', username: '', email: '' });
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter((user) => !user.selected);
    setUsers(updatedUsers);
  };

  const handleCancel = () => {
    setIsAccount(false);
    setSelectedUser(null);
    setNewUser({ fullName: '', username: '', email: '' });
  };

  return (
    <div className="p-5 border-2 border-gray-400 rounded-lg shadow-lg bg-white">
      {!isAccount && (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Họ và Tên"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              className="border p-1 mr-2"
            />
            <input
              type="text"
              placeholder="Tên Đăng Nhập"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="border p-1 mr-2"
            />
            <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border p-1 mr-2" />
            <button onClick={handleAddUser} className="p-1 bg-blue-500 text-white rounded">
              <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add
            </button>
          </div>
          <table className="min-w-full mt-4 border">
            <thead>
              <tr>
                <th className="border p-2 text-left">CHỌN</th>
                <th className="border p-2 text-left">HỌ VÀ TÊN</th>
                <th className="border p-2 text-left">TÊN ĐĂNG NHẬP</th>
                <th className="border p-2 text-left">EMAIL</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border p-2">
                    <input type="checkbox" checked={user.selected} onChange={() => handleSelectUser(user.id)} />
                  </td>
                  <td className="border p-2" onDoubleClick={() => handleAccountClick(user)}>
                    {user.fullName}
                  </td>
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDeleteSelected} className="mt-4 p-2 bg-red-500 text-white rounded">
            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete Selected
          </button>
        </>
      )}
      {isAccount && selectedUser && (
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">User ID</h2>
            <textarea className="border p-1 w-full" value={selectedUser.id} readOnly />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">UserName</h2>
            <textarea className="border p-1 w-full" value={selectedUser.username} readOnly />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Password</h2>
            <textarea className="border p-1 w-full" value={selectedUser.password} readOnly />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Email</h2>
            <textarea className="border p-1 w-full" value={selectedUser.email} readOnly />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Full name</h2>
            <textarea className="border p-1 w-full" value={selectedUser.fullName} readOnly />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Created at</h2>
            <textarea className="border p-1 w-full" value={selectedUser.createdAt} readOnly />
          </div>
          <div className="mt-4">
            <button className="mr-2 p-2 bg-green-500 text-white rounded">Save</button>
            <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccount;
