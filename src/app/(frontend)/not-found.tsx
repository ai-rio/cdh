import Link from 'next/link'
import { StarfieldCanvas } from './components/StarfieldCanvas'

export default function NotFound() {
  return (
    <>
      <StarfieldCanvas variant="404" />
      <div className="relative z-[2] w-full h-screen flex flex-col justify-center items-center">
        <div className="bg-[rgba(17,17,17,0.7)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.1)] p-8 rounded-2xl text-center max-w-lg mx-auto">
          <h1 className="text-6xl md:text-9xl font-extrabold text-[#A3E635] font-mono">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-4">
            Signal Lost: Trajectory Anomaly
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            You&apos;ve discovered an uncharted sector of the constellation. The data stream is unstable here, but our command center is still online.
          </p>
          <Link
            href="/"
            className="inline-block mt-8 font-bold text-lg px-8 py-4 rounded-lg bg-[#A3E635] text-[#1D1F04] shadow-[0_0_15px_rgba(163,230,53,0.3),0_0_30px_rgba(163,230,53,0.2)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_25px_rgba(163,230,53,0.5),0_0_50px_rgba(163,230,53,0.3)]"
          >
            Re-establish Connection
          </Link>
        </div>
      </div>
    </>
  )
}