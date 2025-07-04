'use client';

import AboutUsBackground from '@/components/AboutUsBackground';

export default function AboutPage() {
  return (
    <>
      <AboutUsBackground />

      {/* Main Page Content */}
      <div className="content-container pt-24">
        
        <div className="text-center p-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">Our Manifesto</h1>
          <p className="text-lg text-gray-400 mt-4 max-w-3xl inline-block">
            We don&apos;t just build tools. We build beliefs. This is the philosophy that drives
            every pixel and every line of code at CDH .
          </p>
        </div>

        {/* Tenet 1: Clarity over Chaos */}
        <section className="manifesto-section" data-state="chaos">
          <div className="manifesto-content mx-auto relative">
            <div className="tenet-number">01</div>
            <h2 className="text-3xl font-bold text-lime-300 mb-4">We Believe in Clarity Over Chaos.</h2>
            <p className="text-lg text-gray-300">The life of a creator is a storm of data points, deadlines, and demands. We exist to be the calm eye of that storm. We transform overwhelming complexity into intuitive, actionable clarity, giving you the focus to do what you do best: create.</p>
          </div>
        </section>

        {/* Tenet 2: Data is Art */}
        <section className="manifesto-section" data-state="art">
          <div className="manifesto-content mx-auto relative">
            <div className="tenet-number">02</div>
            <h2 className="text-3xl font-bold text-lime-300 mb-4">We Believe Data is Art.</h2>
            <p className="text-lg text-gray-300">Spreadsheets are soulless. We believe your business metrics deserve to be as beautiful and dynamic as your creative work. We craft experiences that turn your data into an interactive masterpiece, allowing you to see the patterns, feel the momentum, and find the story within the numbers.</p>
          </div>
        </section>
        
        {/* Tenet 3: Empowerment Through Automation */}
        <section className="manifesto-section" data-state="automation">
          <div className="manifesto-content mx-auto relative">
             <div className="tenet-number">03</div>
            <h2 className="text-3xl font-bold text-lime-300 mb-4">We Believe in Empowerment Through Automation.</h2>
            <p className="text-lg text-gray-300">Creator burnout is a failure of tooling, not a lack of passion. We relentlessly automate the administrative tasks that drain your energy—the invoicing, the follow-ups, the reporting—so you can reinvest your most valuable resource, your time, into your craft and your community.</p>
          </div>
        </section>

        {/* Tenet 4: The Creator is the CEO */}
         <section className="manifesto-section" data-state="ceo">
          <div className="manifesto-content mx-auto relative">
             <div className="tenet-number">04</div>
            <h2 className="text-3xl font-bold text-lime-300 mb-4">We Believe the Creator is the CEO.</h2>
            <p className="text-lg text-gray-300">You are not just a content producer; you are the founder, director, and visionary of a modern media enterprise. We build professional-grade tools that respect that reality, giving you the command and control you need to not just run your business, but to lead it.</p>
          </div>
        </section>

        {/* Team Section */}
        <section className="manifesto-section" data-state="synergy">
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl font-bold mb-8">The Architects</h2>
             <div className="team-grid grid gap-8">
              {/* Team members would be dynamically added here */}
              <div className="architect-card p-4 rounded-lg"><h3 className="font-bold">Creative Orchestrator</h3><p className="text-sm text-gray-400">Team Lead</p></div>
              <div className="architect-card p-4 rounded-lg"><h3 className="font-bold">Prompt Engineer</h3><p className="text-sm text-gray-400">AI Specialist</p></div>
              <div className="architect-card p-4 rounded-lg"><h3 className="font-bold">Visual Designer</h3><p className="text-sm text-gray-400">Aesthetics</p></div>
              <div className="architect-card p-4 rounded-lg"><h3 className="font-bold">UI/UX Designer</h3><p className="text-sm text-gray-400">User Experience</p></div>
              <div className="architect-card p-4 rounded-lg"><h3 className="font-bold">Web Developer</h3><p className="text-sm text-gray-400">Engineering</p></div>
              <div className="architect-card p-4 rounded-lg"><h3 className="font-bold">Creative Critic</h3><p className="text-sm text-gray-400">Strategy</p></div>
             </div>
          </div>
        </section>

      </div>

      <style jsx={true}>{`
        .content-container {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .manifesto-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 5rem 1.5rem;
        }
        .manifesto-content {
          max-width: 42rem;
          background-color: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 1rem;
        }
        .tenet-number {
          font-size: 5rem;
          font-weight: 800;
          color: rgba(238, 252, 151, 0.1);
          position: absolute;
          top: -2rem;
          left: -1rem;
          z-index: -1;
        }
        .team-grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
        .architect-card {
          background-color: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .architect-card:hover {
          transform: translateY(-5px);
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
}