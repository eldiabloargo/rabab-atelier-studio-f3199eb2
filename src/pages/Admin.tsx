import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, X, LogOut, Video, ImageIcon, Palette, FolderPlus } from "lucide-react"; 
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
  
  // Product Form States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  // Collection Form States
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("");

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setLoading(true);
    const { error } = await supabase.from("categories").insert([{ name: newCatName, image_url: newCatImage }]);
    if (!error) {
      setNewCatName(""); setNewCatImage("");
      fetchAll();
      toast({ title: "Collection Ajoutée" });
    }
    setLoading(false);
  };

  if (!appReady) return <div className="min-h-screen flex items-center justify-center font-serif italic text-stone-400">Atelier Rabab Studio...</div>;

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-stone-100 w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif italic text-2xl text-stone-800">Atelier Rabab</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Admin Studio</p>
        </div>
        <div className="space-y-4 pt-4">
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-2xl bg-stone-50 border-none px-5" required />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-2xl bg-stone-50 border-none px-5" required />
          <Button type="submit" disabled={loading} className="w-full h-14 bg-stone-900 rounded-2xl text-[10px] font-black uppercase tracking-widest">Entrer</Button>
        </div>
      </motion.form>
    </div>
  );

  return (
    <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto font-sans">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-12 bg-white/90 backdrop-blur-md p-3 rounded-3xl border border-stone-100 sticky top-6 z-50 shadow-sm">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("products")} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Inventaire</button>
          <button onClick={() => setActiveTab("categories")} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400'}`}>Collections</button>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="mr-4 text-stone-300 hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" ? (
          <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* ... الكود ديال الـ Products اللي صايبنا قبيلة بقا هو هو ... */}
            {!showForm ? (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <button onClick={() => setShowForm(true)} className="aspect-[4/5] border-2 border-dashed border-stone-200 rounded-[2rem] flex flex-col items-center justify-center text-stone-300 hover:border-stone-900 transition-all bg-white/50">
                   <Plus className="w-8 h-8 mb-3" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Nouveau</span>
                 </button>
                 {products.map(p => (
                   <div key={p.id} className="relative aspect-[4/5] bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-sm group">
                     <img src={p.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all backdrop-blur-[2px]">
                       <Button size="icon" className="rounded-full w-10 h-10 bg-white text-stone-900 hover:bg-stone-100" onClick={() => { setForm(p); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-4 h-4" /></Button>
                       <Button size="icon" variant="destructive" className="rounded-full w-10 h-10" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-4 h-4" /></Button>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
                <motion.form initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const { error } = editingId ? await supabase.from("products").update(form).eq("id", editingId) : await supabase.from("products").insert([form]);
                    if (!error) { setShowForm(false); setEditingId(null); fetchAll(); toast({ title: "Enregistré" }); }
                    setLoading(false);
                }} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl space-y-10">
                    <div className="flex justify-between items-center"><h2 className="font-serif italic text-3xl">Détails Produit</h2><button type="button" onClick={() => setShowForm(false)}><X className="w-7 h-7 text-stone-300" /></button></div>
                    {/* فورم المنتوجات (نفس اللي صايبنا) */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase opacity-40">Titre (FR)</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="h-14 rounded-2xl bg-stone-50 border-none" /></div>
                        <div className="space-y-2 text-right"><Label className="text-[10px] font-black uppercase opacity-40">العنوان (AR)</Label><Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="h-14 rounded-2xl bg-stone-50 border-none" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase opacity-40">Prix (MAD)</Label><Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="h-14 rounded-2xl border-2 border-stone-50 font-bold" /></div>
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase opacity-40">Collection</Label>
                            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-14 rounded-2xl border-2 border-stone-50 px-4 bg-white">
                                <option value="">Choisir</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* ... باقي فورم المنتوجات ... */}
                    <Button type="submit" disabled={loading} className="w-full h-16 bg-stone-900 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em]">Enregistrer le Produit</Button>
                </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-12">
            {/* CREATE NEW COLLECTION */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl space-y-8">
              <div className="flex items-center gap-3">
                <FolderPlus className="w-5 h-5 text-amber-700" />
                <h2 className="font-serif italic text-2xl">Nouvelle Collection</h2>
              </div>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Nom (ex: Cadeaux de Naissance)" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="h-14 rounded-2xl bg-stone-50 border-none px-6" required />
                    <Input placeholder="Image URL (Optionnel)" value={newCatImage} onChange={e => setNewCatImage(e.target.value)} className="h-14 rounded-2xl bg-stone-50 border-none px-6" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-14 bg-stone-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black">
                  {loading ? 'Ajout...' : 'Ajouter à la Liste'}
                </Button>
              </form>
            </div>

            {/* LIST COLLECTIONS */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Mouvements Actuels</span>
              <div className="grid gap-3">
                {categories.map((cat) => (
                  <motion.div layout key={cat.id} className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-stone-100 overflow-hidden border border-stone-50 shadow-inner">
                        {cat.image_url ? <img src={cat.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-300"><ImageIcon className="w-5 h-5" /></div>}
                      </div>
                      <span className="font-bold text-[11px] uppercase tracking-widest text-stone-700">{cat.name}</span>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full text-stone-200 hover:text-red-500 hover:bg-red-50 transition-all" onClick={async () => { if(confirm('Supprimer cette collection?')) { await supabase.from("categories").delete().eq("id", cat.id); fetchAll(); } }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
