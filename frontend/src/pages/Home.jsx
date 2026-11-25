import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, Pill, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="page home-page">
      <section className="hero">
        <div className="eyebrow">
          <Sparkles size={16} /> STUDENT AI PROJECT
        </div>

        <h1>
          Smarter medicine
          <br />
          <span>comparison starts here.</span>
        </h1>

        <p>
          Explore a simple ML demonstration and compare illustrative medicine
          prices. Learn how a model, Flask API and React UI work together.
        </p>

        <div className="hero-actions">
          <Link className="button" to="/medprior">
            Try MedPrior <ArrowRight />
          </Link>
          <Link className="button secondary" to="/saltsaver">
            Explore SaltSaver <Pill />
          </Link>
        </div>

        <div className="hero-note">
          Scores are generated from synthetic data and are not clinically
          validated.
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature">
          <HeartPulse />
          <h3>MedPrior demo</h3>
          <p>
            Enter example inputs and see an ML model return a demonstration
            score.
          </p>
          <Link to="/medprior">Open form →</Link>
        </article>

        <article className="feature">
          <Pill />
          <h3>SaltSaver comparison</h3>
          <p>
            Explore a small medicine catalogue and illustrative price comparison
            entries.
          </p>
          <Link to="/saltsaver">Compare medicines →</Link>
        </article>
      </section>
    </main>
  );
}
