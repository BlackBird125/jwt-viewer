"use client";
import { useState, type ChangeEvent } from "react";

interface JWTPayload {
  exp?: number;
  [key: string]: any;
}

export default function Home() {
  const [token, setToken] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const decodeToken = () => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT");

      const decodedPayload = JSON.parse(atob(parts[1])) as JWTPayload;
      setPayload(JSON.stringify(decodedPayload, null, 2));

      if (decodedPayload.exp) {
        const now = Math.floor(Date.now() / 1000);
        const remaining = decodedPayload.exp - now;
        if (remaining < 0) {
          setPayload((p: string) => p + `\n\n有効期限：期限切れ`);
        } else {
          const days = Math.floor(remaining / 86400);
          setPayload((p: string) => p + `\n\n有効期限：あと ${days}日`);
        }
      }

      setError("");
    } catch (e) {
      if (e instanceof Error) {
        setError("デコードに失敗しました：" + e.message);
      } else {
        setError("デコードに失敗しました");
      }
      setPayload("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setToken(e.target.value);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">JWT デコーダー</h1>
      <textarea
        value={token}
        onChange={handleChange}
        rows={6}
        className="w-full border rounded p-2 mb-4"
        placeholder="ここにJWTを入力してください"
      />
      <button
        onClick={decodeToken}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        デコードする
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {payload && (
        <div className="overflow-hidden transition-all duration-300 ease-in-out mt-4">
          <pre className="p-4 bg-gray-100 rounded whitespace-pre-wrap overflow-auto">
            {payload}
          </pre>
        </div>
      )}
    </main>
  );
}
