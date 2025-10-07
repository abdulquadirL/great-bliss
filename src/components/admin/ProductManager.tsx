'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { productStorage, imageStorage } from '@/lib/storage'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ProductManagerProps {
  products: Product[]
  onUpdate: () => void
}

export default function ProductManager({ products, onUpdate }: ProductManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    retailPrice: '',
    wholesalePrice: '',
    minimumWholesaleQuantity: '',
    stockQuantity: '',
    benefits: '',
    ingredients: '',
    featured: false,
    inStock: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      retailPrice: '',
      wholesalePrice: '',
      minimumWholesaleQuantity: '',
      stockQuantity: '',
      benefits: '',
      ingredients: '',
      featured: false,
      inStock: true
    })
    setImageFile(null)
    setImagePreview('')
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      retailPrice: product.retailPrice.toString(),
      wholesalePrice: product.wholesalePrice.toString(),
      minimumWholesaleQuantity: product.minimumWholesaleQuantity.toString(),
      stockQuantity: product.stockQuantity.toString(),
      benefits: product.benefits.join(', '),
      ingredients: product.ingredients.join(', '),
      featured: product.featured || false,
      inStock: product.inStock
    })
    setImagePreview(product.image)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let imageUrl = imagePreview
      
      // Upload new image if selected
      if (imageFile) {
        imageUrl = await imageStorage.save(imageFile)
        // Convert to data URL for display
        const imageData = imageStorage.get(imageUrl)
        if (imageData) {
          imageUrl = imageData
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        retailPrice: parseFloat(formData.retailPrice),
        wholesalePrice: parseFloat(formData.wholesalePrice),
        minimumWholesaleQuantity: parseInt(formData.minimumWholesaleQuantity),
        stockQuantity: parseInt(formData.stockQuantity),
        image: imageUrl,
        images: [imageUrl],
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
        featured: formData.featured,
        inStock: formData.inStock
      }

      if (editingProduct) {
        productStorage.update(editingProduct.id, productData)
        toast.success('Product updated successfully!')
      } else {
        productStorage.add(productData)
        toast.success('Product created successfully!')
      }

      resetForm()
      setIsCreating(false)
      setEditingProduct(null)
      onUpdate()
    } catch (error) {
      toast.error('Failed to save product')
      console.error(error)
    }
  }

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      productStorage.delete(product.id)
      toast.success('Product deleted successfully!')
      onUpdate()
    }
  }

  const handleCancel = () => {
    resetForm()
    setIsCreating(false)
    setEditingProduct(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Product Form */}
      {(isCreating || editingProduct) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Retail Price (₦) *</label>
                  <Input
                    type="number"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({...formData, retailPrice: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Wholesale Price (₦) *</label>
                  <Input
                    type="number"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({...formData, wholesalePrice: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Min. Wholesale Qty *</label>
                  <Input
                    type="number"
                    value={formData.minimumWholesaleQuantity}
                    onChange={(e) => setFormData({...formData, minimumWholesaleQuantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                <Input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <Image src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" width={128} height={128} />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Benefits (comma-separated)</label>
                <Input
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  placeholder="Brightens skin, Reduces dark spots, Anti-aging"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ingredients (comma-separated)</label>
                <Input
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  placeholder="Vitamin C, Hyaluronic Acid, Niacinamide"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="mr-2"
                  />
                  Featured Product
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                    className="mr-2"
                  />
                  In Stock
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Image
                  src={product.image || ""}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                  width={80}
                  height={80}
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm leading-tight">{product.name}</h4>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="p-1"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    {product.featured && <Badge className="text-xs bg-yellow-500">Featured</Badge>}
                    {!product.inStock && <Badge variant="destructive" className="text-xs">Out of Stock</Badge>}
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Retail:</span>
                      <span className="font-medium">{formatPrice(product.retailPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wholesale:</span>
                      <span className="font-medium">{formatPrice(product.wholesalePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span className="font-medium">{product.stockQuantity} units</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found. Create your first product to get started.</p>
        </div>
      )}
    </div>
  )
}