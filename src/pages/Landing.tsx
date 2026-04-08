import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useAuthStore } from '../lib/store/authStore';
import { Button } from '../components/ui/Button';

const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const features = [
  {
    icon: 'menu_book',
    title: 'Premium Notes',
    desc: 'Comprehensive GATE CSE notes with KaTeX-rendered math, curated by top educators.',
  },
  {
    icon: 'quiz',
    title: 'Adaptive Practice',
    desc: 'MCQ, MSQ, and NAT questions with Previous Year Questions from GATE archives.',
  },
  {
    icon: 'psychology',
    title: 'AI Doubt Resolution',
    desc: 'Select any text in your notes and get instant, context-aware explanations.',
  },
  {
    icon: 'leaderboard',
    title: 'Live Leaderboard',
    desc: 'Compete weekly with thousands of GATE aspirants and track your ranking.',
  },
  {
    icon: 'style',
    title: 'Smart Flashcards',
    desc: 'Spaced-repetition flashcards that adapt to your learning pace.',
  },
  {
    icon: 'insights',
    title: 'Score Prediction',
    desc: 'AI-powered GATE score estimator based on your practice performance.',
  },
];

const stats = [
  { value: '15+', label: 'Core Subjects' },
  { value: '5000+', label: 'Practice Questions' },
  { value: '200+', label: 'Detailed Notes' },
  { value: '98%', label: 'Student Satisfaction' },
];

export default function Landing() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="grain-overlay" />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]">
                local_library
              </span>
            </div>
            <span className="font-display text-title-lg text-on-surface">
              ExamForge
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  size="sm"
                >
                  Sign In
                </Button>
                <Button onClick={() => navigate('/signup')} size="sm">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container text-label-lg">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              GATE CSE 2026 Ready
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-display-lg text-on-surface mb-6"
          >
            The Art of{' '}
            <span className="text-primary">Technical Precision</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-headline text-headline-sm text-on-surface-variant mb-10 max-w-2xl mx-auto"
          >
            Master every GATE CSE concept with premium notes, adaptive practice,
            and AI-powered doubt resolution — all in one scholarly sanctuary.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/signup')}
              iconRight="arrow_forward"
            >
              Start Preparing
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(user ? '/notes' : '/login')}
              icon="menu_book"
            >
              Browse Notes
            </Button>
          </motion.div>
        </motion.div>

        {/* Ambient glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      </section>

      {/* ── Stats Bar ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-5 rounded-2xl bg-surface-container"
            >
              <span className="font-display text-headline-lg text-primary mb-1">
                {stat.value}
              </span>
              <span className="text-label-md text-on-surface-variant">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-display-md text-on-surface mb-4">
            Everything You Need to{' '}
            <span className="text-primary">Crack GATE</span>
          </h2>
          <p className="text-headline-sm text-on-surface-variant font-headline max-w-xl mx-auto">
            A comprehensive platform designed with the precision and elegance that GATE preparation deserves.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
              className="group p-6 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors spring-transition"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform spring-transition">
                <span className="material-symbols-outlined text-on-primary-container text-[22px]">
                  {f.icon}
                </span>
              </div>
              <h3 className="font-headline text-title-lg text-on-surface mb-2">
                {f.title}
              </h3>
              <p className="text-body-md text-on-surface-variant">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-10 rounded-3xl bg-surface-container-high text-center overflow-hidden"
        >
          <div className="absolute inset-0 gradient-cta opacity-5" />
          <div className="relative z-10">
            <h2 className="font-display text-headline-lg text-on-surface mb-3">
              Ready to begin your GATE journey?
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto">
              Join thousands of aspirants who chose precision over improvisation.
            </p>
            <Button
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/signup')}
              iconRight="arrow_forward"
            >
              Create Free Account
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            local_library
          </span>
          <span className="text-label-lg text-on-surface-variant">
            ExamForge © {new Date().getFullYear()}
          </span>
        </div>
        <span className="text-label-md text-outline">
          The Academic Atelier — Built with precision.
        </span>
      </footer>
    </div>
  );
}
