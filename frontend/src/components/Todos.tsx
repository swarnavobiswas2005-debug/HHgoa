import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface Todo {
  id: number;
  name: string;
}

export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodos() {
      const { data } = await supabase.from('todos').select();
      if (data) {
        setTodos(data);
      }
      setLoading(false);
    }
    fetchTodos();
  }, []);

  if (loading) return <div className="text-sm font-mono text-[#064e3b] p-4">Loading todos...</div>;

  return (
    <div className="solid-panel p-6 rounded-xl mt-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold font-display mb-4 border-b border-emerald-500/20 pb-2">Supabase Todos</h2>
      {todos.length === 0 ? (
        <p className="text-xs font-sans text-emerald-800/60">No todos found in the database.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2 text-sm font-mono bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {todo.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
