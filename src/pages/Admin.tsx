import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
// زدنا Save هنا باش ما يبقاش الخطأ
import { Trash2, Pencil, Plus, X, LogOut, Video, FileText, LayoutGrid, Save } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // حالة جديدة باش نتحكمو فـ شاشة التحميل
  const [appReady, setAppReady] = useState(false); 

  const [catForm, setCatForm] = useState({ name: "", image_url: "" });
  const [form, setForm] = useState({
    title: "", title_ar: "", price: "", description: "", description_ar: "",
    image_url: "", category: "", images_gallery: [] as string[],
    video_url: "", colors: [] as any[]
  });

  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) setAppReady(true); // ايلا ماكاينش session، حيد شاشة التحميل
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setAppReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchAll = async () => {
    try {
      const { data: pData, error: pError } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      const { data: cData, error: cError } = await supabase.from("categories").select("*").order("name", { ascending: true });
      
      if (pError || cError) console.error("Supabase Error:", pError || cError);
      
      setProducts(pData || []);
      setCategories(cData || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setAppReady(true); // وخا يوقع مشكل، كنقولو للسيت راه واجد باش ما يبقاش معلق
    }
  };

  useEffect(() => { if (session) fetchAll(); }, [session]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = editingId 
      ? await supabase.from("products").update(form).eq("id", editingId)
      : await supabase.from("products").insert([form]);

    if (!error) {
      toast({ title: "Produit enregistré" });
      setShowForm(false); setEditingId(null);
      setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "", images_gallery: [], video_url: "", colors: [] });
      fetchAll();
    }
    setLoading(false);
  };

  const handleCategorySubmit = async () => {
    if (!catForm.name) return;
    setLoading(true);
    const { error } = editingCatId
      ? await supabase.from("categories").update(catForm).eq("id", editingCatId)
      : await supabase.from("categories").insert([catForm]);

    if (!error) {
      toast({ title: "Collection mise à jour" });
      setCatForm({ name: "", image_url: "" }); setEditingCatId(null);
      fetchAll();
    }
    setLoading(false);
  };

  // تبديل الشرط باش يخدم بـ appReady
  if (!appReady) return <div className="p-20 text-center font-serif italic">Chargement du Studio...</div>;
  if (!session) return <div className="p-20 text-center font-serif">Veuillez vous connecter.</div>;

  return (
    <div className="pt-28 pb-12 px-4 max-w-5xl mx-auto min-h-screen font-sans">
      {/* الباقي ديال الكود ديالك هو هو، راه مريكل 100% */}
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
                  <span className="text-[8px] font-bold uppercase tracking-widest">Nouveau Produit</span>
                </button>
                {products.map(p => (
                  <div key={p.id} className="relative group aspect-square bg-white rounded-[2rem] overflow-hidden border border-stone-100">
                    <img src={p.image_url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                      <Button size="icon" variant="secondary" className="rounded-full" onClick={() => { setForm(p); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3 h-3" /></Button>
                      <Button size="icon" variant="destructive" className="rounded-full" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.form onSubmit={handleProductSubmit} className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif italic text-2xl text-stone-800">Détails du Chef-d'œuvre</h2>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}><X /></button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Titre (FR)</Label>
                        <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-2xl bg-stone-50 border-none h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">العنوان (AR)</Label>
                        <Input dir="rtl" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="rounded-2xl bg-stone-50 border-none h-12" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-2"><FileText className="w-3 h-3" /> Description (FR)</Label>
                      <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full min-h-[100px] p-4 rounded-2xl bg-stone-50 border-none text-sm" placeholder="Décrivez le produit en français..." />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">الوصف (AR)</Label>
                      <textarea dir="rtl" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="w-full min-h-[100px] p-4 rounded-2xl bg-stone-50 border-none text-sm" placeholder="اكتب وصف المنتج بالعربية..." />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Prix (MAD)</Label>
                        <Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="rounded-2xl border-stone-100 h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Collection</Label>
                        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-12 rounded-2xl border-stone-100 bg-white px-4 text-xs font-bold">
                          <option value="">Sélectionner</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-2"><Video className="w-3 h-3" /> Source Vidéo (Lien mixte)</Label>
                      <Input placeholder="URL MP4, YouTube, ou autre..." value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-2xl bg-stone-50 border-none h-12" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Image de Couverture (URL)</Label>
                      <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-2xl border-stone-100 h-12" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 bg-stone-900 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] shadow-lg hover:bg-amber-800 transition-colors">
                  {loading ? 'Traitement...' : 'Enregistrer dans la Boutique'}
                </Button>
              </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg space-y-6">
              <h2 className="font-serif italic text-xl flex items-center gap-2"><LayoutGrid className="w-5 h-5" /> {editingCatId ? 'Modifier Collection' : 'Nouvelle Collection'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Nom (ex: Décorations)" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="rounded-xl h-12" />
                <div className="flex gap-2">
                  <Input placeholder="Image URL (Icone)" value={catForm.image_url} onChange={e => setCatForm({...catForm, image_url: e.target.value})} className="rounded-xl h-12 flex-1" />
                  <Button onClick={handleCategorySubmit} className="bg-stone-900 h-12 rounded-xl px-6">
                    {editingCatId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-50 shadow-sm group hover:border-amber-100 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={c.image_url || "/placeholder.svg"} className="w-12 h-12 rounded-full object-cover border border-stone-100 shadow-inner" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">{c.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full text-stone-300 hover:text-amber-600" onClick={() => { setCatForm({ name: c.name, image_url: c.image_url }); setEditingCatId(c.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Pencil className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-stone-300 hover:text-red-400" onClick={() => { if(confirm('Supprimer cette collection?')) supabase.from("categories").delete().eq("id", c.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
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
