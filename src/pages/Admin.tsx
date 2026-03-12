import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, Lock, Image as ImageIcon, X, ChevronDown, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_PASSWORD = "rabab2024";
const SESSION_KEY = "rabab_admin_auth";

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
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });
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

  const ensureAnonAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await supabase.auth.signInAnonymously();
    }
  };

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
    if (authenticated) {
      ensureAnonAuth().then(() => fetchAll());
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    } else {
      toast({ title: "Mot de passe incorrect", variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await ensureAnonAuth();

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

    await ensureAnonAuth();

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
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Produit modifié ✓" });
    } else {
      const { error } = await supabase.from("products").insert(productData);
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
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
    await ensureAnonAuth();
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
    if (!name) {
      toast({ title: "Le nom est requis", variant: "destructive" });
      return;
    }

    await ensureAnonAuth();

    const { error } = await supabase.from("categories").insert({ name });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Cette catégorie existe déjà", variant: "destructive" });
      } else {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      }
      return;
    }
    toast({ title: "Catégorie ajoutée ✓" });
    setNewCategoryName("");
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    await ensureAnonAuth();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `"${name}" supprimée` });
    fetchCategories();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-10">
            <Lock className="w-8 h-8 mx-auto mb-4 text-gold" />
            <h1 className="text-2xl font-serif text-gold-gradient">Espace Admin</h1>
            <p className="text-sm text-muted-foreground mt-2">Rabab Atelier</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center rounded-lg"
            />
            <Button type="submit" className="w-full rounded-lg bg-gold hover:bg-gold-dark text-white">
              Entrer
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
          <h1 className="text-lg font-serif text-gold-gradient">Gestion Collection</h1>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg"
            onClick={() => window.location.href = "/"}
          >
            Voir le site
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-6 pt-4">
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            className={`flex-1 rounded-lg gap-2 ${activeTab === "products" ? "bg-gold hover:bg-gold-dark text-white" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <ImageIcon className="w-4 h-4" />
            Produits
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            className={`flex-1 rounded-lg gap-2 ${activeTab === "categories" ? "bg-gold hover:bg-gold-dark text-white" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <Tag className="w-4 h-4" />
            Catégories
          </Button>
        </div>

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nom de la catégorie (ex: Captans)"
                className="flex-1 rounded-lg"
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button
                onClick={handleAddCategory}
                className="rounded-lg bg-gold hover:bg-gold-dark text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
                />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Aucune catégorie.</p>
            ) : (
              <div className="space-y-2">
                {categories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{cat.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showForm && (
              <Button
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                  setShowForm(true);
                }}
                className="w-full h-14 text-base gap-3 mb-8 rounded-lg bg-gold hover:bg-gold-dark text-white"
              >
                <Plus className="w-5 h-5" />
                Ajouter un produit
              </Button>
            )}

            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5 mb-10 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-serif text-foreground">
                      {editingId ? "Modifier le produit" : "Nouveau produit"}
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setForm(emptyForm);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre (FR) *</Label>
                      <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Éclosion" className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title_ar">Titre (AR)</Label>
                      <Input id="title_ar" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} placeholder="مثال: تفتح" dir="rtl" className="rounded-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix (vide = Sur demande)</Label>
                      <Input id="price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Ex: 2 400 MAD" className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <div className="relative">
                        <select
                          id="category"
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-sans appearance-none cursor-pointer"
                        >
                          <option value="">— Choisir —</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (FR)</Label>
                    <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Matériaux, dimensions, usage..." rows={2} className="rounded-lg" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_ar">Description (AR)</Label>
                    <Textarea id="description_ar" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} placeholder="المواد، الأبعاد، الاستخدام..." rows={2} dir="rtl" className="rounded-lg" />
                  </div>

                  <div className="space-y-2">
                    <Label>Image</Label>
                    <div className="flex gap-2">
                      <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Coller un lien image ou uploader ↓" className="flex-1 rounded-lg" />
                      <Button type="button" variant="outline" size="icon" className="rounded-lg" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {uploading && <p className="text-xs text-muted-foreground">Téléchargement en cours...</p>}
                    {form.image_url && (
                      <img src={form.image_url} alt="Aperçu" className="w-full h-40 object-cover luxury-card mt-2" />
                    )}
                  </div>

                  <Button type="submit" className="w-full h-12 rounded-lg bg-gold hover:bg-gold-dark text-white">
                    {editingId ? "Enregistrer les modifications" : "Ajouter à la collection"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="flex justify-center py-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
                />
              </div>
            ) : products.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                Aucun produit pour le moment.
              </p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border border-border luxury-card bg-card"
                  >
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-foreground truncate">{product.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {product.category || "Sans catégorie"} · {product.price || "Sur demande"}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
