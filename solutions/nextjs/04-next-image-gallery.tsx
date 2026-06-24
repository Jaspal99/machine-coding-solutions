import Image from "next/image";
import Link from "next/link";
type Photo = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};
export default function NextImageGallery({ photos }: { photos: Photo[] }) {
  return (
    <main>
      <h1>Gallery</h1>
      <div>
        {photos.map((photo) => (
          <Link key={photo.id} href={`/gallery/${photo.id}`}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 768px) 100vw, 33vw"
              placeholder="empty"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
// app/gallery/[id]/page.tsx should fetch by id, call notFound() for missing
// images, export generateMetadata(), and render a responsive next/image.
// Add loading.tsx with skeleton cards and error.tsx with a retry action.
