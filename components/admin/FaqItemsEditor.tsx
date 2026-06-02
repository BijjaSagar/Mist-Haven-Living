"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/lib/types/cms";

type FaqItemsEditorProps = {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
};

export function FaqItemsEditor({ items, onChange }: FaqItemsEditorProps) {
  function updateItem(index: number, field: keyof FaqItem, value: string) {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addItem() {
    onChange([...items, { question: "", answer: "" }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>FAQ items</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          Add question
        </Button>
      </div>
      {items.map((item, index) => (
        <div
          key={`faq-${index}`}
          className="space-y-3 rounded-md border border-hairline bg-pearl/50 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-body text-sm font-medium text-taupe">
              Q&A {index + 1}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
              >
                ↓
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            </div>
          </div>
          <div>
            <Label>Question</Label>
            <Input
              value={item.question}
              onChange={(e) => updateItem(index, "question", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea
              value={item.answer}
              onChange={(e) => updateItem(index, "answer", e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
