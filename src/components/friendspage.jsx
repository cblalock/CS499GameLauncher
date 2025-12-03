import React, { useState, useEffect } from "react";
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function FriendsSystem() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const friendsRes = await axios.get(`${API_URL}/friends/${username}`);
        const requestsRes = await axios.get(`${API_URL}/friends/requests/incoming/${username}`);
        setFriends(friendsRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchFriendsAndRequests();
  }, []);

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

  const handleSearch = () => {
    // Mock search
    if (!searchName) return;
    setSearchResults([{ id: 999, username: searchName }]);
  };

    return (
      <div style={{ display: "flex", gap: "2rem", padding: "2rem", fontFamily: "sans-serif" }}>
        {/* Friends List */}
        <div style={{ flex: 1 }}>
          <h2>Friends</h2>
          <ul>
            {friends.map((friend) => (
              <li key={friend.id} style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: friend.online ? "bold" : "normal" }}>
                  {friend.username}
                </span>
                <span style={{ marginLeft: "0.5rem", color: friend.online ? "green" : "gray" }}>
                  ({friend.online ? "Online" : "Offline"})
                </span>
                <button onClick={() => removeFriend(friend.id)} style={{ marginLeft: "1rem" }}>
                  Remove
                </button>
              </li>
            ))}
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
