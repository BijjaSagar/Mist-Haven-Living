import { HoverScaleImage } from "@/components/motion/HoverScaleImage";
import { StaggerChildren } from "@/components/motion/StaggerChildren";

type Texture = {
  label: string;
  seed: string;
};

type FabricGalleryProps = {
  textures: Texture[];
};

export function FabricGallery({ textures }: FabricGalleryProps) {
  return (
    <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {textures.map((texture) => (
        <figure
          key={texture.seed}
          className="group overflow-hidden border border-hairline bg-white"
        >
          <HoverScaleImage
            src={`https://picsum.photos/seed/${texture.seed}/600/600`}
            alt={texture.label}
            fill
            containerClassName="aspect-square bg-oat"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <figcaption className="border-t border-hairline px-4 py-3 font-body text-xs uppercase tracking-[0.18em] text-sage-deep">
            {texture.label}
          </figcaption>
        </figure>
      ))}
    </StaggerChildren>
  );
}
