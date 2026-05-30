import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";

type Texture = {
  label: string;
  seed: string;
};

type FabricGalleryProps = {
  textures: Texture[];
};

export function FabricGallery({ textures }: FabricGalleryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {textures.map((texture, index) => (
        <FadeUp key={texture.seed} delay={index * 0.05}>
          <figure className="group overflow-hidden border border-hairline bg-white">
            <div className="relative aspect-square overflow-hidden bg-oat">
              <Image
                src={`https://picsum.photos/seed/${texture.seed}/600/600`}
                alt={texture.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <figcaption className="border-t border-hairline px-4 py-3 font-body text-xs uppercase tracking-[0.18em] text-sage-deep">
              {texture.label}
            </figcaption>
          </figure>
        </FadeUp>
      ))}
    </div>
  );
}
