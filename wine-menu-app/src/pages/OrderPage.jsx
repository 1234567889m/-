import { useState } from 'react'
import { CAT_STYLE } from './MenuPage'

export default function OrderPage({ wines, categories, setWines, setOrders, onSuccess }) {
  const [cat, setCat] = useState(categories[0])
  const [cart, setCart] = useState([])
  const [name, setName] = useState('')
  const [table, setTable] = useState('')
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)

  const list = wines.filter(w => w.category === cat)

  const add = (w) => setCart(prev => {
    const ex = prev.find(i => i.id === w.id)
    return ex ? prev.map(i => i.id === w.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...w, qty: 1 }]
  })

  const sub = (id) => setCart(prev => {
    const ex = prev.find(i => i.id === id)
    return ex.qty === 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
  })

  const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.qty, 0)

  const submit = () => {
    if (!cart.length) return alert('请至少选择一个酒品')
    if (!name.trim()) return alert('请输入您的姓名')
    const order = {
      id: Date.now().toString(),
      customerName: name, tableNo: table, note,
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, category: i.category })),
      total: total.toFixed(2), status: 'pending',
      timestamp: new Date().toLocaleString('zh-CN')
    }
    setOrders(p => [order, ...p])
    setWines(p => p.map(w => {
      const c = cart.find(i => i.id === w.id)
      return c ? { ...w, sales: (w.sales || 0) + c.qty } : w
    }))
    setDone(true)
  }

  const reset = () => { setDone(false); setCart([]); setName(''); setTable(''); setNote('') }

  if (done) return (
    <div className="page success-page">
      <div className="success-icon">🎉</div>
      <h2>订单已提交！</h2>
      <p>我们正在为您准备，请稍候～</p>
      <button className="btn-pink" onClick={onSuccess}>查看我的订单</button>
      <button className="btn-ghost" onClick={reset}>继续点单</button>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📋 点单</h1>
        <p className="page-sub">选择您喜欢的酒品</p>
      </div>

      <div className="order-layout">
        <div className="order-left">
          <div className="cat-tabs">
            {categories.map(c => (
              <button key={c} className={`cat-tab ${cat === c ? 'active' : ''}`}
                style={cat === c ? { background: CAT_STYLE[c]?.gradient } : {}}
                onClick={() => setCat(c)}>
                {CAT_STYLE[c]?.emoji} {c}
              </button>
            ))}
          </div>
          <div className="wine-rows">
            {list.map(w => {
              const ci = cart.find(i => i.id === w.id)
              return (
                <div key={w.id} className="wine-row">
                  <div className="row-img" style={{ background: CAT_STYLE[w.category]?.gradient }}>
                    {w.image ? <img src={w.image} alt={w.name} /> : CAT_STYLE[w.category]?.emoji}
                  </div>
                  <div className="row-info">
                    <h4>{w.name}</h4>
                    <span className="price">¥{w.price}</span>
                  </div>
                  <div className="qty-ctrl">
                    {ci ? (
                      <>
                        <button className="qty-btn minus" onClick={() => sub(w.id)}>−</button>
                        <span className="qty-n">{ci.qty}</span>
                        <button className="qty-btn plus" onClick={() => add(w)}>+</button>
                      </>
                    ) : (
                      <button className="qty-btn add" onClick={() => add(w)}>+ 加入</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="order-right">
          <div className="cart-box">
            <h3>🛒 购物车</h3>
            {cart.length === 0
              ? <p className="cart-empty">还没有选择酒品</p>
              : <>
                  {cart.map(i => (
                    <div key={i.id} className="cart-row">
                      <span>{i.name} ×{i.qty}</span>
                      <span className="price">¥{(parseFloat(i.price) * i.qty).toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="cart-total">合计: <strong>¥{total.toFixed(0)}</strong></div>
                </>
            }
            <div className="cust-form">
              <input placeholder="您的姓名 *" value={name} onChange={e => setName(e.target.value)} />
              <input placeholder="桌号（可选）" value={table} onChange={e => setTable(e.target.value)} />
              <textarea placeholder="备注，如：不加冰" rows={2} value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <button className="btn-submit" onClick={submit} disabled={!cart.length}>
              提交订单 {cart.length > 0 ? `(¥${total.toFixed(0)})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
