import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 right-0 w-full z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center h-16 px-6">
        <div className="flex items-center gap-8">
          <span className="font-display text-xl font-semibold text-primary">ExamForge</span>
          <div className="hidden md:flex items-center gap-6">
            <button className="text-sm font-medium text-primary">Dashboard</button>
            <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-all">Notes</button>
            <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-all">Practice</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full bg-surface-container-high text-sm font-semibold hover:bg-surface-container-highest transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-24 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPlTqcgzVP0piVJIwYf9zjS_Ic_vxamat3D_sDdIR-4qV3T3yJy6ZuCBlgONITy8sy5pukcA9LrjJ6T_pPzcsbShlhP5SoozvP5zeZ08j5x2s9ZXTNLEpAoaoyWPgqvtE-j95N0dlUtfTFnFMRNF7v7AorJlnQj9PuZyE1ksahsODutwstYZ7HeElWPnyVyutIfd_S_O5jBl4OOkNoIgTKd10haeN9eUAuJM7MbqmwnCTOY6TnFPk4rLrG75QNIgHVRVmpRQaZNNgy')] opacity-[0.03] pointer-events-none mix-blend-multiply"></div>
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-secondary text-xs font-bold tracking-wider uppercase mb-6">
              <span className="material-symbols-outlined text-sm">school</span>
              FOR GATE CSE ASPIRANTS
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-8 text-on-surface">
              The Art of <br />
              <span className="italic text-primary">Technical Precision.</span>
            </h1>
            <p className="font-notes text-xl text-on-surface-variant leading-relaxed mb-10 max-w-lg">
              Elevate your GATE preparation with a curated editorial experience. Master Computer Science through meticulously crafted notes and high-fidelity practice sets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(182,160,255,0.15)]"
              >
                Start Learning for Free
              </button>
              <button className="px-8 py-4 rounded-full border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-low transition-all">
                Explore Curriculum
              </button>
            </div>
          </div>
          <div className="relative lg:block hidden">
            <div className="clip-path-polygon-[0_0,100%_5%,100%_100%,0_95%] bg-surface-container-lowest p-4 shadow-[0_0_40px_rgba(182,160,255,0.15)]">
              <img className="w-full h-[600px] object-cover rounded-sm" alt="Modern minimalist study space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2s3Lur8_8XMlNANP7gSuPJoNWNYuRgpLx007fevYupkFo33aVj8eEpx4AcDFBSIuHv1jgkgI8r8CgRiql-B6GJud0FrzO8albKMkz-R-bgwVsq1wXQQykcMwk1lZM9J8rpdwSFG_CwO5DpCVqUCTGvmt3UWbSRc4wOWg9ufBghifbQVxmnxA5Qfq9zgCH0etMgg8svaHK-h4Fap_m8ldGsSaSrU6_BfeM7KKi-dWnPy13ohplE-xjHmOgUW66F3CmgrxCnh0f6aoD" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-xl border border-outline-variant/40 max-w-xs">
              <div className="flex gap-2 mb-2 text-primary">
                {[1,2,3,4,5]?.map(i => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-sm font-medium leading-tight italic">"The most focused study environment I've ever used. No distractions, just pure knowledge."</p>
              <p className="text-xs text-on-surface-variant mt-2">— AIR 42, GATE 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-6 bg-surface-container-low border-y border-outline-variant/10">
        <div className="container mx-auto">
          <div className="mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">A Sanctuary for Deep Work</h2>
            <p className="text-on-surface-variant max-w-xl">We've replaced the cluttered dashboard with a tactile, scholarly interface designed for absolute focus.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notes Card */}
            <div className="md:col-span-2 group relative overflow-hidden bg-surface-container-lowest rounded-xl p-8 hover:bg-primary/5 transition-all duration-500 border border-outline-variant/10">
              <div className="flex justify-between items-start mb-12">
                <div className="p-3 bg-primary-container rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">description</span>
                </div>
                <span className="font-mono text-xs text-outline tracking-widest uppercase">Module 01</span>
              </div>
              <h3 className="font-display text-3xl font-bold mb-4">Curated Notes</h3>
              <p className="font-notes text-lg text-on-surface-variant max-w-md mb-8">
                Every topic is treated like a textbook chapter. Experience high-resolution diagrams and LaTeX-formatted proofs that make complex algorithms intuitive.
              </p>
              <img className="absolute -bottom-10 -right-10 w-64 h-64 object-cover rounded-full opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all" alt="Proofs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL0j1XyDx2gHnG6Dq1t8hMWmZcsIdA82Ceb4nY445KrftIVG0YwAEFKpB4jkxMSwalXk6d4vlvIRkU5RAbLd60NKA_6iVn_nPjk6e7JtSTisjKi_HI7sowu9cSs7V2uNX5DEPs9KTxcX2oJlEsIf-su0UDB-wehzrZS0rTBi72PM5kGHxu_aua8_DdToXQg__dc_FmjMZFW82RbDITUqjvbbIoTjg1j6tzs4elKTfeml6aMLkzyyoSpeJBR9mcYS2FdAt81cSJ9edC" />
            </div>
            
            {/* Practice Card */}
            <div className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10">
              <div className="p-3 bg-secondary-container rounded-lg text-secondary w-fit mb-12">
                <span className="material-symbols-outlined text-3xl">quiz</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Precision Practice</h3>
              <p className="text-on-surface-variant mb-6 text-sm">Real-time simulation of the GATE environment with an editorial aesthetic that reduces test anxiety.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> PYQ Analysis</li>
                <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Virtual Calculator UI</li>
                <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Adaptive Difficulty</li>
              </ul>
            </div>
            
            {/* Skills Card */}
            <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between border border-outline-variant/10">
              <div>
                <div className="p-3 bg-tertiary-container rounded-lg text-tertiary w-fit mb-6">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Skill Mapping</h3>
                <p className="text-on-surface-variant text-sm border-b">Visualize your cognitive strengths across Discrete Math, OS, and Architecture with our proprietary Progress Quill.</p>
              </div>
              <div className="mt-8 h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#b6a0ff] to-[#7e51ff] w-3/4"></div>
              </div>
            </div>
            
            {/* Community Card */}
            <div className="md:col-span-2 bg-inverse-surface text-inverse-on-surface rounded-xl p-8 flex items-center gap-12 border border-outline-variant/10">
              <div className="flex-1">
                <h3 className="font-display text-3xl font-bold mb-4">The Leaderboard</h3>
                <p className="text-surface-variant mb-6">A healthy academic rivalry. Compete with the sharpest minds across the country in weekly mock curators.</p>
                <button className="text-primary-container font-bold inline-flex items-center gap-2">View Rankings <span className="material-symbols-outlined">arrow_forward</span></button>
              </div>
              <div className="hidden sm:flex flex-col gap-2">
                <div className="flex -space-x-4">
                  <img alt="Student 1" className="w-12 h-12 rounded-full border-4 border-inverse-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoGcR1VjTmaAjvxqVYtWYIOFZUUdPjeYfXXizCtSw9CTwHBqFWRAMhCaLfSGs9Sqzqg0PaUsBI2LJdKQqWhvF8uuuiiWXcZ0TlUktN4kNC-xa00d5GuqNQDtmhcZGTLwqLo1QECFK-m2HLpbxRuwdr4p9OxiY-rZXve4aR5RzKapuo3KTlqJeCAKIgdeMX6t_UO9HcbcbZ4zXcdMIGfnvPEL68xYTuGhOVzZkyBm1XfZDVp2MUr-vRN8QDAtbChRZlDcv1DGswpdls" />
                  <img alt="Student 2" className="w-12 h-12 rounded-full border-4 border-inverse-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJqseJlCYbGt_NgMwg8eEqUg4Cl9Q04_cvu44wXutMVVaaSQfz5uUt2ItOG3i_KoV-WWC795FA9TrR8TrrGHocMU6Eh1lLs1riB1c0B7KokdjTrEqth_QEphNDqDZXYXCb-oxnqr4RoZjis21I1wOW4A3FCG8gtnIWKz4JDdFoRPBK1mH7r8Tuaj8ho5u4mfDLFTh_JpmKJXT5f2Bmb9UlQ25Udw-emByxYVkE2-m23RHr3es2wu1OzcEmuUG3_hdW_iyqV6r5jX-W" />
                  <img alt="Student 3" className="w-12 h-12 rounded-full border-4 border-inverse-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU0XRCADpMZVW7GmXzSBDC2AwxhIYeATF3PmgRnVIIFPSygncWU_WYacu50VbfOt_MKO_KKFWMvv0CCjTOoJslYM6Pu_NSed6rFIEL-Tfb7e48TAI442IdMbu5ExuYFJvkvQQSVq1nIZ7TPUyIvgbql_UO0pP8DVp9BAYNWzotyU1f6J_V7_MyWxRPmu98lbhYdYE5T52O9f6EX1KLe9T2W2ChNNmGGeTsokYBvtWdKu7KQCZzSaiofAZUHT2aQ9xgcarboNklEW4x" />
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xs border-4 border-inverse-surface text-white">+4k</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 bg-surface">
        <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <span className="font-display text-2xl font-semibold text-primary mb-6 block">ExamForge</span>
            <p className="text-on-surface-variant text-sm leading-relaxed">Redefining technical education through the lens of aesthetic precision and cognitive clarity.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><button className="hover:text-primary transition-colors">Curriculum</button></li>
              <li><button className="hover:text-primary transition-colors">Study Notes</button></li>
              <li><button className="hover:text-primary transition-colors">Mock Tests</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><button className="hover:text-primary transition-colors">Our Story</button></li>
              <li><button className="hover:text-primary transition-colors">Philosophy</button></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">© 2026 ExamForge. The Digital Curator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
