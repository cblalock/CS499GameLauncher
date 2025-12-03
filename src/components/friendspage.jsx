import React, { useState, useEffect } from "react";
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function FriendsSystem({ currentUser }) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const friendsRes = await axios.get(`${API_URL}/friends/${currentUser}`);
        const requestsRes = await axios.get(`${API_URL}/friends/requests/incoming/${currentUser}`);
        setFriends(friendsRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchFriendsAndRequests();
  }, [currentUser]);

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

  const removeFriend = async (id) => {
    try {
      await axios.delete(`${API_URL}/friends/${id}`);
      setFriends(friends.filter((f) => f.id !== id));
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
        const friendsList = response.data.map(friend => {
          return friend.requester === currentUser ? friend.receiver : friend.requester;
        });
        setFriends(friendsList);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    if (currentUser) {
      fetchFriends();
    }
  }, [currentUser]);

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem", fontFamily: "sans-serif" }}>
      {/* Friends List */}
      <div style={{ flex: 1 }}>
        <h2>Friends</h2>
        <ul>
          {friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            friends.map((username, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <span>{username}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Friend Requests */}
      <div style={{ flex: 1 }}>
        <h2>Friend Requests</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.id} style={{ marginBottom: "0.5rem" }}>
              {request.username}
              <button onClick={() => acceptRequest(request.id)} style={{ marginLeft: "1rem" }}>
                Accept
              </button>
              <button onClick={() => declineRequest(request.id)} style={{ marginLeft: "0.5rem" }}>
                Decline
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Search */}
      <div style={{ flex: 1 }}>
        <h2>Search Users</h2>
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Enter username"
        />
        <button onClick={handleSearch} style={{ marginLeft: "0.5rem" }}>
          Search
        </button>
        <ul>
          {searchResults.map((result) => (
            <li key={result.id} style={{ marginBottom: "0.5rem" }}>
              {result.username}
              <button onClick={() => sendFriendRequest(result.username)} style={{ marginLeft: "1rem" }}>
                Send Request
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
