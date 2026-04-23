import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

export default function NotFound() {
    return (
        <div className="grid min-h-[60vh] place-items-center">
            <GlassCard className="w-full max-w-xl !p-10 text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-8 w-8 text-amber-700" />
                </div>
                <h1 className="mb-3 text-3xl font-extrabold text-stone-900">Page not found</h1>
                <p className="mb-8 text-stone-600">The page you are looking for does not exist or has been moved.</p>
                <Link to="/">
                    <Button variant="primary" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to home
                    </Button>
                </Link>
            </GlassCard>
        </div>
    );
}
