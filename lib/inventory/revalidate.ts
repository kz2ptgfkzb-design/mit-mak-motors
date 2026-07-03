import 'server-only';
import { revalidateTag, revalidatePath } from 'next/cache';
import { VEHICLES_TAG } from './public';

/**
 * Bust the public inventory cache after any admin write. Every public read
 * flows through the VEHICLES_TAG-tagged cache, so one call refreshes the home,
 * showroom, detail, compare, related and sitemap views.
 */
export function revalidateInventory(): void {
  try {
    revalidateTag(VEHICLES_TAG);
    revalidatePath('/');
    revalidatePath('/showroom');
  } catch (err) {
    console.error('[mit-mak] revalidate failed:', err);
  }
}
