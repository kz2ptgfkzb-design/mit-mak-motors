import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { getVehicle, vehicles } from '@/data/vehicles';
import { siteConfig } from '@/data/site';
import { formatPrice } from '@/lib/utils';
import { VehicleGallery } from '@/components/vehicle/vehicle-gallery';
import { SpecGrid } from '@/components/vehicle/spec-grid';
import { Accordion } from '@/components/vehicle/detail-accordion';
import { TrustBlock } from '@/components/vehicle/trust-block';
import { StickyActionPanel } from '@/components/vehicle/sticky-action-panel';
import { RelatedVehicles } from '@/components/vehicle/related-vehicles';
import { CtaBand } from '@/components/layout/cta-band';
import { Eyebrow } from '@/components/ui/section-heading';

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const v = getVehicle(params.slug);
  if (!v) return { title: 'Vehicle not found' };
  const title = `${v.year} ${v.make} ${v.model} ${v.variant}`;
  return {
    title: `${title}, ${formatPrice(v.price)}`,
    description: `${title} for sale at Mit-Mak Motors. ${v.tagline} ${v.mileage.toLocaleString('en-ZA')} km · ${v.fuel} · ${v.transmission}. Inspected, reconditioned & delivered free nationwide.`,
    alternates: { canonical: `/vehicles/${v.slug}` },
    openGraph: { title, description: v.tagline, images: [{ url: v.images[0] }], type: 'website' },
  };
}

export default function VehiclePage({ params }: { params: { slug: string } }) {
  const vehicle = getVehicle(params.slug);
  if (!vehicle) notFound();

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant}`;

  const accordionItems = [
    {
      title: 'Description',
      content: <p className="leading-relaxed">{vehicle.description}</p>,
    },
    {
      title: 'Features & Specification',
      content: (
        <div className="space-y-5">
          {vehicle.features.map((group) => (
            <div key={group.category}>
              <p className="mb-2.5 font-display text-xs uppercase tracking-wide text-white">{group.category}</p>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-graphite-300">
                    <Check className="h-3.5 w-3.5 shrink-0 text-red" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Service History & Warranty',
      content: (
        <div className="space-y-3 text-sm leading-relaxed">
          <p>{vehicle.serviceHistory}</p>
          {vehicle.warranty && (
            <p>
              <span className="font-display uppercase tracking-wide text-white">Warranty:</span> {vehicle.warranty}
            </p>
          )}
        </div>
      ),
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: title,
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    vehicleConfiguration: vehicle.variant,
    productionDate: `${vehicle.year}`,
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'KMT' },
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    color: vehicle.color,
    image: vehicle.images.slice(0, 5),
    sku: vehicle.stockNumber,
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'ZAR',
      availability: vehicle.reserved ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
      seller: { '@type': 'AutoDealer', name: siteConfig.name },
    },
  };

  return (
    <>
      <section className="pt-28 lg:pt-32">
        <div className="container">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-graphite-500">
            <Link href="/" className="hover:text-red">Home</Link>
            <span className="text-graphite-700">/</span>
            <Link href="/showroom" className="hover:text-red">Showroom</Link>
            <span className="text-graphite-700">/</span>
            <span className="text-graphite-300">{vehicle.make} {vehicle.model}</span>
          </nav>

          <div className="mt-6">
            <Eyebrow>{vehicle.tagline}</Eyebrow>
            <h1 className="mt-4 font-anton text-4xl uppercase leading-[0.9] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 xl:col-span-8">
              <VehicleGallery images={vehicle.images} alt={title} />

              <div className="mt-7 flex flex-wrap gap-2.5">
                {vehicle.highlights.map((h) => (
                  <span key={h} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-graphite-200">
                    <Check className="h-3.5 w-3.5 text-red" /> {h}
                  </span>
                ))}
              </div>

              <div className="mt-10">
                <h2 className="mb-5 font-display text-xl uppercase tracking-tight text-white">Specification</h2>
                <SpecGrid vehicle={vehicle} />
              </div>

              <div className="mt-8">
                <Accordion items={accordionItems} />
              </div>

              <div className="mt-8">
                <TrustBlock />
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <StickyActionPanel vehicle={vehicle} />
            </div>
          </div>
        </div>
      </section>

      <RelatedVehicles vehicle={vehicle} />

      <CtaBand
        eyebrow="Not quite the one?"
        title="The right car is in the showroom"
        description="Browse every inspected, reconditioned vehicle, or tell us what you're after and we'll find it. Delivered free, anywhere in South Africa."
        secondary={{ label: 'Get a Cash Offer', href: '/sell-your-car' }}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
