import { handleFormSubmission } from '@/lib/api';

export async function POST(req: Request) {
  return handleFormSubmission(req, 'contact');
}
