import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { Plus, Trash2, Edit, ArrowUp, ArrowDown } from "lucide-react";

const STORAGE_KEY = "grocery_list_v1";

export default function Lists() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [text, setText] = useState("");
  const [qty, setQty] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addOrSave = () => {
    const name = text.trim();
    if (!name) return;

    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? { ...it, name, qty, createdAt: it.createdAt }
            : it,
        ),
      );
      setEditingId(null);
    } else {
      const newItem = {
        id: nanoid(),
        name,
        qty: qty || undefined,
        bought: false,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
    }

    setText("");
    setQty("");
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setText(it.name);
    setQty(it.qty || "");
  };

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

  const toggleBought = (id) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bought: !p.bought } : p)),
    );

  const move = (index, dir) => {
    setItems((prev) => {
      const next = [...prev];
      const to = index + dir;
      if (to < 0 || to >= next.length) return prev;
      const tmp = next[to];
      next[to] = next[index];
      next[index] = tmp;
      return next;
    });
  };

  const clearBought = () => setItems((prev) => prev.filter((p) => !p.bought));

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "active") return items.filter((i) => !i.bought);
    return items.filter((i) => i.bought);
  }, [items, filter]);

  const counts = useMemo(() => {
    return {
      total: items.length,
      bought: items.filter((i) => i.bought).length,
      active: items.filter((i) => !i.bought).length,
    };
  }, [items]);

  return (
    <Card className="max-w-xl w-full mx-auto rounded-2xl shadow-md p-2">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-between gap-2">
          <span>List</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{counts.active} left</Badge>
            <Badge variant="outline">{counts.total} total</Badge>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          A small, focused list manager.
        </p>
      </CardHeader>

      <Separator />

      <CardContent className="p-4">
        <div className="flex gap-2 mb-4">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add item (e.g. Bananas)"
            onKeyDown={(e) => {
              if (e.key === "Enter") addOrSave();
              if (e.key === "Escape") {
                setText("");
                setQty("");
                setEditingId(null);
              }
            }}
          />

          <Input
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Qty (optional)"
            onKeyDown={(e) => e.key === "Enter" && addOrSave()}
            className="w-28"
          />

          <Button onClick={addOrSave} className="flex items-center gap-2">
            <Plus size={16} /> {editingId ? "Save" : "Add"}
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "ghost"}
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "bought" ? "default" : "ghost"}
            onClick={() => setFilter("bought")}
          >
            Bought
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={clearBought}
              title="Remove all bought items"
            >
              <Trash2 size={16} /> Clear bought
            </Button>
          </div>
        </div>

        <ul className="space-y-2">
          <AnimatePresence>
            {filtered.map((it, idx) => (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                layout
                className="flex items-center gap-3 p-3 rounded-xl shadow-sm bg-white/80"
              >
                <Checkbox
                  checked={it.bought}
                  onCheckedChange={() => toggleBought(it.id)}
                />

                <div className="flex-1 min-w-0">
                  <div
                    className={`truncate font-medium ${it.bought ? "line-through text-muted-foreground" : ""}`}
                  >
                    {it.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {it.qty ? `Qty: ${it.qty} • ` : ""}
                    {new Date(it.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => move(idx, -1)}
                    title="Move up"
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => move(idx, 1)}
                    title="Move down"
                  >
                    <ArrowDown size={16} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(it)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(it.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Your list is empty — add your first grocery item above.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
export function loader() {
  return null;
}
