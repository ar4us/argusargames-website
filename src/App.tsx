import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Download, Search, PlusCircle, ThumbsUp, ShieldCheck, 
  LogIn, LogOut, CheckCircle2, Clock, Sparkles, Filter, 
  ExternalLink, KeyRound, AlertCircle, RefreshCw, X, ChevronRight,
  Monitor, Layers, Share2, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase, type Localization, type GameRequest } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

// الرمز السري للوحة تحكم المدير (يمكنك تغييره متى شئت)
const ADMIN_SECRET_PIN = "7788";

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'games' | 'requests' | 'about'>('games');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMsg, setAuthMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Data States
  const [games, setGames] = useState<Localization[]>([]);
  const [requests, setRequests] = useState<GameRequest[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');

  // New Request Form
  const [reqTitle, setReqTitle] = useState('');
  const [reqPlatform, setReqPlatform] = useState('PC');
  const [reqNotes, setReqNotes] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);

  // New Game Form (Admin)
  const [newGame, setNewGame] = useState({
    title_ar: '',
    title_en: '',
    slug: '',
    description_ar: '',
    description_en: '',
    cover_url: '',
    download_url: '',
    file_size: '',
    version: 'v1.0.0',
    platforms: ['PC'],
    status: 'complete' as const,
  });
  const [submittingGame, setSubmittingGame] = useState(false);

  // Load Auth & Initial Data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchGames();
    fetchRequests();

    return () => subscription.unsubscribe();
  }, []);

  const fetchGames = async () => {
    setLoadingGames(true);
    const { data, error } = await supabase
      .from('localizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGames(data);
    }
    setLoadingGames(false);
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    const { data, error } = await supabase
      .from('game_requests')
      .select('*')
      .order('upvotes', { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
    setLoadingRequests(false);
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setAuthMsg({ type: 'error', text: error.message });
      setAuthLoading(false);
    }
  };

  // Email/Password Login & Register
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMsg(null);

    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      if (error) {
        setAuthMsg({ type: 'error', text: error.message });
      } else {
        setShowAuthModal(false);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword
      });
      if (error) {
        setAuthMsg({ type: 'error', text: error.message });
      } else {
        setAuthMsg({ type: 'success', text: 'تم إنشاء الحساب! تفقد بريدك لتأكيد الحساب أو سجل الدخول.' });
      }
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Upvote Request
  const handleUpvote = async (reqId: string, currentVotes: number) => {
    const { error } = await supabase
      .from('game_requests')
      .update({ upvotes: currentVotes + 1 })
      .eq('id', reqId);

    if (!error) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      fetchRequests();
    }
  };

  // Submit Game Request
  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    setSubmittingReq(true);
    const { error } = await supabase.from('game_requests').insert({
      game_title: reqTitle.trim(),
      platform: reqPlatform,
      notes: reqNotes.trim(),
      user_email: user?.email || 'مستخدم مسجل',
      user_id: user?.id,
      upvotes: 1
    });

    if (!error) {
      setReqTitle('');
      setReqNotes('');
      confetti({ particleCount: 60, spread: 70 });
      fetchRequests();
    }
    setSubmittingReq(false);
  };

  // Admin PIN Submit
  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === ADMIN_SECRET_PIN) {
      setIsAdminUnlocked(true);
      setAdminPinError(false);
    } else {
      setAdminPinError(true);
    }
  };

  // Add Game from Admin Panel
  const handlePublishGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGame.title_ar || !newGame.download_url) return;

    setSubmittingGame(true);
    const autoSlug = newGame.slug.trim() || newGame.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `game-${Date.now()}`;

    const { error } = await supabase.from('localizations').insert({
      title_ar: newGame.title_ar,
      title_en: newGame.title_en || newGame.title_ar,
      slug: autoSlug,
      description_ar: newGame.description_ar,
      description_en: newGame.description_en,
      cover_url: newGame.cover_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      download_url: newGame.download_url,
      file_size: newGame.file_size || 'غير محدد',
      version: newGame.version,
      platforms: newGame.platforms,
      status: newGame.status
    });

    if (!error) {
      confetti({ particleCount: 100, spread: 90 });
      setNewGame({
        title_ar: '',
        title_en: '',
        slug: '',
        description_ar: '',
        description_en: '',
        cover_url: '',
        download_url: '',
        file_size: '',
        version: 'v1.0.0',
        platforms: ['PC'],
        status: 'complete',
      });
      fetchGames();
      setShowAdminModal(false);
    } else {
      alert(`خطأ أثناء النشر: ${error.message}`);
    }
    setSubmittingGame(false);
  };

  // Filtered Games
  const filteredGames = games.filter(g => {
    const matchesSearch = g.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.title_en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'ALL' || g.platforms.includes(platformFilter);
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#06060c] text-slate-100 selection:bg-[#7c5cfc]/30 selection:text-[#f0b429]">
      
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#18182f]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('games')}>
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7c5cfc] via-[#6344e6] to-[#f0b429] p-0.5 glow-primary">
              <div className="w-full h-full bg-[#0d0d1a] rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-[#f0b429]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-cairo">بالعربي</span>
                <span className="text-xs uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#7c5cfc]/20 text-[#a78bfa] font-mono font-bold">Games</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">منصة تعريب الألعاب الاحترافية</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0e0e1f]/60 p-1.5 rounded-2xl border border-[#20203f]/60">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'games' 
                  ? 'bg-[#7c5cfc] text-white shadow-lg shadow-[#7c5cfc]/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              التعريبات المتوفرة
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'requests' 
                  ? 'bg-[#7c5cfc] text-white shadow-lg shadow-[#7c5cfc]/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#f0b429]" />
              طلب تعريب لعبة
              {requests.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-[#f0b429] text-black rounded-full font-bold">
                  {requests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === 'about' 
                  ? 'bg-[#7c5cfc] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              عن المنصة
            </button>
          </nav>

          {/* Actions & User Profile */}
          <div className="flex items-center gap-3">
            {/* Secret Admin Button */}
            <button
              onClick={() => setShowAdminModal(true)}
              title="لوحة الإدارة السريعة"
              className="p-2.5 rounded-xl border border-[#26264d] text-slate-400 hover:text-[#f0b429] hover:border-[#f0b429]/50 hover:bg-[#f0b429]/10 transition-all duration-200"
            >
              <KeyRound className="w-5 h-5" />
            </button>

            {/* User Session */}
            {user ? (
              <div className="flex items-center gap-2 bg-[#121226] border border-[#252549] p-1.5 ps-3 rounded-2xl">
                <span className="text-xs font-bold text-slate-300 max-w-[120px] truncate">
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="p-1.5 rounded-xl hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6344e6] text-white text-sm font-bold shadow-md shadow-[#7c5cfc]/20 hover:brightness-110 transition flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول / تسجيل</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1">

        {/* ── View 1: Localizations List ── */}
        {activeTab === 'games' && (
          <div>
            {/* Cinematic Hero */}
            <section className="relative overflow-hidden pt-12 pb-16 border-b border-[#16162d]">
              {/* Glow background effects */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#7c5cfc]/20 via-[#6344e6]/10 to-[#f0b429]/15 blur-[120px] pointer-events-none rounded-full" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7c5cfc]/15 border border-[#7c5cfc]/30 text-xs font-bold text-[#c4b5fd] mb-6">
                  <Sparkles className="w-4 h-4 text-[#f0b429]" />
                  <span>تحديثات مستمرة وتنزيل مباشر فائق السرعة عبر خوادم R2</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                  عِش تجربة الألعاب العالمية <br />
                  <span className="bg-gradient-to-r from-[#a78bfa] via-[#7c5cfc] to-[#f0b429] bg-clip-text text-transparent">
                    بلغتك العربية الفصحى
                  </span>
                </h1>

                <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-medium leading-relaxed mb-8">
                  تعريبات احترافية متكاملة للحوارات، القوائم، والمستندات. نقوم بكسر حاجز اللغة لنمنحك التجربة القصصية الكاملة كما أرادها مطورو اللعبة.
                </p>

                {/* Search & Filter Bar */}
                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 p-2 bg-[#0e0e1f]/90 border border-[#26264d] rounded-2xl shadow-2xl">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="ابحث عن لعبة أو تعريب..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#14142b] border border-[#232344] rounded-xl pr-12 pl-4 py-3 text-sm text-white focus:outline-none focus:border-[#7c5cfc] transition"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {['ALL', 'PC'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatformFilter(p)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                          platformFilter === p 
                            ? 'bg-[#7c5cfc] text-white' 
                            : 'bg-[#14142b] text-slate-400 hover:text-white border border-[#232344]'
                        }`}
                      >
                        {p === 'ALL' ? 'جميع المنصات' : p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Games Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-[#7c5cfc]" />
                    التعريبات المتاحة للتحميل
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {filteredGames.length} تعريب متاح حالياً للتحميل المباشر
                  </p>
                </div>
              </div>

              {loadingGames ? (
                <div className="py-24 text-center">
                  <RefreshCw className="w-8 h-8 text-[#7c5cfc] animate-spin mx-auto mb-3" />
                  <p className="text-sm text-slate-400">جاري تحميل أحدث التعريبات من السيرفر...</p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="py-20 text-center glass-panel rounded-3xl p-8 border border-[#1f1f3d]">
                  <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-300">لم يتم العثور على ألعاب مطابقة</h3>
                  <p className="text-sm text-slate-500 mt-1">جرّب البحث باسم آخر أو اطلب اللعبة في قسم الطلبات!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredGames.map((game) => (
                    <article 
                      key={game.id} 
                      className="group relative rounded-3xl overflow-hidden bg-[#0d0d1b] border border-[#1f1f3d] hover:border-[#7c5cfc]/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-[#7c5cfc]/10"
                    >
                      {/* Cover Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#16162a]">
                        <img 
                          src={game.cover_url} 
                          alt={game.title_ar} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1b] via-[#0d0d1b]/40 to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
                            {game.version}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-slate-300 text-xs font-bold">
                            {game.file_size}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {game.platforms.map(p => (
                              <span key={p} className="text-[11px] font-bold text-[#f0b429] bg-[#f0b429]/10 px-2 py-0.5 rounded border border-[#f0b429]/20">
                                {p}
                              </span>
                            ))}
                            <span className="text-[11px] text-slate-400 font-mono">
                              بواسطة: {game.translator}
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-white group-hover:text-[#a78bfa] transition mb-1">
                            {game.title_ar}
                          </h3>
                          <p className="text-xs text-slate-400 font-mono mb-3">
                            {game.title_en}
                          </p>
                          <p className="text-sm text-slate-300/90 leading-relaxed line-clamp-3 mb-6">
                            {game.description_ar}
                          </p>
                        </div>

                        {/* Download CTA */}
                        <div className="pt-4 border-t border-[#1c1c38] flex items-center gap-3">
                          <a
                            href={game.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6344e6] hover:from-[#6d4ee3] hover:to-[#5536d4] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#7c5cfc]/20 hover:shadow-[#7c5cfc]/30 transition"
                          >
                            <Download className="w-4 h-4" />
                            <span>تحميل التعريب المباشر</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ── View 2: Game Requests ── */}
        {activeTab === 'requests' && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
              <span className="px-3.5 py-1 rounded-full bg-[#f0b429]/15 border border-[#f0b429]/30 text-xs font-bold text-[#f0b429] mb-3 inline-block">
                صوت مجتمع اللاعبين
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                طلب تعريب لعبة جديدة
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                اطلب اللعبة التي تتمنى رؤيتها باللغة العربية، أو صوّت للألعاب المقترحة لنبدأ العمل على الأكثر طلباً!
              </p>
            </div>

            {/* Request Submission Form */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#252549] mb-12">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#7c5cfc]" />
                أضف طلبك الآن
              </h3>
              <form onSubmit={handleAddRequest} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم اللعبة *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: Alan Wake 2, Clair Obscur: Expedition 33..."
                      value={reqTitle}
                      onChange={(e) => setReqTitle(e.target.value)}
                      className="w-full bg-[#121226] border border-[#26264d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">المنصة</label>
                    <select
                      value={reqPlatform}
                      onChange={(e) => setReqPlatform(e.target.value)}
                      className="w-full bg-[#121226] border border-[#26264d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                    >
                      <option value="PC">PC (Steam/Epic)</option>
                      <option value="PS5">PlayStation 5</option>
                      <option value="Switch">Nintendo Switch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ملاحظات إضافية (اختياري)</label>
                  <input
                    type="text"
                    placeholder="أي تفاصيل حول المحرك، نوع اللعبة، أو رغبتك في المساعدة..."
                    value={reqNotes}
                    onChange={(e) => setReqNotes(e.target.value)}
                    className="w-full bg-[#121226] border border-[#26264d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-slate-500">
                    {user ? `سيتم النشر باسم: ${user.email}` : 'يمكنك الإرسال مباشرة كعضو في المجتمع'}
                  </p>
                  <button
                    type="submit"
                    disabled={submittingReq || !reqTitle.trim()}
                    className="px-6 py-2.5 rounded-xl bg-[#7c5cfc] hover:bg-[#6846ea] disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 transition"
                  >
                    {submittingReq ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    إرسال الطلب
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Requests List */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-[#f0b429]" />
                أكثر الألعاب المطلوبة ({requests.length})
              </h3>

              {loadingRequests ? (
                <div className="py-12 text-center text-slate-500">جاري جلب الطلبات...</div>
              ) : requests.length === 0 ? (
                <p className="text-center text-slate-500 py-12">لا توجد طلبات بعد. كن أول من يطلب لعبة!</p>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div 
                      key={req.id} 
                      className="glass-panel rounded-2xl p-4 sm:p-5 border border-[#222244] flex items-center justify-between gap-4 hover:border-[#7c5cfc]/30 transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-white">{req.game_title}</h4>
                          <span className="text-[10px] font-bold text-[#f0b429] bg-[#f0b429]/10 px-2 py-0.5 rounded border border-[#f0b429]/20">
                            {req.platform}
                          </span>
                        </div>
                        {req.notes && <p className="text-xs text-slate-400 mb-1">{req.notes}</p>}
                        <span className="text-[10px] text-slate-500 font-mono">
                          بواسطة: {req.user_email || 'عضو في المجتمع'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleUpvote(req.id, req.upvotes)}
                        className="flex flex-col items-center justify-center min-w-[64px] py-2 px-3 rounded-xl bg-[#14142b] border border-[#272750] hover:bg-[#7c5cfc]/20 hover:border-[#7c5cfc] hover:text-[#c4b5fd] transition group"
                      >
                        <ThumbsUp className="w-4 h-4 text-[#f0b429] group-hover:scale-110 transition" />
                        <span className="text-xs font-black mt-1 font-mono">{req.upvotes}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── View 3: About ── */}
        {activeTab === 'about' && (
          <section className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#7c5cfc] to-[#f0b429] p-0.5 mx-auto mb-6 glow-primary">
              <div className="w-full h-full bg-[#0d0d1b] rounded-[22px] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#f0b429]" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">عن منصة بالعربي Games</h2>
            <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              مشروع تقني ولغوي غير ربحي يهدف إلى ترجمة وتوطين ألعاب الفيديو التي لا تحظى بدعم رسمي للغة العربية، مع الحفاظ على أصالة الحوارات وأجواء القصة كما تصورها المخرجون الأصليون.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-right">
              <div className="glass-panel p-6 rounded-2xl border border-[#202040]">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="font-bold text-white mb-1">دقة لغوية واحترافية</h4>
                <p className="text-xs text-slate-400">فصحى معاصرة رصينة تراعي السياق الدرامي وتفاصيل الشخصيات.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-[#202040]">
                <Monitor className="w-6 h-6 text-[#7c5cfc] mb-3" />
                <h4 className="font-bold text-white mb-1">تثبيت سهل ومباشر</h4>
                <p className="text-xs text-slate-400">ملفات تعريب منظمة مع شروحات تركيب خطوة بخطوة لكل لعبة.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-[#202040]">
                <Heart className="w-6 h-6 text-rose-400 mb-3" />
                <h4 className="font-bold text-white mb-1">مجاني للجميع دائماً</h4>
                <p className="text-xs text-slate-400">تنزيل مباشر دون إعلانات مزعجة أو روابط مشبوهة عبر Cloudflare R2.</p>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#16162d] py-10 bg-[#05050a] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-black text-white text-lg">بالعربي Games</span>
            <span className="text-xs text-slate-500">© {new Date().getFullYear()} — جميع الحقوق محفوظة</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <a href="https://discord.gg/argus" target="_blank" rel="noreferrer" className="hover:text-white transition">Discord</a>
            <span>•</span>
            <a href="https://reddit.com" target="_blank" rel="noreferrer" className="hover:text-white transition">Reddit</a>
            <span>•</span>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white transition">TikTok</a>
            <span>•</span>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition">Instagram</a>
          </div>
        </div>
      </footer>

      {/* ── Modal: Auth (Login/Signup) ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e0e1f] border border-[#26264d] rounded-3xl p-6 sm:p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 left-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-white mb-2">
              {authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              سجل الدخول للمشاركة في طلبات التعريب والتصويت على ألعابك المفضلة.
            </p>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition mb-6 shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>متابعة بحساب Google</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#26264d]" />
              <span className="text-xs text-slate-500 font-mono">أو بالبريد الإلكتروني</span>
              <div className="flex-1 h-px bg-[#26264d]" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#14142b] border border-[#272750] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#14142b] border border-[#272750] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              {authMsg && (
                <div className={`p-3 rounded-xl text-xs ${authMsg.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {authMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-[#7c5cfc] hover:bg-[#6846ea] text-white font-bold text-sm transition"
              >
                {authLoading ? 'جاري المعالجة...' : authMode === 'login' ? 'دخول' : 'إنشاء حساب'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              {authMode === 'login' ? (
                <p>
                  ليس لديك حساب؟{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-[#a78bfa] font-bold hover:underline">
                    أنشئ حساباً جديداً
                  </button>
                </p>
              ) : (
                <p>
                  لديك حساب بالفعل؟{' '}
                  <button onClick={() => setAuthMode('login')} className="text-[#a78bfa] font-bold hover:underline">
                    تسجيل الدخول
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Hidden Admin Vault ── */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0c0c18] border border-[#2c2c54] rounded-3xl p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => {
                setShowAdminModal(false);
                setIsAdminUnlocked(false);
                setAdminPinInput('');
              }}
              className="absolute top-5 left-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            {!isAdminUnlocked ? (
              // PIN Verification Screen
              <div className="py-8 text-center max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-[#f0b429]">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-white mb-1">لوحة تحكم المشرف (Admin Vault)</h3>
                <p className="text-xs text-slate-400 mb-6">أدخل الرمز السري الخاص بالمدير للوصول لإضافة التعريبات</p>

                <form onSubmit={handleVerifyAdminPin} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      autoFocus
                      placeholder="أدخل الرمز السري (PIN)..."
                      value={adminPinInput}
                      onChange={(e) => setAdminPinInput(e.target.value)}
                      className="w-full bg-[#141428] border border-[#2d2d52] rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-[#7c5cfc]"
                    />
                    {adminPinError && (
                      <p className="text-xs text-rose-400 mt-2 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        الرمز السري غير صحيح!
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6344e6] text-white font-bold text-sm shadow-lg shadow-[#7c5cfc]/20 hover:brightness-110 transition"
                  >
                    فتح لوحة الإدارة
                  </button>
                  <p className="text-[11px] text-slate-500">الرمز الافتراضي: 7788</p>
                </form>
              </div>
            ) : (
              // Admin Panel Form (Add New Game)
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#202040]">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">إضافة تعريب لعبة جديد</h3>
                    <p className="text-xs text-slate-400">سينشر التعريب فوراً في قاعدة البيانات ويظهر للزوار دون لمس Git!</p>
                  </div>
                </div>

                <form onSubmit={handlePublishGame} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">اسم اللعبة بالعربي *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثلاً: ريزدنت إيفل 4"
                        value={newGame.title_ar}
                        onChange={(e) => setNewGame({ ...newGame, title_ar: e.target.value })}
                        className="w-full bg-[#141428] border border-[#26264d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">اسم اللعبة بالإنجليزي *</label>
                      <input
                        type="text"
                        required
                        placeholder="Resident Evil 4"
                        value={newGame.title_en}
                        onChange={(e) => setNewGame({ ...newGame, title_en: e.target.value })}
                        className="w-full bg-[#141428] border border-[#26264d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">رابط صورة الغلاف (Cover URL) *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://files.argusargames.com/cover.jpg"
                        value={newGame.cover_url}
                        onChange={(e) => setNewGame({ ...newGame, cover_url: e.target.value })}
                        className="w-full bg-[#141428] border border-[#26264d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">رابط تحميل ملف التعريب (R2 URL) *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://files.argusargames.com/patch.rar"
                        value={newGame.download_url}
                        onChange={(e) => setNewGame({ ...newGame, download_url: e.target.value })}
                        className="w-full bg-[#141428] border border-[#26264d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">حجم الملف</label>
                      <input
                        type="text"
                        placeholder="مثلاً: 120 MB"
                        value={newGame.file_size}
                        onChange={(e) => setNewGame({ ...newGame, file_size: e.target.value })}
                        className="w-full bg-[#141428] border border-[#26264d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">رقم الإصدار</label>
                      <input
                        type="text"
                        placeholder="v1.0.0"
                        value={newGame.version}
                        onChange={(e) => setNewGame({ ...newGame, version: e.target.value })}
                        className="w-full bg-[#141428] border border-[#26264d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">المعرف (Slug)</label>
                      <input
                        type="text"
                        placeholder="resident-evil-4 (تلقائي)"
                        value={newGame.slug}
                        onChange={(e) => setNewGame({ ...newGame, slug: e.target.value })}
                        className="w-full bg-[#141428] border border-[#26264d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">وصف التعريب *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="اكتب وصفاً للتعريب والميزات المتوفرة..."
                      value={newGame.description_ar}
                      onChange={(e) => setNewGame({ ...newGame, description_ar: e.target.value })}
                      className="w-full bg-[#141428] border border-[#26264d] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c5cfc]"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAdminModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-[#2d2d52] text-slate-300 text-sm hover:bg-white/5 transition"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={submittingGame}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                    >
                      {submittingGame ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                      نشر التعريب فوراً
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
