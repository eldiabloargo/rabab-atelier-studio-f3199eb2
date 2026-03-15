import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, Pencil, Plus, Lock, Image as ImageIcon, X, 
  LogOut, Save, Video, LayoutGrid, Palette, Settings2, 
  Layers, ExternalLink, ImagePlus
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
  
  // Category State
  const [catForm, setCatForm] = useState({ name: "", image_url: "" });
  
  const { toast } = useToast();

  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newColor, setNewColor] = useState({ name_en: "", name_ar: "", hex: "#000000" });

  const [form, setForm] = useState({
    title: "", title_ar: "", price: "", description: "", description_ar: "",
    image_url: "", category: "", images_gallery: [] as string[],
    video_url: "", colors: [] as any[]
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

  useEffect(() => { if (session) fetchAll(); }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
    if (error) toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    setLoading(false);
  };

  // Gallery Logic
  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setForm({ ...form, images_gallery: [...(form.images_gallery || []), newGalleryUrl.trim()] });
      setNewGalleryUrl("");
      toast({ title: "Image Queued" });
    }
  };

  const removeGalleryImage = (idx: number) => {
    setForm({ ...form, images_gallery: form.images_gallery.filter((_, i) => i !== idx) });
  };

  // Submit Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = editingId 
      ? await supabase.from("products").update(form).eq("id", editingId)
      : await supabase.from("products").insert([form]);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Saved ✓" });
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchAll();
    }
    setLoading(false);
  };

  // Submit Category
  const handleAddCategory = async () => {
    if (!catForm.name) return;
    const { error } = await supabase.from("categories").insert([catForm]);
    if (!error) {
      setCatForm({ name: "", image_url: "" });
      fetchAll();
      toast({ title: "Collection Added" });
    }
  };

  const resetForm = () => {
    setForm({
      title: "", title_ar: "", price: "", description: "", description_ar: "", 
      image_url: "", category: "", images_gallery: [], video_url: "", colors: []
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
          <form onSubmit={handleLogin} className="space-y-4">
            <h1 className="text-2xl font-serif text-center mb-6">Studio Login</h1>
            <Input className="rounded-xl h-12" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input className="rounded-xl h-12" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full h-12 rounded-xl bg-stone-900">Enter Studio</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen font-sans text-stone-900">
      <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-xl font-serif font-bold italic">Atelier Rabab <span className="text-amber-600 not-italic font-sans text-sm font-black uppercase tracking-tighter ml-2 underline decoration-stone-200">Admin</span></h1>
        </div>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="text-red-400 hover:text-red-600"><LogOut className="w-4 h-4" /></Button>
      </header>

      <div className="flex gap-2 mb-8 bg-stone-100 p-1.5 rounded-2xl w-fit">
        <button onClick={() => setActiveTab("products")} className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "products" ? "bg-white shadow-sm" : "text-stone-400"}`}>Inventory</button>
        <button onClick={() => setActiveTab("categories")} className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "categories" ? "bg-white shadow-sm" : "text-stone-400"}`}>Collections</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" ? (
          <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showForm ? (
              <div className="space-y-8">
                <Button onClick={() => setShowForm(true)} className="w-full h-24 bg-white border-2 border-dashed border-stone-200 rounded-3xl text-stone-400 hover:border-stone-900 hover:text-stone-900 transition-all">
                  <Plus className="mr-2" /> Add Piece
                </Button>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-white p-3 rounded-2xl border border-stone-100 group relative">
                      <img src={p.image_url} className="aspect-square object-cover rounded-xl mb-2" />
                      <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity rounded-2xl">
                        <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setForm(p); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3 h-3" /></Button>
                        <Button size="sm" variant="destructive" className="rounded-full" onClick={() => { if(confirm('Delete?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                      <p className="text-[10px] font-bold truncate">{p.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.form onSubmit={handleSubmit} initial={{ y: 20 }} animate={{ y: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-2xl space-y-8 max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Base Information</Label>
                    <Input placeholder="Title (EN)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl h-12" />
                    <Input dir="rtl" placeholder="العنوان (AR)" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="rounded-xl h-12 font-arabic" />
                    <div className="flex gap-4">
                      <Input placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="rounded-xl h-12" />
                      <select className="flex-1 rounded-xl bg-stone-50 border-none px-4 text-xs font-bold" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                        <option value="">Category</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Gallery & Media</Label>
                    <div className="space-y-2">
                      <Input placeholder="Main Image URL" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-xl h-10 text-[10px]" />
                      <div className="flex gap-2">
                        <Input placeholder="Add Gallery Image URL..." value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} className="rounded-xl h-10 text-[10px] bg-amber-50/30 border-amber-100" />
                        <Button type="button" onClick={addGalleryImage} className="bg-stone-900 h-10 w-10 p-0 rounded-xl"><Plus className="w-4 h-4" /></Button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {form.images_gallery?.map((img, i) => (
                          <div key={i} className="relative min-w-[50px] h-[50px]">
                            <img src={img} className="w-full h-full object-cover rounded-lg border" />
                            <button type="button" onClick={() => removeGalleryImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-2 h-2" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Input placeholder="Video URL (Optional)" value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-xl h-10 text-[10px]" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Textarea placeholder="Short Description (EN)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="rounded-2xl min-h-[100px]" />
                  <Textarea dir="rtl" placeholder="الوصف (AR)" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="rounded-2xl min-h-[100px] font-arabic text-right" />
                </div>

                <div className="flex gap-4 border-t pt-6">
                  <Button type="submit" disabled={loading} className="flex-1 h-14 bg-stone-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest"><Save className="mr-2 w-4 h-4" /> Save Masterpiece</Button>
                  <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="h-14 px-8 rounded-2xl text-stone-400">Cancel</Button>
                </div>
              </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Create New Collection</Label>
              <div className="space-y-3">
                <Input placeholder="Collection Name (e.g. Traditional)" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="rounded-xl h-12" />
                <div className="flex gap-3">
                  <Input placeholder="Circle Image URL (Required for Site)" value={catForm.image_url} onChange={e => setCatForm({...catForm, image_url: e.target.value})} className="rounded-xl h-12 flex-1" />
                  <Button onClick={handleAddCategory} className="bg-stone-900 h-12 rounded-xl px-8">Add</Button>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-50 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={c.image_url || "/placeholder.svg"} className="w-12 h-12 rounded-full object-cover border-2 border-stone-100" />
                    <span className="text-sm font-bold uppercase tracking-widest">{c.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-300 hover:text-red-500" onClick={() => { if(confirm('Delete Collection?')) supabase.from("categories").delete().eq("id", c.id).then(fetchAll) }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
