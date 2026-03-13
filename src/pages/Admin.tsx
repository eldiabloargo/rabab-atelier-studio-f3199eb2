import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, Lock, Image as ImageIcon, X, LogOut, Save, Video, LayoutGrid, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  // الحالة الجديدة للصور المتعددة
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const [form, setForm] = useState({
    title: "",
    title_ar: "",
    price: "",
    description: "",
    description_ar: "",
    image_url: "",
    category: "",
    // الخانات الجداد اللي زدنا فـ SQL
    images_gallery: [] as string[],
    video_url: "",
    full_description: "",
    full_description_ar: "",
  });

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

  useEffect(() => {
    if (session) fetchAll();
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
    if (error) toast({ title: "خطأ", description: "Email ou mot de passe incorrect", variant: "destructive" });
    setLoading(false);
  };

  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setForm({ ...form, images_gallery: [...form.images_gallery, newGalleryUrl.trim()] });
      setNewGalleryUrl("");
      toast({ title: "Ajouté", description: "Image ajoutée au catalogue" });
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = form.images_gallery.filter((_, i) => i !== index);
    setForm({ ...form, images_gallery: newGallery });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { ...form, title: form.title.trim() };
    const { error } = editingId 
      ? await supabase.from("products").update(productData).eq("id", editingId)
      : await supabase.from("products").insert([productData]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès ✓", description: "Produit enregistré avec succès" });
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchAll();
    }
  };

  const resetForm = () => {
    setForm({
      title: "", title_ar: "", price: "", description: "", description_ar: "", 
      image_url: "", category: "", images_gallery: [], video_url: "", 
      full_description: "", full_description_ar: ""
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
          <div className="text-center">
            <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-amber-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800">Admin Studio</h1>
            <p className="text-stone-500 text-sm mt-1">Connectez-vous pour gérer l'Atelier</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input className="rounded-xl border-stone-200" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input className="rounded-xl border-stone-200" type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" disabled={loading} className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-xl py-6 transition-all">
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen bg-[#fafaf9] font-sans text-stone-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rabab Atelier <span className="text-amber-600">Dashboard</span></h1>
          <p className="text-stone-500 text-sm">Gérez votre boutique de luxe</p>
        </div>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="hover:bg-red-50 text-red-500 rounded-xl">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-stone-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab("products")} 
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "products" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}
        >
          <LayoutGrid className="inline-block mr-2 w-4 h-4" /> Produits
        </button>
        <button 
          onClick={() => setActiveTab("categories")} 
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "categories" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}
        >
          <Plus className="inline-block mr-2 w-4 h-4" /> Catégories
        </button>
      </div>

      {activeTab === "products" && (
        <div className="space-y-8">
          {!showForm ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={() => setShowForm(true)} className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-2xl py-8 shadow-lg shadow-stone-200 flex flex-col gap-1 transition-all">
                <Plus className="w-6 h-6" />
                <span className="text-lg">Ajouter un nouveau chef-d'œuvre</span>
              </Button>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              onSubmit={handleSubmit} 
              className="p-6 md:p-10 border-none rounded-3xl bg-white space-y-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b pb-6">
                <h2 className="text-2xl font-bold text-stone-800">{editingId ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-stone-100" onClick={() => {setShowForm(false); setEditingId(null); resetForm();}}><X /></Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Section Info Base */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-stone-600 font-semibold">Titre (FR)</Label>
                    <Input className="rounded-xl border-stone-200 p-6 focus:ring-amber-500" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block text-stone-600 font-semibold">العنوان (AR)</Label>
                    <Input dir="rtl" className="rounded-xl border-stone-200 p-6 text-right font-arabic" value={form.title_ar} onChange={(e) => setForm({...form, title_ar: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-stone-600 font-semibold">Prix (DH)</Label>
                      <Input className="rounded-xl border-stone-200 p-6" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="200 DH" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-stone-600 font-semibold">Catégorie</Label>
                      <select className="w-full h-[54px] rounded-xl border border-stone-200 bg-white px-4 focus:ring-2 focus:ring-amber-500 outline-none" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                        <option value="">Sélectionner</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section Media */}
                <div className="space-y-6 bg-stone-50 p-6 rounded-2xl border border-stone-100">
                  <div className="space-y-2">
                    <Label className="text-stone-600 font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4 text-amber-600" /> Image Principale</Label>
                    <Input className="rounded-xl border-stone-200 bg-white" value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
                  </div>

                  {/* Gallery Multi-images */}
                  <div className="space-y-2">
                    <Label className="text-stone-600 font-semibold flex items-center gap-2"><Plus className="w-4 h-4 text-amber-600" /> Galerie Photos</Label>
                    <div className="flex gap-2">
                      <Input className="rounded-xl border-stone-200 bg-white" value={newGalleryUrl} onChange={(e) => setNewGalleryUrl(e.target.value)} placeholder="URL de l'image..." />
                      <Button type="button" onClick={addGalleryImage} className="bg-stone-800 text-white rounded-xl px-4">+</Button>
                    </div>
                    {/* Preview Gallery */}
                    <div className="flex gap-2 overflow-x-auto py-2">
                      <AnimatePresence>
                        {form.images_gallery.map((img, idx) => (
                          <motion.div key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative min-w-[60px] h-[60px] rounded-lg overflow-hidden border">
                            <img src={img} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-1"><X className="w-3 h-3" /></button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-stone-600 font-semibold flex items-center gap-2"><Video className="w-4 h-4 text-amber-600" /> URL Vidéo (MP4/Youtube)</Label>
                    <Input className="rounded-xl border-stone-200 bg-white" value={form.video_url} onChange={(e) => setForm({...form, video_url: e.target.value})} placeholder="https://..." />
                  </div>
                </div>

                {/* Section Descriptions */}
                <div className="md:col-span-2 space-y-6">
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-stone-600 font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Description Courte (FR)</Label>
                        <Textarea className="rounded-xl border-stone-200 min-h-[100px]" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-right block text-stone-600 font-semibold font-arabic">الوصف المختصر (AR)</Label>
                        <Textarea dir="rtl" className="rounded-xl border-stone-200 min-h-[100px] text-right font-arabic" value={form.description_ar} onChange={(e) => setForm({...form, description_ar: e.target.value})} />
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-4 border-t pt-6">
                      <div className="space-y-2">
                        <Label className="text-stone-600 font-semibold">Détails Complets / Specs (FR)</Label>
                        <Textarea className="rounded-xl border-stone-200 min-h-[150px] bg-stone-50" value={form.full_description} onChange={(e) => setForm({...form, full_description: e.target.value})} placeholder="Matériaux, dimensions, entretien..." />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-right block text-stone-600 font-semibold font-arabic">التفاصيل الكاملة للمنتج (AR)</Label>
                        <Textarea dir="rtl" className="rounded-xl border-stone-200 min-h-[150px] bg-stone-50 text-right font-arabic" value={form.full_description_ar} onChange={(e) => setForm({...form, full_description_ar: e.target.value})} placeholder="المواد، القياسات، العناية بالمنتج..." />
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-2xl py-8 text-lg font-bold transition-all shadow-xl shadow-stone-200">
                  <Save className="mr-3 w-6 h-6" /> Enregistrer le produit
                </Button>
              </div>
            </motion.form>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((p) => (
                <motion.div 
                  layout
                  key={p.id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="p-3 border-none rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                    <img src={p.image_url || "/placeholder.svg"} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="secondary" size="sm" className="h-8 w-8 p-0 rounded-full bg-white/90" onClick={() => {setEditingId(p.id); setForm(p); setShowForm(true); window.scrollTo({top: 0, behavior: 'smooth'});}}><Pencil className="w-3 h-3 text-stone-700" /></Button>
                       <Button variant="destructive" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={async () => { if(confirm('Supprimer?')) { await supabase.from("products").delete().eq("id", p.id); fetchAll(); } }}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <h3 className="font-bold text-stone-800 truncate px-1">{p.title}</h3>
                  <p className="text-sm text-amber-600 font-semibold px-1">{p.price || "Sur demande"}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Categories Tab ... (نفس الشيء، غادي يكون فيه تحسين UI) */}
      {activeTab === "categories" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <Label className="mb-2 block font-semibold">Ajouter une nouvelle catégorie</Label>
              <div className="flex gap-3">
                <Input className="rounded-xl border-stone-200 p-6" placeholder="Ex: Décoration, Box..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                <Button onClick={async () => { if(newCategoryName) { await supabase.from("categories").insert({name: newCategoryName}); setNewCategoryName(""); fetchAll(); toast({title: "Succès ✓"}); } }} className="bg-stone-900 text-white px-8 rounded-xl transition-all">Ajouter</Button>
              </div>
           </div>
           
           <div className="grid gap-3">
              {categories.map(c => (
                 <motion.div layout key={c.id} className="flex justify-between items-center p-4 bg-white border border-stone-100 rounded-2xl shadow-sm hover:border-amber-200 transition-all">
                    <span className="font-semibold text-stone-700 ml-2">{c.name}</span>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={async () => { if(confirm('Supprimer la catégorie?')) { await supabase.from("categories").delete().eq("id", c.id); fetchAll(); } }}><Trash2 className="w-4 h-4" /></Button>
                 </motion.div>
              ))}
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default Admin;
