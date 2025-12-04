import { useEffect, useState } from "react";
import SidebarSkeleton from "./Skeletons/SidebarSkeleton";
import { Users as UsersIcon } from "lucide-react";
import useChatStore from "../store/UseChatStore";
import useAuthStore from "../store/UseAuthStore";



const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    console.log("Sidebar mounted, calling getUsers");
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    console.log("onlineUsers changed in Sidebar:", onlineUsers);
  }, [onlineUsers]);

  console.log("Users:", users);
  console.log("Is Loading:", isUsersLoading);

  const filteredUsers = showOnlineOnly
    ? users?.filter((User) => onlineUsers?.includes(User._id)) || []
    : users || [];

  console.log("Filtered Users:", filteredUsers);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <UsersIcon className="size-6" />   {/* FIX */}
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({(onlineUsers?.length || 0)} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((User) => (
          <button
            key={User._id}
            onClick={() => setSelectedUser(User)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === User._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={User.profilepic || "/image.png"}
                alt={User.name}
                className="size-12 object-cover rounded-full"
              />

              {onlineUsers.includes(User._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{User.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(User._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
