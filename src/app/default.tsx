// app/default.tsx
// This handles soft 404s for parallel routes or slots that don't match

import NotFound from '@/app/not-found';

export default function Default() {
    return <NotFound />;
}