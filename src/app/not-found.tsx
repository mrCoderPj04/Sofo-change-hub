import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">404 - Page Not Found</h2>
      <p className="text-xs text-[#8D98A8] mb-4">The requested changehub resource does not exist.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#00A3FF] text-[#07090D] text-xs font-bold rounded-md"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
