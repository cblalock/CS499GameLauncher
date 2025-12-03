import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Users, UserPlus, UserMinus, Search } from "lucide-react";

const API_URL = 'http://localhost:3000';

export default function FriendsSystem({ currentUser, theme }) {
  const [friends, setFriends] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const friendsRes = await axios.get(`${API_URL}/friends/${currentUser}`);
        setFriends(friendsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (currentUser) {
      fetchFriendsAndRequests();
    }
  }, [currentUser]);

  // Fetch friend details from user database
  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const friendsList = friends.map(friend => {
          return friend.requester === currentUser ? friend.receiver : friend.requester;
        });

        if (friendsList.length > 0) {
          const allUsersRes = await axios.get(`${API_URL}/api/users`);
          const allUsers = allUsersRes.data;
          const friendDetails = allUsers.filter(user => friendsList.includes(user.username));
          setFriendsData(friendDetails);
        } else {
          setFriendsData([]);
        }
      } catch (error) {
        console.error('Error fetching friend details:', error);
      }
    };

    fetchFriendDetails();
  }, [friends, currentUser]);

  const sendFriendRequest = async (username) => {
    try {
      await axios.post(`${API_URL}/friends/request`, { requester: currentUser, receiver: username });
      alert(`Friend request sent to ${username}`);
      setSearchName('');
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.put(`${API_URL}/friends/respond`, { id, status: 'accepted' });
      setRequests(requests.filter((r) => r.id !== id));
      fetchFriendsAndRequests();
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const declineRequest = async (id) => {
    try {
      await axios.put(`${API_URL}/friends/respond`, { id, status: 'declined' });
      setRequests(requests.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error declining request:', err);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(`${API_URL}/friends/${friendId}`);
      setFriendsData(friendsData.filter((f) => f.username !== friendId));
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  const checkUserExists = async (username) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${username}`);
      if (response.data && typeof response.data.exists === 'boolean') {
        return response.data.exists;
      } else {
        console.error('Unexpected response format:', response.data);
        return false;
      }
    } catch (err) {
      console.error('Error checking user existence:', err);
      return false;
    }
  };

  const handleSearch = async () => {
    if (!searchName) return;
    const userExists = await checkUserExists(searchName);
    if (userExists) {
      setSearchResults([{ id: 999, username: searchName }]);
    } else {
      alert('User not found');
      setSearchResults([]);
    }
  };

  // Update friends list whenever the current user changes
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${API_URL}/friends/${currentUser}`);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    if (currentUser) {
      fetchFriends();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <section className="max-w-5xl mx-auto">
        <h2 className={`text-3xl font-bold text-center ${theme?.text || 'text-white'}`}>
          Please log in to view your friends
        </h2>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <Users className="w-8 h-8 text-yellow-400 mr-3" />
        <h2 className={`text-3xl font-bold ${theme?.text || 'text-white'}`}>
          My Friends
        </h2>
      </div>

      {/* Friends Grid */}
      <div className={`rounded-lg p-6 mb-6 border ${
        theme?.background || 'bg-white bg-opacity-10 backdrop-blur-md border-yellow-400'
      }`}>
        <div className="space-y-3">
          {friendsData && friendsData.length > 0 ? (
            friendsData.map((friend) => (
              <div
                key={friend.username}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  theme?.background?.includes('gray-800')
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white bg-opacity-5 border-white border-opacity-20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={friend.profile_picture}
                    alt={friend.username}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                  />
                  <div>
                    <div className={`font-bold text-lg ${theme?.text || 'text-white'}`}>
                      {friend.username}
                    </div>
                    <div className={`text-sm flex items-center gap-2 ${
                      theme?.background?.includes('gray-800') ? "text-gray-400" : "text-white"
                    }`}>
                      {friend.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFriend(friend.username)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    theme?.background?.includes('gray-800')
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  <UserMinus className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className={theme?.text || 'text-white'}>No friends yet.</p>
          )}
        </div>
      </div>

      {/* Search Users */}
      <div className={`rounded-lg p-6 border ${
        theme?.background || 'bg-white bg-opacity-10 backdrop-blur-md border-yellow-400'
      }`}>
        <div className="flex items-center mb-4">
          <Search className="w-6 h-6 text-yellow-400 mr-3" />
          <h3 className={`text-2xl font-bold ${theme?.text || 'text-white'}`}>
            Search Users
          </h3>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter username"
            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              theme?.background?.includes('gray-800')
                ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500"
                : "bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white focus:ring-yellow-400"
            }`}
          />
          <button
            onClick={handleSearch}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              theme?.background?.includes('gray-800')
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gradient-to-r from-green-700 to-yellow-500 hover:from-green-600 hover:to-yellow-400 text-white"
            }`}
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  theme?.background?.includes('gray-800')
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white bg-opacity-5 border-white border-opacity-20"
                }`}
              >
                <span className={theme?.text || 'text-white'}>{result.username}</span>
                <button
                  onClick={() => sendFriendRequest(result.username)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    theme?.background?.includes('gray-800')
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
