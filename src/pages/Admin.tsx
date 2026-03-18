import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, X, LogOut, Video, ImageIcon, Palette, LayoutGrid, Layers, ExternalLink } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [appReady, setAppReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#C5A059");

  const [newCatName, setNewCatName] = useState("");
  const [newCatNameAr, setNewCatNameAr] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "", title_ar: "", price: "", description: "", description_ar: "",
    image_url: "", category: "", images_gallery: [] as string[],
    video_url: "", colors: [] as { name: string, hex: string }[]
  });

  // هاد الجزء كيحيد الـ Navbar ديال الموقع فاش كتدخل للـ Admin
  useEffect(() => {
    const navbar = document.querySelector('nav'); // أو الكلاس ديالها مثلاً '.navbar'
    if (navbar) navbar.style.display = 'none';
    
    return () => {
      if (navbar) navbar.style.display = 'flex'; // كترجع فاش كتخرج من الصفحة
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAppReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchAll = async () => {
    try {
      const { data: pData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      const { data: cData } = await supabase.from("categories").select("*").order("name", { ascending: true });
      setProducts(pData || []);
      setCategories(cData || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { if (session) fetchAll(); }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Accès refusé", variant: "destructive" });
    setLoading(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const catData: any = { name: newCatName, image_url: newCatImage };
    if (newCatNameAr) catData.name_ar = newCatNameAr;
    const { error } = editingCatId ? await supabase.from("categories").update(catData).eq("id", editingCatId) : await supabase.from("categories").insert([catData]);
    if (!error) { setNewCatName(""); setNewCatNameAr(""); setNewCatImage(""); setEditingCatId(null); fetchAll(); toast({ title: "Success" }); }
    setLoading(false);
  };

  if (!appReady) return <div className="min-h-screen flex items-center justify-center font-serif italic text-stone-400">Rabab Studio...</div>;

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-6">
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleLogin} className="bg-white p-6 rounded-[1.5rem] shadow-2xl border border-stone-100 w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="font-serif italic text-xl text-stone-900 tracking-tighter">Atelier Rabab</h1>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-400">Admin Studio</p>
        </div>
        <div className="space-y-2 pt-2">
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="h-10 rounded-lg bg-stone-50 border-none px-4 text-xs" required />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-10 rounded-lg bg-stone-50 border-none px-4 text-xs" required />
          <Button type="submit" disabled={loading} className="w-full h-10 bg-stone-900 rounded-lg text-[8px] font-black uppercase tracking-[0.3em]">Sign In</Button>
        </div>
      </motion.form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-4 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-stone-100">
          <Link to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-stone-500 hover:text-stone-900 transition-all shadow-sm">
            <ExternalLink className="w-3 h-3" />
            <span className="text-[7px] font-black uppercase tracking-widest">View Site</span>
          </Link>

          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab("products")} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
              <LayoutGrid className="w-3 h-3" /> Inventaire
            </button>
            <button onClick={() => setActiveTab("categories")} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
              <Layers className="w-3 h-3" /> Collections
            </button>
          </div>

          <button onClick={() => supabase.auth.signOut()} className="p-2 text-stone-300 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "products" ? (
            <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!showForm ? (
                 /* تصغير الصور: يولي عندنا 3 فكل سطر فالموبايل و 5 فالديكستوب */
                 <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                   <button onClick={() => { setEditingId(null); setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "", images_gallery: [], video_url: "", colors: [] }); setShowForm(true); }} className="aspect-[4/5] border border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-300 bg-white hover:border-stone-400 transition-all">
                     <Plus className="w-5 h-5 mb-1" />
                     <span className="text-[6px] font-black uppercase tracking-widest text-center">Nouveau Art</span>
                   </button>
                   {products?.map(p => (
                     <div key={p.id} className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-stone-50 shadow-sm group">
                       <img src={p.image_url} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all backdrop-blur-[1px]">
                         <Button size="icon" className="w-7 h-7 rounded-full bg-white text-stone-900" onClick={() => { setForm({...p, images_gallery: p.images_gallery || []}); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3 h-3" /></Button>
                         <Button size="icon" variant="destructive" className="w-7 h-7 rounded-full" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                       </div>
                       <div className="absolute bottom-1 left-1 right-1 bg-white/80 backdrop-blur-md p-1 rounded-lg">
                          <p className="text-[6px] font-bold truncate uppercase text-stone-800 tracking-tighter">{p.title}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              ) : (
                  <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={async (e) => {
                      e.preventDefault();
                      setLoading(true);
                      const payload: any = { title: form.title, price: form.price, description: form.description, image_url: form.image_url, category: form.category };
                      if (form.title_ar) payload.title_ar = form.title_ar;
                      if (form.description_ar) payload.description_ar = form.description_ar;
                      if (form.video_url) payload.video_url = form.video_url;
                      if (form.colors?.length > 0) payload.colors = form.colors;
                      payload.images_gallery = form.images_gallery.filter(url => url.trim() !== "");

                      const { error } = editingId ? await supabase.from("products").update(payload).eq("id", editingId) : await supabase.from("products").insert([payload]);
                      if (!error) { setShowForm(false); setEditingId(null); fetchAll(); toast({ title: "Enregistré" }); }
                      setLoading(false);
                  }} className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-xl space-y-4 max-w-3xl mx-auto">
                      <div className="flex justify-between items-center pb-2 border-b border-stone-50">
                          <h2 className="font-serif italic text-lg text-stone-900">Edition</h2>
                          <button type="button" onClick={() => setShowForm(false)}><X className="w-4 h-4 text-stone-400" /></button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1"><Label className="text-[8px] font-black uppercase opacity-40">Titre (FR)</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px]" /></div>
                          <div className="space-y-1 text-right"><Label className="text-[8px] font-black uppercase opacity-40">العنوان (AR)</Label><Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px]" /></div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label className="text-[8px] font-black uppercase opacity-40">Prix (MAD)</Label><Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="h-9 rounded-lg border border-stone-100 font-bold text-[10px]" /></div>
                          <div className="space-y-1"><Label className="text-[8px] font-black uppercase opacity-40">Collection</Label>
                              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-9 rounded-lg border border-stone-100 px-2 bg-white text-[9px] uppercase font-bold">
                                  <option value="">Choisir</option>
                                  {categories?.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                              </select>
                          </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-50">
                          <Label className="text-[8px] font-black uppercase opacity-40 flex items-center gap-2"><Palette className="w-3 h-3" /> Couleurs</Label>
                          <div className="flex gap-2 items-center bg-stone-50 p-1 rounded-lg w-fit">
                              <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-6 h-6 rounded border-none bg-transparent" />
                              <Input placeholder="Nom" value={newColorName} onChange={e => setNewColorName(e.target.value)} className="border-none bg-transparent h-6 w-20 text-[9px]" />
                              <Button type="button" onClick={() => { if(newColorName) { setForm({...form, colors: [...(form.colors || []), {name: newColorName, hex: newColorHex}]}); setNewColorName(""); } }} className="h-6 w-6 bg-stone-900 rounded"><Plus className="w-3 h-3 text-white" /></Button>
                          </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full h-10 bg-stone-900 rounded-xl text-[8px] font-black uppercase tracking-[0.4em]">Sauvegarder</Button>
                  </motion.form>
              )}
            </motion.div>
          ) : (
            <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-lg space-y-3">
                <h2 className="font-serif italic text-base text-stone-900">Nouvelle Collection</h2>
                <form onSubmit={handleAddCategory} className="space-y-3">
                    <Input placeholder="Nom (FR)" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px]" required />
                    <Input placeholder="URL Image" value={newCatImage} onChange={e => setNewCatImage(e.target.value)} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px]" />
                    <Button type="submit" disabled={loading} className="w-full h-9 bg-stone-900 rounded-lg text-[7px] font-black uppercase tracking-widest">{editingCatId ? 'Update' : 'Créer'}</Button>
                </form>
              </div>

              <div className="grid gap-1.5">
                {categories?.map((cat) => (
                  <div key={cat.id} className="bg-white p-2 rounded-xl border border-stone-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 overflow-hidden"><img src={cat.image_url} className="w-full h-full object-cover" /></div>
                      <span className="font-bold text-[8px] uppercase text-stone-800">{cat.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="w-7 h-7 text-stone-300" onClick={() => { setEditingCatId(cat.id); setNewCatName(cat.name); setNewCatImage(cat.image_url || ""); }}><Pencil className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="w-7 h-7 text-stone-300 hover:text-red-500" onClick={async () => { if(confirm('Supprimer?')) { await supabase.from("categories").delete().eq("id", cat.id); fetchAll(); } }}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
