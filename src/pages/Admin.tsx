import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, Lock, Image as ImageIcon, X, ChevronDown, Tag, LogOut } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "settings">("products");
  const [newCategoryName, setNewCategoryName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    title_ar: "",
    price: "",
    description: "",
    description_ar: "",
    image_url: "",
    category: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
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
    
    // هاد السطر هو اللي كيهضر مع سوبابيز
    const { error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password.trim() 
    });

    if (error) {
      toast({ 
        title: "خطأ في الدخول", 
        description: "تأكد من الإيميل والمودباس (rababAT2024)", 
        variant: "destructive" 
      });
    } else {
      toast({ title: "مرحباً بك حمزة", description: "تم تسجيل الدخول بنجاح" });
      // الصفحة غاتريفرشا راسها والـ session غاتبان
    }
    setLoading(false);
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
      toast({ title: "Succès ✓" });
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", title_ar: "", price: "", description: "", description_ar: "", image_url: "", category: "" });
      fetchAll();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <Lock className="mx-auto text-gold mb-2 w-10 h-10" />
            <h1 className="text-2xl font-bold text-gold-gradient">Admin Panel</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-dark text-white">
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10 border-b pb-4">
        <h1 className="text-2xl font-serif text-gold-gradient">Dashboard</h1>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()} className="text-destructive"><LogOut className="w-5 h-5" /></Button>
      </div>

      <div className="flex gap-4 mb-8">
        <Button variant={activeTab === "products" ? "default" : "outline"} onClick={() => setActiveTab("products")} className="flex-1 bg-gold">Produits</Button>
        <Button variant={activeTab === "categories" ? "default" : "outline"} onClick={() => setActiveTab("categories")} className="flex-1">Catégories</Button>
      </div>

      {activeTab === "products" && (
        <div className="space-y-6">
          {!showForm && <Button onClick={() => setShowForm(true)} className="w-full bg-gold text-white shadow-lg"><Plus className="mr-2" /> Ajouter un Produit</Button>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 border rounded-xl luxury-card bg-card">
                <img src={p.image_url || "/placeholder.svg"} className="w-full h-32 object-cover rounded-lg mb-2" />
                <h3 className="font-bold truncate">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{p.price || "Sur demande"}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => {setEditingId(p.id); setForm(p); setShowForm(true);}}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={async () => {await supabase.from("products").delete().eq("id", p.id); fetchAll();}}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-6">
            <Input placeholder="Nom de la catégorie" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            <Button onClick={async () => {await supabase.from("categories").insert({name: newCategoryName}); setNewCategoryName(""); fetchAll();}} className="bg-gold">Ajouter</Button>
          </div>
          {categories.map(c => (
             <div key={c.id} className="flex justify-between p-4 border rounded-lg bg-card">
                <span className="font-medium">{c.name}</span>
                <Button variant="ghost" size="sm" onClick={async () => {await supabase.from("categories").delete().eq("id", c.id); fetchAll();}}><Trash2 className="w-4 h-4 text-destructive" /></Button>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
