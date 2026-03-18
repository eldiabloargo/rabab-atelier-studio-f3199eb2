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
    <div className="pt-8 pb-8 px-4 max-w-5xl mx-auto font-sans bg-[#fafaf9] min-h-screen">
      <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-md p-1.5 rounded-xl border border-stone-100 sticky top-4 z-50 shadow-sm">
        <div className="flex gap-1">
          <button onClick={() => setActiveTab("products")} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>
            <LayoutGrid className="w-3 h-3" /> Inventaire
          </button>
          <button onClick={() => setActiveTab("categories")} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>
            <Layers className="w-3 h-3" /> Collections
          </button>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="mr-2 text-stone-300 hover:text-red-500 transition-colors"><LogOut className="w-3.5 h-3.5" /></button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" ? (
          <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showForm ? (
               <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                 <button onClick={() => { setEditingId(null); setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "", images_gallery: [], video_url: "", colors: [] }); setShowForm(true); }} className="aspect-[4/5] border border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-300 hover:border-amber-600 hover:text-amber-600 bg-white transition-all">
                   <Plus className="w-5 h-5 mb-1" />
                   <span className="text-[7px] font-black uppercase tracking-widest">Nouveau Art</span>
                 </button>
                 {products?.map(p => (
                   <div key={p.id} className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-stone-50 group shadow-sm">
                     <img src={p.image_url} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-all">
                       <Button size="icon" className="rounded-full w-7 h-7 bg-white text-stone-900" onClick={() => { setForm({...p, images_gallery: p.images_gallery || []}); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3 h-3" /></Button>
                       <Button size="icon" variant="destructive" className="rounded-full w-7 h-7" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                     </div>
                     <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-lg">
                        <p className="text-[7px] font-bold truncate uppercase text-stone-700">{p.title}</p>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
                <motion.form initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} onSubmit={async (e) => {
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
                }} className="bg-white p-5 rounded-[1.5rem] border border-stone-100 shadow-xl space-y-4 max-w-3xl mx-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-stone-50">
                        <h2 className="font-serif italic text-lg text-stone-900">Edition</h2>
                        <button type="button" onClick={() => setShowForm(false)}><X className="w-4 h-4 text-stone-400" /></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-1"><Label className="text-[8px] font-black uppercase opacity-40">Titre (FR)</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px]" /></div>
                        <div className="space-y-1 text-right"><Label className="text-[8px] font-black uppercase opacity-40">العنوان (AR)</Label><Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px]" /></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-1"><Label className="text-[8px] font-black uppercase opacity-40">Description (FR)</Label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full h-16 p-3 rounded-lg bg-stone-50 border-none text-[10px] resize-none" /></div>
                        <div className="space-y-1 text-right"><Label className="text-[8px] font-black uppercase opacity-40">الوصف (AR)</Label><textarea dir="rtl" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="w-full h-16 p-3 rounded-lg bg-stone-50 border-none text-[10px] text-right resize-none" /></div>
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
                        <div className="flex flex-wrap gap-1.5">
                            {form.colors?.map((c, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-md border border-stone-100 shadow-sm text-[8px] font-black uppercase text-stone-600">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }} />
                                    <span>{c.name}</span>
                                    <button type="button" onClick={() => setForm({...form, colors: form.colors.filter((_, i) => i !== idx)})} className="text-red-400">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-stone-50">
                        <div className="space-y-2">
                            <Label className="text-[8px] font-black uppercase opacity-40 flex items-center gap-1.5"><ImageIcon className="w-3 h-3" /> Visuels</Label>
                            <Input placeholder="Image Principale" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="h-8 rounded-md bg-stone-50 border-none px-3 text-[9px]" />
                            <div className="space-y-1.5">
                                {form.images_gallery?.map((url, index) => (
                                    <div key={index} className="flex gap-1.5">
                                        <Input placeholder={`Galerie ${index + 1}`} value={url} onChange={e => { const ng = [...form.images_gallery]; ng[index] = e.target.value; setForm({...form, images_gallery: ng}); }} className="h-8 rounded-md bg-stone-50 border-none px-3 text-[9px] flex-1" />
                                        <Button type="button" onClick={() => setForm({...form, images_gallery: form.images_gallery.filter((_, i) => i !== index)})} className="h-8 w-8 bg-red-50 text-red-500 rounded-md"><X className="w-3 h-3" /></Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={() => setForm({...form, images_gallery: [...(form.images_gallery || []), ""]})} className="w-full h-8 border-dashed border border-stone-200 text-[7px] font-black uppercase rounded-md text-stone-400">+ Image</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[8px] font-black uppercase opacity-40 flex items-center gap-1.5"><Video className="w-3 h-3" /> Vidéo</Label>
                            <Input placeholder="Lien MP4" value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="h-8 rounded-md bg-stone-50 border-none px-3 text-[9px]" />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-10 bg-stone-900 rounded-lg text-[8px] font-black uppercase tracking-[0.4em]">Sauvegarder</Button>
                </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white p-5 rounded-xl border border-stone-100 shadow-lg space-y-3">
              <h2 className="font-serif italic text-base text-stone-900">Nouvelle Collection</h2>
              <form onSubmit={handleAddCategory} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Nom (FR)" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px]" required />
                    <Input dir="rtl" placeholder="الاسم (AR)" value={newCatNameAr} onChange={e => setNewCatNameAr(e.target.value)} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px] text-right" />
                </div>
                <Input placeholder="URL Image" value={newCatImage} onChange={e => setNewCatImage(e.target.value)} className="h-9 rounded-lg bg-stone-50 border-none px-3 text-[10px]" />
                <Button type="submit" disabled={loading} className="w-full h-9 bg-stone-900 rounded-lg text-[7px] font-black uppercase tracking-widest">{editingCatId ? 'Update' : 'Créer'}</Button>
              </form>
            </div>

            <div className="grid gap-1.5">
              {categories?.map((cat) => (
                <div key={cat.id} className="bg-white p-2 rounded-xl border border-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-stone-50 overflow-hidden"><img src={cat.image_url} className="w-full h-full object-cover" /></div>
                    <span className="font-bold text-[8px] uppercase text-stone-800">{cat.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="w-7 h-7 text-stone-300" onClick={() => { setEditingCatId(cat.id); setNewCatName(cat.name); setNewCatNameAr(cat.name_ar || ""); setNewCatImage(cat.image_url || ""); }}><Pencil className="w-3 h-3" /></Button>
                    <Button size="icon" variant="ghost" className="w-7 h-7 text-stone-300 hover:text-red-500" onClick={async () => { if(confirm('Supprimer?')) { await supabase.from("categories").delete().eq("id", cat.id); fetchAll(); } }}><Trash2 className="w-3 h-3" /></Button>
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
