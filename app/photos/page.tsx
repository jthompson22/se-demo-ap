import Image from 'next/image';
import { getPage } from '@/sanity/queries';

export default async function Photos() {
  const page = await getPage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{page.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {page.gallery?.images?.map((image: any, index: number) => (
          <div key={image._key || index} className="relative aspect-square">
            <Image
              src={image.imageUrl}
              alt={image.alt || 'Gallery image'}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover rounded-lg"
              priority={index < 4} // Load first 4 images immediately
            />
          </div>
        ))}
      </div>
    </div>
  );
}