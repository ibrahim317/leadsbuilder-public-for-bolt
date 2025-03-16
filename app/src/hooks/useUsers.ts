import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUsers, updateUserRole as updateRole, deleteUser as removeUser } from '../db/User';
import { GetUsersOptions } from '../db/User/getUsers';
import { User as DbUser } from '../db/types';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async (options?: GetUsersOptions) => {
    try {
      setLoading(true);
      
      const response = await getUsers(options);

      if (response.error) throw response.error;

      if (response.data) {
        // Map the database user type to our hook's User type
        const mappedUsers: User[] = response.data.map(user => ({
          id: user.id,
          email: user.email || '',
          // Get role from user_roles or default to 'user'
          role: 'user', // Default value, should be updated from user_roles
          created_at: user.created_at || new Date().toISOString(),
          last_sign_in_at: null // This might need to be fetched from auth.users
        }));
        
        setUsers(mappedUsers);
        
        if (response.count !== undefined) {
          setTotalCount(response.count);
        }
        
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err as Error);
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await updateRole(userId, newRole);

      if (response.error) throw response.error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success('Role updated successfully');
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Error updating user role');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await removeUser(userId);

      if (response.error) throw response.error;

      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Error deleting user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    totalCount,
    fetchUsers,
    updateUserRole,
    deleteUser
  };
}
