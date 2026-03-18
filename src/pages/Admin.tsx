import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, X, LogOut, Video, ImageIcon, Palette, FolderPlus, LayoutGrid, Layers } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

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
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
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
    // حماية: كنصيفطو غير الحقول اللي موجودة فالداتاباز حاليا
    const catData: any = { name: newCatName, image_url: newCatImage };
    // إيلا كنتي زدتي name_ar فـ Supabase يدويا غادي تخدم، إيلا لا غانحيدوها باش مايوقعش Error
    if (newCatNameAr) catData.name_ar = newCatNameAr;

    const { error } = editingCatId 
      ? await supabase.from("categories").update(catData).eq("id", editingCatId)
      : await supabase.from("categories").insert([catData]);

    if (!error) {
      setNewCatName(""); setNewCatNameAr(""); setNewCatImage(""); setEditingCatId(null);
      fetchAll(); toast({ title: "Success" });
    } else {
      toast({ title: "Erreur de base de données", variant: "destructive" });
    }
    setLoading(false);
  };

  if (!appReady) return <div className="min-h-screen flex items-center justify-center font-serif italic text-stone-400">Rabab Studio...</div>;

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-6">
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleLogin} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-stone-100 w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="font-serif italic text-2xl text-stone-900 tracking-tighter text-center">Atelier Rabab</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400 text-center">Admin Studio</p>
        </div>
        <div className="space-y-3 pt-4">
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="h-11 rounded-xl bg-stone-50 border-none px-4 text-xs" required />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-11 rounded-xl bg-stone-50 border-none px-4 text-xs" required />
          <Button type="submit" disabled={loading} className="w-full h-12 bg-stone-900 rounded-xl text-[9px] font-black uppercase tracking-[0.3em]">Sign In</Button>
        </div>
      </motion.form>
    </div>
  );

  return (
    <div className="pt-16 pb-16 px-4 max-w-5xl mx-auto font-sans bg-[#fafaf9] min-h-screen">
      <div className="flex items-center justify-between mb-10 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-stone-100 sticky top-4 z-50 shadow-sm">
        <div className="flex gap-1">
          <button onClick={() => setActiveTab("products")} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>
            <LayoutGrid className="w-3 h-3" /> Inventaire
          </button>
          <button onClick={() => setActiveTab("categories")} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>
            <Layers className="w-3 h-3" /> Collections
          </button>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="mr-3 text-stone-300 hover:text-red-500 transition-colors"><LogOut className="w-4 h-4" /></button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" ? (
          <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showForm ? (
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 <button onClick={() => setShowForm(true)} className="aspect-[4/5] border border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center text-stone-300 hover:border-amber-600 hover:text-amber-600 bg-white transition-all group">
                   <Plus className="w-6 h-6 mb-2" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Nouveau Art</span>
                 </button>
                 {products?.map(p => (
                   <div key={p.id} className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden border border-stone-100 group shadow-sm">
                     <img src={p.image_url} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                       <Button size="icon" className="rounded-full w-8 h-8 bg-white text-stone-900" onClick={() => { setForm({...form, ...p}); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3 h-3" /></Button>
                       <Button size="icon" variant="destructive" className="rounded-full w-8 h-8" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                     </div>
                     <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-xl">
                        <p className="text-[8px] font-bold truncate uppercase text-stone-700">{p.title}</p>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
                <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    // حماية البيانات قبل الإرسال لـ Supabase
                    const payload: any = {
                        title: form.title,
                        price: form.price,
                        description: form.description,
                        image_url: form.image_url,
                        category: form.category
                    };
                    // إرسال الحقول الإضافية فقط إذا كانت مدعومة (باش مايوقعش Error 400)
                    if (form.title_ar) payload.title_ar = form.title_ar;
                    if (form.description_ar) payload.description_ar = form.description_ar;
                    if (form.video_url) payload.video_url = form.video_url;
                    if (form.colors?.length > 0) payload.colors = form.colors;
                    if (form.images_gallery?.length > 0) payload.images_gallery = form.images_gallery;

                    const { error } = editingId ? await supabase.from("products").update(payload).eq("id", editingId) : await supabase.from("products").insert([payload]);
                    if (!error) { setShowForm(false); setEditingId(null); fetchAll(); toast({ title: "Enregistré" }); }
                    else { toast({ title: "Database Sync Error", description: "Check columns in Supabase", variant: "destructive" }); }
                    setLoading(false);
                }} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-2xl space-y-8 max-w-4xl mx-auto">
                    <div className="flex justify-between items-center pb-4 border-b border-stone-50">
                        <h2 className="font-serif italic text-2xl text-stone-900">Edition</h2>
                        <button type="button" onClick={() => setShowForm(false)}><X className="w-5 h-5 text-stone-400" /></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label className="text-[9px] font-black uppercase opacity-50">Titre (FR)</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="h-11 rounded-xl bg-stone-50 border-none px-4 text-xs" /></div>
                        <div className="space-y-2 text-right"><Label className="text-[9px] font-black uppercase opacity-50">العنوان (AR)</Label><Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="h-11 rounded-xl bg-stone-50 border-none px-4 text-xs text-right" /></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label className="text-[9px] font-black uppercase opacity-50">Description (FR)</Label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full h-24 p-4 rounded-xl bg-stone-50 border-none text-[11px] resize-none" /></div>
                        <div className="space-y-2 text-right"><Label className="text-[9px] font-black uppercase opacity-50">الوصف (AR)</Label><textarea dir="rtl" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="w-full h-24 p-4 rounded-xl bg-stone-50 border-none text-[11px] text-right resize-none" /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><Label className="text-[9px] font-black uppercase opacity-50">Prix (MAD)</Label><Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="h-11 rounded-xl border border-stone-100 font-bold text-xs" /></div>
                        <div className="space-y-2"><Label className="text-[9px] font-black uppercase opacity-50">Collection</Label>
                            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-11 rounded-xl border border-stone-100 px-3 bg-white text-[10px] uppercase font-bold tracking-wider">
                                <option value="">Choisir</option>
                                {categories?.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-stone-50">
                        <Label className="text-[9px] font-black uppercase opacity-50 flex items-center gap-2 tracking-widest"><Palette className="w-3 h-3" /> Couleurs</Label>
                        <div className="flex gap-2 items-center bg-stone-50 p-1.5 rounded-xl w-fit">
                            <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                            <Input placeholder="Nom" value={newColorName} onChange={e => setNewColorName(e.target.value)} className="border-none bg-transparent h-8 w-24 text-[10px]" />
                            <Button type="button" onClick={() => { if(newColorName) { setForm({...form, colors: [...(form.colors || []), {name: newColorName, hex: newColorHex}]}); setNewColorName(""); } }} className="h-8 w-8 bg-stone-900 rounded-lg"><Plus className="w-3 h-3" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.colors?.map((c, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-stone-100 shadow-sm">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                                    <span className="text-[8px] font-black uppercase text-stone-600">{c.name}</span>
                                    <button type="button" onClick={() => setForm({...form, colors: form.colors.filter((_, i) => i !== idx)})} className="text-red-400 text-[10px]">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-stone-50">
                        <div className="space-y-3">
                            <Label className="text-[9px] font-black uppercase opacity-50 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Visuels</Label>
                            <Input placeholder="URL Image Principale" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="h-10 rounded-lg bg-stone-50 border-none px-4 text-[10px]" />
                            <div className="flex gap-2">
                                <Input placeholder="URL Galerie (+)" value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} className="h-10 rounded-lg bg-stone-50 border-none px-4 text-[10px] flex-1" />
                                <Button type="button" onClick={() => { if(newGalleryUrl) { setForm({...form, images_gallery: [...(form.images_gallery || []), newGalleryUrl]}); setNewGalleryUrl(""); } }} className="h-10 w-10 bg-stone-900 rounded-lg"><Plus className="w-3 h-3" /></Button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[9px] font-black uppercase opacity-50 flex items-center gap-2"><Video className="w-3 h-3" /> Vidéo</Label>
                            <Input placeholder="Lien Vidéo (MP4)" value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="h-10 rounded-lg bg-stone-50 border-none px-4 text-[10px]" />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-14 bg-stone-900 rounded-xl text-[9px] font-black uppercase tracking-[0.4em]">Sauvegarder</Button>
                </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl space-y-6">
              <h2 className="font-serif italic text-xl text-stone-900">{editingCatId ? "Modifier" : "Nouvelle Collection"}</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Nom (FR)" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="h-11 rounded-xl bg-stone-50 border-none px-4 text-xs" required />
                    <Input dir="rtl" placeholder="الاسم (AR)" value={newCatNameAr} onChange={e => setNewCatNameAr(e.target.value)} className="h-11 rounded-xl bg-stone-50 border-none px-4 text-xs text-right" />
                </div>
                <Input placeholder="URL Image" value={newCatImage} onChange={e => setNewCatImage(e.target.value)} className="h-11 rounded-xl bg-stone-50 border-none px-4 text-xs" />
                <Button type="submit" disabled={loading} className="w-full h-12 bg-stone-900 rounded-xl text-[9px] font-black uppercase tracking-widest">
                  {editingCatId ? 'Mettre à jour' : 'Créer'}
                </Button>
              </form>
            </div>

            <div className="grid gap-2">
              {categories?.map((cat) => (
                <div key={cat.id} className="bg-white p-3 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-50 overflow-hidden border border-stone-100">
                      <img src={cat.image_url} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-[9px] uppercase text-stone-800">{cat.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="w-8 h-8 text-stone-300" onClick={() => { setEditingCatId(cat.id); setNewCatName(cat.name); setNewCatNameAr(cat.name_ar || ""); setNewCatImage(cat.image_url || ""); }}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="w-8 h-8 text-stone-300 hover:text-red-500" onClick={async () => { if(confirm('Supprimer?')) { await supabase.from("categories").delete().eq("id", cat.id); fetchAll(); } }}><Trash2 className="w-3.5 h-3.5" /></Button>
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
