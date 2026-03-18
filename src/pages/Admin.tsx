import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, X, LogOut, Video, ImageIcon, Palette, LayoutGrid, Layers, ExternalLink } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

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

  // فورم البروداكت كاملة بجميع الخصائص
  const [form, setForm] = useState({
    title: "", title_ar: "", price: "", description: "", description_ar: "",
    image_url: "", category: "", images_gallery: [] as string[],
    video_url: "", colors: [] as { name: string, hex: string }[]
  });

  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#C5A059");
  const { toast } = useToast();

  // 1. إخفاء Navbar و Footer الموقع الأصلي فاش نكونو ف صفحة الأدمن
  useEffect(() => {
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';
    return () => {
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  // 2. التحقق من الجلسة (Login Check)
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

  if (!appReady) return null;

  // واجهة تسجيل الدخول
  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-6">
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleLogin} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-stone-100 w-full max-w-sm space-y-4">
        <div className="text-center space-y-2">
          <h1 className="font-serif italic text-2xl text-stone-900">Atelier Rabab</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Admin Panel</p>
        </div>
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" disabled={loading} className="w-full bg-stone-900 h-12 rounded-xl">Se connecter</Button>
      </motion.form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-6 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header: View Site & Tabs & Logout */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-stone-100 shadow-sm sticky top-4 z-50">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-50 text-stone-500 hover:text-stone-900 transition-all">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Site</span>
          </Link>

          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab("products")} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
              <LayoutGrid className="w-3.5 h-3.5" /> Inventaire
            </button>
            <button onClick={() => setActiveTab("categories")} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
              <Layers className="w-3.5 h-3.5" /> Collections
            </button>
          </div>

          <button onClick={() => supabase.auth.signOut()} className="p-2 text-stone-300 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "products" ? (
            <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!showForm ? (
                 /* Grid تصغير الصور (3 في الموبايل) */
                 <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                   <button onClick={() => { setEditingId(null); setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "", images_gallery: [""], video_url: "", colors: [] }); setShowForm(true); }} className="aspect-[4/5] border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-stone-300 bg-white hover:border-stone-400 transition-all">
                     <Plus className="w-6 h-6 mb-2" />
                     <span className="text-[8px] font-black uppercase tracking-widest">New Art</span>
                   </button>
                   {products?.map(p => (
                     <div key={p.id} className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm group">
                       <img src={p.image_url} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all backdrop-blur-[1px]">
                         <Button size="icon" className="w-8 h-8 rounded-full bg-white text-stone-900" onClick={() => { setForm({...p, images_gallery: p.images_gallery || [""]}); setEditingId(p.id); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                         <Button size="icon" variant="destructive" className="w-8 h-8 rounded-full" onClick={() => { if(confirm('Supprimer?')) supabase.from("products").delete().eq("id", p.id).then(fetchAll) }}><Trash2 className="w-3.5 h-3.5" /></Button>
                       </div>
                       <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-xl"><p className="text-[7px] font-black truncate uppercase text-stone-800 tracking-wider text-center">{p.title}</p></div>
                     </div>
                   ))}
                 </div>
              ) : (
                  /* Form Edition الكامل */
                  <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={async (e) => {
                      e.preventDefault();
                      setLoading(true);
                      const payload = { ...form, images_gallery: form.images_gallery.filter(u => u.trim() !== "") };
                      const { error } = editingId ? await supabase.from("products").update(payload).eq("id", editingId) : await supabase.from("products").insert([payload]);
                      if (!error) { setShowForm(false); setEditingId(null); fetchAll(); toast({ title: "Enregistré" }); }
                      setLoading(false);
                  }} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-2xl space-y-6 max-w-4xl mx-auto">
                      <div className="flex justify-between items-center border-b pb-4">
                          <h2 className="font-serif italic text-xl">Détails de l'œuvre</h2>
                          <button type="button" onClick={() => setShowForm(false)} className="p-2 bg-stone-50 rounded-full"><X className="w-5 h-5 text-stone-400" /></button>
                      </div>

                      {/* FR & AR Fields */}
                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <Label className="text-[8px] font-black uppercase opacity-40">Section Française</Label>
                              <Input placeholder="Titre (FR)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="rounded-xl" />
                              <textarea placeholder="Description (FR)" className="w-full h-28 p-4 rounded-xl bg-stone-50 border-none text-xs" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                          </div>
                          <div className="space-y-4 text-right" dir="rtl">
                              <Label className="text-[8px] font-black uppercase opacity-40">القسم العربي</Label>
                              <Input placeholder="العنوان (AR)" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="rounded-xl" />
                              <textarea placeholder="الوصف (AR)" className="w-full h-28 p-4 rounded-xl bg-stone-50 border-none text-xs" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} />
                          </div>
                      </div>

                      {/* Pricing & Category & Video */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                          <div className="space-y-2"><Label className="text-[8px] font-black uppercase opacity-40">Prix MAD</Label><Input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="rounded-xl font-bold" /></div>
                          <div className="space-y-2">
                              <Label className="text-[8px] font-black uppercase opacity-40">Collection</Label>
                              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-10 rounded-xl bg-stone-50 border-none px-3 text-xs">
                                  <option value="">Choisir</option>
                                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                              </select>
                          </div>
                          <div className="space-y-2"><Label className="text-[8px] font-black uppercase opacity-40 flex items-center gap-1"><Video className="w-3 h-3" /> URL Vidéo</Label><Input value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="rounded-xl" placeholder="Lien MP4" /></div>
                      </div>

                      {/* Gallery Logic (الخانات التلقائية) */}
                      <div className="space-y-4 border-t pt-6">
                          <Label className="text-[8px] font-black uppercase opacity-40 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Galerie Photos</Label>
                          <Input placeholder="Lien Photo Principale" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="rounded-xl border-stone-200" />
                          <div className="grid grid-cols-1 gap-2">
                              {form.images_gallery.map((url, index) => (
                                  <div key={index} className="flex gap-2">
                                      <Input placeholder={`Lien Photo ${index + 1}`} value={url} onChange={e => {
                                          const newG = [...form.images_gallery];
                                          newG[index] = e.target.value;
                                          if (index === form.images_gallery.length - 1 && e.target.value !== "") newG.push("");
                                          setForm({...form, images_gallery: newG});
                                      }} className="rounded-xl bg-stone-50 border-none text-[10px]" />
                                      {index < form.images_gallery.length - 1 && <Button type="button" variant="ghost" className="text-red-400" onClick={() => setForm({...form, images_gallery: form.images_gallery.filter((_, i) => i !== index)})}><Trash2 className="w-4 h-4" /></Button>}
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Colors Section */}
                      <div className="space-y-4 border-t pt-6">
                          <Label className="text-[8px] font-black uppercase opacity-40 flex items-center gap-1"><Palette className="w-3 h-3" /> Couleurs Disponibles</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                              {form.colors?.map((c, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 text-[10px] font-bold">
                                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                                      <span>{c.name}</span>
                                      <X className="w-3 h-3 cursor-pointer text-stone-400" onClick={() => setForm({...form, colors: form.colors.filter((_, i) => i !== idx)})} />
                                  </div>
                              ))}
                          </div>
                          <div className="flex gap-2 items-center bg-stone-50 p-2 rounded-2xl w-fit">
                              <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
                              <Input placeholder="Nom Couleur" value={newColorName} onChange={e => setNewColorName(e.target.value)} className="border-none bg-transparent w-32 text-xs" />
                              <Button type="button" onClick={() => { if(newColorName) { setForm({...form, colors: [...(form.colors || []), {name: newColorName, hex: newColorHex}]}); setNewColorName(""); } }} className="bg-stone-900 rounded-xl"><Plus className="w-4 h-4" /></Button>
                          </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full h-14 bg-stone-900 hover:bg-stone-800 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">Enregistrer l'œuvre</Button>
                  </motion.form>
              )}
            </motion.div>
          ) : (
            /* Collections Section (List & Actions) */
            <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-xl space-y-4">
                <h2 className="font-serif italic text-lg">Nouvelle Collection</h2>
                <div className="grid gap-3">
                    <Input placeholder="Nom de la collection" id="catName" className="rounded-xl" />
                    <Input placeholder="URL Image de couverture" id="catImg" className="rounded-xl" />
                    <Button onClick={async () => {
                        const name = (document.getElementById('catName') as HTMLInputElement).value;
                        const img = (document.getElementById('catImg') as HTMLInputElement).value;
                        if(name) { await supabase.from("categories").insert([{ name, image_url: img }]); fetchAll(); toast({ title: "Collection ajoutée" }); }
                    }} className="bg-stone-900 rounded-xl h-12">Créer la collection</Button>
                </div>
              </div>

              <div className="grid gap-2">
                {categories.map(c => (
                  <div key={c.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm border border-stone-50 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <img src={c.image_url} className="w-12 h-12 rounded-xl object-cover shadow-inner" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-700">{c.name}</span>
                    </div>
                    <Button size="icon" variant="ghost" className="text-stone-300 hover:text-red-500 hover:bg-red-50" onClick={async () => { if(confirm('Supprimer cette collection ?')) { await supabase.from("categories").delete().eq("id", c.id); fetchAll(); } }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
