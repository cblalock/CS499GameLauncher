import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function Friends({ username }) {
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [newFriend, setNewFriend] = useState('');

  // Fetch friends and requests
  const fetchFriends = async () => {
    try {
      const [friendsRes, incomingRes, outgoingRes] = await Promise.all([
        axios.get(`${API_URL}/friends/${username}`),
        axios.get(`${API_URL}/friends/requests/incoming/${username}`),
        axios.get(`${API_URL}/friends/requests/outgoing/${username}`)
      ]);

      setFriends(friendsRes.data);
      setIncomingRequests(incomingRes.data);
      setOutgoingRequests(outgoingRes.data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Send friend request
  const handleSendRequest = async () => {
    if (!newFriend) return;
    try {
      await axios.post(`${API_URL}/friends/request`, { requester: username, receiver: newFriend });
      setNewFriend('');
      fetchFriends();
    } catch (err) {
      console.error('Error sending request:', err.response?.data?.error || err.message);
      alert(err.response?.data?.error || 'Error sending request');
    }
  };

  // Accept friend request
  const handleAccept = async (requestId) => {
    try {
      await axios.post(`${API_URL}/friends/accept`, { requestId });
      fetchFriends();
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  // Decline friend request
  const handleDecline = async (requestId) => {
    try {
      await axios.post(`${API_URL}/friends/decline`, { requestId });
      fetchFriends();
    } catch (err) {
      console.error('Error declining request:', err);
    }
  };

  // Remove friend
  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.delete(`${API_URL}/friends/${friendId}`);
      fetchFriends();
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  return (
    <div className="friends-container">
      <h2>Friends</h2>

      <div className="add-friend">
        <input
          type="text"
          placeholder="Enter username"
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
        />
        <button onClick={handleSendRequest}>Send Friend Request</button>
      </div>

      <h3>Accepted Friends</h3>
      {friends.length === 0 ? <p>No friends yet.</p> : (
        <ul>
          {friends.map((f) => (
            <li key={f.id}>
              <img src={f.profile_picture} alt={f.friend} width={40} height={40} style={{ borderRadius: '50%' }} />
              <span>{f.friend}</span>
              <button onClick={() => handleRemoveFriend(f.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Incoming Requests</h3>
      {incomingRequests.length === 0 ? <p>No incoming requests.</p> : (
        <ul>
          {incomingRequests.map((req) => (
            <li key={req.id}>
              <img src={req.profile_picture} alt={req.from_user} width={40} height={40} style={{ borderRadius: '50%' }} />
              <span>{req.from_user}</span>
              <button onClick={() => handleAccept(req.id)}>Accept</button>
              <button onClick={() => handleDecline(req.id)}>Decline</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Outgoing Requests</h3>
      {outgoingRequests.length === 0 ? <p>No outgoing requests.</p> : (
        <ul>
          {outgoingRequests.map((req) => (
            <li key={req.id}>
              <img src={req.profile_picture} alt={req.to_user} width={40} height={40} style={{ borderRadius: '50%' }} />
              <span>{req.to_user}</span>
              <span style={{ fontStyle: 'italic', marginLeft: '10px' }}>Pending</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
