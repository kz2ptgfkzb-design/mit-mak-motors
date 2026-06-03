import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/section-heading';
import { SpeedLines } from '@/components/ui/chevron';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[82svh] items-center overflow-hidden pt-28">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <SpeedLines className="absolute right-0 top-0 h-full w-1/2 text-red/20" />
      <div className="container relative text-center">
        <div className="flex justify-center">
          <Eyebrow center>Lost the trail</Eyebrow>
        </div>
        <h1 className="text-stroke font-anton text-[34vw] leading-none tracking-tight lg:text-[20rem]">404</h1>
        <p className="mx-auto -mt-4 max-w-md text-base text-graphite-300 md:text-lg">
          This page took a wrong turn. Let’s get you back on the road — the showroom’s this way.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" size="lg" arrow magnetic>
            Back Home
          </Button>
          <Button href="/showroom" variant="outline" size="lg">
            Browse the Showroom
          </Button>
        </div>
      </div>
    </section>
  );
}
