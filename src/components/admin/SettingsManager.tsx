'use client'

import { useState } from 'react'
import { AdminSettings } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Store, Phone, MapPin, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

interface SettingsManagerProps {
  settings: AdminSettings
  onUpdate: (settings: AdminSettings) => void
}

export default function SettingsManager({ settings, onUpdate }: SettingsManagerProps) {
  const [formData, setFormData] = useState<AdminSettings>({
    ...settings,
    storeHours: settings.storeHours || { open: '', close: '', days: [] }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      onUpdate(formData)
    } catch (error) {
      toast.error('Failed to update settings')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof AdminSettings, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Store Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <Input
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business Phone</label>
                <Input
                  value={formData.businessPhone}
                  onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Business Email</label>
                <Input
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Business Address</label>
              <Input
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Communication Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
              <Input
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="2348000000000"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the WhatsApp number (with country code) for order notifications
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Financial Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shipping Fee (₦)</label>
              <Input
                type="number"
                min="0"
                value={formData.shippingFee}
                onChange={(e) => handleInputChange('shippingFee', parseFloat(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Store Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Store Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Return Policy</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
                value={formData.returnPolicy}
                onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
                placeholder="Enter your return policy..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shipping Policy</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
                value={formData.shippingPolicy}
                onChange={(e) => handleInputChange('shippingPolicy', e.target.value)}
                placeholder="Enter your shipping policy..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Privacy Policy</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
                value={formData.privacyPolicy}
                onChange={(e) => handleInputChange('privacyPolicy', e.target.value)}
                placeholder="Enter your privacy policy..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Store Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Store Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Opening Time</label>
                <Input
                  type="time"
                  value={formData.storeHours?.open || ''}
                  onChange={(e) => handleInputChange('storeHours', {
                    ...formData.storeHours as string | any,
                    open: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Closing Time</label>
                <Input
                  type="time"
                  value={formData.storeHours?.close || ''}
                  onChange={(e) => handleInputChange('storeHours', {
                    ...formData.storeHours as string | any,
                    close: e.target.value
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Operating Days</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="flex items-center">
                    {/* <input
                      type="checkbox"
                      checked={formData.storeHours.days.includes(day)} 
                      onChange={(e) => {
                        const days = e.target.checked
                          ? [...formData.storeHours.days, day]
                          : formData.storeHours.days.filter((d: string) => d !== day)
                        handleInputChange('storeHours', {
                          ...formData.storeHours,
                          days
                        })
                      }}
                      className="mr-2"
                    /> */}
                    <input
                      type="checkbox"
                      checked={formData.storeHours?.days?.includes(day) ?? false}
                      onChange={(e) => {
                        const currentDays = formData.storeHours?.days || []
                        const days = e.target.checked
                          ? [...currentDays, day]
                          : currentDays.filter((d: string) => d !== day)

    handleInputChange('storeHours', {
      ...formData.storeHours?.days && { ...formData.storeHours as string | any },
      days
    })
  }}
  className="mr-2"
/>

                    {day}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  )
}