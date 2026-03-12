import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, Lock, Image as ImageIcon, X, ChevronDown, Tag, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  title: string;
  title_ar: string | null;
  price: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string | null;
  category: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface ProductForm {
  title: string;
  title_ar: string;
  price: string;
  description: string;
  description_ar: string;
  image_url: string;
  category: string;
}

const emptyForm: ProductForm = {
  title: "",
  title_ar: "",
  price: "",
  description: "",
  description_ar: "",
  image_url: "",
  category: "",
};

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [newCategoryName, setNewCategoryName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // التحقق من الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setProducts((data as unknown as Product[]) || []);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setCategories((data as unknown as Category[]) || []);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchCategories()]);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchAll();
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({ title: "Erreur de connexion", description: "Email ou mot de passe incorrect", variant: "destructive" });
    } else {
      toast({ title: "Bienvenue, Hamza !" });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Déconnecté" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Erreur d'upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Le titre est requis", variant: "destructive" });
      return;
    }

    const productData = {
      title: form.title.trim(),
      title_ar: form.title_ar.trim() || null,
      price: form.price.trim() || null,
      description: form.description.trim() || null,
      description_ar: form.description_ar.trim() || null,
      image_url: form.image_url.trim() || null,
      category: form.category || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);
      if (error) {
        toast({ title: "Erreur RLS", description: "Vérifiez vos permissions Supabase", variant: "destructive" });
        return;
      }
      toast({ title: "Produit modifié ✓" });
    } else {
      const { error } = await supabase.from("products").insert(productData);
      if (error) {
        toast({ title: "Erreur RLS", description: "Désactivez RLS ou ajoutez une Policy", variant: "destructive" });
        return;
      }
      toast({ title: "Produit ajouté ✓" });
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title,
      title_ar: product.title_ar || "",
      price: product.price || "",
      description: product.description || "",
      description_ar: product.description_ar || "",
      image_url: product.image_url || "",
      category: product.category || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Produit supprimé" });
    fetchProducts();
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    const { error } = await supabase.from("categories").insert({ name });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Catégorie ajoutée ✓" });
    setNewCategoryName("");
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `"${name}" supprimée` });
    fetchCategories();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-10">
            <Lock className="w-8 h-8 mx-auto mb-4 text-gold" />
            <h1 className="text-2xl font-serif text-gold-gradient">Connexion Admin</h1>
            <p className="text-sm text-muted-foreground mt-2">Accès sécurisé Supabase</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-dark text-white">
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-serif text-gold-gradient">Espace Admin</h1>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.location.href = "/"}>Site</Button>
            <Button size="sm" variant="ghost" onClick={handleLogout} className="text-destructive"><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-4">
        <div className="flex gap-2 mb-6">
          <Button variant={activeTab === "products" ? "default" : "outline"} className={`flex-1 ${activeTab === "products" ? "bg-gold text-white" : ""}`} onClick={() => setActiveTab("products")}>Produits</Button>
          <Button variant={activeTab === "categories" ? "default" : "outline"} className={`flex-1 ${activeTab === "categories" ? "bg-gold text-white" : ""}`} onClick={() => setActiveTab("categories")}>Catégories</Button>
        </div>

        {activeTab === "categories" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nouvelle catégorie" />
              <Button onClick={handleAddCategory} className="bg-gold text-white"><Plus /></Button>
            </div>
            {categories.map(cat => (
              <div key={cat.id} className="flex justify-between p-3 border rounded-lg bg-card">
                <span>{cat.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id, cat.name)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "products" && (
          <div>
            {!showForm && <Button onClick={() => setShowForm(true)} className="w-full bg-gold text-white mb-6"><Plus className="mr-2" /> Ajouter un produit</Button>}
            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border rounded-lg">
                <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Titre (FR)" required />
                <Input value={form.title_ar} onChange={(e) => setForm({...form, title_ar: e.target.value})} placeholder="Titre (AR)" dir="rtl" />
                <Input value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="Prix (ex: 2500 MAD)" />
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full p-2 border rounded-lg bg-background">
                  <option value="">Choisir une catégorie</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description (FR)" />
                <Textarea value={form.description_ar} onChange={(e) => setForm({...form, description_ar: e.target.value})} placeholder="Description (AR)" dir="rtl" />
                <div className="flex gap-2">
                  <Input value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} placeholder="URL Image" className="flex-1" />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><ImageIcon /></Button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageUpload} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-gold text-white">Enregistrer</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
                </div>
              </form>
            )}
            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-3 border rounded-lg luxury-card">
                  <img src={p.image_url || ""} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">{p.category} • {p.price}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
