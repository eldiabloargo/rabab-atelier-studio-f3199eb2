import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, Pencil, Plus, X, LogOut, Save, ShoppingBag, Check, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  const [catForm, setCatForm] = useState({ name: "", image_url: "" });
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newColor, setNewColor] = useState({ name_en: "", name_ar: "", hex: "#000000" });
  
  const [form, setForm] = useState({
    title: "", title_ar: "", price: "", description: "", description_ar: "",
    image_url: "", category: "", images_gallery: [] as string[],
    video_url: "", colors: [] as any[]
  });

  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const { data: cData } = await supabase.from("categories").select("*").order("name", { ascending: true });
    setProducts(pData || []);
    setCategories(cData || []);
    setLoading(false);
  };

  useEffect(() => { if (session) fetchAll(); }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
    if (error) toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    setLoading(false);
  };

  const addColor = () => {
    if (newColor.name_en) {
      setForm({ ...form, colors: [...(form.colors || []), newColor] });
      setNewColor({ name_en: "", name_ar: "", hex: "#000000" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = editingId 
      ? await supabase.from("products").update(form).eq("id", editingId)
      : await supabase.from("products").insert([form]);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: editingId ? "Mis à jour" : "Produit ajouté" });
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "", images_gallery: [], video_url: "", colors: [] });
      fetchAll();
    }
    setLoading(false);
  };

  const handleSaveCategory = async () => {
    if (!catForm.name) return;
    setLoading(true);
    const { error } = editingCatId
      ? await supabase.from("categories").update(catForm).eq("id", editingCatId)
      : await supabase.from("categories").insert([catForm]);

    if (!error) {
      setCatForm({ name: "", image_url: "" });
      setEditingCatId(null);
      fetchAll();
      toast({ title: "Collection enregistrée" });
    }
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
          <form onSubmit={handleLogin} className="space-y-4">
            <h1 className="text-2xl font-serif text-center mb-6 italic">Studio Login</h1>
            <Input className="rounded-xl h-12" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input className="rounded-xl h-12" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full h-12 rounded-xl bg-stone-900">Accéder au Studio</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen text-stone-900">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-stone-100 sticky top-24 z-50">
        <h1 className="text-xl font-serif font-bold italic">Atelier Rabab <span className="text-amber-600 text-[10px] font-black uppercase tracking-widest ml-2">Studio Admin</span></h1>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="text-stone-400 hover:text-red-500"><LogOut className="w-5 h-5" /></Button>
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-12 bg-stone-100/50 p-1.5 rounded-2xl w-fit mx-auto border border-stone-100">
        <button onClick={() => setActiveTab("products")} className={`px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "products" ? "bg-white shadow-md text-stone-900" : "text-stone-400"}`}>Inventaire</button>
        <button onClick={() => setActiveTab("categories")} className={`px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "categories" ? "bg-white shadow-md text-stone-900" : "text-stone-400"}`}>Collections</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" ? (
          <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showForm ? (
              <div className="space-y-10">
                <Button onClick={() => setShowForm(true)} className="w-full h-24 bg-white border-2 border-dashed border-stone-200 rounded-[2rem] text-stone-400 hover:border-amber-600 hover:text-amber-600 transition-all">
                   <Plus className="mr-2" /> Ajouter un nouveau chef-d'œuvre
                </Button>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="bg-white p-3 rounded-[2rem] border border-stone-100 group relative shadow-sm">
                      <img src={p.image_url} className="aspect-square object-cover rounded-[1.5rem] mb-3" />
                      <div className="absolute inset-2 bg-stone-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all rounded-[1.5rem]">
                        <Button size="icon" variant="secondary" className="rounded-full" onClick={() => { setForm(p); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="rounded-full" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                      <p className="text-[10px] font-black uppercase text-center tracking-tighter truncate">{p.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-10">
                {/* Form */}
                <motion.form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 shadow-2xl space-y-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-serif italic text-2xl">{editingId ? 'Modifier' : 'Nouveau Produit'}</h2>
                    <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}><X /></Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-amber-700">Détails de base</Label>
                      <Input placeholder="Titre (FR)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl bg-stone-50 border-none h-12" />
                      <Input dir="rtl" placeholder="العنوان (AR)" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="rounded-xl bg-stone-50 border-none h-12" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Prix" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="rounded-xl bg-stone-50 border-none h-12" />
                        <select className="rounded-xl bg-stone-50 border-none px-4 text-xs font-bold" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                          <option value="">Collection</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-amber-700">Couleurs disponibles</Label>
                      <div className="flex gap-2">
                        <input type="color" value={newColor.hex} onChange={e => setNewColor({...newColor, hex: e.target.value})} className="w-12 h-12 rounded-xl cursor-pointer bg-stone-50 p-1" />
                        <Input placeholder="Nom du couleur" value={newColor.name_en} onChange={e => setNewColor({...newColor, name_en: e.target.value})} className="rounded-xl bg-stone-50 border-none h-12" />
                        <Button type="button" onClick={addColor} className="bg-stone-900 h-12 w-12 rounded-xl"><Plus /></Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.colors?.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                            <span className="text-[9px] font-bold uppercase">{c.name_en}</span>
                            <X className="w-3 h-3 cursor-pointer text-red-400" onClick={() => setForm({...form, colors: form.colors.filter((_, idx) => idx !== i)})} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-amber-700">Images & Galerie</Label>
                     <Input placeholder="Image principale (URL)" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-xl bg-stone-50 border-none h-12" />
                     <div className="flex gap-2">
                        <Input placeholder="Lien image galerie..." value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} className="rounded-xl bg-stone-50 border-none h-12 flex-1" />
                        <Button type="button" onClick={() => { if(newGalleryUrl) { setForm({...form, images_gallery: [...form.images_gallery, newGalleryUrl]}); setNewGalleryUrl(""); } }} className="bg-stone-200 text-stone-900 h-12 w-12 rounded-xl"><Plus /></Button>
                     </div>
                  </div>

                  <Button type="submit" className="w-full h-16 bg-stone-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-lg">Enregistrer</Button>
                </motion.form>

                {/* Live Preview */}
                <div className="hidden lg:block sticky top-32 h-fit">
                  <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-xl space-y-4 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Aperçu en direct</p>
                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-stone-50 mb-4 shadow-inner">
                      <img src={form.image_url || "/placeholder.svg"} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-serif italic text-xl text-stone-800">{form.title || "Nom du produit"}</h3>
                    <p className="text-amber-700 font-black text-xs tracking-widest uppercase">{form.price ? `${form.price} MAD` : "---"}</p>
                    <div className="flex justify-center gap-1.5 pt-2">
                       {form.colors?.map((c, i) => (
                         <div key={i} className="w-3 h-3 rounded-full border border-stone-200" style={{ backgroundColor: c.hex }} />
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl space-y-6">
              <h2 className="font-serif italic text-xl">{editingCatId ? 'Modifier la Collection' : 'Nouvelle Collection'}</h2>
              <div className="space-y-4">
                <Input placeholder="Nom de la collection" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="rounded-xl bg-stone-50 border-none h-14" />
                <div className="flex gap-3">
                  <Input placeholder="URL de l'image (Circle)" value={catForm.image_url} onChange={e => setCatForm({...catForm, image_url: e.target.value})} className="rounded-xl bg-stone-50 border-none h-14 flex-1" />
                  <Button onClick={handleSaveCategory} className="bg-stone-900 h-14 px-8 rounded-xl">
                    {editingCatId ? <Check /> : <Plus />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-white rounded-[1.5rem] border border-stone-50 shadow-sm group">
                  <div className="flex items-center gap-4">
                    <img src={c.image_url || "/placeholder.svg"} className="w-12 h-12 rounded-full object-cover border border-stone-100" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{c.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full text-stone-300 hover:text-amber-600" onClick={() => { setCatForm({ name: c.name, image_url: c.image_url }); setEditingCatId(c.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-stone-300 hover:text-red-500" onClick={() => { if(confirm('Supprimer?')) supabase.from("categories").delete().eq("id", c.id).then(fetchAll) }}><Trash2 className="w-4 h-4" /></Button>
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
