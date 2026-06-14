import { useState, useRef } from 'react'

export const CAT_STYLE = {
  '伏特加': { gradient: 'linear-gradient(135deg,#667eea,#764ba2)', emoji: '🧊' },
  '金酒':   { gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', emoji: '🌿' },
  '朗姆':   { gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', emoji: '🌊' },
  '龙舌兰': { gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', emoji: '🌵' },
  '威士忌': { gradient: 'linear-gradient(135deg,#fa709a,#fee140)', emoji: '🥃' },
  '特调':   { gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', emoji: '✨' },
}

export default function MenuPage({ wines, categories, setWines, setOrders }) {
  const [cat, setCat] = useState(categories[0])
  const [detail, setDetail] = useState(null)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [name, setName] = useState('')
  const [table, setTable] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [rollLabel, setRollLabel] = useState('🎲 随机选酒')
  const timerRef = useRef(null)

  const list = wines.filter(w => w.category === cat)
  const totalQty = cart.reduce((s, i) => s + i.qty, 0)

  const add = (wine) => setCart(p => {
    const ex = p.find(i => i.id === wine.id)
    return ex ? p.map(i => i.id === wine.id ? { ...i, qty: i.qty + 1 } : i) : [...p, { ...wine, qty: 1 }]
  })

  const sub = (id) => setCart(p => {
    const ex = p.find(i => i.id === id)
    return ex.qty === 1 ? p.filter(i => i.id !== id) : p.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
  })

  const randomPick = () => {
    if (!wines.length || rolling) return
    setRolling(true)
    let count = 0
    timerRef.current = setInterval(() => {
      const r = wines[Math.floor(Math.random() * wines.length)]
      setRollLabel(`🎲 ${r.name}`)
      count++
      if (count >= 14) {
        clearInterval(timerRef.current)
        const pick = wines[Math.floor(Math.random() * wines.length)]
        setRollLabel(`🎉 ${pick.name}！`)
        add(pick)
        setTimeout(() => {
          setRolling(false)
          setRollLabel('🎲 随机选酒')
          setCartOpen(true)
        }, 900)
      }
    }, 70)
  }

  const submit = () => {
    if (!name.trim()) return alert('请输入您的姓名')
    const order = {
      id: Date.now().toString(),
      customerName: name, tableNo: table, note,
      items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, category: i.category })),
      status: 'pending',
      timestamp: new Date().toLocaleString('zh-CN')
    }
    setOrders(p => [order, ...p])
    setWines(p => p.map(w => {
      const c = cart.find(i => i.id === w.id)
      return c ? { ...w, sales: (w.sales || 0) + c.qty } : w
    }))
    setCart([])
    setName(''); setTable(''); setNote('')
    setSubmitted(true)
  }

  const closeCart = () => { setCartOpen(false); setSubmitted(false) }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🍸 精品酒单</h1>
        <p className="page-sub">点击 + 加入订单，或试试随机选酒</p>
      </div>

      <div className="menu-top">
        <button className={`btn-random ${rolling ? 'rolling' : ''}`} onClick={randomPick} disabled={rolling}>
          {rollLabel}
        </button>
        <div className="cat-tabs">
          {categories.map(c => (
            <button key={c} className={`cat-tab ${cat === c ? 'active' : ''}`}
              style={cat === c ? { background: CAT_STYLE[c]?.gradient } : {}}
              onClick={() => setCat(c)}>
              {CAT_STYLE[c]?.emoji} {c}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0
        ? <div className="empty">该分类暂无酒品<br />请在「管理酒单」中添加</div>
        : <div className="wine-grid">
            {list.map(w => {
              const ci = cart.find(i => i.id === w.id)
              return (
                <div key={w.id} className="wine-card">
                  <div className="wine-img" style={{ background: CAT_STYLE[w.category]?.gradient }}
                    onClick={() => setDetail(w)}>
                    {w.image ? <img src={w.image} alt={w.name} /> : <span className="wine-emoji">{CAT_STYLE[w.category]?.emoji}</span>}
                  </div>
                  <div className="wine-body">
                    <h3 onClick={() => setDetail(w)}>{w.name}</h3>
                    <p className="wine-desc" onClick={() => setDetail(w)}>{w.description}</p>
                    <div className="wine-foot">
                      <span className="sales">销量 {w.sales || 0}</span>
                      {ci ? (
                        <div className="mini-qty">
                          <button onClick={() => sub(w.id)}>−</button>
                          <span>{ci.qty}</span>
                          <button onClick={() => add(w)}>+</button>
                        </div>
                      ) : (
                        <button className="btn-plus" onClick={() => add(w)}>+</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
      }

      {/* Floating cart button */}
      {totalQty > 0 && !cartOpen && (
        <button className="cart-fab" onClick={() => setCartOpen(true)}>
          🛒 {totalQty} 杯 · 去结单
        </button>
      )}

      {/* Cart bottom drawer */}
      {cartOpen && (
        <div className="cart-overlay" onClick={closeCart}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="cart-success">
                <span>🎉</span>
                <h3>订单已提交！</h3>
                <p>稍候为您准备～</p>
                <button className="btn-pink" onClick={closeCart}>好的</button>
              </div>
            ) : (
              <>
                <div className="cart-handle" />
                <div className="cart-head">
                  <h3>🛒 我的订单</h3>
                  <button className="cart-x" onClick={closeCart}>✕</button>
                </div>
                <div className="cart-items-list">
                  {cart.map(i => (
                    <div key={i.id} className="ci-row">
                      <span className="ci-name">{i.name}</span>
                      <div className="mini-qty">
                        <button onClick={() => sub(i.id)}>−</button>
                        <span>{i.qty}</span>
                        <button onClick={() => add(i)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-divider" />
                <div className="cart-form">
                  <input placeholder="您的姓名 *" value={name} onChange={e => setName(e.target.value)} />
                  <input placeholder="桌号（可选）" value={table} onChange={e => setTable(e.target.value)} />
                  <textarea rows={2} placeholder="备注，如：不加冰" value={note} onChange={e => setNote(e.target.value)} />
                </div>
                <button className="btn-submit" onClick={submit}>提交订单（{totalQty} 杯）</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="modal-bg" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setDetail(null)}>✕</button>
            <div className="modal-img" style={{ background: CAT_STYLE[detail.category]?.gradient }}>
              {detail.image ? <img src={detail.image} alt={detail.name} /> : <span>{CAT_STYLE[detail.category]?.emoji}</span>}
            </div>
            <div className="modal-body">
              <h2>{detail.name}</h2>
              <p className="modal-cat">{detail.category}</p>
              <p className="modal-desc">{detail.description}</p>
              {detail.steps && (
                <div className="modal-steps">
                  <h4>🔬 制作步骤</h4>
                  <pre>{detail.steps}</pre>
                </div>
              )}
              <button className="btn-pink" style={{ width: '100%', marginTop: 8 }}
                onClick={() => { add(detail); setDetail(null) }}>
                + 加入订单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
