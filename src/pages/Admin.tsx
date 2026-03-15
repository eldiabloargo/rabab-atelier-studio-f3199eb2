import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, Pencil, Plus, Lock, Image as ImageIcon, X, 
  LogOut, Save, Video, LayoutGrid, Palette, ChevronRight, 
  Settings2, PackageSearch 
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
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newColor, setNewColor] = useState({ name_en: "", name_ar: "", hex: "#000000", image_index: 0 });

  const [form, setForm] = useState({
    title: "",
    title_ar: "",
    price: "",
    description: "",
    description_ar: "",
    image_url: "",
    category: "",
    images_gallery: [] as string[],
    video_url: "",
    colors: [] as any[] // السيستيم ديال الألوان اللي خدمنا بيه
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

  // إدارة الصور
  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setForm({ ...form, images_gallery: [...form.images_gallery, newGalleryUrl.trim()] });
      setNewGalleryUrl("");
    }
  };

  // إدارة الألوان (الجديدة)
  const addColor = () => {
    if (newColor.name_en && newColor.hex) {
      setForm({ ...form, colors: [...(form.colors || []), newColor] });
      setNewColor({ name_en: "", name_ar: "", hex: "#000000", image_index: 0 });
    }
  };

  const removeColor = (idx: number) => {
    const updated = (form.colors || []).filter((_, i) => i !== idx);
    setForm({ ...form, colors: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const productData = { ...form, title: form.title.trim() };
    
    const { error } = editingId 
      ? await supabase.from("products").update(productData).eq("id", editingId)
      : await supabase.from("products").insert([productData]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès ✓", description: "Catalogue mis à jour avec élégance" });
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchAll();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      title: "", title_ar: "", price: "", description: "", description_ar: "", 
      image_url: "", category: "", images_gallery: [], video_url: "", colors: []
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100">
          <div className="text-center mb-10">
            <div className="bg-stone-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lock className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-serif text-stone-900 tracking-tighter">Atelier Rabab</h1>
            <p className="text-stone-400 text-xs uppercase tracking-widest mt-2">Private Studio Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input className="h-14 rounded-2xl bg-stone-50 border-none px-6 focus:ring-2 focus:ring-stone-900 transition-all" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input className="h-14 rounded-2xl bg-stone-50 border-none px-6 focus:ring-2 focus:ring-stone-900 transition-all" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" disabled={loading} className="w-full bg-stone-900 hover:bg-stone-800 text-white h-14 rounded-2xl text-xs font-bold uppercase tracking-widest mt-4">
              {loading ? "Authenticating..." : "Enter Studio"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen bg-[#fafaf9] font-sans text-stone-900">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-serif tracking-tighter">Dashboard</h1>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">Curating Excellence</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-full shadow-sm border border-stone-100">
          <div className="px-6 py-2 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-tighter">Live Studio</span>
          </div>
          <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="h-10 w-10 p-0 rounded-full hover:bg-red-50 text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-12">
        {[
          { id: "products", label: "Inventory", icon: <LayoutGrid className="w-4 h-4" /> },
          { id: "categories", label: "Collections", icon: <Settings2 className="w-4 h-4" /> }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-stone-900 text-white shadow-xl scale-105" : "bg-white text-stone-400 hover:text-stone-900 shadow-sm border border-stone-100"}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" ? (
          <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="w-full bg-white border-2 border-dashed border-stone-200 hover:border-stone-900 hover:bg-stone-50 text-stone-400 hover:text-stone-900 rounded-[2.5rem] py-16 flex flex-col gap-4 transition-all group">
                <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Add New Masterpiece</span>
              </Button>
            ) : (
              <motion.form 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleSubmit} 
                className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-stone-100 overflow-hidden"
              >
                <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Left Column: Essential Info */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-8 w-1 bg-amber-600 rounded-full" />
                      <h2 className="text-xl font-serif">Product Identity</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Title (EN)</Label>
                          <Input className="h-14 rounded-2xl bg-stone-50 border-none px-6 focus:ring-1 focus:ring-stone-900" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1 text-right block">العنوان (AR)</Label>
                          <Input dir="rtl" className="h-14 rounded-2xl bg-stone-50 border-none px-6 text-right font-arabic" value={form.title_ar} onChange={(e) => setForm({...form, title_ar: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Price (DH)</Label>
                          <Input className="h-14 rounded-2xl bg-stone-50 border-none px-6" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="250" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Category</Label>
                          <select className="w-full h-14 rounded-2xl bg-stone-50 border-none px-6 appearance-none text-sm" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                            <option value="">Choose...</option>
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Short Story (EN)</Label>
                        <Textarea className="rounded-2xl bg-stone-50 border-none p-6 min-h-[120px] resize-none" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Media & Colors */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-8 w-1 bg-stone-900 rounded-full" />
                      <h2 className="text-xl font-serif">Media & Customization</h2>
                    </div>

                    <div className="space-y-8 bg-stone-50/50 p-8 rounded-[2.5rem] border border-stone-100">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Main Cover URL</Label>
                        <Input className="h-12 rounded-xl bg-white border-stone-100 px-4" value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} />
                      </div>

                      {/* Dynamic Color Palette Management */}
                      <div className="space-y-4">
                        <Label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <Palette className="w-3 h-3" /> Color Options
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Color Name (EN)" className="h-10 rounded-xl bg-white border-stone-100 text-[10px]" value={newColor.name_en} onChange={(e) => setNewColor({...newColor, name_en: e.target.value})} />
                          <div className="flex gap-2">
                            <Input type="color" className="w-12 h-10 p-1 rounded-xl bg-white border-stone-100" value={newColor.hex} onChange={(e) => setNewColor({...newColor, hex: e.target.value})} />
                            <Button type="button" onClick={addColor} className="h-10 bg-stone-900 text-white rounded-xl">+</Button>
                          </div>
                        </div>
                        {/* Preview Colors Added */}
                        <div className="flex flex-wrap gap-3">
                          {form.colors?.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-100 text-[9px] font-bold shadow-sm">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                              {c.name_en}
                              <button type="button" onClick={() => removeColor(i)} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Video Story (MP4 URL)</Label>
                        <Input className="h-12 rounded-xl bg-white border-stone-100 px-4" value={form.video_url} onChange={(e) => setForm({...form, video_url: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-stone-50 border-t border-stone-100 flex flex-col md:flex-row gap-4">
                  <Button type="submit" disabled={loading} className="flex-1 bg-stone-900 hover:bg-stone-800 text-white h-16 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl">
                    <Save className="mr-3 w-4 h-4" /> {editingId ? "Update Masterpiece" : "Publish to Gallery"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => {setShowForm(false); setEditingId(null); resetForm();}} className="px-10 h-16 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Inventory Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <AnimatePresence>
                {products.map((p) => (
                  <motion.div 
                    layout key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="group relative bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all border border-stone-50"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                      <img src={p.image_url || "/placeholder.svg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <Button size="sm" className="h-10 w-10 p-0 rounded-full bg-white text-stone-900 hover:bg-stone-100" onClick={() => {setEditingId(p.id); setForm(p); setShowForm(true); window.scrollTo({top: 0, behavior: 'smooth'});}}><Pencil className="w-3 h-3" /></Button>
                        <Button size="sm" variant="destructive" className="h-10 w-10 p-0 rounded-full" onClick={async () => { if(confirm('Delete this piece?')) { await supabase.from("products").delete().eq("id", p.id); fetchAll(); } }}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                    <div className="px-2">
                      <h3 className="text-[11px] font-bold text-stone-900 truncate tracking-tight">{p.title}</h3>
                      <p className="text-[10px] font-bold text-amber-600 mt-1">{p.price} DH</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div key="categories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-12">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100">
              <h3 className="text-xl font-serif mb-6">Create New Collection</h3>
              <div className="flex gap-4">
                <Input className="h-14 rounded-2xl bg-stone-50 border-none px-6" placeholder="Ex: Ramadan 2026" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                <Button onClick={async () => { if(newCategoryName) { await supabase.from("categories").insert({name: newCategoryName}); setNewCategoryName(""); fetchAll(); toast({title: "Collection Created"}); } }} className="h-14 px-8 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest">Add</Button>
              </div>
            </div>

            <div className="space-y-3">
              {categories.map(c => (
                <div key={c.id} className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-stone-50 shadow-sm hover:border-stone-900 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-[10px] font-bold text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all">
                      {c.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full text-stone-300 hover:text-red-500 hover:bg-red-50" onClick={async () => { if(confirm('Delete Collection?')) { await supabase.from("categories").delete().eq("id", c.id); fetchAll(); } }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
