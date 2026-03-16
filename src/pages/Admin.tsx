import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, X, LogOut, Save, Video, Palette } from "lucide-react";
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
  const [newColor, setNewColor] = useState({ name_en: "", hex: "#000000" });
  
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
    const { data: pData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const { data: cData } = await supabase.from("categories").select("*").order("name", { ascending: true });
    setProducts(pData || []);
    setCategories(cData || []);
  };

  useEffect(() => { if (session) fetchAll(); }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
    if (error) toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = editingId 
      ? await supabase.from("products").update(form).eq("id", editingId)
      : await supabase.from("products").insert([form]);

    if (!error) {
      toast({ title: "Succès" });
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "", images_gallery: [], video_url: "", colors: [] });
      fetchAll();
    }
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-serif">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl space-y-4">
          <h1 className="text-xl text-center italic">Atelier Rabab Admin</h1>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" />
          <Button className="w-full bg-stone-900 rounded-xl uppercase text-[10px] tracking-widest">Entrer</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-stone-100">
        <h1 className="font-serif italic text-lg">Admin Studio</h1>
        <div className="flex gap-4">
            <button onClick={() => setActiveTab("products")} className={`text-[10px] uppercase tracking-widest font-bold ${activeTab === 'products' ? 'text-amber-700' : 'text-stone-400'}`}>Produits</button>
            <button onClick={() => setActiveTab("categories")} className={`text-[10px] uppercase tracking-widest font-bold ${activeTab === 'categories' ? 'text-amber-700' : 'text-stone-400'}`}>Collections</button>
            <button onClick={() => supabase.auth.signOut()} className="text-stone-300 ml-4"><LogOut className="w-4 h-4" /></button>
        </div>
      </header>

      {activeTab === "products" ? (
        <div className="space-y-6">
          {!showForm ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <button onClick={() => setShowForm(true)} className="aspect-square border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-300 hover:text-amber-600 hover:border-amber-600 transition-all">
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-[9px] uppercase font-bold tracking-widest">Nouveau</span>
              </button>
              {products.map(p => (
                <div key={p.id} className="relative group aspect-square bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
                  <img src={p.image_url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => { setForm(p); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3 h-3" /></Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-stone-100 shadow-xl space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                <h2 className="font-serif italic text-xl">{editingId ? 'Modifier' : 'Nouveau Produit'}</h2>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}><X className="w-5 h-5 text-stone-300" /></button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest opacity-50 ml-1">Titre (FR)</Label>
                      <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl border-stone-100 bg-stone-50/50" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest opacity-50 ml-1">العنوان (AR)</Label>
                      <Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="rounded-xl border-stone-100 bg-stone-50/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest opacity-50 ml-1">Prix (MAD)</Label>
                      <Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="rounded-xl border-stone-100" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest opacity-50 ml-1">Collection</Label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-10 rounded-xl border border-stone-100 bg-white px-3 text-xs">
                        <option value="">Sélectionner</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] uppercase tracking-widest opacity-50 ml-1 flex items-center gap-2"><Video className="w-3 h-3"/> Vidéo URL</Label>
                    <Input placeholder="Lien YouTube ou MP4" value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-xl border-stone-100 bg-stone-50/50" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] uppercase tracking-widest opacity-50 ml-1">Image Principale</Label>
                    <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-xl border-stone-100" />
                  </div>

                  <div className="p-4 bg-stone-50/50 rounded-2xl border border-stone-100 space-y-3">
                    <Label className="text-[9px] uppercase tracking-widest opacity-50 flex items-center gap-2"><Palette className="w-3 h-3"/> Couleurs</Label>
                    <div className="flex gap-2">
                      <input type="color" value={newColor.hex} onChange={e => setNewColor({...newColor, hex: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer shrink-0 border-none bg-transparent" />
                      <Input placeholder="Nom (ex: Or)" value={newColor.name_en} onChange={e => setNewColor({...newColor, name_en: e.target.value})} className="h-8 text-[10px] rounded-lg border-stone-100 shadow-none" />
                      <Button type="button" onClick={() => { if(newColor.name_en) { setForm({...form, colors: [...(form.colors || []), newColor]}); setNewColor({name_en: "", hex: "#000000"}); } }} className="h-8 px-2 bg-stone-900 rounded-lg"><Plus className="w-3 h-3" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {form.colors?.map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-stone-100 shadow-sm">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }} />
                          <span className="text-[8px] font-bold uppercase">{c.name_en}</span>
                          <X className="w-2 h-2 cursor-pointer text-stone-300" onClick={() => setForm({...form, colors: form.colors.filter((_, idx) => idx !== i)})} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                 <Label className="text-[9px] uppercase tracking-widest opacity-50 ml-1">Galerie Images</Label>
                 <div className="flex gap-2">
                    <Input placeholder="URL de l'image" value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} className="rounded-xl border-stone-100" />
                    <Button type="button" onClick={() => { if(newGalleryUrl) { setForm({...form, images_gallery: [...form.images_gallery, newGalleryUrl]}); setNewGalleryUrl(""); } }} className="bg-stone-100 text-stone-900 h-10 w-12 rounded-xl border border-stone-200"><Plus /></Button>
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-2">
                    {form.images_gallery?.map((url, i) => (
                      <div key={i} className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-stone-200">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => setForm({...form, images_gallery: form.images_gallery.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-red-500/80 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"><X className="w-3 h-3 text-white" /></button>
                      </div>
                    ))}
                 </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-14 bg-stone-900 rounded-2xl text-[10px] uppercase font-bold tracking-[0.3em] mt-4">{loading ? 'Enregistrement...' : 'Enregistrer le Produit'}</Button>
            </motion.form>
          )}
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
            <h2 className="font-serif italic">{editingCatId ? 'Modifier Collection' : 'Nouvelle Collection'}</h2>
            <div className="flex gap-2">
              <Input placeholder="Nom" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="rounded-xl h-12" />
              <Input placeholder="Image URL" value={catForm.image_url} onChange={e => setCatForm({...catForm, image_url: e.target.value})} className="rounded-xl h-12" />
              <Button onClick={async () => {
                const { error } = editingCatId ? await supabase.from("categories").update(catForm).eq("id", editingCatId) : await supabase.from("categories").insert([catForm]);
                if (!error) { setCatForm({ name: "", image_url: "" }); setEditingCatId(null); fetchAll(); }
              }} className="bg-stone-900 h-12 rounded-xl px-6"><Plus /></Button>
            </div>
          </div>
          {categories.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-stone-50 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={c.image_url} className="w-10 h-10 rounded-full object-cover" />
                <span className="text-xs font-bold uppercase tracking-wider">{c.name}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => { setCatForm({ name: c.name, image_url: c.image_url }); setEditingCatId(c.id); }}><Pencil className="w-3 h-3" /></Button>
                <Button variant="ghost" size="icon" className="text-red-300" onClick={() => { if(confirm('Supprimer?')) supabase.from("categories").delete().eq("id", c.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
