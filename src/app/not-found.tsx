import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-6 rounded bg-blue-500 px-6 py-3 text-white hover:bg-blue-700">
        Go back to Home
      </Link>
    </div>
  );
}
