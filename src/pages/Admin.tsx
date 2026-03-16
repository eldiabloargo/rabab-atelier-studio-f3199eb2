import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, X, LogOut, Video, FileText, LayoutGrid, Save, Lock } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [appReady, setAppReady] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Data State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const { toast } = useToast();

  // Forms State
  const [catForm, setCatForm] = useState({ name: "", image_url: "" });
  const [form, setForm] = useState({
    title: "", title_ar: "", price: "", description: "", description_ar: "",
    image_url: "", category: "", images_gallery: [] as string[],
    video_url: "", colors: [] as any[]
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAppReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchAll = async () => {
    try {
      const { data: pData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      const { data: cData } = await supabase.from("categories").select("*").order("name", { ascending: true });
      setProducts(pData || []);
      setCategories(cData || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { if (session) fetchAll(); }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erreur d'accès", description: "Email ou mot de passe incorrect", variant: "destructive" });
    } else {
      toast({ title: "Bienvenue Hamza" });
    }
    setLoading(false);
  };

  if (!appReady) return <div className="p-20 text-center font-serif italic">Chargement du Studio...</div>;

  // ايلا ماكانش الساروت، كايطلع هاد الفورم
  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif italic text-2xl">Atelier Rabab Studio</h1>
          <p className="text-stone-400 text-xs mt-2 uppercase tracking-widest font-bold">Accès Réservé</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase ml-2 opacity-50">Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-2xl h-12 bg-stone-50 border-none" required />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase ml-2 opacity-50">Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-2xl h-12 bg-stone-50 border-none" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 bg-stone-900 rounded-2xl mt-4">
            {loading ? "Connexion..." : "Ouvrir le Studio"}
          </Button>
        </form>
      </motion.div>
    </div>
  );

  // الكود ديال الـ Admin اللي كان خدام قبل
  return (
    <div className="pt-28 pb-12 px-4 max-w-5xl mx-auto min-h-screen font-sans">
      <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-3xl border border-stone-100 shadow-sm">
        <div className="flex gap-6 ml-4">
          <button onClick={() => setActiveTab("products")} className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTab === 'products' ? 'text-amber-700' : 'text-stone-400'}`}>Inventaire</button>
          <button onClick={() => setActiveTab("categories")} className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTab === 'categories' ? 'text-amber-700' : 'text-stone-400'}`}>Collections</button>
        </div>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="text-stone-300"><LogOut className="w-4 h-4" /></Button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" ? (
          <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showForm ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => setShowForm(true)} className="aspect-square border-2 border-dashed border-stone-200 rounded-[2rem] flex flex-col items-center justify-center text-stone-300 hover:border-amber-500 hover:text-amber-500 transition-all">
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Nouveau</span>
                </button>
                {products.map(p => (
                  <div key={p.id} className="relative group aspect-square bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-sm">
                    <img src={p.image_url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                      <Button size="icon" variant="secondary" className="rounded-full" onClick={() => { setForm(p); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3 h-3" /></Button>
                      <Button size="icon" variant="destructive" className="rounded-full" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const { error } = editingId 
                  ? await supabase.from("products").update(form).eq("id", editingId)
                  : await supabase.from("products").insert([form]);
                if (!error) {
                  setShowForm(false); setEditingId(null);
                  setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "", images_gallery: [], video_url: "", colors: [] });
                  fetchAll();
                  toast({ title: "Produit enregistré" });
                }
                setLoading(false);
              }} className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif italic text-2xl text-stone-800">Édition Studio</h2>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}><X /></button>
                </div>
                {/* Inputs grid... */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold">Titre (FR)</Label>
                        <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-2xl bg-stone-50 border-none" />
                      </div>
                      <div className="space-y-2 text-right">
                        <Label className="text-[9px] font-bold">العنوان (AR)</Label>
                        <Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="rounded-2xl bg-stone-50 border-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold flex items-center gap-2"><FileText className="w-3 h-3" /> Description (FR)</Label>
                      <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full min-h-[100px] p-4 rounded-2xl bg-stone-50 border-none text-sm" />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label className="text-[9px] font-bold flex flex-row-reverse items-center gap-2">الوصف (AR)</Label>
                      <textarea dir="rtl" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="w-full min-h-[100px] p-4 rounded-2xl bg-stone-50 border-none text-sm" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-[9px] font-bold">Prix</Label><Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="rounded-2xl h-12" /></div>
                      <div className="space-y-2"><Label className="text-[9px] font-bold">Collection</Label>
                        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-12 rounded-2xl border-stone-100 bg-white px-4 text-xs">
                          <option value="">Sélectionner</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold flex items-center gap-2"><Video className="w-3 h-3" /> Vidéo URL</Label>
                      <Input value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-2xl bg-stone-50 border-none h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold">Couverture URL</Label>
                      <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-2xl border-stone-100 h-12" />
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-14 bg-stone-900 rounded-2xl uppercase font-black tracking-[0.3em]">
                  {loading ? 'Traitement...' : 'Enregistrer'}
                </Button>
              </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg space-y-6">
              <h2 className="font-serif italic text-xl flex items-center gap-2"><LayoutGrid className="w-5 h-5" /> Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Nom" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="rounded-xl h-12" />
                <div className="flex gap-2">
                  <Input placeholder="Image URL" value={catForm.image_url} onChange={e => setCatForm({...catForm, image_url: e.target.value})} className="rounded-xl h-12 flex-1" />
                  <Button onClick={async () => {
                    const { error } = editingCatId ? await supabase.from("categories").update(catForm).eq("id", editingCatId) : await supabase.from("categories").insert([catForm]);
                    if(!error) { setCatForm({name: "", image_url: ""}); setEditingCatId(null); fetchAll(); }
                  }} className="bg-stone-900 h-12 rounded-xl">
                    {editingCatId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-50 shadow-sm group">
                  <div className="flex items-center gap-4">
                    <img src={c.image_url || "/placeholder.svg"} className="w-12 h-12 rounded-full object-cover shadow-inner" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">{c.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full text-stone-300" onClick={() => { setCatForm({ name: c.name, image_url: c.image_url }); setEditingCatId(c.id); }}><Pencil className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-stone-300" onClick={() => { if(confirm('Supprimer?')) supabase.from("categories").delete().eq("id", c.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
