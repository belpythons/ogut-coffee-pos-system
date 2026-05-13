import React from 'react';
import { ShoppingCart, Minus, Plus, Trash2, Banknote, QrCode, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function OrderCart({ 
  cart, 
  orderType, 
  setOrderType, 
  updateQty, 
  removeFromCart, 
  subtotal, 
  tax, 
  totalAmount, 
  paymentMethod, 
  setPaymentMethod, 
  handleCheckout, 
  isCheckingOut 
}) {
  return (
    <aside className="w-96 xl:w-[32rem] flex flex-col z-10 clay-card" style={{borderRadius: 0}}>
      {/* Cart Header */}
      <div className="p-10 pb-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Current Order</h2>
          {cart.length > 0 && (
            <Badge variant="secondary" className="clay-badge bg-secondary">
              {cart.length} Items
            </Badge>
          )}
        </div>

        <Tabs value={orderType} onValueChange={setOrderType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl bg-muted/40 p-1.5 clay-input" style={{padding: '4px', height: '3.5rem'}}>
            <TabsTrigger value="Dine In" className="rounded-xl font-black text-xs uppercase tracking-widest transition-all data-[state=active]:shadow-sm data-[state=active]:bg-white">Dine In</TabsTrigger>
            <TabsTrigger value="Take Away" className="rounded-xl font-black text-xs uppercase tracking-widest transition-all data-[state=active]:shadow-sm data-[state=active]:bg-white">Take Away</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
        {cart.length > 0 ? (
          cart.map(item => (
            <div key={item.id} className="flex items-center gap-5 group animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="h-20 w-20 rounded-[1.25rem] overflow-hidden flex-shrink-0 clay-card" style={{boxShadow: 'none'}}>
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </Card>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground text-sm truncate uppercase tracking-tight leading-none mb-1">{item.name}</h4>
                <p className="text-primary font-black text-sm">
                  Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-2xl clay-input" style={{width: 'fit-content', padding: '6px'}}>
                <Button variant="ghost" size="icon" onClick={() => updateQty(item.id, -1)} className="h-9 w-9 rounded-xl hover:bg-white text-muted-foreground transition-all">
                  <Minus size={14} strokeWidth={3} />
                </Button>
                <span className="w-6 text-center font-black text-xs">{item.qty}</span>
                <Button variant="ghost" size="icon" onClick={() => updateQty(item.id, 1)} className="h-9 w-9 rounded-xl hover:bg-white text-primary transition-all">
                  <Plus size={14} strokeWidth={3} />
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeFromCart(item.id)} 
                className="text-destructive/20 hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground/20 text-center py-20">
            <ShoppingCart size={80} strokeWidth={1} className="mb-6" />
            <p className="text-sm font-black uppercase tracking-[0.2em]">Cart is empty</p>
          </div>
        )}
      </div>

      {/* Footer / Checkout */}
      <div className="p-10 bg-muted/10 border-t border-dashed border-border/50">
        <div className="space-y-4 mb-10">
          <div className="flex justify-between text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            <span>Service Tax (10%)</span>
            <span>Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          <div className="pt-6 border-t border-dashed flex justify-between items-center">
            <span className="font-black text-foreground text-lg uppercase tracking-tighter">Total Amount</span>
            <span className="text-3xl font-black text-primary tracking-tighter">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { id: 'Cash', icon: Banknote, label: 'Cash' },
            { id: 'QRIS', icon: QrCode, label: 'QRIS' },
            { id: 'Debit', icon: CreditCard, label: 'Debit' }
          ].map(method => (
            <Button
              key={method.id}
              variant={paymentMethod === method.id ? "secondary" : "outline"}
              onClick={() => setPaymentMethod(method.id)}
              className={`flex flex-col items-center justify-center gap-2 h-24 clay-button ${
                paymentMethod === method.id ? 'bg-secondary text-primary shadow-none' : 'bg-white hover:bg-muted/10'
              }`}
              style={{borderRadius: '1.5rem'}}
            >
              <method.icon size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{method.label}</span>
            </Button>
          ))}
        </div>

        <Button 
          onClick={handleCheckout}
          disabled={cart.length === 0 || isCheckingOut}
          className="w-full h-20 clay-button-primary text-xl"
          style={{borderRadius: '2rem'}}
        >
          {isCheckingOut ? (
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-white"></div>
          ) : (
            'Confirm Order'
          )}
        </Button>
      </div>
    </aside>
  );
}
