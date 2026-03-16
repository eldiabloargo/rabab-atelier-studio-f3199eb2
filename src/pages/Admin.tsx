import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, X, LogOut, Video, ImageIcon, Palette } from "lucide-react"; 
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
  
  // States for Gallery & Colors
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newColor, setNewColor] = useState("#94724a"); // اللون الافتراضي (الترابي)

  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "", title_ar: "", price: "", description: "", description_ar: "",
    image_url: "", category: "", images_gallery: [] as string[],
    video_url: "", colors: [] as string[] // دبا الألوان غاتسيفا كـ Array ديال الـ HEX codes
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAppReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchAll = async () => {
    const { data: pData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const { data: cData } = await supabase.from("categories").select("*").order("name", { ascending: true });
    setProducts(pData || []);
    setCategories(cData || []);
  };

  useEffect(() => { if (session) fetchAll(); }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Accès refusé", variant: "destructive" });
    setLoading(false);
  };

  const addColor = () => {
    if (!form.colors.includes(newColor)) {
      setForm({ ...form, colors: [...form.colors, newColor] });
    }
  };

  if (!appReady) return null;

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 w-full max-w-sm space-y-4">
        <h1 className="text-center font-serif italic text-xl mb-6">Atelier Rabab Login</h1>
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-xl" required />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl" required />
        <Button type="submit" disabled={loading} className="w-full h-12 bg-stone-900 rounded-xl uppercase text-xs font-bold tracking-widest">Ouvrir le Studio</Button>
      </form>
    </div>
  );

  return (
    <div className="pt-24 pb-10 px-4 max-w-4xl mx-auto font-sans">
      <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl border border-stone-100 w-fit mx-auto shadow-sm">
        <button onClick={() => setActiveTab("products")} className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-stone-900 text-white' : 'text-stone-400'}`}>Produits</button>
        <button onClick={() => setActiveTab("categories")} className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-stone-900 text-white' : 'text-stone-400'}`}>Collections</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" && (
          <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showForm ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => setShowForm(true)} className="aspect-square border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center text-stone-300 hover:border-stone-900 transition-all">
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Nouveau</span>
                </button>
                {products.map(p => (
                  <div key={p.id} className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm group">
                    <img src={p.image_url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                      <Button size="icon" className="rounded-full w-8 h-8" onClick={() => { setForm(p); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3 h-3" /></Button>
                      <Button size="icon" variant="destructive" className="rounded-full w-8 h-8" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const { error } = editingId ? await supabase.from("products").update(form).eq("id", editingId) : await supabase.from("products").insert([form]);
                if (!error) { setShowForm(false); setEditingId(null); fetchAll(); toast({ title: "Enregistré" }); }
                setLoading(false);
              }} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl space-y-6">
                
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="font-serif italic text-xl">Détails du Produit</h2>
                  <button type="button" onClick={() => setShowForm(false)} className="text-stone-400 hover:text-black"><X /></button>
                </div>

                {/* Titres & Description */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-[9px] font-bold uppercase opacity-50">Titre (FR)</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl h-10" /></div>
                  <div className="space-y-1 text-right"><Label className="text-[9px] font-bold uppercase opacity-50">العنوان (AR)</Label><Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="rounded-xl h-10" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-[9px] font-bold uppercase opacity-50">Description (FR)</Label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full h-20 p-3 rounded-xl border border-stone-200 text-sm resize-none" /></div>
                  <div className="space-y-1 text-right"><Label className="text-[9px] font-bold uppercase opacity-50">الوصف (AR)</Label><textarea dir="rtl" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="w-full h-20 p-3 rounded-xl border border-stone-200 text-sm text-right resize-none" /></div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-1"><Label className="text-[9px] font-bold uppercase opacity-50">Prix</Label><Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="rounded-xl h-10 font-bold" /></div>
                   <div className="space-y-1 col-span-2"><Label className="text-[9px] font-bold uppercase opacity-50">Collection</Label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm">
                      <option value="">Sélectionner</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Media Section */}
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  {/* Gallery */}
                  <div className="space-y-2 border-r pr-4">
                    <Label className="text-[9px] font-bold uppercase opacity-50 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Galerie Photos (+)</Label>
                    <div className="flex gap-2">
                      <Input value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} className="rounded-xl h-10 flex-1 text-xs" placeholder="URL..." />
                      <Button type="button" onClick={() => { if(newGalleryUrl) { setForm({...form, images_gallery: [...form.images_gallery, newGalleryUrl]}); setNewGalleryUrl(""); } }} className="h-10 w-10 rounded-xl bg-stone-900"><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {form.images_gallery.map((url, idx) => (
                        <div key={idx} className="bg-stone-50 px-2 py-1 rounded-md text-[8px] font-bold flex items-center gap-2 border">IMG {idx + 1} <button type="button" onClick={() => setForm({...form, images_gallery: form.images_gallery.filter((_, i) => i !== idx)})} className="text-red-500">×</button></div>
                      ))}
                    </div>
                  </div>

                  {/* Colors - Premium Version */}
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase opacity-50 flex items-center gap-2"><Palette className="w-3 h-3" /> Palette Couleurs</Label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent" />
                      <Input value={newColor} onChange={e => setNewColor(e.target.value)} className="h-10 w-24 text-xs font-mono" />
                      <Button type="button" onClick={addColor} variant="outline" className="h-10 rounded-xl border-stone-900 text-[10px] font-bold">Ajouter</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.colors?.map((hex, idx) => (
                        <div key={idx} className="group relative w-6 h-6 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: hex }}>
                          <button type="button" onClick={() => setForm({...form, colors: form.colors.filter((_, i) => i !== idx)})} className="absolute -top-1 -right-1 bg-white rounded-full w-3 h-3 text-[8px] flex items-center justify-center border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Media */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-[9px] font-bold uppercase opacity-50 flex items-center gap-2"><Video className="w-3 h-3" /> Vidéo</Label><Input value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-xl h-10 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-[9px] font-bold uppercase opacity-50">Image Principale</Label><Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-xl h-10 text-xs" /></div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 bg-stone-900 rounded-xl text-xs font-black uppercase tracking-[0.4em] shadow-lg hover:shadow-none transition-all">
                  {loading ? 'Sincronisation...' : 'Enregistrer le Produit'}
                </Button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
