"use client";
import { useState } from "react";

export default function ContentStudioPage() {
  const [posts, setPosts] = useState([
    { id: 1, title: "Welcome to Genio OS", status: "Published" },
    { id: 2, title: "AI Twin Voice Update", status: "Draft" },
  ]);
  const [newPost, setNewPost] = useState("");

  const handlePublish = (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Published" } : p))
    );
  };

  const handleCreate = () => {
    if (!newPost.trim()) return;
    const id = posts.length + 1;
    setPosts([...posts, { id, title: newPost, status: "Draft" }]);
    setNewPost("");
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Content Studio</h1>

      <div className="max-w-2xl space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="New post title..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>

        <div className="border border-gray-800 rounded-lg divide-y divide-gray-800">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4">
              <div>
                <h2 className="font-medium">{post.title}</h2>
                <p
                  className={`text-sm ${
                    post.status === "Published"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {post.status}
                </p>
              </div>
              {post.status === "Draft" && (
                <button
                  onClick={() => handlePublish(post.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Publish
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
