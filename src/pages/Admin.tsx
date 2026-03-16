import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, X, LogOut, Video, FileText, LayoutGrid, Save, Lock, Image as ImageIcon } from "lucide-react"; 
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
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const { toast } = useToast();

  const [catForm, setCatForm] = useState({ name: "", image_url: "" });
  const [form, setForm] = useState({
    title: "", title_ar: "", price: "", description: "", description_ar: "",
    image_url: "", category: "", images_gallery: [] as string[],
    video_url: "", colors: [] as any[]
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAppReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchAll = async () => {
    try {
      const { data: pData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      const { data: cData } = await supabase.from("categories").select("*").order("name", { ascending: true });
      setProducts(pData || []);
      setCategories(cData || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (session) fetchAll(); }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Accès refusé", variant: "destructive" });
    setLoading(false);
  };

  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setForm({ ...form, images_gallery: [...form.images_gallery, newGalleryUrl] });
      setNewGalleryUrl("");
    }
  };

  if (!appReady) return <div className="p-20 text-center font-serif italic text-stone-400">Initialisation...</div>;

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-stone-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-700 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-serif italic text-3xl text-stone-800">Atelier Rabab</h1>
          <p className="text-stone-400 text-sm mt-3 uppercase tracking-[0.2em] font-bold">Studio Admin</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase ml-1 text-stone-500">Email Professionnel</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-2xl h-14 bg-stone-50 border-none text-base" placeholder="admin@rabab.ma" required />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase ml-1 text-stone-500">Mot de passe</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-2xl h-14 bg-stone-50 border-none text-base" placeholder="••••••••" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-14 bg-stone-900 rounded-2xl mt-6 text-sm font-bold uppercase tracking-widest hover:bg-amber-900 transition-all">
            {loading ? "Vérification..." : "Entrer dans le Studio"}
          </Button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-28 pb-12 px-4 max-w-5xl mx-auto min-h-screen font-sans bg-stone-50/30">
      {/* Header Admin */}
      <div className="flex justify-between items-center mb-10 bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm">
        <div className="flex gap-8 ml-4">
          <button onClick={() => setActiveTab("products")} className={`text-xs font-black uppercase tracking-[0.15em] transition-colors ${activeTab === 'products' ? 'text-amber-800' : 'text-stone-300 hover:text-stone-500'}`}>Inventaire</button>
          <button onClick={() => setActiveTab("categories")} className={`text-xs font-black uppercase tracking-[0.15em] transition-colors ${activeTab === 'categories' ? 'text-amber-800' : 'text-stone-300 hover:text-stone-500'}`}>Collections</button>
        </div>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="text-stone-300 hover:text-red-500"><LogOut className="w-5 h-5" /></Button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" ? (
          <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showForm ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <button onClick={() => setShowForm(true)} className="aspect-square border-2 border-dashed border-stone-200 rounded-[2.5rem] flex flex-col items-center justify-center text-stone-400 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/30 transition-all group">
                  <Plus className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Nouveau Produit</span>
                </button>
                {products.map(p => (
                  <div key={p.id} className="relative group aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm">
                    <img src={p.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all">
                      <Button size="icon" variant="secondary" className="rounded-full w-10 h-10" onClick={() => { setForm(p); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive" className="rounded-full w-10 h-10" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const { error } = editingId ? await supabase.from("products").update(form).eq("id", editingId) : await supabase.from("products").insert([form]);
                if (!error) { setShowForm(false); setEditingId(null); setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "", images_gallery: [], video_url: "", colors: [] }); fetchAll(); toast({ title: "Studio mis à jour" }); }
                setLoading(false);
              }} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl space-y-10">
                
                <div className="flex justify-between items-center border-b border-stone-50 pb-6">
                  <h2 className="font-serif italic text-2xl text-stone-800">Édition de l'Œuvre</h2>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-stone-300 hover:text-stone-900"><X className="w-6 h-6" /></button>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-stone-400 ml-1">Titre (FR)</Label>
                        <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-2xl h-14 bg-stone-50 border-none text-base font-medium" />
                      </div>
                      <div className="space-y-2 text-right">
                        <Label className="text-[11px] font-bold uppercase text-stone-400 mr-1">العنوان (AR)</Label>
                        <Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="rounded-2xl h-14 bg-stone-50 border-none text-base font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-stone-400 ml-1">Description (FR)</Label>
                      <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full min-h-[140px] p-5 rounded-2xl bg-stone-50 border-none text-base resize-none" />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label className="text-[11px] font-bold uppercase text-stone-400 mr-1">الوصف (AR)</Label>
                      <textarea dir="rtl" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="w-full min-h-[140px] p-5 rounded-2xl bg-stone-50 border-none text-base resize-none" />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-stone-400 ml-1">Prix (MAD)</Label>
                        <Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="rounded-2xl h-14 border-stone-100 text-lg font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-stone-400 ml-1">Collection</Label>
                        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-14 rounded-2xl border-stone-100 bg-white px-4 text-sm font-semibold">
                          <option value="">Sélectionner</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-stone-400 ml-1 flex items-center gap-2"><Video className="w-4 h-4 text-amber-600" /> Vidéo URL</Label>
                      <Input value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-2xl bg-stone-50 border-none h-14 text-sm" placeholder="Lien MP4 ou YouTube" />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[11px] font-bold uppercase text-stone-400 ml-1 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-amber-600" /> Galerie Images</Label>
                      <div className="flex gap-2">
                        <Input value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} className="rounded-2xl h-14 border-stone-100 flex-1 text-sm" placeholder="URL de l'image supplémentaire..." />
                        <Button type="button" onClick={addGalleryImage} className="h-14 w-14 rounded-2xl bg-stone-900"><Plus /></Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.images_gallery.map((img, idx) => (
                          <div key={idx} className="bg-stone-100 px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2 text-stone-600">
                            Image {idx + 1}
                            <button type="button" onClick={() => setForm({...form, images_gallery: form.images_gallery.filter((_, i) => i !== idx)})}><X className="w-3 h-3 text-red-500" /></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-stone-400 ml-1">Image de Couverture (Principale)</Label>
                      <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-2xl border-stone-100 h-14 text-sm" />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-16 bg-stone-900 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.4em] shadow-xl hover:bg-amber-900 transition-all">
                  {loading ? 'Synchronisation...' : 'Enregistrer le Produit'}
                </Button>
              </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-10">
             <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl space-y-8">
              <h2 className="font-serif italic text-2xl flex items-center gap-3"><LayoutGrid className="w-6 h-6 text-amber-700" /> Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input placeholder="Nom de collection" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="rounded-2xl h-14 bg-stone-50 border-none font-medium" />
                <div className="flex gap-2">
                  <Input placeholder="Image URL" value={catForm.image_url} onChange={e => setCatForm({...catForm, image_url: e.target.value})} className="rounded-2xl h-14 bg-stone-50 border-none flex-1 font-medium" />
                  <Button onClick={async () => {
                    const { error } = editingCatId ? await supabase.from("categories").update(catForm).eq("id", editingCatId) : await supabase.from("categories").insert([catForm]);
                    if(!error) { setCatForm({name: "", image_url: ""}); setEditingCatId(null); fetchAll(); toast({title: "Collection à jour"}); }
                  }} className="bg-stone-900 h-14 w-14 rounded-2xl">
                    {editingCatId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-stone-50 shadow-sm group hover:border-amber-100 transition-all">
                  <div className="flex items-center gap-5">
                    <img src={c.image_url || "/placeholder.svg"} className="w-16 h-16 rounded-full object-cover shadow-inner border-2 border-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-stone-700">{c.name}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 text-stone-300 hover:text-amber-600" onClick={() => { setCatForm({ name: c.name, image_url: c.image_url }); setEditingCatId(c.id); }}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 text-stone-300 hover:text-red-500" onClick={() => { if(confirm('Supprimer?')) supabase.from("categories").delete().eq("id", c.id).then(fetchAll) }}><Trash2 className="w-4 h-4" /></Button>
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
