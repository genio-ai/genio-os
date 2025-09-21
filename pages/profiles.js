// File: pages/profiles.js
import { useEffect, useState } from "react";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        setProfiles(data);
      } catch (err) {
        console.error("Failed to load profiles:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, []);

  if (loading) return <p>Loading profiles...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profiles</h1>
      {profiles.length === 0 ? (
        <p>No profiles found.</p>
      ) : (
        <ul>
          {profiles.map((p) => (
            <li key={p.id}>
              {p.name || "Unnamed"} – {p.email || "No email"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
