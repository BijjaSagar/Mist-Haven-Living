"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { HeroSlide } from "@/lib/types/cms";

type HeroSlidesEditorProps = {
  slides: HeroSlide[];
  onChange: (slides: HeroSlide[]) => void;
};

export function HeroSlidesEditor({ slides, onChange }: HeroSlidesEditorProps) {
  function updateSlide(index: number, field: keyof HeroSlide, value: string) {
    onChange(
      slides.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide,
      ),
    );
  }

  function addSlide() {
    onChange([
      ...slides,
      { imageUrl: "", caption: "New slide" },
    ]);
  }

  function removeSlide(index: number) {
    onChange(slides.filter((_, i) => i !== index));
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= slides.length) return;
    const copy = [...slides];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Hero slideshow slides</Label>
        <Button type="button" variant="outline" size="sm" onClick={addSlide}>
          Add slide
        </Button>
      </div>
      <p className="font-body text-xs text-muted">
        Homepage hero carousel. At least one slide with an image is recommended.
      </p>
      {slides.map((slide, index) => (
        <div
          key={`slide-${index}`}
          className="space-y-3 rounded-md border border-hairline bg-pearl/50 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-body text-sm font-medium text-taupe">
              Slide {index + 1}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === 0}
                onClick={() => moveSlide(index, -1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === slides.length - 1}
                onClick={() => moveSlide(index, 1)}
              >
                ↓
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600"
                disabled={slides.length <= 1}
                onClick={() => removeSlide(index)}
              >
                Remove
              </Button>
            </div>
          </div>
          <ImageUploadField
            label="Slide image"
            value={slide.imageUrl}
            onChange={(url) => updateSlide(index, "imageUrl", url)}
            uploadFolder="pages/home-hero"
          />
          <div>
            <Label>Caption</Label>
            <Input
              value={slide.caption}
              onChange={(e) => updateSlide(index, "caption", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
