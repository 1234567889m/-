import { useState, useEffect } from 'react'
import MenuPage from './pages/MenuPage'
import OrderPage from './pages/OrderPage'
import OrdersPage from './pages/OrdersPage'
import ManagePage from './pages/ManagePage'
import './App.css'

const DEFAULT_WINES = [
  { id: '1', name: '莫斯科骡子', category: '伏特加', price: '68', description: '清爽的姜汁啤酒与伏特加完美融合，加入青柠的酸爽', steps: '1. 铜杯中加入冰块\n2. 倒入45ml伏特加\n3. 挤入半个青柠汁\n4. 填满姜汁啤酒\n5. 薄荷叶和青柠片装饰', image: null, sales: 0 },
  { id: '2', name: '新加坡司令', category: '金酒', price: '75', description: '热带风情的经典鸡尾酒，色泽艳丽', steps: '1. 摇酒壶中加入冰块\n2. 倒入45ml金酒\n3. 加入15ml樱桃白兰地\n4. 加入120ml菠萝汁\n5. 摇匀过滤入高球杯\n6. 樱桃和菠萝片装饰', image: null, sales: 0 },
  { id: '3', name: '自由古巴', category: '朗姆', price: '58', description: '朗姆酒与可乐的经典组合，简单美味', steps: '1. 高球杯加满冰块\n2. 倒入45ml白朗姆\n3. 挤入1/4个青柠汁\n4. 填满可乐\n5. 青柠角装饰', image: null, sales: 0 },
  { id: '4', name: '玛格丽特', category: '龙舌兰', price: '72', description: '墨西哥经典，盐边杯口，酸甜平衡', steps: '1. 杯口用青柠润湿后蘸盐\n2. 摇酒壶加冰\n3. 倒入45ml龙舌兰\n4. 加入25ml君度\n5. 挤入30ml青柠汁\n6. 摇匀过滤', image: null, sales: 0 },
  { id: '5', name: '威士忌酸', category: '威士忌', price: '85', description: '经典酸味鸡尾酒，蛋清带来丝滑口感', steps: '1. 摇酒壶干摇所有材料（不加冰）\n2. 加冰后再次摇匀\n3. 过滤入岩石杯\n4. 橙片和樱桃装饰', image: null, sales: 0 },
  { id: '6', name: '招牌特调', category: '特调', price: '88', description: '调酒师精心创作，每日限量供应', steps: '1. 询问调酒师当日特调\n2. 按照调酒师推荐享用', image: null, sales: 0 },
]

const CATEGORIES = ['伏特加', '金酒', '朗姆', '龙舌兰', '威士忌', '特调']

const NAV = [
  { id: 'menu', label: '酒单', emoji: '🍸' },
  { id: 'order', label: '下订单', emoji: '📋' },
  { id: 'orders', label: '订单管理', emoji: '📊' },
  { id: 'manage', label: '管理酒单', emoji: '⚙️' },
]

export default function App() {
  const [page, setPage] = useState('menu')
  const [open, setOpen] = useState(false)

  const [wines, setWines] = useState(() => {
    const s = localStorage.getItem('bar-wines-v3')
    return s ? JSON.parse(s) : DEFAULT_WINES
  })
  const [orders, setOrders] = useState(() => {
    const s = localStorage.getItem('bar-orders-v3')
    return s ? JSON.parse(s) : []
  })

  useEffect(() => { localStorage.setItem('bar-wines-v3', JSON.stringify(wines)) }, [wines])
  useEffect(() => { localStorage.setItem('bar-orders-v3', JSON.stringify(orders)) }, [orders])

  const pending = orders.filter(o => o.status === 'pending').length

  const go = (p) => { setPage(p); setOpen(false) }

  return (
    <div className="app">
      <button className="hamburger" onClick={() => setOpen(v => !v)}>
        {open ? '✕' : '☰'}
      </button>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">🍹</div>
          <div>
            <h2>Bar Menu</h2>
            <p>精品鸡尾酒</p>
          </div>
        </div>
        <nav className="nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? 'active' : ''}`} onClick={() => go(n.id)}>
              <span className="nav-emoji">{n.emoji}</span>
              <span>{n.label}</span>
              {n.id === 'orders' && pending > 0 && <span className="badge">{pending}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">数据保存在本地浏览器</div>
      </aside>

      <main className="main">
        {page === 'menu' && <MenuPage wines={wines} categories={CATEGORIES} onOrder={() => go('order')} />}
        {page === 'order' && <OrderPage wines={wines} categories={CATEGORIES} setWines={setWines} setOrders={setOrders} onSuccess={() => go('orders')} />}
        {page === 'orders' && <OrdersPage orders={orders} setOrders={setOrders} />}
        {page === 'manage' && <ManagePage wines={wines} setWines={setWines} categories={CATEGORIES} />}
      </main>
    </div>
  )
}
